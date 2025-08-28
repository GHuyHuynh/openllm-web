# Contributing to OpenLLM Web Chat

Thank you for your interest in contributing to OpenLLM Web App! This guide will help you get started with the development process.

## Getting Started

### Prerequisites

- Node.js (v22 or higher)
- pnpm package manager
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/openllm-web.git
   cd openllm-web
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```

4. **Verify Setup**
   - Open `http://localhost:5173` in your browser
   - The chat interface should load successfully

## Development Workflow

### Branch Protection Rules

**Important**: The `main` branch is protected. You cannot push directly to main.

### Contributing Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   # or
   git checkout -b chore/your-maintenance-task
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code conventions
   - Test your changes thoroughly

3. **Test Your Code**
   ```bash
   # Run linting
   pnpm lint
   
   # Build the project
   pnpm build
   
   # Preview the build
   pnpm preview
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the GitHub repository
   - Click "New Pull Request"
   - Select your branch as the source
   - Target the `main` branch
   - Fill out the PR template

## Code Guidelines

### Project Structure

```
src/
├── components/
│   ├── core/          # Main app components (chat, sidebar, etc.)
│   └── ui/            # Reusable UI components (Radix UI + custom)
├── pages/             # Page-level components
├── hooks/             # Custom React hooks
├── lib/               # Utilities, types, database
├── ai-module/         # VLLM transport and AI integration
├── actions/           # Data fetching utilities
└── constants/         # App configuration
```

### Coding Standards

- **TypeScript**: Use strict typing, avoid `any` if possible
- **Components**: Use functional components with hooks
- **Styling**: Use TailwindCSS classes, follow existing patterns
- **State**: Use local state for UI, context for global state
- **Database**: Use Dexie queries in `/lib/db/queries.ts`

### Commit Message Format

Use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `chore:` maintenance tasks

## Architecture Understanding

### Key Components

- **Chat Component** (`src/components/core/chat.tsx`): Main chat interface with streaming
- **vLLM Transport** (`src/ai-module/vllm-transport.ts`): Custom AI transport layer
- **Database Schema** (`src/lib/db/schema.ts`): Dexie IndexedDB models
- **Providers** (`src/App.tsx`): Context providers for state management

### Data Flow

1. User input → React state
2. Message sent via VLLM transport → API
3. Streaming response → Real-time UI updates  
4. Complete message → IndexedDB storage

## Common Tasks

### Adding a New UI Component

1. Create in `src/components/ui/`
2. Use Radix UI as base when possible
3. Apply TailwindCSS styling
4. Export from component file

### Modifying Chat Functionality

1. Update `src/components/core/chat.tsx`
2. Consider database schema changes
3. Test streaming and error handling
4. Verify local storage persistence

### Adding New Routes

1. Create page component in `src/pages/`
2. Add route to `src/App.tsx`
3. Update navigation if needed

## Pull Request Guidelines

### PR Checklist

- [ ] Code follows project conventions
- [ ] Changes are tested locally
- [ ] Build succeeds (`pnpm build`)
- [ ] No console errors in development
- [ ] Database migrations handled (if applicable)
- [ ] Documentation updated (if needed)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] Chat functionality works
- [ ] Data persistence works

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Getting Help

### Resources

- Check existing issues before creating new ones
- Review the codebase architecture in `README.md`
- Read the project README for setup instructions

### Questions

- Open a GitHub issue with the "question" label
- Provide context about what you're trying to accomplish
- Include relevant code snippets

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and contribute
- Follow GitHub community guidelines

Thank you for contributing to OpenLLM Web Chat!