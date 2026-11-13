import { Container, Graphics } from 'pixi.js';

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

export class StarfieldSystem {
  public readonly container: Container;
  private readonly starsGraphics: Graphics;
  private stars: Star[] = [];
  private width: number = 800;
  private height: number = 600;

  constructor() {
    this.container = new Container();
    this.starsGraphics = new Graphics();
    this.container.addChild(this.starsGraphics);
  }

  public initStars(width: number, height: number, count: number = 180): void {
    this.width = width;
    this.height = height;
    this.stars = [];

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() < 0.85 ? 1 : 1.5,
        alpha: 0.2 + Math.random() * 0.7,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    this.renderStars();
  }

  public update(deltaFrames: number): void {
    let needsRedraw = false;

    for (const star of this.stars) {
      star.twinklePhase += star.twinkleSpeed * deltaFrames;
      if (star.twinklePhase > Math.PI * 2) {
        star.twinklePhase -= Math.PI * 2;
      }
      needsRedraw = true;
    }

    if (needsRedraw) {
      this.renderStars();
    }
  }

  private renderStars(): void {
    this.starsGraphics.clear();

    for (const star of this.stars) {
      const alphaMod = 0.5 + 0.5 * Math.sin(star.twinklePhase);
      const currentAlpha = star.alpha * alphaMod;
      this.starsGraphics
        .circle(star.x, star.y, star.radius)
        .fill({ color: 0xe2e8f0, alpha: currentAlpha });
    }
  }

  public resize(width: number, height: number): void {
    this.initStars(width, height, this.stars.length || 180);
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
