import { snsFaClass } from '../utils.js';

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
			},
		});
		return events;
	} catch (error) {
		console.error('Error finding events:', error);
		throw new Error('Failed to find events');
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
	console.log(JSON.stringify(eventInfo, null, 4));
	const data = prepareEventData(eventInfo);
	console.log(data);
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

export async function updateEvent(eventInfo, key) {
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
			where: { id: eventInfo.id },
			data: data,
		});
		return event;
	} catch (error) {
		console.error('Error updating event:', error);
		throw new Error('Failed to update event');
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
				},
				sns: {
					select: {
						id: true,
						name: true,
						url: true,
						faClass: true,
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
					select: {
						id: true,
						name: true,
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
		const styles = await this.findMany();
		return styles;
	} catch (error) {
		console.error('Error finding styles', error);
		throw new Error('Failed to fetch styles');
	}
}

export async function getUser(userId) {
	try {
		const user = await this.findUnique({
			where: { id: userId },
			include: {
				sns: true,
				eventsCreated: true,
				eventsAttending: true,
			},
		});
		return user;
	} catch (error) {
		console.error('Error retrieving user', error);
		throw new Error('Failed to fetch user');
	}
}

export async function createUser(user) {
	try {
		const newUser = await this.create({
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
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
