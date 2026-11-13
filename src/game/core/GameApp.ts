import { Application } from 'pixi.js';
import { SceneCoordinator } from './SceneCoordinator';
import { StarfieldSystem } from '../systems/StarfieldSystem';
import { ShipScene } from './ShipScene';

export class GameApp {
  public app: Application | null = null;
  private coordinator: SceneCoordinator | null = null;
  private starfield: StarfieldSystem | null = null;
  private shipScene: ShipScene | null = null;
  private isDestroyed: boolean = false;

  public async init(container: HTMLDivElement): Promise<void> {
    const app = new Application();
    await app.init({
      resizeTo: container,
      backgroundAlpha: 0,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    if (this.isDestroyed) {
      app.destroy({ releaseGlobalResources: true });
      return;
    }

    this.app = app;
    container.appendChild(app.canvas);

    // 1. Initialize Scene Coordinator
    this.coordinator = new SceneCoordinator(app.stage);
    this.coordinator.updateDimensions(app.screen.width, app.screen.height);

    // 2. Initialize Deep Space Background
    this.starfield = new StarfieldSystem();
    this.starfield.initStars(app.screen.width, app.screen.height, 220);
    this.coordinator.backgroundLayer.addChild(this.starfield.container);

    // 3. Initialize Interactive Ship Deck & 4-Crew Scene
    this.shipScene = new ShipScene();
    this.shipScene.resize(app.screen.width, app.screen.height);
    this.coordinator.stage.addChild(this.shipScene.container);

    // 4. Main 60 FPS Ticker
    app.ticker.add((ticker) => {
      this.starfield?.update(ticker.deltaTime);
      this.shipScene?.update(ticker);
    });
  }

  public setCrisisStage(stage: number): void {
    this.shipScene?.setCrisisStage(stage);
  }

  public resize(): void {
    if (!this.app || !this.coordinator) return;
    this.coordinator.updateDimensions(this.app.screen.width, this.app.screen.height);
    this.starfield?.resize(this.app.screen.width, this.app.screen.height);
    this.shipScene?.resize(this.app.screen.width, this.app.screen.height);
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.app) {
      this.app.ticker.stop();
      this.starfield?.destroy();
      this.shipScene?.destroy();
      this.coordinator?.destroy();
      this.app.destroy({ releaseGlobalResources: true });
      this.app = null;
    }
  }
}
