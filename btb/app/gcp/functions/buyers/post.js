const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
      console.log(req.body);

        const COLLECTION_NAME = 'Buyers';
        const firestore = getFirestore();
        console.log(req.body);

        firestore.collection(COLLECTION_NAME)
          .doc('fdas').get().then( () => res.send("GOT"))
      }
  };
