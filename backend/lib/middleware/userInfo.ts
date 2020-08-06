const superagent = require('superagent');

export const setUserInfo = async function(req, res, next) {
    let token = req.header('authorization');
    if (token) {
      await superagent.get('https://' + process.env.AUTH0_DOMAIN + '/userinfo').set('Authorization',token).then(res => {
        req.body.user_email = res.body.email;
      }).catch(err => {
        console.log(err);
      })
    }
    next();
}