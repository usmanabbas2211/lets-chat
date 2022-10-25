const mongoose = require('mongoose')

const connectMongo = async () => {
    mongoose
        .connect(process.env.MONGO_QUERY_STRING)
        .then(() => console.log('connected to mongoDB'.white.bgBlue))
        .catch((err) => {
            console.log(err)
            process.exit(1)
        })
}

module.exports = connectMongo
