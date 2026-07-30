import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const SEO = (await vi.importActual('../shared/SEO.js')).default;

describe('SEO', () => {
  it('updates document head metadata for a route', async () => {
    render(
      <MemoryRouter initialEntries={['/promos']}>
        <Routes>
          <Route path="/promos" element={<SEO />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.title).toContain('Promotions matelas');
      expect(document.querySelector('meta[name="description"]').content).toContain('Offres speciales Star Mousse');
      expect(document.querySelector('link[rel="canonical"]').href).toContain('/promos');
    });
  });

  it('sets metadata for checkout and order confirmation pages', async () => {
    render(
      <MemoryRouter initialEntries={['/checkout']}>
        <Routes>
          <Route path="/checkout" element={<SEO />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.title).toContain('Checkout - Star Mousse Tunisie');
      expect(document.querySelector('meta[name="description"]').content).toContain('Finalisez votre commande Star Mousse');
      expect(document.querySelector('link[rel="canonical"]').href).toContain('/checkout');
    });

    render(
      <MemoryRouter initialEntries={['/order-confirmation/order-123']}>
        <Routes>
          <Route path="/order-confirmation/:orderId" element={<SEO />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(document.title).toContain('Confirmation de commande');
      expect(document.querySelector('meta[name="description"]').content).toContain('Merci pour votre commande Star Mousse');
      expect(document.querySelector('link[rel="canonical"]').href).toContain('/order-confirmation/order-123');
    });
  });
});
