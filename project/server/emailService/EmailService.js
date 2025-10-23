const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const {
  adminContactFormTemplate,
  customerContactFormTemplate
} = require('./templates/contactFormTemplates');
const {
  newsletterSubscriptionTemplate,
  welcomeNewsletterTemplate
} = require('./templates/newsletterTemplates');
const {
  verificationEmailTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate
} = require('./templates/authTemplates');
const {
  orderConfirmationTemplate,
  orderAdminNotificationTemplate,
  orderStatusUpdateTemplate
} = require('./templates/orderTemplates');

class EmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });
    this.adminEmail = process.env.ADMIN_EMAIL;
  }

  async getAccessToken() {
    try {
      const { token } = await this.oauth2Client.getAccessToken();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async createTransporter() {
    try {
      const accessToken = await this.getAccessToken();
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken
        }
      });

      return transporter;
    } catch (error) {
      console.error('Error creating transporter:', error);
      throw error;
    }
  }

  async sendNewsletterSubscriptionNotification(subscriberData) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
  from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
  to: this.adminEmail,
  subject: 'New Newsletter Subscription - Sarvin Electronics',
  html: newsletterSubscriptionTemplate(subscriberData)
};


      await transporter.sendMail(mailOptions);
      console.log('Newsletter subscription notification sent to admin');
      return { success: true, message: 'Newsletter subscription notification sent' };
    } catch (error) {
      console.error('Error sending newsletter subscription notification:', error);
      throw error;
    }
  }

  async sendContactFormNotification(contactData) {
    try {
      const transporter = await this.createTransporter();

      // Email to admin
      const adminMailOptions = {
  from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
  to: this.adminEmail,
  subject: `New Contact Form Submission - ${contactData.subject}`,
  html: adminContactFormTemplate(contactData)
};

const customerMailOptions = {
  from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
  to: contactData.email,
  subject: 'Thank you for contacting Sarvin Electronics',
  html: customerContactFormTemplate(contactData)
};


      // Send both emails
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(customerMailOptions)
      ]);

      console.log('Contact form notifications sent to both admin and customer');
      return { success: true, message: 'Contact form notifications sent' };
    } catch (error) {
      console.error('Error sending contact form notifications:', error);
      throw error;
    }
  }

  async sendWelcomeEmailToSubscriber(subscriberData) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: subscriberData.email,
        subject: 'Welcome to Sarvin Electronics Newsletter!',
        html: welcomeNewsletterTemplate(subscriberData)
      };

      await transporter.sendMail(mailOptions);
      console.log('Welcome email sent to subscriber');
      return { success: true, message: 'Welcome email sent' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, verificationToken, name) {
    try {
      const transporter = await this.createTransporter();
      
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: verificationEmailTemplate(email, verificationUrl, name)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Verification email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, resetToken, name) {
    try {
      const transporter = await this.createTransporter();
      
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password',
        html: passwordResetTemplate(email, resetUrl, name)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Welcome to ${process.env.APP_NAME}!`,
        html: welcomeEmailTemplate(email, name)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendOrderConfirmationEmail(order, user) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: `Order Confirmation - #${order.orderId}`,
        html: orderConfirmationTemplate(order, user)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent to customer:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  async sendOrderNotificationToAdmin(order, user) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order Received - #${order.orderId}`,
        html: orderAdminNotificationTemplate(order, user)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Order notification email sent to admin:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending order notification email to admin:', error);
      throw error;
    }
  }

  async sendOrderStatusUpdateEmail(order, user, newStatus, oldStatus) {
    try {
      const transporter = await this.createTransporter();

      const statusTitles = {
        processing: 'Order is Being Processed',
        shipped: 'Order Has Been Shipped',
        delivered: 'Order Delivered Successfully',
        cancelled: 'Order Has Been Cancelled'
      };

      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: `${statusTitles[newStatus] || 'Order Status Update'} - #${order.orderId}`,
        html: orderStatusUpdateTemplate(order, user, newStatus, oldStatus)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Order status update email sent to customer:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending order status update email:', error);
      throw error;
    }
  }

  async sendStockNotification(email, productName, productId) {
    try {
      const transporter = await this.createTransporter();
      const productUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/product/${productId}`;

      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `${productName} is Back in Stock!`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Product Back in Stock</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #16a34a 0%, #059669 100%);">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Good News!</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px;">Your Wishlist Item is Back in Stock!</h2>
                        <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Great news! <strong>${productName}</strong> is now back in stock and ready to order.
                        </p>
                        <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.5;">
                          Don't miss out - this popular item sells out quickly!
                        </p>
                        <table role="presentation" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 6px; background: linear-gradient(135deg, #16a34a 0%, #059669 100%);">
                              <a href="${productUrl}" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                                View Product
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                          You received this email because you requested to be notified when this product becomes available.
                        </p>
                        <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px; text-align: center;">
                          © ${new Date().getFullYear()} ${process.env.APP_NAME || 'EcoTrade'}. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Stock notification email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending stock notification email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();