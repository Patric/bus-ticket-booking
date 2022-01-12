const { response } = require('express');
const e = require('express');
const {
  getFirestore
} = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const firestore = getFirestore();
        const id = req.params.id;

        firestore.collection('Journeys').doc(id)
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
            }
          };