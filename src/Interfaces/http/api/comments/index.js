import CommentsHandler from './handler.js';
import createCommentsRouter from './routes.js';

const comments = (container) => {
  const commentsHandler = new CommentsHandler(container);
  return createCommentsRouter(commentsHandler, container);
};

export default comments;
