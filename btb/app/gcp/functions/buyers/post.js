const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const COLLECTION_NAME = 'Buyers';
        const firestore = getFirestore();

        firestore.collection(COLLECTION_NAME)
          .add({
            email: req.body.email,
            person_id: req.body.person_id})
          .then(res => res.send("DODANO"))
      }
  };
