function retrieveUser(req, res, db, retrieve) {
  return retrieve(req, db)
    .then(result => {
      res.status(200);
      res.set('Content-Type', 'application/json');
      const user = result._source;
      delete user.password;
      return res.json(user);
    })
    .catch(err => {
      if (err.status === 404) {
        res.status(404);
        res.set('Content-Type', 'application/json');
        return res.json({ message: 'Not found' });
      }

      res.status(500);
      res.set('Content-Type', 'application/json');
      return res.json({ message: 'Internal Server Error' });
    });
}

export default retrieveUser;
