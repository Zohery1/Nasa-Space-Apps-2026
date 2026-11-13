import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { DECK_ROOMS, RectArea } from '../deck/DeckLayoutConfig';

export class ShipDeckEntity {
  public readonly container: Container;
  private readonly deckGraphics: Graphics;
  private readonly labelsContainer: Container;

  constructor() {
    this.container = new Container();
    this.deckGraphics = new Graphics();
    this.labelsContainer = new Container();

    this.container.addChild(this.deckGraphics, this.labelsContainer);
    this.renderDeck();
    this.renderRoomLabels();
  }

  private renderDeck(): void {
    this.deckGraphics.clear();

    // 1. Outer Ship Hull Silhouette
    this.deckGraphics
      .roundRect(-270, -295, 540, 580, 24)
      .fill({ color: 0x030712, alpha: 0.95 })
      .stroke({ width: 4, color: 0x1e293b, alpha: 1 });

    // 2. Room Floor Plates
    DECK_ROOMS.forEach((room: RectArea) => {
      // Room floor fill
      this.deckGraphics
        .roundRect(room.x, room.y, room.width, room.height, 8)
        .fill({ color: room.color, alpha: 0.85 })
        .stroke({ width: 2, color: room.borderColor, alpha: 0.7 });

      // Sci-fi Floor Tile Grid Lines
      const step = 25;
      for (let gx = room.x + step; gx < room.x + room.width; gx += step) {
        this.deckGraphics
          .poly([gx, room.y, gx, room.y + room.height])
          .stroke({ width: 0.5, color: 0xffffff, alpha: 0.05 });
      }
      for (let gy = room.y + step; gy < room.y + room.height; gy += step) {
        this.deckGraphics
          .poly([room.x, gy, room.x + room.width, gy])
          .stroke({ width: 0.5, color: 0xffffff, alpha: 0.05 });
      }
    });

    // 3. Central Corridor Passageways (Airlock Connections)
    // Vertical corridor (Cockpit <-> Airlock <-> Engine Bay)
    this.deckGraphics
      .rect(-24, -130, 48, 240)
      .fill({ color: 0x0f172a, alpha: 0.95 })
      .stroke({ width: 1.5, color: 0x475569, alpha: 0.6 });

    // Horizontal corridor (Lab <-> Airlock <-> CapCom)
    this.deckGraphics
      .rect(-80, -24, 160, 48)
      .fill({ color: 0x0f172a, alpha: 0.95 })
      .stroke({ width: 1.5, color: 0x475569, alpha: 0.6 });

    // 4. Yellow Hazard Warning Stripes at Airlock Thresholds
    const thresholdPositions = [
      { x: -20, y: -130, w: 40, h: 4 }, // To Cockpit
      { x: -20, y: 110, w: 40, h: 4 },  // To Engine Bay
      { x: -80, y: -20, w: 4, h: 40 },  // To Lab
      { x: 80, y: -20, w: 4, h: 40 },   // To CapCom
    ];

    thresholdPositions.forEach((th) => {
      this.deckGraphics
        .rect(th.x, th.y, th.w, th.h)
        .fill({ color: 0xf59e0b, alpha: 0.9 });
    });
  }

  private renderRoomLabels(): void {
    this.labelsContainer.removeChildren();

    const labelStyle = new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: 10,
      fontWeight: 'bold',
      fill: 0x94a3b8,
      letterSpacing: 2,
    });

    DECK_ROOMS.forEach((room) => {
      const label = new Text({
        text: room.name,
        style: labelStyle,
      });
      label.anchor.set(0.5, 0);
      label.position.set(room.x + room.width / 2, room.y + 6);
      this.labelsContainer.addChild(label);
    });
  }

  public destroy(): void {
    this.container.destroy({ children: true });
  }
}
