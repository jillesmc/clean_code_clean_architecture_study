import req from "supertest";
import app from "../src/api";

const request = req(app);

describe("API", () => {

  test("Deve criar e consultar uma conta de passageiro", async () => {
    const inputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isPassenger: true,
    };
    const responseSignup = await request.post("/signup").send(inputSignup);
    const responseGetAccount = await request.get(`/accounts/${responseSignup.body.accountId}`);
    expect(responseSignup.status).toEqual(200);
    expect(responseSignup.body.accountId).toBeDefined();
    expect(responseGetAccount.body.account_id).toBeDefined();
    expect(responseGetAccount.body.is_passenger).toBeTruthy();
    expect(responseGetAccount.body.cpf).toBe(inputSignup.cpf);
  });

  test("Não deve criar uma conta de passageiro com CPF inválido", async () => {
    const inputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "11111111111",
      isPassenger: true,
    };
    const responseSignup = await request.post("/signup").send(inputSignup);
    expect(responseSignup.status).toEqual(422);
    expect(responseSignup.text).toBe("Invalid cpf");
  });

  test("Deve solicitar e consultar uma corrida", async function () {
    const inputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isPassenger: true,
    };
    const responseSignup = await request.post("/signup").send(inputSignup);
    const inputRequestRide = {
      passengerId: responseSignup.body.accountId,
      from: {
        lat: -27.584905257808835,
        long: -48.545022195325124
      },
      to: {
        lat: -27.496887588317275,
        long: -48.522234807851476
      }
    }
    const responseRequestRide = await request.post("/request-ride").send(inputRequestRide);
    const responseGetRide = await request.get(`/rides/${responseRequestRide.body.rideId}`);
    expect(responseRequestRide.status).toEqual(200);
    expect(responseRequestRide.body.rideId).toBeDefined();
    expect(responseGetRide.body.ride_id).toBe(responseRequestRide.body.rideId);
    expect(responseGetRide.body.passenger_id).toBe(inputRequestRide.passengerId);
  });


  test("Não deve solicitar uma corrida de passageiro inválido", async function () {
    const inputSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      carPlate: 'AAA9999',
      isDriver: true,
    };
    const responseSignup = await request.post("/signup").send(inputSignup);
    const outputSignup = responseSignup.body;
    const inputRequestRide = {
      passengerId: outputSignup.accountId,
      from: {
        lat: -27.584905257808835,
        long: -48.545022195325124
      },
      to: {
        lat: -27.496887588317275,
        long: -48.522234807851476
      }
    }
    const responseRequestRide = await request.post("/request-ride").send(inputRequestRide);
    expect(responseRequestRide.status).toEqual(422);
    expect(responseRequestRide.text).toEqual('Account is not from a passenger');
  });

  test("Deve aceitar e consultar uma corrida", async function () {
    const inputPassengerSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isPassenger: true,
    };
    const responsePassengerSignup = await request.post("/signup").send(inputPassengerSignup);
    const inputRequestRide = {
      passengerId: responsePassengerSignup.body.accountId,
      from: {
        lat: -27.584905257808835,
        long: -48.545022195325124
      },
      to: {
        lat: -27.496887588317275,
        long: -48.522234807851476
      }
    }
    const responseRequestRide = await request.post("/request-ride").send(inputRequestRide);
    const inputDriverSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      carPlate: 'AAA9999',
      isDriver: true,
    };
    const responseDriverSignup = await request.post("/signup").send(inputDriverSignup);
    const inputAcceptRide = {
      driverId: responseDriverSignup.body.accountId,
      rideId: responseRequestRide.body.rideId,
    };
    const responseAcceptRide = await request.post("/accept-ride").send(inputAcceptRide);
    const responseGetRide = await request.get(`/rides/${responseRequestRide.body.rideId}`);
    expect(responseAcceptRide.status).toEqual(200);
    expect(responseGetRide.body.ride_id).toBe(responseRequestRide.body.rideId);
    expect(responseGetRide.body.passenger_id).toBe(inputRequestRide.passengerId);
    expect(responseGetRide.body.driver_id).toBe(responseDriverSignup.body.accountId);
  });

  test("Não deve aceitar uma corrida de motorista inválido", async function () {
    const inputPassengerSignup = {
      name: "John Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "95818705552",
      isPassenger: true,
    };
    const responsePassengerSignup = await request.post("/signup").send(inputPassengerSignup);
    
    const inputAcceptRide = {
      driverId: responsePassengerSignup.body.accountId,
      rideId: 'doesnt-matter',
    };
    const responseAcceptRide = await request.post("/accept-ride").send(inputAcceptRide);
    expect(responseAcceptRide.status).toEqual(422);
    expect(responseAcceptRide.text).toEqual('Account is not from a driver');
  });
});
