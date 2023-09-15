// @ts-nocheck
import express from "express";
import AccountService from "./AccountService";
import RideService from "./RideService";
const app = express();

app.use(express.json());

const accountService = new AccountService();
const rideService = new RideService();

app.post("/signup", async (req, res) => {
  try {
    const input = req.body;
    const output = await accountService.signup(input);
    res.json(output);
  } catch (e) {
    res.status(422).send(e.message);
  }
});

app.post("/request-ride", async (req, res) => {
  try {
    const output = await rideService.requestRide(req.body);
    res.json(output);
  } catch (e) {
    res.status(422).send(e.message);
  }
});

app.post("/accept-ride", async (req, res) => {
  try {
    const output = await rideService.acceptRide(req.body);
    res.json(output);
  } catch (e) {
    res.status(422).send(e.message);
  }
});

app.get("/rides/:rideId", async (req, res) => {
  const output = await rideService.getRide(req.params.rideId);
  res.json(output);
});

app.get("/accounts/:accountId", async (req, res) => {
  const output = await accountService.getAccount(req.params.accountId);
  res.json(output);
});

/* istanbul ignore next */
if (process.env.NODE_ENV !== "test") {
  app.listen(3000);
}
export default app;
