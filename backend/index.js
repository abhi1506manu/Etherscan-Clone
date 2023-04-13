const express = require("express");
const app = express();
const port = 5000;
const Moralis = require("moralis").default;
const cors = require("cors");

require("dotenv").config({ path: ".env" });

app.use(cors());
app.use(express.json());
const MORALIS_API_KEY = process.env.API_KEY;

//getting price
app.get("/getetherprice", async (req, res) => {
  try {
    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      chain: "0x1",
    });
    // console.log(response.toJSON());
    return res.status(200).json(response);
  } catch (error) {
    console.log(`Somthing went wrong ${error}`);
    return res.status(400).json();
  }
});

//getblockInformtion
app.get("/blockinfo", async (req, res) => {
  try {
    const latestBlock = await Moralis.EvmApi.block.getDateToBlock({
      date: Date.now(),
      chain: "0x1",
    });
    let blockNrOrParentHash = latestBlock.toJSON().block;
    let previousBlockInfo = [];

    for (let i = 0; i < 5; i++) {
      const previousBlockNrs = await Moralis.EvmApi.block.getBlock({
        chain: "0x1",
        blockNumberOrHash: blockNrOrParentHash,
      });
      blockNrOrParentHash = previousBlockNrs.toJSON().parent_hash;
      if (i == 0) {
        previousBlockInfo.push({
          transactions: previousBlockNrs.toJSON().transactions.map((i) => {
            return {
              transactionHash: i.hash,
              time: i.block_timestamp,
              fromAddress: i.from_address,
              toAddress: i.to_address,
              value: i.value,
            };
          }),
        });
      }
      previousBlockInfo.push({
        blockNumber: previousBlockNrs.toJSON.number,
        totalTransactions: previousBlockNrs.toJSON().transaction_count,
        gasUsed: previousBlockNrs.toJSON().gas_used,
        miner: previousBlockNrs.toJSON().miner,
        time: previousBlockNrs.toJSON().timestamp,
      });
    }
    const response = {
      latestBlock: latestBlock.toJSON().block,
      previousBlockInfo,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.log(`Somthing went wrong ${error}`);
    return res.status(400).json();
  }
});

//getTransaction
app.get("/address", async (req, res) => {
  try {
    const { query } = req;
    // const address = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
    const chain = "0x1";
    // console.log(` I am query${query}`)
    // console.log(query);

    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address: query.address,
        chain,
      });

    return res.status(200).json(response);
  } catch (error) {
    console.log(`Somthing went wrong ${error}`);
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log("Listening for port 5000");
  });
});
