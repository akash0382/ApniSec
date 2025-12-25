# Setup Guide

## Step 1: Create Environment Variables File

Create a `.env` file in the root directory. You can copy from `env.example.txt`:

**For Windows PowerShell:**
```powershell
Copy-Item env.example.txt .env
```

**For Command Prompt:**
```cmd
copy env.example.txt .env
```

## Step 2: Configure Environment Variables

Edit the `.env` file and fill in the following:

### Database Setup Options:

#### Option A: Use Supabase (Recommended - Free Tier)
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Go to Project Settings > Database
5. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
6. Replace `DATABASE_URL` in your `.env` file

#### Option B: Use Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database: `createdb apnisec_db`
3. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/apnisec_db?schema=public"
   ```

### JWT Secrets
Generate secure random strings for JWT secrets. You can use:
- Online generator: https://randomkeygen.com/
- Or run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

Update in `.env`:
```
JWT_SECRET="your-generated-secret-here"
JWT_REFRESH_SECRET="your-generated-refresh-secret-here"
```

### Email Setup (SMTP)
1. You can use any SMTP service (Resend SMTP, Gmail, SendGrid, Mailtrap, etc.)
2. Update in `.env`:
   ```
   SMTP_HOST="smtp.example.com"
   SMTP_PORT=465
   SMTP_USER="your-username"
   SMTP_PASS="your-password"
   SMTP_FROM="noreply@example.com"
   ```

### App URL
Keep as is for local development:
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Step 3: Set Up Database

Run these commands in order:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

## Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at: http://localhost:3000

## Quick Test

1. Visit http://localhost:3000
2. Click "Login" in the navigation
3. Click "Register here" to create an account
4. After registration, you'll be redirected to the dashboard
5. Create a new issue to test the functionality

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running (if using local)
- Check your `DATABASE_URL` is correct
- For Supabase: Make sure you're using the correct connection string

### Prisma Errors
- Run `npm run db:generate` again
- Make sure your database is accessible

### Email Not Sending
- Check your SMTP credentials are correct
- Ensure your SMTP server allows connections from your IP
- Note: Emails might fail silently (won't break registration)

### Port Already in Use
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

