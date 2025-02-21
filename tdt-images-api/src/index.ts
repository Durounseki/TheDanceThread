import { Hono } from "hono";

const app = new Hono();

const sizes = {
  placeholder: {
    width: 30,
    height: 30,
  },
  thumbnail: {
    width: 60,
    height: 60,
  },
  small: {
    width: 120,
    height: 120,
  },
  medium: {
    width: 360,
    height: 360,
  },
  large: {
    width: 720,
    height: 720,
  },
  full: {},
};

app.get("/images/:key", async (c) => {
  if (/images/.test(c.req.header("Via"))) {
    return fetch(c.req);
  }
  const accepts = c.req.header("Accept");
  const key = c.req.param("key");
  const size = sizes[c.req.query("size")];

  if (size) {
    const requestUrl = new URL(c.req.url);
    requestUrl.search = "";
    const imageURL = requestUrl.toString();

    let options = { cf: { image: { fit: "scale-down" } } };
    if (size) {
      options.cf.image = { ...options.cf.image, ...size };
    }

    if (/image\/avif/.test(accepts)) {
      options.cf.image.format = "avif";
    } else if (/image\/webp/.test(accepts)) {
      options.cf.image.format = "webp";
    }

    if (!/\.(jpe?g|png|gif|webp)$/i.test(key)) {
      if (/\.avif$/i.test(key)) {
        return fetchOriginal(c, key);
      } else {
        return c.json({ message: "File extension not supported" }, 400);
      }
    }

    const imageRequest = new Request(imageURL, {
      headers: c.req.header(),
    });

    return fetch(imageRequest, options);
  } else {
    return fetchOriginal(c, key);
  }
});

async function fetchOriginal(c, key) {
  const file = await c.env.TDT_BUCKET.get(key);
  if (!file) {
    console.error("File not found", error);
    return c.json({ error: "Image not found" }, 404);
  }
  const body = file.body;
  const contentType =
    file.httpMetadata?.contentType || "aplication/octet-stream";
  const headers = new Headers();
  headers.set("Content-Type", contentType);
  return new Response(body, { headers });
}

export default app;
