import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("should be able create a new user", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@hotmail.com",
      password: "123456",
    };

    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser.name).toEqual(user.name);
    expect(createdUser.email).toEqual(user.email);
  });

  it("should not be able create a new user with same email", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@hotmail.com",
      password: "123456",
    };

    await userRepositoryInMemory.create(user)
    await expect(async () => {
      await createUserUseCase.execute(user)

    }).rejects.toEqual(new CreateUserError());
  });
});
