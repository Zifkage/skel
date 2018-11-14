import elasticsearch from 'elasticsearch';

const client = elasticsearch.Client({
  host: `${process.env.ELASTICSEARCH_PROTOCOLE}://${
    process.env.ELASTICSEARCH_HOSTNAME
  }:${process.env.ELASTICSEARCH_PORT}`
});

function retrieve(req) {
  return client.get({
    index: process.env.ELASTICSEARCH_INDEX,
    type: 'user',
    id: req.params.userId
  });
}

export default retrieve;
