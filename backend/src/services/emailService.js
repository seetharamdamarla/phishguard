import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Use 'gmail' or configure host/port manually
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Changed from EMAIL_PASSWORD to match typical env usage
      }
    });
  }

  /**
   * Send OTP email for verification
   */
  async sendOTP(email, name, otp) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🔐 PhishGuard - Your Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
            }
            .otp-box {
              background: white;
              color: #667eea;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
              margin: 20px 0;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              opacity: 0.8;
            }
            .warning {
              background: rgba(255, 255, 255, 0.1);
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🛡️ PhishGuard Verification</h1>
            <p>Hello ${name},</p>
            <p>Thank you for signing up with PhishGuard! To complete your registration, please use the verification code below:</p>
            
            <div class="otp-box">${otp}</div>
            
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              Never share this code with anyone. PhishGuard will never ask for your verification code via email or phone.
            </div>
            
            <div class="footer">
              <p>If you didn't request this code, please ignore this email.</p>
              <p>© 2024 PhishGuard - Advanced Phishing Detection</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send welcome email after successful verification
   */
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🎉 Welcome to PhishGuard!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
            }
            .feature {
              background: rgba(255, 255, 255, 0.1);
              padding: 15px;
              border-radius: 5px;
              margin: 10px 0;
            }
            .cta-button {
              display: inline-block;
              background: white;
              color: #667eea;
              padding: 12px 30px;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎉 Welcome to PhishGuard, ${name}!</h1>
            <p>Your account has been successfully verified. You're now protected by advanced phishing detection technology.</p>
            
            <h3>What you can do with PhishGuard:</h3>
            
            <div class="feature">
              <strong>🔍 Analyze Suspicious Content</strong><br>
              Paste emails, messages, or URLs to detect phishing attempts
            </div>
            
            <div class="feature">
              <strong>📊 Detailed Reports</strong><br>
              Get comprehensive analysis with risk scores and recommendations
            </div>
            
            <div class="feature">
              <strong>💾 Download Reports</strong><br>
              Save and share professional PDF reports
            </div>
            
            <div class="feature">
              <strong>📈 Track History</strong><br>
              View your analysis history and trends
            </div>
            
            <p style="margin-top: 30px;">Ready to get started?</p>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">Go to Dashboard</a>
            
            <p style="margin-top: 30px; font-size: 12px; opacity: 0.8;">
              Stay safe online!<br>
              The PhishGuard Team
            </p>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email - it's not critical
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email, name, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '🔑 PhishGuard - Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
              padding: 30px;
              color: white;
            }
            .button {
              display: inline-block;
              background: white;
              color: #667eea;
              padding: 12px 30px;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
              margin: 20px 0;
            }
            .warning {
              background: rgba(255, 255, 255, 0.1);
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔑 Password Reset Request</h1>
            <p>Hello ${name},</p>
            <p>We received a request to reset your PhishGuard password. Click the button below to create a new password:</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>This link will expire in 1 hour.</p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request this password reset, please ignore this email and ensure your account is secure.
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; opacity: 0.8;">
              © 2024 PhishGuard - Advanced Phishing Detection
            </p>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }
}

export default new EmailService();
