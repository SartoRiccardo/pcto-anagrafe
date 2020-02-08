# Company

| Campo | Tipo | Descrizione |
|-|-|-|
| `id` | `int` | L'ID dell'azienda |
| `name` | `String` | Il nome dell'azienda |
| `fields` | `CompanyField[]` | I campi dell'azienda |

# Field

| Campo | Tipo | Descrizione |
|-|-|-|
| `id` | `int` | L'ID del campo |
| `name` | `String` | Il nome del campo |
| `regex` | `String` | Il pattern del campo |

# CompanyField

| Campo | Tipo | Descrizione |
|-|-|-|
| `id` | `int` | L'ID del campo |
| `name` | `String` | Il nome del campo |
| `regex` | `String` | Il pattern del campo |
| `value` | `String` | Il valore del campo |

# Search

| Campo | Tipo | Descrizione |
|-|-|-|
| `id` | `int` | L'ID della ricerca |
| `value` | `String` | La ricerca |
| `field` | `String` | Il campo da ricercare |
