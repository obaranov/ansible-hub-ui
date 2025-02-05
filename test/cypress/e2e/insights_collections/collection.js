const apiPrefix = Cypress.env('apiPrefix');
const uiPrefix = Cypress.env('uiPrefix');

describe('collection tests', () => {
  before(() => {
    cy.deleteNamespacesAndCollections();
  });

  beforeEach(() => {
    cy.on('uncaught:exception', () => false);
    cy.login();
  });

  it('deletes an entire collection', () => {
    cy.galaxykit('-i collection upload test_namespace test_collection');
    cy.galaxykit('-i collection move test_namespace test_collection');

    cy.visit(`${uiPrefix}repo/published/test_namespace/test_collection`);

    cy.openHeaderKebab();
    cy.get('[data-cy=delete-collection]').click();
    cy.get('input[id=delete_confirm]').click();
    cy.get('button').contains('Delete').click();
    cy.contains('No collections yet', { timeout: 10000 });
  });

  it('deletes a collection version', () => {
    cy.galaxykit('-i collection upload my_namespace my_collection');
    cy.galaxykit('-i collection move my_namespace my_collection');

    cy.visit(`${uiPrefix}collections`);

    cy.intercept('GET', `${apiPrefix}_ui/v1/namespaces/my_namespace/?*`).as(
      'reload',
    );
    cy.get(
      `a[href*="${uiPrefix}repo/published/my_namespace/my_collection"]`,
    ).click();
    cy.openHeaderKebab();
    cy.get('[data-cy=delete-collection-version]').click();
    cy.get('input[id=delete_confirm]').click();
    cy.get('button').contains('Delete').click();
    cy.wait('@reload', { timeout: 50000 });
    cy.wait(5000);
    cy.get('[data-cy="AlertList"] h4[class=pf-c-alert__title]').should(
      'have.text',
      'Success alert:Collection "my_collection v1.0.0" has been successfully deleted.',
    );
  });
});
