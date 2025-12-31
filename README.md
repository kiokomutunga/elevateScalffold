# Invoice Backend Repository Scaffold

 ready-to-use scaffold for an **Invoice Backend** repository you can push to GitHub. It includes a recommended file structure, key files (full code snippets), CI workflow, API documentation, and instructions to initialize and publish the repo.

---

## 1. Project summary

A Node.js + Express + MongoDB backend for creating and managing invoices. Features:

* Create, read, update, delete invoices (CRUD)
* Copy invoice (duplicate with new invoice number)
* Edit invoice
* Print/generate PDF of an invoice (PDF generation service)
* Share invoice (WhatsApp share link & email attachments)
* Authentication-ready (JWT skeleton)
* Input validation, logging, and basic error handling
* CI via GitHub Actions and linting

AUTH SYSTEM FEATURES (FINAL)

✔ Email + Password signup
✔ Admin access code on signup
✔ Email OTP verification
✔ Login with email/password
✔ Signup/Login with Google
✔ Forgot password (OTP)
✔ Reset password
✔ JWT access tokens
✔ Secure expiry & retry protection

🧱 DATABASE DESIGN
User Model
{
  name: String,
  email: String,
  password: String,

  googleId: String,

  isVerified: Boolean,
  role: "user" | "admin",

  createdAt,
  updatedAt
}

OTP Model (Reusable)
{
  email: String,
  code: String,
  purpose: "verify" | "reset",
  expiresAt: Date,
  attempts: Number
}


✔ One OTP table for both verification & password reset
✔ Short-lived
✔ Rate-limited

🔁 SYSTEM FLOW (HIGH LEVEL)
Signup → Admin Code Check → Create User
       → Send OTP → Verify OTP → Account Active

Login → JWT Issued

Forgot Password → Send OTP → Verify OTP → Reset Password

Google Signup/Login → Token Verify → JWT Issued

📦 BACKEND API ENDPOINTS
Method	Endpoint	Purpose
POST	/auth/signup	Email signup
POST	/auth/verify-otp	Verify signup OTP
POST	/auth/login	Login
POST	/auth/google	Google login
POST	/auth/forgot-password	Send reset OTP
POST	/auth/reset-password	Reset password

## 9. Steps to create & publish on GitHub (commands)

```bash
# create local repo
mkdir invoice-backend && cd invoice-backend
git init
# create files (copy scaffold above into files)
# then
git add .
git commit -m "chore: initial invoice-backend scaffold"
# create remote repo on GitHub and then:
git remote add origin git@github.com:YOUR_USERNAME/invoice-backend.git
git branch -M main
git push -u origin main
````

---

## 10. Future improvements (roadmap suggestions)

* Add user model & proper auth flows (register/login, RBAC)
* Add pagination and search for invoice lists
* Add uploads/attachments (receipts) to S3 / Blob storage
* Add webhooks for payment confirmation (e.g., M-Pesa or Stripe)
* Add front-end (React) and mobile offline support using Progressive Web App + local DB sync
* Add automated invoice numbering sequences per company
* Add audit logs and activity timeline

---
