import { CrewMemberEntity } from '../entities/CrewMemberEntity';
import { DECK_WALKABLE_ZONES } from '../deck/DeckLayoutConfig';

export class CrewControllerSystem {
  private activeCrewId: number = 1; // 1: CDR, 2: CAP, 3: ENG, 4: SCI
  private readonly crewMap: Map<number, CrewMemberEntity> = new Map();
  private readonly pressedKeys: Set<string> = new Set();
  private readonly moveSpeed: number = 3.0;

  constructor(crewList: CrewMemberEntity[]) {
    crewList.forEach((c) => this.crewMap.set(c.config.id, c));
    this.selectCrew(1);
    this.attachListeners();
  }

  public getActiveCrew(): CrewMemberEntity | undefined {
    return this.crewMap.get(this.activeCrewId);
  }

  public selectCrew(id: number): void {
    if (!this.crewMap.has(id)) return;
    this.activeCrewId = id;
    this.crewMap.forEach((c) => c.setSelected(c.config.id === id));
  }

  public update(deltaFrames: number): void {
    // 1. Process character switching (Keys 1, 2, 3, 4)
    if (this.pressedKeys.has('1') || this.pressedKeys.has('Digit1')) this.selectCrew(1);
    if (this.pressedKeys.has('2') || this.pressedKeys.has('Digit2')) this.selectCrew(2);
    if (this.pressedKeys.has('3') || this.pressedKeys.has('Digit3')) this.selectCrew(3);
    if (this.pressedKeys.has('4') || this.pressedKeys.has('Digit4')) this.selectCrew(4);

    // 2. Process WASD Movement
    const active = this.getActiveCrew();
    if (!active) return;

    let dx = 0;
    let dy = 0;

    if (this.pressedKeys.has('KeyW') || this.pressedKeys.has('ArrowUp')) dy -= 1;
    if (this.pressedKeys.has('KeyS') || this.pressedKeys.has('ArrowDown')) dy += 1;
    if (this.pressedKeys.has('KeyA') || this.pressedKeys.has('ArrowLeft')) dx -= 1;
    if (this.pressedKeys.has('KeyD') || this.pressedKeys.has('ArrowRight')) dx += 1;

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    if (dx !== 0 || dy !== 0) {
      const cur = active.getPosition();
      const targetX = cur.x + dx * this.moveSpeed * deltaFrames;
      const targetY = cur.y + dy * this.moveSpeed * deltaFrames;

      // Axis-separated collision test to allow sliding along walls
      if (this.isPositionWalkable(targetX, cur.y)) {
        active.setPosition(targetX, cur.y);
      }
      if (this.isPositionWalkable(active.getPosition().x, targetY)) {
        active.setPosition(active.getPosition().x, targetY);
      }
    }

    // Update animations for all crew
    this.crewMap.forEach((c) => c.update(deltaFrames));
  }

  private isPositionWalkable(x: number, y: number): boolean {
    // Check against all walkable rectangles (rooms + airlock corridors)
    for (const zone of DECK_WALKABLE_ZONES) {
      if (x >= zone.xMin && x <= zone.xMax && y >= zone.yMin && y <= zone.yMax) {
        return true;
      }
    }
    return false;
  }

  private attachListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    this.pressedKeys.add(e.code);
    this.pressedKeys.add(e.key);
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.pressedKeys.delete(e.code);
    this.pressedKeys.delete(e.key);
  };

  public isHoldingE(): boolean {
    return this.pressedKeys.has('KeyE') || this.pressedKeys.has('e') || this.pressedKeys.has('E');
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.pressedKeys.clear();
  }
}
