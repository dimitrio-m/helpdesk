module.exports = {
  port: process.env.PORT || 8080,
  db: {
    url: process.env.MONGODB_URI || 'mongodb://localhost/ticket-system?authSource=admin',
    options: {
      useMongoClient: true,
      user: 'admin',
      pass: '@ttr@747678',
    },
  },
};
