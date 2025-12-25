# ApniSec - Full-Stack Next.js Application

A comprehensive full-stack Next.js application with authentication, rate limiting, email integration, and SEO optimization. Built with TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- ✅ **Custom JWT Authentication** - Secure authentication system with access and refresh tokens
- ✅ **Rate Limiting** - Custom rate limiter (100 requests per 15 minutes)
- ✅ **Email Integration** - Nodemailer (SMTP) for email notifications
- ✅ **Issue Management** - Create, read, update, and delete security issues
- ✅ **User Profile Management** - Update user profile information
- ✅ **OOP Backend Architecture** - Entire backend follows Object-Oriented Programming principles
- ✅ **SEO Optimized** - Landing page optimized for search engines
- ✅ **Responsive Design** - Mobile-first responsive UI

## Tech Stack

### Frontend
- Next.js 15+ (App Router)
- React 19+
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Supabase recommended)
- JWT Authentication
- Custom Rate Limiting
- Nodemailer (SMTP)

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or Supabase account)
- SMTP Credentials (e.g., Gmail, SendGrid, or Resend SMTP)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd assign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/apnisec_db?schema=public"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this-in-production"
   JWT_EXPIRES_IN="1h"
   JWT_REFRESH_EXPIRES_IN="7d"

   # SMTP Email (Nodemailer)
   SMTP_HOST="smtp.example.com"
   SMTP_PORT=465
   SMTP_USER="your-username"
   SMTP_PASS="your-password"
   SMTP_FROM="noreply@example.com"

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Rate Limiting
   RATE_LIMIT_MAX_REQUESTS=100
   RATE_LIMIT_WINDOW_MS=900000
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
assign/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User profile endpoints
│   │   └── issues/        # Issue management endpoints
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── register/         # Registration page
│   ├── profile/           # Profile page
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/
│   ├── db/                # Database configuration
│   ├── middleware/        # Auth and rate limit middleware
│   ├── repositories/      # Data access layer (OOP)
│   ├── services/          # Business logic layer (OOP)
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility classes and functions
│   └── validators/        # Input validation classes (OOP)
├── prisma/
│   └── schema.prisma      # Database schema
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user (protected)

### User Profile
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Issues
- `GET /api/issues` - List all issues (protected, supports `?type=` filter)
- `POST /api/issues` - Create new issue (protected)
- `GET /api/issues/[id]` - Get single issue (protected)
- `PUT /api/issues/[id]` - Update issue (protected)
- `DELETE /api/issues/[id]` - Delete issue (protected)

## OOP Architecture

The entire backend follows Object-Oriented Programming principles:

- **Handlers** - Request handlers (class-based)
- **Services** - Business logic (class-based)
- **Repositories** - Data access layer (class-based)
- **Validators** - Input validation (class-based)
- **Middleware** - Auth and rate limiting (class-based)

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP/user
- **Headers**: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- **Status**: Returns 429 when limit exceeded

## Email Notifications

Emails are sent via Nodemailer (SMTP) for:
- User registration (welcome email)
- Issue creation
- Profile updates

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `NEXT_PUBLIC_APP_URL`

## Testing

1. **Register a new user** at `/register`
2. **Login** at `/login`
3. **Access dashboard** at `/dashboard`
4. **Create issues** with different types (Cloud Security, Red Team Assessment, VAPT)
5. **Update profile** at `/profile`
6. **Test rate limiting** by making multiple requests

## License

This project is created for assignment purposes.

## Contact

For questions or issues, please contact: atish.thakur@apnisec.com

