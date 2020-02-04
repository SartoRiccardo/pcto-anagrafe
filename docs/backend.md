Il back-end dell'applicazione sarà primariamente programmato in PHP, e si occuperà di trasferire i dati dal Server al Client tramite richieste AJAX. I dati sono restituiti sottoforma di PHP. C'è stato un tentativo di emulare una API RESTful (fallito perché non ci siamo ancora arrivati).

In ogni richiesta si dovrà mandare in POST con gli attributi `REQUEST_TYPE` e `auth` settati, rispettvamente, al tipo di richiesta da fare (GET, POST, ...) e all'ID dell'utente.

# /api/company

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
| `name` | `string` | Il nome dell'azienda da modificare. |
| `fields` | `Array( { id:int, value:string } )` | I campi posseduti dall'azienda. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'azienda da eliminare. |

# /api/structure

Gestisce tutto quello che riguarda la tabella `Field`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID del campo da ottenere. |

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `target` | `string` | A che entità appartiene il campo. |
| `name` | `string` | Il nome del campo. |
| `regex` | `string` | La sintassi valida che il campo può accettare. |

### PUT

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id` | `int` | L'ID del campo da modificare. |
| `target` | `string` | A che entità appartiene il campo. |
| `name` | `string` | Il nome del campo. |
| `regex` | `string` | La sintassi valida che il campo può accettare. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'azienda da eliminare. |

# /api/activity

Gestisce tutto quello che riguarda le tabelle `Activity` e `ActivityField`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'attività da cercare. |
| `search` | `Array( { id:int, value:string } )` | I campi di ricerca, in caso `id` non sia specificato. |
| `page` | `int` | La pagina di ricerca corrente. Ogni pagina contiene 50 risultati. Opzionale. |

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `company` | `int` | L'ID dell'azienda che ha organizzato l'attività. |
| `fields` | `Array( { id:int, value:string } )` | I campi dell'attività. |

### PUT

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id` | `int` | L'ID dell'attività da modificare. |
| `company` | `int` | L'ID dell'azienda che ha organizato l'attività. |
| `fields` | `Array( { id:int, value:string } )` | I campi dell'attività. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'attività da eliminare. |

# /api/saved

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

# /api/internship

Gestisce tutto quello che riguarda le tabelle `Internship`.

### GET

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `id`  | `int` | L'ID dell'azienda da cercare. |
| `search` | `Array( { id:int, value:string } )` | I campi di ricerca, in caso `id` non sia specificato. |
| `page` | `int` | La pagina di ricerca corrente. Ogni pagina contiene 50 risultati. Opzionale. |

### POST

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `student` | `string` | Il nome dello studente che ha svolto l'attività. |
| `activity` | `int` | L'ID dell'attività svolta. |

### PUT

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `student` | `string` | Il nome dello studente che ha svolto l'attività. |
| `activity` | `int` | L'ID dell'attività svolta. |

### DELETE

| Campo | Tipo | Descrizione |
| ----- | ---- | ----------- |
| `student` | `string` | Il nome dello studente che ha svolto l'attività da eliminare. |
| `activity` | `int` | L'ID dell'attività. |
