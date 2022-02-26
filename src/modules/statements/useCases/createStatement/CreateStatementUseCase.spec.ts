import { OperationType } from "./../../entities/Statement";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "./../../../statements/repositories/in-memory/InMemoryStatementsRepository";
import { info } from "console";
import { CreateStatementError } from "./CreateStatementError";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementRepositoryInMemory
    );
  });

  it("should be able to deposit statement", async () => {
    const user = {
      name: "John Doe",
      email: "juliocarlos00@hotmail.com",
      password: "123456",
    };

    const infos = {
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "Teste",
    };

    const createdUser = await userRepositoryInMemory.create(user);

    const result = await createStatementUseCase.execute({
      user_id: createdUser.id,
      type: infos.type,
      amount: infos.amount,
      description: infos.description,
    });

    expect(result).toHaveProperty("id");
    expect(result.amount).toEqual(infos.amount);
    expect(result.type).toEqual(infos.type);
  });

  it("should be able to withdraw statement", async () => {
    const user = {
      name: "John Doe",
      email: "juliocarlos00@hotmail.com",
      password: "123456",
    };


    const depositInfo = {
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "deposit test",
    };

    const withdrawInfo = {
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "withdraw test",
    };


    const createdUser = await userRepositoryInMemory.create(user);

    await createStatementUseCase.execute({
      user_id: createdUser.id,
      type: depositInfo.type,
      amount: depositInfo.amount,
      description: depositInfo.description,
    });

    const result = await createStatementUseCase.execute({
      user_id: createdUser.id,
      type: withdrawInfo.type,
      amount: withdrawInfo.amount,
      description: withdrawInfo.description,
    });

    expect(result).toHaveProperty("id");
    expect(result.amount).toEqual(withdrawInfo.amount);
    expect(result.type).toEqual(withdrawInfo.type);

  });


  it("should not be able to create statement with user does not exists", async () => {
    const infos = {
      type: OperationType.DEPOSIT,
      amount: 3000,
      description: "Teste",
    };

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "1231232",
        type: infos.type,
        amount: infos.amount,
        description: infos.description,
      });
    }).rejects.toEqual(new CreateStatementError.UserNotFound());
  });


  it("should not be able to withdraw statement with insufficient funds ", async () => {
    const user = {
      name: "John Doe",
      email: "juliocarlos00@hotmail.com",
      password: "123456",
    };

    const infos = {
      type: OperationType.WITHDRAW,
      amount: 3000,
      description: "Teste",
    };

    const createdUser = await userRepositoryInMemory.create(user);

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: createdUser.id,
        type: infos.type,
        amount: infos.amount,
        description: infos.description,
      });
    }).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
