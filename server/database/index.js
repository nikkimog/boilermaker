const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/boilermaker",
  {
    logging: false, // unless you like the logs
    // ...and there are many other options you may want to play with
  }
);

const Example = db.define("example", {
  name: Sequelize.STRING,
  date: Sequelize.DATE,
});

//associations go here as well

module.exports = db;
