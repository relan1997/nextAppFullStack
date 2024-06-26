import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerifictaionEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string // tumhara otp
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "my-app | Verification code",
      react: VerificationEmail({ username: username, otp: verifyCode }), // the react component jisme tumhara template stored hai
    });
    return { success: true, message: "Verification Email sent Successfully" };
  } catch (emailError) {
    console.error("error in sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
