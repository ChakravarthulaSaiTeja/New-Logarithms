export const laws = [
  {
    num: 1,
    title: 'Product Rule',
    formula: 'logₐ(mn) = logₐm + logₐn',
    steps: [
      { eq: 'Let logₐ(m)=x, logₐ(n)=y', why: 'Assign variables' },
      { eq: 'Then aˣ=m, aʸ=n', why: 'Convert to exponent form' },
      { eq: 'mn = aˣ·aʸ = aˣ⁺ʸ', why: 'Multiply, use exponent product rule' },
      { eq: 'logₐ(mn) = x+y', why: 'Take log of both sides' },
      { eq: 'logₐ(mn) = logₐm + logₐn ✓', why: 'Substitute back' },
    ],
    ex: { lbl: 'Example', eqs: ['log₂(4×8)', '= log₂4 + log₂8', '= 2 + 3', '= 5'], verify: 'Check: log₂(32)=5 since 2⁵=32 ✓' },
  },
  {
    num: 2,
    title: 'Quotient Rule',
    formula: 'logₐ(m/n) = logₐm − logₐn',
    steps: [
      { eq: 'Let logₐ(m)=x, logₐ(n)=y', why: 'Assign variables' },
      { eq: 'm=aˣ, n=aʸ', why: 'Exponent form' },
      { eq: 'm/n = aˣ/aʸ = aˣ⁻ʸ', why: 'Divide, use quotient rule' },
      { eq: 'logₐ(m/n) = x−y ✓', why: 'Take log, substitute back' },
    ],
    ex: { lbl: 'Example', eqs: ['log₂(32/4)', '= log₂32 − log₂4', '= 5 − 2', '= 3'], verify: 'Check: log₂(8)=3 ✓' },
  },
  {
    num: 3,
    title: 'Power Rule (argument)',
    formula: 'logₐ(mᵇ) = b·logₐm',
    steps: [
      { eq: 'Let logₐ(mᵇ)=p', why: 'Assign' },
      { eq: 'aᵖ = mᵇ → m = aᵖ/ᵇ', why: 'Take b-th root' },
      { eq: 'p/b = logₐm → p = b·logₐm ✓', why: 'Definition of log' },
    ],
    ex: { lbl: 'Example', eqs: ['log₂(8³)', '= 3·log₂8', '= 3×3', '= 9'], verify: 'Check: 2⁹=512=8³ ✓' },
  },
  {
    num: 4,
    title: 'Power Rule (base)',
    formula: 'logₐᵇ(m) = (1/b)·logₐm',
    steps: [
      { eq: 'Let logₐᵇ(m)=p → (aᵇ)ᵖ=m → m=aᵇᵖ', why: 'Exponent form' },
      { eq: 'logₐm = bp → p = (1/b)logₐm ✓', why: 'Apply log, rearrange' },
    ],
    ex: { lbl: 'Combined', eqs: ['logₐᵇ(mᶜ) = (c/b)·logₐm'], verify: 'Follows from combining rules 3 and 4' },
  },
  {
    num: 5,
    title: 'Reciprocal Rule',
    formula: 'logₐ(m) = 1 / logₘ(a)',
    steps: [
      { eq: 'Let logₐm = p → aᵖ=m', why: 'Definition' },
      { eq: 'a = m^(1/p)', why: 'Take p-th root of both sides' },
      { eq: 'logₘ(a) = 1/p', why: 'Apply log base m' },
      { eq: 'logₐm = 1/logₘa ✓', why: 'Substitute p back' },
    ],
    ex: { lbl: 'Example', eqs: ['log₂(8) = 1/log₈(2)', '= 1/(1/3)', '= 3'], verify: 'Check: log₂(8)=3 ✓' },
  },
  {
    num: 6,
    title: 'Change of Base',
    formula: 'logₐ(m) = logᵦ(m) / logᵦ(a)',
    steps: [
      { eq: 'Let logₐm=p → aᵖ=m', why: 'Definition' },
      { eq: 'Take logᵦ both sides: logᵦ(aᵖ)=logᵦm', why: 'Apply log base b' },
      { eq: 'p·logᵦa = logᵦm', why: 'Use power rule' },
      { eq: 'p = logᵦm / logᵦa ✓', why: 'Divide both sides' },
    ],
    ex: { lbl: 'Calculator use', eqs: ['log₂(32)', '= log₁₀(32)/log₁₀(2)', '= 1.505/0.301', '= 5'], verify: 'Most useful for calculator evaluation ✓' },
  },
  {
    num: 7,
    title: 'Fundamental Identity',
    formula: 'a^(logₐ b) = b',
    steps: [
      { eq: 'Let logₐb = p → aᵖ = b', why: 'Definition of logarithm' },
      { eq: 'Therefore a^(logₐb) = b ✓', why: 'Direct substitution' },
    ],
    ex: { lbl: 'Special case', eqs: ['2^(log₂ 8)', '= 2^3', '= 8'], verify: 'The exponential and log undo each other ✓' },
  },
];
