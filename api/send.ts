import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.error('GMAIL credentials are not configured');
    return res.status(500).json({ error: 'Email sender not configured' });
  }

  try {
    const timestamp = new Date().toISOString();

    const ownerHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.4">
        <h2 style="margin-bottom:0.25rem">New contact request</h2>
        <p style="color:#555;margin-top:0">Received: ${timestamp}</p>
        <hr style="border:none;border-top:1px solid #eee;margin:1rem 0" />
        <h3 style="margin-bottom:0.25rem">Sender details</h3>
        <table cellpadding="4" style="border-collapse:collapse">
          <tr><td style="font-weight:600;padding-right:8px">Name:</td><td>${name}</td></tr>
          <tr><td style="font-weight:600;padding-right:8px">Email:</td><td>${email}</td></tr>
        </table>
        <h3 style="margin-top:1rem;margin-bottom:0.25rem">Message</h3>
        <div style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:6px;border:1px solid #eee">${message}</div>
      </div>
    `;

    const ownerText = `New contact request\nReceived: ${timestamp}\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    const ownerMailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New message from ${name}`,
      html: ownerHtml,
      text: ownerText,
      replyTo: email,
    };

    const info = await transporter.sendMail(ownerMailOptions);

    // Send a confirmation email to the sender so they receive a receipt
    const senderHtml = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.4">
        <p>Hi ${name},</p>
        <p>Thanks for reaching out — I have received your message and will get back to you as soon as possible.</p>
        <h4 style="margin-bottom:0.25rem">Your message</h4>
        <div style="white-space:pre-wrap;background:#f8f8f8;padding:12px;border-radius:6px;border:1px solid #eee">${message}</div>
        <p style="color:#666;font-size:13px;margin-top:1rem">If you need to follow up, reply to this email or contact me directly at ${process.env.GMAIL_USER}.</p>
      </div>
    `;

    const senderText = `Hi ${name},\n\nThanks for reaching out — I have received your message and will get back to you as soon as possible.\n\nYour message:\n${message}\n\nIf you need to follow up, reply or contact ${process.env.GMAIL_USER}`;

    // attempt to send confirmation to the sender; don't fail the whole request if this fails
    try {
      const senderMailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: `Thanks for contacting — I received your message`,
        html: senderHtml,
        text: senderText,
        replyTo: process.env.GMAIL_USER,
      };

      await transporter.sendMail(senderMailOptions);
    } catch (sendErr) {
      console.warn('Failed to send confirmation to sender:', sendErr);
    }

    res.status(200).json({ success: true, messageId: info.messageId ?? info.response });
  } catch (error: any) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
