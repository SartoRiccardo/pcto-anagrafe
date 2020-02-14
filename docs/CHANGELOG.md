# 2020-02-14: 0.5.0 [*(F)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/266f067e614442871eeb58fb492e4491801618d8) [*(B)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/15771fc732f4e8939660c28d206a17ba73482a29)

## Aggiunte
+ Chi possiede i privilegi può aggiungere, togliere o modificare i campi delle tabelle in cui sono salvate le aziende

## Modifiche
+ Le icone sono alla stessa altezza del testo
+ Quando non si scrive nulla nel campo di ricerca di un campo specifico, usciranno anche le aziende dove il campo non ha valore

## Bug
+ Continuare a cliccare i pulsanti per cambiare pagina adesso funziona

# 2020-02-08: 0.4.0 [*(F)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/b9428ce7848d6e5a9d44a3e5ac0b0afa563dcdf0) [*(B)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/4ef8a087815596ae4e98908a0c306ae3f20014d8)

## Aggiunte
+ Chi possiede i privilegi può eliminare aziende
+ Introdotta un'animazione quando si cerca un'azienda

## Bug
+ Andare nella pagina di un'azienda inesistente fornirà un messaggio di errore invece di crashare l'app

# 2020-02-07: 0.3.0 [*(F)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/e03fff0a1f48781cef1e5579a050c0a4e9b16633) [*(B)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/d07333afc1a18fbc45b104f30e29a88ac742b9bb)

## Aggiunte
+ Chi possiede i privilegi può aggiungere nuove aziende e modificarne il contenuto

## Sicurezza
+ Risolto finalmente un bug che non cancellava completamente la sessione una volta eseguito il logout

# 2020-02-06: 0.2.1 [*(F)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/472fc75ab7e70ca6effaa6bb54f7394e1163b011) [*(B)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/6bacb8065fc6747bed4124d4faa577c278706d84)

## Sicurezza
+ Risolto un bug dove, in caso si facesse il logout e successivo login con un account diverso, si potevano vedere le aziende salvate dall'account scollegato

# 2020-02-04: 0.2.0 [*(F)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/428d7db0e8e53afd755a97a14189f0d9f048c254) [*(B)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/6bacb8065fc6747bed4124d4faa577c278706d84)

## Aggiunte
+ L'applicazione permette di salvare delle aziende tra i preferiti.
+ GET, POST e DELETE di /api/saved

# 2020-02-04: 0.1.0 [*(F)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/af9655e353c562d87c4bec9b37f7b0d773633e52) [*(B)*](https://github.com/SartoRiccardo/pcto-anagrafe/tree/f34a4e39e0d625f77c9fea0440ac497d920a445b)

## Aggiunte
+ L'applicazione permette di cercare aziende dopo essersi autenticati
+ L'API offre la possibilità di accedere ai dati sulle aziende e come sono salvate in sola lettura
+ Possibilità di cercare aziende per più parametri
