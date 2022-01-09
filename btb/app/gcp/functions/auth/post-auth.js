const {
  getFirestore
} = require('firebase-admin/firestore');
const path = require('path');
const pug = require('pug');

function handleImplicitAuthRequest(req, res) {
  if (req.body.client_id === undefined ||
    req.body.redirect_url === undefined) {
    return res.status(400).send(JSON.stringify({
      'error': 'invalid_request',
      'error_description': 'Required parameters are missing in the request.'
    }));
  }

  // const firestore = getFirestore();
  // firestore.collection('Clients')
  //   .where('client_id', '==', req.body.client_id)
  //   .where('redirect_url', '==', req.body.redirect_url)
  //   .get()
  //   .then(querySnapshot => {
  //     if (querySnapshot.empty) {
  //       console.error(err);
  //       res.status(400).send({
  //         error: 'Invalid client/redirect URL.',
  //         err
  //       });
  //     }
  //   })
    // .then(() => {
      const html = pug.renderFile(path.join(__dirname, 'auth.pug'), {
        response_type: 'code',
        client_id: req.body.client_id,
        redirect_url: req.body.redirect_url,
        code_challenge: req.body.code_challenge
      });
      res.status(200).send(html);
    // })
    // .catch(error => {
    //   if (error.message === 'Invalid client/redirect URL.') {
    //     res.status(400).send(JSON.stringify({
    //       'error': 'access_denied',
    //       'error_description': error.message
    //     }));
    //   } else {
    //     throw error;
    //   }
    // });
}

module.exports = {
  trigger: (req, res) => {
    handleImplicitAuthRequest(req, res);
  }
};