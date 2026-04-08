import request from "supertest";
import bcrypt from "bcrypt";
import pool from "../../../../../Infrastructures/database/postgres/pool.js";
import UsersTableTestHelper from "../../../../../../tests/UsersTableTestHelper.js";
import AuthenticationsTableTestHelper from "../../../../../../tests/AuthenticationsTableTestHelper.js";
import ThreadsTableTestHelper from "../../../../../../tests/ThreadsTableTestHelper.js";
import CommentsTableTestHelper from "../../../../../../tests/CommentsTableTestHelper.js";
import LikesTableTestHelper from "../../../../../../tests/LikesTableTestHelper.js";
import container from "../../../../../Infrastructures/container.js";
import createServer from "../../../../../Infrastructures/http/createServer.js";

describe("Likes API", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when PUT /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 200 and like the comment", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const userId = "user-123";
      const hashedPassword = await bcrypt.hash("password", 10);

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "dicoding",
        password: hashedPassword,
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });

      const server = await createServer(container);
      const authResponse = await request(server)
        .post("/authentications")
        .send({ username: "dicoding", password: "password" });
      const { accessToken } = authResponse.body.data;

      // Action
      const response = await request(server)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set("Authorization", `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("success");

      const isLiked = await LikesTableTestHelper.checkLikeStatus(
        userId,
        commentId,
      );
      expect(isLiked).toEqual(true);
    });

    it("should response 200 and unlike the comment if already liked", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const userId = "user-123";
      const hashedPassword = await bcrypt.hash("password", 10);

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "dicoding",
        password: hashedPassword,
      });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      await CommentsTableTestHelper.addComment({
        id: commentId,
        threadId,
        owner: userId,
      });
      await LikesTableTestHelper.addLike({ userId, commentId });

      const server = await createServer(container);
      const authResponse = await request(server)
        .post("/authentications")
        .send({ username: "dicoding", password: "password" });
      const { accessToken } = authResponse.body.data;

      // Action
      const response = await request(server)
        .put(`/threads/${threadId}/comments/${commentId}/likes`)
        .set("Authorization", `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("success");

      const isLiked = await LikesTableTestHelper.checkLikeStatus(
        userId,
        commentId,
      );
      expect(isLiked).toEqual(false);
    });

    it("should response 401 if not authenticated", async () => {
      // Arrange
      const threadId = "thread-123";
      const commentId = "comment-123";
      const server = await createServer(container);

      // Action
      const response = await request(server).put(
        `/threads/${threadId}/comments/${commentId}/likes`,
      );

      // Assert
      expect(response.status).toEqual(401);
    });

    it("should response 404 if thread not found", async () => {
      // Arrange
      const userId = "user-123";
      const hashedPassword = await bcrypt.hash("password", 10);

      await UsersTableTestHelper.addUser({
        id: userId,
        username: "dicoding",
        password: hashedPassword,
      });

      const server = await createServer(container);
      const authResponse = await request(server)
        .post("/authentications")
        .send({ username: "dicoding", password: "password" });
      const { accessToken } = authResponse.body.data;

      // Action
      const response = await request(server)
        .put(`/threads/invalid-thread/comments/comment-123/likes`)
        .set("Authorization", `Bearer ${accessToken}`);

      // Assert
      expect(response.status).toEqual(404);
    });
  });
});
