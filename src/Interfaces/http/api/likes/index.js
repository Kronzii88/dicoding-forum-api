import LikesHandler from './handler.js';
import createLikesRouter from './routes.js';

const likes = (container) => {
  const likesHandler = new LikesHandler(container);
  return createLikesRouter(likesHandler, container);
};

export default likes;
