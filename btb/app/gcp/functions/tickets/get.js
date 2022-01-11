const e = require('express');
const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const firestore = getFirestore();
        const buyer_id = req.user.id;

        firestore.collection('Tickets').where('buyer_id', '==', buyer_id)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.empty) {
              res.status(200).send([]);
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
