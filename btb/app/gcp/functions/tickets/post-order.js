const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {

        const _buyer_id = '';
        const _person_id = req.body.person_id;
        const _journey_id = req.body.journey_id;
        const _bus_id = req.body.bus_id;
        const _line_id = req.body.line_id;
        const _origin_stop_number = req.body.origin_stop_number;
        const _destination_stop_number = req.body.destination_stop_number;

        const COLLECTION_NAME = 'Journeys';
        const firestore = getFirestore();
        
        let _order_id;

        firestore.collection('Orders')
          .add({
            order_date: new Date().toDateString(),
            buyer_id: _buyer_id

          })
          .then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            _order_id = docRef.id;
          })
        .catch(error => {
            console.error("Error adding document: ", error);
            res.status(400).send({
              error: 'Unable to add document',
              err
            });
        });

        firestore.collection('Tickets')
          .add({
            order_id: _order_id,
            person_id: _person_id,
            journey_id: _journey_id,
            seat_number: 1,
            bus_id:   _bus_id,
            line_id: _line_id,
            origin_stop_number: _origin_stop_number,
            destination_stop_numbe: _destination_stop_number
          })
          .then(doc => {
            res.status(200).send({uniqueTicketCode: '4d5f0629130f331d641e3a5d15cfbd9f79c2f42e1ee9a304e679749a665a22b6'});
          }).catch(err => {
            console.error(err);
            res.status(404).send({
              error: 'Unable to add document',
              err
            });
          });
      }
  };
