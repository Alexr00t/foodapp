# FoodApp v2 - Jurnal Calorii & Nutrienți

Aplicație web pentru tracking-ul nutrițional cu dashboard compact și donut charts.

## Caracteristici

- **Dashboard compact**: 6 carduri cu donut charts pentru macro-nutrienți
- **Jurnal alimentar**: Tracking zilnic cu căutare avansată
- **Baza de date extinsă**: 1,290+ produse și 2,381+ înregistrări
- **Design responsive**: Optimizat pentru ecrane mici
- **Gradient fix**: Donut charts cu segment roșu pentru exces

## Lansare

### 🚀 Metoda simplă (Recomandată):
1. **Dublu-click pe `start_server.bat`**
2. **Se va deschide automat browser-ul**
3. **Aplicația se încarcă automat cu toate datele**

### 🔧 Metoda manuală:
1. **Deschide terminal în acest folder**
2. **Rulează**: `python -m http.server 8080`
3. **Accesează**: http://localhost:8080

### ⚠️ Dacă nu vezi datele:
- Mergi la tab-ul **"Setări"**
- Click pe **"🔄 Reîncarcă toate datele din JSON"**

## Fișiere principale

- `index.html` - Interfața principală
- `app.js` - Logica aplicației
- `enhancements.js` - Îmbunătățiri v2 (dashboard, donut charts)
- `style.css` - Stiluri v2 (carduri compacte)
- `journal.json` - Jurnalul alimentar (2,381 înregistrări)
- `products.json` - Baza de date produse (1,290 produse)
- `targets.json` - Țintele nutriționale

## Versiunea v2

- Carduri compacte (110px lățime)
- Donut charts cu gradient corect
- Segment roșu pentru valori > 100%
- Design optimizat pentru mobile
- Baza de date actualizată

## Dezvoltare

Pentru modificări, editează fișierele și refresh browser-ul.
