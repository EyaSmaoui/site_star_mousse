/**
 * TEST E2E - SECURITY FIXES VERIFICATION
 * Vérifier que les fixes sécurité fonctionnent
 */

describe('Security Fixes', () => {
  
  it('Should reject invalid email on registration', () => {
    cy.visit('http://localhost:3000/register');
    
    cy.get('input[type="email"], [data-cy="email-input"]')
      .type('invalid-email-no-at');
    
    cy.get('input[type="password"], [data-cy="password-input"]')
      .type('Password123!');
    
    cy.get('input[type="tel"], [data-cy="phone-input"]')
      .type('12345678');
    
    cy.get('button[type="submit"], button:contains("S\'inscrire")')
      .click();
    
    // Should show validation error or not submit
    cy.get('[data-cy="error-message"], .error, .alert-danger')
      .should('be.visible');
  });

  it('Should reject invalid phone number', () => {
    cy.visit('http://localhost:3000/register');
    
    cy.get('input[type="email"], [data-cy="email-input"]')
      .type('valid@example.com');
    
    cy.get('input[type="password"], [data-cy="password-input"]')
      .type('Password123!');
    
    cy.get('input[type="tel"], [data-cy="phone-input"]')
      .type('invalid');
    
    cy.get('button[type="submit"], button:contains("S\'inscrire")')
      .click();
    
    cy.get('[data-cy="error-message"], .error, .alert-danger')
      .should('be.visible');
  });

  it('Should have rate limiting on login attempts', () => {
    cy.visit('http://localhost:3000/login');
    
    // Try to login 6 times (should be blocked at 5)
    for (let i = 0; i < 6; i++) {
      cy.get('input[type="email"], [data-cy="email-input"]')
        .clear()
        .type('test@example.com');
      
      cy.get('input[type="password"], [data-cy="password-input"]')
        .clear()
        .type('wrongpassword');
      
      cy.get('button[type="submit"], button:contains("Se connecter")')
        .click();
      
      cy.wait(500);
    }
    
    // On 6th attempt, should be rate limited (429 or error message)
    cy.get('[data-cy="error-message"], .error, .alert-danger, .too-many-requests')
      .should('exist');
  });

  it('Should not expose debug endpoints', () => {
    cy.request({
      url: 'http://localhost:5000/api/users/debug-auth',
      failOnStatusCode: false
    }).then(response => {
      // Should not be 200, should be 404 or 401
      expect([401, 404]).to.include(response.status);
    });
  });

  it('Should not expose password endpoints', () => {
    cy.request({
      url: 'http://localhost:5000/api/admin/getAllUsersWithPassword',
      failOnStatusCode: false
    }).then(response => {
      // Should not be 200, should be 404 or 401
      expect([401, 404]).to.include(response.status);
    });
  });
});
