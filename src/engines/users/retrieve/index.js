function retrieve(req, db) {
  return db.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    id: req.params.userId
  });
}

export default retrieve;
