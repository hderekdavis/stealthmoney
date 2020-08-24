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

        let actualTaxRate = 0;
        if (taxes.length > 1) {
          taxes.forEach(stateTax => {
            if (netIncome > stateTax.singleBracket) {
              actualTaxRate = stateTax.singleRate;
            }
          });
        } else {
          if (netIncome > taxes[0].singleBracket) {
            actualTaxRate = taxes[0].singleRate;
          }
        }
    
        res.json({ tax: actualTaxRate*netIncome, rate: actualTaxRate });
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