import { GetBalanceError } from "./GetBalanceError";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let getbalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getbalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      userRepositoryInMemory
    );
  });

  it("should be able to get balance", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@hotmail.com",
      password: "123456",
    };

    const createdUser = await userRepositoryInMemory.create(user);

    const user_id = createdUser.id;

    const result = await getbalanceUseCase.execute({ user_id });

    expect(result.balance).toEqual(0);
    expect(result.statement).toEqual([]);
  });

  it("should not be able to get balance if user does not exists", async () => {
    const user_id = "12312";

    expect(async () => {
      await getbalanceUseCase.execute({ user_id });
    }).rejects.toEqual(new GetBalanceError());
  });
});
