export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Split'iname kelią į segmentus, kad suprastume struktūrą
  const segments = path.split('/').filter(s => s !== '');

  // Jei turime bent 2 segmentus (Vardas ir IBAN) ir tai nėra statinis failas
  if (segments.length >= 2 && !segments[0].includes('.')) {
    
    // Tikriname, kad pirmas segmentas nebūtų sisteminis failas
    if (segments[0] !== 'dalintis.html' && segments[0] !== 'index.html') {
      
      // Tiesiog fone paimame ir grąžiname dalintis.html turinį.
      // Naršyklė gaus šį failą, bet adreso juostoje pasiliks gražus /Vardas/IBAN kelias.
      return context.env.ASSETS.fetch(new URL('/dalintis.html', url.origin));
    }
  }

  // Visiems kitiems failams (index.html, css, js) leidžiame krautis standartiniu būdu
  return context.next();
}
