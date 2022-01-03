const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const firestore = getFirestore();
        const from = req.query.from;
        const to = req.query.to;
        const date = req.query.date;

        const journeysRef = firestore.collection('Journeys').where('date', '==', new Date(date).toUTCString())
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
