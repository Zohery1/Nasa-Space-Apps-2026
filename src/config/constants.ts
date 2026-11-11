/**
 * Game Configuration & Tuning Parameters
 * Role 4 adjusts gameplay balance from here without touching engine code.
 */

export const GAME_CONFIG = {
  FPS: 60,
  CANVAS: {
    BACKGROUND_COLOR: 0x030712,
    ANTIALIAS: true,
  },
  PLAYER: {
    MAX_HP: 100,
    SPEED: 6.5,
    FRICTION: 0.88,
    FIRE_COOLDOWN_MS: 150,
    RADIUS_PX: 22,
    COLOR: 0x00f5d4,
  },
  BULLET: {
    SPEED: 14,
    RADIUS_PX: 4,
    DAMAGE: 1,
    COLOR: 0x00f5d4,
  },
  ASTEROID: {
    MIN_RADIUS_PX: 18,
    MAX_RADIUS_PX: 68,
    MIN_SPEED_PX: 1.5,
    MAX_SPEED_PX: 6.0,
    WAVE_SIZE: 8,
    WAVE_SPEED_MULTIPLIER: 1.1,
  },
  COLORS: {
    NORMAL_TINT: 0xffffff,
    HAZARDOUS_TINT: 0xff3b30,
    SHIELD_COLOR: 0x3b82f6,
    EXPLOSION: 0xf59e0b,
  },
} as const;
