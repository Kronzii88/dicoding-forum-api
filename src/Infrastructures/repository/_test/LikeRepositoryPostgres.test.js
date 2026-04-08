import LikesTableTestHelper from "../../../../tests/LikesTableTestHelper.js";
import CommentsTableTestHelper from "../../../../tests/CommentsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../tests/ThreadsTableTestHelper.js";
import UsersTableTestHelper from "../../../../tests/UsersTableTestHelper.js";
import pool from "../../database/postgres/pool.js";
import LikeRepositoryPostgres from "../LikeRepositoryPostgres.js";

describe("LikeRepositoryPostgres", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("toggleLikeComment function", () => {
    it("should add like when comment is not liked", async () => {
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
        threadId: "thread-123",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.toggleLikeComment("user-123", "comment-123");

      // Assert
      const likes = await LikesTableTestHelper.findLikeById("like-123");
      expect(likes).toHaveLength(1);
    });

    it("should remove like when comment is already liked", async () => {
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
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-123",
        userId: "user-123",
        commentId: "comment-123",
      });
      const fakeIdGenerator = () => "123";
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.toggleLikeComment("user-123", "comment-123");

      // Assert
      const isLiked = await LikesTableTestHelper.checkLikeStatus(
        "user-123",
        "comment-123",
      );
      expect(isLiked).toEqual(false);
    });
  });

  describe("checkLikeStatus function", () => {
    it("should return true when comment is liked", async () => {
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
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        userId: "user-123",
        commentId: "comment-123",
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const status = await likeRepositoryPostgres.checkLikeStatus(
        "user-123",
        "comment-123",
      );

      // Assert
      expect(status).toEqual(true);
    });

    it("should return false when comment is not liked", async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const status = await likeRepositoryPostgres.checkLikeStatus(
        "user-123",
        "comment-123",
      );

      // Assert
      expect(status).toEqual(false);
    });
  });

  describe("getLikeCountByCommentId function", () => {
    it("should return correct like count", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await UsersTableTestHelper.addUser({
        id: "user-456",
        username: "johndoe",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-1",
        userId: "user-123",
        commentId: "comment-123",
      });
      await LikesTableTestHelper.addLike({
        id: "like-2",
        userId: "user-456",
        commentId: "comment-123",
      });
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const count =
        await likeRepositoryPostgres.getLikeCountByCommentId("comment-123");

      // Assert
      expect(count).toEqual(2);
    });
  });
});
