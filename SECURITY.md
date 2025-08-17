# Admin Panel Security

## 🔐 **Security Features**

The admin panel for The Bold Farm website includes several security measures to protect your farm's content management system.

### **Authentication**
- **Password Protection**: Admin panel requires a password to access
- **Session Management**: Authentication persists during browser session
- **Secure Logout**: Proper logout functionality clears authentication

### **Brute Force Protection**
- **Rate Limiting**: Maximum 5 failed login attempts
- **Account Lockout**: 15-minute lockout after failed attempts
- **Attempt Counter**: Shows remaining attempts to user

### **Current Password**
The default admin password is: `TheBoldFarm2024!`

**⚠️ IMPORTANT: Change this password immediately after first login!**

### **How to Change Password**
1. Open `src/components/admin-auth.tsx`
2. Find the line: `const ADMIN_PASSWORD = "TheBoldFarm2024!";`
3. Change it to your preferred secure password
4. Save the file and restart the development server

### **Password Security Tips**
- Use at least 12 characters
- Include uppercase, lowercase, numbers, and symbols
- Avoid common words or phrases
- Don't share the password publicly
- Consider changing it periodically

### **Additional Security Recommendations**

#### **For Production Use:**
1. **Environment Variables**: Store password in `.env.local` file
2. **HTTPS**: Always use HTTPS in production
3. **Regular Updates**: Keep dependencies updated
4. **Access Logging**: Monitor admin access attempts
5. **Backup Security**: Secure your content backups

#### **For Enhanced Security:**
1. **Two-Factor Authentication**: Add 2FA for additional protection
2. **IP Whitelisting**: Restrict access to specific IP addresses
3. **Session Timeout**: Add automatic logout after inactivity
4. **Audit Logs**: Log all admin actions for accountability

### **Current Security Level: Basic**
This implementation provides **basic security** suitable for:
- Personal farm websites
- Low-traffic sites
- Single-user admin access
- Development and testing environments

### **Not Suitable For:**
- High-traffic commercial sites
- Multi-user environments
- Sites with sensitive financial data
- Enterprise applications

### **Security Contact**
If you need help with security or suspect unauthorized access:
- Email: karlie@theboldfarm.com
- Review access logs
- Change password immediately
- Consider additional security measures

---

**Remember**: Security is an ongoing process. Regularly review and update your security measures as your needs evolve.
