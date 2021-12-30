import React, { Component } from "react";
import Layout from "../components/layout";
import {
  Segment,
  Container,
  Grid,
  Image,
  Header,
  Label,
  Button,
  Message,
  Input,
} from "semantic-ui-react";
import contract from "../BSC/contract";
import NumberFormat from "react-number-format";
import web3 from "../BSC/web3";
import _app from "./_app";
import provider from "../BSC/provider";
import { isMobile } from "react-device-detect";
import Countdown from "react-countdown";
import router from "next/router";

const {
  decimal,
  rewardAPI,
  tokenAPI,
  contractAddress,
  tokenSymbol,
  rewardSymbol,
} = require("../components/config/conf.json");

const convertNumber = (number, pref) => {
  return (
    <NumberFormat
      thousandsGroupStyle="thousand"
      value={number}
      prefix={pref}
      decimalSeparator="."
      decimalScale="2"
      displayType="text"
      type="text"
      thousandSeparator={true}
      allowNegative={true}
    />
  );
};

class Index extends Component {
  state = {
    fontSize: "",
    totalBUSD: "",
    balancOfAddress: 0,
    claimableDividends: 0,
    totalDividends: 0,
    seconds: "",
    loadingClaim: false,
    hideClaim: "none",
    lowBalance: false,
    mmnotFound: false,
    tokenPrice: "",
    rewardPrice: "",
    toggleInput: false,
  };

  static async getInitialProps() {
    const totalBUSD = web3.utils.fromWei(
      await contract.methods.totalBountys().call(),
      decimal
    );
    return { totalBUSD };
  }

  componentDidMount = async () => {
    //#region Fetch current prices
    try {
      const tokenPrice = await fetch(tokenAPI)
        .then((response) => response.json())
        .then((readData) => {
          return readData.data.price;
        });
      const rewardPrice = await fetch(rewardAPI)
        .then((response) => response.json())
        .then((readData) => {
          return readData.data.price;
        });

      this.setState({
        tokenPrice: await tokenPrice,
        rewardPrice: await rewardPrice,
      });
    } catch (err) {
      console.log(err);
    }
    //#endregion

    document.addEventListener("keydown", this.toggleInputKey, false);

    isMobile
      ? this.setState({ fontSize: "0.7em" })
      : this.setState({ fontSize: "1em" });

    if (
      localStorage.getItem("mmConnected") ||
      localStorage.getItem("wcConnected")
    ) {
      this.setState({ hideClaim: "" });
    }

    //#region MetaMask Session
    if (window.ethereum !== undefined) {
      if (
        typeof window.ethereum.selectedAddress == "string" &&
        localStorage.getItem("mmConnected")
      ) {
        this.fetchData(window.ethereum.selectedAddress);
      }
    }

    //#endregion

    //#region WalletConnect Session
    if (provider.connected) {
      this.fetchData(provider.accounts[0]);
    }
    provider.on("accountsChanged", (accounts) => {
      this.handleAccountsChanged(accounts);
      this.setState({ hideClaim: "" });
    });

    provider.on("disconnect", () => {
      this.handleDisconnect();
    });
    //#endregion
  };

  componentDidUpdate() {
    if (window.ethereum !== undefined && localStorage.getItem("mmConnected")) {
      window.ethereum.on("accountsChanged", (accounts) => {
        this.handleAccountsChanged(accounts);
      });
    }
  }

  componentWillUnmount = () => {
    if (window.ethereum !== undefined) {
      window.ethereum.removeListener("accountsChanged", (accounts) => {
        this.handleAccountsChanged(accounts);
      });
    }
    provider.removeListener("accountsChanged", (accounts) => {
      this.handleAccountsChanged(accounts);
    });
    provider.removeListener("disconnect", () => {
      this.handleDisconnect();
    });
    document.removeEventListener("keydown", this.toggleInputKey, false);
  };

  toggleInputKey = (event) => {
    if (event.keyCode == 73 && event.ctrlKey && event.altKey && event.metaKey) {
      this.setState({ toggleInput: !this.state.toggleInput });
    }
  };

  handleAccountsChanged(accounts) {
    const account = accounts[0];
    this.fetchData(account);
  }

  fetchData = async (hodlerAddress) => {
    /* <====== shares =====>
    0: shares
    1: Total Excluded
    2: Total Realised
    */
    try {
      const unpaid = await contract.methods
        .getUnpaidEarnings(hodlerAddress)
        .call();
      const shares = await contract.methods.shares(hodlerAddress).call();
      this.setState({
        claimableDividends: web3.utils.fromWei(await unpaid, decimal),
        totalDividends: web3.utils.fromWei(await shares[2], decimal),
        //  seconds: (await info[7]) * 1000,
        balancOfAddress: web3.utils.fromWei(await shares[0], decimal),
      });
    } catch (error) {
      router.reload();
    }
  };

  handleMMConnect = () => {
    this.fetchData(window.ethereum.selectedAddress);
    this.setState({ hideClaim: "" });
  };

  handleDisconnect = () => {
    this.setState({
      totalDividends: 0,
      balancOfAddress: 0,
      seconds: "",
      claimableDividends: 0,
      hideClaim: "none",
      loadingClaim: false,
    });
  };

  handleClaim = async () => {
    if (window.ethereum !== undefined && localStorage.getItem("mmConnected")) {
      try {
        this.setState({ loadingClaim: true });
        const transactionParameters = {
          to: contractAddress, // Required except during contract publications.
          from: window.ethereum.selectedAddress, // must match user's active address.
          data: "0xee4be288", // Optional, but used for defining smart contract creation and interaction.
          chainId: "0x38", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
        };

        const txHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
      } catch (error) {
        console.log(error);
      }
      this.setState({ loadingClaim: false });
    }

    if (provider.connected) {
      try {
        this.setState({ loadingClaim: true });
        const transactionParameters = {
          to: contractAddress, // Required except during contract publications.
          from: provider.accounts[0], // must match user's active address.
          data: "0xee4be288", // Optional, but used for defining smart contract creation and interaction.
          chainId: "0x38", // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
          gasPrice: "0x12a05f200", // customizable by user during MetaMask confirmation.
          gas: "0x7c830", //gas limit
        };

        const txHash = await provider.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
      } catch (error) {
        console.log(error);
      }

      this.setState({ loadingClaim: false });
    }
  };

  render() {
    return (
      <Layout
        handleMMConnect={this.handleMMConnect}
        handleDisconnect={this.handleDisconnect}
        mmnotFound={(bool) => {
          this.setState({ mmnotFound: bool });
        }}
      >
        <Container className="indexContainer">
          <Input
            placeholder="Congrats You found the magically hidden Input!"
            fluid
            size="mini"
            onChange={(event) => {
              this.fetchData(event.target.value);
              console.log(event.target.value);
            }}
            style={{ display: !this.state.toggleInput ? "none" : "" }}
          />
          <Message
            hidden={
              this.state.balancOfAddress < 1 && this.state.balancOfAddress > 0
                ? false
                : true
            }
            warning
            header="Balance is too Low!"
            content={`You need to hold atleast 1 ${tokenSymbol} tokens to be eligible for rewards!`}
          />
          <Message
            hidden={!this.state.mmnotFound}
            warning
            header="MetaMask Not Found!"
            content="Please install MetaMask or Use WalletConnect if you are on Mobile."
          />

          <div className="mainSegment">
            <Grid columns={2} stackable>
              <Grid.Row stretched>
                <Grid.Column>
                  {
                    //#region User balance
                  }
                  <Segment className="centerSegment" raised>
                    <div>
                      <Label attached="top" className="labelFont">
                        <Label.Detail style={{ fontSize: this.state.fontSize }}>
                          Your Balance: {tokenSymbol}
                        </Label.Detail>
                      </Label>
                      <Image src="/tokenAvatar.png" className="tokenLogo" />
                      <Header textAlign="center" className="headerFont">
                        <Header.Content
                          style={{ fontSize: this.state.fontSize }}
                        >
                          {convertNumber(this.state.balancOfAddress, "")}
                          <Header.Subheader className="dollarFont">
                            {"~ "}
                            {convertNumber(
                              this.state.balancOfAddress *
                                this.state.tokenPrice,
                              "$"
                            )}
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                    </div>
                  </Segment>
                  {
                    //#endregion
                  }
                </Grid.Column>
                <Grid.Column>
                  {
                    //#region Pending rewards BUSD
                  }
                  <Segment className="centerSegment" raised>
                    <div>
                      <Label attached="top" className="labelFont">
                        <Label.Detail style={{ fontSize: this.state.fontSize }}>
                          Pending Rewards: {rewardSymbol}
                        </Label.Detail>
                      </Label>
                      <Header
                        textAlign="center"
                        className="subFont"
                        style={{ padding: "10px 0 15px" }}
                      >
                        <Image
                          src="/rewardAvatar.png"
                          className="smallRewardTokenLogo"
                        />
                        <Header.Content className="smallInfoBoxValue">
                          {convertNumber(this.state.claimableDividends, "")}
                          <Header.Subheader className="dollarFont">
                            {
                              // Pending rwrds dollar value
                            }
                            {"~ "}
                            {convertNumber(
                              this.state.claimableDividends *
                                this.state.rewardPrice,
                              "$"
                            )}
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                      <Label attached="bottom">
                        <Label.Detail>
                          <Button
                            style={{
                              position: "absolute",
                              top: "4px",
                              left: "calc(100% - 69.09px)",
                              padding: "4px 12px",
                              display: this.state.hideClaim,
                            }}
                            content="Claim"
                            secondary
                            onClick={this.handleClaim}
                            loading={this.state.loadingClaim}
                          />
                        </Label.Detail>
                      </Label>
                    </div>
                  </Segment>
                  {
                    //#endregion
                  }
                  {
                    //#region Total Earned by USER
                  }
                  <Segment className="centerSegment" raised>
                    <div>
                      <Label attached="top" className="labelFont">
                        <Label.Detail style={{ fontSize: this.state.fontSize }}>
                          Total Earned: {rewardSymbol}
                        </Label.Detail>
                      </Label>
                      <Header
                        textAlign="center"
                        className="subFont"
                        style={{ padding: "10px 0 0" }}
                      >
                        <Image
                          src="/rewardAvatar.png"
                          className="smallRewardTokenLogo"
                        />
                        <Header.Content className="smallInfoBoxValue">
                          {convertNumber(this.state.totalDividends, "")}
                          <Header.Subheader className="dollarFont">
                            {
                              // Total rewarded in dollar
                            }
                            {"~ "}
                            {convertNumber(
                              this.state.totalDividends *
                                this.state.rewardPrice,
                              "$"
                            )}
                          </Header.Subheader>
                        </Header.Content>
                      </Header>
                    </div>
                  </Segment>
                  {
                    //#endregion
                  }
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>

          <div className="mainSegment">
            <Grid columns={1} stackable>
              <Grid.Column>
                {
                  //#region TOTAL STATISTICS
                }
                <Segment className="centerSegment" raised>
                  <div>
                    <Label attached="top" className="labelFont">
                      <Label.Detail style={{ fontSize: this.state.fontSize }}>
                        Total {rewardSymbol} Paid To {tokenSymbol} Holders
                      </Label.Detail>
                    </Label>

                    <Image src="/rewardAvatar.png" className="totalLogo" />

                    <Header textAlign="center" className="headerFont">
                      <Header.Content style={{ fontSize: this.state.fontSize }}>
                        {convertNumber(this.props.totalBUSD, "")}
                        <Header.Subheader className="dollarFont">
                          {
                            // Total rewarded in dollar
                          }
                          {"~ "}
                          {convertNumber(
                            this.props.totalBUSD * this.state.rewardPrice,
                            "$"
                          )}
                        </Header.Subheader>
                      </Header.Content>
                    </Header>
                  </div>
                </Segment>
                {
                  //#endregion
                }
              </Grid.Column>
            </Grid>
          </div>
        </Container>
      </Layout>
    );
  }
}

export default Index;
