export const FIRST_TRANSFORMATION_SCORE = 13;
export const FINAL_TRANSFORMATION_SCORE = 103;
export const TRANSFORMATION_INTERVAL = 10;
export const TRANSFORMATION_RESTART_SCORE = FINAL_TRANSFORMATION_SCORE + TRANSFORMATION_INTERVAL;

export const trailStyles = [
  { until: 13, kind: 'dust', colors: ['#e0c6a3', '#fff5db'] },
  { until: 23, kind: 'electric', colors: [] },
  { until: 33, kind: 'energy', colors: ['#f8ce4e', '#fff4af'] },
  { until: 43, kind: 'ember', colors: ['#f19b42', '#e96447'] },
  { until: 53, kind: 'speed', colors: ['#c6edff', '#66a6df'] },
  { until: 63, kind: 'elements', colors: ['#65b8e9', '#ed9d59', '#a6bf8c', '#e4f1ef'] },
  { until: 73, kind: 'magic', colors: ['#e69a49', '#f5cb79'] },
  { until: 83, kind: 'sith', colors: ['#ed5b65', '#ffd2c9'] },
  { until: 93, kind: 'rainbow', colors: [] },
  { until: FINAL_TRANSFORMATION_SCORE, kind: 'paw', colors: ['#ae7d46', '#e0ba78'] },
  { until: Infinity, kind: 'menacing', colors: ['#52316f'] }
];

export const dogePhrases = ['much hop', 'very llama', 'wow'];

export const weatherTypes = [
  {
    name: 'Netherlands', landmark: 'windmill',
    skyTop: '#91cbdc', sky: '#c9e9e5', skyHorizon: '#f5e5be',
    hills: '#b8d5b1', cloud: '#ffffff90', sun: '#ffe49a'
  },
  {
    name: 'Gotham', landmark: 'gotham',
    skyTop: '#101a30', sky: '#202d46', skyHorizon: '#4b5870',
    hills: '#37465a', cloud: '#71809a70', moon: true
  },
  {
    name: 'Totoro', landmark: 'totoro',
    skyTop: '#637f93', sky: '#91a9b9', skyHorizon: '#bacbc4',
    hills: '#809e96', cloud: '#d0dae5cc', rain: 1
  },
  {
    name: 'Dragonfall', landmark: 'castle',
    skyTop: '#635881', sky: '#c88fa7', skyHorizon: '#f6c294',
    hills: '#ad929c', cloud: '#ffe0c480', sun: '#ffce89'
  },
  {
    name: 'Hallowstorm', landmark: 'haunted',
    skyTop: '#343449', sky: '#55546b', skyHorizon: '#78818a',
    hills: '#637b80', cloud: '#8c9aafcc', rain: 1.5, thunder: true
  },
  {
    name: 'Breach', landmark: 'lighthouse',
    skyTop: '#3c5065', sky: '#657d87', skyHorizon: '#9aa79d',
    hills: '#7c9791', cloud: '#aebfc9cc', rain: 2, wind: true
  },
  {
    name: 'Nordic', landmark: 'nordic',
    skyTop: '#9fb9d0', sky: '#c4d9e5', skyHorizon: '#edf4ee',
    hills: '#d8e7e9', cloud: '#ffffffb0', snow: true
  },
  {
    name: 'Highlands', landmark: 'highlands',
    skyTop: '#9cadb9', sky: '#c5d1cf', skyHorizon: '#e1e3d8',
    hills: '#a0b2a6', cloud: '#eef4f0c0', fog: true
  },
  {
    name: 'Borealis', landmark: 'igloos',
    skyTop: '#14233e', sky: '#233c50', skyHorizon: '#527a82',
    hills: '#466c6c', cloud: '#71809a50', moon: true, aurora: true
  },
  {
    name: 'Sandstorm', landmark: 'pyramids',
    skyTop: '#b6977b', sky: '#d5b68b', skyHorizon: '#f0d4a2',
    hills: '#bba17b', cloud: '#e8cca080', dust: true
  },
  {
    name: 'Plumber', landmark: 'mario',
    skyTop: '#7cbce9', sky: '#bce4f0', skyHorizon: '#f6e9c7',
    hills: '#a8d399', cloud: '#ffffffb0', sun: '#ffe49a'
  },
  {
    name: 'DSO SP20', landmark: 'dso',
    skyTop: '#adcddf', sky: '#d7eaf0', skyHorizon: '#f5eed9',
    hills: '#a7c7ad', cloud: '#ffffff90', sun: '#ffe49a'
  },
  {
    name: 'Singapore', landmark: 'mbs',
    skyTop: '#8d8db6', sky: '#e7b8c8', skyHorizon: '#f9d8ad',
    hills: '#889bb5', cloud: '#ffe6da80', sun: '#ffdcaa'
  },
  {
    name: 'Mordor', landmark: 'mordor',
    skyTop: '#252637', sky: '#49363d', skyHorizon: '#a15e49',
    hills: '#3a3037', cloud: '#93706a60'
  },
  {
    name: 'Japan', landmark: 'japan',
    skyTop: '#a6c9e5', sky: '#cce5f1', skyHorizon: '#f9dedf',
    hills: '#a6bcab', cloud: '#ffffff90'
  },
  {
    name: 'Antarctica', landmark: 'antarctica',
    skyTop: '#9ac6e0', sky: '#c8e7f3', skyHorizon: '#f4fbfa',
    hills: '#e9f5fa', cloud: '#ffffff90', snow: true
  },
  {
    name: 'Jurassic', landmark: 'jurassic',
    skyTop: '#887d9b', sky: '#deb18b', skyHorizon: '#f5d69a',
    hills: '#81937a', cloud: '#f5e1c366'
  }
];
