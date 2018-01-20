# Test Front-End para MercadoLibre

Ejercicio práctico de front-end para MercadoLibre. Se puede ver una version estable del proyecto [aqui](https://ml-practice.herokuapp.com).

- [Ejercicio](#ejercicio)
  - [Especificaciones](#especificaciones)
  - [Implementación y tecnologias usadas](#implementaci%C3%B3n-y-tecnologias-usadas)
  - [Comentarios relevantes](#comentarios-relevantes)
  - [Pendientes](#pendientes)
- [Setup](#setup)
  - [Levantar el servidor](#levantar-el-servidor)
  - [Compilar assets](#compilar-assets)

## Ejercicio

### Especificaciones

Los archivos correspondientes a la especificación del ejercicio se encuentran en la carpeta `ejercicio`. Dentro de ella
se encuentra [un pdf](./ejercicio/front-end-test-practico.pdf) que describe la funcionalidades y requisitos esperados
que contenga el proyecto, y en el resto de las carpetas se encuentran distribuidos los [assets](./ejercicio/assets),
los [diseños](./ejercicio/diseños) y las [especificaciones de diseño](./ejercicio/specs) necesarias.

### Implementación y tecnologias usadas

El proyecto contiene un servidor montado en [nodejs](https://nodejs.org/) utilizando [expressjs](http://expressjs.com/)
como framwork del lado del servidor y utilizando [AngularJs](https://angularjs.org) en el lado del cliente. Se utilizó node-sass[node-sass](https://www.npmjs.com/package/node-sass) para manejo de archivos js y scss, y se utilizan dentro del stack del cliente las librerias
[bootstrap](https://getbootstrap.com) y [jquery](https://jquery.com).

### Comentarios relevantes

Al momento de empezar el ejercicio realice una investigación sobre la tecnología React y angular, como tenia conocimiento ya trabajando sobre la tecnologia angular decidí trabajar sobre esta tecnologia ya que no tendría una curva de aprendizaje tan alta poder armar la parte de comunicación del cliente con angularJS y la parte del servidor con Express[documentación oficial de
express](http://expressjs.com/en/4x/api.html) & nodeJS(https://nodejs.org/es/), de esta forma me permitio poder avanzar sobre la maquetacion y desarrollo del api para la utilización de los diferentes recursos a consumir.
Tambien se agrego una pantalla principal de login, que permite poder autenticarse con Mercado Libre para poder empezar a consumir los diferentes recursos que maneja la aplicación.

El maquetado de las pantallas sigue la linea de las especificaciones propuestas en los archivos del ejercicio, pero tambien
se agregaron cambios sobre la estetica propuesta por mercadolibre para mejor la interfaz y usabilidad del cliente con la utilizacion de la aplicacion.

Tambien agregué maquetado para pantallas de [404](https://ml-practice.herokuapp.com/404).

Hay una demo del proyecto hosteada en Heroku[heroku](https://www.heroku.com) se eligio este hosting ya que tiene un sistema muy simple y rápido para poder hacer un deploy de test para nuestras aplicaciones [Ml-practice](https://ml-practice.herokuapp.com)

### Pendientes
--

## Setup

Como dependencia del proyecto se encuentra [Nodejs](https://nodejs.org/es/) > v6.11.13 Para tener una instalación que
respete esta restriccion consultar [aqui](https://nodejs.org/es/download/package-manager/).

El resto de las dependencias se encuentran listadas en el archivo `app/package.json` y son instalables via `npm`.

Clonamos nuestro repositorio
```
$ cd app
$ git init
$ git clone https://github.com/SoriaDamian17/ml-practice.git

```
Instalamos nuestras dependencias
```
$ cd ml-practice
$ npm install

```
Configuramos nuestra aplicacion aplications
```
$ cd ml-practice
$ npm install

```
### Levantar el servidor

Para levantar el servidor en modo desarrollo ejecutar en la terminal `npm start` desde la carpeta `ml-practice`.

Cuando levanta el servidor regenera nuestros assets para la utlizacion en nuestra aplicacion.

### Compilar assets

La compilación y minificación de js y css se realiza usando [node-sass](https://www.npmjs.com/package/node-sass).

Si se desea dejar los assets preparados para produccion, basta con ejecutar `node-sass --source-map true -o public/css public/sass/style.scss` desde la carpeta `ml-practice`, mientras que
durante el proceso de desarrollo es conveniente tener el proceso escuchando cambios en los archivos, lo cual se puede
logar ejecutando `npm start`.
