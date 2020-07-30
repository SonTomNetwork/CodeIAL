const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'xoxo',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: 'abc',
            pass: '123',
        }
    },
    google_clientID: '865167019410-eq7qcjmq5kg8vddkavi1kbu2mg9oj70o.apps.googleusercontent.com',
    google_clientSecret: '_NRpyaKntQoTkmgZ87KdV0XQ',
    google_callbackURL: 'http://localhost:8000/users/auth/google/callback',
    jwt_key: 'codeial',
    morgan: {
        mode: 'dev',
        options: { stream: accessLogStream }
    }
}

const production = {
    name: 'production',
    asset_path: process.env.codeial_asset_path,
    session_cookie_key: process.env.codeial_session_cookie_key,
    db: process.env.codeial_db,
    smtp: {
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.codeial_gmail_username,
            pass: process.env.codeial_gmail_password,
        }
    },
    google_clientID: process.env.codeial_google_clientID,
    google_clientSecret: process.env.codeial_google_clientSecret,
    google_callbackURL: process.env.codeial_google_callbackURL,
    jwt_key: process.env.codeial_jwt_key,
    morgan: {
        mode: 'combined',
        options: { stream: accessLogStream }
    }
}

module.exports = eval(process.env.codeial_environment) == undefined ? development : eval(process.env.codeial_environment);