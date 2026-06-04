import React, { useEffect, useState } from 'react';
import OrderCheckout from './OrderCheckout';

export default function ReviewHost() {
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const openPendingReview = () => {
      try {
        const rawPending = sessionStorage.getItem('pendingReviewOrder');
        const rawAuto = sessionStorage.getItem('showReviewAfterAuth');
        if (!rawPending) {
          if (rawAuto) {
            sessionStorage.removeItem('showReviewAfterAuth');
          }
          return;
        }

        const pending = JSON.parse(rawPending);
        const detail = {
          order: pending.orderId ? { _id: pending.orderId } : null,
          product: { name: pending.productName || 'votre produit' },
          opened: true,
          complete: () => {},
        };
        sessionStorage.removeItem('pendingReviewOrder');
        if (rawAuto) {
          sessionStorage.removeItem('showReviewAfterAuth');
        }

        if (!detail.order?._id) {
          return;
        }

        window.dispatchEvent(new CustomEvent('star-mousse:order-saved', { detail }));
      } catch (e) {
        // ignore
      }
    };

    openPendingReview();
    window.addEventListener('star-mousse:pending-review-ready', openPendingReview);
    return () => window.removeEventListener('star-mousse:pending-review-ready', openPendingReview);
  }, []);

  return (
    <OrderCheckout
      form={form}
      setForm={setForm}
      subtotal={0}
      delivery={0}
      total={0}
      fmt={(v) => `${Number(v||0).toFixed(2)} DT`}
      qty={qty}
      setQty={setQty}
      loading={false}
      onSubmit={() => {}}
      buttonLabel={"Commander maintenant"}
      hideCheckout={true}
    />
  );
}
