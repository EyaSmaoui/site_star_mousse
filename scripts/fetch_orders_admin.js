(async ()=>{
  try {
    const axios = require('axios');
    const loginRes = await axios.post('http://localhost:5000/api/users/login', { email: 'admin@starmousse.com', password: 'ChangeMe123!' });
    console.log('LOGIN STATUS', loginRes.status);
    const token = loginRes.data?.token;
    if (!token) { console.error('No token:', loginRes.data); process.exit(1); }

    const ordersRes = await axios.get('http://localhost:5000/api/orders/getAllOrders', { headers: { Authorization: 'Bearer ' + token }, params: { limit: 5 } });
    console.log('ORDERS STATUS', ordersRes.status);
    const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
    console.log('SAMPLE ORDERS', JSON.stringify(orders.slice(0,5), null, 2));
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  }
})();
