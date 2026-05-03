export const quizQuestions = [
  { q: 'log₂(64) = ?', opts: ['5', '6', '7', '8'], c: 1, ex: '2⁶=64. Count: 2,4,8,16,32,64 → 6 doublings.' },
  { q: 'log₃(81) = ?', opts: ['3', '4', '5', '2'], c: 1, ex: '3⁴=81. Verify: 3×3×3×3=81 ✓' },
  { q: 'log₁₀(1) = ?', opts: ['0', '1', '10', 'undefined'], c: 0, ex: 'Any log of 1 = 0 because b⁰=1 always.' },
  { q: 'log₅(5) = ?', opts: ['0', '5', '1', 'undefined'], c: 2, ex: 'logₐ(a)=1 always, since a¹=a.' },
  { q: 'log₂(8) + log₂(4) = ?', opts: ['log₂(32)', 'log₂(2)', '12', '5'], c: 0, ex: 'Product rule: log₂(8×4)=log₂(32)=5. Both A and D are correct!' },
  { q: 'log₀.₅(4) = ?', opts: ['2', '-2', '0.5', '-0.5'], c: 1, ex: '(0.5)ˣ=4 → (2⁻¹)ˣ=2² → −x=2 → x=−2 ✓' },
  { q: 'If log₂(x) = −1, what is x?', opts: ['-2', '0.5', '-0.5', '2'], c: 1, ex: '2⁻¹=1/2=0.5. Negative exponent = reciprocal.' },
  { q: 'Which is NOT a valid constraint for logₐ(N)?', opts: ['N > 0', 'a > 0', 'a ≠ 1', 'N ≠ 1'], c: 3, ex: 'N≠1 is NOT required. log(1)=0 is perfectly valid. The three constraints are: N>0, a>0, a≠1.' },
];
