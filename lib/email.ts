import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailFrom =
  process.env.EMAIL_FROM || process.env.EMAIL_USER || "noreply@southindiandelights.com";

async function sendMail(options: nodemailer.SendMailOptions) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    const errorMessage = "Missing SMTP credentials: EMAIL_USER and EMAIL_PASSWORD are required.";
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    await transporter.verify();
  } catch (verifyError) {
    console.error("Email transporter verification failed:", verifyError);
    throw verifyError;
  }

  return transporter.sendMail({
    from: mailFrom,
    ...options,
  });
}

export async function sendOrderConfirmation(
  email: string,
  customerName: string,
  orderId: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .order-details { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .total { text-align: right; font-size: 18px; font-weight: bold; color: #f97316; margin-top: 15px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
          .button { display: inline-block; background: #f97316; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Order Confirmed!</h1>
            <p>Thank you for your order</p>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Your order has been successfully placed and is being prepared. Here are your order details:</p>
            
            <div class="order-details">
              <p><strong>Order ID:</strong> #${orderId}</p>
              <p><strong>Restaurant:</strong> South Indian Delights</p>
              <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>

            <h3>Order Items:</h3>
            <table>
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total">
              Total Amount: ₹${total.toFixed(2)}
            </div>

            <p style="margin-top: 20px; color: #666;">
              Your order is being prepared and will be delivered soon. You will receive updates via email about your order status.
            </p>

            <p style="margin-top: 20px;">
              <strong>Need help?</strong> Contact us at support@indiandelights.com or call 1-800-DELIGHTS
            </p>

            <div class="footer">
              <p>© 2026 South Indian Delights. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `Order Confirmed - #${orderId}\n\n` +
    items
      .map(
        (item) => `${item.quantity}x ${item.name} - ₹${(
          item.price * item.quantity
        ).toFixed(2)}`
      )
      .join("\n") +
    `\n\nTotal Amount: ₹${total.toFixed(2)}\n\nThank you for ordering from South Indian Delights.`;

  try {
    const result = await sendMail({
      to: email,
      subject: `Order Confirmed - #${orderId} | South Indian Delights`,
      html: htmlContent,
      text: textContent,
    });

    console.log("Customer confirmation email sent:", {
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      response: result.response,
    });

    return { success: true };
  } catch (err) {
    console.error("Customer email sending failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendOrderStatusUpdate(
  email: string,
  customerName: string,
  orderId: string,
  status: string,
  message: string
) {
  const statusColors: Record<string, string> = {
    confirmed: "#f97316",
    preparing: "#3b82f6",
    out_for_delivery: "#06b6d4",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  const statusEmojis: Record<string, string> = {
    confirmed: "✅",
    preparing: "👨‍🍳",
    out_for_delivery: "🚗",
    delivered: "📦",
    cancelled: "❌",
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .status-header { background: ${statusColors[status] || "#666"}; color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="status-header">
            <h1>${statusEmojis[status] || "📦"} Order ${status.replace("_", " ").toUpperCase()}</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Order #${orderId} status has been updated:</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Status:</strong> ${status.replace("_", " ").toUpperCase()}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>

            <p style="margin-top: 20px; color: #666;">
              We'll keep you updated on your order. Thank you for choosing South Indian Delights!
            </p>

            <div class="footer">
              <p>© 2026 South Indian Delights. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@southindiandelights.com",
      to: email,
      subject: `Order Update - #${orderId} | ${status.replace("_", " ")} | South Indian Delights`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Email sending failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendRegistrationConfirmation(
  email: string,
  customerName: string
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .welcome-message { font-size: 18px; margin: 20px 0; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to South Indian Delights!</h1>
            <p>Your account has been created successfully</p>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p class="welcome-message">Thank you for joining South Indian Delights! We're excited to serve you authentic South Indian cuisine.</p>
            
            <p>You can now:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li>Browse our delicious menu</li>
              <li>Place orders for pickup or delivery</li>
              <li>Track your order status</li>
              <li>Leave reviews and feedback</li>
            </ul>

            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://southindiandelights.com'}/login" class="button">Start Ordering Now</a>
            </p>

            <p style="margin-top: 20px; color: #666;">
              If you have any questions, feel free to contact our support team.
            </p>

            <div class="footer">
              <p>© 2026 South Indian Delights. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@southindiandelights.com",
      to: email,
      subject: `Welcome to South Indian Delights, ${customerName}!`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Email sending failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  customerName: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://southindiandelights.com'}/reset-password?token=${resetToken}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .reset-message { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 5px; padding: 15px; margin: 20px 0; }
          .button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>We received a request to reset your password for your South Indian Delights account.</p>
            
            <div class="reset-message">
              <p><strong>Click the button below to reset your password:</strong></p>
              <p style="text-align: center; margin: 15px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              <p><strong>This link will expire in 1 hour.</strong></p>
            </div>

            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>

            <p style="margin-top: 20px; color: #666;">
              For security reasons, this link can only be used once. If you need to reset your password again, please request a new link.
            </p>

            <div class="footer">
              <p>© 2026 South Indian Delights. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@southindiandelights.com",
      to: email,
      subject: `Password Reset - South Indian Delights`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Email sending failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendFeedbackAcknowledgment(
  email: string,
  customerName: string,
  feedbackMessage: string
) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .feedback-quote { background-color: #f3f4f6; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; font-style: italic; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🙏 Thank You for Your Feedback!</h1>
          </div>
          <div class="content">
            <p>Hi ${customerName},</p>
            <p>Thank you for taking the time to share your feedback with South Indian Delights. We truly appreciate your input as it helps us improve our service.</p>
            
            <div class="feedback-quote">
              "${feedbackMessage}"
            </div>

            <p>Your feedback has been recorded and will be reviewed by our team. We strive to provide the best possible experience for all our customers.</p>

            <p style="margin-top: 20px;">
              <strong>Have more to share?</strong> Feel free to contact us anytime at support@indiandelights.com
            </p>

            <div class="footer">
              <p>© 2026 South Indian Delights. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@southindiandelights.com",
      to: email,
      subject: `Thank You for Your Feedback - South Indian Delights`,
      html: htmlContent,
    });
    return { success: true };
  } catch (err) {
    console.error("Email sending failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function sendAdminOrderNotification(
  orderId: string,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  address: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number
) {
  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .order-details { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .total { text-align: right; font-size: 18px; font-weight: bold; color: #f97316; margin-top: 15px; }
          .action-button { display: inline-block; background: #f97316; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; margin: 10px 0; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🆕 New Order Received!</h1>
            <p>Order #${orderId} requires processing</p>
          </div>
          <div class="content">
            <p><strong>New order has been placed and requires your attention!</strong></p>
            
            <div class="order-details">
              <p><strong>Order ID:</strong> #${orderId}</p>
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Phone:</strong> ${customerPhone}</p>
              <p><strong>Delivery Address:</strong> ${address}</p>
              <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <h3>Order Items:</h3>
            <table>
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="total">
              Total Amount: ₹${total.toFixed(2)}
            </div>

            <p style="margin-top: 20px;">
              <strong>Action Required:</strong> Please review and process this order in the admin dashboard.
            </p>

            <p style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://southindiandelights.com'}/dashboard/admin" class="action-button">View in Admin Dashboard</a>
            </p>

            <div class="footer">
              <p>© 2026 South Indian Delights. All rights reserved.</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    console.log('=== ADMIN ORDER NOTIFICATION ===');
    console.log('To:', process.env.ADMIN_EMAIL || "admin@southindiandelights.com");
    console.log('Subject:', `New Order #${orderId} - Processing Required`);
    console.log('Order Details:', {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      total,
      items: items.map(item => `${item.quantity}x ${item.name} - $${item.price * item.quantity}`).join(', ')
    });
    console.log('Email HTML Preview:', htmlContent.substring(0, 200) + '...');
    console.log('================================');
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@southindiandelights.com",
      to: process.env.ADMIN_EMAIL || "admin@southindiandelights.com",
      subject: `New Order #${orderId} - Processing Required`,
      html: htmlContent,
    });
    
    return { success: true };
  } catch (err) {
    console.error("Admin email sending failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
