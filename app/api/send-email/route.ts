import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, formData } = body;

    // Validate environment variables
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const recipientEmail = process.env.RECIPIENT_EMAIL || smtpUser;

    if (!smtpUser || !smtpPassword) {
      return NextResponse.json(
        { error: 'SMTP configuration is missing. Please set SMTP_USER and SMTP_PASSWORD in your environment variables.' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    let emailSubject = '';
    let emailHtml = '';

    if (type === 'subsidy') {
      // Subsidy inquiry email
      emailSubject = `New Solar Subsidy Inquiry - ${formData.name}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0d9488; margin-bottom: 5px; display: block; }
            .value { color: #1f2937; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">🌞 New Solar Subsidy Inquiry</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Full Name:</span>
                <span class="value">${formData.name}</span>
              </div>
              <div class="field">
                <span class="label">Phone Number:</span>
                <span class="value">${formData.phone}</span>
              </div>
              ${formData.email ? `
              <div class="field">
                <span class="label">Email:</span>
                <span class="value">${formData.email}</span>
              </div>
              ` : ''}
              <div class="field">
                <span class="label">City:</span>
                <span class="value">${formData.city}</span>
              </div>
              ${formData.propertyType ? `
              <div class="field">
                <span class="label">Property Type:</span>
                <span class="value">${formData.propertyType}</span>
              </div>
              ` : ''}
              ${formData.notes ? `
              <div class="field">
                <span class="label">Additional Notes:</span>
                <span class="value">${formData.notes}</span>
              </div>
              ` : ''}
              ${formData.referrerName || formData.referrerPhone ? `
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <h3 style="color: #0d9488; margin-bottom: 15px; font-size: 16px;">Referrer Information</h3>
                ${formData.referrerName ? `
                <div class="field">
                  <span class="label">Referrer Name:</span>
                  <span class="value">${formData.referrerName}</span>
                </div>
                ` : ''}
                ${formData.referrerPhone ? `
                <div class="field">
                  <span class="label">Referrer Phone:</span>
                  <span class="value">${formData.referrerPhone}</span>
                </div>
                ` : ''}
              </div>
              ` : ''}
            </div>
            <div class="footer">
              <p style="margin: 0;">This inquiry was submitted through the Mahalaxmi Solar Energies website.</p>
              <p style="margin: 5px 0 0 0;">Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'contact') {
      // Contact form email
      emailSubject = formData.subject ? `Contact Form: ${formData.subject}` : `Contact Form Inquiry - ${formData.name}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0d9488; margin-bottom: 5px; display: block; }
            .value { color: #1f2937; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #0d9488; margin-top: 10px; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; color: #6b7280; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📧 New Contact Form Inquiry</h2>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${formData.name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span>
                <span class="value">${formData.email}</span>
              </div>
              ${formData.phone ? `
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${formData.phone}</span>
              </div>
              ` : ''}
              ${formData.subject ? `
              <div class="field">
                <span class="label">Subject:</span>
                <span class="value">${formData.subject}</span>
              </div>
              ` : ''}
              <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">${formData.message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">This inquiry was submitted through the Mahalaxmi Solar Energies website.</p>
              <p style="margin: 5px 0 0 0;">Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      return NextResponse.json(
        { error: 'Invalid email type' },
        { status: 400 }
      );
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Mahalaxmi Solar Energies" <${smtpUser}>`,
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully',
        messageId: info.messageId 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

