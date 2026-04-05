import { vi } from "vitest";
import AddCommentUseCase from "../../../../../Applications/use_case/AddCommentUseCase.js";
import DeleteCommentUseCase from "../../../../../Applications/use_case/DeleteCommentUseCase.js";
import CommentsHandler from "../CommentsHandler.js";

describe("CommentsHandler", () => {
  describe("postCommentHandler", () => {
    it("should response 201 and added comment", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        params: { threadId: "thread-123" },
        body: { content: "abc" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      const next = vi.fn();

      const mockAddedComment = {
        id: "comment-123",
        content: "abc",
        owner: "user-123",
      };
      const mockAddCommentUseCase = {
        execute: vi.fn(() => Promise.resolve(mockAddedComment)),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockAddCommentUseCase),
      };

      const commentsHandler = new CommentsHandler(mockContainer);

      // Action
      await commentsHandler.postCommentHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance).toBeCalledWith(AddCommentUseCase.name);
      expect(mockAddCommentUseCase.execute).toBeCalledWith({
        content: "abc",
        threadId: "thread-123",
        owner: "user-123",
      });
      expect(res.status).toBeCalledWith(201);
      expect(res.json).toBeCalledWith({
        status: "success",
        data: {
          addedComment: mockAddedComment,
        },
      });
    });

    it("should call next with error when use case throw error", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        params: { threadId: "thread-123" },
        body: {},
      };
      const res = {};
      const next = vi.fn();

      const mockAddCommentUseCase = {
        execute: vi.fn(() => Promise.reject(new Error("error"))),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockAddCommentUseCase),
      };

      const commentsHandler = new CommentsHandler(mockContainer);

      // Action
      await commentsHandler.postCommentHandler(req, res, next);

      // Assert
      expect(next).toBeCalledWith(new Error("error"));
    });
  });

  describe("deleteCommentHandler", () => {
    it("should response 200", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        params: { threadId: "thread-123", commentId: "comment-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      const next = vi.fn();

      const mockDeleteCommentUseCase = {
        execute: vi.fn(() => Promise.resolve()),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockDeleteCommentUseCase),
      };

      const commentsHandler = new CommentsHandler(mockContainer);

      // Action
      await commentsHandler.deleteCommentHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance).toBeCalledWith(
        DeleteCommentUseCase.name,
      );
      expect(mockDeleteCommentUseCase.execute).toBeCalledWith({
        threadId: "thread-123",
        commentId: "comment-123",
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
        params: { threadId: "thread-123", commentId: "comment-123" },
      };
      const res = {};
      const next = vi.fn();

      const mockDeleteCommentUseCase = {
        execute: vi.fn(() => Promise.reject(new Error("error"))),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockDeleteCommentUseCase),
      };

      const commentsHandler = new CommentsHandler(mockContainer);

      // Action
      await commentsHandler.deleteCommentHandler(req, res, next);

      // Assert
      expect(next).toBeCalledWith(new Error("error"));
    });
  });
});
