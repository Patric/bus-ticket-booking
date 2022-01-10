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
    trigger: async (req, res) => {
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
              const data = querySnapshot.docs.map(doc => {
                const line_qs_data = await firestore.collection('Lines').doc(doc.data().line_id).get()
                    return line_qs_data.data();
                    // if (line_qs_data.stationFrom === from && line_qs_data.stationTo === to) {
                    //   return new JourneyDTO(line_qs_data, date);
                    // }
              });
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