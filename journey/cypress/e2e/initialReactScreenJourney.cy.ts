export {}

describe("As a user", () => {
  afterEach(() => {
    Cypress.session.clearAllSavedSessions();
  })
  it('I should be able to click the count button and see the counter increase', () => {
    cy.visit("/")
    const reactButton = cy.findByRole("button", {name: "count is 0"});
    reactButton.should("exist");

    reactButton.click();
    cy.findByText("count is 1").should("exist");

    reactButton.click();
    cy.findByText("count is 2").should("exist");

  });

})