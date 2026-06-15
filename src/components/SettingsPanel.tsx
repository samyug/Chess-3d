import type { AppSettings } from '../hooks/useSettings';
import { CasualDifficulties } from '../engine/DifficultyPresets';
import { Settings, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import './SettingsPanel.css';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: Partial<AppSettings>) => void;
  onNewGame: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, onNewGame }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) {
    return (
      <button className="settings-toggle glass" onClick={() => setIsOpen(true)}>
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div className="settings-panel glass">
      <div className="settings-header">
        <h3>Game Settings</h3>
        <button onClick={() => setIsOpen(false)} className="close-btn"><X size={18} /></button>
      </div>

      <div className="settings-body">
        <div className="setting-group">
          <label>Mode</label>
          <select 
            value={settings.gameMode} 
            onChange={e => onSettingsChange({ gameMode: e.target.value as any })}
          >
            <option value="HvH">Human vs Human</option>
            <option value="HvC">Human vs Computer</option>
            <option value="CvC">Computer vs Computer</option>
            <option value="Analysis">Analysis Board</option>
          </select>
        </div>

        {settings.gameMode === 'HvC' && (
          <div className="setting-group">
            <label>Play as</label>
            <select 
              value={settings.playerColor} 
              onChange={e => onSettingsChange({ playerColor: e.target.value as any })}
            >
              <option value="w">White</option>
              <option value="b">Black</option>
              <option value="random">Random</option>
            </select>
          </div>
        )}

        {(settings.gameMode === 'HvC' || settings.gameMode === 'CvC') && (
          <div className="setting-group">
            <label>Difficulty</label>
            <select 
              value={settings.useAdvancedSettings ? 'Custom' : settings.difficulty} 
              onChange={e => {
                if (e.target.value === 'Custom') {
                  onSettingsChange({ useAdvancedSettings: true });
                  setShowAdvanced(true);
                } else {
                  onSettingsChange({ difficulty: e.target.value, useAdvancedSettings: false });
                }
              }}
            >
              {Object.keys(CasualDifficulties).map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
              <option value="Custom">Custom (Advanced)</option>
            </select>
          </div>
        )}

        {(settings.gameMode === 'HvC' || settings.gameMode === 'CvC' || settings.gameMode === 'Analysis') && (
          <div className="advanced-settings-wrapper">
            <button 
              className="advanced-toggle" 
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>Advanced Engine Settings</span>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {showAdvanced && (
              <div className="advanced-settings-panel">
                <div className="setting-group checkbox-group mb-3">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={settings.useAdvancedSettings} 
                      onChange={e => onSettingsChange({ useAdvancedSettings: e.target.checked })}
                    />
                    Enable Custom Engine Settings
                  </label>
                </div>
                
                <div className={`advanced-controls ${!settings.useAdvancedSettings ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="setting-group compact">
                    <label>Skill Level (0-20)</label>
                    <input type="number" min="0" max="20" value={settings.advanced.skillLevel} onChange={e => onSettingsChange({ advanced: { ...settings.advanced, skillLevel: Number(e.target.value) }})} />
                  </div>
                  <div className="setting-group compact">
                    <label>Search Depth</label>
                    <input type="number" min="1" max="50" value={settings.advanced.depth} onChange={e => onSettingsChange({ advanced: { ...settings.advanced, depth: Number(e.target.value) }})} />
                  </div>
                  <div className="setting-group compact">
                    <label>Move Time (ms)</label>
                    <input type="number" min="10" max="10000" step="10" value={settings.advanced.moveTime} onChange={e => onSettingsChange({ advanced: { ...settings.advanced, moveTime: Number(e.target.value) }})} />
                  </div>
                  <div className="setting-group compact">
                    <label>Threads</label>
                    <input type="number" min="1" max="1" value={settings.advanced.threads} title="Single-threaded build max is 1" disabled />
                  </div>
                  <div className="setting-group compact">
                    <label>Hash Size (MB)</label>
                    <input type="number" min="1" max="1024" value={settings.advanced.hashSize} onChange={e => onSettingsChange({ advanced: { ...settings.advanced, hashSize: Number(e.target.value) }})} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="setting-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              checked={settings.showEvalBar} 
              onChange={e => onSettingsChange({ showEvalBar: e.target.checked })}
            />
            Show Evaluation Bar
          </label>
        </div>

        <button className="btn-primary w-full mt-4" onClick={() => {
          onNewGame();
          setIsOpen(false);
        }}>
          Start New Game
        </button>
      </div>
    </div>
  );
}
