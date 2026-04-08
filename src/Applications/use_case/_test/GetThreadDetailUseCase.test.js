import { vi } from "vitest";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import LikeRepository from "../../../Domains/likes/LikeRepository.js";
import GetThreadDetailUseCase from "../GetThreadDetailUseCase.js";

describe("GetThreadDetailUseCase", () => {
  it("should orchestrating the get thread detail action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
    };

    const mockThread = {
      id: "thread-123",
      title: "abc",
      body: "def",
      date: "2021",
      username: "user-123",
    };

    const mockComments = [
      {
        id: "comment-1",
        username: "user-a",
        date: "2021",
        content: "comment a",
        is_delete: false,
      },
      {
        id: "comment-2",
        username: "user-b",
        date: "2021",
        content: "comment b",
        is_delete: true,
      },
    ];

    const mockReplies = [
      {
        id: "reply-1",
        comment_id: "comment-1",
        content: "reply 1",
        date: "2021",
        username: "user-c",
        is_delete: false,
      },
      {
        id: "reply-2",
        comment_id: "comment-1",
        content: "reply 2",
        date: "2021",
        username: "user-d",
        is_delete: true,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = vi.fn(() =>
      Promise.resolve(mockThread),
    );
    mockCommentRepository.getCommentsByThreadId = vi.fn(() =>
      Promise.resolve(mockComments),
    );
    mockReplyRepository.getRepliesByThreadId = vi.fn(() =>
      Promise.resolve(mockReplies),
    );
    mockLikeRepository.getLikeCountByCommentId = vi.fn((commentId) => {
      if (commentId === "comment-1") return Promise.resolve(2);
      if (commentId === "comment-2") return Promise.resolve(0);
      return Promise.resolve(0);
    });

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual({
      id: "thread-123",
      title: "abc",
      body: "def",
      date: "2021",
      username: "user-123",
      comments: [
        {
          id: "comment-1",
          username: "user-a",
          date: "2021",
          content: "comment a",
          likeCount: 2,
          replies: [
            {
              id: "reply-1",
              content: "reply 1",
              date: "2021",
              username: "user-c",
            },
            {
              id: "reply-2",
              content: "**balasan telah dihapus**",
              date: "2021",
              username: "user-d",
            },
          ],
        },
        {
          id: "comment-2",
          username: "user-b",
          date: "2021",
          content: "**komentar telah dihapus**",
          likeCount: 0,
          replies: [],
        },
      ],
    });
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockLikeRepository.getLikeCountByCommentId).toBeCalledWith(
      "comment-1",
    );
    expect(mockLikeRepository.getLikeCountByCommentId).toBeCalledWith(
      "comment-2",
    );
  });
});
