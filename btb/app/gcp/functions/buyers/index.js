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

 app.post('/', post.trigger);


//  app.post('/', (req, res) => res.send(Widgets.create()));
//  app.put('/:id', (req, res) => res.send(Widgets.update(req.params.id, req.body)));
//  app.delete('/:id', (req, res) => res.send(Widgets.delete(req.params.id)));
//  app.get('/', (req, res) => res.send(Widgets.list()));
 
 // Expose Express API as a single Cloud Function:
 exports.buyers = functions.https.onRequest(app);
  