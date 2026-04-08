import { vi } from 'vitest';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrating the toggle like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = vi.fn(() => Promise.resolve());
    mockCommentRepository.verifyAvailableComment = vi.fn(() => Promise.resolve());
    mockCommentRepository.checkCommentBelongsToThread = vi.fn(() => Promise.resolve());
    mockLikeRepository.toggleLikeComment = vi.fn(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.checkCommentBelongsToThread).toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockLikeRepository.toggleLikeComment).toBeCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});
