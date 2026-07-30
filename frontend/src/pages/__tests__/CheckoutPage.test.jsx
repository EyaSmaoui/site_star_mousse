import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

const navigateMock = vi.fn();

vi.mock('axios');
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const CheckoutPage = (await vi.importActual('../CheckoutPage.jsx')).default;

describe('CheckoutPage', () => {
  beforeEach(() => {
    navigateMock.mockClear();
    localStorage.clear();
    axios.get.mockReset();
    axios.post.mockReset();
  });

  it('submits a cash-on-delivery order and navigates to confirmation', async () => {
    localStorage.setItem('cart', JSON.stringify([{ name: 'Matelas Relax Plus', price: 999, quantity: 1 }]));

    axios.get.mockResolvedValueOnce({ data: [{ region: 'Tunis', cost: 30, minDays: 1, maxDays: 2 }] });
    axios.post.mockImplementation((url) => {
      if (url.includes('/orders/addOrder')) {
        return Promise.resolve({ data: { _id: 'order-123' } });
      }
      if (url.includes('/payments/confirm-payment')) {
        return Promise.resolve({ data: { status: 'ok' } });
      }
      return Promise.resolve({ data: {} });
    });

    render(
      <MemoryRouter>
        <CheckoutPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    fireEvent.change(screen.getByPlaceholderText(/Jean Dupont/i), { target: { value: 'Jean Dupont' } });
    fireEvent.change(screen.getByPlaceholderText(/jean@example.com/i), { target: { value: 'jean@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/\+216 92 123 456/i), { target: { value: '+216 92 123 456' } });
    fireEvent.change(screen.getByPlaceholderText(/123 Rue de la Paix/i), { target: { value: '123 Rue de la Paix' } });
    fireEvent.click(screen.getByLabelText(/conditions de vente/i));
    fireEvent.click(screen.getByRole('button', { name: /Confirmer la commande/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        '/api/orders/addOrder',
        expect.objectContaining({
          customerName: 'Jean Dupont',
          customerEmail: 'jean@example.com',
          phone: '+216 92 123 456',
          address: '123 Rue de la Paix',
          region: 'Tunis',
          paymentMethod: 'cash_on_delivery',
          total: 1029,
        })
      );
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/order-confirmation/order-123?email=jean%40example.com');
    });
  });
});
