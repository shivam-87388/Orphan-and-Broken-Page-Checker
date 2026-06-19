const mongoose = require("mongoose");
const dotenv = require("dotenv");

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);


dotenv.config();
console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
    .then((result) => {
        console.log('database connected');
    }).catch((err) => {
        console.log(err);
    });

module.exports = mongoose;