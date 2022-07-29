const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://amirthapa:${password}@cluster0.cllc002.mongodb.net/?retryWrites=true&w=majority`;

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

mongoose
  .connect(url)
  .then(() => {
    console.log("connected");
    const note = new Note({
      content: "Js is hard",
      date: new Date(),
      important: true,
    });

    return note.save(); //save method return a promise and if the promise resolve then the note is saved on database
    // note = Note.find({ important: true });
    // return note;
  })
  .then((result) => {
    console.log(result);
    console.log("note saved!");
    return mongoose.connection.close();
  })
  .catch((err) => console.log(err));
