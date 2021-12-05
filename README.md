[![forthebadge](https://forthebadge.com/images/badges/powered-by-black-magic.svg)](https://forthebadge.com)


# Dashboard

Projet Epitech fait par ***Pierrick Gouerec*** et ***Brandon Gachenot***

## **Objectif du projet**

Créer un Dashboard comme [NetVibes](https://www.netvibes.com/en)

Projet réalisé en ***React.js*** et ***Node.js*** avec ***Docker*** et ***Firebase***

## Informations du projet

Le frontend est disponible aux adresses:

- ``` localhost:3000 ```

Le backend est disponible a l'adresse:

- ```localhost:8080```

## Services et Widgets

### Services disponibles

- Intranet

## Lancer le projet

- ```docker-compose build && docker-compose up```

  NB: The build of the front may be long to start display things but it's not an infinite loop. Please be patient!

## Routes

Base_URL = ```http://localhost:8080/```

#### About

- ``` GET /about.json```

#### Weather

- ``` GET /weather?city=<city>&country=<country>```
  - city: **mandatory**
  - country: **optional**

#### RSS

- ``` GET /rss?url=<url>```
  - url: (**mandatory**): url to the RSS flux

#### Steam

- ``` GET /steam/friends?ID=<steam_id>```
  - steam_id: (**mandatory**): ID of the Steam player

- ``` GET /steam/game?ID=<ID>```
  - ID: (**mandatory**): ID of the Steam game