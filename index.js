const fastify = require('fastify');
const sensible = require('@fastify/sensible');
const cors = require('@fastify/cors');
const cookies = require('@fastify/cookie');
const { PrismaClient } = require('@prisma/client');
const app = fastify();

const prisma = new PrismaClient();
app.register(sensible);
app.register(cors, {
  origin: process.env.CLIENT_URL,
  credentials: true,
});
app.register(cookies, { secret: process.env.COOKIE_SECRET });
const userId = async () => (await prisma.user.findFirst({ where: { name: 'Kyle' } })).id;
app.addHook('onRequest', (req, res, done) => {
  userId().then((id) => {
    if (req.cookies.userId !== id) {
      req.cookies.userId = id;
      res.clearCookie('userId');
      res.setCookie('userId', id);
    }
    done();
  });
});

const COMMENT_SELECT_FIELDS = {
  id: true,
  message: true,
  parentId: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};
app.get('/posts', async (req, res) => {
  return await commitToDb(
    prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  );
});

app.get('/post/:id', async (req, res) => {
  return await commitToDb(
    prisma.post
      .findUnique({
        where: { id: req.params.id },
        select: {
          title: true,
          body: true,
          comments: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              ...COMMENT_SELECT_FIELDS,
              _count: { select: { likes: true } },
            },
          },
        },
      })
      .then(async (post) => {
        try {
          const likes = await prisma.like.findMany({
            where: {
              userId: req.cookies.userId,
              commentId: { in: post.comments.map((comment) => comment.id) },
            },
          });
          return {
            ...post,
            comments: post.comments.map((comment) => {
              const { _count, ...restOfFields } = comment;
              return {
                ...restOfFields,
                likeByMe: likes.find((like) => like.commentId === comment.id)?.userId === req.cookies.userId,
                likeCount: _count.likes,
              };
            }),
          };
        } catch (err) {
          return app.httpErrors.internalServerError(err.message);
        }
      })
  );
});

app.post('/posts/:id/comments', async (req, res) => {
  if (req.body.message === '' || req.body.message === null) {
    return app.httpErrors.badRequest('Comment is required');
  }
  return await commitToDb(
    prisma.comment
      .create({
        data: {
          message: req.body.message,
          parentId: req.body.parentId,
          userId: req.cookies.userId,
          postId: req.params.id,
        },
        select: COMMENT_SELECT_FIELDS,
      })
      .then((comment) => {
        return {
          ...comment,
          likeCount: 0,
          likeByMe: false,
        };
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
    await app.listen({ port: PORT }, () => console.log(`server is up on http://localhost:${PORT}`));
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
