# Modello Entità-Relazione

![Modello ER](img/er_model.png)

Il database è stato progettato in modo di essere il più possibile flessibile e di poter cambiare ogni singolo campo a proprio piacimento, mantenendo però l'integrità semantica dei dati.

# Struttura

## Privilege

### Modello Logico

| Campo  | Descrizione |
| ------ | ----------- |
| `id`   | L'ID dell'utente. corrisponde con l'ID utente di Spaggiari. |
| `type` | Il tipo di permesso dato all'utente. |

### Modello Fisico

```SQL
CREATE TABLE Privilege (
  id INT NOT NULL,
  type VARCHAR(16) NOT NULL,
  PRIMARY KEY(id, type)
)
```

## Company

### Modello Logico

| Campo  | Descrizione |
| ------ | ----------- |
| `id`   | Un ID associato ad ogni azienda. Servirà da chiave primaria e sarà un intero. Le aziende vengono identificate da questo ID e non dal loro nome per essere coerenti con il resto delle entità. |
| `name` | Il nome dell'azienda. È inserito nella tabella `Company` e non nella tabella `CompanyField` perché è l'unico campo obbligatorio e che non può essere nullo. |

### Modello Fisico

```SQL
CREATE TABLE Company (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(128) NOT NULL,
  PRIMARY KEY(id)
)
```

## Activity

### Modello Logico

|   Campo   | Descrizione |
| --------- | ----------- |
| `id`      | Un ID associato ad ogni attività. |
| `company` | L'ID dell'azienda che ha svolto questa attività. |

### Modello Fisico

```SQL
CREATE TABLE Activity (
  id INT NOT NULL AUTO_INCREMENT,
  company INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY (company) REFERENCES Company(id)
)
```

## Field

Questa tabella è necessaria per garantire un'integrità semantica non presente in un database SQL. Si possono inserire nuovi campi a proprio piacimento, con una sintassi inventata, senza modificare la struttura del database. Tutti i controlli verranno fatti a livello applicativo.

Un altro motivo di questa scelta è di avere consistenza nel database: visto che le colonne sono dinamiche e potrebbero essere cambiate continuamente, modificare la struttura delle tabelle potrebbe rivelarsi scomodo. Lo svantaggio di questo sistema è che, per applicare più di un filtro, sono necessarie più `JOIN`, ma visto che il database da gestire non è molto grande lo si può permettere.

### Modello Logico

|  Campo   | Descrizione |
| -------- | ----------- |
| `id`     | Un ID numerico associato ad ogni campo. |
| `target` | Indica a chi può appartenere il campo (`Company` o `Activity`). |
| `name`   | Il nome del campo. |
| `regex`  | La sintassi che un valore di questo campo deve seguire per essere considerato valido. |

### Modello Fisico

```SQL
CREATE TABLE Field (
  id INT NOT NULL AUTO_INCREMENT,
  target VARCHAR(128) NOT NULL,
  name VARCHAR(128) NOT NULL,
  regex VARCHAR(255) NOT NULL,
  PRIMARY KEY(id)
)
```

## CompanyField

### Modello Logico

|   Campo   | Descrizione |
| --------- | ----------- |
| `company` | L'ID dell'azienda a cui appartiene il campo. Chiave esterna a `Company(id)`. |
|  `field`  | L'ID del tipo di campo in questione. Chiave esterna a `Field(id)`.
|  `value`  | Il valore del campo. |

### Modello Fisico

```SQL
CREATE TABLE CompanyField (
  company INT NOT NULL,
  field INT NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY(company, field),
  FOREIGN KEY (company) REFERENCES Company(id),
  FOREIGN KEY (field) REFERENCES Field(id)
)
```

## ActivityField

### Modello Logico

|    Campo   | Descrizione |
| ---------- | ----------- |
| `activity` | L'ID dell'attività a cui appartiene il campo. Chiave esterna a `Activity(id)`. |
|  `field`   | L'ID del tipo di campo in questione. Chiave esterna a `Field(id)`.
|  `value`   | Il valore del campo. |

### Modello Fisico

```SQL
CREATE TABLE ActivityField (
  activity INT NOT NULL,
  field INT NOT NULL,
  value VARCHAR(255) NOT NULL,
  PRIMARY KEY(activity, field),
  FOREIGN KEY (activity) REFERENCES Activity(id),
  FOREIGN KEY (field) REFERENCES Field(id)
)
```

## Saved

### Modello Logico

|   Campo   | Descrizione |
| --------- | ----------- |
| `student` | Lo studente che si è salvato l'azienda. Corrisponde con l'ID utente di Spaggiari. |
| `company` | L'azienda salvata. |

### Modello Fisico

```SQL
CREATE TABLE Saved (
  student INT NOT NULL,
  company INT NOT NULL,
  FOREIGN KEY (company) REFERENCES Company(id)
)
```

## Internship

Per limitazioni tecniche, non si può inserire l'ID di Spaggiari nel campo `student`. Un utente che non è ma entrato nell'applicazione, e quindi dall'ID ignoto, potrebbe comunque essere uno stagista.

### Modello Logico

|   Campo    | Descrizione |
| ---------- | ----------- |
| `student`  | Lo studente che sta svolgendo l'attività. |
| `activity` | L'attività svolta dall'utente. |

### Modello Fisico

```SQL
CREATE TABLE Internship (
  student VARCHAR(255) NOT NULL,
  activity INT NOT NULL,
  FOREIGN KEY (activity) REFERENCES Activity(id)
)
```
