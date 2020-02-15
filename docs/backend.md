# Struttura

Il back-end dell'applicazione sarà primariamente programmato in PHP, e si occuperà di trasferire i dati dal Server al Client tramite richieste AJAX. I dati sono restituiti sottoforma di PHP. C'è stato un tentativo di emulare una API RESTful (fallito perché non ci siamo ancora arrivati).

In ogni richiesta si dovrà mandare in POST con gli attributi `REQUEST_TYPE` e `auth` settati, rispettvamente, al tipo di richiesta da fare (GET, POST, ...) e all'ID dell'utente.

## /api/company

Gestisce tutto quello che riguarda le tabelle `Company` e `CompanyField`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'azienda da cercare. |
| `search` | `Array( { id:int, value:string } )` | I campi di ricerca, in caso `id` non sia specificato. |
| `page` | `int` | La pagina di ricerca corrente. Ogni pagina contiene 50 risultati. Opzionale. |

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `name` | `string` | Il nome dell'azienda da inserire. |
| `fields` | `Array( { id:int, value:string } )` | I campi posseduti dall'azienda. |

### PUT

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id` | `int` | L'ID della tabella da modificare. |
| `name` | `string` | Il nuovo nome dell'azienda. |
| `field` | `{ id:int, value:string }` | Il campo modificato dell'azienda. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'azienda da eliminare. |

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
