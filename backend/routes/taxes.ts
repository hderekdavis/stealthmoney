const router = require('express').Router();
import checkJwt from '../lib/middleware/secured';
import * as queries from '../queries';
import { decodeIDToken } from '../lib/middleware/userInfo';
var _ = require('lodash');

router.get('/federal', decodeIDToken, checkJwt, async function (req, res, next) {
    try {
      const email = req.body.user_email;
      const businessLocationsForBusiness = await queries.getBusinessLocation(email);

      let netIncome = await getNetIncome(businessLocationsForBusiness.businessLocationID);
      console.log(netIncome);

      if (netIncome <= 0) {
        res.json({ 
          tax: 0, 
          rate: 0,
          netIncome: netIncome
        });
      } else if (businessLocationsForBusiness.legalEntity === 'C Corporation') {
        res.json({ tax: netIncome * 0.21, rate: 0.21 });
      } else {
        let taxes = await queries.getIndividualTaxes();

        let taxedAmount = 0;
        for (var x = 0; x < taxes.length; x++) {
          if (netIncome > taxes[x].bracket) {
            let taxedAmountInThisBracket = netIncome - taxes[x].bracket;
            // Check if there's a next tax bracket and netIncome overflows into next bracket
            if (x < taxes.length - 1 && netIncome > taxes[x + 1].bracket) {
              // Since there's a next tax bracket, need to find how much income fits into this bracket
              taxedAmountInThisBracket = taxes[x + 1].bracket - taxes[x].bracket;
            }

            taxedAmount += taxedAmountInThisBracket * taxes[x].rate;
          } else {
            break;
          }
        }
    
        res.json({ 
          tax: taxedAmount, 
          rate: (taxedAmount / netIncome),
          netIncome: netIncome
        });
      }
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

router.get('/state', decodeIDToken, checkJwt, async function (req, res, next) {
    try {
      const email = req.body.user_email;
      const businessLocationsForBusiness = await queries.getBusinessLocation(email);

      let netIncome = await getNetIncome(businessLocationsForBusiness.businessLocationID);

      const state = businessLocationsForBusiness.state;

      if (netIncome <= 0) {
        res.json({ 
          tax: 0, 
          rate: 0,
          netIncome: netIncome
        });
      } else {
        let taxes = await queries.getStateTax(state);

        let taxedAmount = 0;
        for (var x = 0; x < taxes.length; x++) {
          if (netIncome > taxes[x].singleBracket) {
            let taxedAmountInThisBracket = netIncome - taxes[x].singleBracket;
            // Check if there's a next tax bracket and netIncome overflows into next bracket
            if (x < taxes.length - 1 && netIncome > taxes[x + 1].singleBracket) {
              // Since there's a next tax bracket, need to find how much income fits into this bracket
              taxedAmountInThisBracket = taxes[x + 1].singleBracket - taxes[x].singleBracket;
            }

            taxedAmount += taxedAmountInThisBracket * taxes[x].singleRate;
          } else {
            break;
          }
        }
    
        res.json({ 
          tax: taxedAmount, 
          rate: (taxedAmount / netIncome),
          netIncome: netIncome
        });
      }
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

router.get('/local', decodeIDToken, checkJwt, async function (req, res, next) {
    try {

      const email = req.body.user_email;
      const businessLocationsForBusiness = await queries.getBusinessLocation(email);
      let netIncome = await getNetIncome(businessLocationsForBusiness.businessLocationID);
      
      if (netIncome <= 0) {
        res.json({ 
          tax: 0, 
          rate: 0,
          netIncome: netIncome
        });
      } else {
        res.json({ 
          tax: 0.1*netIncome, 
          rate: 0.1,
          netIncome: netIncome
        });
      }  
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

const getNetIncome = async function(locationID: number): Promise<any> {

  let latestTransactions = await queries.getTransactions(locationID);

  let totalIncome = _.sumBy(latestTransactions, transaction => {
    return transaction.type === 'Income' ? Math.abs(transaction.amount) : 0;
  });
  let totalExpenses = _.sumBy(latestTransactions, transaction => {
    return transaction.type === 'Expense' ? transaction.amount : 0;
  });

  return totalIncome - totalExpenses;
}

module.exports = router;