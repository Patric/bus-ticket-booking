const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const COLLECTION_NAME = 'Journeys';
        const firestore = getFirestore();

        firestore.collection(COLLECTION_NAME)
          .add({
            email: req.body.email,
            person_id: req.body.person_id})
          .then(doc => {
            res.status(200).send();
          }).catch(err => {
            console.error(err);
            res.status(404).send({
              error: 'Unable to add document',
              err
            });
          });
      }
  };
