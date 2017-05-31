# Il 900 in Piemonte: una strada alla volta

Spesso si percorrono vie attribuite a persone di cui non sappiamo nulla ma che sicuramente hanno scritto pagine di storia italiana e piemontese. Il nostro progetto è nato con l'intento di diventare uno **strumento didattico**: abbiamo scelto i capoluoghi di provinca del Piemonte e tramite strumenti open source e data set pubblici abbiamo cercato di dare un volto alle persone ed eventi a cui sono intestate le vie delle nostre città. In particolare modo abbiamo voluto dare risalto alle donne e agli uomini che hanno vissuto nel '900.
Fin dall'inizio non ci aspettavamo che tutte le vie sarebbero state identificate o che la persona giusta venisse assegnata ad ogni strada. Consapevoli dei limiti del nostro approccio, e curiosi di vederne il risultato, la nostra priorità era usare dati aperti (le informazioni geografiche di OpenStreetMap e quelle biografiche di Wikipedia e Wikidata) per creare uno stradario tanto imperfetto quanto facilmente riproducibile. Potendo continuare ci piacerebbe renderlo piu' interattivo, permettendo agli utenti di fornire dei feedback sugli abbinamenti via-persona [[siamo abbastanza sicuri che la via Fossati di Y non si riferisca a Ivano Fossati bensì al cardinale Cardinale Maria Fossati]] e aggiungere delle informazioni sugli eventi storici (evidenziati in nero per mancanza di dati strutturati sugli anni).
Per informazioni piu' dettagliate e per mettervi in contatto con noi potete visitare il repository di Github.

In questo progetto sono stati utlizzati unicamente software opensource (python, IPython notebook, ) e dati aperti (OSM, Wikipedia)

## Data Pipeline

Si è deciso di limitare l'analisi alle città capoluogo del Piemonte.
Per la realizzazione della Pipeline è stato usato python tramite iPython notebook.
Inizialmente per creare una data pipeline completamente dinamcia si è utilizzato Overpass API per interrogare Open Street Map
Successivamente abbiamo deciso di utilizzare gli estratti messi a disposizione dalla comunità OSM. http://osm-estratti.wmflabs.org/estratti/
Per convertire gli estratti in file geoJson è stato utilizzato il tool ogr2ogr che converte da formato shp in geojson
Una via può essere composta da più id e quindi necessario crearsi una tabella di lookup tra Nome via  e ID che compongono la via
Per ogni città abbiamo ripulito i nomi della strade utilizzando dei token (es.Via, Piazza, Corso...) individuati tramite un'analisi fatta su tutti i nomi delle strade dei capoluoghi.
Per ogni nome via ci siamo affidati al motore di ricerca Google per capire per capire se si trattatva di qualcosa/qualcuno di significativo. Se tra i primi 5 risultati restituiti dalla chiamata a Google c'è un risultato di WIKIPEDIA questo ci sembrava sufficientemente 

Inizialmente abbiamo utilizzato WikiData tramite delle Query SPARQL, poi abbiamo preferito l'uso di Scrapy direttamente nella pagina Wikipedia accessible tramite l'URL restituita precedentemente.
Grazie alla libreria Scrapy abbiamo abbinato ai dati geografici delle vie le informazioni utili trovate nella pagina di Wikipedia nel caso si tratti di un'entità Human or Data.

Il risultato finale della pipeline è un file GEOJSON per capoluogo di provincia contenente tutti gli id abbinati ad una via/piazza/ il cui nome è presente in Wikipedia. 

### Statistiche
**Alessandria**: 746 vie di cui 522 entità individuabili su wikipedia.

**Asti**: 522 vie di cui 483 entità individuabili su wikipedia

**Biella**: 527 331 entità individuabili su wikipedia

**Cuneo**: 412 di cui 289 entità individuabili su wikipedia

**Novara**: 840 716 entità individuabili su wikipedia

**Torino**: 3999 vie di cui 2815 individuabili su wikipedia

**Verbania**: 414 vie di cui 226 individuabili su wikipedia

**Vercelli**: 552 vie di cui 489 individuabili su wikipedia


Per via si intendono anche piazze, viali, corsi...

### Osservazioni
Ci sono alcune aspetti sicuramente migliorabili, ad esempio la categorizzazione delle vie composte da delle date: in wikipedia non è presente l'evento storico specifico ma la ricerca ti restituisce una pagina con i vari significato ed eventi legati a quella data

Es: 2 giugno: https://it.wikipedia.org/wiki/2_giugno
L'URL corretta sarebbe: https://it.wikipedia.org/wiki/Festa_della_Repubblica_Italiana


## Tools

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

Un ringraziamento a **[Napo]**(https://twitter.com/napo) per i consigli e le dritte su OSM e dintorni.
