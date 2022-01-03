const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
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
      }
  };
