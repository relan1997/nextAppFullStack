import { Resend } from 'resend';
// only used for connection to the resend api
export const resend = new Resend(process.env.RESEND_API_KEY);
