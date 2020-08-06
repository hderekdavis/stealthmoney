const superagent = require('superagent');

export const setUserInfo = async function(req, res, next) {
    let token = req.header('authorization');
    if (token) {
      await superagent.get('https://' + process.env.AUTH0_DOMAIN + '/userinfo').set('Authorization',token).then(res => {
        req.body.user_email = res.body.email;
        req.body.auth0_user_id = res.body.sub;
      }).catch(err => {
        console.log(err);
      })
    }
    next();
}

export const changeUserPassword = async function(token: string, auth0UserId: string, newPassword: string) {
  await superagent.patch('https://' + process.env.AUTH0_DOMAIN + '/api/v2/users/' + auth0UserId)
    .send({
      password: newPassword,
      connection: 'Username-Password-Authentication'
    })
    .set('Authorization',token)
    .set('content-type', 'application/json')
    .then(res => {
      console.log('Password changed for user with ID' + auth0UserId);
  }).catch(err => {
    console.log(err);
  })
}