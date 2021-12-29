import WalletConnectProvider from "@walletconnect/web3-provider";

const provider = new WalletConnectProvider({
  rpc: { 56: "https://bsc-dataseed.binance.org/" },
  chainId: 56,
});

export default provider;
