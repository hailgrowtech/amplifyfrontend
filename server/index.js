const express = require("express");
const cors = require("cors");
const axios = require("axios");
const sha256 = require("sha256");
const uniqid = require("uniqid");

const app = express();

const MERCHANT_ID = "PGTESTPAYUAT69";
const PHONE_PE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox";
const SALT_INDEX = 1;
const SALT_KEY = "f23f3fc9-f7ca-455f-9fb3-8bd124642fdf";
const APP_BE_URL = "http://localhost:8000";

app.use(cors());
app.use(express.json());

app.post("/pay", async function (req, res, next) {
  try {
    const merchantTransactionId = req.body.transactionId;
    const data = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      name: req.body.name,
      amount: req.body.amount * 100,
      redirectMode: "POST",
      mobileNumber: req.body.number,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
      callBackUrl: `${APP_BE_URL}/payment/callback/${merchantTransactionId}`,
    };
    const bufferObj = Buffer.from(JSON.stringify(data), "utf8");
    const base64EncodedPayload = bufferObj.toString("base64");
    const string = base64EncodedPayload + "/pg/v1/pay" + SALT_KEY;
    const sha256_val = sha256(string);
    const xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    const response = await axios.post(
      `${PHONE_PE_HOST_URL}/pg/v1/pay`,
      {
        request: base64EncodedPayload,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": xVerifyChecksum,
          accept: "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/payment/callback/:merchantTransactionId", async function (req, res) {
  try {
    const { merchantTransactionId } = req.params;
    if (!merchantTransactionId) {
      throw new Error("Merchant transaction ID is required.");
    }

    const statusUrl =
      `${PHONE_PE_HOST_URL}/pg/v1/status/${MERCHANT_ID}/` +
      merchantTransactionId;
    const string =
      `/pg/v1/status/${MERCHANT_ID}/` + merchantTransactionId + SALT_KEY;
    const sha256_val = sha256(string);
    const xVerifyChecksum = sha256_val + "###" + SALT_INDEX;

    const response = await axios.get(statusUrl, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": xVerifyChecksum,
        accept: "application/json",
      },
    });
    console.log(response)
    const paymentStatus = response.data.data.status;

    if (paymentStatus === "SUCCESS") {
      // Redirect or respond for a successful payment
      res.json({
        success: true,
        message: "Payment successful",
        transactionId: merchantTransactionId,
        details: response.data.data,
      });
    } else {
      // Handle different statuses appropriately
      res.json({
        success: false,
        message: "Payment failed",
        status: paymentStatus,
        transactionId: merchantTransactionId,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 8000;
app.listen(port, () => {
  console.log(`PhonePe application listening on port ${port}`);
});
