import express from "express";
import authMiddleware from "../../../../Infrastructures/http/authMiddleware.js";

const createThreadsRouter = ({
  threadsHandler,
  commentsHandler,
  repliesHandler,
  container,
}) => {
  const router = express.Router();

  router.post("/", authMiddleware(container), threadsHandler.postThreadHandler);
  router.get("/:threadId", threadsHandler.getThreadDetailHandler);

  router.post(
    "/:threadId/comments",
    authMiddleware(container),
    commentsHandler.postCommentHandler,
  );
  router.delete(
    "/:threadId/comments/:commentId",
    authMiddleware(container),
    commentsHandler.deleteCommentHandler,
  );

  router.post(
    "/:threadId/comments/:commentId/replies",
    authMiddleware(container),
    repliesHandler.postReplyHandler,
  );
  router.delete(
    "/:threadId/comments/:commentId/replies/:replyId",
    authMiddleware(container),
    repliesHandler.deleteReplyHandler,
  );

  return router;
};

export default createThreadsRouter;
