import AuthenticationTokenManager from '../../../Applications/security/AuthenticationTokenManager.js';
import authMiddleware from '../authMiddleware.js';

describe('authMiddleware', () => {
  it('should throw error when authorization header not exist', async () => {
    // Arrange
    const req = {
      headers: {},
    };
    const res = {};
    const next = vi.fn();

    // Action
    const middleware = authMiddleware({});
    await middleware(req, res, next);

    // Assert
    expect(next).toBeCalledWith(new Error('MISSING_AUTHENTICATION'));
  });

  it('should call next and set req.user when token is valid', async () => {
    // Arrange
    const req = {
      headers: {
        authorization: 'Bearer token-123',
      },
    };
    const res = {};
    const next = vi.fn();

    const mockTokenManager = new AuthenticationTokenManager();
    mockTokenManager.verifyAccessToken = vi.fn(() => Promise.resolve());
    mockTokenManager.decodePayload = vi.fn(() => Promise.resolve({ id: 'user-123', username: 'dicoding' }));

    const mockContainer = {
      getInstance: vi.fn(() => mockTokenManager),
    };

    // Action
    const middleware = authMiddleware(mockContainer);
    await middleware(req, res, next);

    // Assert
    expect(mockContainer.getInstance).toBeCalledWith(AuthenticationTokenManager.name);
    expect(mockTokenManager.verifyAccessToken).toBeCalledWith('token-123');
    expect(mockTokenManager.decodePayload).toBeCalledWith('token-123');
    expect(req.user).toStrictEqual({ id: 'user-123', username: 'dicoding' });
    expect(next).toBeCalledWith();
  });

  it('should call next with error when token is invalid', async () => {
    // Arrange
    const req = {
      headers: {
        authorization: 'Bearer token-invalid',
      },
    };
    const res = {};
    const next = vi.fn();

    const mockTokenManager = new AuthenticationTokenManager();
    mockTokenManager.verifyAccessToken = vi.fn(() => Promise.reject(new Error('INVALID_TOKEN')));

    const mockContainer = {
      getInstance: vi.fn(() => mockTokenManager),
    };

    // Action
    const middleware = authMiddleware(mockContainer);
    await middleware(req, res, next);

    // Assert
    expect(next).toBeCalledWith(new Error('INVALID_TOKEN'));
  });
});
