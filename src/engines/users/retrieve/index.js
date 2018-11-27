function retrieve(req, db) {
  return new Promise((resolve, reject) => [
    db.User.findById(req.params.userId).exec((error, user) => {
      if (!user) {
        reject(new Error('Not Found'));
      }

      resolve(user);
    })
  ]);
}

export default retrieve;
