function createUser(req, res, db, create, generateErrorMessage) {
  return create(req, db, generateErrorMessage)
    .then(result => {
      res.status(201);
      res.set('Content-Type', 'text/plain');
      return res.send(String(result._id));
    })
    .catch(err => {
      if (err.name == 'ValidationError' || err.name === 'MongoError') {
        res.status(400);
        res.set('Content-Type', 'application/json');

        return res.json({ message: err.message });
      }
      res.status(500);
      res.set('Content-Type', 'application/json');
      return res.json({ message: 'Internal Server Error' });
    });
}

export default createUser;
