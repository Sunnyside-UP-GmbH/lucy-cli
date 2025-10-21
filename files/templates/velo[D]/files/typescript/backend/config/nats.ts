import { NatsConfig } from 'backend/lib/config/model';
import { satisfies } from 'effect/Function';

export const natsConfig = satisfies<NatsConfig>()({
	natsServers: 'nats.integral-systems.ch:4222',
} as const);