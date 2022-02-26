import { ShowUserProfileError } from "./ShowUserProfileError";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  });

  it("should be able to show user profile", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@hotmail.com",
      password: "123456",
    };

    const createdUser = await userRepositoryInMemory.create(user);

    const profile = await showUserProfileUseCase.execute(createdUser.id);

    expect(profile).toHaveProperty("id");
    expect(profile.name).toEqual(user.name);
    expect(profile.email).toEqual(user.email);
  });

  it("should not be able to show user profile if user does not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("1231321");
    }).rejects.toEqual(new ShowUserProfileError());
  });
});
