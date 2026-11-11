# 🛰️ NASA Official Audio Library & Sound Integration Guide

This guide details authentic NASA audio assets to integrate into the game's soundscape using **Howler.js**. Using real NASA audio significantly elevates presentation credibility and jury scoring.

---

## 🎧 Official NASA Audio Sources & Repositories

1. **NASA Sound Collection (Public Domain / Free to Use):**
   - **Official NASA Sounds Portal:** [https://www.nasa.gov/connect/sounds/index.html](https://www.nasa.gov/connect/sounds/index.html)
   - **NASA on SoundCloud (Downloadable WAV/MP3):** [https://soundcloud.com/nasa](https://soundcloud.com/nasa)
   - **Internet Archive NASA Audio Archive:** [https://archive.org/details/nasaaudio](https://archive.org/details/nasaaudio)

---

## 🎯 Recommended Audio Assets by In-Game Function

| Game Event | Recommended NASA Sound Sample | Source Tag / Search Query | Purpose / Impact |
|---|---|---|---|
| **Mission Start / Launch** | Apollo 11 Countdown ("10, 9, 8... Ignition... Liftoff!") | `Apollo 11 Countdown` | Creates immediate tension and realism at game launch. |
| **Intro / Briefing** | Quindar Tones + CapCom ("Go for throttle up", "We copy you down, Eagle") | `Quindar Tones` / `Mission Control Comms` | Classic space mission radio chatter before gameplay begins. |
| **Ambient Background** | Voyager / Cassini Plasma Wave Sounds | `Spooky Space Sounds` / `Plasma Waves` | Eerie, authentic cosmic background drone without loud music. |
| **Alert / Danger Approaching** | Sputnik Beep / Kepler Star Oscillations | `Sputnik Beep` / `Kepler Light Curve Sounds` | Radar warning when a dangerous or high-priority event occurs. |
| **Mission Complete / Win** | "The Eagle has landed" / "Touchdown confirmed" | `Apollo 11 Landing` | Celebratory payoff upon surviving a wave or winning. |

---

## 🛠️ How to Add Audio to the Game (`Role 3 & Role 4`)

1. **Download the audio file** (MP3 or WAV) from the links above.
2. **Place the file** in `public/assets/audio/` (e.g., `public/assets/audio/countdown.mp3`).
3. **Instantiate via Howler.js in `src/audio/`:**
   ```ts
   import { Howl } from 'howler';

   export const ambientRadio = new Howl({
     src: ['/assets/audio/plasma_drone.mp3'],
     loop: true,
     volume: 0.25, // Keep ambient sounds low (20-30%)
   });

   export const alertBeep = new Howl({
     src: ['/assets/audio/quindar_beep.wav'],
     volume: 0.6,
   });
   ```
4. **Best Practices for the Hackathon:**
   - Keep total audio asset size under 5 MB so the game loads instantly on jury laptops.
   - Always provide a Mute/Unmute audio toggle button on the UI (`Role 3`).
