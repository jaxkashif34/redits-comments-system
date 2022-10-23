const fastify = require('fastify');
const sensible = require('@fastify/sensible');
const cors = require('@fastify/cors');
const { PrismaClient } = require('@prisma/client');
const app = fastify();

const prisma = new PrismaClient();
app.register(sensible);
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
});
app.get('/posts', async (req, res) => {
  return commitToDb(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});

const commitToDb = async (promise) => {
  const [error, data] = await app.to(promise);
  if (error) app.httpErrors.internalServerError(error.message);
  return data;
};

const PORT = process.env.PORT || 8000;
const startServer = async () => {
  try {
    await app.listen(PORT, () => console.log(`server is up on http://localhost:${PORT}`));
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
