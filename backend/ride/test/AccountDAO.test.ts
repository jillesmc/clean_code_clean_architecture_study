import crypto from "crypto";
import AccountDAO from "../src/AccountDAO";

test("Deve criar um registro na tabela account e consultar por email", async () => {
  const accountDAO = new AccountDAO();
  const account = {
    accountId: crypto.randomUUID(),
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
    date: new Date(),
    verificationCode: crypto.randomUUID(),
  };
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getByEmail(account.email);
  expect(savedAccount.account_id).toBeDefined();
  expect(savedAccount.name).toEqual(account.name);
  expect(savedAccount.email).toEqual(account.email);
  expect(savedAccount.cpf).toEqual(account.cpf);
  expect(savedAccount.is_passenger).toBeTruthy();
  expect(savedAccount.date).toBeDefined();
  expect(savedAccount.verification_code).toEqual(account.verificationCode);
});

test("Deve criar um registro na tabela account e consultar por account_id", async () => {
  const accountDAO = new AccountDAO();
  const account = {
    accountId: crypto.randomUUID(),
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "95818705552",
    isPassenger: true,
    date: new Date(),
    verificationCode: crypto.randomUUID(),
  };
  await accountDAO.save(account);
  const savedAccount = await accountDAO.getById(account.accountId);
  expect(savedAccount.account_id).toBeDefined();
  expect(savedAccount.name).toEqual(account.name);
  expect(savedAccount.email).toEqual(account.email);
  expect(savedAccount.cpf).toEqual(account.cpf);
  expect(savedAccount.is_passenger).toBeTruthy();
  expect(savedAccount.date).toBeDefined();
  expect(savedAccount.verification_code).toEqual(account.verificationCode);
});
