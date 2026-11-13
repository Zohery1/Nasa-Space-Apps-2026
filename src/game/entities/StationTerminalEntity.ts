import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { StationLocation } from '../deck/DeckLayoutConfig';

export class StationTerminalEntity {
  public readonly container: Container;
  public readonly config: StationLocation;

  private readonly consoleGraphics: Graphics;
  private readonly promptGraphics: Graphics;
  private readonly promptText: Text;
  private isNearby: boolean = false;
  private holdRatio: number = 0; // 0.0 to 1.0

  constructor(config: StationLocation) {
    this.config = config;
    this.container = new Container();
    this.container.position.set(config.x, config.y);

    this.consoleGraphics = new Graphics();
    this.promptGraphics = new Graphics();

    const textStyle = new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: 9,
      fontWeight: 'bold',
      fill: config.themeColor,
      align: 'center',
    });

    this.promptText = new Text({
      text: config.promptText,
      style: textStyle,
    });
    this.promptText.anchor.set(0.5, 1);
    this.promptText.position.set(0, -22);
    this.promptText.visible = false;

    this.container.addChild(this.consoleGraphics, this.promptGraphics, this.promptText);
    this.renderConsole();
  }

  private renderConsole(): void {
    this.consoleGraphics.clear();

    // 1. Terminal Base Mount
    this.consoleGraphics
      .roundRect(-16, -12, 32, 24, 4)
      .fill({ color: 0x0f172a, alpha: 0.95 })
      .stroke({ width: 1.5, color: this.config.themeColor, alpha: 0.8 });

    // 2. Terminal Screen Display Glow
    this.consoleGraphics
      .rect(-11, -8, 22, 16)
      .fill({ color: this.config.themeColor, alpha: 0.3 });

    // 3. Status LED Pulse
    this.consoleGraphics
      .circle(0, 0, 3)
      .fill({ color: this.config.themeColor, alpha: 0.9 });
  }

  public setProximity(nearby: boolean): void {
    this.isNearby = nearby;
    this.promptText.visible = nearby;
    this.redrawPromptAndProgress();
  }

  public setHoldProgress(ratio: number): void {
    this.holdRatio = Math.max(0, Math.min(1.0, ratio));
    this.redrawPromptAndProgress();
  }

  private redrawPromptAndProgress(): void {
    this.promptGraphics.clear();

    if (!this.isNearby && this.holdRatio <= 0) return;

    // Glowing interaction proximity beacon
    if (this.isNearby) {
      this.promptGraphics
        .circle(0, 0, 26)
        .stroke({ width: 1, color: this.config.themeColor, alpha: 0.35 });
    }

    // Radial Hold E Progress Ring (0 to 360 deg)
    if (this.holdRatio > 0) {
      const radius = 22;
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + this.holdRatio * Math.PI * 2;

      // Progress background track
      this.promptGraphics
        .arc(0, 0, radius, 0, Math.PI * 2)
        .stroke({ width: 3, color: 0x334155, alpha: 0.6 });

      // Active radial progress fill
      this.promptGraphics
        .arc(0, 0, radius, startAngle, endAngle)
        .stroke({ width: 3.5, color: 0x22c55e, alpha: 0.95 });

      // Completion Flash
      if (this.holdRatio >= 1.0) {
        this.promptGraphics
          .circle(0, 0, radius + 4)
          .fill({ color: 0x22c55e, alpha: 0.4 });
      }
    }
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
