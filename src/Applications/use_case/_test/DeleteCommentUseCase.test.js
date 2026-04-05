import { vi } from "vitest";
import CommentRepository from "../../../Domains/comments/CommentRepository.js";
import ThreadRepository from "../../../Domains/threads/ThreadRepository.js";
import DeleteCommentUseCase from "../DeleteCommentUseCase.js";

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the delete comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    /** creating dependency of use case */
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
    mockCommentRepository.verifyCommentOwner = vi.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = vi.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

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
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.owner,
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.commentId,
    );
  });
});
