import express from "express";
import authMiddleware from "../../../../Infrastructures/http/authMiddleware.js";

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post("/", authMiddleware(container), handler.postThreadHandler);
  router.get("/:threadId", handler.getThreadDetailHandler);

  return router;
};

export default createThreadsRouter;
