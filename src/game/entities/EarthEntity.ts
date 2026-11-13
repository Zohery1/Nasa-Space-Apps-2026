import { Container, Graphics } from 'pixi.js';
import { EARTH_RADIUS_KM } from '../../services/orbitalPhysics';
import { ScreenScaleConfig } from '../../services/orbitalTrajectory';

/**
 * Earth & Atmosphere Entity in PixiJS v8
 * Grounded in Resource 2 (GMAT WGS-84 radius) and Resource 5 (mission-viz)
 */
export class EarthEntity {
  public readonly container: Container;
  private readonly globeGraphics: Graphics;
  private readonly atmosphereGraphics: Graphics;
  private readonly umbraGraphics: Graphics;
  private rotationAngle: number = 0;

  constructor() {
    this.container = new Container();

    this.umbraGraphics = new Graphics();
    this.atmosphereGraphics = new Graphics();
    this.globeGraphics = new Graphics();

    this.container.addChild(
      this.umbraGraphics,
      this.atmosphereGraphics,
      this.globeGraphics
    );
  }

  public redraw(scale: ScreenScaleConfig, sunAngleRad: number = 0): void {
    const earthRadiusPx = EARTH_RADIUS_KM * scale.pixelsPerKm;
    const { originX, originY } = scale;

    // 1. Atmosphere halo glow
    this.atmosphereGraphics.clear();
    this.atmosphereGraphics
      .circle(originX, originY, earthRadiusPx * 1.08)
      .fill({ color: 0x0284c7, alpha: 0.15 });
    this.atmosphereGraphics
      .circle(originX, originY, earthRadiusPx * 1.03)
      .fill({ color: 0x38bdf8, alpha: 0.25 });

    // 2. Main Earth Globe
    this.globeGraphics.clear();
    // Deep Ocean Base
    this.globeGraphics
      .circle(originX, originY, earthRadiusPx)
      .fill({ color: 0x0c2d48 })
      .stroke({ width: 2, color: 0x38bdf8, alpha: 0.6 });

    // Latitude rings / grid lines
    const gridCount = 4;
    for (let i = 1; i <= gridCount; i++) {
      const ringRadius = (earthRadiusPx / (gridCount + 1)) * i;
      this.globeGraphics
        .circle(originX, originY, ringRadius)
        .stroke({ width: 1, color: 0x1e40af, alpha: 0.25 });
    }

    // 3. Cylindrical Earth Umbra Shadow (Opposite to Sun angle)
    // Shadow extends outward into space opposite to sunAngleRad
    const shadowOppositeAngle = sunAngleRad + Math.PI;
    const shadowDistancePx = earthRadiusPx * 6.0; // Extend into orbit zone
    const p1x = originX + earthRadiusPx * Math.cos(shadowOppositeAngle - Math.PI / 2);
    const p1y = originY + earthRadiusPx * Math.sin(shadowOppositeAngle - Math.PI / 2);
    const p2x = originX + earthRadiusPx * Math.cos(shadowOppositeAngle + Math.PI / 2);
    const p2y = originY + earthRadiusPx * Math.sin(shadowOppositeAngle + Math.PI / 2);

    const p3x = p2x + shadowDistancePx * Math.cos(shadowOppositeAngle);
    const p3y = p2y + shadowDistancePx * Math.sin(shadowOppositeAngle);
    const p4x = p1x + shadowDistancePx * Math.cos(shadowOppositeAngle);
    const p4y = p1y + shadowDistancePx * Math.sin(shadowOppositeAngle);

    this.umbraGraphics.clear();
    this.umbraGraphics
      .poly([p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y])
      .fill({ color: 0x010409, alpha: 0.65 });

    // Night-side hemisphere darkener on Earth itself
    this.globeGraphics
      .arc(originX, originY, earthRadiusPx, shadowOppositeAngle - Math.PI / 2, shadowOppositeAngle + Math.PI / 2)
      .fill({ color: 0x020617, alpha: 0.7 });
  }

  public update(deltaFrames: number): void {
    // Subtle axial rotation (approx 0.05 deg per frame)
    this.rotationAngle += 0.0005 * deltaFrames;
    this.globeGraphics.rotation = this.rotationAngle;
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
