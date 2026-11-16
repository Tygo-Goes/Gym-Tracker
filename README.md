# Gym Tracker

Gym Tracker is een Nederlandstalige webapp voor krachttraining. Houd je sets en persoonlijke records bij en volg je kracht per spiergroep op een interactieve lichaamskaart.

## Functies

| Scherm | Wat je er kunt doen |
| --- | --- |
| **Trainen** | Pas je schema aan, voeg oefeningen toe en log gewicht, reps, tijd en 1RM. Bekijk je setgeschiedenis, grafieken en warming-up. |
| **Kracht** | Bekijk ranks voor 14 spiergroepen. Wissel tussen voor- en achterkant, tik op een spiergroep en ga met de tijdlijn terug naar een eerdere datum. |
| **Statistieken** | Bekijk je lichaamsgewicht, sets per spiergroep en voortgang in het dumbbell-rek. |
| **Wrapped** | Bekijk je trainingen, records, XP en mijlpalen per periode. |
| **Leaderboard** | Vergelijk XP, records, trainingsdagen en weekreeksen. Je kunt je profiel verbergen via de knop onderaan het leaderboard. |

Start de **trainingstimer** voordat je sets logt. Als je tijdens het trainen een PR zet voor een oefening op de spierkaart, brengt de melding je direct naar die spiergroep. Na het afronden verschijnt je **trainingskaart** met duur, sets en getrainde spiergroepen. Kies **Voorkant** of **Achterkant** voor de afbeelding die je wilt delen of downloaden als PNG.

## Hoe werken de krachtranks?

Een rank is gebaseerd op je beste gelogde of geschatte 1RM gedeeld door je lichaamsgewicht. Bij sets van 2–10 reps schat Gym Tracker je 1RM met de Epley-formule. Bij meer dan 10 reps telt het gelogde gewicht als ondergrens. De tijdlijn gebruikt het laatst bekende lichaamsgewicht op of vóór de gekozen datum.

**Bronze → Silver → Gold → Platinum → Diamond → Master → Legend**

De drempels verschillen per oefening. Het zijn mijlpalen binnen Gym Tracker. Zo telt Bench Press voor je borst en Cable Wrist Curl voor je onderarmflexoren. Tik op een spiergroep om de gebruikte oefening en set te zien. Vergelijk kabel- en machinesets op hetzelfde apparaat met dezelfde instelling.

## Lokaal openen

De site bestaat uit HTML, CSS en JavaScript en draait direct vanaf een statische webserver. Open een terminal in de map met `index.html` en start met Python 3 een lokale server.

```sh
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000). De app gebruikt Firebase Authentication voor accounts en Cloud Firestore voor trainingsgegevens. Met de bestaande `firebase-config.js` werkt ook je lokale versie met het ingestelde Firebase-project.

### Een eigen Firebase-project instellen

1. Registreer een webapp in je Firebase-project en zet de webconfiguratie in `firebase-config.js`. Exporteer deze als `firebaseConfig`.
2. Schakel aanmelden via e-mail en wachtwoord in en maak een Cloud Firestore-database aan. [Firebase Authentication](https://firebase.google.com/docs/auth/web/password-auth)
3. Stel Firestore-regels in voor `users/{uid}` en `leaderboard/{uid}`. Geef leden toegang tot hun eigen trainingsdocument en laat ze alleen hun eigen leaderboarddocument schrijven. Het leaderboard wordt gelezen door ingelogde gebruikers. [Firestore-beveiligingsregels](https://firebase.google.com/docs/firestore/security/rules-conditions)

## Publiceren via GitHub Pages

Plaats de sitebestanden in dezelfde map als `index.html`. Open **Settings → Pages** in je repository en kies de branch en map waar die bestanden staan. Als GitHub Pages al draait, upload je de update naar de ingestelde bronmap. [GitHub Pages-documentatie](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Belangrijkste bestanden

| Bestand | Functie |
| --- | --- |
| `index.html` | Schermen, trainingslog, navigatie en Firebase-koppeling |
| `styles.css` | Vormgeving, inclusief de mobiele navigatie |
| `strength.js` | Krachtranks en interactieve spierkaart |
| `workout.js` | Trainingsoverzicht en export van de deelkaart |
| `firebase-config.js` | Configuratie van het Firebase-project |
| `body-front.jpg` en `body-back.jpg` | Vooraanzicht en achteraanzicht van de spierkaart |
