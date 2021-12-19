/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 const { initializeApp } = require('firebase-admin/app');
 var admin = require("firebase-admin");
 var serviceAccount = require("./serviceAccountKey.json");
 const { getFirestore } = require('firebase-admin/firestore');

 initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://btbticketbooking-default-rtdb.europe-west1.firebasedatabase.app"
 });

 exports.getTickets = (req, res) => {
    const id = req.query.id;
    
    const COLLECTION_NAME = 'Tickets';
    const firestore = getFirestore();
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
  