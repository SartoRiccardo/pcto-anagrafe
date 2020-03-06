# Struttura

Il back-end dell'applicazione sarà programmato in PHP, e si occuperà di trasferire i dati dal Server al Client tramite richieste AJAX. I dati sono restituiti sottoforma di JSON. Verrà usato il framework Flight per creare un'API RESTful.

Nell'URL, prima di ogni richiesta, dovrà essere incluso un token che verrà usato per autenticare la richiesta. Una normale richiesta seguirà quindi il formato:
`https://{{url}}/{{auth}}/endpoint`

## Company

#### <span style="color: #3Eb63E">GET</span> Azienda per ID

`https://{{url}}/company/{{id}}`

Restituisce l'azienda avente l'ID fornito.

##### Richiesta
+ `int` `id`: L'ID dell'azienda.

##### Risposta

+ `boolean` `error`: Se sono accaduti errori durante la richiesta.
+ `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
+ [`Company`](./data_models.md) `result`: Il risultato. Può essere `null`.

---

#### <span style="color: #3Eb63E">GET</span> Cerca Aziende

`https://{{url}}/company`

Restituisce le aziende attinenti ai parametri di ricerca.

##### Richiesta
+ [`Search`](./data_models.md) `search`: I parametri di ricerca.
+ `int` `page`: La pagina su cui siamo attualmente. Ogni pagina fornisce 50 risultati. Se non specificato, verranno restituiti tutti i risultati.

##### Risposta

+ `boolean` `error`: Se sono accaduti errori durante la richiesta.
+ `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
+ `int` `totalResults`: I risultati totali della ricerca, includendo quelli non restituiti.
+ [`Company[]`](./data_models.md) `results`: Il risultato. Può essere `null`.

---

#### <span style="color: #F5A623">POST</span> Aggiungi Azienda

`https://{{url}}/company`

Crea una nuova azienda.

##### Richiesta
+ `string` `name`: Il nome dell'azienda.
+ [`Field[]`](./data_models.md) `fields`: I campi dell'azienda. Se omesso, l'azienda verrà creata con tutti i campi vuoti.

##### Risposta

+ `boolean` `error`: Se sono accaduti errori durante la richiesta.
+ `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.
+ `int` `id`: L'ID dell'azienda appena creata. Può essere `null`.

---

#### <span style="color: #4A90E2">PUT</span> Modifica un'azienda

`https://{{url}}/company/{{id}}`

Modifica un'azienda ai parametri forniti.

##### Richiesta
+ `int` `id`: L'ID dell'azienda.
+ `string` `name`: Il nome dell'azienda.
+ [`Field[]`](./data_models.md) `fields`: I campi dell'azienda.

##### Risposta

+ `boolean` `error`: Se sono accaduti errori durante la richiesta.
+ `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

#### <span style="color: #4A90E2">PUT</span> Modifica il nome di un'azienda

`https://{{url}}/company/{{id}}`

Modifica il nome di un'azienda.

##### Richiesta
+ `int` `id`: L'ID dell'azienda.
+ `string` `name`: Il nome dell'azienda.

##### Risposta

+ `boolean` `error`: Se sono accaduti errori durante la richiesta.
+ `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

#### <span style="color: #4A90E2">PUT</span> Modifica un campo di un'azienda

`https://{{url}}/company/{{id}}`

Modifica il nome di un'azienda.

##### Richiesta
+ `int` `id`: L'ID dell'azienda.
+ [`Field`](./data_models.md) `field`: Il campo da modificare.

##### Risposta

+ `boolean` `error`: Se sono accaduti errori durante la richiesta.
+ `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

#### <span style="color: #ED4B48">DEL</span> Elimina un'azienda

`https://{{url}}/company/{{id}}`

Elimina l'azienda con l'ID fornito.

##### Richiesta
+ `int` `id`: L'ID dell'azienda.

##### Risposta

+ `boolean` `error`: Se sono accaduti errori durante la richiesta.
+ `string` `message`: Un eventuale messaggio d'errore se la richiesta non è andata a buon fine.

---

## /api/structure

Gestisce tutto quello che riguarda la tabella `Field`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID del campo da ottenere. |

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `name` | `string` | Il nome del campo. |
| `regex` | `string` | La sintassi valida che il campo può accettare. |

### PUT

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id` | `int` | L'ID del campo da modificare. |
| `name` | `string` | Il nome del campo. |
| `regex` | `string` | La sintassi valida che il campo può accettare. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'azienda da eliminare. |

## /api/activity

Gestisce tutto quello che riguarda la tabella `Activity`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'attività da cercare. |

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `name` | `string` | Il nome della nuova attività. |
| `description` | `string` | La descrizione della nuova attività. |

### PUT

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'attività da modificare. |
| `name` | `string` | Il nuovo nome della nuova attività. |
| `description` | `string` | La nuova descrizione dell'attività. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'attività da eliminare. |

## /api/saved

Gestisce tutto quello che riguarda le tabelle `Saved`.

### GET

Tutta l'informazione viene già spedita dal campo `auth`.

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id` | `int` | L'ID dell'azienda da salvare. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'azienda da eliminare dai preferiti. |

## /api/internship

Gestisce tutto quello che riguarda la tabella `Internship`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id` | `int` | L'ID dell'esperienza. |

### POST & PUT

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `company` | `int` | L'ID dell'azienda. |
| `activity` | `int` | L'ID dell'attività. |
| `student` | `string` | Lo studente che sta svolgendo l'attività. |
| `year` | `int` | L'anno in cui sta svolgendo l'attività. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id` | `int` | L'ID dell'esperienza. |

## /api/privileges

Gestisce tutto quello che riguarda la tabella `Privilege`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `user` | `int` | L'ID dell'utente. |

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `user` | `int` | L'ID dell'utente. |
| `privilege` | `string` | I permessi da dare. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `user` | `int` | L'ID dell'utente. |
| `privilege` | `string` | I permessi da togliere. |
