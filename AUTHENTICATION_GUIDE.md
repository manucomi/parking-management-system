# Authentication Implementation Guide

## Overview

Supabase Auth is fully implemented using SSR with `@supabase/ssr`. Both browser and server clients are configured for seamless authentication across the application.

## Authentication Flow

```
Login → Supabase Auth → JWT cookie → Protected API calls → Dashboard redirect
```

1. User submits credentials via login form
2. Supabase validates and creates session
3. JWT token stored in HTTP-only cookie
4. Middleware refreshes token on each request
5. Backend verifies JWT for API access
6. User redirected to role-specific dashboard

## Role-Based Access

- **Admin**: Manage residents, parking spots, and execute raffles
- **Resident**: Join raffles and view results

Roles are stored in user metadata and enforced on both frontend routes and backend endpoints.

## Backend Protection

JWT verification middleware ensures only authenticated requests reach `/api/*` endpoints. The middleware validates tokens using Supabase service role key and attaches user context to requests.

## Implementation Details

### 1. Environment Setup

#### Backend (apps/backend/.env)

```bash
# Copy from Supabase Dashboard → Settings → API
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-random-secret-key
```

#### Frontend (apps/frontend/.env.local)

```bash
# Copy from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON=your-anon-public-key
NEXT_PUBLIC_API_URL=http://localhost:4000  # or production URL
```

### 2. Protect Admin Pages

Add `withAuth` to all admin pages:

```jsx
// apps/frontend/src/pages/admin/index.jsx
import withAdminLayout from '@/components/Layout/withAdminLayout';
import { withAuth } from '@/components/withAuth';

function AdminDashboard() {
    // ... existing code
}

// Wrap with both HOCs
export default withAuth(withAdminLayout(AdminDashboard));
```

Apply to:

- `pages/admin/index.jsx`
- `pages/admin/residents.jsx`
- `pages/admin/spots.jsx`
- `pages/admin/raffle.jsx`

### 3. Add Logout Button

Update AdminLayout to include logout:

```jsx
// apps/frontend/src/components/Layout/AdminLayout.jsx
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
    const { logout, user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                {/* Existing nav items */}

                {/* Add at bottom of sidebar */}
                <div className={styles.userInfo}>
                    <p>{user?.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </aside>
            <main className={styles.main}>{children}</main>
        </div>
    );
}
```

### 4. Create Resident Dashboard

If resident pages don't exist yet, create them:

```jsx
// apps/frontend/src/pages/resident/index.jsx
import { withAuth } from '@/components/withAuth';
import { useAuth } from '@/hooks/useAuth';

function ResidentDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div>
            <h1>Resident Dashboard</h1>
            <p>Welcome, {user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
            {/* Add resident-specific features */}
        </div>
    );
}

export default withAuth(ResidentDashboard);
```

### 5. Supabase Dashboard Configuration

#### Enable Email Authentication

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional)

#### Disable Email Confirmation (for development)

1. Go to Authentication → Settings
2. Uncheck "Enable email confirmations"
3. This allows immediate login after signup (re-enable for production)

#### Create Admin User (Optional)

You can manually add a user in Supabase Dashboard → Authentication → Users

Or use SQL to add user metadata:

```sql
UPDATE auth.users
SET raw_user_meta_data = '{"role": "admin"}'
WHERE email = 'admin@example.com';
```

---

## 🧪 Testing the Implementation

### 1. Start Services

```bash
# Terminal 1 - Backend
cd apps/backend
npm run dev

# Terminal 2 - Frontend
cd apps/frontend
npm run dev
```

### 2. Test Signup Flow

1. Go to `http://localhost:3000`
2. Click "Register" tab
3. Fill in email and password
4. Submit form
5. Check Supabase Dashboard → Authentication → Users

### 3. Test Login Flow

1. Go to `http://localhost:3000`
2. Enter registered email/password
3. Click "Login"
4. Should redirect to `/resident/` or `/admin/`
5. Check browser dev tools → Network → API calls should include `Authorization: Bearer <token>`

### 4. Test Protected Routes

1. While logged in, copy a protected route URL (e.g., `/admin/residents`)
2. Logout
3. Try to access the URL directly
4. Should redirect to login page

### 5. Test Token Refresh

1. Login and wait for token expiration (default: 1 hour)
2. Make an API call
3. Token should auto-refresh via Supabase client

---

## 🔒 Security Checklist

- [ ] SUPABASE_SERVICE_ROLE_KEY is kept secret (never in frontend)
- [ ] CORS configured correctly in backend
- [ ] All sensitive API routes protected with `verifyToken` middleware
- [ ] Email confirmation enabled in production
- [ ] Rate limiting added to auth endpoints (future enhancement)
- [ ] HTTPS enabled in production deployments

---

## 📚 API Endpoints Reference

### Public Endpoints (No Token Required)

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get token
- `GET /health` - Health check

### Protected Endpoints (Require Bearer Token)

- `GET /api/residents` - Get all residents
- `POST /api/residents` - Create resident
- `GET /api/spots` - Get parking spots
- `POST /api/raffle/run` - Execute raffle
- etc.

### Token Format

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🐛 Troubleshooting

### "Missing or invalid Authorization header"

- Ensure frontend `.env.local` has correct Supabase keys
- Check that `fetcher.js` is getting the session token
- Verify user is logged in before making protected API calls

### "Invalid or expired token"

- Token may have expired (refresh page to trigger auto-refresh)
- Check that backend has correct `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Verify Supabase project is active

### Signup doesn't work

- Check if email confirmation is enabled (disable for dev)
- Verify Supabase email provider is enabled
- Check backend logs for Supabase errors

### CORS errors

- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `server.js`

---

## 🚀 Production Deployment Checklist

### Backend (Render)

1. Add environment variables in Render dashboard:
    - `SUPABASE_URL`
    - `SUPABASE_SERVICE_ROLE_KEY`
    - `JWT_SECRET`
    - `FRONTEND_URL` (Vercel production URL)
    - `NODE_ENV=production`

### Frontend (Vercel)

1. Add environment variables in Vercel dashboard:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON`
    - `NEXT_PUBLIC_API_URL` (Render backend URL)

2. Redeploy both services after adding environment variables

### Supabase

1. Re-enable email confirmations
2. Configure custom email templates (optional)
3. Set up proper RLS (Row Level Security) policies
4. Review allowed redirect URLs

---

## ✅ Integration Test Checklist

After completing setup:

- [ ] ✅ Signup creates user in Supabase
- [ ] ✅ Login returns valid JWT token
- [ ] ✅ Protected routes reject unauthenticated requests
- [ ] ✅ Protected routes accept requests with valid token
- [ ] ✅ Token is automatically included in API requests
- [ ] ✅ Logout clears session and redirects to login
- [ ] ✅ Direct access to protected pages redirects to login
- [ ] ✅ Token refresh works automatically

---

**Implementation Status:** ✅ Core authentication complete, ready for testing and deployment configuration
