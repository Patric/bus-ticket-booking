const {
  getFirestore
} = require('firebase-admin/firestore');
const path = require('path');
const pug = require('pug');
const {google} = require('googleapis');
const http = require('http');

const people = google.people('v1');

const oauth2Client = new google.auth.OAuth2(
  '495530472547-sss6hbrvef98h52teojjn1e6nd8i9df1.apps.googleusercontent.com',
  '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',
  ''
);

google.options({auth: oauth2Client});

const scopes = [
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/user.emails.read',
  'profile',
];
authenticate(scopes)
  .then(client => runSample(client))
  .catch(console.error);


async function authenticate(scopes) {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
            res.end('Authentication successful! Please return to the console.');
            server.destroy();
            const {tokens} = await oauth2Client.getToken(qs.get('code'));
            oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
            resolve(oauth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
      });
    destroyer(server);
  });
}


function handleImplicitAuthRequest(req, res) {
  if (req.body.client_id === undefined ||
    req.body.redirect_url === undefined) {
    return res.status(400).send(JSON.stringify({
      'error': 'invalid_request',
      'error_description': 'Required parameters are missing in the request.'
    }));
  }

  const firestore = getFirestore();
  firestore.collection('Clients')
    .where('client_id', '==', req.body.client_id)
    .where('redirect_url', '==', req.body.redirect_url)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        res.status(400).send({
          error: 'Invalid client/redirect URL.'
        });
      }
    })
    .then(() => {
      const html = pug.renderFile(path.join(__dirname, 'auth.pug'), {
        response_type: 'code',
        client_id: req.body.client_id,
        redirect_url: req.body.redirect_url,
        code_challenge: req.body.code_challenge
      });
      res.status(200).send(html);
    })
    .catch(error => {
      if (error.message === 'Invalid client/redirect URL.') {
        res.status(400).send(JSON.stringify({
          'error': 'access_denied',
          'error_description': error.message
        }));
      } else {
        throw error;
      }
    });
}

module.exports = {
  trigger: (req, res) => {
    handleImplicitAuthRequest(req, res);
  }
};