const problems = [

    // ===== EASY (from your basic conversion notes page 7) =====
    {
      level: "Easy",
      tag: "ptag-easy",
      question: "Convert 2⁵ = 32 into logarithmic form",
      steps: [
        "Given: a^x = N",
        "Use definition: logₐ(N) = x",
        "So log₂(32) = 5"
      ],
      answer: "log₂(32) = 5"
    },
  
    {
      level: "Easy",
      tag: "ptag-easy",
      question: "Evaluate log₁₀(0.01)",
      steps: [
        "0.01 = 10⁻²",
        "So log₁₀(0.01) = -2"
      ],
      answer: "-2"
    },
  
    // ===== MEDIUM (from your equation solving page 7–8) =====
    {
      level: "Medium",
      tag: "ptag-med",
      question: "Solve log₃(x² − 2x) = 1",
      steps: [
        "Convert to exponential form",
        "x² − 2x = 3¹",
        "x² − 2x = 3",
        "x² − 2x − 3 = 0",
        "(x − 3)(x + 1) = 0",
        "x = 3 or x = -1",
        "Check domain: x² − 2x > 0 → both valid"
      ],
      answer: "x = 3 or x = -1"
    },
  
    {
      level: "Medium",
      tag: "ptag-med",
      question: "Solve log₂(x(x−1)) = log₂(x+2) + 1",
      steps: [
        "Rewrite 1 as log₂(2)",
        "log₂(x(x−1)) = log₂(2(x+2))",
        "x(x−1) = 2(x+2)",
        "x² − x = 2x + 4",
        "x² − 3x − 4 = 0",
        "(x − 4)(x + 1) = 0",
        "x = 4 or -1",
        "Reject x = -1 (domain)"
      ],
      answer: "x = 4"
    },
  
    // ===== HARD (from inequalities page 13–14) =====
    {
      level: "Hard",
      tag: "ptag-hard",
      question: "Solve −1 < log₂(x−1) ≤ 2",
      steps: [
        "Domain: x−1 > 0 → x > 1",
        "Since base > 1, inequality direction stays same",
        "2⁻¹ < x−1 ≤ 2²",
        "1/2 < x−1 ≤ 4",
        "Add 1",
        "3/2 < x ≤ 5"
      ],
      answer: "x ∈ (3/2, 5]"
    },
  
    {
      level: "Hard",
      tag: "ptag-hard",
      question: "Solve log₀.₃(x−1) > 1",
      steps: [
        "Domain: x−1 > 0 → x > 1",
        "Base < 1 → inequality reverses",
        "x−1 < 0.3¹",
        "x−1 < 0.3",
        "x < 1.3",
        "Combine with domain"
      ],
      answer: "x ∈ (1, 1.3)"
    },
  
    // ===== JEE LEVEL (from pages 15–19) =====
    {
      level: "JEE",
      tag: "ptag-jee",
      question: "Prove logₐ(b) × log_b(c) × log_c(a) = 1",
      steps: [
        "Use change of base",
        "logₐ(b) = log(b)/log(a)",
        "Multiply all three",
        "(log b / log a)(log c / log b)(log a / log c)",
        "Everything cancels"
      ],
      answer: "1"
    },
  
    {
      level: "JEE",
      tag: "ptag-jee",
      question: "Solve 3ˣ = 4^(x−1)",
      steps: [
        "Take log both sides",
        "x log3 = (x−1) log4",
        "x log3 = x log4 − log4",
        "x(log4 − log3) = log4",
        "x = log4 / (log4 − log3)"
      ],
      answer: "x = log4 / (log4 − log3)"
    }
  
  ];