import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import AddedComment from "../../../Domains/comments/entities/AddedComment.js";
import NewComment from "../../../Domains/comments/entities/NewComment.js";
import pool from "../../database/postgres/pool.js";
import CommentRepositoryPostgres from "../CommentRepositoryPostgres.js";
import NotFoundError from "../../../Commons/exceptions/NotFoundError.js";
import AuthorizationError from "../../../Commons/exceptions/AuthorizationError.js";

describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addComment function", () => {
    it("should persist new comment and return added comment correctly", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      const newComment = new NewComment({
        content: "abc",
        threadId: "thread-123",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment =
        await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments =
        await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: "comment-123",
          content: "abc",
          owner: "user-123",
        }),
      );
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-123"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should throw AuthorizationError when comment owner not match", async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-456"),
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when comment owner match", async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner("comment-123", "user-123"),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteComment function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.deleteComment("comment-123"),
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment("comment-123");

      // Assert
      const comments =
        await CommentsTableTestHelper.findCommentById("comment-123");
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe("getCommentsByThreadId function", () => {
    it("should return comments correctly", async () => {
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
        content: "abc",
        threadId: "thread-123",
        owner: "user-123",
        date: "2021",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments =
        await commentRepositoryPostgres.getCommentsByThreadId("thread-123");

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual("comment-123");
      expect(comments[0].username).toEqual("dicoding");
      expect(comments[0].content).toEqual("abc");
      expect(comments[0].is_delete).toEqual(false);
      expect(comments[0].date).toBeDefined();
    });
  });

  describe("verifyAvailableComment function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-123"),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment available", async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyAvailableComment("comment-123"),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("checkCommentBelongsToThread function", () => {
    it("should throw NotFoundError when comment not belongs to thread", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkCommentBelongsToThread(
          "comment-123",
          "thread-456",
        ),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment belongs to thread", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.checkCommentBelongsToThread(
          "comment-123",
          "thread-123",
        ),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });
});
