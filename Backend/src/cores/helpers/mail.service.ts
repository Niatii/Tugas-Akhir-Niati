import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('MAIL_USER');
    const pass = this.configService.get<string>('MAIL_PASS');

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });

    // Verifikasi koneksi SMTP saat startup
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error(`SMTP connection failed: ${error.message}`);
      } else {
        this.logger.log(`SMTP ready — connected as ${user}`);
      }
    });
  }

  async sendResetPasswordEmail(
    toEmail: string,
    userName: string,
    resetToken: string,
  ): Promise<void> {
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:9000',
    );
    const resetLink = `${frontendUrl}/auth/reset-kata-sandi?token=${resetToken}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"BridgeUp" <${this.configService.get<string>('MAIL_USER')}>`,
      to: toEmail,
      subject: 'Reset Kata Sandi Akun BridgeUp Anda',
      html: `
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Reset Kata Sandi</title>
          <style>
            body { margin: 0; padding: 0; background-color: #f0f4ff; font-family: 'Segoe UI', Arial, sans-serif; }
            .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(63, 81, 181, 0.10); }
            .header { background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%); padding: 36px 32px 28px; text-align: center; }
            .header h1 { color: #ffffff; font-size: 24px; margin: 0; font-weight: 700; letter-spacing: 0.5px; }
            .header p { color: #c5cae9; font-size: 13px; margin: 6px 0 0; }
            .body { padding: 36px 32px; }
            .body p { color: #424242; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
            .body .name { font-weight: 600; color: #3f51b5; }
            .btn-wrap { text-align: center; margin: 32px 0 24px; }
            .btn { display: inline-block; background: linear-gradient(135deg, #3f51b5, #5c6bc0); color: #ffffff !important; text-decoration: none; padding: 14px 40px; border-radius: 30px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px; }
            .note { background: #f3f4fb; border-left: 4px solid #7986cb; border-radius: 8px; padding: 14px 18px; margin: 20px 0; }
            .note p { color: #5c6bc0; font-size: 13px; margin: 0; line-height: 1.6; }
            .link-fallback { word-break: break-all; color: #7986cb; font-size: 12px; }
            .footer { background: #f8f9ff; border-top: 1px solid #e8eaf6; padding: 20px 32px; text-align: center; }
            .footer p { color: #9e9e9e; font-size: 12px; margin: 0; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Reset Kata Sandi</h1>
              <p>BridgeUp — Platform Manajemen Organisasi</p>
            </div>
            <div class="body">
              <p>Halo, <span class="name">${userName}</span>!</p>
              <p>Kami menerima permintaan untuk mereset kata sandi akun BridgeUp kamu. Klik tombol di bawah untuk membuat kata sandi baru:</p>
              <div class="btn-wrap">
                <a href="${resetLink}" class="btn">Reset Kata Sandi</a>
              </div>
              <div class="note">
                <p>⏰ <strong>Link ini hanya berlaku selama 1 jam.</strong><br/>
                Jika kamu tidak meminta reset kata sandi, abaikan email ini. Kata sandimu tetap aman.</p>
              </div>
              <p>Jika tombol di atas tidak berfungsi, salin dan tempelkan link berikut ke browser kamu:</p>
              <p class="link-fallback">${resetLink}</p>
            </div>
            <div class="footer">
              <p>Email ini dikirim otomatis oleh sistem BridgeUp.<br/>Mohon tidak membalas email ini.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Reset password email sent to ${toEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send reset password email to ${toEmail}`, error.stack);
      throw error;
    }
  }
}
