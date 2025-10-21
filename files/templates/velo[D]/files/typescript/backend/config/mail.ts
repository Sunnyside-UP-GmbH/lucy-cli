import { MailConfig } from 'backend/lib/config/model';
import { satisfies } from 'effect/Function';

export const mailConfig = satisfies<MailConfig>()({
	dispatchMail: process.env.SEGMENT === 'dev'? 'gradlon@integral-systems.ch' : 'info@integrale-akademie.ch',
	smtpServer: 'smtp.gmail.com',
	smtpPort: 587,
	smtpSecure: false,
	smtpReplyTo: 'info@integrale-akademie.ch',
} as const);