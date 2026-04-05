import { vi } from "vitest";
import AddThreadUseCase from "../../../../../Applications/use_case/AddThreadUseCase.js";
import GetThreadDetailUseCase from "../../../../../Applications/use_case/GetThreadDetailUseCase.js";
import ThreadsHandler from "../handler.js";

describe("ThreadsHandler", () => {
  describe("postThreadHandler", () => {
    it("should response 201 and added thread", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        body: { title: "abc", body: "def" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      const next = vi.fn();

      const mockAddedThread = {
        id: "thread-123",
        title: "abc",
        owner: "user-123",
      };
      const mockAddThreadUseCase = {
        execute: vi.fn(() => Promise.resolve(mockAddedThread)),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockAddThreadUseCase),
      };

      const threadsHandler = new ThreadsHandler(mockContainer);

      // Action
      await threadsHandler.postThreadHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance).toBeCalledWith(AddThreadUseCase.name);
      expect(mockAddThreadUseCase.execute).toBeCalledWith({
        title: "abc",
        body: "def",
        owner: "user-123",
      });
      expect(res.status).toBeCalledWith(201);
      expect(res.json).toBeCalledWith({
        status: "success",
        data: {
          addedThread: mockAddedThread,
        },
      });
    });

    it("should call next with error when use case throw error", async () => {
      // Arrange
      const req = {
        user: { id: "user-123" },
        body: {},
      };
      const res = {};
      const next = vi.fn();

      const mockAddThreadUseCase = {
        execute: vi.fn(() => Promise.reject(new Error("error"))),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockAddThreadUseCase),
      };

      const threadsHandler = new ThreadsHandler(mockContainer);

      // Action
      await threadsHandler.postThreadHandler(req, res, next);

      // Assert
      expect(next).toBeCalledWith(new Error("error"));
    });
  });

  describe("getThreadDetailHandler", () => {
    it("should response 200 and thread detail", async () => {
      // Arrange
      const req = {
        params: { threadId: "thread-123" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      };
      const next = vi.fn();

      const mockThreadDetail = { id: "thread-123", title: "abc" };
      const mockGetThreadDetailUseCase = {
        execute: vi.fn(() => Promise.resolve(mockThreadDetail)),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockGetThreadDetailUseCase),
      };

      const threadsHandler = new ThreadsHandler(mockContainer);

      // Action
      await threadsHandler.getThreadDetailHandler(req, res, next);

      // Assert
      expect(mockContainer.getInstance).toBeCalledWith(
        GetThreadDetailUseCase.name,
      );
      expect(mockGetThreadDetailUseCase.execute).toBeCalledWith({
        threadId: "thread-123",
      });
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith({
        status: "success",
        data: {
          thread: mockThreadDetail,
        },
      });
    });

    it("should call next with error when use case throw error", async () => {
      // Arrange
      const req = {
        params: { threadId: "thread-123" },
      };
      const res = {};
      const next = vi.fn();

      const mockGetThreadDetailUseCase = {
        execute: vi.fn(() => Promise.reject(new Error("error"))),
      };
      const mockContainer = {
        getInstance: vi.fn(() => mockGetThreadDetailUseCase),
      };

      const threadsHandler = new ThreadsHandler(mockContainer);

      // Action
      await threadsHandler.getThreadDetailHandler(req, res, next);

      // Assert
      expect(next).toBeCalledWith(new Error("error"));
    });
  });
});
