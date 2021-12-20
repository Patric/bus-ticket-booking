const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        const id = req.params.id;
      
        const COLLECTION_NAME = 'Buyers';
        const firestore = getFirestore();
        
        firestore.collection(COLLECTION_NAME)
          .doc(id)
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
