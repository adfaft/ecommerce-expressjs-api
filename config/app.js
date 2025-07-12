require('dotenv').config({quiet: true});

const db_url_qs = process.env.DB_URL_QS ? `&${process.env.DB_URL_QS}` : ''

const config = {
    name: process.env.APP_NAME,
    db_connection: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?appName=${process.env.APP_NAME}${db_url_qs}`
}

module.exports = config;