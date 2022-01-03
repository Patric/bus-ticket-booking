const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const COLLECTION_NAME = 'Buyers';
        const firestore = getFirestore();
        firestore.collection(COLLECTION_NAME)
          .doc('fdas').get().then( () => res.send("GOT"))
      }
  };
