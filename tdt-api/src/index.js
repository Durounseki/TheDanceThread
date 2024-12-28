import { Hono } from 'hono';
import { events } from './utils.js';

const app = new Hono();

app.get('/api/events', (c) => {
	return c.json(events);
});

app.post('/api/events', async (c) => {
	const eventInfo = await c.req.parseBody();
	const event = {
		id: events.length + 1,
		...eventInfo,
	}
	events.push(event);
	return c.json(event, 201);
});

app.get('/api/events/:id', (c) => {
	const id = parseInt(c.req.param('id'));
  	const event = events.find((e) => e.id === id);
	if (!event) {
		return c.json({ error: 'Event not found' }, 404);
	}
  	return c.json(event);
});

export default app;
