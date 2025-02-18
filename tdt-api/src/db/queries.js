import { snsFaClass } from '../utils.js';
import { createUserAvatar } from '../utils.js';

export async function getEvents(country, style, date) {
	let dateObj;
	let newDateObj;
	if (date) {
		dateObj = new Date(date);
		newDateObj = new Date(date);

		newDateObj.setMonth(newDateObj.getMonth() + 1);
	}
	try {
		const events = this.findMany({
			where: {
				country: country
					? {
							equals: country,
					  }
					: undefined,
				date: date
					? {
							gte: dateObj,
							lt: newDateObj,
					  }
					: undefined,
				styles: style
					? {
							some: {
								name: {
									equals: style,
								},
							},
					  }
					: undefined,
			},
			orderBy: { date: 'asc' },
			select: {
				id: true,
				name: true,
				date: true,
				country: true,
				sns: {
					orderBy: { name: 'asc' },
				},
				flyer: true,
				venues: true,
			},
		});
		return events;
	} catch (error) {
		console.error('Error finding events:', error);
		throw new Error('Failed to find events');
	}
}

export async function getEventById(eventId) {
	try {
		const event = await this.findUnique({
			where: { id: eventId },
			include: {
				venues: {
					select: {
						name: true,
						url: true,
					},
				},
				styles: {
					select: {
						id: true,
						name: true,
					},
					orderBy: {
						name: 'asc',
					},
				},
				sns: {
					select: {
						id: true,
						name: true,
						url: true,
						faClass: true,
					},
					orderBy: {
						name: 'asc',
					},
				},
				flyer: {
					select: {
						alt: true,
						src: true,
					},
				},
				attendees: {
					select: {
						type: true,
						user: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				likes: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				saves: {
					select: {
						user: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				createdBy: {
					include: {
						profilePic: true,
					},
				},
			},
		});
		return event;
	} catch (error) {
		console.error('Error finding event', error);
		throw new Error('Failed to fetch event');
	}
}

function prepareEventData(eventInfo) {
	let snsPlatforms;
	let snsUrls;
	let snsIds;
	if (Array.isArray(eventInfo['sns-platform[]'])) {
		snsPlatforms = eventInfo['sns-platform[]'];
		snsUrls = eventInfo['sns-url[]'];
		if (eventInfo['sns-id[]']) {
			snsIds = eventInfo['sns-id[]'];
		}
	} else {
		snsPlatforms = [eventInfo['sns-platform[]']];
		snsUrls = [eventInfo['sns-url[]']];
		if (eventInfo['sns-id[]']) {
			snsIds = [eventInfo['sns-id[]']];
		}
	}
	let eventSns = [];
	snsPlatforms.forEach((platform, index) => {
		eventSns.push({
			id: eventInfo['sns-id[]'] ? snsIds[index] : '',
			name: platform,
			url: snsUrls[index],
			faClass: snsFaClass[platform],
		});
	});
	let venueNames;
	let venueUrls;
	if (Array.isArray(eventInfo['venue-name[]'])) {
		venueNames = eventInfo['venue-name[]'];
		venueUrls = eventInfo['venue-url[]'];
	} else {
		venueNames = [eventInfo['venue-name[]']];
		venueUrls = [eventInfo['venue-url[]']];
	}
	let venues = [];
	venueNames.forEach((name, index) => {
		venues.push({
			name: name,
			url: venueUrls[index],
		});
	});
	let styles;
	if (Array.isArray(eventInfo['style[]'])) {
		styles = eventInfo['style[]'];
	} else {
		styles = [eventInfo['style[]']];
	}
	const data = {
		name: eventInfo['name'],
		date: new Date(eventInfo['date']),
		country: eventInfo['country'],
		city: eventInfo['city'],
		description: eventInfo['description'],
		venues: {
			connectOrCreate: venues.map((venue) => ({
				where: {
					name_url: venue,
				},
				create: venue,
			})),
		},
		styles: {
			connectOrCreate: styles.map((style) => ({
				where: {
					name: style,
				},
				create: {
					name: style,
				},
			})),
		},
		sns: {
			connectOrCreate: eventSns.map((sns) => ({
				where: { id: sns.id },
				create: { name: sns.name, url: sns.url, faClass: sns.faClass },
			})),
		},
		createdBy: {
			connect: { id: eventInfo['creatorId'] },
		},
	};
	return data;
}

export async function createEvent(eventInfo, key) {
	const data = prepareEventData(eventInfo);
	try {
		const event = await this.create({
			data: {
				...data,
				flyer: key
					? {
							create: {
								alt: eventInfo['name'],
								src: key,
							},
					  }
					: {
							create: {
								alt: eventInfo['name'],
								src: 'the-dance-thread-logo-dark-2.png',
							},
					  },
			},
		});
		return event;
	} catch (error) {
		console.error('Error creating event:', error);
		throw new Error('Failed to create event');
	}
}

export async function updateEvent(eventId, eventInfo, key) {
	const data = prepareEventData(eventInfo);
	if (key) {
		data.flyer = {
			upsert: {
				update: {
					alt: eventInfo['name'],
					src: key,
				},
				create: {
					alt: eventInfo['name'],
					src: key,
				},
			},
		};
	}
	try {
		const event = await this.update({
			where: { id: eventId },
			data: data,
		});
		return event;
	} catch (error) {
		console.error('Error updating event:', error);
		throw new Error('Failed to update event');
	}
}

export async function deleteEvent(eventId) {
	try {
		await this.delete({
			where: { id: eventId },
		});
		return true;
	} catch (error) {
		console.error('Error deleting event:', error);
		throw new Error('Failed to delete event');
	}
}

export async function getCreatorId(eventId) {
	try {
		const creatorId = await this.findUnique({
			where: { id: eventId },
			select: { creatorId: true },
		});
		return creatorId;
	} catch (error) {
		console.error('Error finding creatorId', error);
		throw new Error('Failed to fetch creatorId');
	}
}

export async function likeEvent(eventId, userId) {
	try {
		const like = await this.findUnique({
			where: {
				userId_eventId: { userId, eventId },
			},
		});
		if (!like) {
			await this.create({
				data: {
					user: { connect: { id: userId } },
					event: { connect: { id: eventId } },
				},
			});
		}
		return true;
	} catch (error) {
		console.error('Error updating event likes', error);
		throw new Error('Failed to update event likes');
	}
}

export async function addLike(eventId) {
	try {
		await this.update({
			where: { id: eventId },
			data: { totalLikes: { increment: 1 } },
		});
		return true;
	} catch (error) {
		console.error('Error updating event total likes', error);
		throw new Error('Failed to update event total likes');
	}
}

export async function unlikeEvent(eventId, userId) {
	try {
		const like = await this.delete({
			where: {
				userId_eventId: { userId, eventId },
			},
		});
		return true;
	} catch (error) {
		console.error('Error updating event likes', error);
		throw new Error('Failed to update event likes');
	}
}

export async function removeLike(eventId) {
	try {
		await this.update({
			where: { id: eventId },
			data: { totalLikes: { decrement: 1 } },
		});
		return true;
	} catch (error) {
		console.error('Error updating event total likes', error);
		throw new Error('Failed to update event total likes');
	}
}

export async function saveEvent(eventId, userId) {
	try {
		const saved = await this.findUnique({
			where: {
				userId_eventId: { userId, eventId },
			},
		});
		if (!saved) {
			await this.create({
				data: {
					user: { connect: { id: userId } },
					event: { connect: { id: eventId } },
				},
			});
		}
		return true;
	} catch (error) {
		console.error('Error updating event saves', error);
		throw new Error('Failed to update event saves');
	}
}

export async function addSave(eventId) {
	try {
		await this.update({
			where: { id: eventId },
			data: { totalSaves: { increment: 1 } },
		});
		return true;
	} catch (error) {
		console.error('Error updating event total likes', error);
		throw new Error('Failed to update event total likes');
	}
}

export async function unsaveEvent(eventId, userId) {
	try {
		const like = await this.delete({
			where: {
				userId_eventId: { userId, eventId },
			},
		});
		return true;
	} catch (error) {
		console.error('Error updating event saves', error);
		throw new Error('Failed to update event saves');
	}
}

export async function removeSave(eventId) {
	try {
		await this.update({
			where: { id: eventId },
			data: { totalSaves: { decrement: 1 } },
		});
		return true;
	} catch (error) {
		console.error('Error updating event total likes', error);
		throw new Error('Failed to update event total likes');
	}
}

export async function attendEvent(eventId, userId) {
	try {
		const attendance = await this.findUnique({
			where: {
				userId_eventId_type: { userId, eventId, type: 'GOING' },
			},
		});
		if (!attendance) {
			await this.create({
				data: {
					user: { connect: { id: userId } },
					event: { connect: { id: eventId } },
				},
			});
		}
		return true;
	} catch (error) {
		console.error('Error updating event attendees', error);
		throw new Error('Failed to update event attendees');
	}
}

export async function addAttendee(eventId) {
	try {
		await this.update({
			where: { id: eventId },
			data: { totalAttendees: { increment: 1 } },
		});
		return true;
	} catch (error) {
		console.error('Error updating event total attendees', error);
		throw new Error('Failed to update event total attendees');
	}
}

export async function unattendEvent(eventId, userId) {
	try {
		const like = await this.delete({
			where: {
				userId_eventId_type: { userId, eventId, type: 'GOING' },
			},
		});
		return true;
	} catch (error) {
		console.error('Error updating event attendees', error);
		throw new Error('Failed to update event attendees');
	}
}

export async function removeAttendee(eventId) {
	try {
		await this.update({
			where: { id: eventId },
			data: { totalAttendees: { decrement: 1 } },
		});
		return true;
	} catch (error) {
		console.error('Error updating event total attendees', error);
		throw new Error('Failed to update event total attendees');
	}
}

export async function getStyles() {
	try {
		const styles = await this.findMany({ orderBy: { name: 'asc' } });
		return styles;
	} catch (error) {
		console.error('Error finding styles', error);
		throw new Error('Failed to fetch styles');
	}
}

export async function getFlyerKey(eventId) {
	try {
		const key = await this.findUnique({
			where: {
				eventId: eventId,
			},
			select: { src: true },
		});
		return key;
	} catch (error) {
		console.error('Error finding flyer key', error);
		throw new Error('Failed to find flyer key');
	}
}

export async function createUser(user) {
	try {
		const newUser = await this.create({
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				avatar: createUserAvatar(user.id),
				createdAt: new Date(),
			},
			select: {
				id: true,
			},
		});
		return newUser.id;
	} catch (error) {
		console.error('Error creating user', error);
		throw new Error('Failed to create user');
	}
}

export async function getUsers(name, country, style) {
	try {
		const users = this.findMany({
			where: {
				name: name
					? {
							contains: name,
					  }
					: undefined,
				country: country
					? {
							equals: country,
					  }
					: undefined,
				styles: style
					? {
							some: {
								name: {
									equals: style,
								},
							},
					  }
					: undefined,
			},
			orderBy: { name: 'asc' },
			select: {
				id: true,
				name: true,
				avatar: true,
				profilePic: true,
				styles: { orderBy: { name: 'asc' } },
			},
		});
		return users;
	} catch (error) {
		console.error('Error finding users:', error);
		throw new Error('Failed to find users');
	}
}

export async function getUserById(userId) {
	try {
		const user = await this.findUnique({
			where: { id: userId },
			include: {
				styles: {
					orderBy: { name: 'asc' },
				},
				sns: {
					orderBy: { name: 'asc' },
				},
				eventsCreated: true,
				eventsAttending: true,
				likedEvents: true,
				savedEvents: true,
				profilePic: true,
			},
		});
		return user;
	} catch (error) {
		console.error('Error retrieving user', error);
		throw new Error('Failed to fetch user');
	}
}

function prepareUserData(userInfo) {
	let snsPlatforms;
	let snsUrls;
	let snsIds;
	if (Array.isArray(userInfo['sns-platform[]'])) {
		snsPlatforms = userInfo['sns-platform[]'];
		snsUrls = userInfo['sns-url[]'];
		if (userInfo['sns-id[]']) {
			snsIds = userInfo['sns-id[]'];
		}
	} else {
		snsPlatforms = [userInfo['sns-platform[]']];
		snsUrls = [userInfo['sns-url[]']];
		if (userInfo['sns-id[]']) {
			snsIds = [userInfo['sns-id[]']];
		}
	}
	let userSns = [];
	snsPlatforms.forEach((platform, index) => {
		userSns.push({
			id: userInfo['sns-id[]'] ? snsIds[index] : '',
			name: platform,
			url: snsUrls[index],
			faClass: snsFaClass[platform],
		});
	});
	let styles;
	if (Array.isArray(userInfo['style[]'])) {
		styles = userInfo['style[]'];
	} else {
		styles = [userInfo['style[]']];
	}
	const data = {
		name: userInfo['name'],
		email: userInfo['email'],
		country: userInfo['country'],
		bio: userInfo['bio'],
		styles: styles[0]
			? {
					set: [],
					connectOrCreate: styles.map((style) => ({
						where: {
							name: style,
						},
						create: {
							name: style,
						},
					})),
			  }
			: {
					set: [],
			  },
		sns: userSns[0]
			? {
					deleteMany: {},
					connectOrCreate: userSns.map((sns) => ({
						where: { id: sns.id },
						create: { name: sns.name, url: sns.url, faClass: sns.faClass },
					})),
			  }
			: { deleteMany: {} },
	};
	return data;
}

export async function updateUserInfo(userId, userInfo) {
	const data = prepareUserData(userInfo);
	try {
		const user = await this.update({
			where: { id: userId },
			data: data,
			include: {
				styles: { orderBy: { name: 'asc' } },
				sns: { orderBy: { name: 'asc' } },
			},
		});
		return user;
	} catch (error) {
		console.error('Error updating user:', error);
		throw new Error('Failed to update user');
	}
}

export async function updateProfilePic(userId, key, alt) {
	try {
		const profilePic = await this.upsert({
			where: { userId: userId },
			update: { src: key },
			create: {
				userId: userId,
				src: key,
				alt: alt,
			},
		});
		return profilePic;
	} catch (error) {
		console.error('Error updating profile pic:', error);
		throw new Error('Failed to update profile pic');
	}
}

export async function deleteProfilePic(userId, key) {
	try {
		await this.delete({
			where: { userId: userId },
		});
		return true;
	} catch (error) {
		console.error('Error deleting profile pic', error);
		throw new Error('Failed to delete profile pic');
	}
}

export async function deleteUser(userId) {
	try {
		await this.delete({
			where: { id: userId },
		});
		return true;
	} catch (error) {
		console.error('Error deleting user:', error);
		throw new Error('Failed to delete user');
	}
}

export async function getProfilePicKey(userId) {
	try {
		const key = await this.findUnique({
			where: {
				userId: userId,
			},
			select: { src: true },
		});
		return key;
	} catch (error) {
		console.error('Error finding profilePic key', error);
		throw new Error('Failed to find profilePic key');
	}
}
