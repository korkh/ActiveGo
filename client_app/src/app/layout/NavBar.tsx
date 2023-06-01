import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "./stores/store";

const NavBar = () => {
  const { activityStore } = useStore();

  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Uniactivities
        </Menu.Item>
        <Menu.Item name="Activities" />
        <Menu.Item name="Activities">
          <Button
            onClick={() => activityStore.openForm()}
            positive
            content="Create ACtivity"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default NavBar;
