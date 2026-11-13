import { Container, Graphics, Sprite, Assets, Ticker } from 'pixi.js';
import { useGameStore } from '../../store/useGameStore';

export class HazardVisualSystem {
  public readonly container: Container;
  private readonly fireContainer: Container;
  private readonly gasContainer: Container;
  private readonly thermalGraphics: Graphics;

  private fireSprites: Sprite[] = [];
  private gasSprites: Sprite[] = [];
  private thermalPhase: number = 0;
  private currentStage: number = 1;

  constructor() {
    this.container = new Container();
    this.thermalGraphics = new Graphics();
    this.fireContainer = new Container();
    this.gasContainer = new Container();

    this.container.addChild(this.thermalGraphics, this.fireContainer, this.gasContainer);
    this.loadVfxTextures();
  }

  private async loadVfxTextures(): Promise<void> {
    try {
      const [fireTex, gasTex] = await Promise.all([
        Assets.load('/assets/sprites/fx_fire.svg'),
        Assets.load('/assets/sprites/fx_toxic_gas.svg'),
      ]);

      // 1. Stage 1: Engine Room Fire Clusters (Bottom module around y: 140..210)
      const fireOffsets = [
        { x: -50, y: 160, scale: 0.7 },
        { x: 45, y: 175, scale: 0.8 },
        { x: 0, y: 205, scale: 0.95 },
      ];

      fireOffsets.forEach((pos) => {
        const sprite = new Sprite(fireTex);
        sprite.anchor.set(0.5, 0.9);
        sprite.position.set(pos.x, pos.y);
        sprite.scale.set(pos.scale);
        this.fireSprites.push(sprite);
        this.fireContainer.addChild(sprite);
      });

      // 2. Stage 4: Toxic Bio-Gas Clouds (Airlock hub & passages)
      const gasOffsets = [
        { x: 0, y: 0, scale: 0.85 },
        { x: -40, y: -20, scale: 0.65 },
        { x: 40, y: 20, scale: 0.7 },
        { x: 0, y: -70, scale: 0.6 },
      ];

      gasOffsets.forEach((pos) => {
        const sprite = new Sprite(gasTex);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(pos.x, pos.y);
        sprite.scale.set(pos.scale);
        this.gasSprites.push(sprite);
        this.gasContainer.addChild(sprite);
      });
    } catch (err) {
      console.warn('HazardVisualSystem SVG load fallback:', err);
    }
  }

  public setCrisisStage(stage: number): void {
    this.currentStage = stage;
  }

  public update(ticker: Ticker): void {
    const delta = ticker.deltaTime;
    this.thermalPhase += 0.05 * delta;

    // Detect crisis stage from Zustand store if available
    const storeState = useGameStore.getState() as any;
    const activeCrisis = storeState?.activeCrisis;
    const isStage1 = this.currentStage === 1 || activeCrisis?.type === 'PRESSURE_SHOCK_BREACH';
    const isStage3 = this.currentStage === 3 || activeCrisis?.type === 'SOLAR_RADIATION_CME';
    const isStage4 = this.currentStage === 4 || activeCrisis?.type === 'TOXIC_SPORE_INVASION';

    // 1. Stage 1: Engine Room Fire Animation
    this.fireContainer.visible = isStage1;
    if (isStage1 && this.fireSprites.length > 0) {
      this.fireSprites.forEach((f, i) => {
        const flicker = 0.9 + Math.sin(this.thermalPhase * 2 + i * 1.5) * 0.15;
        f.scale.y = (0.7 + i * 0.1) * flicker;
        f.alpha = 0.85 + Math.sin(this.thermalPhase * 3 + i) * 0.15;
      });
    }

    // 2. Stage 3: Thermal Spike / Red Hull Heat Glow
    this.thermalGraphics.clear();
    if (isStage3) {
      const pulseAlpha = 0.15 + Math.sin(this.thermalPhase) * 0.1;
      this.thermalGraphics
        .roundRect(-270, -295, 540, 580, 24)
        .fill({ color: 0xef4444, alpha: pulseAlpha })
        .stroke({ width: 4, color: 0xf87171, alpha: pulseAlpha * 2.5 });
    }

    // 3. Stage 4: Toxic Bio-Gas Cloud Drifting
    this.gasContainer.visible = isStage4;
    if (isStage4 && this.gasSprites.length > 0) {
      this.gasSprites.forEach((g, i) => {
        g.rotation += (0.003 + i * 0.001) * delta;
        const gasAlpha = 0.45 + Math.sin(this.thermalPhase * 0.8 + i) * 0.15;
        g.alpha = Math.max(0.2, gasAlpha);
      });
    }
  }

  public destroy(): void {
    this.fireSprites.forEach((s) => s.destroy({ texture: false }));
    this.gasSprites.forEach((s) => s.destroy({ texture: false }));
    this.container.destroy({ children: true });
  }
}
