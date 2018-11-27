function create(req, db, generateErrorMessage) {
  var user = new db.User(req.body);

  return new Promise((resolve, reject) => {
    user.save(function(err, user) {
      if (err) {
        err.message = generateErrorMessage(err);
        reject(err);
      }
      resolve(user);
    });
  });
}

export default create;
