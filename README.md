# 🍎 FoodApp - Jurnal Calorii & Nutrienți

O aplicație web modernă pentru urmărirea consumului zilnic de calorii și nutrienți, cu funcționalități avansate de analiză și vizualizare.

## ✨ Caracteristici

### 📊 **Vizualizări Interactive**
- **Donut Charts** pentru desktop (≥1024px)
- **Bar Charts orizontale** pentru mobile (≤768px)
- **Charts responsive** care se adaptează automat la dimensiunea ecranului
- **Actualizare în timp real** a valorilor când introduci cantitatea

### 🍽️ **Management Produse**
- **Baza de date extinsă** cu produse și restaurante
- **Căutare avansată** cu sinonime și taxonomie
- **Filtrare** după categorie și restaurant
- **Autotagging** automat pentru produse noi

### 📈 **Analiză și Rapoarte**
- **Evoluții zilnice, săptămânale și lunare**
- **Comparație produse** cu grafice interactive
- **Targets personalizabile** pentru fiecare nutrient
- **Export date** în format JSON

### 🎯 **Funcționalități Mobile**
- **Interface optimizată** pentru dispozitive mobile
- **Bar charts orizontale** cu culori intuitive
- **Layout compact** cu elemente apropiate
- **Touch-friendly** pentru navigare ușoară

## 🚀 **Instalare și Utilizare**

### **Metoda 1: GitHub Pages (Recomandată)**
1. **Fork** acest repository
2. **Activează GitHub Pages** în setările repository-ului
3. **Accesează** aplicația la `https://username.github.io/FoodApp-GitHub`

### **Metoda 2: Local Development**
```bash
# Clonează repository-ul
git clone https://github.com/username/FoodApp-GitHub.git
cd FoodApp-GitHub

# Pornește serverul local
python -m http.server 8080
# sau
npx serve .

# Accesează aplicația la http://localhost:8080
```

### **Metoda 3: Direct în Browser**
- **Deschide** `index.html` direct în browser
- **Funcționează** offline cu datele preîncărcate

## 📱 **Screenshot-uri**

### **Desktop View**
- Donut charts pentru vizualizare nutrienți
- Interface completă cu toate funcționalitățile
- Grafice interactive pentru analiză

### **Mobile View**
- Bar charts orizontale responsive
- Layout compact optimizat pentru touch
- Navigare ușoară între secțiuni

## 🛠️ **Tehnologii Utilizate**

- **HTML5** - Structura semantică
- **CSS3** - Styling responsive și animații
- **JavaScript ES6+** - Logică aplicație și interacțiuni
- **Chart.js** - Grafice interactive
- **Local Storage** - Persistența datelor
- **File System Access API** - Salvare locală

## 📊 **Structura Datelor**

### **Produse**
```json
{
  "name": "Măr",
  "base": "100g",
  "cal": 52,
  "pro": 0.3,
  "carb": 14.0,
  "fat": 0.2,
  "sug": 10.4,
  "fib": 2.4
}
```

### **Jurnal**
```json
{
  "date": "2024-01-15",
  "product": "Măr",
  "qty": 150,
  "unit": "g"
}
```

## 🎨 **Personalizare**

### **Culori și Teme**
- **Dark mode** implicit
- **Culori personalizabile** prin CSS variables
- **Tema responsive** pentru toate dispozitivele

### **Targets Personalizabile**
- **Calorii**: 2000 kcal (implicit)
- **Proteine**: 130g (implicit)
- **Carbohidrați**: 260g (implicit)
- **Grăsimi**: 70g (implicit)
- **Zaharuri**: 50g (implicit)
- **Fibre**: 30g (implicit)

## 📈 **Funcționalități Avansate**

### **Mobile Bar Charts**
- **Culori intuitive**: Verde până la 100%, roșu pentru depășire
- **Linie de target** la 50% pentru vizualizare clară
- **Contribuția produsului** suprapusă cu culori distincte
- **Actualizare în timp real** când introduci cantitatea

### **Responsive Design**
- **Breakpoints**: 768px (mobile), 1024px (desktop)
- **Layout adaptiv** pentru toate dimensiunile de ecran
- **Touch optimization** pentru dispozitive mobile

## 🔧 **Dezvoltare**

### **Structura Proiectului**
```
FoodApp-GitHub/
├── index.html          # Pagina principală
├── style.css           # Styling responsive
├── app.js             # Logică aplicație
├── enhancements.js    # Funcționalități suplimentare
├── products.json      # Baza de date produse
├── journal.json       # Jurnalul utilizatorului
├── targets.json       # Targeturi personalizabile
└── README.md          # Documentația proiectului
```

### **Contribuții**
1. **Fork** repository-ul
2. **Creează** o branch nouă pentru feature
3. **Commit** modificările
4. **Push** la branch-ul tău
5. **Creează** un Pull Request

## 📄 **Licență**

Acest proiect este disponibil sub licența MIT. Vezi fișierul `LICENSE` pentru detalii.

## 🤝 **Suport**

Pentru întrebări sau suport, te rugăm să creezi un issue în repository-ul GitHub.

## 🎯 **Roadmap**

- [ ] **PWA Support** - Aplicație progresivă web
- [ ] **Export PDF** - Rapoarte în format PDF
- [ ] **Sync Cloud** - Sincronizare în cloud
- [ ] **API Integration** - Integrare cu API-uri externe
- [ ] **Multi-language** - Suport pentru mai multe limbi

---

**Dezvoltat cu ❤️ pentru o viață mai sănătoasă!**