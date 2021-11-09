const sign = require('jwt-encode');
/**
 * This spec needs to run first to make sure the user is logged in before accessing
 * the normal flow of the application. Renaming the file to '01_[filename]' does the trick :).
 */

describe("Google Login", () => {

    it('should do somethign', () => {
        cy.loginByGoogle()
    })
});