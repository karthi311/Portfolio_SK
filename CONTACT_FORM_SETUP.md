# Contact Form Setup Guide

The contact form uses **EmailJS** to send emails directly from your portfolio without a backend server.

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (free tier: 200 emails/month)

### Step 2: Create Email Service
1. Go to **Email Services** → **Add New Service**
2. Choose **Gmail** (or your email provider)
3. Connect your email account
4. Copy your **Service ID** (looks like: `service_xxxxx`)

### Step 3: Create Email Template
1. Go to **Email Templates** → **Create New Template**
2. Use this template:

```
Subject: {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

3. Copy your **Template ID** (looks like: `template_xxxxx`)

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (looks like: `xxxxxxxxxxxxx`)

### Step 5: Update Your Code
Open `script.js` and replace these placeholders:

```javascript
// Line ~220: Replace with your Public Key
emailjs.init('YOUR_PUBLIC_KEY');

// Line ~240: Replace with your Service ID
await emailjs.send(
    'YOUR_SERVICE_ID',  // ← Replace this
    'YOUR_TEMPLATE_ID', // ← Replace this
    // ...
);
```

## Testing
1. Fill out the contact form on your portfolio
2. Click "Send Message"
3. Check your email inbox - you should receive the message!

## Fallback
If EmailJS isn't configured, the form will automatically fall back to opening the user's email client (mailto: link).

## Troubleshooting
- **Not receiving emails?** Check your EmailJS dashboard for error logs
- **Form not submitting?** Check browser console for errors
- **Need more emails?** Upgrade your EmailJS plan (free tier: 200/month)

---

**That's it!** Your contact form will now work perfectly. 🚀

