export async function createPayPalOrder(amount:number, currency='USD'){
  const b64 = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const base='https://api-m.paypal.com';
  const tokenRes = await fetch(`${base}/v1/oauth2/token`, {method:'POST', headers:{'Authorization':`Basic ${b64}`,'Content-Type':'application/x-www-form-urlencoded'}, body:'grant_type=client_credentials'}).then(r=>r.json());
  const order = await fetch(`${base}/v2/checkout/orders`, {method:'POST', headers:{'Authorization':`Bearer ${tokenRes.access_token}`,'Content-Type':'application/json'}, body: JSON.stringify({intent:'CAPTURE', purchase_units:[{amount:{currency_code:currency, value:(amount/100).toFixed(2)}}]})}).then(r=>r.json());
  return order;
}
export async function capturePayPalOrder(id:string){
  const b64 = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const base='https://api-m.paypal.com';
  const tokenRes = await fetch(`${base}/v1/oauth2/token`, {method:'POST', headers:{'Authorization':`Basic ${b64}`,'Content-Type':'application/x-www-form-urlencoded'}, body:'grant_type=client_credentials'}).then(r=>r.json());
  return fetch(`${base}/v2/checkout/orders/${id}/capture`, {method:'POST', headers:{'Authorization':`Bearer ${tokenRes.access_token}`}}).then(r=>r.json());
}
