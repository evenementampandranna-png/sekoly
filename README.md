# Sekoly — Rindrambaiko fitantanana sekoly

Rindrambaiko fitantanana sekoly feno, voatahiry ao amin'ny **Firebase** (cloud). Mifandray ho azy ny angona amin'ny finday sy solosaina rehetra ary amin'ny mpiasa rehetra.

**Ao anatiny:** tabilao, mpianatra, kilasy, mpampianatra, saram-pianarana (rosia, tara, MVola/Orange/Airtel), fiantsoana isan'andro, naoty sy kara-naoty, mpampiasa maromaro (Tale, Mpitahiry vola, Mpampianatra), mbola mandeha na tsy misy internet aza (offline).

## Rafitra

| Rakitra | Anjara |
|---|---|
| `index.html` | Pejy fototra |
| `style.css` | Endrika |
| `app.js` | Ny rindrambaiko manontolo + fifandraisana amin'ny Firebase |
| `firebase-config.js` | **Ny config Firebase-nao** |
| `firestore.rules` | Fiarovana ny angona (Firestore Security Rules) |

## Fametrahana (indray mandeha ihany)

### 1. Firebase
1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. **Build → Authentication → Get started → Email/Password → Enable**
3. **Build → Firestore Database → Create database** (production mode)
4. **Firestore → Rules**: soloy ny votoatiny amin'ny ao amin'ny `firestore.rules` → **Publish**
5. **Project settings ⚙ → Your apps → Web (`</>`)** → adikao ny `firebaseConfig` ary apetaho ao amin'ny `firebase-config.js`
6. **Authentication → Settings → Authorized domains → Add domain**: `evenementampandranna-png.github.io`

### 2. GitHub Pages
**Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)` → Save**

Rehefa afaka 1–2 minitra dia ho hita ao amin'ny:
`https://evenementampandranna-png.github.io/sekoly/`

## Fampiasana
1. Sokafy ny rohy → **Hamorona sekoly** → ampidiro ny anaran'ny sekoly, kaody (ohatra `SEK001`), ny anaranao, anarana fidirana ary teny miafina.
2. Ianao no **Tale/Mpitantana**. Ao amin'ny **Fikirakirana → Mpampiasa** no amoronanao kaonty ho an'ny mpitahiry vola sy ny mpampianatra.
3. Miditra amin'ny **kaody sekoly + anarana fidirana + teny miafina** ny rehetra.

## Andraikitra
| Andraikitra | Afaka miditra amin'ny |
|---|---|
| Tale / Mpitantana | Ny zavatra rehetra |
| Mpitahiry vola | Tabilao, Mpianatra, Kilasy, Saram-pianarana |
| Mpampianatra | Tabilao, Mpianatra, Fiantsoana, Naoty |

> Fiarovana: ny mpikambana amin'ny sekoly iray ihany no mahita ny angon'io sekoly io (jereo `firestore.rules`).
