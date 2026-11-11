---
name: pixi-v8-patterns
description: Mandatory patterns for PixiJS v8 async initialization, app.canvas, ticker loop, and resource cleanup.
---

# PixiJS v8 Rules & Modern Patterns

## 1. Async Initialization
PixiJS v8 requires asynchronous initialization:
```ts
import { Application } from 'pixi.js';

const app = new Application();
await app.init({
  resizeTo: window,
  backgroundAlpha: 0,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
});

// Canvas access in v8:
containerRef.current.appendChild(app.canvas); // NOTE: app.canvas, NOT app.view!
```

## 2. Asset Loading
```ts
import { Assets, Sprite } from 'pixi.js';

const texture = await Assets.load('/assets/sprites/ship.png');
const sprite = new Sprite(texture);
sprite.anchor.set(0.5);
app.stage.addChild(sprite);
```

## 3. Ticker Loop
In v8, the ticker passes a `Ticker` object:
```ts
app.ticker.add((ticker) => {
  const dt = ticker.deltaTime;
  // update physics with dt
});
```

## 4. Teardown
```ts
app.destroy(true, { children: true, texture: true });
```
