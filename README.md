# Conduit - Next.js RealWorld Example App

A RealWorld implementation using Next.js, Prisma, and PostgreSQL that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) spec and API.

## Project Overview

This project is a migration of the original Refine-based Conduit implementation to a modern Next.js stack with the following key features:

- **Frontend**: Next.js 13+ with App Router
- **Database**: PostgreSQL hosted on Railway
- **ORM**: Prisma for type-safe database access
- **Authentication**: NextAuth.js with JWT strategy
- **Deployment**: Railway for both the Next.js app and PostgreSQL database

## Project Structure

```
conduit-next/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/          # Database migrations
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── articles/   # Article-related endpoints
│   │   │   └── auth/       # Authentication endpoints
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # Reusable components
│   ├── lib/
│   │   ├── prisma.ts       # Prisma client
│   │   └── auth.ts         # Auth configuration
│   └── types/              # TypeScript types
├── public/                 # Static assets
├── .env                    # Environment variables
└── package.json           # Project dependencies
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/conduit.git
cd conduit
```

2. Install dependencies:
```bash
cd conduit-next
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment:
   - Generate a NEXTAUTH_SECRET:
     ```bash
     node scripts/generate-secret.js
     ```
   - Update .env with your database configuration
   - Set NEXTAUTH_URL to your local development URL

5. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

6. Run the development server:
```bash
npm run dev
```

## Environment Variables

The application requires several environment variables to be set:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/conduit"

# Next Auth
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

For production deployment on Railway:
- DATABASE_URL will be automatically configured
- NEXTAUTH_URL should be set to your Railway-provided domain
- Other variables will be managed through Railway's environment variable system

## Features

- **Authentication**: JWT-based authentication using NextAuth.js
- **Article Management**: CRUD operations for articles
- **User Profiles**: User registration and profile management
- **Comments**: Article commenting system
- **Favorites**: Article favoriting system
- **Following**: User following system

## API Routes

- `GET /api/articles` - List articles
- `POST /api/articles` - Create article
- `GET /api/articles/:slug` - Get article
- `PUT /api/articles/:slug` - Update article
- `DELETE /api/articles/:slug` - Delete article
- `POST /api/articles/:slug/comments` - Add comment
- `GET /api/articles/:slug/comments` - Get comments
- `DELETE /api/articles/:slug/comments/:id` - Delete comment

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  username      String    @unique
  passwordHash  String
  bio           String?
  image         String?
  articles      Article[]
  comments      Comment[]
  favorites     Article[] @relation("UserFavorites")
  following     User[]    @relation("UserFollows")
  followers     User[]    @relation("UserFollows")
}

model Article {
  id             String    @id @default(cuid())
  slug           String    @unique
  title          String
  description    String
  body           String
  tagList        Tag[]
  author         User      @relation(fields: [authorId], references: [id])
  authorId       String
  favoritedBy    User[]    @relation("UserFavorites")
  comments       Comment[]
  favoritesCount Int       @default(0)
}
```

## Deployment

The application is configured for deployment on Railway with:

- Automatic deployments from the main branch
- PostgreSQL database provisioning
- Environment variable management
- Service linking between app and database

For more information about deployment and troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md).

## Local Development

1. **Database Setup**:
   - Install PostgreSQL locally
   - Create a new database: `createdb conduit`
   - Update DATABASE_URL in .env

2. **Authentication**:
   - Generate a new secret for NextAuth
   - Update NEXTAUTH_URL for local development

3. **Development Server**:
   - Run `npm run dev`
   - Access the app at http://localhost:3000

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
