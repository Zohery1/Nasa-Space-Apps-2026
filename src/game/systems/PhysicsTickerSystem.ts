import { Ticker } from 'pixi.js';
import { getSatellitePositionAtTime, ScreenScaleConfig } from '../../services/orbitalTrajectory';
import { CANONICAL_GROUND_STATIONS } from '../../services/groundStationService';
import { EARTH_RADIUS_KM } from '../../services/orbitalPhysics';
import { EarthEntity } from '../entities/EarthEntity';
import { GroundStationsEntity } from '../entities/GroundStationsEntity';
import { OrbitRingEntity } from '../entities/OrbitRingEntity';
import { CubeSatEntity } from '../entities/CubeSatEntity';
import { useGameStore } from '../../store/useGameStore';

export class PhysicsTickerSystem {
  private elapsedSimSeconds: number = 0;
  private earthRotationAngle: number = 0;
  private altitudeKm: number = 550;
  private timeMultiplier: number = 25.0; // Scaled time for visual movement
  private lastStoreSyncSec: number = 0;

  constructor(
    private readonly earth: EarthEntity,
    private readonly stations: GroundStationsEntity,
    private readonly orbitRing: OrbitRingEntity,
    private readonly cubeSat: CubeSatEntity
  ) {}

  public update(ticker: Ticker, scale: ScreenScaleConfig): void {
    const deltaSeconds = ticker.deltaMS / 1000.0;
    this.elapsedSimSeconds += deltaSeconds * this.timeMultiplier;
    this.earthRotationAngle += 0.0003 * ticker.deltaTime;

    // 1. Sync configuration discretely from Zustand store
    const store = useGameStore.getState();
    const currentAltitude = store.selectedOrbitAltitudeKm || 550;
    if (currentAltitude !== this.altitudeKm) {
      this.altitudeKm = currentAltitude;
      this.orbitRing.setOrbitParameters(this.altitudeKm);
      this.orbitRing.redraw(scale);
    }

    const busFormFactor = store.selectedBus?.formFactor || '3U';
    const isDeployed = store.flightStage !== 'ON_PAD';
    this.cubeSat.setConfiguration(busFormFactor, isDeployed);

    // 2. Compute Keplerian Position at elapsedSimSeconds
    const satPos = getSatellitePositionAtTime(this.altitudeKm, this.elapsedSimSeconds, scale);

    // 3. Evaluate Eclipse (Umbra)
    // Sun is at angle 0 (right side). Earth blocks light when satellite is on -X side (-cos(angle) > threshold)
    const isInEclipse = Math.cos(satPos.angleRad) < -0.3;
    const isThrusting = store.flightStage === 'ASCENT' || store.flightStage === 'ORBIT_INSERTION';

    this.cubeSat.setFlightDynamics(isThrusting, isInEclipse);
    this.cubeSat.updatePositionAndOrientation(satPos.x, satPos.y, satPos.angleRad);

    // 4. Ground Station Line-of-Sight Contact Check
    const activeStationId = this.findActiveGroundStationPass(satPos.angleRad);
    this.stations.updateActiveBeam(
      scale,
      this.earthRotationAngle,
      { x: satPos.x, y: satPos.y },
      activeStationId
    );

    // 5. Update Earth Entities
    this.earth.update(ticker.deltaTime);

    // 6. Discrete Store Bridge (Every 1 sim second, without spamming React)
    if (this.elapsedSimSeconds - this.lastStoreSyncSec > 2.0) {
      this.lastStoreSyncSec = this.elapsedSimSeconds;
      if (isThrusting) {
        store.expendDeltaV(0.25);
      }
    }
  }

  private findActiveGroundStationPass(satAngleRad: number): string | null {
    const earthRadiusKm = EARTH_RADIUS_KM;
    const maxVisibleAngleSpan = Math.acos(earthRadiusKm / (earthRadiusKm + this.altitudeKm)) + 0.15;

    for (const station of CANONICAL_GROUND_STATIONS) {
      const lonRad = (station.longitudeDeg * Math.PI) / 180.0;
      const stationCurAngle = (lonRad + this.earthRotationAngle) % (2 * Math.PI);
      const diff = Math.abs(Math.atan2(Math.sin(satAngleRad - stationCurAngle), Math.cos(satAngleRad - stationCurAngle)));

      if (diff <= maxVisibleAngleSpan) {
        return station.id;
      }
    }

    return null;
  }
}
