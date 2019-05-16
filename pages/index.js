import React, { Component } from "react";
import { Card, Button } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "../components/layout";
import { Link } from "../routes";
import ChitFund from "../ethereum/chitFund";

class ChitFundIndex extends Component {
  static async getInitialProps() {
    const chitFunds = await factory.methods.getDeployedFunds().call();

    return { chitFunds };
  }

  renderFunds() {
    const items = this.props.chitFunds.map(address => {
      const chitFund = ChitFund(address);

      return {
        header: address,
        fluid: true,
        description: (
          <Link route={`/fund/${address}`}>
            <a>View Chit Fund</a>
          </Link>
        )
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Latest Funds</h3>
          <Link route="/fund/new">
            <a>
              <Button
                floated="right"
                content="Create a Fund"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          {this.renderFunds()}
        </div>
      </Layout>
    );
  }
}

export default ChitFundIndex;
