import { OperationType } from "./../../entities/Statement";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperation: GetStatementOperationUseCase;

describe("Get statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperation = new GetStatementOperationUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("should be able to get statement operation", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@hotmail.com",
      password: "123456",
    };

    const infos = {
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "Teste",
    };

    const createdUser = await userRepositoryInMemory.create(user);

    const createdStatementResult = await statementRepositoryInMemory.create({
      user_id: createdUser.id,
      type: infos.type,
      amount: infos.amount,
      description: infos.description,
    });

    const statementOperationResult = await getStatementOperation.execute({
      user_id: createdUser.id,
      statement_id: createdStatementResult.id,
    });

    expect(statementOperationResult).toHaveProperty("id");
    expect(statementOperationResult.amount).toEqual(infos.amount);
    expect(statementOperationResult.user_id).toEqual(createdUser.id);
    expect(statementOperationResult.description).toEqual(infos.description);
  });

  it("should not be able to get statement operation if user does not exists", async () => {
    const infos = {
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "Teste",
    };

    const createdStatementResult = await statementRepositoryInMemory.create({
      user_id: "1234",
      type: infos.type,
      amount: infos.amount,
      description: infos.description,
    });

    expect(async () => {
      await getStatementOperation.execute({
        user_id: "1231",
        statement_id: createdStatementResult.id,
      });
    }).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });

  it("should not be able to get statement operation if statement does not exists", async () => {
    const user = {
      name: "John Doe",
      email: "johndoe@hotmail.com",
      password: "123456",
    };

    const createdUser = await userRepositoryInMemory.create(user);

    expect(async () => {
      await getStatementOperation.execute({
        user_id: createdUser.id,
        statement_id: '12312321',
      });
    }).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });
});
