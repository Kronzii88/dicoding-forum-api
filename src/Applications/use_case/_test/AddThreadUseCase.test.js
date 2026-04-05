import { vi } from "vitest";
import AddedThread from '../../../Domains/threads/entities/AddedThread.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import AddThreadUseCase from "../AddThreadUseCase.js";

describe("AddThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "abc",
      body: "def",
      owner: "user-123",
    };

    const mockAddedThread = new AddedThread({
      id: "thread-123",
      title: "dicoding thread",
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = vi.fn(() =>
      Promise.resolve(mockAddedThread),
    );

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: useCasePayload.owner,
      }),
    );
  });
});
