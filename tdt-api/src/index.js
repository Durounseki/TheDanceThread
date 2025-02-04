import { OAuth2Client } from 'google-auth-library';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { SignJWT, jwtVerify } from 'jose';
import { v4 } from 'uuid';
import { Hono } from 'hono';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import createPrismaClient from './db/client.js';
import { cors } from 'hono/cors';
import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';

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
		allowMethods: ['GET', 'POST', 'OPTIONS'],
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

app.post('/api/events', async (c) => {
	const eventInfo = await c.req.parseBody();
	const file = eventInfo.flyer;
	try {
		const key = `${Date.now()}-${file.name}`;
		await c.env.TDT_BUCKET.put(key, file.stream());
		const prisma = c.get('prisma');
		const event = await prisma.event.createEvent(eventInfo, key);
		return c.json(event, 201);
	} catch (error) {
		console.error('Error uploading file:', error);
		return c.json({ error: 'Failed to upload file' }, 500);
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

		return c.json(event);
	} catch (error) {
		console.error('Error fetching event:', error);
		return c.json({ error: 'Failed to fetch event' }, 500);
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
		console.log(user);
		console.log('userId:', user.id);
		console.log('Checking user exists on db');
		const storedUser = await prisma.user.getUser(user.id);
		console.log('storedUser:', storedUser);
		let userId;
		if (!storedUser) {
			console.log('creating user');
			userId = await prisma.user.createUser(user);
			console.log(userId);
		} else {
			userId = storedUser.id;
		}
		console.log('user exists, set credentials');
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
		console.log('Cookies set, redirecting to:', `${c.env.APP_URL}/profile`);
		return c.redirect(`${c.env.APP_URL}/profile`);
	} catch (error) {
		console.error(error);
		return c.text('Login failed.', 500);
	}
});

const authenticate = async (c, next) => {
	const token = getCookie(c, 'jwt');
	const jwtSecret = c.get('jwtSecret');

	if (!token) {
		return c.json({ message: 'Unauthorized' }, 401);
	}
	try {
		const payload = await jwtVerify(token, jwtSecret);
		console.log('payload', payload.payload.userId);
		c.set('userId', payload.payload.userId);
	} catch (error) {
		console.error(error);
		return c.json({ message: 'Authentication error', error: error }, 401);
	}
	await next();
};

app.get('api/auth/protected', authenticate, async (c) => {
	const userId = c.get('userId');
	console.log(userId);
	const prisma = c.get('prisma');
	const user = await prisma.user.getUser(userId);
	const avatar = createAvatar(shapes, {
		seed: user.id,
		radius: 50,
		backgroundColor: ['181818'],
		shape1Color: ['ffa6db'],
		shape2Color: ['fff5ff'],
		shape3Color: ['b4d4ee'],
	}).toString();
	user.avatar = avatar;
	console.log(user);
	return c.json(user);
});

app.get('api/auth/logout', async (c) => {
	deleteCookie(c, 'jwt');
	return c.json({ message: 'Logged out successfully!' }, 200);
});

export default app;
