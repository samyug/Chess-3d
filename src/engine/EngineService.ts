import type { EngineSettings, EngineMetrics } from './EngineTypes';
import { parseUciInfo } from './UciParser';
import { getOptimizedSettings } from './DifficultyPresets';

type MetricsCallback = (metrics: EngineMetrics) => void;
type BestMoveCallback = (move: string) => void;
type ReadyCallback = () => void;
type ErrorCallback = (err: Error) => void;

export class EngineService {
  private worker: Worker | null = null;
  private currentMetrics: EngineMetrics = this.getDefaultMetrics();
  private metricsListeners: Set<MetricsCallback> = new Set();
  private onBestMove: BestMoveCallback | null = null;
  private onReady: ReadyCallback | null = null;
  private onError: ErrorCallback | null = null;
  private lastMetricsUpdateTime = 0;
  
  public isReady = false;
  public isLoading = false;
  public isThinking = false;
  
  private dispatchDiagnostic(type: string, payload: any) {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('engine-diagnostic', { 
        detail: { type, payload, time: Date.now() } 
      }));
      console.log(`[Engine Diagnostic] ${type}`, payload);
    }
  }

  private getDefaultMetrics(): EngineMetrics {
    return {
      depth: 0,
      seldepth: 0,
      nodes: 0,
      nps: 0,
      time: 0,
      pv: [],
      eval: { type: 'cp', value: 0 },
      bestMove: null,
    };
  }

  public init(onReady?: ReadyCallback, onError?: ErrorCallback) {
    this.dispatchDiagnostic('lifecycle', 'init called');
    // Always update callbacks
    if (onReady) this.onReady = onReady;
    if (onError) this.onError = onError;

    if (this.worker) {
      if (this.isReady && this.onReady) {
        this.dispatchDiagnostic('lifecycle', 'already ready, triggering callback');
        this.onReady();
        this.onReady = null;
      } else {
        this.dispatchDiagnostic('lifecycle', 'worker exists but not ready');
      }
      return;
    }

    this.isLoading = true;
    this.isReady = false;
    this.dispatchDiagnostic('state', { isLoading: true, isReady: false });

    try {
      this.dispatchDiagnostic('lifecycle', 'creating worker');
      this.worker = new Worker('/stockfish.js');
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = (e) => {
        this.dispatchDiagnostic('error', `Worker error: ${e.message}`);
        console.error('Stockfish worker error:', e);
        this.isLoading = false;
        this.dispatchDiagnostic('state', { isLoading: false });
        if (this.onError) this.onError(new Error(e.message));
      };
      // Initialize UCI
      this.sendCommand('uci');
    } catch (e) {
      this.dispatchDiagnostic('error', `Init failed: ${e}`);
      console.error('Failed to initialize Stockfish worker:', e);
      this.isLoading = false;
      if (this.onError) this.onError(e instanceof Error ? e : new Error(String(e)));
    }
  }

  public addMetricsListener(listener: MetricsCallback) {
    this.metricsListeners.add(listener);
    // Immediately fire with current metrics so new subscribers sync instantly
    listener({ ...this.currentMetrics });
    return () => this.metricsListeners.delete(listener);
  }

  public setCallbacks(
    onBestMove: BestMoveCallback
  ) {
    this.onBestMove = onBestMove;
  }

  private sendCommand(cmd: string) {
    if (this.worker) {
      this.dispatchDiagnostic('command', cmd);
      this.worker.postMessage(cmd);
    } else {
      this.dispatchDiagnostic('error', `Failed to send command (no worker): ${cmd}`);
    }
  }

  private handleMessage(e: MessageEvent) {
    const line = e.data;
    if (typeof line !== 'string') return;
    
    // Only log non-info to avoid spam, but dispatch all to diagnostics
    this.dispatchDiagnostic('message', line);

    if (line === 'uciok') {
      this.isReady = true;
      this.isLoading = false;
      this.dispatchDiagnostic('state', { isReady: true, isLoading: false, uciInit: true });
      this.sendCommand('isready');
    } else if (line === 'readyok') {
      this.dispatchDiagnostic('lifecycle', 'readyok received');
      if (this.onReady) {
        this.onReady();
        this.onReady = null; // one-time call
      }
    } else if (line.startsWith('info')) {
      const parsed = parseUciInfo(line, this.currentMetrics);
      
      // Stockfish always reports score from engine's perspective.
      // We will adjust this in the UI layer later based on whose turn it is, 
      // but for absolute PV we just store it.
      this.currentMetrics = parsed;
      
      if (this.metricsListeners.size > 0) {
        const now = Date.now();
        // Throttle UI updates to 15fps (~66ms) to prevent React render locks
        if (now - this.lastMetricsUpdateTime > 66) {
          this.metricsListeners.forEach(listener => listener({ ...this.currentMetrics }));
          this.lastMetricsUpdateTime = now;
        }
      }
    } else if (line.startsWith('bestmove')) {
      this.isThinking = false;
      this.dispatchDiagnostic('state', { isThinking: false });
      const match = line.match(/bestmove\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
      if (match) {
        this.dispatchDiagnostic('bestmove', match[1]);
        this.currentMetrics.bestMove = match[1];
        this.metricsListeners.forEach(listener => listener({ ...this.currentMetrics }));
        if (this.onBestMove) this.onBestMove(match[1]);
      } else {
        this.dispatchDiagnostic('error', `Could not parse bestmove: ${line}`);
      }
    }
  }

  public configure(settings: EngineSettings) {
    const optimized = getOptimizedSettings(settings);
    
    this.sendCommand(`setoption name Skill Level value ${optimized.skillLevel}`);
    this.sendCommand(`setoption name Threads value ${optimized.threads}`);
    this.sendCommand(`setoption name Hash value ${optimized.hashSize}`);
    
    // Adjust UCI_LimitStrength if skill level is below 20 (max)
    if (optimized.skillLevel < 20) {
      this.sendCommand('setoption name UCI_LimitStrength value true');
      // Map skill level 0-20 to Elo 1350-2850 approx
      const elo = Math.max(1350, optimized.skillLevel * 75 + 1350);
      this.sendCommand(`setoption name UCI_Elo value ${elo}`);
    } else {
      this.sendCommand('setoption name UCI_LimitStrength value false');
    }
  }

  public analyze(fen: string) {
    this.dispatchDiagnostic('lifecycle', `analyze called for fen: ${fen}`);
    if (!this.isReady) return;
    this.stop();
    this.isThinking = true;
    this.dispatchDiagnostic('state', { isThinking: true });
    this.currentMetrics = this.getDefaultMetrics();
    this.sendCommand('ucinewgame');
    this.sendCommand(`position fen ${fen}`);
    this.sendCommand('go infinite');
  }

  public findBestMove(fen: string, settings: EngineSettings) {
    this.dispatchDiagnostic('lifecycle', `findBestMove called for fen: ${fen}`);
    if (!this.isReady) {
      this.dispatchDiagnostic('error', 'findBestMove aborted: not ready');
      return;
    }
    this.stop();
    this.isThinking = true;
    this.dispatchDiagnostic('state', { isThinking: true });
    this.currentMetrics = this.getDefaultMetrics();
    
    this.sendCommand(`position fen ${fen}`);
    
    const optimized = getOptimizedSettings(settings);
    this.sendCommand(`go depth ${optimized.depth} movetime ${optimized.moveTime}`);
  }

  public stop() {
    this.dispatchDiagnostic('lifecycle', 'stop called');
    if (!this.isReady) return;
    this.sendCommand('stop');
    this.isThinking = false;
    this.dispatchDiagnostic('state', { isThinking: false });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isReady = false;
      this.isLoading = false;
      this.isThinking = false;
    }
  }
}

export const engineService = new EngineService();
