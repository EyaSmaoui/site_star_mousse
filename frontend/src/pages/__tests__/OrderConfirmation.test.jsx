import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

const OrderConfirmation = (await vi.importActual('../OrderConfirmation.jsx')).default;

describe('OrderConfirmation', () => {
  beforeEach(() => {
    localStorage.clear();
    axios.get.mockReset();
  });

  it('loads and displays order details from the API', async () => {
    const mockOrder = {
      _id: 'order-123',
      customerEmail: 'jean@example.com',
      status: 'confirmée',
      createdAt: '2025-01-01T12:00:00.000Z',
      total: 1299.99,
      customerName: 'Jean Dupont',
      address: '123 Rue de la Paix',
      phone: '+216 92 123 456',
      items: [{ name: 'Matelas Relax Plus', quantity: 1, price: 1299.99 }],
    };

    axios.get.mockResolvedValueOnce({ data: mockOrder });

    render(
      <MemoryRouter initialEntries={['/order-confirmation/order-123?email=jean@example.com']}>
        <Routes>
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Commande confirmée/i)).toBeInTheDocument();
    expect(screen.getByText(/jean@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Relax Plus/i)).toBeInTheDocument();
    expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    expect(localStorage.getItem('cart')).toBeNull();
  });
});
