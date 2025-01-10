import { Hono } from 'hono';
// import { events } from './utils.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import createPrismaClient from './db/client.js';

const app = new Hono();

app.use('*', async (c, next) => {
	const S3 = new S3Client({
		region: "auto",
		endpoint: c.env.S3_ENDPOINT,
		credentials: {
			accessKeyId: c.env.S3_ACCESS_KEY,
			secretAccessKey: c.env.S3_SECRET_KEY,
		},
	});
	c.set("s3", S3);
	c.set("prisma", createPrismaClient(c.env));
	await next();
});


app.get('/api/events', async (c) => {
	try{
		const prisma = c.get("prisma");
		const events = await prisma.event.getEvents();
		return c.json(events);
	}catch(error){
		console.error("Error fetching events:", error);
		return c.json({error: "Failed to fetch events"},500);
	}
});

app.post('/api/events', async (c) => {
	const eventInfo = await c.req.parseBody();
	const file = eventInfo.flyer;
	try{
		const key = `${Date.now()}-${file.name}`;
		await c.env.TDT_BUCKET.put(key, file.stream());
		const prisma = c.get("prisma");
		const event = await prisma.event.createEvent(eventInfo,key);
		return c.json(event, 201);
	}catch(error){
		console.error("Error uploading file:", error);
		return c.json({ error: 'Failed to upload file' }, 500);
	}
});

app.get('/api/events/:id', async (c) => {
	const id = c.req.param('id');
	try{
		const prisma = c.get("prisma");
		const event = await prisma.event.getEventById(id);
		if (!event) {
			return c.json({ error: 'Event not found' }, 404);
		}
		const s3 = c.get("s3");
		
		const command = new GetObjectCommand({
			Bucket: c.env.S3_BUCKET,
			Key: event.flyer.src,
		});
		
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		
		event.flyer.src = url;
		
		return c.json(event);
	}catch(error){
		console.error("Error fetching event:", error);
		return c.json({ error: 'Failed to fetch event' }, 500);
	}
});

// app.get('/api/events/:id/flyer', async (c) => {
	
// 	const id = parseInt(c.req.param('id'));
// 	const filename = events.find((e) => e.id === id).flyer.src;
// 	try{
// 		const s3 = c.get("s3");
	
// 		const command = new GetObjectCommand({
// 			Bucket: c.env.S3_BUCKET,
// 			Key: filename,
// 		});
		
// 		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
// 		const html = `<img src="${url}" alt="Event Flyer" />`;
// 		return c.html(html);

// 	}catch(error){
// 		console.error("Error Details:", {
//             message: error.message,
//             stack: error.stack,
//             name: error.name,
//             code: error.code
//         });
//         return c.json({ error: 'Failed to generate presigned URL' }, 500);
// 	}
// })

export default app;
