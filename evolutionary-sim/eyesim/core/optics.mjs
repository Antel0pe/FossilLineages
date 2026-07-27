/**
 * Perception. The whole sensory model is here and it is pure physics:
 *
 *   morphology -> optics -> photon catch (Land) -> SNR (Rose) -> detection
 *
 * INVARIANT: nothing downstream of this file may branch on a Nilsson "class".
 * Classes are computed only in nilssonClass() below, and only for reporting.
 */
import {
  LAMBDA, K_ABSORB, MEMBRANE_LAYER_THICKNESS, SNR_THRESHOLD,
  T_WATER, T_OCULAR, SUBSTRATE_REFLECTANCE, BG_HORIZONTAL_FRACTION,
} from './constants.mjs';

const PI = Math.PI;
const LAND_K = (PI / 4) * (PI / 4);

/**
 * Characteristic angular velocity of the scene across the retina, rad/s.
 * A 26 mm animal cruising at ~0.05 m/s past targets at a working range of about
 * half a metre sweeps the image at roughly 0.1 rad/s; prey movement adds to it.
 * This sets the cost of a long integration time.
 */
export const REFERENCE_OMEGA = 0.10;

/**
 * Resolve an eye genome into its optical properties.
 * All lengths in micrometres.
 *
 * @param {object} g eye genome (see genome.mjs)
 * @returns {{deltaRho:number, sensitivity:number, pixels:number, apertureUm:number,
 *            focalUm:number, infoRate:number, receptorTissueUm3:number}}
 */
export function resolveEye(g) {
  const cupDiameter = g.patchWidthMm * 1000;            // um
  const R = cupDiameter / 2;
  const v = g.invagination;

  // Aperture: for a flat patch the "aperture" is the whole patch.
  const A = Math.max(1e-3, g.apertureRatio * cupDiameter);

  // Retina-to-aperture distance. A flat patch has no useful focal length.
  const focal = R * (0.5 + v);

  const lensQuality = Math.min(1, Math.max(0, g.lensIndexGradient / 0.33));
  const l = g.membraneLayers * MEMBRANE_LAYER_THICKNESS;
  const absorbed = 1 - Math.exp(-K_ABSORB * l);

  // One continuous formula for every morphology, from bare patch to lens eye.
  // There is deliberately NO special case for "no cup": a hard cutoff would make
  // acuity flat below some invagination, which zeroes the gradient on every other
  // eye gene at once and leaves a plain that only drift can cross. The geometry
  // already handles it — with a wide aperture and a shallow cup, dpDefocus is
  // several radians and deltaRho saturates at pi on its own.
  const dpSampling = g.receptorDiameterUm / focal;
  const dpDiffraction = LAMBDA / A;
  const dpDefocus = (A / focal) * (1 - lensQuality);
  // Motion blur. The scene sweeps across the retina at REFERENCE_OMEGA while the
  // receptor integrates, so a long integration smears everything it sees. Without
  // this term a long integration collects photons for free and nothing pushes
  // integration time down towards Nilsson's 0.05 s.
  const dpMotion = REFERENCE_OMEGA * g.integrationTimeS;
  const deltaRho = Math.min(PI, Math.sqrt(
    dpSampling ** 2 + dpDiffraction ** 2 + dpDefocus ** 2 + dpMotion ** 2));

  // Land sensitivity, um^2 sr. The (d/f)^2 term is the solid angle each receptor sees.
  const dOverF = g.receptorDiameterUm / focal;
  const sensitivity = LAND_K * A * A * dOverF * dOverF * absorbed;

  // Resolvable directions. Without screening pigment the cup leaks and there is
  // effectively one direction however good the optics are.
  const rawPixels = Math.min(g.receptorCount, g.fieldOfViewSr / (deltaRho * deltaRho));
  const pixels = 1 + Math.max(0, rawPixels - 1) * g.screeningPigment;

  const infoRate = pixels / g.integrationTimeS;
  const receptorTissueUm3 =
    g.receptorCount * (PI / 4) * g.receptorDiameterUm ** 2 * Math.max(l, 0.03);

  return { deltaRho, sensitivity, pixels, apertureUm: A, focalUm: focal, lensQuality,
           infoRate, receptorTissueUm3, absorbed };
}

/**
 * Photons absorbed per receptor over one integration period.
 * @param {number} sensitivity um^2 sr (from resolveEye)
 * @param {number} radiance    quanta um^-2 sr^-1 s^-1
 * @param {number} integrationTimeS
 */
export const photonCatch = (sensitivity, radiance, integrationTimeS) =>
  sensitivity * radiance * integrationTimeS * T_WATER * T_OCULAR;

/**
 * Inherent contrast of a body against its background, from the standard equation
 * C = (L_body - L_background) / L_background.
 *
 * @param {number} rhoBody body radiance ratio (0.15 opaque dark .. 0.95 transparent)
 * @param {'up'|'horizontal'|'down'} dir viewing direction from the observer
 */
export function inherentContrast(rhoBody, dir) {
  const bgFrac = dir === 'up' ? 1.0 : dir === 'down' ? SUBSTRATE_REFLECTANCE : BG_HORIZONTAL_FRACTION;
  return (rhoBody - bgFrac) / bgFrac;
}

/**
 * Effective contrast of an object of a given size at a given range, including
 * beam attenuation and the sub-resolution dilution of unresolved targets.
 */
export function effectiveContrast(cInherent, rangeM, objectSizeM, deltaRho, cBeam) {
  const cApparent = cInherent * Math.exp(-cBeam * rangeM);
  const theta = objectSizeM / Math.max(rangeM, 1e-6);
  if (theta >= deltaRho) return cApparent;
  const dilution = (theta / deltaRho) ** 2;
  return cApparent * dilution;
}

/** The Rose criterion. This is the only detection rule in the simulation. */
export const detects = (cEffective, photons) =>
  Math.abs(cEffective) * Math.sqrt(Math.max(photons, 0)) >= SNR_THRESHOLD;

/** Signal-to-noise of a detection, used for percept error magnitudes. */
export const snr = (cEffective, photons) =>
  Math.abs(cEffective) * Math.sqrt(Math.max(photons, 0));

/**
 * Maximum range at which an object is detectable, by bisection on the detection
 * inequality. Returns 0 if it is never detectable.
 *
 * This is a *derived* quantity used for encounter kernels at coarse timesteps —
 * it is not a parameter, and no code sets it.
 */
export function detectionRange(cInherent, objectSizeM, deltaRho, cBeam, sensitivity,
                               radiance, integrationTimeS, maxRangeM = 30) {
  const photons = photonCatch(sensitivity, radiance, integrationTimeS);
  if (photons <= 0) return 0;
  const ok = (r) => detects(effectiveContrast(cInherent, r, objectSizeM, deltaRho, cBeam), photons);
  if (!ok(1e-3)) return 0;
  if (ok(maxRangeM)) return maxRangeM;
  let lo = 1e-3, hi = maxRangeM;
  for (let i = 0; i < 24; i++) {
    const mid = 0.5 * (lo + hi);
    if (ok(mid)) lo = mid; else hi = mid;
  }
  return lo;
}

/**
 * Nilsson class, for REPORTING ONLY. Never call this from behaviour, energy,
 * survival or reproduction code.
 */
export function nilssonClass(eye) {
  const deg = eye.deltaRho * 180 / PI;
  if (eye.pixels < 2) return deg >= 100 ? 1 : 2;
  if (deg > 5) return 3;
  return 4;
}

/** Eye parameter p = D * dPhi, the fossil-comparable summary statistic. */
export const eyeParameter = (g, eye) => g.receptorDiameterUm * eye.deltaRho;
