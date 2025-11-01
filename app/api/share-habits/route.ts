import { Resend } from "resend"

interface HabitStat {
  name: string
  completed: number
  total: number
  percentage: number
}

export async function POST(request: Request) {
  try {
    const { recipientEmail, stats } = await request.json()

    if (!recipientEmail) {
      return Response.json({ message: "Recipient email is required" }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        {
          message:
            "Email service not configured. To enable sharing: 1) Add RESEND_API_KEY to environment variables, 2) Verify a domain at resend.com/domains, 3) Update the 'from' address below to your verified domain.",
        },
        { status: 500 },
      )
    }

    const habitRows = (stats as HabitStat[])
      .map(
        (habit) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left; color: #111827;">${habit.name}</td>
        <td style="padding: 12px; text-align: center; color: #111827;">${habit.completed}/${habit.total}</td>
        <td style="padding: 12px; text-align: right;">
          <div style="background: #f3f4f6; border-radius: 8px; overflow: hidden; height: 8px;">
            <div style="background: #38a0a8; height: 100%; width: ${habit.percentage}%; transition: width 0.3s;"></div>
          </div>
        </td>
        <td style="padding: 12px; text-align: right; color: #111827; font-weight: 600;">${habit.percentage}%</td>
      </tr>
    `,
      )
      .join("")

    const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #111827; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #38a0a8 0%, #2d7d84 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; text-align: center; }
      .header h1 { margin: 0; font-size: 28px; }
      .header p { margin: 10px 0 0 0; opacity: 0.9; }
      .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
      .card h2 { margin: 0 0 20px 0; font-size: 18px; color: #111827; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
      .footer { text-align: center; color: #6b7280; font-size: 14px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Weekly Habit Check-in</h1>
        <p>Here's how I'm doing with my habits this week!</p>
      </div>

      <div class="card">
        <h2>My Habit Progress</h2>
        <table>
          <thead>
            <tr>
              <th>Habit</th>
              <th style="text-align: center;">Completed</th>
              <th style="text-align: center;">Progress</th>
              <th style="text-align: right;">Success Rate</th>
            </tr>
          </thead>
          <tbody>
            ${habitRows}
          </tbody>
        </table>
      </div>

      <div class="card">
        <p style="margin: 0; line-height: 1.6;">
          I'm tracking my daily habits to build better routines and stay accountable. Feel free to share your own habits with me too!
        </p>
      </div>

      <div class="footer">
        <p>Sent from Habit Tracker • Keep building better habits!</p>
      </div>
    </div>
  </body>
</html>
    `

    const resend = new Resend(process.env.RESEND_API_KEY)

    const info = await resend.emails.send({
      from: "sirishanookala09@gmail.com", // <-- Change this to your verified Resend domain after verification
      to: recipientEmail,
      replyTo: "sirishanookala09@gmail.com",
      subject: "Check out my weekly habit progress!",
      html: emailHtml,
    })

    return Response.json({ success: true, messageId: info.data?.id })
  } catch (error) {
    console.error("[v0] Share habits error:", error)
    return Response.json({ message: error instanceof Error ? error.message : "Failed to send email" }, { status: 500 })
  }
}
