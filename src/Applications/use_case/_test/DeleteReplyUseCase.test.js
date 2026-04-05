import { vi } from "vitest";
import ReplyRepository from "../../../Domains/replies/ReplyRepository.js";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import DeleteReplyUseCase from "../DeleteReplyUseCase.js";

describe("DeleteReplyUseCase", () => {
  it("should orchestrating the delete reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
      owner: "user-123",
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn(() =>
      Promise.resolve(),
    );
    mockCommentRepository.checkCommentBelongsToThread = vi.fn(() =>
      Promise.resolve(),
    );
    mockReplyRepository.verifyAvailableReply = vi.fn(() => Promise.resolve());
    mockReplyRepository.checkReplyBelongsToComment = vi.fn(() =>
      Promise.resolve(),
    );
    mockReplyRepository.verifyReplyOwner = vi.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = vi.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(
      useCasePayload.threadId,
    );
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId,
    );
    expect(mockCommentRepository.checkCommentBelongsToThread).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.threadId,
    );
    expect(mockReplyRepository.verifyAvailableReply).toBeCalledWith(
      useCasePayload.replyId,
    );
    expect(mockReplyRepository.checkReplyBelongsToComment).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.commentId,
    );
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.owner,
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(
      useCasePayload.replyId,
    );
  });
});
