import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import ChitFund from "../ethereum/chitFund";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    amount: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    const chitFund = ChitFund(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await chitFund.methods.contribute().send({
        from: accounts[0],
        value: this.state.amount
      });

      //Refresh the component with updated data
      Router.replaceRoute(`/fund/${this.props.address}`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, value: "" });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            required
            value={this.state.amount}
            onChange={event =>
              this.setState({ amount: event.target.value.replace(/\D/, "") })
            }
            label="wei"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />

        <Button loading={this.state.loading} primary>
          Pay!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
