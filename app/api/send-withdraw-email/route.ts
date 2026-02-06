import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { createWithdrawCode } from '../lib/withdraw-codes'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      amount,
      currencyCode,
      currencySymbol,
      feeAmount,
      receiveAmount,
      bankName,
      accountHolder,
      agency,
      account,
      userEmail,
      userName,
    } = body

    // Basic validation
    if (!amount || !currencyCode || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Generate confirmation code
    const confirmationCode = createWithdrawCode(userEmail, amount, currencyCode)

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Vero Finance <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Confirmation Code - Withdrawal ${currencySymbol}${amount} ${currencyCode}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmation Code</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Vero Finance</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
              <h2 style="color: #333; margin-top: 0;">Confirmation Code</h2>
              
              <p>Hello${userName ? ` ${userName}` : ''},</p>
              
              <p>You requested a withdrawal of <strong>${currencySymbol}${amount.toFixed(2)} ${currencyCode}</strong>.</p>
              
              <p>To confirm the withdrawal, use the confirmation code below:</p>
              
              <div style="background: #667eea; padding: 40px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #5568d3; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                <p style="color: white; font-size: 14px; margin: 0 0 15px 0; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">Your Confirmation Code</p>
                <div style="background: white; padding: 20px; border-radius: 8px; display: inline-block; margin: 10px 0;">
                  <p style="color: #667eea; font-size: 48px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${confirmationCode}</p>
                </div>
                <p style="color: rgba(255,255,255,0.95); font-size: 12px; margin: 20px 0 0 0; font-weight: 500;">This code expires in 10 minutes</p>
              </div>
              
              <p style="color: #d32f2f; font-weight: bold; margin-top: 20px;">
                ⚠️ Do not share this code with anyone. The Vero Finance team will never request this code.
              </p>
              
              <p style="margin-top: 30px;">Transaction details:</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">Transaction Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Withdrawal Amount:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${currencySymbol}${amount.toFixed(2)} ${currencyCode}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Offramp Fee:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${currencySymbol}${feeAmount.toFixed(2)}
                    </td>
                  </tr>
                  <tr style="border-top: 2px solid #e0e0e0;">
                    <td style="padding: 12px 0; color: #333; font-weight: bold;">Amount Received:</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 1.1em; color: #667eea;">
                      ${currencySymbol}${receiveAmount.toFixed(2)} ${currencyCode}
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #764ba2;">
                <h3 style="margin-top: 0; color: #764ba2;">Transfer Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Bank:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${bankName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Account Holder:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${accountHolder}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Agency:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${agency}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Account:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${account}
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
                Enter this code on the confirmation page to finalize the withdrawal.
              </p>
              
              <p style="margin-top: 30px; color: #d32f2f;">
                If you did not request this withdrawal, please ignore this email or contact us immediately.
              </p>
              
              <p style="margin-top: 20px;">
                Best regards,<br>
                <strong>Vero Finance Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 0.8em;">
              <p>This is an automated email, please do not reply.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        messageId: data?.id,
        // Do not return the code for security - only send confirmation
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 },
    )
  }
}
