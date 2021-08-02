const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username cannot be blank']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    }
})

adminSchema.statics.findAdmin = async function (username, password) {
    const foundAdmin = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundAdmin.password);
    return isValid ? foundAdmin : false;
}

module.exports = mongoose.model('Admin', adminSchema);