import { SendTemplatedEmailCommand, SESClient } from "@aws-sdk/client-ses";
import { AWS_REGION, Environment, MODE } from "./config/config.js";
import { logger } from "logger";

const client = new SESClient({region: AWS_REGION});

interface ForgotPasswordEmailData {
  email: string;
  name: string;
  action_url: string;
  operating_system: string;
  browser_name: string;
}
export const sendForgetPasswordEmail = async (data: ForgotPasswordEmailData) => {
  const command = await client.send(
    new SendTemplatedEmailCommand({
      Destination: {
        ToAddresses: [data.email],
      },
      Source: `no-reply@${MODE === Environment.production ? '' : `${MODE}.`}teacherfox.com.cy`,
      Template: 'staging-forgot-password-en',
      TemplateData: JSON.stringify(data),
    }),
  ).catch((err) => {
    logger.error(err);
  });
  logger.info(JSON.stringify(command));
}
