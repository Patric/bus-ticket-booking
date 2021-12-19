/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
 var admin = require("firebase-admin");
 var serviceAccount = require("./serviceAccountKey.json");

 initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://btbticketbooking-default-rtdb.europe-west1.firebasedatabase.app"
 });

 exports.helloWorld = (req, res) => {
    const { getFirestore } = require('firebase-admin/firestore');
    const COLLECTION_NAME = 'Tickets';
   
    const firestore = getFirestore();
    const id = 'LUgPuiCblXo5NtHIujqj';
    firestore.collection(COLLECTION_NAME)
      .doc(id)
      .get()
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
  };
  