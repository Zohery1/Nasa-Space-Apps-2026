import { StationTerminalEntity } from '../entities/StationTerminalEntity';
import { CrewMemberEntity } from '../entities/CrewMemberEntity';
import { useGameStore } from '../../store/useGameStore';
import { MISSION_CONFIG } from '../../config/constants';

export class InteractionSystem {
  private readonly stations: StationTerminalEntity[];
  private activeStation: StationTerminalEntity | null = null;
  private holdElapsedMs: number = 0;
  private readonly targetHoldMs: number;
  private isCompleted: boolean = false;

  constructor(stations: StationTerminalEntity[]) {
    this.stations = stations;
    this.targetHoldMs = MISSION_CONFIG.HOLD_INTERACT_DURATION_MS || 3000;
  }

  public update(activeCrew: CrewMemberEntity | undefined, isHoldingE: boolean, deltaMs: number): void {
    if (!activeCrew) {
      this.resetInteraction();
      return;
    }

    const crewPos = activeCrew.getPosition();
    const proximityThreshold = 38;

    // 1. Detect closest station within interaction radius
    let nearbyStation: StationTerminalEntity | null = null;
    for (const station of this.stations) {
      const dx = crewPos.x - station.config.x;
      const dy = crewPos.y - station.config.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= proximityThreshold) {
        nearbyStation = station;
        break;
      }
    }

    // Update proximity visual prompts
    this.stations.forEach((s) => s.setProximity(s === nearbyStation));

    // 2. Handle station transition
    if (this.activeStation !== nearbyStation) {
      this.activeStation?.setHoldProgress(0);
      this.activeStation = nearbyStation;
      this.holdElapsedMs = 0;
      this.isCompleted = false;
    }

    if (!this.activeStation) return;

    // 3. Process Hold E Interaction
    if (isHoldingE && !this.isCompleted) {
      this.holdElapsedMs += deltaMs;
      const progress = Math.min(1.0, this.holdElapsedMs / this.targetHoldMs);
      this.activeStation.setHoldProgress(progress);

      if (progress >= 1.0) {
        this.triggerInteractionComplete(this.activeStation);
        this.isCompleted = true;
      }
    } else if (!isHoldingE) {
      // Key released before completion: reset progress
      this.holdElapsedMs = 0;
      this.isCompleted = false;
      this.activeStation.setHoldProgress(0);
    }
  }

  private triggerInteractionComplete(station: StationTerminalEntity): void {
    const store = useGameStore.getState();

    // Discrete action dispatch based on station
    switch (station.config.id) {
      case 'station_helm':
        store.setScore((store.score || 0) + 150);
        break;
      case 'station_power':
        store.setScore((store.score || 0) + 200);
        break;
      case 'station_o2':
        store.setScore((store.score || 0) + 100);
        break;
      case 'station_coolant':
        store.setScore((store.score || 0) + 250);
        break;
    }
  }

  private resetInteraction(): void {
    this.stations.forEach((s) => {
      s.setProximity(false);
      s.setHoldProgress(0);
    });
    this.activeStation = null;
    this.holdElapsedMs = 0;
    this.isCompleted = false;
  }

  public destroy(): void {
    this.resetInteraction();
  }
}
