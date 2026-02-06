import { NextResponse } from 'next/server'
import { Resend } from 'resend'

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
      networkName,
      networkSymbol,
      walletAddress,
      gasFee,
      userEmail,
      userName,
    } = body

    // Basic validation
    if (!walletAddress || !networkName || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Send confirmation email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Vero Finance <onboarding@resend.dev>',
      to: [userEmail],
      subject: `Cryptocurrency Withdrawal Confirmed${amount ? ` - ${currencySymbol || ''}${amount} ${currencyCode || 'USDC'}` : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cryptocurrency Withdrawal Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">Vero Finance</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0;">
              <h2 style="color: #333; margin-top: 0;">Cryptocurrency Withdrawal Confirmed</h2>
              
              <p>Hello${userName ? ` ${userName}` : ''},</p>
              
              <p>Your cryptocurrency withdrawal has been successfully confirmed! Below are the transaction details:</p>
              
              ${
                amount
                  ? `
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">Transaction Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Withdrawal Amount:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${currencySymbol || ''}${amount.toFixed(2)} ${currencyCode || 'USDC'}
                    </td>
                  </tr>
                  ${
                    feeAmount
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Offramp Fee:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${currencySymbol || ''}${feeAmount.toFixed(2)}
                    </td>
                  </tr>
                  `
                      : ''
                  }
                  ${
                    receiveAmount
                      ? `
                  <tr style="border-top: 2px solid #e0e0e0;">
                    <td style="padding: 12px 0; color: #333; font-weight: bold;">Amount Received:</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 1.1em; color: #667eea;">
                      ${currencySymbol || ''}${receiveAmount.toFixed(2)} ${currencyCode || 'USDC'}
                    </td>
                  </tr>
                  `
                      : ''
                  }
                </table>
              </div>
              `
                  : ''
              }
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #764ba2;">
                <h3 style="margin-top: 0; color: #764ba2;">Withdrawal Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Network:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ${networkName}
                    </td>
                  </tr>
                  ${
                    gasFee
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Gas Fee (estimated):</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333;">
                      ~${gasFee} ${networkSymbol || ''}
                    </td>
                  </tr>
                  `
                      : ''
                  }
                  <tr>
                    <td style="padding: 8px 0; color: #666;">Destination Address:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #333; word-break: break-all; font-family: monospace; font-size: 0.9em;">
                      ${walletAddress}
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #666; font-size: 0.9em;">
                Your cryptocurrency will be sent to the provided wallet address. Transaction processing time may vary depending on network congestion.
              </p>
              
              <p style="margin-top: 30px;">
                If you did not request this withdrawal, please contact us immediately.
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
      { success: true, messageId: data?.id },
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
