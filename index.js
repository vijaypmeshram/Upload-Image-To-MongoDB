const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vijay', {useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
/*
db.once('open', function() {
  // we're connected!
  console.log("we're connected")
}); */

const kittySchema = new mongoose.Schema({
  name: String
});

kittySchema.methods.speak = function () {
  const greeting = "My name is " + this.name;
  console.log(greeting);
};

const Kitten = mongoose.model('vijaykitty', kittySchema);

const vijaykitty = new Kitten({ name: 'vijaykitty' });
//console.log(vijaykitty.name);
//vijaykitty.speak();

vijaykitty.save(function (err, vijaykitty) {
  if (err) return console.error(err);
 // vijaykitty.speak();
});

Kitten.find( {name:"vijaykitty"}, function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})