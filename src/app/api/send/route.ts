import { Resend } from 'resend';
import SportsAndFitnessResetPasswordEmail from '../../../../emails/resetPassword';
import { NextRequest } from 'next/server';
import { render } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, userFirstname, resetPasswordLink } = await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Sports and Fitness Center <noreply@resend.dev>',
      to: [email],
      subject: 'Reset Password',
      html: await render(SportsAndFitnessResetPasswordEmail({ userFirstname: userFirstname, resetPasswordLink: resetPasswordLink }))
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({data, message: 'Email sent successfully'});
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
