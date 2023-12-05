module.exports = {
  type: 'sqlite',
  database: 'restfulapi',
  entities: ['src/entity/**/*.ts'],
  synchronize: true,
};
