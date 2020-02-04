# Utente

Un utente senza particolari privilegi potrà solamente cercare aziende e salvarle tra i preferiti. La possibilità di prenotare non è prevista perché questo sarebbe il lavoro del reponsabile PCTO. L'utente quindi potrà solo riferirgli di aver trovato alcune aziende idonee al suo percorso, ma non potrà effettivamente prenotarle.

Il sistema del salvataggio tra i preferiti anziché la prenotazione è che permette di salvare più possibili aziende, contro la prenotazione che permetterebbe di salvarne solo una o al massimo due.

Per ogni azienda, un utente potrà anche visualizzare che percorsi sono stati fatti dall'ultima, per capire più nello specifico che tipo di attività andrà a svolgere.

# Amministrazione

Visto che si possono modificare i singoli privilegi per ogni utente, non esiste un vero e proprio account "amministratore". Nonostante ciò, i dati in sé e come sono organizzati sono molto flessibili. Chi ha i permessi potrà accedere a dei pannelli specifici per modificare i dati di un'azienda, aggiungerne una nuova, che tipo di dati verranno salvati e che pattern dovranno seguire.

# Dettagli tecnici

L'applicazione verrà sviluppata unicamente con Javascript, utilizzando le librerie React e Bootstrap.

### React

React permette di mostrare HTML in maniera molto dinamica. Viene utilizzato in *single page apps*, ovvero pagine che necessitano solo di una pagina `index.html`. Il resto (inclusi i vari link) viene gestito da React, che permette di caricare diversi componenti in base all'interazione dell'utente, ma restando sempre sulla stessa pagina.

Permette la lettura e la scrittura del codice molto più rapida, in quanto l'output è un XML formattato come HTML.

Ad esempio:
```Javascript
return(
  <div>
    <h1>Sono un testo</h1>
    <p>Creato in javascript!</p>
  </div>
);
```

L'applicazione utilizza altre librerie che lavorano assieme a React (Redux, React-Bootstrap).
Più informazioni su React sono disponibili su [questo link](https://reactjs.org/).

### Bootstrap

Bootstrap è una libreria CSS e JS che può rendere un'applicazione responsive e ben formattata con solo poche classi. Ad esempio:

```HTML
<div class="container">
  <h1 class="display-1">Un testo grande</h1>
  <p class="lead">Un testo che salta all'occhio</p>
</div>
```

Più informazioni su Bootstrap sono disponibili su [questo link](https://getbootstrap.com/), e informazioni su React-Bootstrap su [questo link](https://react-bootstrap.netlify.com/).
