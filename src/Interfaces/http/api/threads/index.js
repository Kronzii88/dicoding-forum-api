import ThreadsHandler from "./handler.js";
import createThreadsRouter from "./routes.js";

const threads = (container) => {
  const threadsHandler = new ThreadsHandler(container);

  return createThreadsRouter(threadsHandler, container);
};

export default threads;
