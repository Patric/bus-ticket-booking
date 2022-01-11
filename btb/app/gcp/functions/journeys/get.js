const { response } = require('express');
const e = require('express');
const {
  getFirestore
} = require('firebase-admin/firestore');

class JourneyDTO {
  constructor(date, line) {
    this.date = date;
    this.line = line;
  }
}

module.exports = {
    trigger: (req, res) => {
        const firestore = getFirestore();
        const from = req.query.from;
        const to = req.query.to;
        const date = req.query.date;

        firestore.collection('Journeys').where('date', '==', new Date(date).toDateString())
          .get()
          .then(async (querySnapshot) => {
              if (querySnapshot.empty) {
                res.status(404).send({
                  error: 'Unable to find the document'
                });
              }
              const ref = firestore.collection('Lines').doc(ObjectId('PZaneAbV0RJOLxCPLHnD')).get()
              res.status(200).send(ref.data());
              // const output = [];
              // const data = querySnapshot.docs.forEach(async (doc) => {
              //  const line_doc = firestore.collection('Lines').doc('PZaneAbV0RJOLxCPLHnD').get();
              //     const line_qs_data = line_doc.data();
              //       // if (line_qs_data.stationFrom === from && line_qs_data.stationTo === to) {
              //       //   return new JourneyDTO(line_qs_data, date);
              //       // }
              //     output.push(line_qs_data)
              // });
              //   res.status(200).send(output);
              }).catch(err => {
                console.error(err);
                res.status(404).send({
                  error: 'Unable to retrieve the document',
                  err
                });
              });
            }
          };