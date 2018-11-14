import elasticsearch from 'elasticsearch';

const client = elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOLE}://${
    process.env.ELASTICSEARCH_HOSTNAME
  }:${process.env.ELASTICSEARCH_PORT}`
});

function retriveUser(req, res) {
  client
    .get({
      index: process.env.ELASTICSEARCH_INDEX,
      type: 'user',
      id: req.params.userId
    })
    .catch(err => {
      if (err.status === 404) {
        res.status(404);
        res.set('Content-Type', 'application/json');
        res.json({ message: 'Not found' });
      }
    });
}

export default retriveUser;
