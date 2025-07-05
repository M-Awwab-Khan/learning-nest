# NestJS Guards Implementation Guide

## What are Guards?

Guards are classes that implement the `CanActivate` interface. They have a single responsibility: determine whether a given request will be handled by the route handler or not. Guards are executed **after** middleware but **before** any interceptor or pipe.

## Guard Execution Order

When multiple guards are applied, they execute in the order they are bound:

1. Global guards
2. Controller guards
3. Route guards

## Types of Guards Implemented

### 1. AuthGuard (`/src/guards/auth.guard.ts`)

- **Purpose**: Authentication - verifies if user has valid credentials
- **Implementation**: Checks for Authorization header with Bearer token
- **Valid tokens**: 'valid-token', 'admin-token', 'user-token'
- **Adds user info to request object for downstream use**

### 2. RolesGuard (`/src/guards/roles.guard.ts`)

- **Purpose**: Authorization - checks if authenticated user has required roles
- **Uses Reflector to get metadata from @Roles() decorator**
- **Depends on AuthGuard running first to set user info**

### 3. RateLimitGuard (`/src/guards/rate-limit.guard.ts`)

- **Purpose**: Rate limiting - prevents abuse by limiting requests per IP
- **Configuration**: 10 requests per minute per IP address
- **Uses in-memory storage (in production, use Redis)**

## Usage Patterns Demonstrated

### Controller-Level Guards

```typescript
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard) // Applied to all routes in controller
export class AdminController {
  // All methods inherit these guards
}
```

### Route-Level Guards

```typescript
@Get('profile')
@UseGuards(AuthGuard) // Applied only to this route
getProfile(@Request() req) {
  // Implementation
}
```

### Multiple Guards with Roles

```typescript
@Delete(':id')
@UseGuards(AuthGuard, RolesGuard, RateLimitGuard) // Multiple guards
@Roles('admin') // Role requirement
remove(@Param('id') id: number, @Request() req) {
  // Implementation
}
```

## Testing the Guards

### 1. Test Authentication (AuthGuard)

**Valid Request:**

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer valid-token"
```

**Invalid Request:**

```bash
curl -X GET http://localhost:3000/users/profile
# Should return 401 Unauthorized
```

### 2. Test Role-Based Access (RolesGuard)

**Admin Access:**

```bash
curl -X GET http://localhost:3000/admin/users \
  -H "Authorization: Bearer admin-token"
```

**User Access (should fail):**

```bash
curl -X GET http://localhost:3000/admin/users \
  -H "Authorization: Bearer user-token"
# Should return 403 Forbidden
```

### 3. Test Rate Limiting

**Make multiple requests quickly:**

```bash
for i in {1..12}; do
  curl -X POST http://localhost:3000/admin/broadcast \
    -H "Authorization: Bearer admin-token" \
    -H "Content-Type: application/json" \
    -d '{"message":"Test broadcast"}'
  echo "Request $i completed"
done
```

## Available Endpoints

### Public Endpoints (No Guards)

- `POST /users` - Create user
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID

### Authenticated Endpoints

- `GET /users/profile` - Get current user profile
- `GET /admin/dashboard` - Admin dashboard (any authenticated user)

### Role-Protected Endpoints

- `GET /admin/users` - Admin only
- `GET /admin/reports` - Admin or Manager
- `DELETE /admin/users/:id` - Admin only
- `DELETE /users/:id` - Admin only (with rate limiting)

### Rate-Limited Endpoints

- `POST /admin/broadcast` - Admin only + rate limited

## Guard Best Practices

1. **Order Matters**: AuthGuard should come before RolesGuard
2. **Separation of Concerns**: Each guard has a single responsibility
3. **Error Handling**: Use appropriate HTTP status codes
4. **Metadata**: Use decorators for configuration (@Roles)
5. **Request Enhancement**: Guards can add data to request object

## Real-World Enhancements

In production applications, consider:

- JWT token validation instead of simple string matching
- Database-backed role checking
- Redis for distributed rate limiting
- Caching for permission checks
- Audit logging for security events
