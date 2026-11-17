# Sekoly — Rindrambaiko fitantanana sekoly · Logiciel de gestion scolaire

Rindrambaiko fitantanana sekoly feno. Voatahiry ao amin'ny **Firebase** ny angona, ary mampiasa **GitHub Pages** (na Firebase Hosting) ho fametrahana. Azo ampiasaina amin'ny ordinatera sy amin'ny finday Android (PWA azo apetraka), ary **mandeha na tsy misy internet aza**.

*Application web responsive + PWA, Firebase (Auth + Firestore), interface FR / MG, bulletins en français.*

## Ireo module (araka ny cahier des charges)

| Module | Ao anatiny |
|---|---|
| **M1 Inscriptions** | Fiche élève feno (sary, toerana nahaterahana, ray aman-dreny 2), matricule ho azy, taratasy voaskana (acte de naissance…), réinscription, transfert miditra sy mivoaka, abandon, exclusion, certificat de scolarité, carte d'élève, liste de classe, fikarohana, export Excel |
| **M2 Organisation** | Taom-pianarana (trimestra na semestra, daty, fialan-tsasatra), niveau, kilasy, effectif max, efitrano, taranja + koefisianta isaky ny niveau, fanendrena mpampianatra, prof principal, **fandaharam-potoana** isaky ny kilasy, mpampianatra ary efitrano miaraka amin'ny **fizahana fifanindrina** |
| **M3 Notes & bulletins** | Devoir / interro / composition, barème azo ovaina, salan'isa milanja, laharana, salan'isan'ny kilasy, ambony sy ambany indrindra, fanamarihana isaky ny taranja sy ankapobeny, mention (félicitations, TH, encouragements, avertissement), **fanidiana** aorian'ny conseil, bulletin PDF isaky ny kilasy, passage, redoublement, exclusion, famaranana taona ho azy, lisitra CEPE / BEPC / BAC |
| **M4 Absences** | Antso amin'ny finday na ordinatera, misy antony / tsy misy antony, tara, **SMS ho azy** any amin'ny ray aman-dreny, sazy (avertissement, blâme, retenue, exclusion), isan'ny tsy fahatongavana ao amin'ny bulletin |
| **M5 Finances** | Grille des frais isaky ny kilasy (inscription, écolage, assurance, tenue, examen), fihenam-bidy (fratrie, personnel, bourse), espèces / virement / MVola / Orange / Airtel, rosia misy laharana (printy + SMS), solde sy impayés, fampahatsiahivana SMS, fanakanana bulletin (safidy), **journal de caisse, clôture, rapport mensuel**, Ariary |
| **M6 Communication** | SMS ho an'ny maro (sekoly / niveau / kilasy / impayés), filazana sy tetiandro, hafatra anatiny, **convocation** miaraka amin'ny fanamarinana famakiana |
| **M7 Espace parents/élèves** | Naoty, bulletin, tsy fahatongavana, fandaharam-potoana, asa an-trano, vola, hafatra. Kaonty ray aman-dreny iray ho an'ny zanaka maromaro |
| **M8 Personnel** | Dossier (diplaoma, fifanarahana, asa), fanatrehan'ny mpiasa, **cahier de textes** |
| **M9 Rapports** | Effectifs (kilasy, lahy/vavy, taona), taham-pahombiazana isaky ny kilasy sy taranja, absentéisme, voaray / andrasana, **statistika CISCO/DREN**, export Excel sy PDF |
| **Fiarovana** | Andraikitra 8, mpampianatra mahita ny kilasiny ihany (voafehy ao amin'ny Firestore Rules), **journal des actions** tsy azo ovaina, naoty voahidy sy rosia ovain'ny direction ihany miaraka amin'ny antony, HTTPS, backup |

## Andraikitra

| Andraikitra | Zo |
|---|---|
| Administrateur / Directeur | Ny zavatra rehetra, conseil de classe, fanidiana, fanafoanana rosia, journal |
| Secrétariat | Mpianatra, kilasy, fandaharam-potoana, mpiasa, filazana, kaonty ray aman-dreny |
| Surveillant général | Fiantsoana, antony, sazy, SMS |
| Économe / Caissier | Fandoavana, rosia, impayés, journal de caisse, tatitra ara-bola |
| Enseignant | Naoty sy antso ho an'ny **kilasiny ihany**, cahier de textes |
| Parent / Élève | Espace parents / élève ihany |

## Fametrahana (indray mandeha ihany)

### 1. Firebase
1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**
2. **Build → Authentication → Get started → Email/Password → Enable**
3. **Build → Firestore Database → Create database** (production mode, `eur3` na `europe-west1`)
4. **Firestore → Rules**: apetaho ny votoatin'ny `firestore.rules` → **Publish**
5. **Project settings ⚙ → Your apps → Web `</>`** → adikao ny `firebaseConfig` ary apetaho ao amin'ny `firebase-config.js`
6. **Authentication → Settings → Authorized domains**: ampio ny `<anarana>.github.io`

### 2. GitHub Pages
**Settings → Pages → Deploy from a branch → `main` / `(root)`** → `https://<anarana>.github.io/sekoly/`

### 3. Fampiasana
1. Sokafy ny rohy → **Hamorona sekoly** (kaody, ohatra `SEK001`). Ianao no ho Administrateur.
2. **Fikirakirana → Taom-pianarana**: apetraho ny trimestra sy ny fialan-tsasatra.
3. **Kilasy & taranja**: kilasy, saran-javatra, koefisianta, fanendrena.
4. **Mpiasa** → *Hamorona kaonty* ho an'ny mpampianatra, sekretera, caissier.
5. **Mpianatra** → mpianatra iray → *Kaonty ray aman-dreny* (alefa amin'ny SMS ny fidirana).

### 4. SMS sy backup mandeha ho azy (safidy, mila drafitra **Blaze**)
Ao amin'ny `functions/` ny code:
- **sendSms**: mandefa ny SMS rehetra (tsy fahatongavana, rosia, fampahatsiahivana, convocation) ao anatin'ny segondra vitsy. Mety amin'ny **Orange Developer SMS API** sy amin'ny passerelle HTTP hafa.
- **dailyBackup**: backup ny Firestore isan'andro amin'ny 02:00 (ora Madagasikara) ao amin'ny bucket Cloud Storage, izany hoe kopia any ivelan'ny sekoly.

```bash
npm i -g firebase-tools && firebase login
cd functions && npm install && cp .env.example .env   # fenoy ny .env
firebase functions:secrets:set SMS_TOKEN
gsutil mb -l europe-west1 gs://<projet>-sekoly-backups
firebase deploy --only functions,firestore:rules
```
Raha tsy misy passerelle, dia mijanona ao amin'ny **Serasera → SMS** ireo SMS. Ny bokotra ✉ no ampiasaina handefasana azy amin'ny finday.

## Rafitra

```
index.html · style.css · manifest.json · sw.js (PWA)
firebase-config.js         ← config Firebase-nao
firestore.rules            ← fiarovana (andraikitra, kilasin'ny mpampianatra, fanidiana…)
js/core.js state.js sync.js shell.js events.js firebase.js
js/v-*.js                  ← module (students, org, grades, attendance, finance, comm, staff, reports, settings, portal)
functions/                 ← Cloud Functions (SMS, backup)
```

Fanamarihana: Firestore (NoSQL) no ampiasaina eto fa tsy PostgreSQL/MySQL. Ny tombony dia ny fiasana tsy misy internet sy ny fifandraisana mivantana (temps réel). Azo avoaka amin'ny JSON sy Excel ny angona rehetra amin'ny fotoana rehetra.

## Licence

- **Rakitra `LICENSE`**: licence manokana (propriétaire). Tsy azo adika, amidy na zaraina ny code raha tsy misy fahazoan-dàlana.
- **Kaody licence**: ny sekoly vaovao tsirairay dia mahazo **30 andro fanandramana**. Aorian'izay, mila kaody `SKL-XXXX-XXXX-XXXX` vao afaka manova angona. Ny `firestore.rules` no manamafy izany: ny serveur no mandà ny fanovana, fa tsy ny efijery fotsiny.
- **Console mpivarotra** (menio *Licences*): mamorona kaody (Starter 200 / Standard 600 / Premium tsy voafetra, ary ny faharetany), manitatra, manafoana. Hita ihany raha misy ny `vendors/{uid}` ao amin'ny Firestore.
- Raha lany daty ny licence, dia **tsy very ny angona**: mbola azo jerena sy ampidinina izy, saingy tsy azo ovaina.
