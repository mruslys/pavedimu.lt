export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Tikriname struktūrą: /Vardas/IBAN/Paskirtis/Suma
  const match = path.match(/^\/([^/]+)\/([^/]+)(?:\/([^/]+))?(?:\/([^/]+))?$/);

  if (match) {
    const name = match[1];
    const iban = match[2];
    const purpose = match[3] || '-';
    const amount = match[4] || '';

    // Jei bandoma pasiekti realius failus ar assets, praleidžiame juos tiesiogiai
    if (name === 'dalintis.html' || name === 'index.html' || name.includes('.')) {
      return context.next();
    }

    // Fone sugeneruojame užklausą į dalintis.html su URL parametrais
    const newUrl = new URL(url.origin + '/dalintis.html');
    newUrl.searchParams.set('name', name);
    newUrl.searchParams.set('iban', iban);
    if (purpose && purpose !== '-') newUrl.searchParams.set('purpose', purpose);
    if (amount) newUrl.searchParams.set('amount', amount);

    // Grąžiname dalintis.html turinį, bet vartotojo adreso juostoje URL nesikeičia
    return context.env.ASSETS.fetch(newUrl);
  }

  // Visiems kitiems puslapiams (index.html, css, js) leidžiame krautis paprastai
  return context.next();
}
