const bcrypt = require("bcrypt");

const password = "zeta2514";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hash);
  }
});
