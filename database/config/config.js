module.exports = {
  'development': {
    'username': 'postgres',
    'password': null,
    'database': 'authDB',
    'host': '127.0.0.1',
    'dialect': 'postgres'
  },
  'test': {
    'username': 'postgres',
    'password': null,
    'database': 'authDB',
    'host': '127.0.0.1',
    'dialect': 'postgres'
  },
  'production': {
    'username': 'postgres',
    'password': null,
    'database': 'authDB',
    'host': '127.0.0.1',
    'dialect': 'postgres'
  },
  'docker': {
    'username': 'postgres',
    'password': 'postgres',
    'database': 'authDB',
    'host': 'db',
    'dialect': 'postgres',
  },
};