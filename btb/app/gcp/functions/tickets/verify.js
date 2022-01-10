const jwt = require('jsonwebtoken');

module.exports({
    verify:  (req, res, next) => {
       const SECRET_KEY = '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';
       const token = req.headers.authorization;
       jwt.verify(token, SECRET_KEY, (err, decoded) => {
           if (err) {
               res.status(401).send(err);
               return;
           }
           next();
       })
    }
})