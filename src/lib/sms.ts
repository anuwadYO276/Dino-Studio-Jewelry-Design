interface SendOtpSmsParams {
  to: string;
  otp: string;
}

export async function sendOtpSms({ to, otp }: SendOtpSmsParams) {
  // Mock mode for development
  if (process.env.SMS_MOCK === "true") {
    console.log(`[SMS MOCK] Sending OTP ${otp} to ${to}`);
    return;
  }

  const response = await fetch(process.env.SMS_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.SMS_AUTH!,
    },
    body: JSON.stringify({
      sender: process.env.SMS_SENDER || "VL",
      system: process.env.SMS_SYSTEM || "dino_studio",
      type: process.env.SMS_TYPE || "OTP",
      phone: to,
      message: `Your Dino Studio verification code is: ${otp}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`SMS send failed: ${response.statusText}`);
  }
}
