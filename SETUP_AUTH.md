# Authentication Setup Guide

This guide explains how to set up authentication for the Eurizon Investment Portal.

## Overview

The application now uses **Supabase Authentication** with email/password login. Hardcoded passwords have been removed for security.

## Prerequisites

1. A Supabase project (already configured with credentials in `.env`)
2. Access to Supabase SQL Editor
3. Admin access to create users

## Database Setup

### Step 1: Create the user_profiles table

1. Log in to your Supabase dashboard: https://app.supabase.com
2. Navigate to the **SQL Editor**
3. Copy the contents of `database/user_profiles.sql`
4. Paste and **Run** the SQL script

This creates:
- `user_profiles` table with role and permissions
- Row Level Security (RLS) policies
- Automatic profile creation on signup
- Admin and user access controls

### Step 2: Create Test Users

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **Authentication > Users** in Supabase
2. Click **Add User**
3. Enter email and password
4. Click **Create User**

**Suggested Test Accounts:**

- **Admin User**
  - Email: `admin@eurizon.com`
  - Password: (choose secure password)
  - After creating, run this SQL to make them admin:
    ```sql
    UPDATE public.user_profiles
    SET role = 'Administrator', is_admin = TRUE
    WHERE user_id = (
      SELECT id FROM auth.users WHERE email = 'admin@eurizon.com'
    );
    ```

- **Regular User**
  - Email: `user@eurizon.com`
  - Password: (choose secure password)
  - Role: Client (default)

- **Demo User**
  - Email: `demo@eurizon.com`
  - Password: (choose secure password)
  - After creating, set role:
    ```sql
    UPDATE public.user_profiles
    SET role = 'Demo User'
    WHERE user_id = (
      SELECT id FROM auth.users WHERE email = 'demo@eurizon.com'
    );
    ```

#### Option B: Allow User Signups

If you want users to sign up themselves:

1. In Supabase dashboard, go to **Authentication > Settings**
2. Enable **Enable email confirmations** (optional)
3. Configure **Email Templates** for signup confirmation
4. Users can then sign up through the app (feature needs to be added to UI)

## User Roles & Permissions

The system supports the following roles:

| Role | Permissions | Description |
|------|-------------|-------------|
| **Administrator** | all | Full access to all features including admin panel |
| **Premium** | view, trade, documents, reports | Enhanced client with reporting access |
| **Client** | view, trade, documents | Standard client account |
| **Demo User** | view, trade | Practice account with demo trading |
| **Temporary User** | view | Read-only access |

## Role-Based Access Control

Roles are automatically assigned permissions:

```javascript
// From AppContext.js
const getUserPermissions = (role) => {
  const permissionMap = {
    'Administrator': ['all'],
    'Premium': ['view', 'trade', 'documents', 'reports'],
    'Client': ['view', 'trade', 'documents'],
    'Demo User': ['view', 'trade'],
    'Temporary User': ['view']
  };
  return permissionMap[role] || ['view'];
};
```

## How Authentication Works

### 1. Login Flow

```
User enters email/password
    ↓
LoginPage.js calls handleLogin(email, password)
    ↓
AppContext.js authenticates with Supabase
    ↓
On success: Fetch user profile from user_profiles table
    ↓
Set currentUser with role and permissions
    ↓
Redirect to MainLayout/Dashboard
```

### 2. Session Persistence

- Sessions are automatically persisted by Supabase
- On app reload, `checkSession()` verifies existing session
- Users stay logged in until they explicitly logout

### 3. Protected Routes

The app checks `isLoggedIn` state:

```javascript
if (isLoggedIn) {
  return <MainLayout />;
}
return <LoginPage />;
```

### 4. Profile Auto-Creation

When a user logs in for the first time:
- System checks for existing profile
- If none exists, creates default profile with role "Client"
- Profile is linked to Supabase Auth user via `user_id`

## Security Features

✅ **Removed hardcoded passwords** - No more plaintext credentials in code
✅ **Supabase Auth** - Industry-standard authentication
✅ **Row Level Security** - Database-level access control
✅ **Session management** - Automatic token refresh
✅ **Role-based permissions** - Fine-grained access control
✅ **.env protection** - Credentials not committed to git

## Troubleshooting

### Users can't log in

1. Verify user exists in Supabase Auth > Users
2. Check if email/password are correct
3. Ensure user's email is confirmed (if email confirmation is enabled)
4. Check browser console for error messages

### "user_profiles table doesn't exist"

Run the SQL script in `database/user_profiles.sql` via Supabase SQL Editor

### Admin features not showing

1. Check user profile in database:
   ```sql
   SELECT * FROM public.user_profiles
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
   ```
2. Ensure `is_admin = TRUE` and `role = 'Administrator'`

### Session not persisting

- Check if cookies are enabled in browser
- Verify Supabase URL and anon key are correct in `.env`
- Clear browser cache and try again

## Making Your First Admin User

1. Sign up a user through Supabase dashboard or app
2. Find their `user_id` in Supabase **Authentication > Users**
3. Run this SQL with their user ID:
   ```sql
   UPDATE public.user_profiles
   SET role = 'Administrator', is_admin = TRUE
   WHERE user_id = 'PASTE_USER_ID_HERE';
   ```
4. User must log out and log back in for changes to take effect

## Next Steps

- [ ] Add password reset functionality
- [ ] Add email verification for new signups
- [ ] Add signup form in UI
- [ ] Implement OAuth providers (Google, Microsoft, etc.)
- [ ] Add two-factor authentication (2FA)
- [ ] Create admin panel for user management

## API Reference

### AppContext Functions

```javascript
// Login
const result = await handleLogin(email, password);
// Returns: { success: boolean, error?: string }

// Signup
const result = await handleSignup(email, password, metadata);
// Returns: { success: boolean, data?: object, error?: string }

// Logout
await handleLogout();

// Check permissions
if (currentUser?.permissions.includes('trade')) {
  // User can trade
}

// Check admin
if (currentUser?.isAdmin) {
  // User is administrator
}
```

## Important Notes

⚠️ **Never commit the `.env` file** - It contains sensitive credentials
⚠️ **Rotate Supabase keys** if they were previously exposed in git
⚠️ **Use strong passwords** for all accounts, especially admins
⚠️ **Enable email confirmation** in production for better security

---

**Need help?** Check [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
