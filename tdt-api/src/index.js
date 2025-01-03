import { Hono } from 'hono';
import { events } from './utils.js';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
	await next();
});


app.get('/api/events', (c) => {
	return c.json(events);
});

app.post('/api/events', async (c) => {
	const eventInfo = await c.req.parseBody();
	const file = eventInfo.flyer;
	if(!file){
		return c.json({ error: 'Flyer is required' }, 400);
	}
	try{
		const key = `${Date.now()}-${file.name}`;
		await c.env.TDT_BUCKET.put(key, file.stream());
		const event = {
			...eventInfo,
			id: events.length + 1,
			flyer: {
				src: key,
				alt: eventInfo.name,
			}
		}
		events.push(event);
		return c.json(event, 201);
	}catch(error){
		console.error("Error uploading file:", error);
		return c.json({ error: 'Failed to upload file' }, 500);
	}
});

app.get('/api/events/:id', (c) => {
	const id = parseInt(c.req.param('id'));
  	const event = events.find((e) => e.id === id);
	if (!event) {
		return c.json({ error: 'Event not found' }, 404);
	}
  	return c.json(event);
});

app.get('/api/events/:id/flyer', async (c) => {
	
	const id = parseInt(c.req.param('id'));
	const filename = events.find((e) => e.id === id).flyer.src;
	try{
		const s3 = c.get("s3");
	
		const command = new GetObjectCommand({
			Bucket: c.env.S3_BUCKET,
			Key: filename,
		});
		
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		const html = `<img src="${url}" alt="Event Flyer" />`;
		return c.html(html);

	}catch(error){
		console.error("Error Details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        return c.json({ error: 'Failed to generate presigned URL' }, 500);
	}
})

export default app;
