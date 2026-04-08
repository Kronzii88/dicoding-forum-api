import { vi } from "vitest";
import AddReplyUseCase from "../../../../../Applications/use_case/AddReplyUseCase.js";
import DeleteReplyUseCase from "../../../../../Applications/use_case/DeleteReplyUseCase.js";
import RepliesHandler from "../handler.js";

describe("RepliesHandler", () => {
  describe("postReplyHandler", () => {
    it("should response 201 and added reply", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        params: { threadId: "thread-123", commentId: "comment-123" },
        body: { content: "abc" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      const next = vi.fn();

      const mockAddedReply = {
        id: "reply-123",
        content: "abc",
        owner: "user-123",
      };
      const mockAddReplyUseCase = {
        execute: vi.fn(() => Promise.resolve(mockAddedReply)),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockAddReplyUseCase),
      };

      const repliesHandler = new RepliesHandler(mockContainer);

      // Action
      await repliesHandler.postReplyHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance).toBeCalledWith(AddReplyUseCase.name);
      expect(mockAddReplyUseCase.execute).toBeCalledWith({
        content: "abc",
        threadId: "thread-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      expect(res.status).toBeCalledWith(201);
      expect(res.json).toBeCalledWith({
        status: "success",
        data: {
          addedReply: mockAddedReply,
        },
      });
    });

    it("should call next with error when use case throw error", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        params: { threadId: "thread-123", commentId: "comment-123" },
        body: {},
      };
      const res = {};
      const next = vi.fn();

      const mockAddReplyUseCase = {
        execute: vi.fn(() => Promise.reject(new Error("error"))),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockAddReplyUseCase),
      };

      const repliesHandler = new RepliesHandler(mockContainer);

      // Action
      await repliesHandler.postReplyHandler(req, res, next);

      // Assert
      expect(next).toBeCalledWith(new Error("error"));
    });
  });

  describe("deleteReplyHandler", () => {
    it("should response 200", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        params: {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-123",
        },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      const next = vi.fn();

      const mockDeleteReplyUseCase = {
        execute: vi.fn(() => Promise.resolve()),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockDeleteReplyUseCase),
      };

      const repliesHandler = new RepliesHandler(mockContainer);

      // Action
      await repliesHandler.deleteReplyHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance).toBeCalledWith(DeleteReplyUseCase.name);
      expect(mockDeleteReplyUseCase.execute).toBeCalledWith({
        threadId: "thread-123",
        commentId: "comment-123",
        replyId: "reply-123",
        owner: "user-123",
      });
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({
        status: "success",
      });
    });

    it("should call next with error when use case throw error", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        params: {
          threadId: "thread-123",
          commentId: "comment-123",
          replyId: "reply-123",
        },
      };
      const res = {};
      const next = vi.fn();

      const mockDeleteReplyUseCase = {
        execute: vi.fn(() => Promise.reject(new Error("error"))),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockDeleteReplyUseCase),
      };

      const repliesHandler = new RepliesHandler(mockContainer);

      // Action
      await repliesHandler.deleteReplyHandler(req, res, next);

      // Assert
      expect(next).toBeCalledWith(new Error("error"));
    });
  });
});
