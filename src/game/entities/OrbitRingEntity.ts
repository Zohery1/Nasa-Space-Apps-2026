import { Container, Graphics } from 'pixi.js';
import {
  generateCircularOrbitPath,
  generateEllipticalTransferPath,
  ScreenScaleConfig,
  Point2D,
} from '../../services/orbitalTrajectory';

export class OrbitRingEntity {
  public readonly container: Container;
  private readonly orbitGraphics: Graphics;
  private currentAltitudeKm: number = 550;
  private isTransferring: boolean = false;
  private transferTargetAltKm: number = 550;

  constructor() {
    this.container = new Container();
    this.orbitGraphics = new Graphics();
    this.container.addChild(this.orbitGraphics);
  }

  public setOrbitParameters(altitudeKm: number, isTransferring = false, targetAltKm = 550): void {
    this.currentAltitudeKm = altitudeKm;
    this.isTransferring = isTransferring;
    this.transferTargetAltKm = targetAltKm;
  }

  public redraw(scale: ScreenScaleConfig): void {
    this.orbitGraphics.clear();

    // 1. Primary Orbit Path
    const points: Point2D[] = generateCircularOrbitPath(this.currentAltitudeKm, scale, 96);
    if (points.length < 2) return;

    const polyCoords: number[] = [];
    points.forEach((p) => {
      polyCoords.push(p.x, p.y);
    });

    // Primary circular orbit line (glow + core)
    this.orbitGraphics.poly(polyCoords).stroke({ width: 3, color: 0x0284c7, alpha: 0.25 });
    this.orbitGraphics.poly(polyCoords).stroke({ width: 1.5, color: 0x38bdf8, alpha: 0.75 });

    // 2. Hohmann Transfer Ellipse Path (if active)
    if (this.isTransferring && this.transferTargetAltKm !== this.currentAltitudeKm) {
      const transferPoints = generateEllipticalTransferPath(
        Math.min(this.currentAltitudeKm, this.transferTargetAltKm),
        Math.max(this.currentAltitudeKm, this.transferTargetAltKm),
        scale,
        96
      );
      const transferCoords: number[] = [];
      transferPoints.forEach((p) => transferCoords.push(p.x, p.y));

      this.orbitGraphics.poly(transferCoords).stroke({
        width: 1.5,
        color: 0xf59e0b, // Amber for transfer trajectory
        alpha: 0.8,
      });

      // Target circular orbit preview
      const targetPoints = generateCircularOrbitPath(this.transferTargetAltKm, scale, 96);
      const targetCoords: number[] = [];
      targetPoints.forEach((p) => targetCoords.push(p.x, p.y));
      this.orbitGraphics.poly(targetCoords).stroke({
        width: 1,
        color: 0x10b981, // Emerald green for target orbit
        alpha: 0.5,
      });
    }

    // Prograde Orbit Motion Direction Markers
    for (let i = 0; i < points.length - 1; i += 16) {
      const p = points[i];
      this.orbitGraphics.circle(p.x, p.y, 2).fill({ color: 0x7dd3fc, alpha: 0.9 });
    }
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
