/**
 * Static payoff analysis. No simulation, no evolution — just the optics.
 *
 * Answers one question: for a given target and water clarity, over what range of
 * acceptance angles does sharpening the eye actually increase detection range?
 * Acuity is only worth anything where the target is UNRESOLVED (theta < deltaRho);
 * once theta >= deltaRho the dilution term switches off and deltaRho drops out of
 * the detection inequality entirely.
 *
 *   bun evolutionary-sim/eyesim/diagnose.mjs
 */
import * as C from './core/constants.mjs';
import { detectionRange, resolveEye } from './core/optics.mjs';
import { eyeGenes } from './core/genome.mjs';

const PI = Math.PI;
const deg = r => r * 180 / PI;
const rad = d => d * PI / 180;

/** A reference eye with a fixed, generous photon budget, so only deltaRho varies. */
const REFERENCE_SENSITIVITY = 5.0;     // um^2 sr — a decent 0.3 mm cup
const REFERENCE_INTEGRATION = 0.05;    // s

const TARGETS = [
  { name: 'food patch',        sizeM: 10.0,  contrast: 0.30 },
  { name: 'Anomalocaris',      sizeM: 0.35,  contrast: 0.85 },
  { name: 'Isoxys',            sizeM: 0.030, contrast: 0.85 },
  { name: 'chaetognath',       sizeM: 0.020, contrast: 0.85 },
  { name: 'mesozooplankton 2mm', sizeM: 0.002, contrast: 0.60 },
  { name: 'particle 0.5mm',    sizeM: 0.0005, contrast: 0.60 },
];

const KDS = [0.12, 0.18, 0.35, 0.55, 1.00];
const DRHO_DEG = [180, 90, 45, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1];

function surfaceLightAtDepth(kd, z = 8) {
  return C.L_NOON * Math.exp(-kd * z);
}

console.log('\nDETECTION RANGE (m) vs ACCEPTANCE ANGLE, by target and water clarity');
console.log('Reference eye: sensitivity 5.0 um^2 sr, 0.05 s integration, 8 m depth, noon.\n');

for (const kd of KDS) {
  const cBeam = kd * C.C_BEAM_RATIO;
  const horizon = 4 / cBeam;
  const L = surfaceLightAtDepth(kd);
  console.log(`\n--- Kd = ${kd.toFixed(2)}   beam c = ${cBeam.toFixed(2)}   contrast horizon 4/c = ${horizon.toFixed(2)} m ---`);
  console.log('target'.padEnd(22) + DRHO_DEG.map(d => String(d).padStart(7)).join('') + '   acuity pays below');
  for (const t of TARGETS) {
    const ranges = DRHO_DEG.map(d =>
      detectionRange(t.contrast, t.sizeM, rad(d), cBeam,
        REFERENCE_SENSITIVITY, L, REFERENCE_INTEGRATION, 60));
    const best = Math.max(...ranges);
    // The angle at which the target stops being resolved at its own detection
    // range: theta = size / r. Below this deltaRho, sharpening still helps.
    const knee = best > 0 ? deg(t.sizeM / best) : null;
    const gain = best > 0 ? (best / Math.max(ranges[0], 1e-6)) : 0;
    console.log(
      t.name.padEnd(22) +
      ranges.map(r => (r < 0.01 ? '     - ' : r.toFixed(2).padStart(7))).join('') +
      `   ${knee === null ? '  -' : knee.toFixed(2) + ' deg'}  (x${gain.toFixed(0)} range gain)`);
  }
}

/* ------------------------------------------------------------------ */
console.log('\n\nWHERE DOES SHARPENING FROM 20 deg TO 2 deg CHANGE ANYTHING?');
console.log('(ratio of detection range at 2 deg to detection range at 20 deg)\n');
console.log('target'.padEnd(22) + KDS.map(k => ('Kd' + k).padStart(9)).join(''));
for (const t of TARGETS) {
  const row = KDS.map(kd => {
    const cBeam = kd * C.C_BEAM_RATIO;
    const L = surfaceLightAtDepth(kd);
    const r20 = detectionRange(t.contrast, t.sizeM, rad(20), cBeam, REFERENCE_SENSITIVITY, L, REFERENCE_INTEGRATION, 60);
    const r2 = detectionRange(t.contrast, t.sizeM, rad(2), cBeam, REFERENCE_SENSITIVITY, L, REFERENCE_INTEGRATION, 60);
    return r20 > 0.01 ? (r2 / r20) : 0;
  });
  console.log(t.name.padEnd(22) + row.map(v => (v ? v.toFixed(2) + 'x' : '   -  ').padStart(9)).join(''));
}

/* ------------------------------------------------------------------ */
console.log('\n\nPHOTON BUDGET: can a small eye afford a 0.05 s integration at depth?\n');
const testEye = (patchWidthMm, apertureRatio, invagination, lensQ, layers) => {
  const g = { patchWidthMm, invagination, apertureRatio, lensIndexGradient: lensQ * 0.33,
    membraneLayers: layers, screeningPigment: 1, receptorCount: 1e5,
    receptorDiameterUm: 2, integrationTimeS: 0.05, fieldOfViewSr: 6.28 };
  return resolveEye(eyeGenes(g));
};
console.log('eye'.padEnd(34) + 'deltaRho'.padStart(10) + 'sensitivity'.padStart(13)
  + 'N@8m,Kd.55'.padStart(13) + 'N@8m,Kd.12'.padStart(13));
for (const [label, args] of [
  ['flat patch 0.1mm', [0.1, 1.0, 0.0, 0, 1]],
  ['pinhole 0.3mm ap0.1', [0.3, 0.1, 0.8, 0, 100]],
  ['lensed 0.3mm ap0.5', [0.3, 0.5, 0.8, 1, 1000]],
  ['lensed 1.0mm ap0.5', [1.0, 0.5, 0.8, 1, 2000]],
  ['lensed 3.0mm ap0.6', [3.0, 0.6, 0.9, 1, 3000]],
]) {
  const e = testEye(...args);
  const n55 = e.sensitivity * surfaceLightAtDepth(0.55) * 0.05 * 0.8;
  const n12 = e.sensitivity * surfaceLightAtDepth(0.12) * 0.05 * 0.8;
  console.log(label.padEnd(34) + (deg(e.deltaRho).toFixed(3) + 'd').padStart(10)
    + e.sensitivity.toExponential(2).padStart(13)
    + n55.toExponential(2).padStart(13) + n12.toExponential(2).padStart(13));
}
console.log('\n(Rose criterion needs |C|*sqrt(N) >= 2, so N=5000 supports 3% contrast.)');
