# Development Guide

This guide provides detailed information for developers working on the Conduit project.

## Development Environment

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Git

### IDE Setup

We recommend using Visual Studio Code with the following extensions:
- Prisma VS Code Extension
- ESLint
- Prettier
- TypeScript and JavaScript Language Features

## Code Organization

### Key Directories

- `src/app/api/*` - API routes using Next.js App Router
- `src/components/*` - Reusable React components
- `src/lib/*` - Utility functions and configurations
- `src/types/*` - TypeScript type definitions
- `prisma/*` - Database schema and migrations

### Important Files

- `src/lib/prisma.ts` - Prisma client configuration
- `src/lib/auth.ts` - NextAuth.js configuration
- `prisma/schema.prisma` - Database schema
- `railway.toml` - Railway deployment configuration

## Common Development Tasks

### Working with the Database

1. **Create a new migration**:
```bash
npx prisma migrate dev --name <migration-name>
```

2. **Reset the database**:
```bash
npx prisma migrate reset
```

3. **Update Prisma Client**:
```bash
npx prisma generate
```

### API Development

1. **Creating a new API route**:
- Create a new directory under `src/app/api/`
- Add `route.ts` file with handler functions
- Implement GET, POST, PUT, DELETE methods as needed

Example:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  // Implementation
}

export async function POST(request: NextRequest) {
  // Implementation
}
```

2. **Error Handling**:
```typescript
try {
  // Implementation
} catch (error) {
  console.error('Error:', error)
  return NextResponse.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  )
}
```

### Authentication

1. **Protected API Routes**:
```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Implementation
}
```

2. **Protected Pages**:
```typescript
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return <div>Protected Content</div>
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run specific test file
npm test path/to/test
```

### Writing Tests

1. **API Tests**:
```typescript
import { describe, it, expect } from 'vitest'
import { GET } from './route'

describe('API Route: /api/example', () => {
  it('should return correct data', async () => {
    const response = await GET()
    const data = await response.json()
    expect(data).toBeDefined()
  })
})
```

2. **Component Tests**:
```typescript
import { render, screen } from '@testing-library/react'
import { Component } from './Component'

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />)
    expect(screen.getByText('Example')).toBeInTheDocument()
  })
})
```

## Debugging

### Server-Side

1. Add console.logs or debugger statements
2. Use Railway logs in production
3. Check Prisma query logs:
```typescript
const result = await prisma.$queryRaw`
  SELECT * FROM users
  WHERE id = ${userId}
`
console.log('Query result:', result)
```

### Client-Side

1. Use React DevTools
2. Check browser console
3. Use Next.js debugging tools:
```bash
NODE_OPTIONS='--inspect' npm run dev
```

## Deployment

### Pre-deployment Checklist

1. Run type checking:
```bash
npm run type-check
```

2. Run linting:
```bash
npm run lint
```

3. Run tests:
```bash
npm test
```

4. Check environment variables:
```bash
npm run env:check
```

### Railway Deployment

1. Push changes to main branch
2. Check Railway build logs
3. Verify database migrations
4. Check application logs
5. Test deployed application

## Best Practices

1. **Code Style**:
   - Use TypeScript strict mode
   - Follow ESLint rules
   - Use Prettier for formatting

2. **Git Workflow**:
   - Create feature branches
   - Write descriptive commit messages
   - Keep PRs focused and small

3. **API Design**:
   - Follow REST principles
   - Use proper HTTP status codes
   - Include error messages
   - Validate input data

4. **Security**:
   - Never commit secrets
   - Validate user input
   - Use CSRF protection
   - Implement rate limiting

## Troubleshooting

For common issues and solutions, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
