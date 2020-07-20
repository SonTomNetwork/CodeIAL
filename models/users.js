const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const PFP_PATH = path.join('/uploads/users/pfps');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
    },
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', PFP_PATH));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

userSchema.statics.uploadedPFP = multer({ storage: storage }).single('pfp');
userSchema.statics.pfpPath = PFP_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User; 