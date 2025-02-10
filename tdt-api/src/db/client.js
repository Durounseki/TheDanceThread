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
				updateEvent: queries.updateEvent,
				deleteEvent: queries.deleteEvent,
				addLike: queries.addLike,
				removeLike: queries.removeLike,
				addSave: queries.addSave,
				removeSave: queries.removeSave,
				addAttendee: queries.addAttendee,
				removeAttendee: queries.removeAttendee,
				getCreatorId: queries.getCreatorId,
			},
			user: {
				getUser: queries.getUser,
				createUser: queries.createUser,
			},
			style: {
				getStyles: queries.getStyles,
			},
			eventAttendance: {
				attendEvent: queries.attendEvent,
				unattendEvent: queries.unattendEvent,
			},
			eventLike: {
				likeEvent: queries.likeEvent,
				unlikeEvent: queries.unlikeEvent,
			},
			eventSave: {
				saveEvent: queries.saveEvent,
				unsaveEvent: queries.unsaveEvent,
			},
			flyer: {
				getFlyerKey: queries.getFlyerKey,
			},
		},
	});
	return prisma;
}
