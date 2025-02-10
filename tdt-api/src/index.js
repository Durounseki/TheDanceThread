import { OAuth2Client } from 'google-auth-library';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { SignJWT, jwtVerify } from 'jose';
import { v4 } from 'uuid';
import { Hono } from 'hono';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import createPrismaClient from './db/client.js';
import { cors } from 'hono/cors';
import { createUserAvatar } from './utils.js';
// import { createUserAvatar } from './utils.js';

const app = new Hono();

app.use('*', async (c, next) => {
	const S3 = new S3Client({
		region: 'auto',
		endpoint: c.env.S3_ENDPOINT,
		credentials: {
			accessKeyId: c.env.S3_ACCESS_KEY,
			secretAccessKey: c.env.S3_SECRET_KEY,
		},
	});
	c.set('s3', S3);
	c.set('prisma', createPrismaClient(c.env));
	await next();
});

app.use('*', async (c, next) => {
	const GOOGLE_CLIENT_ID = c.env.AUTH_GOOGLE_ID;
	const GOOGLE_CLIENT_SECRET = c.env.AUTH_GOOGLE_SECRET;
	const AUTH_CALLBACK_URL = c.env.AUTH_CALLBACK_URL;
	const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_CALLBACK_URL);
	c.set('google', oauth2Client);
	const secretKey = new TextEncoder().encode(c.env.JWT_SECRET);
	c.set('jwtSecret', secretKey);
	await next();
});

app.use(
	'/api/*',
	cors({
		origin: (origin, c) => c.env.APP_URL || 'http://localhost:8787',
		allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
		credentials: true,
	})
);

app.get('/api/events', async (c) => {
	const country = c.req.query('country');
	const style = c.req.query('style');
	const date = c.req.query('date');
	try {
		const prisma = c.get('prisma');
		const events = await prisma.event.getEvents(country, style, date);
		return c.json(events);
	} catch (error) {
		console.error('Error fetching events:', error);
		return c.json({ error: 'Failed to fetch events' }, 500);
	}
});

app.post('/api/events', authenticate, async (c) => {
	const eventInfo = await c.req.parseBody();
	const file = eventInfo.flyer;
	try {
		let key;
		const prisma = c.get('prisma');
		if (file) {
			key = `${Date.now()}-${file.name}`;
			await c.env.TDT_BUCKET.put(key, file.stream());
		}
		const event = await prisma.event.createEvent(eventInfo, key);
		return c.json(event, 201);
	} catch (error) {
		console.error('Error creating event:', error);
		return c.json({ error: 'Failed to create event' }, 500);
	}
});

app.get('/api/events/:id', async (c) => {
	const id = c.req.param('id');
	try {
		const prisma = c.get('prisma');
		const event = await prisma.event.getEventById(id);
		if (!event) {
			return c.json({ error: 'Event not found' }, 404);
		}
		const s3 = c.get('s3');

		const command = new GetObjectCommand({
			Bucket: c.env.S3_BUCKET,
			Key: event.flyer.src,
		});

		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

		event.flyer.src = url;

		// if (event.creatorId) {
		// 	const avatar = createUserAvatar(event.creatorId);
		// 	event.createdBy.avatar = avatar;
		// }

		return c.json(event);
	} catch (error) {
		console.error('Error fetching event:', error);
		return c.json({ error: 'Failed to fetch event' }, 500);
	}
});

app.patch('/api/events/:id', authenticate, async (c) => {
	const userId = c.get('userId');
	const eventId = c.req.param('id');
	const eventInfo = await c.req.parseBody();
	const file = eventInfo.flyer;
	try {
		const prisma = c.get('prisma');
		const creatorId = await prisma.event.getCreatorId(eventId);
		if (userId !== creatorId.creatorId) {
			return c.json({ message: 'Unauthorized!' }, 401);
		} else {
			let key;
			if (file) {
				const oldKey = await prisma.flyer.getFlyerKey(eventId);
				if (oldKey && oldKey.src !== 'the-dance-thread-logo-dark-2.png') {
					await c.env.TDT_BUCKET.delete(oldKey.src);
				}
				key = `${Date.now()}-${file.name}`;
				await c.env.TDT_BUCKET.put(key, file.stream());
			}
			const event = await prisma.event.updateEvent(eventId, eventInfo, key);
			return c.json(event);
		}
	} catch (error) {
		console.error('Error updating event:', error);
		return c.json({ error: 'Failed to update event' }, 500);
	}
});

app.delete('api/events/:id', authenticate, async (c) => {
	const userId = c.get('userId');
	const eventId = c.req.param('id');
	try {
		const prisma = c.get('prisma');
		const creatorId = await prisma.event.getCreatorId(eventId);
		console.log(creatorId, userId);
		if (userId !== creatorId.creatorId) {
			return c.json({ message: 'Unauthorized!' }, 401);
		} else {
			const key = await prisma.flyer.getFlyerKey(eventId);
			const deleted = await prisma.event.deleteEvent(eventId);
			if (key && key !== 'the-dance-thread-logo-dark-2.png') {
				await c.env.TDT_BUCKET.delete(key.src);
			}
			return c.json({ message: 'Event and flyer deleted' }, 200);
		}
	} catch (error) {
		console.error('Error deleting event', error);
		return c.json({ error: 'Failed to delete event' }, 500);
	}
});

app.post('api/events/:id/likes', authenticate, async (c) => {
	const eventId = c.req.param('id');
	const userId = c.get('userId');
	try {
		const prisma = c.get('prisma');
		await prisma.eventLike.likeEvent(eventId, userId);
		await prisma.event.addLike(eventId);
		return c.json({ message: 'Event updated' }, 200);
	} catch (error) {
		console.error('Error updating likes', error);
		return c.json({ error: 'Failed to update event likes' }, 500);
	}
});
app.delete('api/events/:id/likes', authenticate, async (c) => {
	const eventId = c.req.param('id');
	const userId = c.get('userId');
	try {
		const prisma = c.get('prisma');
		await prisma.eventLike.unlikeEvent(eventId, userId);
		await prisma.event.removeLike(eventId);
		return c.json({ message: 'Event updated' }, 200);
	} catch (error) {
		console.error('Error updating likes', error);
		return c.json({ error: 'Failed to update event likes' }, 500);
	}
});
app.post('api/events/:id/saves', authenticate, async (c) => {
	const eventId = c.req.param('id');
	const userId = c.get('userId');
	try {
		const prisma = c.get('prisma');
		await prisma.eventSave.saveEvent(eventId, userId);
		await prisma.event.addSave(eventId);
		return c.json({ message: 'Event updated' }, 200);
	} catch (error) {
		console.error('Error updating saves', error);
		return c.json({ error: 'Failed to update event saves' }, 500);
	}
});
app.delete('api/events/:id/saves', authenticate, async (c) => {
	const eventId = c.req.param('id');
	const userId = c.get('userId');
	try {
		const prisma = c.get('prisma');
		await prisma.eventSave.unsaveEvent(eventId, userId);
		await prisma.event.removeSave(eventId);
		return c.json({ message: 'Event updated' }, 200);
	} catch (error) {
		console.error('Error updating saves', error);
		return c.json({ error: 'Failed to update event saves' }, 500);
	}
});
app.post('api/events/:id/attendees', authenticate, async (c) => {
	const eventId = c.req.param('id');
	const userId = c.get('userId');
	try {
		const prisma = c.get('prisma');
		await prisma.eventAttendance.attendEvent(eventId, userId);
		await prisma.event.addAttendee(eventId);
		return c.json({ message: 'Event updated' }, 200);
	} catch (error) {
		console.error('Error updating attendees', error);
		return c.json({ error: 'Failed to update event attendees' }, 500);
	}
});

app.delete('api/events/:id/attendees', authenticate, async (c) => {
	const eventId = c.req.param('id');
	const userId = c.get('userId');
	try {
		const prisma = c.get('prisma');
		await prisma.eventAttendance.unattendEvent(eventId, userId);
		await prisma.event.removeAttendee(eventId);
		return c.json({ message: 'Event updated' }, 200);
	} catch (error) {
		console.error('Error updating attendees', error);
		return c.json({ error: 'Failed to update event attendees' }, 500);
	}
});

app.get('api/styles', async (c) => {
	try {
		const prisma = c.get('prisma');
		const styles = await prisma.style.getStyles();
		return c.json(styles);
	} catch (error) {
		console.error('Error fetching dance styles:', error);
		return c.json({ error: 'Failed to fetch dance styles' }, 500);
	}
});

app.get('api/auth/login', (c) => {
	const google = c.get('google');
	const authorizeUrl = google.generateAuthUrl({
		access_type: 'offline',
		scope: ['profile', 'email'],
	});
	return c.redirect(authorizeUrl);
});

app.get('api/auth/callback', async (c) => {
	const code = c.req.query('code');
	const google = c.get('google');
	const jwtSecret = c.get('jwtSecret');
	const prisma = c.get('prisma');
	try {
		const { tokens } = await google.getToken(code);
		google.setCredentials(tokens);

		const url = 'https://www.googleapis.com/oauth2/v1/userinfo';
		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`,
			},
		});
		const user = await res.json();
		const storedUser = await prisma.user.getUserById(user.id);
		let userId;
		if (!storedUser) {
			userId = await prisma.user.createUser(user);
		} else {
			userId = storedUser.id;
		}
		const token = await new SignJWT({
			userId,
		})
			.setProtectedHeader({ alg: 'HS256' })
			.setJti(v4())
			.setIssuedAt()
			.setExpirationTime('2h')
			.sign(jwtSecret);

		setCookie(c, 'jwt', token, {
			httpOnly: true,
			maxAge: 60 * 60 * 2,
			sameSite: 'Strict',
			path: '/',
			secure: c.env.ENV === 'production',
		});
		return c.redirect(`${c.env.APP_URL}/profile`);
	} catch (error) {
		console.error(error);
		return c.text('Login failed.', 500);
	}
});

async function authenticate(c, next) {
	const token = getCookie(c, 'jwt');
	const jwtSecret = c.get('jwtSecret');
	if (!token) {
		return c.json({ message: 'Unauthorized' }, 401);
	}
	try {
		const payload = await jwtVerify(token, jwtSecret);
		c.set('userId', payload.payload.userId);
	} catch (error) {
		console.error(error);
		return c.json({ message: 'Authentication error', error: error }, 401);
	}
	await next();
}

app.get('api/auth/protected', authenticate, async (c) => {
	const userId = c.get('userId');
	const prisma = c.get('prisma');
	const user = await prisma.user.getUserById(userId);
	// const avatar = createUserAvatar(user.id);
	// user.avatar = avatar;
	return c.json(user);
});

app.get('api/auth/logout', async (c) => {
	deleteCookie(c, 'jwt');
	return c.json({ message: 'Logged out successfully!' }, 200);
});

app.get('api/users', async (c) => {
	const name = c.req.query('name');
	const country = c.req.query('country');
	const style = c.req.query('style');
	try {
		const prisma = c.get('prisma');
		const users = await prisma.user.getUsers(name, country, style);
		return c.json(users, 200);
	} catch (error) {
		console.error('Error fetching users:', error);
		return c.json({ error: 'Failed to fetch users' }, 500);
	}
});

app.get('api/users/:id', async (c) => {
	const userId = c.req.param('id');
	try {
		const prisma = c.get('prisma');
		const user = await prisma.user.getUserById(userId);
		return c.json(user, 200);
	} catch (error) {
		console.error('Error fetching user:', error);
		return c.json({ error: 'Failed to fetch user' }, 500);
	}
});

app.patch('api/users/:id', authenticate, async (c) => {
	const userInfo = await c.req.parseBody();
	const userId = c.get('userId');
	try {
		const prisma = c.get('prisma');
		const user = await prisma.user.updateUser(userId, userInfo);
		return c.json(user);
	} catch (error) {
		console.error('Error updating user:', error);
		return c.json({ error: 'Failed to update user' }, 500);
	}
});

app.delete('api/users/:id', authenticate, async (c) => {
	const userId = c.req.param('id');
	try {
		const prisma = c.get('prisma');
		await prisma.event.deleteEvent(userId);
		return c.json({ message: 'User deleted' }, 200);
	} catch (error) {
		console.error('Error deleting user', error);
		return c.json({ error: 'Failed to delete user' }, 500);
	}
});

app.get('/temp/users/avatars', async (c) => {
	const prisma = c.get('prisma');
	const userIds = await prisma.user.findMany({
		select: { id: true },
	});
	const avatars = userIds.map((user) => createUserAvatar(user.id));
	try {
		const result = await Promise.all(
			avatars.map(async (avatar, index) => {
				await prisma.user.update({
					where: { id: userIds[index].id },
					data: {
						avatar: avatar,
						createdAt: new Date(),
					},
				});
			})
		);
		console.log(result);
	} catch (error) {
		c.json({ error: "Error updating users' avatar" }, 500);
	}
	return c.json(avatars, 200);
});

export default app;
