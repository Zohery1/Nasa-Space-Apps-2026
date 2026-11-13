import { Container, Graphics, Sprite, Assets } from 'pixi.js';

export interface CrewConfig {
  id: number; // 1 to 4
  roleCode: 'CDR' | 'CAP' | 'ENG' | 'SCI';
  roleName: string;
  suitColor: number;
  visorColor: number;
  spritePath: string;
  initialX: number;
  initialY: number;
}

export class CrewMemberEntity {
  public readonly container: Container;
  public readonly config: CrewConfig;

  private readonly selectionGraphics: Graphics;
  private readonly fallbackGraphics: Graphics;
  private avatarSprite: Sprite | null = null;
  private isSelected: boolean = false;
  private pulsePhase: number = 0;

  constructor(config: CrewConfig) {
    this.config = config;
    this.container = new Container();
    this.container.position.set(config.initialX, config.initialY);

    this.selectionGraphics = new Graphics();
    this.fallbackGraphics = new Graphics();

    this.container.addChild(this.selectionGraphics, this.fallbackGraphics);
    this.renderFallbackAvatar();
    this.loadSprite();
  }

  private renderFallbackAvatar(): void {
    this.fallbackGraphics.clear();
    this.fallbackGraphics
      .circle(0, 0, 14)
      .fill({ color: this.config.suitColor, alpha: 0.95 })
      .stroke({ width: 2, color: 0xffffff, alpha: 0.9 });
  }

  private async loadSprite(): Promise<void> {
    try {
      const texture = await Assets.load(this.config.spritePath);
      if (!texture) return;

      this.avatarSprite = new Sprite(texture);
      this.avatarSprite.anchor.set(0.5, 0.5);
      this.avatarSprite.width = 34;
      this.avatarSprite.height = 34;

      this.container.addChild(this.avatarSprite);
      this.fallbackGraphics.visible = false;
    } catch (err) {
      console.warn(`Crew sprite load failed for ${this.config.roleCode}:`, err);
    }
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
    const ringRadius = 22 * pulseScale;

    // Glowing active selection circle
    this.selectionGraphics
      .circle(0, 0, ringRadius)
      .stroke({ width: 2.5, color: 0x38bdf8, alpha: 0.95 })
      .fill({ color: 0x38bdf8, alpha: 0.15 });

    // Key number badge ring indicator (e.g. [1])
    this.selectionGraphics
      .circle(0, 20, 5)
      .fill({ color: 0x38bdf8, alpha: 0.95 });
  }

  public setPosition(x: number, y: number): void {
    this.container.position.set(x, y);
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.container.position.x, y: this.container.position.y };
  }

  public destroy(): void {
    if (this.avatarSprite) {
      this.avatarSprite.destroy({ texture: false });
    }
    this.container.destroy({ children: true });
  }
}
