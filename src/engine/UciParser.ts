import type { EngineMetrics } from './EngineTypes';

export function parseUciInfo(line: string, currentMetrics: EngineMetrics): EngineMetrics {
  const newMetrics = { ...currentMetrics };
  
  // Example output from stockfish:
  // info depth 10 seldepth 12 multipv 1 score cp 45 nodes 12345 nps 1000000 time 12 pv e2e4 e7e5
  
  const depthMatch = line.match(/depth (\d+)/);
  if (depthMatch) newMetrics.depth = parseInt(depthMatch[1], 10);
  
  const seldepthMatch = line.match(/seldepth (\d+)/);
  if (seldepthMatch) newMetrics.seldepth = parseInt(seldepthMatch[1], 10);
  
  const nodesMatch = line.match(/nodes (\d+)/);
  if (nodesMatch) newMetrics.nodes = parseInt(nodesMatch[1], 10);
  
  const npsMatch = line.match(/nps (\d+)/);
  if (npsMatch) newMetrics.nps = parseInt(npsMatch[1], 10);
  
  const timeMatch = line.match(/time (\d+)/);
  if (timeMatch) newMetrics.time = parseInt(timeMatch[1], 10);
  
  const pvMatch = line.match(/ pv (.+)/);
  if (pvMatch) newMetrics.pv = pvMatch[1].trim().split(' ');
  
  // Score is either centipawns or mate
  // "score cp 100" means +1.00 for the engine's side
  const scoreCpMatch = line.match(/score cp (-?\d+)/);
  if (scoreCpMatch) {
    newMetrics.eval = { type: 'cp', value: parseInt(scoreCpMatch[1], 10) };
  }
  
  // "score mate 3" means mate in 3 for the engine's side
  const scoreMateMatch = line.match(/score mate (-?\d+)/);
  if (scoreMateMatch) {
    newMetrics.eval = { type: 'mate', value: parseInt(scoreMateMatch[1], 10) };
  }
  
  return newMetrics;
}
