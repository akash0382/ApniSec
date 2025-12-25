import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ override: true });

console.log("DEBUG: Email Service Module Loaded");

export class EmailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;
  private enabled: boolean;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    this.fromEmail = process.env.SMTP_FROM || "noreply@example.com";

    this.enabled = !!(host && user && pass);

    if (!this.enabled) {
      console.warn("EmailService: SMTP configuration is missing. Emails will not be sent.");
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    console.log(`EmailService initialized. Enabled: ${this.enabled}, From: ${this.fromEmail}`);
  }

  private async sendMail(options: { to: string; subject: string; html: string }): Promise<void> {
    if (!this.enabled) {
      console.warn(`EmailService: Skipping email to ${options.to} (Service disabled)`);
      return;
    }
    try {
      console.log(`EmailService: Attempting to send email to ${options.to} - Subject: ${options.subject}`);
      const info = await this.transporter.sendMail({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      console.log(`EmailService: Success! Message ID: ${info.messageId}`);
    } catch (error: any) {
      console.error(`EmailService: FAILED to send email to ${options.to}`);
      if (error.response) {
        console.error(`SMTP Response Error: ${error.response}`);
      } else {
        console.error(`Unexpected Error:`, error);
      }
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "Welcome to ApniSec!",
      html: this.getWelcomeEmailTemplate(name),
    });
  }

  async sendIssueCreatedEmail(
    to: string,
    issueType: string,
    title: string,
    description: string
  ): Promise<void> {
    await this.sendMail({
      to,
      subject: `New Issue Created: ${title}`,
      html: this.getIssueCreatedEmailTemplate(issueType, title, description),
    });
  }

  async sendProfileUpdatedEmail(to: string, name: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "Profile Updated Successfully",
      html: this.getProfileUpdatedEmailTemplate(name),
    });
  }

  async sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "Reset your ApniSec password",
      html: this.getPasswordResetEmailTemplate(resetLink),
    });
  }

  async sendPasswordResetSuccessEmail(to: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "Your ApniSec password was changed",
      html: this.getPasswordResetSuccessEmailTemplate(),
    });
  }

  async sendLoginEmail(to: string, name: string): Promise<void> {
    console.log(`Attempting to send login email to: ${to}`);
    await this.sendMail({
      to,
      subject: "New login to your ApniSec account",
      html: this.getLoginEmailTemplate(name),
    });
  }

  async sendLogoutEmail(to: string, name: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "You logged out of ApniSec",
      html: this.getLogoutEmailTemplate(name),
    });
  }

  async sendIssueUpdatedEmail(
    to: string,
    issueType: string,
    title: string,
    status?: string
  ): Promise<void> {
    await this.sendMail({
      to,
      subject: `Issue Updated: ${title}`,
      html: this.getIssueUpdatedEmailTemplate(issueType, title, status),
    });
  }

  async sendIssueDeletedEmail(to: string, title: string): Promise<void> {
    await this.sendMail({
      to,
      subject: `Issue Deleted: ${title}`,
      html: this.getIssueDeletedEmailTemplate(title),
    });
  }

  async sendFailedLoginEmail(to: string, name: string): Promise<void> {
    await this.sendMail({
      to,
      subject: "Failed login attempt detected",
      html: this.getFailedLoginEmailTemplate(name),
    });
  }

  private getWelcomeEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ApniSec</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Welcome to ApniSec!</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hello ${name},</p>
            <p>Thank you for joining ApniSec! We're excited to have you on board.</p>
            <p>ApniSec is your trusted partner for cybersecurity solutions, including:</p>
            <ul>
              <li>Cloud Security Assessments</li>
              <li>Red Team Assessments</li>
              <li>Vulnerability Assessment and Penetration Testing (VAPT)</li>
            </ul>
            <p>You can now log in to your dashboard and start managing your security issues.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getIssueCreatedEmailTemplate(
    issueType: string,
    title: string,
    description: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Issue Created</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Issue Created</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>A new issue has been created in your account:</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <p><strong>Type:</strong> ${issueType}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong></p>
              <p style="background: #f3f4f6; padding: 15px; border-radius: 5px;">${description}</p>
            </div>
            <p>You can view and manage this issue in your dashboard.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getProfileUpdatedEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profile Updated</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Profile Updated</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hello ${name},</p>
            <p>Your profile has been successfully updated.</p>
            <p>If you did not make this change, please contact our support team immediately.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Reset Your Password</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>We received a request to reset your password.</p>
            <p>Click the button below to set a new password:</p>
            <p style="text-align:center; margin: 24px 0;">
              <a href="${resetLink}" style="display:inline-block; background:#0ea5e9; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none;">Reset Password</a>
            </p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getPasswordResetSuccessEmailTemplate(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Password Changed</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Your ApniSec account password was changed successfully.</p>
            <p>If you did not perform this action, please contact support immediately.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getLoginEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Login</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">New Login Detected</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hello ${name},</p>
            <p>A new login to your ApniSec account just occurred.</p>
            <p>If this wasn’t you, please reset your password immediately.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getLogoutEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Logout Detected</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Logout Detected</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hello ${name},</p>
            <p>You have been successfully logged out of your ApniSec account.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getIssueUpdatedEmailTemplate(
    issueType: string,
    title: string,
    status?: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Issue Updated</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Issue Updated</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>An issue in your account has been updated:</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
              <p><strong>Type:</strong> ${issueType}</p>
              <p><strong>Title:</strong> ${title}</p>
              ${status ? `<p><strong>New Status:</strong> ${status}</p>` : ""}
            </div>
            <p>You can view the details in your dashboard.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getIssueDeletedEmailTemplate(title: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Issue Deleted</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Issue Deleted</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>The following issue has been deleted from your account:</p>
            <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p><strong>Title:</strong> ${title}</p>
            </div>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }

  private getFailedLoginEmailTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Failed Login Attempt</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #ef4444; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Security Alert</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Hello ${name},</p>
            <p>A failed login attempt to your ApniSec account was just detected.</p>
            <p>If this wasn't you, please ensure your account is secure by resetting your password.</p>
            <p style="margin-top: 30px;">Best regards,<br>The ApniSec Team</p>
          </div>
        </body>
      </html>
    `;
  }
}
