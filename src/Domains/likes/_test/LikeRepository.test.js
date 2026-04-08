import LikeRepository from '../LikeRepository.js';

describe('LikeRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.toggleLikeComment('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikeCountByCommentId('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.checkLikeStatus('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
