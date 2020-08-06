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

  console.log(response);

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
    console.log(businessEmail);
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
