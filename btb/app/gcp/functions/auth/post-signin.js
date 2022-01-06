const {
  getFirestore
} = require('firebase-admin/firestore');
const appendQuery = require('append-query');
const crypto = require('crypto');
const Datastore = require('@google-cloud/datastore');
const fernet = require('fernet');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const pug = require('pug');

const ISSUER = 'sample-issuer';
const JWT_LIFE_SPAN = 1800 * 1000;

function handleImplictSigninRequest (req, res) {
  if (req.body.username       === undefined ||
      req.body.password       === undefined ||
      req.body.client_id      === undefined ||
      req.body.redirect_url   === undefined) {
    return res.status(400).send(JSON.stringify({
      'error': 'invalid_request',
      'error_description': 'Required parameters are missing in the request.'
    }))
  }

  const firestore = getFirestore();
  firestore.collection('Users')
    .where('username', '==', req.body.usernamed)
    .where('password', '==', req.body.password)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        return Promise.reject('Invalid user credentials.')
      }
    })
    .then(() => firestore.collection('Users')
    .where('username', '==', req.body.usernamed)
    .where('password', '==', req.body.password)
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
      res.redirect(appendQuery(req.body.redirect_url, {
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
