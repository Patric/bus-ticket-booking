/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 const { initializeApp } = require('firebase-admin/app');
 var admin = require("firebase-admin");
 var serviceAccount = require("./serviceAccountKey.json");

 const functions = require('firebase-functions');
 const get = require('./get.js');
 const post = require('./get.js');

 initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://btbticketbooking-default-rtdb.europe-west1.firebasedatabase.app"
 });


 const express = require('express');
 const cors = require('cors');
 
 const app = express();
 
 // Automatically allow cross-origin requests
 app.use(cors({ origin: true }));
 
 // build multiple CRUD interfaces:
 app.get('/:id', get.trigger);

 app.post('/', (req, res) => {
    const COLLECTION_NAME = 'Buyers';
    const firestore = getFirestore();

    firestore.collection(COLLECTION_NAME)
      .add({
        email: req.body.email,
        person_id: req.body.person_id})
      .then(doc => {
        if (!(doc && doc.exists)) {
          res.status(404).send({
            error: 'Unable to find the document'
          });
        }
        const data = doc.data();
        if (!data) {
          res.status(404).send({
            error: 'Found document is empty'
          });
        }
        res.status(200).send(data);
      }).catch(err => {
        console.error(err);
        res.status(404).send({
          error: 'Unable to retrieve the document',
          err
        });
      });
  });


//  app.post('/', (req, res) => res.send(Widgets.create()));
//  app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
//  app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
//  app.get('/', (req, res) => res.send(Widgets.list()));
 
 // Expose Express API as a single Cloud Function:
 exports.buyers = functions.https.onRequest(app);
  