Imagini
=================

A lightweight small Image search abstraction layer in JavaScript.

### Pre-requisites

1. ***npm/yarn***

Have [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/en/) installed on your development machine.

2. ***mongodb*** or preferred datastore

This is mainly for storing the history of searches for images, this does not need to be implemented in your project, an alternative store could be used. For this project, however, [mongodb](https://www.mongodb.com/) has been implemented as the datastore for this use case.

To setup Mongodb, follow these [instructions](https://forum.freecodecamp.org/t/guide-for-using-mongodb-and-deploying-to-heroku/19347) which help you setup a mongodb and also help in the deployment to Heroku.

### Setup

``` bash
$ git clone https://github.com/BrianLusina/imagini.git
$ cd imagini
$ npm install
# or if your prefer yarn
$ yarn install
```
> This clones the project and installs the dependencies you will need to run in

### Running the application

Running the application is a simple 1 step process

```bash
$ npm run start
$ yarn start
```
> Starts up the application 

That is it!

Enjoy!