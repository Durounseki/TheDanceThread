import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import * as queries from './queries.js';

export default function createPrismaClient(env) {
	const adapter = new PrismaD1(env.DB);
	const prisma = new PrismaClient({ adapter }).$extends({
		model: {
			event: {
				getEvents: queries.getEvents,
				getEventById: queries.getEventById,
				createEvent: queries.createEvent,
			},
			user: {
				getUser: queries.getUser,
				createUser: queries.createUser,
			},
			style: {
				getStyles: queries.getStyles,
			},
		},
	});
	return prisma;
}
