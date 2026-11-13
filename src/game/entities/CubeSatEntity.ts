import { Container, Graphics } from 'pixi.js';
import { CubeSatFormFactor } from '../../types/cubesat';

export class CubeSatEntity {
  public readonly container: Container;
  private readonly busGraphics: Graphics;
  private readonly solarPanelsGraphics: Graphics;
  private readonly thrusterGraphics: Graphics;
  private readonly payloadGraphics: Graphics;

  private isSolarDeployed: boolean = true;
  private isThrusting: boolean = false;
  private isInEclipse: boolean = false;
  private formFactor: CubeSatFormFactor = '3U';

  constructor() {
    this.container = new Container();

    this.thrusterGraphics = new Graphics();
    this.solarPanelsGraphics = new Graphics();
    this.busGraphics = new Graphics();
    this.payloadGraphics = new Graphics();

    this.container.addChild(
      this.thrusterGraphics,
      this.solarPanelsGraphics,
      this.busGraphics,
      this.payloadGraphics
    );
  }

  public setConfiguration(formFactor: CubeSatFormFactor, isDeployed: boolean): void {
    this.formFactor = formFactor;
    this.isSolarDeployed = isDeployed;
    this.redrawChassis();
  }

  public setFlightDynamics(isThrusting: boolean, isInEclipse: boolean): void {
    this.isThrusting = isThrusting;
    this.isInEclipse = isInEclipse;
    this.redrawChassis();
  }

  public updatePositionAndOrientation(x: number, y: number, angleRad: number): void {
    this.container.position.set(x, y);
    // Face tangential to orbit direction (prograde vector)
    this.container.rotation = angleRad + Math.PI / 2;
  }

  private redrawChassis(): void {
    this.busGraphics.clear();
    this.solarPanelsGraphics.clear();
    this.thrusterGraphics.clear();
    this.payloadGraphics.clear();

    const uMultiplier = this.formFactor === '1U' ? 1 : this.formFactor === '3U' ? 2 : 2.8;
    const bodyWidth = 14;
    const bodyHeight = 10 * uMultiplier;

    // 1. Bus Chassis Frame
    const frameColor = this.isInEclipse ? 0x334155 : 0x94a3b8;
    const coreColor = this.isInEclipse ? 0x0f172a : 0x1e293b;

    this.busGraphics
      .roundRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight, 2)
      .fill({ color: coreColor, alpha: 0.95 })
      .stroke({ width: 1.5, color: frameColor, alpha: 1 });

    // Gold multi-layer insulation (MLI) foil accents
    this.busGraphics
      .rect(-bodyWidth / 2 + 2, -bodyHeight / 2 + 2, bodyWidth - 4, bodyHeight - 4)
      .fill({ color: 0xd97706, alpha: this.isInEclipse ? 0.2 : 0.65 });

    // 2. Solar Arrays (Deployed or Stowed)
    const panelColor = this.isInEclipse ? 0x1e3a8a : 0x0284c7;
    const panelBorder = this.isInEclipse ? 0x172554 : 0x38bdf8;
    const panelWidth = this.isSolarDeployed ? 20 : 3;
    const panelHeight = bodyHeight * 0.8;

    // Left Array Wing
    this.solarPanelsGraphics
      .rect(-bodyWidth / 2 - panelWidth, -panelHeight / 2, panelWidth, panelHeight)
      .fill({ color: panelColor, alpha: 0.9 })
      .stroke({ width: 1, color: panelBorder, alpha: 0.8 });

    // Right Array Wing
    this.solarPanelsGraphics
      .rect(bodyWidth / 2, -panelHeight / 2, panelWidth, panelHeight)
      .fill({ color: panelColor, alpha: 0.9 })
      .stroke({ width: 1, color: panelBorder, alpha: 0.8 });

    // 3. Payload Aperture (Nadir direction)
    this.payloadGraphics
      .circle(0, bodyHeight / 2, 3)
      .fill({ color: 0x38bdf8, alpha: 0.9 })
      .stroke({ width: 1, color: 0xffffff, alpha: 0.8 });

    // 4. Thruster Exhaust Plume (When actively executing delta-V burn)
    if (this.isThrusting) {
      const plumeLength = 16 + Math.random() * 6;
      this.thrusterGraphics
        .poly([
          -3, -bodyHeight / 2,
          3, -bodyHeight / 2,
          0, -bodyHeight / 2 - plumeLength,
        ])
        .fill({ color: 0x06b6d4, alpha: 0.85 });

      this.thrusterGraphics
        .poly([
          -1.5, -bodyHeight / 2,
          1.5, -bodyHeight / 2,
          0, -bodyHeight / 2 - plumeLength * 0.6,
        ])
        .fill({ color: 0xffffff, alpha: 0.95 });
    }
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
