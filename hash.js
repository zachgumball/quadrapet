const bcrypt = require("bcrypt");

const plainPassword = "rodit123";
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hash);

    // Compare the newly hashed password with the stored hashed password
    bcrypt.compare(plainPassword, hash, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
      } else {
        console.log("Passwords match:", isMatch); // Should print true if the passwords match
      }
    });
  }
});