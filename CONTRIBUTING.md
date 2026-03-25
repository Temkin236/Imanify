# 🤝 Contributing to Imanify

Thank you for your interest in contributing to Imanify! This document provides guidelines and instructions for contributing to the project.

## 📋 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and inclusive of all people
- Be constructive in your feedback
- Focus on the code and ideas, not personal characteristics
- Follow Islamic values and principles
- Report any violations to the maintainers

## 🚀 Getting Started

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/yourusername/imanify.git
cd imanify
```

### 2. Create a Feature Branch
```bash
# Always create a new branch for your work
git checkout -b feature/your-feature-name

# Branch naming convention:
# feature/add-feature-name
# fix/fix-bug-name
# docs/update-documentation
# refactor/refactor-component
# test/add-tests
```

### 3. Setup Development Environment
```bash
# Install dependencies for both frontend and backend
cd frontend
npm install

cd ../backend
npm install
```

## 💻 Development Workflow

### Making Changes

1. **Code Style**
   - Follow TypeScript best practices
   - Use meaningful variable names
   - Keep functions small and focused
   - Add comments for complex logic

2. **Before Committing**
   ```bash
   # Run linter
   npm run lint

   # Fix formatting issues
   npm run lint:fix

   # Type check
   npm run type-check

   # Run tests
   npm test
   ```

3. **Commit Messages**
   ```bash
   # Good commit message format
   git commit -m "feat: add Quran search functionality"
   git commit -m "fix: resolve CORS issue in API"
   git commit -m "docs: update API documentation"
   git commit -m "refactor: improve performance"
   git commit -m "test: add tests for verse retrieval"

   # Format: <type>: <subject>
   # Types: feat, fix, docs, refactor, test, chore, perf, style
   ```

### Testing

#### Backend Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- quranService.test.ts

# Watch mode
npm test -- --watch
```

#### Frontend Tests
```bash
cd frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Code Review Checklist

Before submitting a PR, ensure:
- [ ] Code follows project style guidelines
- [ ] No console errors or warnings
- [ ] TypeScript types are properly defined
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Commit messages are clear

## 📝 Pull Request Process

### 1. Prepare Your Branch
```bash
# Update with latest changes
git fetch upstream
git rebase upstream/main

# Push your branch
git push origin feature/your-feature-name
```

### 2. Create Pull Request
- Use a clear, descriptive title
- Reference any related issues (#issue-number)
- Describe changes in detail
- Include screenshots for UI changes
- Follow the PR template

### 3. PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Performance improvement

## Related Issues
Fixes #issue-number

## Testing
Describe the tests you've run

## Screenshots (if applicable)
Include screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests are passing
- [ ] Documentation is updated
- [ ] No new warnings generated
```

### 4. Respond to Feedback
- Respond to review comments
- Make requested changes
- Mark conversations as resolved
- Push updates to the same branch

## 🎯 What to Contribute

### Good First Issues
- Documentation improvements
- Bug fixes with clear requirements
- Feature enhancement
- Performance improvements
- Test coverage

### Areas for Contribution

#### Backend
- API improvements
- Performance optimization
- Error handling
- Testing
- Documentation

#### Frontend
- UI/UX improvements
- New features
- Bug fixes
- Performance optimization
- Accessibility enhancements

### Project Priorities
1. Bug fixes and stability
2. Performance improvements
3. Test coverage
4. Documentation
5. New features

## 📚 Documentation

### Update Documentation When:
- Adding new features
- Changing existing behavior
- Adding new API endpoints
- Clarifying unclear sections
- Fixing typos or errors

### Documentation Files
- `README.md` - Main project overview
- `SETUP.md` - Setup instructions
- `backend/README.md` - Backend API documentation
- `CONTRIBUTING.md` - This file
- Code comments - Complex logic explanation

## 🔍 Code Review Guidelines

### For Reviewers
- Be constructive and respectful
- Suggest improvements, don't demand
- Acknowledge good work
- Ask questions to understand intent
- Approve when satisfied

### For Contributors
- Don't take feedback personally
- Ask for clarification if needed
- Thank reviewers for time
- Make requested changes promptly

## 🐛 Reporting Issues

### Bug Report Template
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: (Windows/macOS/Linux)
- Node.js version: x.x.x
- npm version: x.x.x
- Browser: (if frontend)

## Screenshots
Include if applicable

## Additional Context
Any other relevant information
```

### Feature Request Template
```markdown
## Description
Clear description of the feature

## Use Case
Why do you need this feature?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches?

## Additional Context
Any other information
```

## 🔐 Security

If you discover a security vulnerability:
1. **Do NOT** create a public issue
2. Email security@imanify.app with details
3. Include steps to reproduce
4. Allow time for a fix before disclosure

## 📦 Dependencies

### Adding New Dependencies

Before adding a dependency:
1. Check if it's already included
2. Consider alternatives
3. Check package size and maintenance
4. Update documentation

```bash
# Add a package
npm install package-name

# Add a dev dependency
npm install --save-dev package-name

# Update package-lock.json
npm install
```

## 🎓 Learning Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [Git Documentation](https://git-scm.com/doc)
- [Vite Documentation](https://vitejs.dev)

## ✅ Checklist for Contributors

- [ ] I have read the contributing guidelines
- [ ] I have set up my development environment
- [ ] I have created a feature branch
- [ ] I have made my changes
- [ ] I have tested my changes
- [ ] I have updated documentation
- [ ] I have committed with clear messages
- [ ] I have pushed to my fork
- [ ] I have created a pull request

## 🙋 Questions?

- Check existing documentation
- Search closed issues
- Open a discussion on GitHub
- Email maintainers
- Ask in community forums

## 🎉 Thank You!

Your contributions make Imanify better for everyone. We truly appreciate your effort and time!

---

<div align="center">

**Happy Contributing! 🚀**

</div>
