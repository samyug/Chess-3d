import { useState } from 'react';
import type { GameMode, EngineColor } from '../engine/EngineTypes';

export interface AppSettings {
  gameMode: GameMode;
  difficulty: string; // Key in CasualDifficulties
  playerColor: EngineColor; // w, b, random
  showEvalBar: boolean;
  useAdvancedSettings: boolean;
  advanced: {
    skillLevel: number;
    depth: number;
    moveTime: number;
    threads: number;
    hashSize: number;
  };
}

const DEFAULT_SETTINGS: AppSettings = {
  gameMode: 'HvC',
  difficulty: 'Beginner',
  playerColor: 'w',
  showEvalBar: true,
  useAdvancedSettings: false,
  advanced: {
    skillLevel: 20,
    depth: 15,
    moveTime: 500,
    threads: 1,
    hashSize: 16,
  }
};

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('chess_settings');
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to parse settings from local storage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const setSettings = (newSettings: Partial<AppSettings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('chess_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save settings to local storage', e);
      }
      return updated;
    });
  };

  return { settings, setSettings };
}
