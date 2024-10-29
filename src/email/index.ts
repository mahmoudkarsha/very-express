import nodemailer from 'nodemailer';

/**
 * A service for sending emails with customizable sender, recipient, subject, and content.
 *
 * The `EmailService` class provides methods for configuring email transport using environment
 * variables and sending emails with specified subject, HTML, and text content.
 *
 * @class EmailService
 */
class EmailService {
    private to: string;
    private from: string;

    /**
     * Creates an instance of EmailService.
     *
     * @param {string} destEmail - The recipient's email address.
     * @param {string} from - The sender's email address.
     *
     * @example
     * const emailService = new EmailService('recipient@example.com', 'sender@example.com');
     */
    constructor(destEmail: string, from: string) {
        this.to = destEmail;
        this.from = from;
    }

    /**
     * Configures and returns a nodemailer transport for sending emails.
     *
     * The transport configuration uses environment variables for SMTP host, port, username, and password.
     * If these environment variables are not set, it falls back to default values for testing.
     *
     * @returns {Transporter} - A configured nodemailer transporter instance.
     *
     * @example
     * const transporter = emailService.newTransport();
     * transporter.sendMail({ ... }); // Sends an email using the configured transport
     */
    newTransport() {
        return nodemailer.createTransport({
            host: process.env?.EMAIL_HOST || 'server.smtp',
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: { rejectUnauthorized: false },
        });
    }

    /**
     * Sends an email with the specified subject, HTML content, and text content.
     *
     * This method defines email options based on provided parameters and sends the email using
     * the configured transport. It requires all fields to be provided.
     *
     * @param {string} subject - The subject line of the email.
     * @param {string} html - The HTML content of the email.
     * @param {string} text - The plain text content of the email.
     * @throws {Error} - Throws an error if `subject`, `html`, or `text` is missing.
     *
     * @example
     * const subject = "Welcome to Our Service";
     * const htmlContent = "<h1>Welcome!</h1><p>Thank you for joining us.</p>";
     * const textContent = "Welcome! Thank you for joining us.";
     *
     * await emailService.send(subject, htmlContent, textContent);
     *
     * // Sends an email with the specified subject, HTML, and text content
     */
    async send(subject: string, html: string, text: string): Promise<void> {
        // Ensure required fields are provided
        if (!subject || !html || !text) {
            throw new Error('Subject, HTML content, and text content are required.');
        }

        // Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text,
        };

        // Create transport and send email
        await this.newTransport().sendMail(mailOptions);
    }
}

export { EmailService };
