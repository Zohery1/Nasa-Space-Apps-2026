import { Application } from 'pixi.js';
import { SceneCoordinator } from './SceneCoordinator';
import { StarfieldSystem } from '../systems/StarfieldSystem';
import { EarthEntity } from '../entities/EarthEntity';
import { GroundStationsEntity } from '../entities/GroundStationsEntity';
import { OrbitRingEntity } from '../entities/OrbitRingEntity';
import { CubeSatEntity } from '../entities/CubeSatEntity';
import { PhysicsTickerSystem } from '../systems/PhysicsTickerSystem';

export class GameApp {
  public app: Application | null = null;
  private coordinator: SceneCoordinator | null = null;
  private starfield: StarfieldSystem | null = null;
  private earth: EarthEntity | null = null;
  private groundStations: GroundStationsEntity | null = null;
  private orbitRing: OrbitRingEntity | null = null;
  private cubeSat: CubeSatEntity | null = null;
  private tickerSystem: PhysicsTickerSystem | null = null;
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
    const scale = this.coordinator.updateDimensions(app.screen.width, app.screen.height);

    // 2. Initialize Visual Entities & Systems
    this.starfield = new StarfieldSystem();
    this.starfield.initStars(app.screen.width, app.screen.height);
    this.coordinator.backgroundLayer.addChild(this.starfield.container);

    this.earth = new EarthEntity();
    this.earth.redraw(scale);
    this.coordinator.earthLayer.addChild(this.earth.container);

    this.groundStations = new GroundStationsEntity();
    this.groundStations.redraw(scale);
    this.coordinator.groundStationsLayer.addChild(this.groundStations.container);

    this.orbitRing = new OrbitRingEntity();
    this.orbitRing.redraw(scale);
    this.coordinator.orbitsLayer.addChild(this.orbitRing.container);

    this.cubeSat = new CubeSatEntity();
    this.coordinator.spacecraftLayer.addChild(this.cubeSat.container);

    // 3. Initialize 60 FPS Keplerian Physics Loop
    this.tickerSystem = new PhysicsTickerSystem(
      this.earth,
      this.groundStations,
      this.orbitRing,
      this.cubeSat
    );

    app.ticker.add((ticker) => {
      if (!this.coordinator || !this.tickerSystem) return;
      const currentScale = this.coordinator.getScaleConfig();
      this.starfield?.update(ticker.deltaTime);
      this.tickerSystem.update(ticker, currentScale);
    });
  }

  public resize(): void {
    if (!this.app || !this.coordinator) return;
    const scale = this.coordinator.updateDimensions(this.app.screen.width, this.app.screen.height);
    this.starfield?.resize(this.app.screen.width, this.app.screen.height);
    this.earth?.redraw(scale);
    this.groundStations?.redraw(scale);
    this.orbitRing?.redraw(scale);
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.app) {
      this.app.ticker.stop();
      this.starfield?.destroy();
      this.earth?.destroy();
      this.groundStations?.destroy();
      this.orbitRing?.destroy();
      this.cubeSat?.destroy();
      this.coordinator?.destroy();
      this.app.destroy({ releaseGlobalResources: true });
      this.app = null;
    }
  }
}
