var express = require('express');
var router = express.Router();
var cors = require('cors')
router.use(cors());

import * as queries from '../queries';

router.get('/business', async function (req, res, next) {
  var response: any = await queries.getBusiness(1);

  console.log(response);

  res.json({});
});

module.exports = router;
