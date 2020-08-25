const router = require('express').Router();
import checkJwt from '../lib/middleware/secured';
import * as queries from '../queries';

router.get('/federal', checkJwt, async function (req, res, next) {
    try {
        const netIncome = Number(req.query.netIncome);
        
        if (netIncome <= 0) {
          res.json({ tax: 0, rate: 0 });
        } else {
          res.json({ tax: netIncome*0.21, rate: 0.21 });
        }
    
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

router.get('/state', checkJwt, async function (req, res, next) {
    try {
      const email = req.body.user_email;
      const netIncome = Number(req.query.netIncome);
      const businessLocationsForBusiness = await queries.getBusinessLocation(email);
      const state = businessLocationsForBusiness.state;

      if (netIncome <= 0) {
        res.json({ tax: 0, rate: 0 });
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
    
        res.json({ tax: taxedAmount, rate: (taxedAmount / netIncome) });
      }
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

router.get('/local', checkJwt, async function (req, res, next) {
    try {
      const netIncome = Number(req.query.netIncome);
      
      if (netIncome <= 0) {
        res.json({ tax: 0, rate: 0 });
      } else {
        res.json({ tax: 0.1*netIncome, rate: 0.1 });
      }  
    } catch(error) {
      console.log(error);
  
      res.json(error);
    }
});

module.exports = router;