const superagent = require('superagent');
const jwt = require('jsonwebtoken');
const fs = require('fs');

export const decodeIDToken = async function(req, res, next) {
  let token = req.header('UserInfo');
  var cert = fs.readFileSync('./certificate.pem');
  if (token) {
    jwt.verify(token, cert, { algorithms: ['RS256'] }, function(err, decoded) {
      if (err) { 
        res.status(403);
        res.send({message: "invalid ID Token signature"})
      } else {
        req.body.user_email = decoded.email;
        req.body.auth0_user_id = decoded.sub;
      }
    });
  }
  next();
}

export const changeUserPassword = async function(managementToken: string, auth0UserId: string, newPassword: string) {
  return await superagent.patch('https://' + process.env.AUTH0_DOMAIN + '/api/v2/users/' + auth0UserId)
    .send({
      password: newPassword,
      connection: 'Username-Password-Authentication'
    })
    .set('Authorization', 'Bearer ' + managementToken)
    .set('content-type', 'application/json')
    .then(res => {
      console.log('Password changed for user with ID: ' + auth0UserId);
  }).catch(err => {
    console.log(err);
  })
}

export const getManagementToken = async function() {
  return await superagent.post('https://' + process.env.AUTH0_DOMAIN + '/oauth/token')
    .send({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_MANAGEMENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_SECRET,
      audience: 'https://' + process.env.AUTH0_DOMAIN + '/api/v2/'
    })
    .set('content-type', 'application/x-www-form-urlencoded')
    .then(res => {
      return res.body.access_token;
  }).catch(err => {
    console.log(err);
  })
}

export const sendResetPasswordLink = async function(email: string, token: string) {
  return await superagent.post('https://' + process.env.AUTH0_DOMAIN + '/dbconnections/change_password')
    .send({
      client_id: process.env.AUTH0_MANAGEMENT_ID,
      email: email,
      connection: 'Username-Password-Authentication'
    })
    .set('Authorization', 'Bearer ' + token)
    .set('content-type', 'application/json')
    .catch(err => {
      console.log(err);
    })
}