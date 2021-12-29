import React, { Component } from "react";
import { Icon, Menu, Image, Input, Header } from "semantic-ui-react";
import provider from "../BSC/provider";
import WalletConnect from "./walletconnect";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import styles from "./styles/menu.module.css";
import router from "next/router";

class MenuComponent extends Component {
  state = {
    checkDevice: false,
    getProvider: "",
  };

  componentDidMount = () => {
    if (isMobile) {
      this.setState({ checkDevice: isMobile });
    }
  };

  componentDidUpdate = () => {
    if (this.state.getProvider == "") {
      if (localStorage.getItem("getProvider") != "") {
        this.setState({ getProvider: localStorage.getItem("getProvider") });
      }
    }
  };

  showStatus = () => {
    try {
      if (this.state.getProvider === "mm") {
        return (
          "Connected: " +
          window.ethereum.selectedAddress.slice(0, 6) +
          "..." +
          window.ethereum.selectedAddress.slice(38)
        );
      }
      if (this.state.getProvider === "wc") {
        return (
          "Connected: " +
          provider.accounts[0].slice(0, 6) +
          "..." +
          provider.accounts[0].slice(38)
        );
      }
    } catch (err) {
      console.log(err);
      localStorage.removeItem("isConnected");
      localStorage.removeItem("wcConnected");
      localStorage.removeItem("mmConnected");
      localStorage.removeItem("getProvider");
      router.reload("/");
    }
  };

  getConnection = (provider) => {
    localStorage.setItem("getProvider", provider);
    this.setState({ getProvider: provider });
  };

  render() {
    return (
      <Menu borderless size="massive" fixed="top" className={styles.mainMenu}>
        <Menu.Item
          icon
          active={this.props.active}
          onClick={this.props.toggleSidebar}
          className={styles.sidebarButton}
        >
          <Icon name="sidebar" size="large" inverted color="grey" />
        </Menu.Item>

        <Menu.Item
          fitted="vertically" /* style={{ display: this.state.hideLogo }} */
        >
          <Image src="/Logowhite.png" size="small" />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item
            style={{
              color: "#fefefe",
              display: this.state.checkDevice ? "none" : "",
            }}
          >
            {this.showStatus()}
          </Menu.Item>
          <Menu.Item>
            <WalletConnect
              getConnection={this.getConnection}
              handleMMConnect={this.props.handleMMConnect}
              handleDisconnect={this.props.handleDisconnect}
              mmnotFound={this.props.mmnotFound}
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default MenuComponent;
