const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/ChitFundFactory.json");
const compiledChitFund = require("../ethereum/build/ChitFund.json");

let accounts;
let factory;
let chitFundAddress;
let chitFund;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "2000000" });

  await factory.methods.createFund("Chit Fund 1", "100", "3", "3").send({
    from: accounts[0],
    gas: "2000000"
  });

  [chitFundAddress] = await factory.methods.getDeployedFunds().call();

  chitFund = await new web3.eth.Contract(
    JSON.parse(compiledChitFund.interface),
    chitFundAddress
  );
});

describe("chit funds", () => {
  it("deploys a factory and a fund", () => {
    assert.ok(factory.options.address);
    assert.ok(chitFund.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await chitFund.methods.manager().call();

    assert.equal(accounts[0], manager);
  });

  it("allows people to join the fund", async () => {
    await chitFund.methods.joinFund().send({
      from: accounts[0],
      gas: "1000000"
    });

    await chitFund.methods.joinFund().send({
      from: accounts[1],
      gas: "1000000"
    });

    await chitFund.methods.joinFund().send({
      from: accounts[2],
      gas: "1000000"
    });

    const isJoined = await chitFund.methods.participantsArray(0).call();
    assert(isJoined);
  });

  it("allows participants to contribute to the fund", async () => {
    await chitFund.methods.contribute().send({
      from: accounts[0],
      value: "100"
    });

    await chitFund.methods.contribute().send({
      from: accounts[1],
      value: "100"
    });

    await chitFund.methods.contribute().send({
      from: accounts[2],
      value: "100"
    });

    const isContributed = await chitFund.methods
      .contributedParticipants(accounts[0])
      .call();
    assert(isContributed);
  });

  it("allows manager to release fund to the winner", async () => {
    await chitFund.methods.releaseFund().send({
      value: chitFund.balance,
      from: accounts[0]
    });
  });
});
