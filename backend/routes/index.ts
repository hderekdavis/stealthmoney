var express = require('express');
var router = express.Router();
var cors = require('cors');
var plaid = require('plaid');

const plaidClient = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: process.env.NODE_ENV.toUpperCase() === 'PRODUCTION' ? plaid.environments.production : plaid.environments.sandbox
});

router.use(cors());

import * as _ from 'lodash';
import checkJwt from '../lib/middleware/secured';
import * as queries from '../queries';
import { changeUserPassword, getManagementToken, sendResetPasswordLink, decodeIDToken } from '../lib/middleware/userInfo';

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
      let result = await queries.saveBusinessLocation(response.insertId, address.addressFirstLine, address.addressSecondLine,
        address.city, address.state, address.county, address.zipcode);
      saveBusinessVerticals(result.insertId, address.businessVertical);
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
    const accountant = await queries.getBusinessAccountant(business.businessID);
    const entities = await queries.getLegalEntities();
    let legalEntity = entities.find( entity => entity.entityID === business.legalEntity);

    for (const address of addresses) {
      let results = await queries.getBusinessVerticals(address.businessLocationID)
      address.verticals = [];
      results.forEach(element => {
        address.verticals.push(element.verticalID);
      });
    }
    
    res.json({
      business: business,
      addresses: addresses,
      accountant: accountant,
      legalEntity: legalEntity
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
  const legalEntityID = await queries.getLegalEntityID(legalEntity);
  console.log(legalEntityID);
  const addresses = req.body.addresses;
  const password = req.body.password;
  const response = await queries.updateBusiness(businessID, email, businessName, phoneNumber, legalEntityID);

  if (password) {
     await changeUserPassword(managementToken, req.body.auth0_user_id, password)
  }
  
  res.json(response)
});

router.post('/reset-password', async function (req, res, next) {

  await sendResetPasswordLink(req.body.email, managementToken)
  
  res.json({});

});

router.get('/location', decodeIDToken, checkJwt, async function (req, res, next) {

  const email = req.body.user_email;

  const response = await queries.getBusinessLocation(email);

  res.json(response);

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

router.post('/unsubscribe', async function (req, res, next) {
  try {
    const email = req.body.email;

    await queries.unsubscribe(email);

    res.json();
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.get('/entities', async function (req, res, next) {
  try {
    let result = await queries.getLegalEntities();

    res.json(result);
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

router.post('/login', decodeIDToken, checkJwt, async function (req, res, next) {

  const email = req.body.user_email;

  const response = await queries.registerUserLoggedIn(email);

  res.json(response);

});

const saveBusinessVerticals = async function(businessLocationID: number, verticals: []) {
  await queries.removeBusinessVerticals(businessLocationID);
  for (const vertical of verticals) {
    await queries.saveBusinessVertical(businessLocationID, vertical);
  }
}

router.use('/taxes', require('./taxes'));
router.use('/transactions', require('./transactions'));

module.exports = router;
