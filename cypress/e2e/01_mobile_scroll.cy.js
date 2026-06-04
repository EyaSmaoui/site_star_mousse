/**
 * TEST E2E - MOBILE SCROLL FIX VERIFICATION
 * Vérifier que le scroll mobile fonctionne
 */

describe('Mobile Scroll Fixes', () => {
  beforeEach(() => {
    cy.viewport('iphone-se2');
    cy.visit('http://localhost:3000');
  });

  it('Should allow scrolling when chatbot is open on mobile', () => {
    cy.get('body', { timeout: 10000 }).should('exist');
    
    cy.window().then(win => {
      const initialScroll = win.scrollY;
      cy.wrap(initialScroll).as('initialScroll');
    });

    cy.get('button').first().click({ force: true });

    cy.window().then(win => {
      const bodyStyle = win.getComputedStyle(document.body);
      const overflow = bodyStyle.overflow;
      expect(overflow).not.to.equal('hidden');
    });

    cy.scrollTo(0, 200);

    cy.window().then(win => {
      expect(win.scrollY).to.be.greaterThan(0);
    });
  });
});
