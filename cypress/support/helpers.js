import jwt from 'jsonwebtoken'
/// <reference types="cypress" />

export function makeLoginToken() {
  const loginUser = {
    user_id: 123,
    name: 'Test name of user',
  }
  return jwt.sign(loginUser, 'test-secret', {
    subject: 'test-username',
    expiresIn: '2m',
    algorithm: 'HS256',
  })
}

export function Login(){
    const loginToken = makeLoginToken()

    cy.server()
      .route({
        method: 'POST',
        url: '/api/auth/token',
        // server determins credentials are correct
        status: 200,
        response: {
          authToken: loginToken
        },
      })
      .as('loginRequest')

    const loginUser = {
      username: 'username',
      password: 'password',
    }
    cy.visit('/login')

    cy.get('main form').within($form => {
      cy.get('#login-username-input')
        .type(loginUser.username)
      cy.get('#login-password-input')
        .type(loginUser.password)
      cy.root()
        .submit()});
}