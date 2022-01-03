const e = require('express');
const { getFirestore } = require('firebase-admin/firestore');

module.exports = {
    trigger: (req, res) => {
        res.send("Authenticated");
      }
  };
