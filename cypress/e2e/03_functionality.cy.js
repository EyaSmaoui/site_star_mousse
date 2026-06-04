/**
 * TEST E2E - FUNCTIONAL TESTS
 * Vérifier que les fonctionnalités principales marchent
 */

describe('Core Functionality', () => {
  
  it('Should load homepage without errors', () => {
    cy.visit('http://localhost:3000', { timeout: 10000 });
    
    // Page should load
    cy.get('body').should('exist');
    
    // No major errors
    cy.get('h1, h2').should('have.length.greaterThan', 0);
  });

  it('Should search for products', () => {
    cy.visit('http://localhost:3000');
    
    cy.get('input[placeholder*="Recherch"], input[type="search"]')
      .type('matelas');
    
    cy.get('button:contains("Recherch"), button[type="submit"]')
      .first()
      .click();
    
    // Should show results
    cy.get('[data-cy="product-card"], .product-item, .product-card')
      .should('have.length.greaterThan', 0);
  });

  it('Should add product to cart', () => {
    cy.visit('http://localhost:3000');
    
    // Click on first product
    cy.get('[data-cy="product-card"], .product-item, .product-card')
      .first()
      .click();
    
    cy.wait(1000);
    
    // Click add to cart button
    cy.get('button:contains("Ajouter"), button:contains("Panier"), [data-cy="add-to-cart"]')
      .first()
      .click({ force: true });
    
    // Should show success message
    cy.get('[data-cy="success-message"], .success, .alert-success, [role="alert"]')
      .should('be.visible');
  });

  it('Should filter products by category', () => {
    cy.visit('http://localhost:3000');
    
    // Click on filter/category
    cy.get('button:contains("Catégorie"), [data-cy="category-filter"], .category-btn')
      .first()
      .click({ force: true });
    
    cy.wait(500);
    
    // Results should update
    cy.get('[data-cy="product-card"], .product-item, .product-card')
      .should('have.length.greaterThan', 0);
  });

  it('Should load products without errors', () => {
    cy.visit('http://localhost:3000/products');
    
    cy.wait(2000);
    
    // Should have product list
    cy.get('[data-cy="product-card"], .product-item, .product-card')
      .should('have.length.greaterThan', 0);
  });

  it('Should open chatbot and send message', () => {
    cy.visit('http://localhost:3000');
    
    // Find and click chatbot launcher
    cy.get('[data-cy="chatbot-launcher"], .chatbot-launcher, button:contains("Chat")')
      .first()
      .click({ force: true });
    
    cy.wait(1000);
    
    // Type message
    cy.get('input[placeholder*="message"], input[placeholder*="Message"]')
      .type('Bonjour');
    
    // Send message
    cy.get('button:contains("Envoyer"), button[type="submit"]')
      .last()
      .click();
    
    // Should receive response
    cy.get('[data-cy="bot-message"], .bot-message, .message-item')
      .should('have.length.greaterThan', 0);
  });
});
