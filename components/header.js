import React from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "../routes";

export default () => {
  return (
    <Menu style={{ marginTop: 10 + "px" }}>
      <Link route="/">
        <a>
          <Menu.Item>Chit Fund</Menu.Item>
        </a>
      </Link>
      <Menu.Menu position="right">
        <Menu.Item>Funds</Menu.Item>
        <Menu.Item>+</Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};
