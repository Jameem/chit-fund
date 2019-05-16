import React, { Component } from "react";
import Layout from "../../components/layout";
import { Form, Button, Input, Message, TextArea } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class FundNew extends Component {
  state = {
    fundName: "",
    installmentAmount: "",
    noOfInstallments: "",
    noOfParticipants: "",
    currentNoOfContributors: "",
    manager: "",
    noOfParticipantsJoined: "",
    fundBalance: "",
    currentInstallment: "",
    noOfInstallments: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createFund(
          this.state.fundName,
          this.state.installmentAmount,
          this.state.noOfInstallments,
          this.state.noOfParticipants
        )
        .send({
          from: accounts[0]
        });

      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h1>Create a Fund </h1>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Title</label>
            <Input
              required
              value={this.state.fundName}
              onChange={event =>
                this.setState({ fundName: event.target.value })
              }
            />

            <label>Installment Amount</label>
            <Input
              required
              label="wei"
              labelPosition="right"
              value={this.state.installmentAmount}
              onChange={event =>
                this.setState({
                  installmentAmount: event.target.value.replace(/\D/, "")
                })
              }
            />

            <label>No of Installments</label>
            <Input
              required
              value={this.state.noOfInstallments}
              onChange={event =>
                this.setState({
                  noOfInstallments: event.target.value.replace(/\D/, "")
                })
              }
            />

            <label>No of Participants</label>
            <Input
              required
              value={this.state.noOfParticipants}
              onChange={event =>
                this.setState({
                  noOfParticipants: event.target.value.replace(/\D/, "")
                })
              }
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create Fund!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default FundNew;
