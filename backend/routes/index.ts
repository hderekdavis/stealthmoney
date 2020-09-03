var express = require('express');
var router = express.Router();
var cors = require('cors')
var plaid = require('plaid');``
var moment = require('moment');

router.use(cors());

import * as _ from 'lodash';
import checkJwt from '../lib/middleware/secured';
import * as queries from '../queries';
import { changeUserPassword, getManagementToken, sendResetPasswordLink, decodeIDToken } from '../lib/middleware/userInfo';
import { promises } from 'fs';

const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: process.env.NODE_ENV.toUpperCase() === 'PRODUCTION' ? plaid.environments.production : plaid.environments.sandbox
});

let managementToken = '';

getManagementToken().then(response => managementToken = response);

router.get('/business', decodeIDToken, checkJwt, async function (req, res, next) {
    try {
        const businessEmail = req.body.user_email;
        const business = await queries.getBusinessByEmail(businessEmail);

        res.json(business);
    } catch (error) {
        console.log(error);

        res.json(error);
    }
});

router.post('/access-token', decodeIDToken, checkJwt, async function (req, res, next) {
  const publicToken = req.body.publicToken;
  const email = req.body.user_email;

  const exchangeResponse = await plaidClient.exchangePublicToken(publicToken);
  const accessToken = exchangeResponse.access_token;
  // Save access token to database for this business
  await queries.updateAccessToken(email, accessToken);

  const business: any = await queries.getBusinessLocation(email);
  await queries.dropBusinessTransactions(business.businessLocationID);
  res.json({});
});

router.get('/transactions', decodeIDToken, checkJwt, async function (req, res, next) {
  try{
    // 1. Exchange public token for access token
    const email = req.body.user_email;
    const getBusinessResponse: any = await queries.getBusinessByEmail(email);
    const accessToken = getBusinessResponse.plaidAccessToken;

    // 2. Fetch transactions from Plaid
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const startOfYear = moment().startOf('year').format('YYYY-MM-DD');

    let options = {
      count: 100,
      offset: 0
    };

    let actualCount = options.offset;
    let totalTransactions = options.count; //Just to enter the loop
    const businessLocationsForBusiness = await queries.getBusinessLocation(email);
    const defaultBusinessLocationId = businessLocationsForBusiness.businessLocationID; // Temporarily default to user's first business location
    let newTransactions = [];
    let promises = [];

    while(actualCount < totalTransactions) {
      let transactionsResponse = await plaidClient.getTransactions(accessToken, startOfYear, today, options);
      totalTransactions = transactionsResponse.total_transactions;

      actualCount += options.count;
      options.offset = actualCount;

      // 3. Save transactions to database
      const transactions = await queries.getTransactions(defaultBusinessLocationId);


      for (const transaction of transactionsResponse.transactions) {
        const foundTransaction = _.find(transactions, { 'amount': transaction.amount, 'date': transaction.date, 'name': transaction.name });

        if (!foundTransaction) {
          let promise = new Promise( resolve => {
            let categoryId;
            if (transaction.amount < 0) {
              categoryId = 43;
              newTransactions.push({
                businessLocationID: defaultBusinessLocationId,
                transactionName: transaction.name,
                categoryID: categoryId,
                amount: transaction.amount,
                date: transaction.date
              });
              resolve();
            } else {
              queries.getCategoryForTransaction(transaction.name, defaultBusinessLocationId, businessLocationsForBusiness.vertical, Number(transaction.category_id))
              .then(categoryId => {
                newTransactions.push({
                  businessLocationID: defaultBusinessLocationId,
                  transactionName: transaction.name,
                  categoryID: categoryId,
                  amount: transaction.amount,
                  date: transaction.date
                });
                resolve();
              });
            }
          });
          promises.push(promise);
        }
      }
    }

    // Insert transaction into database
    if (newTransactions.length) {
      await Promise.all(promises);
      await queries.saveTransactions(newTransactions);
    }

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

router.get('/expense-category', decodeIDToken, checkJwt, async function (req, res, next) {
  try{
    const categoryId = req.query.categoryId;
    const email = req.body.user_email;
    const businessLocationsForBusiness = await queries.getBusinessLocation(email);
    const defaultBusinessLocationId = businessLocationsForBusiness.businessLocationID; 

    let latestTransactions = await queries.getTransactions(defaultBusinessLocationId);
    latestTransactions = latestTransactions.filter(transaction => transaction.categoryID === Number(categoryId));

    latestTransactions = latestTransactions.map(transaction => {
      return {
        type: transaction.type.toLowerCase(),
        amount: transaction.amount,
        name: transaction.name,
        category: transaction.account,
        categoryId: transaction.categoryID,
        transactionId: transaction.transactionID,
        date: transaction.date
      };
    });

    res.json(latestTransactions);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.get('/transaction', decodeIDToken, checkJwt, async function (req, res, next) {
  try {
    const transactionId = req.query.transactionId;
    const email = req.body.user_email;
    const businessLocationsForBusiness = await queries.getBusinessLocation(email);
    const defaultBusinessLocationId = businessLocationsForBusiness.businessLocationID;

    let latestTransactions = await queries.getTransactions(defaultBusinessLocationId);
    latestTransactions = latestTransactions.filter(transaction => transaction.transactionID === Number(transactionId));

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

router.get('/income', decodeIDToken, checkJwt, async function (req, res, next) {
  try{
    const email = req.body.user_email;
    const businessLocationsForBusiness = await queries.getBusinessLocation(email);
    const defaultBusinessLocationId = businessLocationsForBusiness.businessLocationID;

    let latestTransactions = await queries.getTransactions(defaultBusinessLocationId);
    latestTransactions = latestTransactions.filter(transaction => transaction.type === 'Income');

    latestTransactions = latestTransactions.map(transaction => {
      return {
        type: transaction.type.toLowerCase(),
        amount: transaction.amount,
        name: transaction.name,
        category: transaction.account,
        categoryId: transaction.categoryID,
        transactionId: transaction.transactionID,
        date: transaction.date
      };
    });

    res.json(latestTransactions);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.post('/business', async function (req, res, next) {
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

router.get('/business/settings', decodeIDToken, checkJwt, async function (req, res, next) {
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

router.get('/business', decodeIDToken, checkJwt, async function (req, res, next) {
  const email = req.user_email;
  const response = await queries.getBusinessByEmail(email);

  res.json(response);
});

router.post('/business/settings', decodeIDToken, checkJwt, async function (req, res, next) {

  const businessID = parseInt(req.body.businessID);
  const email = req.body.email;
  const businessName = req.body.businessName;
  const phoneNumber = req.body.phoneNumber;
  const legalEntity = req.body.legalEntity;
  const addresses = req.body.addresses;
  const password = req.body.password;
  const response = await queries.updateBusiness(businessID, email, businessName, phoneNumber, legalEntity);

  if (password) {
     await changeUserPassword(managementToken, req.body.auth0_user_id, password)
  }
  
  res.json(response)
});

router.post('/reset-password', async function (req, res, next) {

  await sendResetPasswordLink(req.body.email, managementToken)
  
  res.json({});

});

router.get('/transaction-categories', decodeIDToken, checkJwt, async function (req, res, next) {

  const response = await queries.getChartOfAccountsCategories(req.query.vertical);

  res.json(response);

});

router.get('/location', decodeIDToken, checkJwt, async function (req, res, next) {

  const email = req.body.user_email;

  const response = await queries.getBusinessLocation(email);

  res.json(response);

});

router.put('/transactions', decodeIDToken, checkJwt, async function (req, res, next) {
  try {
    const transaction = req.body.transaction;
    const email = req.body.user_email;
    const businessLocationsForBusiness = await queries.getBusinessLocation(email);
    const defaultBusinessLocationId = businessLocationsForBusiness.businessLocationID;
    const response = await queries.updateTransaction(transaction);

    queries.updateSimilarTransactionsForUser(transaction.name, transaction.categoryId, defaultBusinessLocationId);

    res.json(response);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.get('/has-plaid-token', decodeIDToken, checkJwt, async function (req, res, next) {
  try {
    const email = req.body.user_email;

    const response = await queries.getBusinessPlaidToken(email);

    res.json(response != null);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.use('/taxes', require('./taxes'));

module.exports = router;
