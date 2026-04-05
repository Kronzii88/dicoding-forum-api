import NewReply from '../NewReply.js';

describe('NewReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'abc',
      commentId: 123,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const { content, commentId, owner } = new NewReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
