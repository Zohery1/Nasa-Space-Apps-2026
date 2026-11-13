import { Container, Graphics } from 'pixi.js';
import { CANONICAL_GROUND_STATIONS, GroundStation } from '../../services/groundStationService';
import { EARTH_RADIUS_KM } from '../../services/orbitalPhysics';
import { ScreenScaleConfig } from '../../services/orbitalTrajectory';

export class GroundStationsEntity {
  public readonly container: Container;
  private readonly stationsGraphics: Graphics;
  private readonly beamGraphics: Graphics;
  private activeStationId: string | null = null;

  constructor() {
    this.container = new Container();
    this.stationsGraphics = new Graphics();
    this.beamGraphics = new Graphics();
    this.container.addChild(this.stationsGraphics, this.beamGraphics);
  }

  public redraw(scale: ScreenScaleConfig, earthRotationRad: number = 0): void {
    const earthRadiusPx = EARTH_RADIUS_KM * scale.pixelsPerKm;
    const { originX, originY } = scale;
    this.stationsGraphics.clear();

    CANONICAL_GROUND_STATIONS.forEach((station: GroundStation) => {
      // Station angle on 2D circumference based on longitude + rotation
      const lonRad = (station.longitudeDeg * Math.PI) / 180.0;
      const angle = lonRad + earthRotationRad;

      const sx = originX + earthRadiusPx * Math.cos(angle);
      const sy = originY + earthRadiusPx * Math.sin(angle);

      // Station Node
      const isDSN = station.network === 'DSN';
      const nodeColor = isDSN ? 0xf59e0b : 0x06b6d4; // Amber for DSN, Cyan for NSN

      this.stationsGraphics.circle(sx, sy, 3.5).fill({ color: nodeColor, alpha: 0.9 });
      this.stationsGraphics.circle(sx, sy, 6.0).stroke({ width: 1, color: nodeColor, alpha: 0.4 });

      // Visual Tracking Cone (10 deg minimum elevation limit)
      const coneReachPx = earthRadiusPx * 0.45;
      const coneHalfAngleRad = ((90 - station.minElevationDeg) * Math.PI) / 180.0;

      const p1x = sx + coneReachPx * Math.cos(angle - coneHalfAngleRad * 0.5);
      const p1y = sy + coneReachPx * Math.sin(angle - coneHalfAngleRad * 0.5);
      const p2x = sx + coneReachPx * Math.cos(angle + coneHalfAngleRad * 0.5);
      const p2y = sy + coneReachPx * Math.sin(angle + coneHalfAngleRad * 0.5);

      this.stationsGraphics
        .poly([sx, sy, p1x, p1y, p2x, p2y])
        .fill({ color: nodeColor, alpha: 0.04 })
        .stroke({ width: 1, color: nodeColor, alpha: 0.15 });
    });
  }

  public updateActiveBeam(
    scale: ScreenScaleConfig,
    earthRotationRad: number,
    satellitePos: { x: number; y: number } | null,
    inContactStationId: string | null
  ): void {
    this.beamGraphics.clear();
    this.activeStationId = inContactStationId;

    if (!inContactStationId || !satellitePos) return;

    const station = CANONICAL_GROUND_STATIONS.find((s) => s.id === inContactStationId);
    if (!station) return;

    const earthRadiusPx = EARTH_RADIUS_KM * scale.pixelsPerKm;
    const lonRad = (station.longitudeDeg * Math.PI) / 180.0;
    const angle = lonRad + earthRotationRad;
    const sx = scale.originX + earthRadiusPx * Math.cos(angle);
    const sy = scale.originY + earthRadiusPx * Math.sin(angle);

    // Glowing Downlink Beam
    const beamColor = station.network === 'DSN' ? 0xfbbf24 : 0x22d3ee;
    this.beamGraphics
      .poly([sx, sy, satellitePos.x, satellitePos.y])
      .stroke({ width: 2, color: beamColor, alpha: 0.85 });

    // Target lock pulsing indicator
    this.beamGraphics.circle(satellitePos.x, satellitePos.y, 10).stroke({
      width: 1.5,
      color: beamColor,
      alpha: 0.6,
    });
  }

  public getActiveStationId(): string | null {
    return this.activeStationId;
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
