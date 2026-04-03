import ThreadsHandler from './handler.js';
import CommentsHandler from './CommentsHandler.js';
import RepliesHandler from './RepliesHandler.js';
import createThreadsRouter from './routes.js';

const threads = (container) => {
  const threadsHandler = new ThreadsHandler(container);
  const commentsHandler = new CommentsHandler(container);
  const repliesHandler = new RepliesHandler(container);

  return createThreadsRouter({
    threadsHandler,
    commentsHandler,
    repliesHandler,
    container,
  });
};

export default threads;
