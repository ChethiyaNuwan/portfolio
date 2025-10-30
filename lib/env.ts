// Centralized environment variable validation
// const getEnv = (key: string): string => {
//   const value = process.env[key];
//   if (!value) {
//     throw new Error(`Missing environment variable: ${key}`);
//   }
//   return value;
// };

export const env = {
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL || "",
};

export const getRequiredEnv = (key: keyof typeof env): string => {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};
