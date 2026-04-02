import AuthenticationTokenManager from '../../Applications/security/AuthenticationTokenManager.js';

const authMiddleware = (container) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error('MISSING_AUTHENTICATION');
    }

    const token = authHeader.replace('Bearer ', '');
    const tokenManager = container.getInstance(AuthenticationTokenManager.name);

    await tokenManager.verifyAccessToken(token);
    const { id, username } = await tokenManager.decodePayload(token);

    req.user = { id, username };
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
