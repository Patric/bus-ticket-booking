const e = require('express');
const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const firestore = getFirestore();
        const from = req.query.from;
        const to = req.query.to;
        const date = req.query.date;
        
        firestore.collection('Journeys').where('date', '==', new Date(date).toDateString())
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              res.status(404).send({
                error: 'Unable to find the document'
              });
            }
            
            const data = querySnapshot.docs.map(doc => doc.data());
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
