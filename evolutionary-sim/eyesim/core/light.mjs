/**
 * The light field: diel cycle at the surface, exponential attenuation with depth,
 * and background radiance by viewing direction.
 *
 * Radiance is in quanta um^-2 sr^-1 s^-1 throughout so it plugs straight into the
 * Land sensitivity equation in optics.mjs.
 */
import {
  L_NOON, L_TWILIGHT_DEEP, L_FULL_MOON, L_STARLIGHT,
  DAY_LENGTH_H, DAYLIGHT_H, TWILIGHT_H, LUNAR_PERIOD_DAYS,
  KD_UVB_RATIO, C_BEAM_RATIO, SUBSTRATE_REFLECTANCE, BG_HORIZONTAL_FRACTION,
  TURBIDITY_STORM_MULT,
} from './constants.mjs';

const SUNRISE_H = (DAY_LENGTH_H - DAYLIGHT_H) / 2;   // 5.25
const SUNSET_H = SUNRISE_H + DAYLIGHT_H;             // 15.75

export class LightField {
  /** @param {{kdBase:number}} opts */
  constructor({ kdBase }) {
    this.kdBase = kdBase;
    this.turbidityMult = 1.0;
    this.timeS = 0;
    this.recompute();
  }

  /** Advance the clock and refresh the cached per-step light state. */
  setTime(timeS) { this.timeS = timeS; this.recompute(); }

  setTurbidity(mult) { this.turbidityMult = mult; this.recompute(); }

  get kdPar() { return this.kdBase * this.turbidityMult; }
  get kdUvb() { return this.kdPar * KD_UVB_RATIO; }
  get cBeam() { return this.kdPar * C_BEAM_RATIO; }

  recompute() {
    const dayFrac = (this.timeS / 3600) % DAY_LENGTH_H;
    this.hourOfDay = dayFrac;
    this.isDay = dayFrac >= SUNRISE_H && dayFrac <= SUNSET_H;
    this.surfaceRadiance = this.surfaceAt(dayFrac);
  }

  /** Surface radiance for a given hour of the Cambrian day. */
  surfaceAt(hour) {
    const dayNum = Math.floor(this.timeS / 3600 / DAY_LENGTH_H);
    const lunarPhase = (dayNum % LUNAR_PERIOD_DAYS) / LUNAR_PERIOD_DAYS;
    // 0 = new moon, 0.5 = full moon
    const moonBrightness = 0.5 - 0.5 * Math.cos(2 * Math.PI * lunarPhase);
    const nightFloor = L_STARLIGHT + moonBrightness * (L_FULL_MOON - L_STARLIGHT);

    if (hour < SUNRISE_H - TWILIGHT_H || hour > SUNSET_H + TWILIGHT_H) return nightFloor;

    if (hour < SUNRISE_H) {
      const t = (hour - (SUNRISE_H - TWILIGHT_H)) / TWILIGHT_H;
      return nightFloor * Math.pow(L_TWILIGHT_DEEP / nightFloor, t);
    }
    if (hour > SUNSET_H) {
      const t = (hour - SUNSET_H) / TWILIGHT_H;
      return L_TWILIGHT_DEEP * Math.pow(nightFloor / L_TWILIGHT_DEEP, t);
    }
    // Daylight: sinusoidal from twilight level up to noon and back.
    const t = (hour - SUNRISE_H) / DAYLIGHT_H;         // 0..1
    const arch = Math.sin(Math.PI * t);                 // 0..1..0
    return L_TWILIGHT_DEEP * Math.pow(L_NOON / L_TWILIGHT_DEEP, arch);
  }

  /** Downwelling radiance at depth z (m). */
  radianceAt(z) { return this.surfaceRadiance * Math.exp(-this.kdPar * z); }

  /**
   * Background radiance for a given viewing direction.
   * dir: 'up' | 'horizontal' | 'down'
   */
  backgroundRadiance(z, dir) {
    const L = this.radianceAt(z);
    if (dir === 'up') return L;
    if (dir === 'down') return L * SUBSTRATE_REFLECTANCE;
    return L * BG_HORIZONTAL_FRACTION;
  }

  /** UV-B irradiance relative to the surface, for the mortality hazard. */
  uvRelativeAt(z) { return Math.exp(-this.kdUvb * z); }

  static stormTurbidity() { return TURBIDITY_STORM_MULT; }
}
