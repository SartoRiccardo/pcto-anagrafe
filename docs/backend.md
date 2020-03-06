Il back-end dell'applicazione sarà programmato in PHP, e si occuperà di trasferire i dati dal Server al Client tramite richieste AJAX. I dati sono restituiti sottoforma di JSON. Verrà usato il framework Flight per creare un'API RESTful.

Nell'URL, prima di ogni richiesta, dovrà essere incluso un token che verrà usato per autenticare la richiesta. Una normale richiesta seguirà quindi il formato:
`https://{{url}}/{{token}}/endpoint`

## Azienda

> **<span style="color: #3EB63E">GET</span> Azienda per ID**

**URL:** `https://{{url}}/{{token}}/company/{{id}}`

Restituisce l'azienda avente l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`Company`](./data_models.md) `result`: Il risultato. Può essere `null`.

---

> **<span style="color: #3EB63E">GET</span> Cerca Aziende**

**URL:** `https://{{url}}/{{token}}/company`

Restituisce le aziende attinenti ai parametri di ricerca.

+ **Richiesta**
    + [`Search`](./data_models.md) `search`: I parametri di ricerca.
    + `int` `page`: La pagina su cui siamo attualmente. Ogni pagina fornisce 50 risultati. Se non specificato, verranno restituiti tutti i risultati.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + `int` `totalResults`: I risultati totali della ricerca, includendo quelli non restituiti.
    + [`Company[]`](./data_models.md) `results`: Il risultato. Può essere `null`.

---

> **<span style="color: #F5A623">POST</span> Aggiungi Azienda**

**URL:** `https://{{url}}/{{token}}/company`

Crea una nuova azienda.

+ **Richiesta**
    + `string` `name`: Il nome dell'azienda.
    + [`Field[]`](./data_models.md) `fields`: I campi dell'azienda. Se omesso, l'azienda verrà creata con tutti i campi vuoti.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + `int` `id`: L'ID dell'azienda appena creata. Può essere `null`.

---

> **<span style="color: #4A90E2">PUT</span> Modifica Azienda**

**URL:** `https://{{url}}/{{token}}/company`

Modifica un'azienda ai parametri forniti.

+ **Richiesta**
    + `int` `id`: L'ID dell'azienda.
    + `string` `name`: Il nome dell'azienda.
    + [`Field[]`](./data_models.md) `fields`: I campi dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #4A90E2">PUT</span> Modifica Nome di un'Azienda**

**URL:** `https://{{url}}/{{token}}/company`

Modifica il nome di un'azienda.

+ **Richiesta**
    + `int` `id`: L'ID dell'azienda.
    + `string` `name`: Il nome dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #4A90E2">PUT</span> Modifica Campo di un'Azienda**

**URL:** `https://{{url}}/{{token}}/company`

Modifica il nome di un'azienda.

+ **Richiesta**
    + `int` `id`: L'ID dell'azienda.
    + `int` `fId`: L'ID del campo da modificare
    + `string` `fValue`: Il valore del campo.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #ED4B48">DEL</span> Elimina Azienda**

**URL:** `https://{{url}}/{{token}}/company/{{id}}`

Elimina l'azienda con l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

## Struttura

> **<span style="color: #3EB63E">GET</span> Campo per ID**

**URL:** `https://{{url}}/{{token}}/structure/{{id}}`

Restituisce il campo avente l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`Field`](./data_models.md) `field`: Il risultato. Può essere `null`.

---

> **<span style="color: #3EB63E">GET</span> Tutti i campi**

**URL:** `https://{{url}}/{{token}}/structure`

Restituisce tutti i campi che può avere un'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`Field[]`](./data_models.md) `fields`: Il risultato. Può essere `null`.

---

> **<span style="color: #F5A623">POST</span> Aggiungi Campo**

**URL:** `https://{{url}}/{{token}}/structure`

Crea una nuova azienda.

+ **Richiesta**
    + `string` `name`: Il nome dell'azienda.
    + `string` `regex`: I valori che può accettare il campo.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + `int` `id`: L'ID del campo appena creato. Può essere `null`.

---

> **<span style="color: #4A90E2">PUT</span> Modifica Campo**

**URL:** `https://{{url}}/{{token}}/structure`

Modifica un campo ai parametri forniti.

+ **Richiesta**
    + `int` `id`: L'ID del campo.
    + `string` `name`: Il nome del campo.
    + `string` `regex`: La sintassi valida che il campo può accettare.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #ED4B48">DEL</span> Elimina Campo**

**URL:** `https://{{url}}/{{token}}/structure/{{id}}`

Elimina il campo con l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID del campo.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

## Attività

> **<span style="color: #3EB63E">GET</span> Attività per ID**

**URL:** `https://{{url}}/{{token}}/activity/{{id}}`

Restituisce l'attività avente l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`Activity`](./data_models.md) `activity`: Il risultato. Può essere `null`.

---

> **<span style="color: #3EB63E">GET</span> Tutte le Attività**

**URL:** `https://{{url}}/{{token}}/activity`

Restituisce tutte le attività.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`Activity[]`](./data_models.md) `activities`: Il risultato. Può essere `null`.

---

> **<span style="color: #F5A623">POST</span> Aggiungi Attività**

**URL:** `https://{{url}}/{{token}}/activity`

Crea una nuova attività.

+ **Richiesta**
    + `string` `name`: Il nome dell'attività.
    + `string` `description`: La descrizione dell'attività.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + `int` `id`: L'ID dell'attività appena creata. Può essere `null`.

---

> **<span style="color: #4A90E2">PUT</span> Modifica Nome di un'Attività**

**URL:** `https://{{url}}/{{token}}/activity`

Modifica il nome di un'attività. Può essere mandata anche con i parametri di **<span style="color: #4A90E2">PUT</span> Modifica Descrizione di un'Attività**

+ **Richiesta**
    + `int` `id`: L'ID dell'attività.
    + `string` `name`: Il nome dell'attività.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #4A90E2">PUT</span> Modifica Descrizione di un'Attività**

**URL:** `https://{{url}}/{{token}}/activity`

Modifica il nome di un'attività. Può essere mandata anche con i parametri di **<span style="color: #4A90E2">PUT</span> Modifica Nome di un'Attività**

+ **Richiesta**
    + `int` `id`: L'ID dell'attività.
    + `string` `description`: La descrizione dell'attività.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #ED4B48">DEL</span> Elimina Attività**

**URL:** `https://{{url}}/{{token}}/activity/{{id}}`

Elimina l'attività con l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'attività.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

## Salvataggi

> **<span style="color: #3EB63E">GET</span> Salvataggi di Utente**

**URL:** `https://{{url}}/{{token}}/saved/{{id}}`

Restituisce le aziende salvate dall'utente che sta effettuando la richiesta.

+ **Richiesta**
    + `int` `id`: L'ID dell'utente.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + `int[]` `saved`: Il risultato. Vuoto se non è andato a buon fine.

---

> **<span style="color: #F5A623">POST</span> Salva Azienda**

**URL:** `https://{{url}}/{{token}}/saved`

Salva un'azienda.

+ **Richiesta**
    + `int` `user`: L'ID dell'utente che sta salvando l'azienda.
    + `int` `company`: L'ID dell'azienda da salvare.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #ED4B48">DEL</span> Elimina Salvataggio**

**URL:** `https://{{url}}/{{token}}/saved`

Elimina l'attività con l'ID fornito.

+ **Richiesta**
    + `int` `user`: L'ID dell'utente che sta eliminando il salvataggio.
    + `int` `company`: L'ID dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

## Alternanza

> **<span style="color: #3EB63E">GET</span> Alternanza per ID**

**URL:** `https://{{url}}/{{token}}/internship/{{id}}`

Restituisce l'alternanza avente l'id fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'alternanza.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`Internship`](./data_models.md) `internship`: Il risultato. Può essere `null`.

---

> **<span style="color: #3EB63E">GET</span> Alternanza di Azienda**

**URL:** `https://{{url}}/{{token}}/internship`

Restituisce l'alternanza appartenente all'Azienda fornita.

+ **Richiesta**
    + `int` `azienda`: L'ID dell'azienda.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`Internship[]`](./data_models.md) `internships`: Il risultato. Può essere `null`.

---

> **<span style="color: #F5A623">POST</span> Aggiungi Alternanza**

**URL:** `https://{{url}}/{{token}}/internship`

Crea una nuova attività.

+ **Richiesta**
    + `int` `company`: L'ID dell'azienda.
    + `int` `activity`: L'ID dell'attività.
    + `string` `student`: Lo studente che sta svolgendo l'attività.
    + `int` `year`: L'anno in cui sta svolgendo l'attività.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + `int` `id`: L'ID dell'alternanza appena creata. Può essere `null`.

---

> **<span style="color: #4A90E2">PUT</span> Modifica Alternanza**

**URL:** `https://{{url}}/{{token}}/activity`

Modifica un'alternanza.

+ **Richiesta**
    + `int` `id`: L'ID dell'alternanza.
    + `int` `company`: L'ID dell'azienda. Opzionale.
    + `int` `activity`: L'ID dell'attività. Opzionale.
    + `string` `student`: Lo studente che sta svolgendo l'attività. Opzionale.
    + `int` `year`: L'anno in cui sta svolgendo l'attività. Opzionale.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #ED4B48">DEL</span> Elimina Alternanza**

**URL:** `https://{{url}}/{{token}}/internship/{{id}}`

Elimina l'alternanza con l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'alternanza.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

## Privilegi

> **<span style="color: #3EB63E">GET</span> Privilegi di Utente**

**URL:** `https://{{url}}/{{token}}/privileges/{{id}}`

Restituisce i privilegi dell'Utente avente l'ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'utente.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + `string[]` `privileges`: I privilegi. Può essere `null`.

---

> **<span style="color: #F5A623">POST</span> Aggiungi Privilegio**

**URL:** `https://{{url}}/{{token}}/privilege`

Aggiunge un privilegio a un utente.

+ **Richiesta**
    + `int` `user`: L'ID dell'utente.
    + `string` `privilege`: I permessi da dare.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

> **<span style="color: #ED4B48">DEL</span> Togli Privilegio**

**URL:** `https://{{url}}/{{token}}/privilege`

Toglie un privilegio all'utente con l'ID fornito.

+ **Richiesta**
    + `int` `user`: L'ID dell'utente.
    + `string` `privilege`: Il permesso da togliere.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

## Utenti

> **<span style="color: #3EB63E">GET</span> Utente per ID**

**URL:** `https://{{url}}/{{token}}/user/{{id}}`

Restituisce l'utente con ID fornito.

+ **Richiesta**
    + `int` `id`: L'ID dell'utente.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`User`](./data_models.md) `privileges`: Il risultato. Può essere `null`.

---

## Autenticazione

> **<span style="color: #3EB63E">GET</span> Autenticazione con credenziali**

**URL:** `https://{{url}}/auth`

Esegue il login con le credenziali fornite.

+ **Richiesta**
    + `string` `login`: Il nome utente o la mail.
    + `string` `pswd`: La password.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`LoginInfo`](./data_models.md) `user`: L'utente loggato. Può essere `null`.

---

> **<span style="color: #3EB63E">GET</span> Autenticazione con token**

**URL:** `https://{{url}}/{{token}}/auth`

Esegue il login con il token fornito.

+ **Risposta**
    + `boolean` `error`: Se sono accaduti errori durante la richiesta.
    + `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
    + [`LoginInfo`](./data_models.md) `user`: L'utente loggato. Può essere `null`.

---
