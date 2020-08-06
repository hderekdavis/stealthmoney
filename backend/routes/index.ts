var express = require('express');
var router = express.Router();
var cors = require('cors')
var plaid = require('plaid');``
var moment = require('moment');
const http = require('http');

router.use(cors());

import * as _ from 'lodash';
import checkJwt from '../lib/middleware/secured';
import * as queries from '../queries';

const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments.sandbox
});

router.get('/business', checkJwt, async function (req, res, next) {
  var response: any = await queries.getBusiness(1);

  res.json(response);
});

router.post('/access-token', checkJwt, async function (req, res, next) {
  const publicToken = req.body.publicToken;
  const businessId = req.body.businessId;

  const exchangeResponse = await plaidClient.exchangePublicToken(publicToken);
  const accessToken = exchangeResponse.access_token;
  // Save access token to database for this business
  await queries.updateAccessToken(businessId, accessToken);

  res.json({});
});

router.post('/transactions', checkJwt, async function (req, res, next) {
  try{
    // 1. Exchange public token for access token
    const businessId = req.body.businessId;
    const getBusinessResponse: any = await queries.getBusiness(businessId);
    const accessToken = getBusinessResponse.plaidAccessToken;

    // 2. Fetch transactions from Plaid
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const oneYearAgo = now.subtract(365, 'days').format('YYYY-MM-DD');
    const transactionsResponse = await plaidClient.getTransactions(accessToken, oneYearAgo, today);

    // 3. Save transactions to database
    const businessLocationsForBusiness = await queries.getBusinessLocationsForBusiness(businessId);
    const defaultBusinessLocationId = businessLocationsForBusiness[0].businessLocationID; // Temporarily default to user's first business location
    let transactions = await queries.getTransactions(defaultBusinessLocationId);
    const categories = await queries.getCategories();

    transactionsResponse.transactions.forEach(async transaction => {
      const foundTransaction = _.find(transactions, { 'amount': transaction.amount, 'date': transaction.date, 'name': transaction.name });

      if (!foundTransaction) {
        // Find transaction category
        const category = _.find(categories, ['plaidCategoryID', Number(transaction.category_id)]);

        if (transaction.amount < 0) {
          // Negative transactions are income: https://support.plaid.com/hc/en-us/articles/360008413653-Negative-transaction-amount
          category.categoryID = 43;
        }

        // Insert transaction into database
        await queries.saveTransaction(defaultBusinessLocationId, transaction.name, category.categoryID, transaction.amount, transaction.date);
      }
    });

    // 4. Return transactions in response
    let latestTransactions = await queries.getTransactions(defaultBusinessLocationId);
    latestTransactions = latestTransactions.map(transaction => {
      return {
        type: transaction.type.toLowerCase(),
        amount: transaction.amount,
        name: transaction.name,
        category: transaction.account,
        categoryId: transaction.categoryID
      };
    });

    res.json(latestTransactions);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.post('/expense-category', checkJwt, async function (req, res, next) {
  try{
    const categoryId = req.body.categoryId;
    const businessId = req.body.businessId;
    const businessLocationsForBusiness = await queries.getBusinessLocationsForBusiness(businessId);
    const defaultBusinessLocationId = businessLocationsForBusiness[0].businessLocationID; // Temporarily default to user's first business location

    let latestTransactions = await queries.getTransactions(defaultBusinessLocationId);
    latestTransactions = latestTransactions.filter(transaction => transaction.categoryID === Number(categoryId));

    latestTransactions = latestTransactions.map(transaction => {
      return {
        type: transaction.type.toLowerCase(),
        amount: transaction.amount,
        name: transaction.name,
        category: transaction.account,
        categoryId: transaction.categoryID,
        transactionId: transaction.transactionID
      };
    });

    res.json(latestTransactions);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.post('/business', checkJwt, async function (req, res, next) {
  try {
    const email = req.body.email;
    const businessName = req.body.businessName;
    const phoneNumber = req.body.phoneNumber;
    const legalEntity = req.body.legalEntity;
    const addresses = req.body.addresses;
    var response: any = await queries.saveBusiness(email, businessName, phoneNumber, legalEntity);

    for (const address of addresses) {
      await queries.saveBusinessLocation(response.insertId, address.addressFirstLine, address.addressSecondLine,
        address.city, address.state, address.zipcode, address.businessVertical);
    }

    res.json({businessId: response.insertId});
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.get('/business/settings', checkJwt, async function (req, res, next) {
  try {
    const businessEmail = req.body.user_email;
    const business = await queries.getBusinessByEmail(businessEmail);
    const addresses = await queries.getBusinessLocationsForBusiness(business.businessID);
    
    res.json({
      business: business,
      addresses: addresses
    });
  } catch(error) {
    console.log(error);

    res.json(error);
  }
})

router.get('/business', checkJwt, async function (req, res, next) {
  const email = req.user_email;
  const response = await queries.getBusinessByEmail(email);

  res.json(response);
});

router.post('/business/settings', checkJwt, async function (req, res, next) {

  const businessID = parseInt(req.body.businessID);
  const email = req.body.email;
  const businessName = req.body.businessName;
  const phoneNumber = req.body.phoneNumber;
  const legalEntity = req.body.legalEntity;
  const addresses = req.body.addresses;
  const password = req.body.password;
  const response = await queries.updateBusiness(businessID, email, businessName, phoneNumber, legalEntity, password);

  res.json(response);

});

module.exports = router;
