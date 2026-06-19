// Netlify Serverless Function: netlify/functions/place-order.js
// Zero-dependency (uses native Node.js fetch) to process secure emails and SMS notifications.

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body);
    const {
      name,
      email,
      phone,
      address,
      coupon_applied,
      savings,
      gift_wrap_packaging,
      gift_message_card,
      customer_ring_size_preferences,
      ordered_products,
      delivery_shipping_charge,
      final_payable_amount,
      orderId,
      date
    } = payload;

    console.log(`Processing Order ${orderId || 'Unknown'} for ${name}...`);

    let emailSent = false;
    let smsSent = false;
    let logs = [];

    // ─── 1. SEND EMAILS VIA RESEND ───
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const merchantEmail = 'rosevow4u@gmail.com';
        
        // Build email html
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px; background-color: #fff8f5;">
            <h2 style="color: #6D214F; text-align: center; border-bottom: 2px solid #e85d75; padding-bottom: 10px;">Rosevow Order Confirmed</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for shopping with <strong>Rosevow Elegance Redefined</strong>! We have received your order request and our team is preparing it for shipment.</p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #6d214f;">
              <h3 style="margin-top: 0; color: #6D214F;">Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Delivery Address:</strong> ${address}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Ring Size Pref:</strong> ${customer_ring_size_preferences}</p>
              <p><strong>Gift Wrapped:</strong> ${gift_wrap_packaging === 'Yes' ? 'Yes (+₹50)' : 'No'}</p>
              ${gift_message_card && gift_message_card !== 'None' ? `<p><strong>Gift Note:</strong> "${gift_message_card}"</p>` : ''}
            </div>

            <h4 style="color: #6D214F; margin-bottom: 8px;">Items Ordered:</h4>
            <pre style="background: #f7f7f7; padding: 12px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; font-size: 14px;">${ordered_products}</pre>

            <div style="text-align: right; margin-top: 15px; font-size: 16px;">
              <p><strong>Shipping:</strong> ${delivery_shipping_charge}</p>
              ${savings && savings !== '₹0' ? `<p style="color: #e85d75;"><strong>Savings:</strong> ${savings}</p>` : ''}
              <p style="font-size: 18px; color: #6D214F;"><strong>Total Amount:</strong> <strong>${final_payable_amount}</strong></p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">
              This is an automated receipt for your transaction. If you have questions, please reach out to us at rosevow4u@gmail.com or via WhatsApp at +916239493835.
            </p>
          </div>
        `;

        // Send to Merchant
        const merchantResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Rosevow Orders <onboarding@resend.dev>',
            to: [merchantEmail],
            subject: `New Order Placed: ${orderId} by ${name}`,
            html: emailHtml
          })
        });

        const merchantResData = await merchantResponse.json();
        
        // Send to Customer (Only if domain is verified or they are testing with verified email)
        const customerResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Rosevow Elegance <onboarding@resend.dev>',
            to: [email],
            subject: `Rosevow Order Confirmation: ${orderId}`,
            html: emailHtml
          })
        });

        const customerResData = await customerResponse.json();

        logs.push(`Resend Merchant response: ${JSON.stringify(merchantResData)}`);
        logs.push(`Resend Customer response: ${JSON.stringify(customerResData)}`);
        emailSent = true;
      } catch (err) {
        console.error('Error sending email via Resend:', err);
        logs.push(`Email error: ${err.message}`);
      }
    } else {
      logs.push('Resend not configured (missing RESEND_API_KEY environment variable).');
    }

    // ─── 2. SEND SMS VIA TWILIO ───
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_PHONE_NUMBER;
    const merchantPhone = process.env.MERCHANT_PHONE_NUMBER || '+916239493835'; // Default WhatsApp / mobile number

    if (twilioSid && twilioToken && twilioFrom) {
      try {
        const smsBody = `Rosevow Order Confirmed!\nOrder: ${orderId}\nTotal: ${final_payable_amount}\nEstimated delivery: 5 Days.\nThank you, ${name}!`;

        const authString = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');

        // Helper to send Twilio HTTP Request
        const sendSms = async (toNumber, messageBody) => {
          const params = new URLSearchParams();
          params.append('To', toNumber);
          params.append('From', twilioFrom);
          params.append('Body', messageBody);

          return fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
          });
        };

        // Send to Customer
        const customerSmsRes = await sendSms(phone, smsBody);
        const customerSmsData = await customerSmsRes.json();

        // Send to Merchant
        const merchantSmsRes = await sendSms(merchantPhone, `New order received!\nID: ${orderId}\nCustomer: ${name}\nPhone: ${phone}\nTotal: ${final_payable_amount}`);
        const merchantSmsData = await merchantSmsRes.json();

        logs.push(`Twilio Customer response: ${JSON.stringify(customerSmsData)}`);
        logs.push(`Twilio Merchant response: ${JSON.stringify(merchantSmsData)}`);
        smsSent = true;
      } catch (err) {
        console.error('Error sending SMS via Twilio:', err);
        logs.push(`Twilio error: ${err.message}`);
      }
    } else {
      logs.push('Twilio not configured (missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER).');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: 'true', // returns 'true' to match current front-end check
        message: 'Order processed successfully.',
        emailSent,
        smsSent,
        logs
      }),
    };

  } catch (error) {
    console.error('place-order function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: 'false',
        error: error.message
      }),
    };
  }
};
