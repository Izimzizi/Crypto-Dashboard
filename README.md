# Crypto Dashboard v0.1

basic Dashboard setup for shitcoins.

## Install Dependencies

`npm install`

## Project Setup

1. replace `../BSC/abi.json` with new token ABI.
2. change `../components/config/conf.json` according to your needs.

```
{
    .
    .
    .
  "decimal": "gwei",
  ==>> change value according to token Decimal : 9=gwei 18=ether
    .
    .
    .
}
```

3. May need to change function calls to match new token, at

```
   index.js:67
   index.js:178
   index.js:180
```
