const router = require('express').Router();
import { decodeIDToken } from '../lib/middleware/userInfo';
import checkJwt from '../lib/middleware/secured';
import * as queries from '../queries';
var plaid = require('plaid');
var moment = require('moment');
import * as _ from 'lodash';

const plaidClient = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: process.env.NODE_ENV.toUpperCase() === 'PRODUCTION' ? plaid.environments.production : plaid.environments.sandbox
});

router.put('/', decodeIDToken, checkJwt, async function (req, res, next) {
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

router.get('/all', decodeIDToken, checkJwt, async function (req, res, next) {
    try{
      // 1. Exchange public token for access token
      const email = req.body.user_email;
      const getBusinessResponse: any = await queries.getBusinessByEmail(email);
  
      let hours = 0;
      if (getBusinessResponse.plaidLastPull) {
        hours = moment().diff(getBusinessResponse.plaidLastPull, 'hours');
      }
      queries.setPlaidLastPull(getBusinessResponse.businessID);
  
      const businessLocationsForBusiness = await queries.getBusinessLocation(email);
      const defaultBusinessLocationId = businessLocationsForBusiness.businessLocationID; // Temporarily default to user's first business location
  
      if (hours >= 24) {
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
                    date: transaction.date,
                    address: transaction.location.address,
                    city: transaction.location.city,
                    region:  transaction.location.region,
                    rawData: JSON.stringify(transaction)
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
                      date: transaction.date,
                      address: transaction.location.address,
                      city: transaction.location.city,
                      region:  transaction.location.region,
                      rawData: JSON.stringify(transaction)
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

router.get('/', decodeIDToken, checkJwt, async function (req, res, next) {
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
          transactionId: transaction.transactionID,
          address: transaction.address,
          city: transaction.city,
          region:  transaction.region,
          date: transaction.date
        };
      });
  
      res.json(latestTransactions);
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

router.get('/categories', decodeIDToken, checkJwt, async function (req, res, next) {

    const response = await queries.getChartOfAccountsCategories(req.query.vertical);
  
    res.json(response);
  
});

module.exports = router;