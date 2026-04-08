import RepliesTableTestHelper from "../../../../tests/RepliesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import AddedReply from "../../../Domains/replies/entities/AddedReply.js";
import NewReply from "../../../Domains/replies/entities/NewReply.js";
import pool from "../../database/postgres/pool.js";
import ReplyRepositoryPostgres from "../ReplyRepositoryPostgres.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";

describe("ReplyRepositoryPostgres", () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist new reply and return added reply correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      const newReply = new NewReply({
        content: "abc",
        commentId: "comment-123",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "abc",
          owner: "user-123",
        }),
      );
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw AuthorizationError when reply owner not match", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-456"),
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when reply owner match", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner("reply-123", "user-123"),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteReply function", () => {
    it("should throw NotFoundError when reply not available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.deleteReply("reply-123"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should update is_delete to true", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply("reply-123");

      // Assert
      const replies = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe("getRepliesByCommentId function", () => {
    it("should return replies correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        content: "abc",
        commentId: "comment-123",
        owner: "user-123",
        date: "2021",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies =
        await replyRepositoryPostgres.getRepliesByCommentId("comment-123");

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual("reply-123");
      expect(replies[0].username).toEqual("dicoding");
      expect(replies[0].content).toEqual("abc");
      expect(replies[0].is_delete).toEqual(false);
      expect(replies[0].date).toBeDefined();
    });
  });

  describe("verifyAvailableReply function", () => {
    it("should throw NotFoundError when reply not available", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReply("reply-123"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when reply available", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyAvailableReply("reply-123"),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("checkReplyBelongsToComment function", () => {
    it("should throw NotFoundError when reply not belongs to comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkReplyBelongsToComment(
          "reply-123",
          "comment-456",
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when reply belongs to comment", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        commentId: "comment-123",
        owner: "user-123",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        replyRepositoryPostgres.checkReplyBelongsToComment(
          "reply-123",
          "comment-123",
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("getRepliesByThreadId function", () => {
    it("should return replies by thread id correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
      });
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        content: "abc",
        commentId: "comment-123",
        owner: "user-123",
        date: "2021",
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      const replies =
        await replyRepositoryPostgres.getRepliesByThreadId("thread-123");

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual("reply-123");
      expect(replies[0].username).toEqual("dicoding");
      expect(replies[0].content).toEqual("abc");
      expect(replies[0].is_delete).toEqual(false);
      expect(replies[0].comment_id).toEqual("comment-123");
      expect(replies[0].date).toBeDefined();
    });
  });
});
