import { Container, Graphics, Sprite, Assets } from 'pixi.js';

export class ShipDeckEntity {
  public readonly container: Container;
  private readonly fallbackGraphics: Graphics;
  private mapSprite: Sprite | null = null;

  constructor() {
    this.container = new Container();
    this.fallbackGraphics = new Graphics();
    this.container.addChild(this.fallbackGraphics);

    this.renderFallbackBase();
    this.loadDeckSvgMap();
  }

  private renderFallbackBase(): void {
    this.fallbackGraphics.clear();
    // Fallback metallic hull while SVG texture resolves
    this.fallbackGraphics
      .roundRect(-400, -300, 800, 600, 16)
      .fill({ color: 0x0a1128, alpha: 0.95 })
      .stroke({ width: 3, color: 0x0ea5e9, alpha: 0.6 });
  }

  private async loadDeckSvgMap(): Promise<void> {
    try {
      const texture = await Assets.load('/assets/sprites/ship_deck_map.svg');
      if (!texture) return;

      this.mapSprite = new Sprite(texture);
      this.mapSprite.anchor.set(0.5, 0.5);
      this.mapSprite.width = 800;
      this.mapSprite.height = 600;

      this.container.addChild(this.mapSprite);
      this.fallbackGraphics.visible = false;
    } catch (err) {
      console.warn('SVG map texture load fallback:', err);
    }
  }

  public destroy(): void {
    if (this.mapSprite) {
      this.mapSprite.destroy({ texture: false });
    }
    this.container.destroy({ children: true });
  }
}
