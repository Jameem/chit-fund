import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import ChitFund from "../ethereum/chitFund";

class ContributorsRow extends Component {
  onAccept = async event => {
    let amount = event.currentTarget.dataset.amount;

    const job = Job(this.props.address);

    const accounts = await web3.eth.getAccounts();
    await job.methods.acceptBid(this.props.id).send({
      from: accounts[0],
      value: amount
    });
  };

  onFinalize = async () => {
    const job = Job(this.props.address);

    const accounts = await web3.eth.getAccounts();

    await job.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
  };
  render() {
    const { Row, Cell } = Table;

    const { id, participant, address } = this.props;
    // console.log(bid.amount);
    return (
      <Row positive={true}>
        <Cell>{id + 1}</Cell>
        <Cell>{participant}</Cell>
      </Row>
    );
  }
}

export default ContributorsRow;
