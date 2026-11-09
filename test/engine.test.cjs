/* Numerical checks for the transfer-function engine. Run: node test/engine.test.cjs */
const assert = require('node:assert');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const ctx = { console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'src', 'engine.js'), 'utf8'), ctx);
const E = ctx.createControlEngine();

function near(actual, expected, tol, label) {
  assert.ok(Math.abs(actual - expected) <= tol, `${label}: expected ${expected}, got ${actual}`);
}

// Parsing and polynomial expansion
const p1 = E.parseTransfer('10/(s*(s+1)*(s+2))');
assert.ok(p1.ok);
assert.strictEqual(JSON.stringify(p1.tf.d.map((x) => x.a)), JSON.stringify([0, 2, 3, 1]));
assert.strictEqual(JSON.stringify(p1.tf.n.map((x) => x.a)), JSON.stringify([10]));
assert.strictEqual(p1.tf.type, 1);

const p2 = E.parseTransfer('G(s) = (s+2)/(s^2+2s+5)');
assert.ok(p2.ok);
assert.strictEqual(JSON.stringify(p2.tf.n.map((x) => x.a)), JSON.stringify([2, 1]));
assert.strictEqual(JSON.stringify(p2.tf.d.map((x) => x.a)), JSON.stringify([5, 2, 1]));

// Delay detection
const p3 = E.parseTransfer('e^(-0.5s)/(s+1)');
assert.ok(p3.ok);
near(p3.tf.delay, 0.5, 1e-12, 'delay');
assert.strictEqual(p3.tf.hasK, false);

// Parameter K in denominator: 3/((Ks+3)(s+1)) -> A=3s+6, B=s^2+s
const p4 = E.parseTransfer('3/((K*s+3)*(s+1))');
assert.ok(p4.ok);
assert.strictEqual(p4.tf.hasK, true);
assert.ok(E.parseTransfer('3/[(K*s+3)*(s+1)]').ok, 'square brackets are grouping');
const a4 = E.analyze('3/((K*s+3)*(s+1))', 1);
assert.ok(a4.ok);
assert.strictEqual(JSON.stringify(a4.rootLocus.A), JSON.stringify([6, 3]));
assert.strictEqual(JSON.stringify(a4.rootLocus.B), JSON.stringify([0, 1, 1]));

// Bode hand checks
function pointAt(expr, w) {
  const a = E.analyze(expr, 1);
  assert.ok(a.ok);
  let best = a.bode.points[0];
  for (const p of a.bode.points) if (Math.abs(p.w - w) < Math.abs(best.w - w)) best = p;
  return best;
}
let bp = pointAt('1/(s+1)', 1);
near(bp.magDb, -3.0103, 0.02, 'first-order magnitude');
near(bp.phaseDeg, -45, 0.2, 'first-order phase');

bp = pointAt('e^(-0.5s)/(s+1)', 1);
near(bp.phaseDeg, -45 - 0.5 * 180 / Math.PI, 0.2, 'delay phase');

// DC gain exactly 1 gives a boundary gain crossover at ω→0⁺.
const firstOrder = E.analyze('1/(s+1)', 1);
near(firstOrder.summary.pm, 180, 0.2, 'first-order phase margin');
assert.strictEqual(firstOrder.bode.primaryGain.w, 0);

// Known margins for 10/(s(s+1)(s+2)): unstable, PM and GM negative
const a1 = E.analyze('10/(s*(s+1)*(s+2))', 1);
assert.ok(a1.ok);
assert.ok(a1.bode.primaryGain);
near(a1.bode.primaryGain.pm, -12.997, 0.1, 'PM');
near(a1.bode.worstGm.gmDb, -4.437, 0.05, 'GM');
assert.strictEqual(a1.summary.closedStable, false);

// Nyquist encirclement checks
const n1 = E.analyze('2/(s-1)', 1);
assert.strictEqual(n1.nyquist.P, 1);
assert.strictEqual(n1.nyquist.Ncw, -1);
assert.strictEqual(n1.nyquist.Z, 0);
assert.strictEqual(n1.nyquist.stability.stable, true);

const n2 = E.analyze('1/(s-2)', 1);
assert.strictEqual(n2.nyquist.P, 1);
assert.strictEqual(n2.nyquist.Ncw, 0);
assert.strictEqual(n2.nyquist.Z, 1);
assert.strictEqual(n2.nyquist.stability.stable, false);

// Equal numerator/denominator degree: the RHP arc at infinity maps to the
// leading-coefficient ratio, not to the origin. This case would be missed if
// the closure point were hard-coded to zero.
const n3 = E.analyze('(1-2*s)/(1+0.1*s)', 1);
assert.strictEqual(n3.nyquist.P, 0);
assert.strictEqual(n3.nyquist.Z, 1);
assert.strictEqual(n3.nyquist.stability.stable, false);

// Root locus textbook checks: 1/(s(s+1)(s+2))
const a3 = E.analyze('1/(s*(s+1)*(s+2))', 1);
assert.ok(a3.rootLocus.ok);
const jw = a3.rootLocus.imagCross.find((x) => x.w > 1);
assert.ok(jw, 'expected a jw crossing');
near(jw.w, Math.SQRT2, 0.002, 'jw crossing frequency');
near(jw.K, 6, 0.01, 'jw crossing gain');
const br = a3.rootLocus.breakaways.find((b) => b.s < -0.4 && b.s > -0.45);
assert.ok(br, 'expected breakaway near -0.4226');
near(br.K, 0.3849, 0.01, 'breakaway gain');
assert.strictEqual(a3.rootLocus.stableRanges.length, 1);
near(a3.rootLocus.stableRanges[0].to, 6, 0.01, 'stable range end');

// Reversed parameter case: two real breakaways at 9 ± 6*sqrt(2),
// and the locus starts at -2 and infinity, ending at 0 and -1.
near(a4.rootLocus.breakaways[0].s, -3.41421356, 0.01, 'param breakaway 1');
near(a4.rootLocus.breakaways[1].s, -0.58578644, 0.01, 'param breakaway 2');
assert.strictEqual(a4.rootLocus.asymptote.reversed, true);
assert.strictEqual(a4.rootLocus.n, 2);

// The complex segment of 3/[(Ks+3)(s+1)] is a circle centered at -2 with
// radius sqrt(2). Every complex branch point must satisfy that equation, and
// the focused view must not be swamped by the K -> 0 tail going to infinity.
let circleCount = 0;
for (const branch of a4.rootLocus.branches) {
  for (const p of branch) {
    if (Math.abs(p.im) > 1e-3) {
      circleCount++;
      near(Math.hypot(p.re + 2, p.im), Math.SQRT2, 1e-6, 'circular locus point');
    }
  }
}
assert.ok(circleCount > 100, 'expected a sampled circular segment');
assert.ok(a4.rootLocus.plot.minX > -10 && a4.rootLocus.plot.maxX < 3, 'circular locus view is focused');

// A second circular locus: (s+6)/((s+3)(s+1)). The complex segment is the
// circle centered at -6 with radius sqrt(15). Branch tracking must not swap
// from +j to -j between consecutive K values (that produced a vertical line).
const a7 = E.analyze('1*(s+6)/((s+3)*(s+1))', 1);
let maxImJump = 0, circle7 = 0;
for (const branch of a7.rootLocus.branches) {
  for (let i = 0; i < branch.length; i++) {
    if (i) maxImJump = Math.max(maxImJump, Math.abs(branch[i].im - branch[i - 1].im));
    if (Math.abs(branch[i].im) > 1e-3) {
      circle7++;
      near(Math.hypot(branch[i].re + 6, branch[i].im), Math.sqrt(15), 1e-6, 'second circular locus point');
    }
  }
}
assert.ok(circle7 > 100, 'expected the second circular segment');
assert.ok(maxImJump < 2, `branch tracking should be continuous, got imaginary jump ${maxImJump}`);

// Pure delay root locus must be available through the Padé path.
const a5 = E.analyze('e^(-0.5*s)/(s+1)', 1);
assert.ok(a5.rootLocus.ok);
assert.ok(a5.rootLocus.pade);
assert.ok(a5.rootLocus.n >= 3);

// Unstable root locus with no stabilizing K>0: 1/(s^2(s+1))
const a6 = E.analyze('1/(s^2*(s+1))', 1);
assert.ok(a6.rootLocus.ok);
assert.strictEqual(a6.rootLocus.stableRanges.length, 0);

// Parsing rejects malformed and nonlinear-K inputs clearly.
assert.strictEqual(E.parseTransfer('1/(s+').ok, false);
assert.strictEqual(E.parseTransfer('1/(s+K^2)').ok, false);
assert.strictEqual(E.parseTransfer('e^(-s)+1/(s+1)').ok, false);

console.log('engine tests passed');
