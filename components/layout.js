import React, { Component } from "react";
import SidebarComponent from "./sidebar";
import MenuComponent from "./menu";
import "semantic-ui-css/semantic.min.css";
import { isMobile } from "react-device-detect";
import Head from "next/head";

const { title } = require("./config/conf.json");

class Layout extends Component {
  state = {
    width: "very thin",
    isCompact: true,
    rotateIcon: "arrow alternate circle down",
    toggle: false,
    toggleMobile: true,
    active: false,
  };

  componentDidMount() {
    isMobile ? this.setState({ toggleMobile: false, width: "thin" }) : "";
  }

  toggleSidebar = () => {
    if (isMobile) {
      this.setState({ toggleMobile: !this.state.toggleMobile });
    }
    {
      this.state.width == "very thin"
        ? this.setState({ width: "thin" })
        : this.setState({ width: "very thin" });
      this.setState({
        isCompact: !this.state.isCompact,
        active: !this.state.active,
      });
    }
  };

  hideSidebar = () => {
    isMobile
      ? this.setState({
          width: "very thin",
          toggleMobile: false,
          isCompact: true,
          toggle: false,
          active: false,
        })
      : this.setState({
          width: "very thin",
          isCompact: true,
          rotateIcon: "arrow alternate circle down",
          toggle: false,
          active: false,
        });
  };

  openMenu = () => {
    this.setState({ toggle: !this.state.toggle });
    this.state.rotateIcon == "arrow alternate circle down"
      ? this.setState({ rotateIcon: "arrow alternate circle right" })
      : this.setState({ rotateIcon: "arrow alternate circle down" });
  };

  render() {
    return (
      <div>
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />
          <title>{title}</title>
        </Head>
        <MenuComponent
          toggleSidebar={this.toggleSidebar}
          active={this.state.active}
          handleMMConnect={this.props.handleMMConnect}
          handleDisconnect={this.props.handleDisconnect}
          mmnotFound={this.props.mmnotFound}
        />
        <SidebarComponent
          toggleMobile={this.state.toggleMobile}
          isCompact={this.state.isCompact}
          width={this.state.width}
          rotateIcon={this.state.rotateIcon}
          toggle={this.state.toggle}
          hideSidebar={this.hideSidebar}
          openMenu={this.openMenu}
          content={this.props.children}
        />
      </div>
    );
  }
}

export default Layout;
