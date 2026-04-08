import RepliesHandler from './handler.js';
import createRepliesRouter from './routes.js';

const replies = (container) => {
  const repliesHandler = new RepliesHandler(container);
  return createRepliesRouter(repliesHandler, container);
};

export default replies;
