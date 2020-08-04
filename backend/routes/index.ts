var express = require('express');
var router = express.Router();
var cors = require('cors')
var plaid = require('plaid');
var moment = require('moment');
router.use(cors());

import * as _ from 'lodash';

import * as queries from '../queries';

const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox
});

router.get('/business', async function (req, res, next) {
  var response: any = await queries.getBusiness(1);

  console.log(response);

  res.json({});
});

router.post('/access-token', async function (req, res, next) {
  const publicToken = req.body.publicToken;
  const businessId = req.body.businessId;

  const exchangeResponse = await plaidClient.exchangePublicToken(publicToken);
  const accessToken = exchangeResponse.access_token;
  // Save access token to database for this business
  await queries.updateAccessToken(businessId, accessToken);

  res.json({});
});

router.post('/transactions', async function (req, res, next) {
  try{
    // Exchange public token for access token
    const businessId = req.body.businessId;
    
    // Fetch accessToken from database
    const getBusinessResponse: any = await queries.getBusiness(businessId);
    const accessToken = getBusinessResponse.plaidAccessToken;

    // Fetch transactions from Plaid
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const oneYearAgo = now.subtract(365, 'days').format('YYYY-MM-DD');

    const transactionsResponse = await plaidClient.getTransactions(accessToken, oneYearAgo, today);

    // Save transactions to database
    // Temporarily default to user's only business location
    // Get all current transactions from database and see which transactions are new
    // TODO:

    // Fetch each transaction's mapped category
    const categoryResponse = await queries.getCategories();

    console.log(JSON.stringify(categoryResponse, null, 2));

    // Return transactions in response
    const response = [];
    transactionsResponse.transactions.forEach(transaction => {
      console.log(transaction)
      const category = _.find(categoryResponse, ['plaidCategoryID', Number(transaction.category_id)]);
      console.log(category);
  
      response.push({
        type: transaction.amount < 0 ? 'income' : 'expense', // Negative transactions are income: https://support.plaid.com/hc/en-us/articles/360008413653-Negative-transaction-amount
        amount: transaction.amount,
        name: transaction.name,
        category: category.name
      });
    });
    res.json(response);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

module.exports = router;
