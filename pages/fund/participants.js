import React, { Component } from "react";
import { Button, Table, Label } from "semantic-ui-react";
import Layout from "../../components/layout";
import { Link } from "../../routes";
import ChitFund from "../../ethereum/chitFund";
import ParticipantsRow from "../../components/participantsRow";

class ParticipantsIndex extends Component {
  static async getInitialProps(props) {
    const chitFund = ChitFund(props.query.address);

    const participantsCount = await chitFund.methods.noOfParticipants().call();
    // const acceptedBidAmount = await job.methods.acceptedBidAmount().call();
    // const closed = await job.methods.closed().call();

    const participants = await Promise.all(
      Array(parseInt(participantsCount))
        .fill()
        .map((element, index) => {
          return chitFund.methods.participantsArray(index).call();
        })
    );

    const { address } = props.query.address;
    // console.log(bids);

    // return { address, bids, bidCount };
    return {
      address: props.query.address,
      participants: participants,
      participantsCount: participantsCount
    };
  }

  renderRows() {
    return this.props.participants.map((participant, index) => {
      return (
        <ParticipantsRow
          key={index}
          id={index}
          participant={participant}
          address={this.props.address}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <h3>Participants</h3>

        <Table>
          <Header>
            <HeaderCell>Sl. No</HeaderCell>
            <HeaderCell>Participant</HeaderCell>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.participantsCount} participants.</div>
      </Layout>
    );
  }
}

export default ParticipantsIndex;
