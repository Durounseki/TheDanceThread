import { OAuth2Client } from 'google-auth-library';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { SignJWT, jwtVerify } from 'jose';
import { v4 } from 'uuid';
import { Hono } from 'hono';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import createPrismaClient from './db/client.js';
import { cors } from 'hono/cors';
import { createUserAvatar, generateSignedUrl } from './utils.js';

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
		origin: (origin, c) => {
			const allowedOrigins = c.env.ALLOWED_ORIGINS.split(' ');
			return allowedOrigins.includes(origin) ? origin : c.env.APP_URL;
		},
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
	const honeypot = eventInfo.title;
	if (honeypot && honeypot !== '') {
		console.log('Bot detected!');
		return c.json({ message: 'It seems that you got lost' }, 404);
	}
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
	const honeypot = eventInfo.title;
	if (honeypot && honeypot !== '') {
		console.log('Bot detected!');
		return c.json({ message: 'It seems that you got lost' }, 404);
	}
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
	const data = await c.req.parseBody();
	const honeypot = data.eventname;
	if (honeypot && honeypot !== '') {
		console.log('Bot detected!');
		return c.json({ message: 'It seems that you got lost' }, 404);
	}
	const userId = c.get('userId');
	const eventId = c.req.param('id');
	try {
		const prisma = c.get('prisma');
		const creatorId = await prisma.event.getCreatorId(eventId);
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

async function generateTokens(c, userId) {
	const jwtSecret = c.get('jwtSecret');

	const accessToken = await new SignJWT({
		userId,
	})
		.setProtectedHeader({ alg: 'HS256' })
		.setJti(v4())
		.setIssuedAt()
		.setExpirationTime(c.env.ACCESS_TOKEN_TTL)
		.sign(jwtSecret);
	const refreshToken = crypto.randomUUID();
	await c.env.TDT_KV.put(refreshToken, userId, { expirationTtl: parseInt(c.env.REFRESH_TOKEN_TTL) });

	return {
		accessToken,
		refreshToken,
	};
}

app.get('api/auth/callback', async (c) => {
	const code = c.req.query('code');
	const google = c.get('google');
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
		const { accessToken, refreshToken } = await generateTokens(c, userId);

		setCookie(c, 'jwt', accessToken, {
			httpOnly: true,
			maxAge: parseInt(c.env.REFRESH_TOKEN_TTL),
			sameSite: 'Strict',
			path: '/',
			secure: c.env.ENV === 'production',
		});
		setCookie(c, 'refreshToken', refreshToken, {
			httpOnly: true,
			maxAge: parseInt(c.env.REFRESH_TOKEN_TTL),
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
	const refreshToken = getCookie(c, 'refreshToken');
	const jwtSecret = c.get('jwtSecret');
	if (!token) {
		return c.json({ message: 'Unauthorized' }, 401);
	}
	try {
		const payload = await jwtVerify(token, jwtSecret);

		c.set('userId', payload.payload.userId);
	} catch (error) {
		if (error.code === 'ERR_JWT_EXPIRED' && refreshToken) {
			const userId = await c.env.TDT_KV.get(refreshToken, 'text');
			if (!userId) {
				return c.json({ message: 'Unauthorized' }, 401);
			} else {
				const deleted = await c.env.TDT_KV.delete(refreshToken);

				const { accessToken, refreshToken: newRefreshToken } = await generateTokens(c, userId);
				setCookie(c, 'jwt', accessToken, {
					httpOnly: true,
					maxAge: parseInt(c.env.REFRESH_TOKEN_TTL),
					sameSite: 'Strict',
					path: '/',
					secure: c.env.ENV === 'production',
				});
				setCookie(c, 'refreshToken', newRefreshToken, {
					httpOnly: true,
					maxAge: parseInt(c.env.REFRESH_TOKEN_TTL),
					sameSite: 'Strict',
					path: '/',
					secure: c.env.ENV === 'production',
				});
				c.set('userId', userId);

				return await next();
			}
		} else {
			console.error(error);
			return c.json({ message: 'Authentication error', error: error }, 401);
		}
	}
	await next();
}

app.get('api/auth/protected', authenticate, async (c) => {
	const userId = c.get('userId');
	const prisma = c.get('prisma');
	const user = await prisma.user.getUserById(userId);
	return c.json(user);
});

app.get('api/auth/logout', async (c) => {
	const refreshToken = getCookie(c, 'refreshToken');

	if (refreshToken) {
		await c.env.TDT_KV.delete(refreshToken);
	}
	deleteCookie(c, 'jwt');
	deleteCookie(c, 'refreshToken');
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
	const honeypot = userInfo.age;
	if (honeypot && honeypot !== '') {
		console.log('Bot detected!');
		return c.json({ message: 'It seems that you got lost' }, 404);
	}
	const id = c.req.param('id');
	const userId = c.get('userId');
	if (id !== userId) {
		return c.json({ message: 'unauthorized!' }, 401);
	}
	try {
		const prisma = c.get('prisma');
		const user = await prisma.user.updateUserInfo(userId, userInfo);
		return c.json(user, 200);
	} catch (error) {
		console.error('Error updating user info:', error);
		return c.json({ error: 'Failed to update user info' }, 500);
	}
});

app.patch('api/users/:id/profile-pic', authenticate, async (c) => {
	const data = await c.req.parseBody();
	const honeypot = data.title;
	if (honeypot && honeypot !== '') {
		console.log('Bot detected!');
		return c.json({ message: 'It seems that you got lost' }, 404);
	}
	const file = data.profilePic;
	const alt = data.alt;
	const id = c.req.param('id');
	const userId = c.get('userId');
	if (id !== userId) {
		return c.json({ message: 'unauthorized!' }, 401);
	}
	if (!file) {
		return c.json({ message: 'No image selected' }, 400);
	}
	try {
		const prisma = c.get('prisma');
		const oldKey = await prisma.profilePic.getProfilePicKey(userId);
		if (oldKey) {
			await c.env.TDT_BUCKET.delete(oldKey.src);
		}
		const key = `${Date.now()}-${file.name}`;
		await c.env.TDT_BUCKET.put(key, file.stream());
		const profilePic = await prisma.profilePic.updateProfilePic(userId, key, alt);

		return c.json(profilePic, 200);
	} catch (error) {
		console.error('Error updating user:', error);
		return c.json({ error: 'Failed to update user' }, 500);
	}
});

app.delete('api/users/:id', authenticate, async (c) => {
	const userId = c.req.param('id');
	const data = await c.req.parseBody();
	const honeypot = data.username;
	if (honeypot && honeypot !== '') {
		console.log('Bot detected!');
		return c.json({ message: 'It seems that you got lost' }, 404);
	}
	try {
		const prisma = c.get('prisma');
		await prisma.user.deleteUser(userId);
		deleteCookie(c, 'jwt');
		return c.json({ message: 'User deleted' }, 200);
	} catch (error) {
		console.error('Error deleting user', error);
		return c.json({ error: 'Failed to delete user' }, 500);
	}
});

app.delete('api/users/:id/profile-pic', authenticate, async (c) => {
	const userId = c.req.param('id');
	const data = await c.req.parseBody();
	const honeypot = data.title;
	if (honeypot && honeypot !== '') {
		console.log('Bot detected!');
		return c.json({ message: 'It seems that you got lost' }, 404);
	}
	try {
		const prisma = c.get('prisma');
		const key = await prisma.profilePic.getProfilePicKey(userId);
		if (key) {
			await prisma.profilePic.deleteProfilePic(userId);
			await c.env.TDT_BUCKET.delete(key.src);
			return c.json({ message: 'Profile pic deleted' }, 200);
		} else {
			return c.json({ message: 'User has no profile picture!' }, 400);
		}
	} catch (error) {
		console.error('Error deleting profile pic', error);
		return c.json({ error: 'Failed to delete profile pic' }, 500);
	}
});

export default app;
