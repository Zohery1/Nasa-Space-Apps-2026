import { CrewMemberEntity } from '../entities/CrewMemberEntity';
import { DECK_ROOMS } from '../deck/DeckLayoutConfig';

export class CrewControllerSystem {
  private activeCrewId: number = 1; // 1: CDR, 2: CAP, 3: ENG, 4: SCI
  private readonly crewMap: Map<number, CrewMemberEntity> = new Map();
  private readonly pressedKeys: Set<string> = new Set();
  private readonly moveSpeed: number = 2.8;

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
    if (this.pressedKeys.has('1')) this.selectCrew(1);
    if (this.pressedKeys.has('2')) this.selectCrew(2);
    if (this.pressedKeys.has('3')) this.selectCrew(3);
    if (this.pressedKeys.has('4')) this.selectCrew(4);

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
      // Normalize diagonal speed
      dx *= 0.7071;
      dy *= 0.7071;
    }

    if (dx !== 0 || dy !== 0) {
      const curPos = active.getPosition();
      const targetX = curPos.x + dx * this.moveSpeed * deltaFrames;
      const targetY = curPos.y + dy * this.moveSpeed * deltaFrames;

      // 3. Collision check against deck boundaries
      if (this.isWalkable(targetX, curPos.y)) {
        active.setPosition(targetX, curPos.y);
      }
      if (this.isWalkable(active.getPosition().x, targetY)) {
        active.setPosition(active.getPosition().x, targetY);
      }
    }

    // Update animations for all crew
    this.crewMap.forEach((c) => c.update(deltaFrames));
  }

  private isWalkable(x: number, y: number): boolean {
    const margin = 14;

    // Check corridor passes (Central vertical and horizontal airlocks)
    const inVerticalCorridor = Math.abs(x) <= 20 && y >= -130 && y <= 110;
    const inHorizontalCorridor = Math.abs(y) <= 20 && x >= -80 && x <= 80;
    if (inVerticalCorridor || inHorizontalCorridor) return true;

    // Check if inside any designated room floor
    for (const room of DECK_ROOMS) {
      const withinX = x >= room.x + margin && x <= room.x + room.width - margin;
      const withinY = y >= room.y + margin && y <= room.y + room.height - margin;
      if (withinX && withinY) return true;
    }

    return false;
  }

  private attachListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    this.pressedKeys.add(e.code);
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    this.pressedKeys.delete(e.code);
  };

  public isHoldingE(): boolean {
    return this.pressedKeys.has('KeyE');
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.pressedKeys.clear();
  }
}
