Documentazione sui modelli usati nell'applicazione. La colonna **Backend** è segnata quando i parametri devono essere passati all'API nelle richieste.

# Company

| Campo | Tipo | Descrizione | Backend |
|-|-|-|-|
| `id` | `int` | L'ID dell'azienda | :heavy_check_mark: |
| `name` | `String` | Il nome dell'azienda | :heavy_check_mark: |
| `fields` | `CompanyField[]` | I campi dell'azienda | :heavy_check_mark: |

# Field

| Campo | Tipo | Descrizione | Backend |
|-|-|-|-|
| `id` | `int` | L'ID del campo | :heavy_check_mark: |
| `name` | `String` | Il nome del campo | :heavy_check_mark: |
| `regex` | `String` | Il pattern del campo | :x: |

# CompanyField

| Campo | Tipo | Descrizione | Backend |
|-|-|-|-|
| `id` | `int` | L'ID del campo | :heavy_check_mark: |
| `name` | `String` | Il nome del campo | :x: |
| `regex` | `String` | Il pattern del campo | :x: |
| `value` | `String` | Il valore del campo | :heavy_check_mark: |

# Search

| Campo | Tipo | Descrizione | Backend |
|-|-|-|-|
| `id` | `int` | L'ID della ricerca | :heavy_check_mark: |
| `value` | `String` | La ricerca | :heavy_check_mark: |
| `field` | `String` | Il campo da ricercare | :x: |

# User

| Campo | Tipo | Descrizione | Backend |
|-|-|-|-|
| `id` | `int` | L'ID dell'utente | :heavy_check_mark: |
| `name` | `String` | Il nome dell'utente | :x: |
| `surname` | `String` | Il cognome dell'utente | :x: |
| `status` | `String` | Una lettera che indica che ruolo ha l'utente (S: Studente, D: Docente, ...) | :x: |

# Internship

| Campo | Tipo | Descrizione | Backend |
|-|-|-|-|
| `id` | `int` | L'ID dell'utente | :heavy_check_mark: |
| `student` | `int` | L'utente che sta svolgendo l'attività | :x: |
| `activity` | `String` | L'attività svolta dall'utente | :x: |
| `company` | `int` | L'azienda che ospita lo studente | :x: |
| `year` | `int` | L'anno in cui si è svolta questa attività | :x: |
