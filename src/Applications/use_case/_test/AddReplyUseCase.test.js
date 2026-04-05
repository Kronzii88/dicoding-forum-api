import { vi } from "vitest";
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import AddedReply from '../../../Domains/replies/entities/AddedReply.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddReplyUseCase from "../AddReplyUseCase.js";

describe("AddReplyUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      content: "abc",
      threadId: "thread-123",
      commentId: "comment-123",
      owner: "user-123",
    };

    const mockAddedReply = new AddedReply({
      id: "reply-123",
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

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
    mockReplyRepository.addReply = vi.fn(() => Promise.resolve(mockAddedReply));

    /** creating use case instance */
    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: "reply-123",
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      }),
    );
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
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new NewReply({
        content: useCasePayload.content,
        commentId: useCasePayload.commentId,
        owner: useCasePayload.owner,
      }),
    );
  });
});
