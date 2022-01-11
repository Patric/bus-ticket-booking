const {
  getFirestore
} = require('firebase-admin/firestore');
const jwt = require('jsonwebtoken');

module.exports = {
  trigger: (req, res) => {

    const _person_name = req.body.person_name;
    const _person_surname = req.body.person_surname;
    const _buyer = req.user;
    const _journey_id = req.body.journey_id;
    const firestore = getFirestore();

    let journey_departure_date;
    let _order_id;

    firestore.collection('Journeys')
    .doc(_journey_id)
    .get()
    .then(doc => {
      if (!(doc && doc.exists)) {
        res.status(404).send({
          error: `Journey with id ${_journey_id} does not exist`
        });
      }
      journey_departure_date = doc.data().date;
    })


    firestore.collection('Orders')
      .add({
        order_date: new Date().toDateString(),
        buyer: _buyer
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

    const ticket = {
      order_id: _order_id,
      buyer_id: _buyer.id,
      journey_id: _journey_id,
      seat_number: 1,
      person_name: _person_name,
      person_surname: _person_surname
    };

    const expires_in = new Date(journey_departure_date) - new Date();
    const SECRET_KEY = '4d5f0629130f331d641e3a5d15cfbd9f79c2f42e1ee9a304e679749a665a22b6';
    const ticket_jwt = jwt.sign(ticket, SECRET_KEY, {
      expiresIn: expires_in
    });

    const ticket_with_jwt = {
      order_id: _order_id,
      buyer_id: _buyer.id,
      journey_id: _journey_id,
      seat_number: 1,
      person_name: _person_name,
      person_surname: _person_surname,
      ticket_jwt: ticket_jwt
    }
    // get journey by id and count time to expiration
  
    firestore.collection('Tickets')
      .add(ticket_with_jwt)
      .then(doc => {
        res.status(200).send({
          ticket_jwt: ticket_jwt
        });
      }).catch(err => {
        console.error(err);
        res.status(404).send({
          error: 'Unable to add document',
          err
        });
      });
  }
};