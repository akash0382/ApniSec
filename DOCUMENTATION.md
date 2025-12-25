# ApniSec Full-Stack Application Documentation

## **Overview**
ApniSec is a professional cybersecurity platform built with Next.js 15. it provides comprehensive security issue management including Cloud Security, Red Team Assessment, and VAPT (Vulnerability Assessment and Penetration Testing).

## **Tech Stack**
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
- **Backend**: Next.js Route Handlers using strict **Object-Oriented Programming (OOP)**.
- **Database**: PostgreSQL hosted on Supabase, managed via Prisma ORM.
- **Authentication**: Custom JWT-based authentication with refresh tokens and secure password hashing (bcryptjs).
- **Email**: Nodemailer integration for transactional and notification emails (SMTP).
- **Rate Limiting**: Custom class-based rate limiting (100 requests per 15 minutes).

## **Implementation Details**

### **1. Object-Oriented Backend (MANDATORY)**
The entire backend architecture follows strict OOP principles:
- **Handlers**: Class-based request handlers for all API routes.
- **Services**: Business logic encapsulation in service classes (AuthService, IssueService, UserService).
- **Repositories**: Data access abstraction using repository classes.
- **Validators**: Input validation using Zod integrated into validator classes.
- **Errors**: Custom error hierarchy (`AppError`, `ValidationError`, `AuthenticationError`, etc.) and a central `ErrorHandler` class.
- **Middleware**: Class-based middleware for Authentication and Rate Limiting.

### **2. Authentication System**
- **Custom JWT**: No third-party services like Clerk or Auth0.
- **Refresh Tokens**: Implemented with database storage for persistent sessions.
- **Security**: HttpOnly cookies for token storage, password hashing with salt.
- **Password Reset**: Token-based password reset flow with email notification.

### **3. Rate Limiting**
- **Custom Logic**: Implemented in `RateLimiter` class.
- **Headers**: Returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.
- **Threshold**: 100 requests per 15 minutes per IP.

### **4. Email Integration**
Transactional emails sent via Nodemailer (SMTP) for:
- User registration (Welcome).
- Login notification.
- Failed login attempt warning.
- Profile update confirmation.
- Issue creation/update/deletion notifications.
- Password reset links and success confirmation.

### **5. Issue Management**
- **CRUD Operations**: Create, Read, Update, and Delete security issues.
- **Types**: Cloud Security, Red Team Assessment, VAPT.
- **Filtering**: Query-based filtering by issue type.
- **Ownership**: Strict checks to ensure users only access their own issues.

## **Project Structure**
```text
/app/api/        # API Route Handlers (Class-based)
/lib/            # Core logic
  /errors/       # Custom Error Classes & Handler
  /middleware/   # Auth & Rate Limit Middleware
  /repositories/ # Data Access Layer
  /services/     # Business Logic Layer
  /utils/        # Utility Classes (JWT, Email, Password, RateLimiter)
  /validators/   # Input Validation Classes
/prisma/         # Database schema
/public/         # Static assets
```

## **SEO Optimization**
- **Target**: 80%+ Lighthouse SEO score.
- **Implementation**: Semantic HTML, meta tags, responsive images, and optimized loading.

## **Setup Instructions**
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables in `.env` (refer to `.env.example`).
4. Generate Prisma client: `npx prisma generate`.
5. Run migrations: `npx prisma db push`.
6. Start development server: `npm run dev`.
