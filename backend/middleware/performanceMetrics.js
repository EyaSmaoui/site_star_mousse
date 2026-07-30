const metrics = {
  requests: 0,
  errors: 0,
  slowRequests: 0,
  totalDurationMs: 0,
  byRoute: new Map(),
};

const SLOW_REQUEST_MS = Number(process.env.SLOW_REQUEST_MS || 500);

const performanceMetricsMiddleware = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const route = req.route?.path ? `${req.method} ${req.baseUrl || ''}${req.route.path}` : `${req.method} ${req.path}`;
    const status = res.statusCode;

    metrics.requests += 1;
    metrics.totalDurationMs += durationMs;
    metrics.errors += status >= 400 ? 1 : 0;
    metrics.slowRequests += durationMs > SLOW_REQUEST_MS ? 1 : 0;

    const routeMetrics = metrics.byRoute.get(route) || {
      requests: 0,
      errors: 0,
      slowRequests: 0,
      totalDurationMs: 0,
    };

    routeMetrics.requests += 1;
    routeMetrics.errors += status >= 400 ? 1 : 0;
    routeMetrics.slowRequests += durationMs > SLOW_REQUEST_MS ? 1 : 0;
    routeMetrics.totalDurationMs += durationMs;
    metrics.byRoute.set(route, routeMetrics);
  });

  next();
};

const getMetricsSnapshot = () => {
  const averageDurationMs = metrics.requests ? metrics.totalDurationMs / metrics.requests : 0;
  const errorRate = metrics.requests ? (metrics.errors / metrics.requests) * 100 : 0;

  return {
    requests: metrics.requests,
    errors: metrics.errors,
    errorRate: Number(errorRate.toFixed(2)),
    slowRequests: metrics.slowRequests,
    averageDurationMs: Number(averageDurationMs.toFixed(2)),
    routes: Array.from(metrics.byRoute.entries()).map(([route, data]) => ({
      route,
      requests: data.requests,
      errors: data.errors,
      slowRequests: data.slowRequests,
      averageDurationMs: data.requests ? Number((data.totalDurationMs / data.requests).toFixed(2)) : 0,
    })),
  };
};

module.exports = {
  performanceMetricsMiddleware,
  getMetricsSnapshot,
};
