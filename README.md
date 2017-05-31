# Il 900 in Piemonte: una strada alla volta

Spesso si percorrono vie attribuite a persone di cui non sappiamo nulla ma che sicuramente hanno scritto pagine di storia italiana e piemontese. Il nostro progetto è nato con l'intento di diventare uno strumento didattico: abbiamo scelto i capoluoghi di provinca del Piemonte e tramite strumenti open source e data set pubblici abbiamo cercato di dare un volto alle persone ed eventi a cui sono intestate le vie delle nostre città.
Fin dall'inizio non ci aspettavamo che tutte le vie sarebbero state identificate o che la persona giusta venisse assegnata ad ogni strada. Consapevoli dei limiti del nostro approccio, e curiosi di vederne il risultato, la nostra priorità era usare dati aperti (le informazioni geografiche di OpenStreetMap e quelle biografiche di Wikipedia e Wikidata) per creare uno stradario tanto imperfetto quanto facilmente riproducibile. Potendo continuare ci piacerebbe renderlo piu' interattivo, permettendo agli utenti di fornire dei feedback sugli abbinamenti via-persona [[siamo abbastanza sicuri che la via Fossati di Y non si riferisca a Ivano Fossati bensì al cardinale Cardinale Maria Fossati]] e aggiungere delle informazioni sugli eventi storici (evidenziati in nero per mancanza di dati strutturati sugli anni).
Per informazioni piu' dettagliate e per mettervi in contatto con noi potete visitare il repository di Github.


## Data Pipeline

Per la realizzazione della Pipeline è stato usato python tramite iPython notebook.
Inizialmente per creare una data pipeline completamente dinamcia si è utilizzato Overpass API per interrogare Open Street Map
Successivamente abbiamo deciso di utilizzare gli estratti di Open Street Map. http://osm-estratti.wmflabs.org/estratti/
Per convertire gli estratti in file geoJson è stato utilizzato il tool ogr2ogr che converte da formato shp in geojson
Per ogni capoluogo provincia abbiamo scaricato gli stradari messi a disposizione dalla comunità OSM
convertiti in geoJson con aaa2sss.

Una via può essere composta da più id e quindi necessario crearsi una tabella di lookup tra Nome via  e ID che compongono la via

Per ogni città abbiamo ripulito i nomi della strade utilizzando dei token individuati tramite un'analisi fatta su tutti i nomi delle strade dei capoluoghi.

Per ogni nome via ci siamo affidati al motore di ricerca Google per capire per capire se si trattatva di qualcosa/qualcuno di significativo.
SOno stat
se tra i primi 5 risultati c'è un risultato di WIKIPEDIA ci salviamo il link relativo.

Inizialmente abbiamo utilizzato WikiData tramite delle Query SPARQL per

poi abbiamo preferito l'uso di scrapy direttamente nella pagina Wikipedia.
Tramite Scrapy abbiamo abbinato ai dati geografici delle vie le informazioni utili trovate nella pagina di Wikipedia nel caso si tratti di un'entità Human or Data.

Il risultato finale è un file GEOJSON per capoluogo di provincia contenente tutti gli id abbinati ad una via/piazza/ il cui nome è presente in Wikipedia. 
### Prerequisites

What things you need to install the software and how to install them

```
Give examples
```

### Osservazioni

in questo progetto sono stati utlizzati unicamente software opensource (python, IPython notebook, )e dati aperti (OSM, Wikipedia)

Ci sono alcune imprecisioni dovute ad esempio

Un'altro aspetto non completamente soddisfacente è la categorizzazione delle vie composte da delle date: in wikipedia non è presente l'evento specifico ma 

Es: 2 giugno

METTERE QUI STAT SULLE CITTA'
## Istruzioni per eseguirlo in locale

Explain how to run the automated tests for this system

1_ scaricare gli stradari da xxx



## Deployment



## Built With

* [IPython Notebook](https://ipython.org/notebook.html) - The IPython Notebook is now known as the Jupyter Notebook. It is an interactive computational environment, in which you can combine code execution, rich text, mathematics, plots and rich media. 
* [Leaflet](http://leafletjs.com) - an open-source JavaScript library for mobile-friendly interactive maps
* [D3](https://d3js.org) - D3 is a JavaScript library for visualizing data with HTML, SVG, and CSS.
* [Github pages](https://pages.github.com/) - Websites for you and your projects, hosted directly from your GitHub repository. Just edit, push, and your changes are live.
* [Google API](https://github.com/MarioVilas/google)
* [Scrapy](https://scrapy.org/) - An open source and collaborative framework for extracting the data you need from websites. In a fast, simple, yet extensible way.
* [ogr2ogr](http://www.gdal.org/ogr2ogr.html) From SHP ti GeoJson file

## Vuoi contribuire

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Autori

* **Federico Piovesan** - *Initial work* -
* **Maria Claudia Bodino** - *Initial work* - https://github.com/mariaclaudia


## Licenza

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Ringraziamenti

Un ringraziamento a Napo (https://twitter.com/napo) per i consigli e le dritte su OSM e dintorni.
