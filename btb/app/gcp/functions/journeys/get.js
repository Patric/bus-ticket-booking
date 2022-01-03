const e = require('express');
const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const firestore = getFirestore();
        const from = req.query.from;
        const to = req.query.to;
        const date = req.query.date;

        let time = {
          seconds: 1613748319,
          nanoseconds: 47688698687,
        }
        const fireBaseTime = new Date(
          time.seconds * 1000 + time.nanoseconds / 1000000,
        );

        const journeysRef = firestore.collection('Journeys').where('date', '==', date)
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
