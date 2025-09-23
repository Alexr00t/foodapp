# Contributing to FoodApp

Thank you for your interest in contributing to FoodApp! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- Git installed on your system
- A GitHub account

### Setting Up the Development Environment

1. **Fork the repository**
   - Click the "Fork" button on the GitHub repository page
   - Clone your fork to your local machine

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/FoodApp-GitHub.git
   cd FoodApp-GitHub
   ```

3. **Start the development server**
   ```bash
   # Using Python (recommended)
   python -m http.server 8080
   
   # Or using Node.js
   npx serve .
   ```

4. **Open the application**
   - Navigate to `http://localhost:8080`
   - The application should load with sample data

## 📝 How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with the following information:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and device information

### Suggesting Features

1. **Check existing issues** for similar suggestions
2. **Create a new issue** with:
   - Clear description of the feature
   - Use case and benefits
   - Mockups or examples if applicable

### Code Contributions

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b bugfix/your-bugfix-name
   ```

2. **Make your changes**
   - Follow the coding standards
   - Test your changes thoroughly
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template
   - Submit the PR

## 🎨 Coding Standards

### HTML
- Use semantic HTML5 elements
- Include proper accessibility attributes
- Keep markup clean and readable

### CSS
- Use CSS custom properties (variables) for theming
- Follow mobile-first responsive design
- Use meaningful class names
- Keep styles organized and commented

### JavaScript
- Use modern ES6+ features
- Write clear, readable code
- Add comments for complex logic
- Follow consistent naming conventions

### File Organization
```
FoodApp-GitHub/
├── index.html          # Main application page
├── style.css           # All styles
├── app.js             # Main application logic
├── enhancements.js    # Additional features
├── products.json      # Product database
├── journal.json       # User journal
├── targets.json        # Customizable targets
└── README.md          # Project documentation
```

## 🧪 Testing

### Manual Testing
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on different devices (desktop, tablet, mobile)
- Test responsive design at different screen sizes
- Test all major features and workflows

### Test Cases
- Product search and selection
- Journal entry creation
- Chart rendering and updates
- Mobile vs desktop views
- Data persistence

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project standards
- [ ] Changes are tested thoroughly
- [ ] Documentation is updated if needed
- [ ] No console errors or warnings
- [ ] Responsive design works on all screen sizes

### PR Description
Include the following information:
- **What**: Brief description of changes
- **Why**: Reason for the changes
- **How**: How the changes work
- **Testing**: How you tested the changes
- **Screenshots**: If UI changes are made

## 🐛 Bug Fixes

### Priority Levels
1. **Critical**: App crashes, data loss, security issues
2. **High**: Major functionality broken
3. **Medium**: Minor functionality issues
4. **Low**: UI/UX improvements, minor bugs

### Bug Fix Process
1. **Reproduce** the bug locally
2. **Identify** the root cause
3. **Fix** the issue with minimal changes
4. **Test** the fix thoroughly
5. **Document** the fix in the PR

## ✨ Feature Development

### Feature Categories
- **UI/UX**: Interface improvements, new layouts
- **Functionality**: New features, enhanced existing features
- **Performance**: Optimizations, faster loading
- **Accessibility**: Better screen reader support, keyboard navigation
- **Mobile**: Mobile-specific improvements

### Feature Development Process
1. **Plan** the feature thoroughly
2. **Design** the user interface
3. **Implement** the feature
4. **Test** across different devices
5. **Document** the new feature

## 📚 Documentation

### Code Documentation
- Add comments for complex functions
- Document API endpoints if applicable
- Include usage examples

### User Documentation
- Update README.md for new features
- Add screenshots for UI changes
- Document configuration options

## 🤝 Community Guidelines

### Communication
- Be respectful and constructive
- Use clear, concise language
- Provide helpful feedback
- Ask questions when needed

### Code Review
- Review code thoroughly
- Provide constructive feedback
- Suggest improvements
- Approve when ready

## 🎯 Project Roadmap

### Current Priorities
- [ ] PWA support
- [ ] Export functionality
- [ ] Cloud sync
- [ ] API integration
- [ ] Multi-language support

### Contribution Opportunities
- **Frontend**: UI/UX improvements, responsive design
- **Backend**: API development, data management
- **Mobile**: Mobile-specific features
- **Documentation**: User guides, API docs
- **Testing**: Automated testing, manual testing

## 📞 Getting Help

### Resources
- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: README.md and code comments

### Contact
- Create an issue for questions
- Use GitHub Discussions for general discussion
- Check existing issues for similar questions

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to FoodApp! 🎉
