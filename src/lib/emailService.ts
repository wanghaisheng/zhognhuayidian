// Email service for handling contact form submissions
export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Email service using EmailJS (client-side email service)
class EmailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;

  constructor() {
    // These should be set in environment variables
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
  }

  // Initialize EmailJS
  async initialize() {
    try {
      // Dynamically import EmailJS to avoid bundle size issues
      const emailjs = await import('@emailjs/browser');
      
      if (this.publicKey) {
        emailjs.init(this.publicKey);
      }
      
      return emailjs;
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      throw new Error('Email service initialization failed');
    }
  }

  // Send contact form email
  async sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
    try {
      // Check if EmailJS is configured
      if (!this.serviceId || !this.templateId || !this.publicKey) {
        console.warn('EmailJS not configured, using fallback method');
        return this.sendFallbackEmail(formData);
      }

      const emailjs = await this.initialize();

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        company: formData.company || 'Not specified',
        phone: formData.phone || 'Not provided',
        subject: formData.subject,
        message: formData.message,
        to_email: 'support@chinactscanner.org', // Your email address
        reply_to: formData.email
      };

      // Send email
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'Email sent successfully'
        };
      } else {
        throw new Error(`EmailJS returned status: ${response.status}`);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Try fallback method
      return this.sendFallbackEmail(formData);
    }
  }

  // Fallback method using mailto link
  private async sendFallbackEmail(formData: ContactFormData): Promise<EmailResponse> {
    try {
      const subject = encodeURIComponent(`Contact Form: ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Company: ${formData.company || 'Not specified'}\n` +
        `Phone: ${formData.phone || 'Not provided'}\n\n` +
        `Subject: ${formData.subject}\n\n` +
        `Message:\n${formData.message}`
      );

      const mailtoLink = `mailto:support@chinactscanner.org?subject=${subject}&body=${body}`;
      
      // Open default email client
      window.open(mailtoLink, '_blank');

      return {
        success: true,
        message: 'Email client opened. Please send the email from your default email application.'
      };
    } catch (error) {
      console.error('Fallback email method failed:', error);
      return {
        success: false,
        message: 'Failed to send email. Please contact us directly at support@chinactscanner.org',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate form data
  validateFormData(formData: ContactFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push('Name is required');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!this.validateEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.subject.trim()) {
      errors.push('Subject is required');
    }

    if (!formData.message.trim()) {
      errors.push('Message is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();