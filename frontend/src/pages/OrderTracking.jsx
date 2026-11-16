import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiClock, FiDownload, FiPackage, FiTruck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import httpClient from '../services/httpClient';

const STATUS_STEPS = [
  { status: 'en attente', label: 'Commande reçue', icon: FiClock },
  { status: 'en cours', label: 'En préparation', icon: FiPackage },
  { status: 'expédié', label: 'Expédiée', icon: FiTruck },
  { status: 'livré', label: 'Livrée', icon: FiCheckCircle },
];

const STATUS_LABELS = {
  'en attente': 'En attente',
  'en cours': 'En préparation',
  'expédié': 'Expédiée',
  'livré': 'Livrée',
  'annulé': 'Annulée',
};

const formatMoney = (amount) => `${Number(amount || 0).toLocaleString('fr-TN', { maximumFractionDigits: 2 })} DT`;
const formatDate = (value) => value
  ? new Date(value).toLocaleString('fr-TN', { dateStyle: 'medium', timeStyle: 'short' })
  : '';

export default function OrderTracking() {
  const [orderCode, setOrderCode] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const loadAccountOrders = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    setAccountLoading(true);
    try {
      const response = await httpClient.get('/api/orders/my-orders');
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(error.message || 'Impossible de charger vos commandes.');
    } finally {
      setAccountLoading(false);
    }
  }, []);

  useEffect(() => { loadAccountOrders(); }, [loadAccountOrders]);

  const searchOrder = async (event) => {
    event.preventDefault();
    const normalizedCode = orderCode.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedCode || !normalizedEmail) {
      toast.info('Saisissez le numéro de commande et l’e-mail utilisé lors de l’achat.');
      return;
    }

    setLoading(true);
    setOrder(null);
    try {
      const response = await httpClient.get(`/api/orders/${encodeURIComponent(normalizedCode)}`, {
        params: { email: normalizedEmail },
      });
      setOrder(response.data);
    } catch (error) {
      toast.error(error.response?.status === 404 || error.response?.status === 403
        ? 'Commande introuvable pour ce numéro et cet e-mail.'
        : error.message || 'Le suivi est momentanément indisponible.');
    } finally {
      setLoading(false);
    }
  };

  const visibleOrders = filter === 'all' ? orders : orders.filter((item) => item.status === filter);
  const currentStep = STATUS_STEPS.findIndex((step) => step.status === order?.status);

  return (
    <main className="min-h-screen bg-paper px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-ink hover:underline print:hidden">
          <FiArrowLeft aria-hidden="true" /> Retour à la boutique
        </Link>

        <header className="mb-8 rounded-2xl bg-white p-6 shadow-sm sm:p-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted">Votre espace de livraison</p>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">Suivez votre commande</h1>
          <p className="mt-3 max-w-2xl text-muted">Consultez son avancement avec votre numéro de commande et l’adresse e-mail utilisée lors de l’achat.</p>

          <form onSubmit={searchOrder} className="mt-7 grid gap-3 sm:grid-cols-[1fr_1fr_auto] print:hidden">
            <label className="grid gap-1 text-sm font-medium text-ink">
              Numéro de commande
              <input
                required
                value={orderCode}
                onChange={(event) => setOrderCode(event.target.value)}
                autoComplete="off"
                placeholder="Ex. 672a…"
                className="min-h-12 rounded-lg border border-hairline px-4"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-ink">
              E-mail de la commande
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="vous@exemple.com"
                className="min-h-12 rounded-lg border border-hairline px-4"
              />
            </label>
            <button type="submit" disabled={loading} className="min-h-12 self-end rounded-lg bg-ink px-6 font-semibold text-white disabled:opacity-60">
              {loading ? 'Recherche…' : 'Suivre ma commande'}
            </button>
          </form>
        </header>

        {order && (
          <section id="order-details" className="mb-8 rounded-2xl border border-hairline bg-white p-6 shadow-sm sm:p-9" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-5">
              <div>
                <p className="text-sm text-muted">Commande du {formatDate(order.createdAt)}</p>
                <h2 className="mt-1 font-serif text-2xl text-ink">Référence #{String(order._id).slice(-8).toUpperCase()}</h2>
              </div>
              <span className="rounded-full bg-paper px-4 py-2 font-semibold text-ink">{STATUS_LABELS[order.status] || order.status}</span>
            </div>

            {order.status === 'annulé' ? (
              <p className="my-6 rounded-lg bg-red-50 p-4 text-red-800">Cette commande a été annulée. Contactez notre équipe si vous avez besoin d’aide.</p>
            ) : (
              <ol className="my-8 grid gap-4 sm:grid-cols-4" aria-label="Étapes de livraison">
                {STATUS_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const complete = currentStep >= index;
                  return (
                    <li key={step.status} className={`rounded-xl border p-4 ${complete ? 'border-ink bg-paper' : 'border-hairline'}`}>
                      <Icon className={`mb-3 h-5 w-5 ${complete ? 'text-ink' : 'text-muted'}`} aria-hidden="true" />
                      <p className={`text-sm font-semibold ${complete ? 'text-ink' : 'text-muted'}`}>{step.label}</p>
                      {index === currentStep && <p className="mt-1 text-xs text-muted">Étape actuelle</p>}
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="grid gap-6 md:grid-cols-[1fr_260px]">
              <div>
                <h3 className="mb-3 font-semibold text-ink">Articles commandés</h3>
                <ul className="divide-y divide-hairline">
                  {(order.items || order.products || []).map((item, index) => (
                    <li key={`${item.product || item.name}-${index}`} className="flex justify-between gap-4 py-3 text-sm">
                      <span>{item.name}{item.dimension ? ` · ${item.dimension}` : ''} × {item.quantity}</span>
                      <span className="shrink-0 font-medium">{formatMoney(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <aside className="h-fit rounded-xl bg-paper p-4">
                <div className="flex justify-between text-sm"><span>Livraison</span><span>{formatMoney(order.shippingCost)}</span></div>
                <div className="mt-3 flex justify-between border-t border-hairline pt-3 font-bold text-ink"><span>Total</span><span>{formatMoney(order.total)}</span></div>
                <p className="mt-3 text-xs text-muted">{order.address}{order.region ? `, ${order.region}` : ''}</p>
                <button type="button" onClick={() => window.print()} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-ink px-3 text-sm font-semibold text-ink hover:bg-white print:hidden">
                  <FiDownload aria-hidden="true" /> Imprimer le récapitulatif
                </button>
              </aside>
            </div>
          </section>
        )}

        {localStorage.getItem('token') && (
          <section className="rounded-2xl bg-white p-6 shadow-sm sm:p-9">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div><p className="text-sm font-semibold uppercase tracking-wider text-muted">Espace client</p><h2 className="mt-1 font-serif text-2xl text-ink">Vos dernières commandes</h2></div>
              <button type="button" onClick={loadAccountOrders} disabled={accountLoading} className="rounded-lg border border-hairline px-4 py-2 text-sm font-semibold text-ink disabled:opacity-60">{accountLoading ? 'Actualisation…' : 'Actualiser'}</button>
            </div>
            <div className="my-5 flex flex-wrap gap-2">
              {['all', ...STATUS_STEPS.map((step) => step.status), 'annulé'].map((status) => (
                <button key={status} type="button" onClick={() => setFilter(status)} aria-pressed={filter === status} className={`rounded-full px-3 py-2 text-sm ${filter === status ? 'bg-ink text-white' : 'bg-paper text-ink'}`}>
                  {status === 'all' ? 'Toutes' : STATUS_LABELS[status]}
                </button>
              ))}
            </div>
            {visibleOrders.length ? (
              <ul className="divide-y divide-hairline">
                {visibleOrders.map((item) => (
                  <li key={item._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div><p className="font-semibold text-ink">Commande #{String(item._id).slice(-8).toUpperCase()}</p><p className="text-sm text-muted">{formatDate(item.createdAt)} · {STATUS_LABELS[item.status] || item.status}</p></div>
                    <div className="text-right"><p className="font-semibold text-ink">{formatMoney(item.total)}</p><button type="button" onClick={() => { setOrder(item); window.setTimeout(() => document.getElementById('order-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); }} className="text-sm text-muted underline">Voir le suivi</button></div>
                  </li>
                ))}
              </ul>
            ) : <p className="py-6 text-muted">{accountLoading ? 'Chargement de vos commandes…' : 'Aucune commande dans cette catégorie.'}</p>}
          </section>
        )}
      </div>
      <style>{'@media print { body * { visibility: hidden; } main, main * { visibility: visible; } main { position: absolute; inset: 0; padding: 0; background: white; } .print\\:hidden { display: none !important; } }'}</style>
    </main>
  );
}
