const mongoose = require("mongoose");

const PrijaveSchema = new mongoose.Schema({
  pitanje1: {
    type: String,
    required: [true, "Pitanje 1 je obavezno!"],
  },
  pitanje2: {
    type: String,
    required: [true, "Pitanje 2 je obavezno!"],
  },
  pitanje3: {
    type: String,
    required: [true, "Pitanje 3 je obavezno!"],
  },
  pitanje4: {
    type: String,
    required: [true, "Pitanje 4 je obavezno!"],
  },
  vesti: {
    type: Boolean,
  },
  clanovi: [
    {
      imePrezime: {
        type: String,
        required: [true, "Ime takmičara je obavezno!"],
      },
      email: {
        type: String,
        required: [true, "Email takmičara je obavezan!"],
      },
      brojTelefona: {
        type: String,
        required: [true, "Broj telefona takmičara je obavezan!"],
      },
      status: {
        type: String,
        required: [true, "Status takmičara je obavezan!"],
      },
      imeSkole: {
        type: String,
      },
      linkCV: {
        type: String,
        required: [true, "Link do CV-a takmičara je obavezan!"],
      },
    },
  ],
});

module.exports = mongoose.model("prijave", PrijaveSchema);
