import { Container } from 'pixi.js';
import { ScreenScaleConfig } from '../../services/orbitalTrajectory';

export const SCENE_LAYERS = {
  BACKGROUND: 0,
  SUN_SHADOW: 1,
  EARTH: 2,
  GROUND_STATIONS: 3,
  ORBITS: 4,
  SPACECRAFT: 5,
  OVERLAY_FX: 6,
} as const;

export class SceneCoordinator {
  public readonly stage: Container;
  public readonly backgroundLayer: Container;
  public readonly shadowLayer: Container;
  public readonly earthLayer: Container;
  public readonly groundStationsLayer: Container;
  public readonly orbitsLayer: Container;
  public readonly spacecraftLayer: Container;
  public readonly overlayFxLayer: Container;

  private screenWidth: number = 800;
  private screenHeight: number = 600;

  constructor(stage: Container) {
    this.stage = stage;

    this.backgroundLayer = new Container();
    this.backgroundLayer.zIndex = SCENE_LAYERS.BACKGROUND;

    this.shadowLayer = new Container();
    this.shadowLayer.zIndex = SCENE_LAYERS.SUN_SHADOW;

    this.earthLayer = new Container();
    this.earthLayer.zIndex = SCENE_LAYERS.EARTH;

    this.groundStationsLayer = new Container();
    this.groundStationsLayer.zIndex = SCENE_LAYERS.GROUND_STATIONS;

    this.orbitsLayer = new Container();
    this.orbitsLayer.zIndex = SCENE_LAYERS.ORBITS;

    this.spacecraftLayer = new Container();
    this.spacecraftLayer.zIndex = SCENE_LAYERS.SPACECRAFT;

    this.overlayFxLayer = new Container();
    this.overlayFxLayer.zIndex = SCENE_LAYERS.OVERLAY_FX;

    this.stage.sortableChildren = true;
    this.stage.addChild(
      this.backgroundLayer,
      this.shadowLayer,
      this.earthLayer,
      this.groundStationsLayer,
      this.orbitsLayer,
      this.spacecraftLayer,
      this.overlayFxLayer
    );
  }

  public updateDimensions(width: number, height: number): ScreenScaleConfig {
    this.screenWidth = width;
    this.screenHeight = height;

    return this.getScaleConfig();
  }

  public getScaleConfig(): ScreenScaleConfig {
    const originX = this.screenWidth / 2;
    const originY = this.screenHeight / 2;
    // Fit LEO (around 7000 km radius) comfortably within screen height / width
    const minDim = Math.min(this.screenWidth, this.screenHeight);
    const pixelsPerKm = (minDim * 0.38) / 7200;

    return {
      originX,
      originY,
      pixelsPerKm: Math.max(0.015, pixelsPerKm),
    };
  }

  public destroy(): void {
    this.stage.removeChildren();
  }
}
