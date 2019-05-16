import React, { Component } from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import Layout from "../../components/layout";
import ChitFund from "../../ethereum/chitFund";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/contributeForm";
import { Link } from "../../routes";

class FundShow extends Component {
  state = {
    amount: "",
    errorMessage: "",
    loading: false
  };

  static async getInitialProps(props) {
    const chitFund = ChitFund(props.query.address);
    const summary = await chitFund.methods.getSummary().call();

    return {
      address: props.query.address,
      fundName: summary[0],
      balance: summary[1],
      installmentAmount: summary[2],
      noOfInstallments: summary[3],
      noOfParticipants: summary[4],
      currentNoOfContributors: summary[5],
      noOfParticipantsJoined: summary[6],
      currentInstallment: summary[7],
      manager: summary[8],
      status: summary[9],
      lastWinner: summary[10]
    };
  }

  onJoin = async () => {
    this.setState({ loading: true });
    const chitFund = ChitFund(this.props.address);
    const accounts = await web3.eth.getAccounts();
    try {
      await chitFund.methods.joinFund().send({
        from: accounts[0]
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    //Refresh the component with updated data
    Router.replaceRoute(`/fund/${this.props.address}`);
    this.setState({ loading: false });
  };

  onPickingWinner = async () => {
    this.setState({ loading: true });
    const chitFund = ChitFund(this.props.address);
    const accounts = await web3.eth.getAccounts();

    await chitFund.methods.releaseFund().send({
      from: accounts[0]
    });

    //Refresh the component with updated data
    Router.replaceRoute(`/fund/${this.props.address}`);
    this.setState({ loading: false });
  };

  renderCards() {
    const {
      address,
      fundName,
      balance,
      installmentAmount,
      noOfInstallments,
      noOfParticipants,
      currentNoOfContributors,
      noOfParticipantsJoined,
      currentInstallment,
      manager,
      status,
      lastWinner
    } = this.props;

    const items = [
      {
        header: fundName,
        description: status == true ? "Status: Open" : "Status: Closed",
        color: "red"
      },
      {
        header: installmentAmount,
        meta: "Installment Amount (wei)",
        description:
          "One installment should be equal to " + installmentAmount + ".",
        color: "red"
      },
      {
        header: noOfInstallments,
        meta: "Total Number of Installments",
        description:
          "Fund will be closed after " + noOfInstallments + " installments.",
        color: "red"
      },
      {
        header: noOfParticipants,
        meta: "Maximum Number of Participants",
        description:
          "New participants could not join after " +
          noOfParticipants +
          " participants.",
        color: "red"
      },
      {
        header: manager,
        meta: "Address of Manager",
        description: "The manager who created this Fund.",
        style: { overflowWrap: "break-word" },
        color: "red"
      },
      {
        header: noOfParticipants,
        meta: "Maximum Number of Participants",
        description:
          "New participants could not join after " +
          noOfParticipants +
          " participants.",
        color: "red"
      },
      {
        header: noOfParticipantsJoined,
        meta: "Number of Participants Joined",
        color: "red"
      },
      {
        header: balance,
        meta: "Fund Balance (wei)",
        description:
          "The balance is how much money this Fund has collected in the current installment.",
        color: "red"
      },
      {
        header: currentInstallment,
        meta: "Installment Number in Progress",
        color: "red"
      },
      {
        header: currentNoOfContributors,
        meta: "Number of Participants Contributed in the Current Installment.",
        color: "red"
      },
      {
        header: lastWinner ? lastWinner : "",
        meta: "0x000 if it is the first installment.",
        description: "Address of Winner of the Last Installment",
        style: { overflowWrap: "break-word" },
        color: "red"
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Job Show</h3>

        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={6}>
              {this.props.currentNoOfContributors !=
              this.props.noOfParticipantsJoined ? (
                <ContributeForm address={this.props.address} />
              ) : (
                ""
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {this.props.noOfParticipants !=
            this.props.noOfParticipantsJoined ? (
              <Grid.Column width={4}>
                <Button
                  primary
                  onClick={this.onJoin}
                  loading={this.state.loading}
                >
                  Join Fund
                </Button>
              </Grid.Column>
            ) : (
              ""
            )}
            {this.props.currentNoOfContributors != 0 ? (
              <Grid.Column width={4}>
                <Link route={`/fund/${this.props.address}/participants`}>
                  <a>
                    <Button primary> View Participants</Button>
                  </a>
                </Link>
              </Grid.Column>
            ) : (
              ""
            )}
            {this.props.noOfParticipants ==
            this.props.currentNoOfContributors ? (
              <Grid.Column width={4}>
                <Button
                  primary
                  onClick={this.onPickingWinner}
                  loading={this.state.loading}
                >
                  Pick Winner
                </Button>
              </Grid.Column>
            ) : (
              ""
            )}
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default FundShow;
