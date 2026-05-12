const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { to, name, amount, seva, paymentId, date, pdfBase64 } = JSON.parse(event.body);

    if (!to || !name || !pdfBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: to, name, pdfBase64' }),
      };
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0;">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">

  <div style="background:#8b1a1a;padding:30px 20px;text-align:center;">
    <h1 style="color:#e8b84b;font-size:22px;margin:0 0 6px;">&#x0964; &#x0936;&#x094D;&#x0930;&#x0940; &#x0938;&#x094D;&#x0935;&#x092F;&#x0902;&#x092D;&#x0942; &#x0917;&#x0923;&#x0947;&#x0936; &#x091F;&#x094D;&#x0930;&#x0938;&#x094D;&#x091F; &#x0964;</h1>
    <p style="color:#f5dfa0;font-size:13px;margin:0;letter-spacing:1px;">SHRI SWAYAMBHU GANESH TRUST &middot; E.R. 21196 &middot; EST. 1988</p>
  </div>

  <div style="background:#c8922a;padding:10px;text-align:center;font-weight:bold;letter-spacing:1px;color:#5c1010;font-size:13px;">
    &#10022; OFFICIAL DONATION RECEIPT &mdash; 80G TAX EXEMPTION &#10022;
  </div>

  <div style="padding:30px 35px;">
    <p style="font-size:17px;color:#2b0a0a;margin-bottom:16px;">Dear <strong>${name}</strong>,</p>

    <div style="background:#fff8ee;border-left:4px solid #c8922a;padding:14px 18px;border-radius:4px;margin-bottom:24px;color:#5c1010;font-size:15px;">
      &#x1F64F; Ganpati Bappa Morya! Thank you for your generous donation of
      <strong>&#x20B9;${Number(amount).toLocaleString('en-IN')}</strong> to
      <strong>Shri Swayambhu Ganesh Trust</strong>.
      Your official 80G PDF receipt is attached to this email.
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;border:1px solid #e0c890;border-radius:6px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#f9f0da;">
        <td colspan="2" style="padding:10px 16px;font-weight:bold;color:#8b1a1a;font-size:14px;letter-spacing:1px;text-transform:uppercase;">
          &#x1F4CB; Donation Summary
        </td>
      </tr>
      <tr style="background:#fff8ee;">
        <td style="padding:12px 16px;color:#888;font-size:13px;width:45%;border-top:1px solid #f0e0c0;">Donation Amount</td>
        <td style="padding:12px 16px;color:#8b1a1a;font-size:18px;font-weight:bold;text-align:right;border-top:1px solid #f0e0c0;">&#x20B9;${Number(amount).toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#888;font-size:13px;border-top:1px solid #f0e0c0;">Donated For</td>
        <td style="padding:12px 16px;color:#2b0a0a;font-weight:bold;font-size:14px;text-align:right;border-top:1px solid #f0e0c0;">${seva}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#888;font-size:13px;border-top:1px solid #f0e0c0;">Donor Name</td>
        <td style="padding:12px 16px;color:#2b0a0a;font-weight:bold;font-size:14px;text-align:right;border-top:1px solid #f0e0c0;">${name}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#888;font-size:13px;border-top:1px solid #f0e0c0;">Payment ID</td>
        <td style="padding:12px 16px;color:#2b0a0a;font-weight:bold;font-size:14px;text-align:right;border-top:1px solid #f0e0c0;">${paymentId}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#888;font-size:13px;border-top:1px solid #f0e0c0;">Date</td>
        <td style="padding:12px 16px;color:#2b0a0a;font-weight:bold;font-size:14px;text-align:right;border-top:1px solid #f0e0c0;">${date}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;color:#888;font-size:13px;border-top:1px solid #f0e0c0;">Trust Registration</td>
        <td style="padding:12px 16px;color:#2b0a0a;font-weight:bold;font-size:14px;text-align:right;border-top:1px solid #f0e0c0;">E.R. 21196</td>
      </tr>
    </table>

    <div style="background:#f0f9f0;border:1px solid #90c890;border-radius:6px;padding:16px 18px;margin-bottom:24px;">
      <h3 style="color:#2a6a2a;font-size:14px;margin:0 0 10px;">&#x1F7E2; 80G Income Tax Exemption</h3>
      <p style="color:#444;font-size:13px;margin:4px 0;">&#x2705; This donation is eligible for deduction under <strong>Section 80G</strong> of the Income Tax Act, 1961.</p>
      <p style="color:#444;font-size:13px;margin:4px 0;">&#x2705; Your official PDF receipt is attached &mdash; retain it for tax filing.</p>
      <p style="color:#444;font-size:13px;margin:4px 0;">&#x2705; 80G Certificate No: <strong>CIT(E)/80G/2024-25/XXX</strong> &nbsp;|&nbsp; PAN: <strong>AAETS7338D</strong></p>
    </div>

    <p style="font-size:13px;color:#888;text-align:center;">
      For queries contact us at
      <a href="mailto:shreeswayambhuganeshtrust@gmail.com" style="color:#8b1a1a;">shreeswayambhuganeshtrust@gmail.com</a>
      &nbsp;|&nbsp; &#x1F4DE; +91 84338 19659
    </p>
  </div>

  <div style="background:#2b0a0a;padding:24px;text-align:center;">
    <p style="color:#f5dfa0;font-size:12px;margin:4px 0;">&#x1F6D5; <strong>Shri Swayambhu Ganesh Temple</strong></p>
    <p style="color:#f5dfa0;font-size:12px;margin:4px 0;">Desai Darji Wadi, Ashok Nagar, Road No.3, Kandivali East, Mumbai &mdash; 400101</p>
    <p style="color:#f5dfa0;font-size:12px;margin:4px 0;margin-top:10px;">&#x1F556; Morning: 6:00 AM &ndash; 1:00 PM &nbsp;|&nbsp; Evening: 5:00 PM &ndash; 9:00 PM</p>
    <p style="margin:4px 0;"><a href="https://shreeswayambhuganeshtrust.in" style="color:#e8b84b;text-decoration:none;">shreeswayambhuganeshtrust.in</a></p>
  </div>

</div>
</body>
</html>`;

    await sgMail.send({
      to,
      from: {
        email: 'shreeswayambhuganeshtrust@gmail.com',
        name: 'Shri Swayambhu Ganesh Trust',
      },
      subject: 'Donation Receipt | श्री स्वयंभू गणेश ट्रस्ट | 80G Tax Exemption',
      html: emailHtml,
      attachments: [
        {
          content: pdfBase64,
          filename: `SGT-Receipt-${paymentId}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    console.error('SendGrid error:', err.response ? err.response.body : err.message);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
