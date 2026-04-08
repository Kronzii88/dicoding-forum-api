class ToggleLikeCommentUseCase {
  constructor({ likeRepository, commentRepository, threadRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId, commentId } = useCasePayload;

    await this._threadRepository.verifyAvailableThread(threadId);
    await this._commentRepository.verifyAvailableComment(commentId);
    await this._commentRepository.checkCommentBelongsToThread(commentId, threadId);

    await this._likeRepository.toggleLikeComment(userId, commentId);
  }
}

export default ToggleLikeCommentUseCase;
