# NASA Space Mission Design Game — Data Integrity & Canonical Sources Lock

> **MANDATORY LAW FOR ALL AI AGENTS (Google Antigravity `agy` & OpenAI Codex CLI `codex`)**:
> Any data, physics equation, orbital trajectory, spacecraft component, payload instrument, or mission constraint MUST originate EXCLUSIVELY and VERIFIABLY from the official 9 NASA Space Apps Challenge resources.
> **Zero Deviation / Zero External Fabrication / Zero Hallucination.**

---

## 🔒 The 9 Immutable Official NASA Resources (Sole Source of Truth)

1. **Design and Develop Science Missions (NASA Systems Engineering)**
   - URL: `https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf?emrc=a454cf`
   - Scope: 4 core mission segments (`Launch`, `Space`, `Ground`, `User`), 6 life-cycle phases (`NPR 7120.5F`, `NPR 7120.8A`), and baseline science requirements.

2. **General Mission Analysis Tool (GMAT) R2025a (`GSC-19468-1`)**
   - URL: `https://software.nasa.gov/software/GSC-19468-1`
   - Scope: Tsiolkovsky rocket equation, Vis-Viva orbital speed, Hohmann transfer delta-v, plane change delta-v, and J2 nodal precession.

3. **Concept Maturity Levels (JPL CML Matrix)**
   - URL: `https://dataverse.jpl.nasa.gov/dataset.xhtml?persistentId=hdl:2014/44299`
   - Scope: Progression gating from CML 1 to CML 6+, Science Traceability Matrix (STM), mass margins ($\ge 20\%$), and budget reserves ($\ge 25-30\%$).

4. **Mission Design Lab Disciplines (NASA GSFC MDL)**
   - URL: `https://etd.gsfc.nasa.gov/capabilities/integrated-design-center/mission-design-lab/`
   - Scope: The 16 canonical spacecraft engineering disciplines (ADCS, Cost, Propulsion, Avionics, Mechanical Packaging, Reliability, Flight Dynamics, Flight Software, Mechanical Deployment, Orbital Debris, Radiation TID, Structural Frequency, Communications, Ground Stations, Power EPS/DoD $\le 30\%$, Thermal Balance).

5. **NASA Web-Based Space Mission Visualization (`mission-viz`)**
   - URL: `https://nasa.github.io/mission-viz/`
   - Scope: Authentic GMAT Cartesian ephemeris datasets (ECI J2000 state vectors) and Newton-Raphson analytical Kepler solvers.

6. **JWST "Build It Yourself: Satellite!" (`gametext.pdf`)**
   - URL: `https://science.nasa.gov/mission/webb/game-build-it-yourself/`
   - Scope: 5 science goals (Black Holes, Star Formation, Early Universe, Exoplanets, Galaxies), strict wavelength-compatibility gates, optical design rules (Gamma: no optics; X-ray: grazing cylinders; UV/Optical/IR: monolithic or segmented deployable), and historical benchmark matching against the 7 NASA flagships (Fermi, Chandra, JWST, Spitzer, RXTE/Swift, WMAP/Planck, Hubble).

7. **NASA CubeSat 101 — CSLI Developers Guide**
   - URL: `https://www.nasa.gov/sites/default/files/atoms/files/nasa_csli_cubesat_101_508.pdf`
   - Scope: Standardized 1U, 1.5U, 2U, 3U, 6U, 12U envelopes and mass limits, mandatory autonomous deployable inhibit ($\ge 30\text{ min}$), mandatory RF silence timer ($\ge 45\text{ min}$), 3 independent physical electrical inhibits, UL 1642 battery safety, and FCC/NOAA licensing.

8. **Visualize a Space Mission Using VR (Space Apps 2023)**
   - URL: `https://www.spaceappschallenge.org/2023/challenges/visualize-a-space-mission-using-virtual-reality/`
   - Scope: Real mission trajectory profiles (LEO, SSO, GEO, Earth-Moon TLI/LOI, Earth-Mars Aldrin Cycler, Deep Space asteroid rendezvous).

9. **Canadian Space Agency (CSA) Missions & Activities**
   - URL: `https://www.asc-csa.gc.ca/eng/youth-educators/digital-games-and-activities.asp`
   - Scope: Real mission payloads including RADARSAT Constellation Mission (RCM C-band SAR), OSIRIS-REx OLA LIDAR, and space biology educational gameplay balance.

---

## 🚫 Enforcement Rules

1. **NO Third-Party Or Arbitrary Numbers**: Never invent satellite dry masses, battery capacities, instrument wattages, or propellant delta-v values out of thin air. Every number in `src/data/**` and `src/services/**` must cite one of the 9 sources above in its comments/metadata.
2. **Strict Verification On Merge**: Any PR or commit altering flight values or adding components will be rejected if the values cannot be verified against the 9 resources.
3. **No External Unverified Endpoints**: Live network calls in `src/services/` are restricted to official NASA / JPL / CSA APIs or local ingested datasets in `src/data/`.
