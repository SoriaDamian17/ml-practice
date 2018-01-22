# Test Front-End para MercadoLibre
Ejercicio práctico de front-end para MercadoLibre. Se puede ver una version estable del proyecto [aqui](https://ml-practice.herokuapp.com).
- [Ejercicio](#ejercicio)
 - [Especificaciones](#especificaciones)
 - [Implementación y tecnologías usadas](#implementaci%C3%B3n-y-tecnologias-usadas)
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

### Implementación y tecnologías usadas (App/AngularJs)
El proyecto contiene un servidor montado en [nodejs](https://nodejs.org/) utilizando [expressjs](http://expressjs.com/)
como framework del lado del servidor y utilizando [AngularJs](https://angularjs.org) en el lado del cliente. Se utilizó node-sass[node-sass](https://www.npmjs.com/package/node-sass) para manejo de archivos js y scss, y se utilizan dentro del stack del cliente las librerías
[bootstrap](https://getbootstrap.com) y [jquery](https://jquery.com).

### Implementación y tecnologías usadas (App/BackboneJs)
El proyecto contiene un servidor montado en [nodejs](https://nodejs.org/) utilizando [expressjs](http://expressjs.com/)
como framework del lado del servidor y utilizando [BackboneJs](http://backbonejs.org/) en el lado del cliente. Se utilizó node-sass[node-sass](https://www.npmjs.com/package/node-sass) para manejo de archivos js y scss, y se utilizan dentro del stack del cliente las librerías
[bootstrap](https://getbootstrap.com) y [jquery](https://jquery.com)

### Comentarios relevantes

Realice el ejercicio utilizando dos stack diferentes para el desarrollo y comunicación entre el servidor y el cliente, debido que no tenía mucho conocimiento sobre el stack de backbone, decidí primero hacer el desarrollo del ejercicio en una tecnología que venia utilizando AngularJs para poder lograr avanzar con el diseño y maquetación del proyecto, para que una vez terminado en esta tecnología pudiera reutilizar todo lo ya maquetado, para poder empezar a trabajar en la tecnología backbone Js.

El maquetado de las pantallas sigue la línea de las especificaciones propuestas en los archivos del ejercicio, pero también se agregaron cambios sobre la estetica propuesta por mercadolibre para mejor la interfaz y usabilidad del cliente, también tuvimos en cuenta la utilizacion del [schema](http://schema.org) y [ARIA](https://www.w3.org/WAI/intro/aria) para el seo de los productos, con la utilización de la aplicación.
Para el ejercicio de AngularJs se configuró una aplicación mercadolibre para poder consumir recursos privados.
 
Tambien agregué maquetado para pantallas de [404](https://ml-practice.herokuapp.com/404).
y
[404](https://backbone-ml-practice.herokuapp.com/404).
Para poder hostear los ejercicios se utilizo Heroku[heroku](https://www.heroku.com) ya que tiene un sistema muy simple y rápido para poder hacer un deploy de test para nuestras aplicaciones [Ml-practice](https://ml-practice.herokuapp.com) AngularJS
[Ml-practice-backbone](https://backbone-ml-practice.herokuapp.com) BackboneJS

### Pendientes
-- Quedo pendiente poder terminar de agregar al node api/items/search?, el atributo description para poder mostrarlo en el listado de los productos.

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
Ingresamos a nuestra aplicación AngularJs o BackboneJs

```
$ cd app/AngularJs
o
$ cd app/BackboneJs
```

Instalamos nuestras dependencias

```
$ cd AngularJs
$ npm install
```

Iniciamos nuestro servidor

```
$ npm start
```

### Aplicación Mercadolibre

Para nuestro ejercicio en AngularJs deberemos configurar nuestra aplicacion ML ingresando a http://applications.mercadolibre.com y crearemos nuestra aplicacion para poder configurarla en nuestro proyecto.

Tendremos que darle permisos de lectura y tildar el tópico de items
En caso de probar el ejercicio de manera local deberemos configurar en el campo Redirect URI * la siguiente url http://localhost:3000/api/auth/mercadolibre/callback

### Levantar el servidor

Para levantar el servidor en modo desarrollo ejecutar en la terminal `npm start` desde la carpeta `angularJs` o `backboneJs`.
Cuando levanta el servidor regenera nuestros assets para la utilización en nuestra aplicacion.

### Compilar assets

La compilación y minificación de js y css se realiza usando [node-sass](https://www.npmjs.com/package/node-sass).
Si se desea dejar los assets preparados para producción, basta con ejecutar `node-sass --source-map true -o public/css public/sass/style.scss` desde la carpeta `ml-practice`, mientras que
durante el proceso de desarrollo es conveniente tener el proceso escuchando cambios en los archivos, lo cual se puede
logar ejecutando `npm start`.
