const router = require('express').Router();
import checkJwt from '../lib/middleware/secured';
import * as queries from '../queries';
import { decodeIDToken } from '../lib/middleware/userInfo';
var _ = require('lodash');

router.get('/federal', decodeIDToken, checkJwt, async function (req, res, next) {
    try {
      const email = req.body.user_email;
      const businessLocationsForBusiness = await queries.getBusinessLocation(email);

      let allTransactions = await queries.getTransactions(businessLocationsForBusiness.businessLocationID);
      let netIncome = await getIncome(allTransactions);

      if (netIncome <= 0) {
        res.json({ 
          tax: 0, 
          rate: 0,
          netIncome: netIncome
        });
      } else if (businessLocationsForBusiness.legalEntity === 'C Corporation') {
        res.json({ tax: netIncome * 0.21, rate: 0.21, netIncome: netIncome });
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

      let allTransactions = await queries.getTransactions(businessLocationsForBusiness.businessLocationID);
      let netIncome = await getIncome(allTransactions);

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

      let salesTransactions = await queries.getSalesTransactions(businessLocationsForBusiness.businessLocationID);
      let salesIncome = await getIncome(salesTransactions);
      
      if (salesIncome <= 0) {
        res.json({ 
          tax: 0, 
          rate: 0,
          salesIncome: salesIncome
        });
      } else {
        res.json({ 
          tax: 0.1*salesIncome, 
          rate: 0.1,
          salesIncome: salesIncome
        });
      }  
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

const getIncome = async function(transactions: any): Promise<any> {

  let totalIncome = _.sumBy(transactions, transaction => {
    return transaction.type === 'Income' ? Math.abs(transaction.amount) : 0;
  });
  let totalExpenses = _.sumBy(transactions, transaction => {
    return transaction.type === 'Expense' ? transaction.amount : 0;
  });

  return totalIncome - totalExpenses;
}

router.get('/due-dates', decodeIDToken, checkJwt, async function (req, res, next) {
  try {

    const email = req.body.user_email;
    const businessLocationsForBusiness = await queries.getBusinessLocation(email);

    let userDueDates = await queries.getDueDatesForUser(businessLocationsForBusiness.state, businessLocationsForBusiness.county, businessLocationsForBusiness.city, businessLocationsForBusiness.vertical);
    let federalDueDates = await queries.getFederalDueDates();

    let resultsList = userDueDates.concat(federalDueDates);

    res.json({ 
      results: _.sortBy(resultsList, function(dateObj) {
        return new Date(dateObj.dueDate);
      })
    });
    
  } catch(error) {
    console.log(error);

    res.json(error);
  }
});

module.exports = router;