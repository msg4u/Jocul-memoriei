# Jocul Memoriei: Casele Animalelor 🧠🦊

**Jocul Memoriei: Casele Animalelor** este o aplicație web interactivă și un instrument didactic inovator, creat special pentru copii cu vârste între **4 și 7 ani**. Folosind mecanica clasică a unui joc de memorie îmbinată cu elemente narative, proiectul îi ajută pe cei mici să înțeleagă concepte complexe din biologie, precum habitatul natural și adaptarea speciilor la mediu.

Aplicația folosește inteligența artificială generativă prin platforma Google AI Studio pentru a ghida experiența copiilor și a le oferi explicații adaptate vârstei lor.

🔗 **Link Aplicație:** [https://jocul-memoriei.ai.studio](https://jocul-memoriei.ai.studio)

---

## 🚀 Conceptul Narativ și Științific

Pornind de la o poveste captivantă în care un vânt puternic creează „haos” în natură, jocul o are ca protagonistă pe Ana, care îi ajută pe copii să repare lucrurile:
- **Adaptarea la Mediu:** Copiii înțeleg că fiecare specie posedă trăsături fizice unice (blană groasă, cocoașe, aripioare) dezvoltate special pentru a supraviețui într-un anumit habitat.
- **Importanța Habitatului:** Jocul demonstrează empiric că mutarea unui animal din mediul său natural îi creează probleme reale de supraviețuire.
- **Dezvoltare Cognitivă:** Pe lângă componenta biologică, jocul antrenează memoria vizuală, atenția distributivă și asocierea logică.

---

## 🛠️ Tehnologii utilizate

Stiva tehnologică modernă asigură performanțe optime și o interfață fluidă, elemente esențiale pentru a menține atenția copiilor:

- **[Vite](https://vitejs.dev)** – Instrument de build ultra-rapid pentru aplicații frontend.
- **[TypeScript](https://typescript.org)** – Permite scrierea unui cod robust și sigur prin tipizare statică.
- **[Bun](https://bun.sh)** – Runtime JavaScript all-in-one și manager de pachete rapid.

---

## 💻 Instalare și Rulare Locală

Urmează pașii de mai jos pentru a configura și rula proiectul pe mașina ta locală:

### 1. Clonarea repository-ului
```bash
git clone https://github.com
cd Jocul-memoriei
```

### 2. Instalarea dependențelor
Se recomandă utilizarea **Bun** (conform fișierului `bun.lock` din repository):
```bash
bun install
```
Sau, dacă preferi managerul clasic **npm**:
```bash
npm install
```

### 3. Configurarea variabilelor de mediu
Generează fișierul `.env` local pornind de la cel de exemplu pentru a introduce cheile API necesare Google AI Studio:
```bash
cp .env.example .env
```

### 4. Rularea serverului de dezvoltare
Pornește aplicația în modul local:
```bash
bun run dev
# sau
npm run dev
```
Deschide adresa generată în terminal (de regulă `http://localhost:5173`) pentru a rula jocul în browser.

### 5. Compilarea pentru producție
Pentru a compila și optimiza proiectul în folderul `dist`:
```bash
bun run build
# sau
npm run build
```

---

## 📁 Structura Proiectului

```text
├── src/               # Codul sursă al aplicației (logica jocului, UI, stiluri)
├── .env.example       # Șablon pentru configurarea cheilor de acces AI Studio
├── bun.lock           # Fișierul de blocare a versiunilor de dependințe pentru Bun
├── index.html         # Fișierul HTML principal (punctul de intrare)
├── metadata.json      # Configurațiile și metadatele destinate Google AI Studio
├── package.json       # Scripturile de rulare și lista pachetelor dependente
├── tsconfig.json      # Setările specifice compilatorului TypeScript
└── vite.config.ts     # Configurația managerului de build Vite
```

---

## 📝 Licență și Contribuții

Acest proiect a fost dezvoltat având ca punct de plecare șablonul oficial `google-gemini/aistudio-repository-template`.

Dacă dorești să propui noi specii de animale, habitate suplimentare sau să aduci îmbunătățiri interfeței grafice, te invităm să deschizi un **Issue** sau să trimiți un **Pull Request**.


