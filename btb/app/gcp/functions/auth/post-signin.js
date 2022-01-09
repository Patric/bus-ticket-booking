const {
  getFirestore
} = require('firebase-admin/firestore');
const appendQuery = require('append-query');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const ISSUER = 'sample-issuer';
const JWT_LIFE_SPAN = 1800 * 1000;

let privateKey;
fs.readFile('private.pem', 'utf8', function (error, data) {
  if (error) {
    console.log(`An error has occurred when reading the key file: ${error}`);
  } else {
    privateKey = data;
  }
});

function handleImplictSigninRequest (req, res) {

  const username = req.body.username;
  const password = req.body.password;
  const client_id = req.body.client_id;
  const redirect_url = req.body.redirect_url;


  if (username       === undefined ||
    password      === undefined ||
    client_id      === undefined ||
    redirect_url   === undefined) {
    return res.status(400).send(JSON.stringify({
      'error': 'invalid_request',
      'error_description': 'Required parameters are missing in the request.'
    }))
  }

  const firestore = getFirestore();
  firestore.collection('Users')
    .where('username', '==', username)
    .where('password', '==', password)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        return Promise.reject('Invalid user credentials.')
      }
    })
    .then(() => firestore.collection('Clients')
    .where('client_id', '==', client_id)
    .where('redirect_url', '==', redirect_url)
    .get())
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        return Promise.reject('Invalid client and/or redirect URL.')
      }
    })
    .then(() => {
      const token = jwt.sign({}, privateKey, {
          algorithm: 'RS256',
          expiresIn: JWT_LIFE_SPAN,
          issuer: ISSUER
        })
      res.redirect(appendQuery(redirect_url, {
        access_token: token,
        token_type: 'JWT',
        expires_in: JWT_LIFE_SPAN
      }))
    })
}

module.exports = {
  trigger: (req, res) => {
    handleImplictSigninRequest(req, res);
  }
};
