const {
  getFirestore
} = require('firebase-admin/firestore');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode')
const {
  send
} = require('./email');

module.exports = {
  trigger: (req, res) => {

    const _person_name = req.body.person_name;
    const _person_surname = req.body.person_surname;
    const _buyer = req.user;
    const _journey_id = req.body.journey_id;
    const firestore = getFirestore();

    var _journey;

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
        _journey = doc.data();
      })


    firestore.collection('Orders')
      .add({
        order_date: new Date().toDateString(),
        buyer: _buyer
      })
      .then(docRef => {
        console.log("Document written with ID: ", docRef.id);
        _order_id = docRef.id;

        const ticket = {
          order_id: _order_id,
          buyer_id: _buyer.id,
          journey_id: _journey_id,
          seat_number: 1,
          person_name: _person_name,
          person_surname: _person_surname
        };

        const expires_in = 2000;
        const SECRET_KEY = '4d5f0629130f331d641e3a5d15cfbd9f79c2f42e1ee9a304e679749a665a22b6';
        const ticket_jwt = jwt.sign(ticket, SECRET_KEY, {
          expiresIn: expires_in
        });

        QRCode.toDataURL(ticket_jwt, (err, qrcode) => {
          const ticket_with_jwt = {
            ...ticket,
            ticket_jwt: ticket_jwt,
            qr_code_url: qrcode
          }
          // get journey by id and count time to expiration

          firestore.collection('Tickets')
            .add(ticket_with_jwt)
            .then(doc => {
              send(_buyer.email, `Your new bus ticket reservation. Order nr. ${_order_id}`,
                `<h1>Your new ticket reservation</h1>
           <p>Here is your order number: ${_order_id}</p><br>
           <br>
           <br>
           <p><b>From: </b>${_journey.stationFrom}</p><br>
           <p><b>To: </b>${_journey.stationTo}</p><br>
           <p><b>Departure time: </b>${_journey.departureTime}</p><br>
           <p><b>Arrival time: </b>${_journey.arrivalTime}</p><br>
           <p><b>Date: </b>${_journey.date}</p><br>
           <p><b>Seat number: </b>${ticket.seat_number}</p><br>
           <p><b>Passenger name: </b>${ticket.person_name} ${ticket.person_surname}</p><br>
           <p>Show this QR code during control:</p>
           <br>
           <img src="${qrcode}" alt="Ticket QR code" />
           <br>
           <p>Best regards</p>
           <br>
           <br>
           <p>Bus ticket booking</p>`)

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
        });

      })
      .catch(error => {
        console.error("Error adding document: ", error);
        res.status(400).send({
          error: 'Unable to add document',
          err
        });
      });
  }
};