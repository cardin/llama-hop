export function memoryStorage(entries = {}) {
  const values = new Map(Object.entries(entries));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key)
  };
}

// A recording canvas tests drawing paths without native graphics dependencies.
// Pixel output is not asserted here; these adapters only record draw calls.
export function drawingContext() {
  const calls = [];
  const stack = [];
  const properties = { globalAlpha: 1, canvas: { width: 400, height: 560 }, calls, stack };
  return new Proxy(properties, {
    get(target, key) {
      if (key in target) return target[key];
      if (key === 'save') return () => {
        stack.push({ ...target });
        calls.push(['save']);
      };
      if (key === 'restore') return () => {
        if (!stack.length) throw new Error('Unbalanced canvas restore');
        Object.assign(target, stack.pop());
        calls.push(['restore']);
      };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') {
        return (...args) => {
          calls.push([key, ...args]);
          return { addColorStop() {} };
        };
      }
      return (...args) => calls.push([key, ...args]);
    }
  });
}

export function browserEnvironment() {
  function element(tag = 'div') {
    const node = {
      tagName: tag.toUpperCase(), children: [], listeners: {}, hidden: false, textContent: '',
      append(...children) { this.children.push(...children); },
      setAttribute() {},
      addEventListener(event, listener) { this.listeners[event] = listener; },
      querySelector(selector) { return this.children.find(child => child.tagName.toLowerCase() === selector); },
      focus() {},
      getContext() {
        if (!this.context) {
          this.context = drawingContext();
          this.context.canvas = this;
        }
        return this.context;
      }
    };
    return node;
  }
  const elements = new Map([
    ['game', element('canvas')], ['restart', element('button')], ['clear-state', element('button')],
    ['final-score', element('span')], ['cycle-start', element('span')], ['form-interval', element('span')], ['reset-status', element()],
    ['discovery-count', element()], ['scene-grid', element()]
  ]);
  const document = {
    getElementById: id => elements.get(id),
    createElement: element,
    fonts: { load: () => Promise.resolve([]) }
  };
  const window = {
    devicePixelRatio: 1,
    confirm: () => true,
    listeners: {},
    addEventListener(event, listener) { this.listeners[event] = listener; },
    matchMedia() { throw new Error('Motion preferences must not be queried'); }
  };
  class Image {
    complete = true;
    naturalWidth = 340;
  }
  return { document, window, Image, elements };
}
