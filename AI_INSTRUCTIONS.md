# AI Instructions for Lodo Records Project

## Project Overview
Lodo Records is a full-stack e-commerce application for a music record store, built with React app and Node.js api, containerized with Docker.

## Architecture
- **app**: React application (port 3000)
- **api**: Node.js/Express API (port 5000)
- **Database**: MongoDB
- **Containerization**: Docker Compose

## Key Design Principles

### Color Scheme & Theming
- **Primary Color**: `#6B7C32` (Green mud)
- **Secondary Color**: `#5a6b3a` (Olive green)
- **Accent Color**: `#7a6b4a` (Warm mud)
- **Background**: `#f8f6f2` (Warm off-white)
- **Text Primary**: `#2c2c2c`

### UI/UX Guidelines
1. **Consistent Green Accent**: All product titles, buttons, and interactive elements should use the primary green color
2. **Smooth Transitions**: All hover effects should have proper CSS transitions (0.3s-0.6s)
3. **Modern Design**: Clean, minimalist approach with subtle shadows and gradients
4. **Responsive**: Mobile-first design approach

## Development Guidelines

### app Structure
```
app/src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── styles/        # CSS files (one per component/page)
├── contexts/      # React contexts
└── assets/        # Images, icons, etc.
```

### CSS Best Practices
1. Use CSS variables from `variables.css`
2. Follow BEM naming convention where applicable
3. Include proper transitions for interactive elements
4. Maintain consistent spacing using CSS variables
5. Use semantic class names

### api Structure
```
api/
├── controllers/   # Route handlers
├── models/        # MongoDB schemas
├── routes/        # API route definitions
├── middleware/    # Custom middleware
└── config/        # Configuration files
```

## Common Tasks

### Adding New Features
1. Create component in appropriate directory
2. Add corresponding CSS file with proper naming
3. Use existing color variables and spacing
4. Ensure responsive design
5. Add proper error handling

### Styling Guidelines
- Always use CSS variables for colors
- Include hover states with transitions
- Maintain consistent button styling
- Use proper semantic HTML
- Follow accessibility best practices

### API Development
1. Follow RESTful conventions
2. Include proper error handling
3. Use middleware for authentication
4. Validate input data
5. Return consistent response formats

## Testing & Quality
- Run `npm run lint:fix` for code quality
- Use `npm audit` to check for vulnerabilities
- Test responsive design on multiple screen sizes
- Verify color contrast for accessibility

## Docker Commands
- Start: `docker compose up`
- Stop: `docker compose down`
- Rebuild: `docker compose up --build`
- app shell: `docker exec lodo-app bash`
- api shell: `docker exec lodo-api bash`

## Important Notes
- Always use absolute paths in tool calls
- Prefer editing existing files over creating new ones
- Use semantic search before making changes
- Test changes in browser preview
- Follow the established code patterns and conventions

## Security Considerations
- Never commit secrets or API keys
- Use environment variables for sensitive data
- Implement proper input validation
- Follow OWASP security guidelines

## General instructions
- Always do short answers
- When asked for more details, then provide them
- When asked to restart the project, do a `docker compose down --timeout 0` and then `docker compose up --build -d`

---

*This file should be updated as the project evolves and new patterns emerge.*