import { Container, Ticker } from 'pixi.js';
import { ShipDeckEntity } from '../entities/ShipDeckEntity';
import { CockpitViewportEntity } from '../entities/CockpitViewportEntity';
import { StationTerminalEntity } from '../entities/StationTerminalEntity';
import { CrewMemberEntity, CrewConfig } from '../entities/CrewMemberEntity';
import { CrewControllerSystem } from '../systems/CrewControllerSystem';
import { InteractionSystem } from '../systems/InteractionSystem';
import { STATIONS_CATALOG, CREW_SPAWNS } from '../deck/DeckLayoutConfig';

export class ShipScene {
  public readonly container: Container;
  private readonly deck: ShipDeckEntity;
  private readonly viewport: CockpitViewportEntity;
  private readonly stations: StationTerminalEntity[] = [];
  private readonly crewMembers: CrewMemberEntity[] = [];
  private readonly controller: CrewControllerSystem;
  private readonly interaction: InteractionSystem;

  constructor() {
    this.container = new Container();

    // 1. Deck SVG Map Plate
    this.deck = new ShipDeckEntity();
    this.container.addChild(this.deck.container);

    // 2. Cockpit Viewport (Panoramic glass window above Bridge)
    this.viewport = new CockpitViewportEntity();
    this.container.addChild(this.viewport.container);

    // 3. Station Terminals
    STATIONS_CATALOG.forEach((cfg) => {
      const station = new StationTerminalEntity(cfg);
      this.stations.push(station);
      this.container.addChild(station.container);
    });

    // 4. 4-Crew Member Entities with Authentic SVG Sprites
    const crewConfigs: CrewConfig[] = [
      {
        id: 1,
        roleCode: 'CDR',
        roleName: 'Commander',
        suitColor: 0x1d4ed8,
        visorColor: 0xfbbf24,
        spritePath: CREW_SPAWNS[1].sprite,
        initialX: CREW_SPAWNS[1].x,
        initialY: CREW_SPAWNS[1].y,
      },
      {
        id: 2,
        roleCode: 'CAP',
        roleName: 'CapCom',
        suitColor: 0x0284c7,
        visorColor: 0x22d3ee,
        spritePath: CREW_SPAWNS[2].sprite,
        initialX: CREW_SPAWNS[2].x,
        initialY: CREW_SPAWNS[2].y,
      },
      {
        id: 3,
        roleCode: 'ENG',
        roleName: 'Flight Engineer',
        suitColor: 0xd97706,
        visorColor: 0xfbbf24,
        spritePath: CREW_SPAWNS[3].sprite,
        initialX: CREW_SPAWNS[3].x,
        initialY: CREW_SPAWNS[3].y,
      },
      {
        id: 4,
        roleCode: 'SCI',
        roleName: 'Science Specialist',
        suitColor: 0x059669,
        visorColor: 0x34d399,
        spritePath: CREW_SPAWNS[4].sprite,
        initialX: CREW_SPAWNS[4].x,
        initialY: CREW_SPAWNS[4].y,
      },
    ];

    crewConfigs.forEach((cfg) => {
      const crew = new CrewMemberEntity(cfg);
      this.crewMembers.push(crew);
      this.container.addChild(crew.container);
    });

    // 5. Systems
    this.controller = new CrewControllerSystem(this.crewMembers);
    this.interaction = new InteractionSystem(this.stations);
  }

  public update(ticker: Ticker): void {
    const deltaFrames = ticker.deltaTime;
    const deltaMs = ticker.deltaMS;

    this.controller.update(deltaFrames);
    const activeCrew = this.controller.getActiveCrew();
    this.interaction.update(activeCrew, this.controller.isHoldingE(), deltaMs);
    this.viewport.update(deltaFrames);
  }

  public resize(screenWidth: number, screenHeight: number): void {
    this.container.position.set(screenWidth / 2, screenHeight / 2);
    const minDim = Math.min(screenWidth, screenHeight);
    const scale = Math.min(1.2, Math.max(0.65, minDim / 640));
    this.container.scale.set(scale);
  }

  public setCrisisStage(stage: number): void {
    this.viewport.setCrisisStage(stage);
  }

  public destroy(): void {
    this.controller.destroy();
    this.interaction.destroy();
    this.deck.destroy();
    this.viewport.destroy();
    this.stations.forEach((s) => s.destroy());
    this.crewMembers.forEach((c) => c.destroy());
    this.container.destroy({ children: true });
  }
}
