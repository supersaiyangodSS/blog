const mongoose = require('mongoose')
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        const connects = await mongoose.connect(process.env.MONGO_SECRET)
        console.log(`Databse connected ${connects.connection.host}`);
    }
    catch (err) {
        console.log(err);
    }
}
module.exports = connectDB