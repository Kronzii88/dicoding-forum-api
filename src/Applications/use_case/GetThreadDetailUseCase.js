class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments =
      await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    thread.comments = this._getFormattedComments(comments, replies);

    return thread;
  }

  _getFormattedComments(comments, replies) {
    return comments.map((comment) => {
      const formattedComment = {
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete
          ? "**komentar telah dihapus**"
          : comment.content,
      };

      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.is_delete
            ? "**balasan telah dihapus**"
            : reply.content,
          date: reply.date,
          username: reply.username,
        }));

      formattedComment.replies = commentReplies;

      return formattedComment;
    });
  }
}

export default GetThreadDetailUseCase;
