import { Container, Graphics } from 'pixi.js';

interface MeteorParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  depth: number; // 0 (far) to 1 (at window)
  size: number;
}

export class CockpitViewportEntity {
  public readonly container: Container;
  private readonly windowFrameGraphics: Graphics;
  private readonly starsGraphics: Graphics;
  private readonly meteorsGraphics: Graphics;
  private readonly landingBoxGraphics: Graphics;

  private meteors: MeteorParticle[] = [];
  private currentStage: number = 1; // 1 to 4
  private targetBoxPhase: number = 0;

  constructor() {
    this.container = new Container();
    this.container.position.set(0, -280); // Placed at top edge of Cockpit

    this.starsGraphics = new Graphics();
    this.meteorsGraphics = new Graphics();
    this.landingBoxGraphics = new Graphics();
    this.windowFrameGraphics = new Graphics();

    this.container.addChild(
      this.starsGraphics,
      this.meteorsGraphics,
      this.landingBoxGraphics,
      this.windowFrameGraphics
    );

    this.initMeteors();
    this.renderWindowFrame();
  }

  private renderWindowFrame(): void {
    this.windowFrameGraphics.clear();

    // Curved Panoramic Glass Canopy
    this.windowFrameGraphics
      .roundRect(-140, -45, 280, 50, 16)
      .fill({ color: 0x020617, alpha: 0.9 })
      .stroke({ width: 3, color: 0x38bdf8, alpha: 0.85 });

    // Glass tint reflection highlight
    this.windowFrameGraphics
      .poly([-120, -40, 120, -40, 90, -25, -90, -25])
      .fill({ color: 0x38bdf8, alpha: 0.08 });
  }

  private initMeteors(): void {
    this.meteors = [];
    for (let i = 0; i < 18; i++) {
      this.meteors.push({
        x: (Math.random() - 0.5) * 200,
        y: -30 + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 0.5 + Math.random() * 1.5,
        depth: Math.random(),
        size: 1 + Math.random() * 3,
      });
    }
  }

  public setCrisisStage(stage: number): void {
    this.currentStage = stage;
  }

  public update(deltaFrames: number): void {
    this.targetBoxPhase += 0.03 * deltaFrames;

    // 1. Render Meteors (Crisis Stage 2: Meteor Storm)
    this.meteorsGraphics.clear();
    if (this.currentStage === 2) {
      for (const m of this.meteors) {
        m.depth += 0.015 * deltaFrames;
        m.x += m.vx * m.depth * 2;
        m.y += m.vy * m.depth * 2;

        if (m.depth >= 1.0 || Math.abs(m.x) > 130 || m.y > 5) {
          m.x = (Math.random() - 0.5) * 180;
          m.y = -35 + (Math.random() - 0.5) * 10;
          m.depth = 0.05;
        }

        const currentRadius = m.size * (0.5 + m.depth * 2.5);
        const alpha = Math.min(1.0, m.depth * 1.2);

        // Meteor fiery tail & rock
        this.meteorsGraphics
          .circle(m.x, m.y, currentRadius)
          .fill({ color: 0xf97316, alpha })
          .stroke({ width: 1, color: 0xfef08a, alpha });
      }
    }

    // 2. Render Green Landing Target Box (Crisis Stage 4: Atmospheric Insertion)
    this.landingBoxGraphics.clear();
    if (this.currentStage === 4) {
      // Box gently sways horizontally to simulate aerodynamic entry corridor
      const boxX = Math.sin(this.targetBoxPhase) * 35;
      const boxY = -22 + Math.cos(this.targetBoxPhase * 0.7) * 8;
      const boxW = 50;
      const boxH = 34;

      // Outer green corridor bracket
      this.landingBoxGraphics
        .rect(boxX - boxW / 2, boxY - boxH / 2, boxW, boxH)
        .stroke({ width: 1.5, color: 0x22c55e, alpha: 0.9 })
        .fill({ color: 0x22c55e, alpha: 0.08 });

      // HUD Corner Tick Marks
      const tick = 6;
      // Top-Left
      this.landingBoxGraphics
        .poly([boxX - boxW / 2, boxY - boxH / 2 + tick, boxX - boxW / 2, boxY - boxH / 2, boxX - boxW / 2 + tick, boxY - boxH / 2])
        .stroke({ width: 2, color: 0x86efac, alpha: 1 });
      // Top-Right
      this.landingBoxGraphics
        .poly([boxX + boxW / 2 - tick, boxY - boxH / 2, boxX + boxW / 2, boxY - boxH / 2, boxX + boxW / 2, boxY - boxH / 2 + tick])
        .stroke({ width: 2, color: 0x86efac, alpha: 1 });
      // Bottom-Left
      this.landingBoxGraphics
        .poly([boxX - boxW / 2, boxY + boxH / 2 - tick, boxX - boxW / 2, boxY + boxH / 2, boxX - boxW / 2 + tick, boxY + boxH / 2])
        .stroke({ width: 2, color: 0x86efac, alpha: 1 });
      // Bottom-Right
      this.landingBoxGraphics
        .poly([boxX + boxW / 2 - tick, boxY + boxH / 2, boxX + boxW / 2, boxY + boxH / 2, boxX + boxW / 2, boxY + boxH / 2 - tick])
        .stroke({ width: 2, color: 0x86efac, alpha: 1 });

      // Center Aim Reticle
      this.landingBoxGraphics
        .circle(boxX, boxY, 3)
        .fill({ color: 0x22c55e, alpha: 0.9 });
    }
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
