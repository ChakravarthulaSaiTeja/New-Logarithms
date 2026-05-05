# Contributing to New-Logarithms

Thank you for your interest in contributing! Here's how you can help improve this project.

## Ways to Contribute

### 1. Add New Problems
- Create problems across different difficulty levels (Easy, Medium, Hard, JEE)
- Ensure each problem has:
  - Clear question statement
  - Step-by-step solution steps
  - Final answer
  - Appropriate difficulty level tag

### 2. Improve Documentation
- Fix typos or unclear explanations
- Add examples to the README
- Improve code comments

### 3. Report Bugs
- Check if the bug has already been reported
- Provide detailed description of the issue
- Include browser/environment information

### 4. Suggest Features
- Mobile responsiveness
- Dark mode support
- User progress tracking
- Additional problem categories

## How to Submit Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/New-Logarithms.git
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Add/edit problems in `problems.json`
   - Update documentation as needed
   - Follow existing code style

4. **Test your changes**
   ```bash
   npm start
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new logarithm inequality problems"
   ```

6. **Push and submit a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow the existing code structure
- Keep problems organized by difficulty level

## Problem Template

When adding new problems to `problems.json`:

```json
{
  "level": "Medium",
  "tag": "ptag-med",
  "question": "Your problem statement here",
  "steps": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "answer": "Final answer"
}
```

## Difficulty Levels

- **Easy:** Basic conversions, simple evaluations
- **Medium:** Equation solving with domain checks
- **Hard:** Inequalities, complex multi-step problems
- **JEE:** Advanced proofs, competitive exam level

## Questions?

Feel free to open an issue or ask in discussions!

---

Happy Contributing! 🎓
