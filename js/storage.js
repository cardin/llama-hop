import { weatherTypes } from './config.js';

const BEST_SCORE_KEY = 'llama-best';
const DISCOVERIES_KEY = 'llama-scenes';

export function loadBestScore() {
  try {
    const best = Number(localStorage.getItem(BEST_SCORE_KEY));
    return Number.isFinite(best) && best >= 0 ? best : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(best) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(best));
  } catch {
    // Gameplay remains available when browser storage is blocked or full.
  }
}

export function loadDiscoveredScenes() {
  const discovered = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(DISCOVERIES_KEY) || '[]');
    if (!Array.isArray(saved)) return discovered;

    const knownScenes = new Set(weatherTypes.map(scene => scene.name));
    for (const name of saved) {
      if (knownScenes.has(name)) discovered.add(name);
    }
  } catch {
    // Invalid or unavailable storage must not prevent the game from starting.
  }
  return discovered;
}

export function saveDiscoveredScenes(discovered) {
  try {
    localStorage.setItem(DISCOVERIES_KEY, JSON.stringify([...discovered]));
  } catch {
    // Discoveries still work for the current visit without persistent storage.
  }
}

export function clearSavedProgress() {
  let cleared = true;
  for (const key of [BEST_SCORE_KEY, DISCOVERIES_KEY]) {
    try {
      localStorage.removeItem(key);
    } catch {
      cleared = false;
    }
  }
  return cleared;
}
