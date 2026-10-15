import { ctx, withDrawingContext } from './canvas.js';
import { weatherTypes } from './config.js';
import { weatherScene } from './scenes.js';
import { saveDiscoveredScenes } from './storage.js';

export function createGallery(discoveredScenes) {
  const sceneCards = [];
  function paintSceneCard(index) {
    const weather = weatherTypes[index], card = sceneCards[index];
    const revealed = discoveredScenes.has(weather.name);
    const preview = document.createElement('canvas');
    preview.width = revealed ? 120 : 10; preview.height = revealed ? 108 : 9;
    withDrawingContext(preview.getContext('2d'), () => {
      ctx.scale(preview.width / 400, preview.height / 560);
      weatherScene(weather, 0);
    });
    const thumbnail = card.querySelector('canvas'), context = thumbnail.getContext('2d');
    context.imageSmoothingEnabled = false;
    context.drawImage(preview, 0, 0, thumbnail.width, thumbnail.height);
    const label = revealed ? `✓ ${weather.name}` : '???';
    card.querySelector('figcaption').textContent = label;
    thumbnail.setAttribute('aria-label', revealed ? weather.name : 'Pixelated preview of an undiscovered world');
  }
  function discoverScene(weather) {
    if (discoveredScenes.has(weather.name)) return;
    discoveredScenes.add(weather.name);
    saveDiscoveredScenes(discoveredScenes);
    paintSceneCard(weatherTypes.indexOf(weather));
    updateDiscoveryCount();
  }
  function updateDiscoveryCount() {
    document.getElementById('discovery-count').textContent = `${discoveredScenes.size} / ${weatherTypes.length} worlds discovered`;
  }
  function initSceneGallery() {
    const grid = document.getElementById('scene-grid');
    weatherTypes.forEach((weather, index) => {
      const card = document.createElement('figure'); card.className = 'scene-card';
      const thumbnail = document.createElement('canvas'); thumbnail.width = 120; thumbnail.height = 108;
      thumbnail.setAttribute('role', 'img');
      card.append(thumbnail, document.createElement('figcaption'));
      grid.append(card); sceneCards.push(card); paintSceneCard(index);
    });
    updateDiscoveryCount();
  }

  function clear() {
    discoveredScenes.clear();
    sceneCards.forEach((card, index) => paintSceneCard(index));
    updateDiscoveryCount();
  }

  return { init: initSceneGallery, discover: discoverScene, clear };
}
