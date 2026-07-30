export const trackEvent = (eventName, payload = {}) => {
  const eventPayload = {
    ...payload,
    timestamp: new Date().toISOString(),
  };

  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...eventPayload });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventPayload);
  }

  window.dispatchEvent(new CustomEvent("star-mousse:analytics", {
    detail: { eventName, payload: eventPayload },
  }));
};

export const trackInnovationLead = (feature, payload = {}) => {
  trackEvent("innovation_lead", {
    feature,
    ...payload,
  });
};
