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
      address:"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      chain:"0x1",
    });
    console.log(response.toJSON())
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
    console.log(query)

    const response =
      await Moralis.EvmApi.transaction.getWalletTransactionsVerbose({
        address:query.address,
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
