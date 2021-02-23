const crypto = require("crypto");
const _ = require("lodash");
const Sequelize = require("sequelize");

const db = require("./db");

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch(done);
});

const User = db.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: setSaltAndPassword,
      beforeUpdate: setSaltAndPassword,
    },
  }
);

// instance methods
User.prototype.correctPassword = function (candidatePassword) {
  return (
    this.Model.encryptPassword(candidatePassword, this.salt) === this.password
  );
};

User.prototype.sanitize = function () {
  return _.omit(this.toJSON(), ["password", "salt"]);
};

// class methods
User.generateSalt = function () {
  return crypto.randomBytes(16).toString("base64");
};

User.encryptPassword = function (plainText, salt) {
  const hash = crypto.createHash("sha1");
  hash.update(plainText);
  hash.update(salt);
  return hash.digest("hex");
};

function setSaltAndPassword(user) {
  // we need to salt and hash again when the user enters their password for the first time
  // and do it again whenever they change it
  if (user.changed("password")) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
}

module.exports = User;


router.put('/login', (req, res, next) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (!user) res.status(401).send('User not found');
        else if (!user.hasMatchingPassword(req.body.password) res.status(401).send('Incorrect password');
        else {
          req.login(user, err => {
            if (err) next(err);
            else res.json(user);
          });
        }
      })
      .catch(next);
  });

  router.post('/signup', (req, res, next) => {
    User.create(req.body)
      .then(user => {
        req.login(user, err => {
          if (err) next(err);
          else res.json(user);
        });
      })
      .catch(next);
  });

  router.delete('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy()
    res.sendStatus(204);
  });

  router.get('/me', (req, res, next) => {
    res.json(req.user);
  });