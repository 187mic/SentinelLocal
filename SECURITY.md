# Security Policy

## Overview

Sentinel Local implements multiple layers of security to protect user data and ensure safe operation. This document outlines the security measures in place and best practices for deployment.

## Security Features Implemented

### Authentication & Authorization

1. **JWT-Based Authentication**
   - JSON Web Tokens with 7-day expiration
   - Tokens include userId and email claims
   - Secure token verification on all protected routes
   - JWT_SECRET validation enforced in production

2. **Password Security**
   - Bcrypt hashing with cost factor of 12
   - Minimum password requirements:
     - At least 8 characters
     - At least one lowercase letter
     - At least one uppercase letter
     - At least one number
     - Maximum 128 characters to prevent DoS

3. **Email Validation**
   - Format validation using regex
   - Maximum length enforcement (255 characters)
   - Case-insensitive storage (lowercase normalized)

### Input Validation & Sanitization

1. **Request Validation**
   - Type checking on all user inputs
   - Length limits on all text fields
   - Special character sanitization (null byte removal)
   - Request body size limits (1MB max)

2. **API Input Sanitization**
   - Chat messages: 2000 character limit
   - Business descriptions: 500 character limit
   - Keyword data: 500 character limit
   - Automatic trimming and validation

### HTTP Security Headers

The application sets the following security headers on all responses:

- `X-Frame-Options: DENY` - Prevents clickjacking attacks
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `X-Powered-By` header removed to hide technology stack

### Error Handling

1. **Error Message Sanitization**
   - Generic error messages returned to clients
   - Detailed errors logged server-side only
   - No stack traces exposed in production
   - Sensitive information never included in error responses

2. **Production vs Development**
   - Different error verbosity levels
   - Generic messages in production
   - Detailed logging for debugging in development

### Database Security

1. **Query Safety**
   - Prisma ORM prevents SQL injection
   - Parameterized queries used throughout
   - User authorization checks on all data access
   - Row-level security via userId filtering

2. **Data Isolation**
   - All queries filtered by authenticated userId
   - No cross-user data access possible
   - Proper foreign key constraints

## Security Best Practices for Deployment

### Required Configuration

1. **Environment Variables**
   ```bash
   # Generate a strong JWT secret (required in production)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Set this value as `JWT_SECRET` in your environment.

2. **Database Connection**
   - Use SSL/TLS for database connections in production
   - Restrict database access to application servers only
   - Use strong database passwords
   - Enable database connection pooling

3. **HTTPS**
   - Always use HTTPS in production
   - Redirect HTTP to HTTPS
   - Use valid SSL/TLS certificates
   - Enable HSTS (HTTP Strict Transport Security)

### Recommended Enhancements

1. **Rate Limiting**
   - Implement rate limiting on authentication endpoints
   - Consider using packages like `express-rate-limit`
   - Recommended limits:
     - Login: 5 attempts per 15 minutes per IP
     - Registration: 3 attempts per hour per IP
     - API calls: 100 requests per 15 minutes per user

2. **CORS Configuration**
   - Configure CORS to allow only your frontend domain
   - Remove wildcard CORS in production
   - Example configuration:
     ```javascript
     app.use(cors({
       origin: process.env.FRONTEND_URL,
       credentials: true
     }));
     ```

3. **Session Management**
   - Consider implementing refresh tokens for longer sessions
   - Add token revocation capability
   - Implement secure logout (token blacklisting)

4. **Additional Security Headers**
   - Consider adding Content Security Policy (CSP)
   - Implement HSTS with preload
   - Add Permissions-Policy headers

5. **Monitoring & Logging**
   - Implement security event logging
   - Monitor failed authentication attempts
   - Set up alerts for suspicious activity
   - Use centralized logging service

6. **Data Protection**
   - Implement data encryption at rest
   - Use encrypted backups
   - Regular security audits
   - Compliance with GDPR/CCPA if applicable

## Known Limitations

1. **Rate Limiting**: Not currently implemented - should be added for production
2. **CORS**: Currently not configured - needs production configuration
3. **IP-based Protection**: No IP blocking or geolocation restrictions
4. **2FA**: Not implemented - consider adding for enhanced security
5. **Session Management**: No refresh token mechanism

## Dependency Security

### Current Vulnerabilities (from npm audit)

As of the last audit, there are moderate-severity vulnerabilities in development dependencies:

1. **esbuild** (dev dependency) - Development server security issue
   - Impact: Low (dev environment only)
   - Recommendation: Update when compatible version available

2. **vite** (dev dependency) - File system bypass on Windows
   - Impact: Low (dev environment only)
   - Recommendation: Update when compatible version available

These vulnerabilities only affect the development environment and do not impact production builds.

### Dependency Management

1. **Regular Updates**
   ```bash
   npm audit
   npm audit fix
   npm outdated
   ```

2. **Automated Scanning**
   - Enable GitHub Dependabot alerts
   - Use Snyk or similar tools for continuous monitoring
   - Review security advisories regularly

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it by:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers directly (if available)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work on a fix promptly.

## Security Checklist for Production

Before deploying to production, ensure:

- [ ] JWT_SECRET is set to a strong, random value
- [ ] DATABASE_URL uses SSL connection
- [ ] HTTPS is enabled and enforced
- [ ] Error messages don't leak sensitive information
- [ ] Rate limiting is configured
- [ ] CORS is properly configured for your domain
- [ ] All dependencies are up to date
- [ ] Database backups are configured and encrypted
- [ ] Monitoring and logging are set up
- [ ] Security headers are properly configured
- [ ] Environment variables are stored securely (e.g., AWS Secrets Manager)

## Security Updates

This document will be updated as new security measures are implemented or vulnerabilities are discovered.

Last updated: 2025-01-XX
