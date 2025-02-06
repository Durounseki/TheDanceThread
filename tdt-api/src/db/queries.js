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

export async function createEvent(eventInfo, key) {
	let snsPlatforms;
	let snsUrls;
	if (Array.isArray(eventInfo['sns-platform[]'])) {
		snsPlatforms = eventInfo['sns-platform[]'];
		snsUrls = eventInfo['sns-url[]'];
	} else {
		snsPlatforms = [eventInfo['sns-platform[]']];
		snsUrls = [eventInfo['sns-url[]']];
	}
	let eventSns = [];
	snsPlatforms.forEach((platform, index) => {
		eventSns.push({
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

	try {
		const event = await this.create({
			data: {
				name: eventInfo['name'],
				date: new Date(eventInfo['date']),
				country: eventInfo['country'],
				city: eventInfo['city'],
				description: eventInfo['description'],
				venues: {
					connectOrCreate: venues.map((venue) => ({
						where: {
							name_url: {
								name: venue.name,
								url: venue.url,
							},
						},
						create: {
							name: venue.name,
							url: venue.url,
						},
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
					create: eventSns.map((sns) => ({
						name: sns.name,
						url: sns.url,
						faClass: sns.faClass,
					})),
				},
				flyer: {
					create: {
						alt: eventInfo['name'],
						src: key,
					},
				},
				createdBy: {
					connect: { id: eventInfo['creatorId'] },
				},
			},
		});
		return event;
	} catch (error) {
		console.error('Error creating event:', error);
		throw new Error('Failed to create event');
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
								email: true,
								country: true,
								sns: {
									select: {
										id: true,
										name: true,
										url: true,
										faClass: true,
									},
								},
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
