import { Container, Graphics, Sprite, Assets } from 'pixi.js';

interface MeteorParticle {
  sprite?: Sprite;
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number;
  size: number;
}

export class CockpitViewportEntity {
  public readonly container: Container;
  private readonly windowFrameGraphics: Graphics;
  private readonly meteorsContainer: Container;
  private targetSprite: Sprite | null = null;
  private meteorTexture: any = null;

  private meteors: MeteorParticle[] = [];
  private currentStage: number = 1;
  private targetBoxPhase: number = 0;

  constructor() {
    this.container = new Container();
    this.container.position.set(0, -280);

    this.meteorsContainer = new Container();
    this.windowFrameGraphics = new Graphics();

    this.container.addChild(this.meteorsContainer, this.windowFrameGraphics);

    this.renderWindowFrame();
    this.loadVfxTextures();
  }

  private renderWindowFrame(): void {
    this.windowFrameGraphics.clear();
    // Curved Panoramic Glass Canopy
    this.windowFrameGraphics
      .roundRect(-140, -45, 280, 50, 16)
      .fill({ color: 0x020617, alpha: 0.9 })
      .stroke({ width: 3, color: 0x38bdf8, alpha: 0.85 });
    // Glass reflection
    this.windowFrameGraphics
      .poly([-120, -40, 120, -40, 90, -25, -90, -25])
      .fill({ color: 0x38bdf8, alpha: 0.08 });
  }

  private async loadVfxTextures(): Promise<void> {
    try {
      const [meteorTex, targetTex] = await Promise.all([
        Assets.load('/assets/sprites/fx_meteor.svg'),
        Assets.load('/assets/sprites/fx_reentry_target.svg'),
      ]);

      this.meteorTexture = meteorTex;
      this.initMeteorSprites();

      this.targetSprite = new Sprite(targetTex);
      this.targetSprite.anchor.set(0.5, 0.5);
      this.targetSprite.width = 46;
      this.targetSprite.height = 46;
      this.targetSprite.visible = false;
      this.container.addChild(this.targetSprite);
    } catch (e) {
      console.warn('Viewport SVG textures load fallback:', e);
    }
  }

  private initMeteorSprites(): void {
    if (!this.meteorTexture) return;
    this.meteors = [];

    for (let i = 0; i < 8; i++) {
      const sprite = new Sprite(this.meteorTexture);
      sprite.anchor.set(0.5, 0.5);
      this.meteorsContainer.addChild(sprite);

      this.meteors.push({
        sprite,
        x: (Math.random() - 0.5) * 160,
        y: -35 + (Math.random() - 0.5) * 15,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 0.6 + Math.random() * 1.2,
        depth: Math.random(),
        size: 14 + Math.random() * 10,
      });
    }
  }

  public setCrisisStage(stage: number): void {
    this.currentStage = stage;
  }

  public update(deltaFrames: number): void {
    this.targetBoxPhase += 0.03 * deltaFrames;

    // 1. Stage 2: Meteor Field in Viewport
    const isStage2 = this.currentStage === 2;
    this.meteorsContainer.visible = isStage2;

    if (isStage2 && this.meteors.length > 0) {
      for (const m of this.meteors) {
        m.depth += 0.015 * deltaFrames;
        m.x += m.vx * m.depth * 2;
        m.y += m.vy * m.depth * 2;

        if (m.depth >= 1.0 || Math.abs(m.x) > 120 || m.y > 0) {
          m.x = (Math.random() - 0.5) * 140;
          m.y = -35 + (Math.random() - 0.5) * 10;
          m.depth = 0.05;
        }

        if (m.sprite) {
          m.sprite.position.set(m.x, m.y);
          const currentSize = m.size * (0.3 + m.depth * 1.2);
          m.sprite.width = currentSize;
          m.sprite.height = currentSize;
          m.sprite.alpha = Math.min(1.0, m.depth * 1.5);
          m.sprite.rotation += 0.05 * deltaFrames;
        }
      }
    }

    // 2. Stage 4: Atmospheric Entry Corridor Target Box
    if (this.targetSprite) {
      const isStage4 = this.currentStage === 4;
      this.targetSprite.visible = isStage4;

      if (isStage4) {
        const targetX = Math.sin(this.targetBoxPhase) * 35;
        const targetY = -22 + Math.cos(this.targetBoxPhase * 0.7) * 8;
        this.targetSprite.position.set(targetX, targetY);
      }
    }
  }

  public destroy(): void {
    this.meteors.forEach((m) => m.sprite?.destroy({ texture: false }));
    this.targetSprite?.destroy({ texture: false });
    this.container.destroy({ children: true });
  }
}
