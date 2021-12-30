import React, { Component, createRef } from "react";
import { isMobile } from "react-device-detect";
import { Icon, Menu, Sidebar, Divider, Ref, Image } from "semantic-ui-react";
import styles from "./styles/sidebar.module.css";

const { website, twitter, telegram } = require("./config/conf.json");

class SwitchMenu extends Component {
  render() {
    return this.props.isCompact ? (
      <div>
        <Menu.Item link href="/">
          <Icon name="home" inverted color="grey" />
        </Menu.Item>

        <Menu.Item link href={website}>
          <Icon name="world" inverted color="grey" />
        </Menu.Item>
        <Divider />
        <Menu.Item as="a" onClick={this.props.openMenu}>
          <Icon name={this.props.rotateIcon} inverted color="grey" />
        </Menu.Item>

        <Sidebar
          as={Menu.Item}
          animation="overlay"
          direction="left"
          icon
          fitted
          visible={this.props.toggle}
          width="very thin"
          style={{ boxShadow: "none" }}
        >
          <Menu.Item link target="_blank" href={twitter}>
            <Icon name="twitter" inverted color="grey" />
          </Menu.Item>
          <Menu.Item link target="_blank" href={telegram}>
            <Icon name="telegram" inverted color="grey" />
          </Menu.Item>
        </Sidebar>
      </div>
    ) : (
      <div>
        <Menu.Item link href="/" style={{ color: "#fefefe" }}>
          Dashboard
        </Menu.Item>
        <Menu.Item link href={website} style={{ color: "#fefefe" }}>
          Website
        </Menu.Item>
        <Divider />
        <Menu.Item
          as="a"
          onClick={this.props.openMenu}
          style={{ color: "#fefefe" }}
        >
          Socials
        </Menu.Item>
        <Sidebar
          as={Menu.Item}
          animation="overlay"
          direction="left"
          icon
          width="thin"
          fitted
          visible={this.props.toggle}
          style={{ boxShadow: "none" }}
        >
          <Menu.Item
            link
            target="_blank"
            href={twitter}
            style={{ color: "#fefefe" }}
          >
            Twitter
          </Menu.Item>
          <Menu.Item
            link
            target="_blank"
            href={telegram}
            style={{ color: "#fefefe" }}
          >
            Telegram
          </Menu.Item>
        </Sidebar>
      </div>
    );
  }
}

class SidebarComponent extends Component {
  state = {
    myRef: createRef(),
    width: "",
    animation: "push",
    mobileWidth: "100%",
    calcWidth: "",
  };

  componentDidMount() {
    isMobile
      ? this.setState({
          animation: "overlay",
          calcWidth: this.state.mobileWidth,
        })
      : this.setState({ animation: "push", calcWidth: this.setMinWidth() });
  }

  setMinWidth = () => {
    if (this.props.isCompact == true) {
      return "calc(100% - 60px)";
    } else {
      return "calc(100% - 150px)";
    }
  };

  toggleMobileLogo = () => {
    if (this.props.isCompact || !isMobile) {
      return "none";
    } else {
      return "";
    }
  };

  render() {
    return (
      <Sidebar.Pushable className={styles.pushable}>
        <Sidebar
          as={Menu}
          animation={this.state.animation}
          icon
          vertical
          size="massive"
          onHide={this.props.hideSidebar}
          target={this.state.myRef}
          visible={this.props.toggleMobile}
          borderless
          width={this.props.width}
          className={styles.sidebar}
        >
          <SwitchMenu
            isCompact={this.props.isCompact}
            toggle={this.props.toggle}
            rotateIcon={this.props.rotateIcon}
            openMenu={this.props.openMenu}
          />
          {/*      <Menu.Item
            fitted="horizontally"
            style={{
              display: this.toggleMobileLogo(),
              position: "fixed",
              bottom: "50px",
              padding: "10%",
            }}
          >
            <Image src="/logo.png" />
          </Menu.Item> */}
        </Sidebar>
        <Ref innerRef={this.state.myRef}>
          <Sidebar.Pusher
            style={{
              maxWidth: this.state.calcWidth,
              minWidth: this.setMinWidth(), //this.state.calcWidth,
            }}
            className={styles.pusher}
          >
            {this.props.content}
          </Sidebar.Pusher>
        </Ref>
      </Sidebar.Pushable>
    );
  }
}

export default SidebarComponent;
