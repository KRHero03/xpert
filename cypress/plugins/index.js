/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const path = require("path");
require('dotenv').config({ path: path.join(__dirname,"../../config/", '.env') })

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    config.env.googleRefreshToken = process.env.REFRESH_TOKEN
    config.env.googleClientId = process.env.GOOGLE_CLIENT_ID
    config.env.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

    return config;
}
