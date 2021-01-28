import * as helpers from '../support/helpers'

/// <reference types="cypress" />

/**
 * @abstract:See overview of progress
 *
 * @criteria
  When viewing the dashboard as a logged in user:
  - The app gets my language and words progress from the server
  - I'm shown my language
  - I'm shown the words to learn for the language
  - I'm shown my guess count for correct and incorrect for each word
  - I'm given a button/link to start learning
  - I'm shown the total score for guessing words
*/
describe(`User story: User's dashboard`, function () {
  beforeEach(() => {
    cy.server()
      .route({
        method: 'GET',
        url: '/api/language',
        status: 200,
        response: 'fixture:language',
      })
      .as('languageRequest')
  })

  beforeEach(() => {
    helpers.Login()
  })

  it('has h2 with title, total score, subtitle and link', () => {
    cy.fixture('language.json').then(({ language }) => {
      cy.get('main div').within(($div) => {
        cy.get('h2').should('contain', `${language.name}`)

        cy.root().should(
          'contain',
          `Total correct answers: 7`
        )

        cy.get('a')
          .should('have.attr', 'href', '/learn')
          .and('have.text', 'Start Learning French!')

        cy.get('h2').should('have.text', 'Here are your French Practice Words')
      })
    })
  })

  it(`shows an LI and link for each language`, () => {
    cy.wait('@languageRequest')
    cy.fixture('language.json').then(({ words }) => {
      words.forEach((word, idx) => {
        cy.get('main div li')
          .eq(idx)
          .within(($li) => {
            cy.get('h4').should('have.text', 'original 1')

            cy.root().should(
              'contain',
              `Correct: ${word.correct_count}`
            )

            cy.root().should(
              'contain',
              `Total correct answers: ${word.total_score}`
            )
          })
      })
    })
  })
})
