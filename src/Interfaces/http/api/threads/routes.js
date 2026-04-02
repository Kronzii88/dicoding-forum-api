import express from "express";
import authMiddleware from "../../../../Infrastructures/http/authMiddleware.js";

const createThreadsRouter = (handler, container) => {
  const router = express.Router();

  router.post("/", authMiddleware(container), handler.postThreadHandler);
  router.get("/:threadId", handler.getThreadDetailHandler);

  router.post(
    "/:threadId/comments",
    authMiddleware(container),
    handler.postCommentHandler,
  );
  router.delete(
    "/:threadId/comments/:commentId",
    authMiddleware(container),
    handler.deleteCommentHandler,
  );

  router.post(
    "/:threadId/comments/:commentId/replies",
    authMiddleware(container),
    handler.postReplyHandler,
  );
  router.delete(
    "/:threadId/comments/:commentId/replies/:replyId",
    authMiddleware(container),
    handler.deleteReplyHandler,
  );

  return router;
};

export default createThreadsRouter;
