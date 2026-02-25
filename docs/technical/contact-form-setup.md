# Contact Form Email Setup Guide

## Overview

The contact form has been enhanced with email functionality using EmailJS, a client-side email service that allows sending emails directly from the browser without a backend server.

## Features

### ✅ Implemented Features
- **Form Validation**: Client-side validation for required fields and email format
- **Email Service**: Integration with EmailJS for sending emails
- **Fallback Method**: Automatic fallback to mailto links if EmailJS fails
- **Loading States**: Visual feedback during form submission
- **Success/Error Messages**: User-friendly status messages
- **Bilingual Support**: Full English and Chinese language support
- **Responsive Design**: Works on all device sizes

### 📧 Email Configuration

The contact form sends emails to: `support@chinactscanner.org`

## Setup Instructions

### 1. EmailJS Account Setup

1. **Create EmailJS Account**
   - Go to [https://www.emailjs.com/](https://www.emailjs.com/)
   - Sign up for a free account
   - Free tier includes 200 emails/month

2. **Create Email Service**
   - In EmailJS dashboard, go to "Email Services"
   - Add a new service (Gmail, Outlook, etc.)
   - Connect your email account

3. **Create Email Template**
   - Go to "Email Templates"
   - Create a new template with these variables:
     ```
     From: {{from_name}} <{{from_email}}>
     Subject: Contact Form: {{subject}}
     
     Name: {{from_name}}
     Email: {{from_email}}
     Company: {{company}}
     Phone: {{phone}}
     
     Subject: {{subject}}
     
     Message:
     {{message}}
     ```

4. **Get Configuration Keys**
   - Service ID: Found in "Email Services" section
   - Template ID: Found in "Email Templates" section
   - Public Key: Found in "Account" > "General" section

### 2. Environment Variables

Add these variables to your `.env` file:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your-public-key-here
```

### 3. Fallback Behavior

If EmailJS is not configured or fails:
- The form automatically falls back to opening the user's default email client
- A pre-filled email is created with all form data
- User can send the email manually

## Form Fields

### Required Fields
- **Name**: Contact person's name
- **Email**: Contact person's email address
- **Subject**: Brief description of inquiry
- **Message**: Detailed description of needs/questions

### Optional Fields
- **Company/Organization**: Business name
- **Phone Number**: Contact phone number

## Email Template Variables

The following variables are sent to the EmailJS template:

| Variable | Description | Example |
|----------|-------------|---------|
| `from_name` | Contact person's name | "John Smith" |
| `from_email` | Contact person's email | "john@example.com" |
| `company` | Company name (or "Not specified") | "ABC Hospital" |
| `phone` | Phone number (or "Not provided") | "+1-555-0123" |
| `subject` | Inquiry subject | "CT Scanner Inquiry" |
| `message` | Detailed message | "We need information about..." |
| `to_email` | Your email address | "support@chinactscanner.org" |
| `reply_to` | Reply-to address | Same as `from_email` |

## Testing

### 1. Test Form Submission
1. Navigate to `/contact` page
2. Fill out the contact form
3. Submit and verify email is received

### 2. Test Fallback Method
1. Remove EmailJS environment variables
2. Submit form
3. Verify mailto link opens with pre-filled data

### 3. Test Validation
1. Try submitting empty form
2. Try submitting invalid email
3. Verify error messages appear

## Troubleshooting

### Common Issues

1. **EmailJS Not Working**
   - Check environment variables are set correctly
   - Verify EmailJS service and template IDs
   - Check browser console for errors
   - Ensure EmailJS account is active

2. **Emails Not Received**
   - Check spam/junk folder
   - Verify email service configuration in EmailJS
   - Test with different email addresses

3. **Form Validation Errors**
   - Check required fields are filled
   - Verify email format is valid
   - Ensure message is not empty

### Debug Mode

To enable debug logging, open browser console and look for:
- EmailJS initialization messages
- Form validation errors
- Email sending status

## Security Considerations

### ✅ Secure Practices
- Client-side validation only (server-side validation recommended for production)
- EmailJS public key is safe to expose (it's designed for client-side use)
- No sensitive data stored in browser

### ⚠️ Limitations
- Rate limiting: 200 emails/month on free tier
- Client-side only: No server-side validation
- Dependent on EmailJS service availability

## Future Enhancements

### Potential Improvements
1. **Server-side Integration**: Add backend API for more robust email handling
2. **CAPTCHA**: Add spam protection
3. **File Attachments**: Allow users to attach files
4. **Auto-responder**: Send confirmation emails to users
5. **CRM Integration**: Connect to customer management system

## Files Modified

### New Files
- `src/lib/emailService.ts` - Email service implementation
- `docs/contact-form-setup.md` - This documentation

### Modified Files
- `src/pages/ContactPage.tsx` - Enhanced contact form
- `.env.example` - Added EmailJS configuration examples

## Contact Form URLs

- **English**: `/contact`
- **Chinese**: `/contact` (same URL, language detected automatically)

The contact form is now fully functional and ready for use!