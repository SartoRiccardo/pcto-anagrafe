# 2020-02-07: 0.3.0

## Versioni
+ [Front-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/1bfd634f2b9f7fa59544f8d14836a71fcdb2a521)
+ [Back-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/d07333afc1a18fbc45b104f30e29a88ac742b9bb)

## Aggiunte
+ Chi possiede i privilegi può aggiungere nuove aziende e modificarne il contenuto

## Sicurezza
+ Risolto finalmente un bug che non cancellava completamente la sessione una volta eseguito il logout

# 2020-02-06: 0.2.1

## Versioni
+ [Front-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/472fc75ab7e70ca6effaa6bb54f7394e1163b011)
+ [Back-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/6bacb8065fc6747bed4124d4faa577c278706d84)

## Sicurezza
+ Risolto un bug dove, in caso si facesse il logout e successivo login con un account diverso, si potevano vedere le aziende salvate dall'account scollegato

# 2020-02-04: 0.2.0

## Versioni
+ [Front-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/428d7db0e8e53afd755a97a14189f0d9f048c254)
+ [Back-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/6bacb8065fc6747bed4124d4faa577c278706d84)

## Aggiunte
+ L'applicazione permette di salvare delle aziende tra i preferiti.
+ GET, POST e DELETE di /api/saved

# 2020-02-04: 0.1.0

## Versioni
+ [Front-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/af9655e353c562d87c4bec9b37f7b0d773633e52)
+ [Back-end](https://github.com/SartoRiccardo/pcto-anagrafe/commit/f34a4e39e0d625f77c9fea0440ac497d920a445b)

## Aggiunte
+ L'applicazione permette di cercare aziende dopo essersi autenticati
+ L'API offre la possibilità di accedere ai dati sulle aziende e come sono salvate in sola lettura
+ Possibilità di cercare aziende per più parametri
