import { snsFaClass } from '../utils.js';

export async function getEvents() {
	try {
		const events = this.findMany({
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
	if (Array.isArray(eventInfo['sns-name[]'])) {
		snsPlatforms = eventInfo['sns-name[]'];
		snsUrls = eventInfo['sns-url[]'];
	} else {
		snsPlatforms = [eventInfo['sns-name[]']];
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
			},
		});
		return event;
	} catch (error) {
		console.error('Error finding event', error);
		throw new Error('Failed to fetch event');
	}
}
