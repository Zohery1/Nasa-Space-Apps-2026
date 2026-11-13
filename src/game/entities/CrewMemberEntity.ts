import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export interface CrewConfig {
  id: number; // 1 to 4
  roleCode: 'CDR' | 'CAP' | 'ENG' | 'SCI';
  roleName: string;
  suitColor: number;
  visorColor: number;
  initialX: number;
  initialY: number;
}

export class CrewMemberEntity {
  public readonly container: Container;
  public readonly config: CrewConfig;

  private readonly bodyGraphics: Graphics;
  private readonly selectionGraphics: Graphics;
  private isSelected: boolean = false;
  private pulsePhase: number = 0;

  constructor(config: CrewConfig) {
    this.config = config;
    this.container = new Container();
    this.container.position.set(config.initialX, config.initialY);

    this.selectionGraphics = new Graphics();
    this.bodyGraphics = new Graphics();

    const labelStyle = new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: 8,
      fontWeight: 'bold',
      fill: 0xffffff,
    });

    const badgeText = new Text({
      text: config.roleCode,
      style: labelStyle,
    });
    badgeText.anchor.set(0.5, 0.5);
    badgeText.position.set(0, -18);

    this.container.addChild(this.selectionGraphics, this.bodyGraphics, badgeText);
    this.renderAvatar();
  }

  private renderAvatar(): void {
    this.bodyGraphics.clear();

    // 1. Life-Support Backpack
    this.bodyGraphics
      .roundRect(-8, -10, 16, 8, 2)
      .fill({ color: 0x1e293b, alpha: 0.9 })
      .stroke({ width: 1, color: 0x64748b, alpha: 0.8 });

    // 2. Spacesuit Torso
    this.bodyGraphics
      .circle(0, 0, 10)
      .fill({ color: this.config.suitColor, alpha: 0.95 })
      .stroke({ width: 1.5, color: 0xffffff, alpha: 0.8 });

    // 3. Helmet Visor
    this.bodyGraphics
      .roundRect(-5, -6, 10, 6, 2)
      .fill({ color: this.config.visorColor, alpha: 0.95 })
      .stroke({ width: 1, color: 0xffffff, alpha: 0.9 });
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    this.redrawSelectionRing();
  }

  public update(deltaFrames: number): void {
    if (this.isSelected) {
      this.pulsePhase += 0.08 * deltaFrames;
      this.redrawSelectionRing();
    }
  }

  private redrawSelectionRing(): void {
    this.selectionGraphics.clear();

    if (!this.isSelected) return;

    const pulseScale = 1.0 + Math.sin(this.pulsePhase) * 0.12;
    const ringRadius = 15 * pulseScale;

    // Glowing active selection circle
    this.selectionGraphics
      .circle(0, 0, ringRadius)
      .stroke({ width: 2, color: 0x38bdf8, alpha: 0.9 })
      .fill({ color: 0x38bdf8, alpha: 0.12 });

    // Player key number badge indicator (e.g. [1])
    this.selectionGraphics
      .circle(0, 14, 4)
      .fill({ color: 0x38bdf8, alpha: 0.9 });
  }

  public setPosition(x: number, y: number): void {
    this.container.position.set(x, y);
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.container.position.x, y: this.container.position.y };
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
