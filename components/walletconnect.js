import React, { Component } from "react";
import {
  Button,
  Portal,
  Segment,
  Image,
  Menu,
  Header,
  Icon,
} from "semantic-ui-react";
import styles from "./styles/walletconnect.module.css";
import provider from "../BSC/provider";
import { isMobile } from "react-device-detect";
import router from "next/router";

class WalletConnect extends Component {
  state = {
    isLoading: false,
    portal: false,
    isConnected: false,
    checkDevice: false,
  };

  componentDidMount = async () => {
    this.setState({
      isConnected: localStorage.getItem("isConnected") || false,
      checkDevice: isMobile,
    });

    if (localStorage.getItem("isConnected" && "wcConnected")) {
      provider.enable();
    } //reconnect to provider@walletconnect
  };

  SwitchConnectButton = () => {
    if (this.state.checkDevice) {
      return (
        <Icon
          name={this.switchButtonName()}
          size="large"
          onClick={this.handleLogin}
        />
      );
    }
    {
      return (
        <Button
          loading={this.state.isLoading}
          content={this.switchButtonName()}
          //primary={this.state.isConnected ? false : true}
          secondary //{this.state.isConnected ? true : false}
          onClick={this.handleLogin}
        />
      );
    }
  };

  switchButtonName() {
    if (this.state.isConnected) {
      return isMobile ? "sign-out" : "Disconnect";
    } else {
      return isMobile ? "sign-in" : "Connect Wallet";
    }
  }

  switchClass() {
    if (!isMobile) {
      return styles.portalmenu;
    }
    {
      return styles.mobileportalmenu;
    }
  }

  handleLogin = () => {
    if (!this.state.isConnected) {
      this.setState({ portal: true, isLoading: true });
      this.props.mmnotFound(false);
    } else {
      this.setState({ isConnected: false });
      this.props.handleDisconnect();
      if (localStorage.getItem("wcConnected")) {
        provider.disconnect();
      }
      localStorage.removeItem("isConnected");
      localStorage.removeItem("wcConnected");
      localStorage.removeItem("mmConnected");
      localStorage.removeItem("getProvider");
      this.props.getConnection("");
    }
  };

  handleClose = () => {
    this.setState({ portal: false, isLoading: false });
  };

  handleWalletConnect = async () => {
    try {
      await provider.enable();
      localStorage.setItem("isConnected", true);
      localStorage.setItem("wcConnected", true);
      this.setState({ isConnected: true });
    } catch (err) {
      console.log(err.message);
      router.reload("/");
    }
    this.setState({ portal: false, isLoading: false });
    this.state.isConnected
      ? this.props.getConnection("wc")
      : this.props.getConnection("");
  };

  handleMetaMask = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      localStorage.setItem("isConnected", true);
      localStorage.setItem("mmConnected", true);
      this.setState({ isConnected: true });
      this.props.handleMMConnect();
    } catch (err) {
      if (window.ethereum == undefined) {
        this.props.mmnotFound(true);
      }
    }
    this.setState({ portal: false, isLoading: false });
    this.state.isConnected
      ? this.props.getConnection("mm")
      : this.props.getConnection("");
  };

  render() {
    return (
      <div>
        {
          this.SwitchConnectButton() //<SwitchConnectButton />
        }
        <Portal open={this.state.portal} onClose={this.handleClose}>
          <div>
            <div className={styles.dimmer} />
            <Segment as={Menu} vertical className={this.switchClass()}>
              {/* MetaMask Button */}
              <Menu.Item
                as="a"
                onClick={this.handleMetaMask}
                className={styles.menuitem}
              >
                <Header
                  as="h2"
                  icon
                  textAlign="center"
                  className={styles.metamask}
                >
                  <Image src="MetamaskLogo.png" />
                  <Header.Content>
                    MetaMask
                    <Header.Subheader>
                      Connect to MetaMask on Desktop.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Menu.Item>
              {/* WalletConnect Button */}
              <Menu.Item
                as="a"
                onClick={this.handleWalletConnect}
                className={styles.menuitem}
              >
                <Header
                  as="h2"
                  icon
                  textAlign="center"
                  className={styles.walletconnect}
                >
                  <Image src="WalletconnectLogo.png" />
                  <Header.Content>
                    WalletConnect
                    <Header.Subheader>
                      Connect through WalletConnect.
                    </Header.Subheader>
                  </Header.Content>
                </Header>
              </Menu.Item>
            </Segment>
          </div>
        </Portal>
      </div>
    );
  }
}

export default WalletConnect;
