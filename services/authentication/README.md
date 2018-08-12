# <a href='http://www.arimilli.io'><img src='http://www.arimilli.io/logo/newshub-server.png' height='80'></a>
[![Build Status](https://travis-ci.org/bharatari/newshub-server.svg?branch=master)](https://travis-ci.org/bharatari/newshub-server)
[![Coverage Status](https://coveralls.io/repos/github/bharatari/newshub-server/badge.svg?branch=master)](https://coveralls.io/github/bharatari/newshub-server?branch=master)

The server implementation of the NewsHub project built on the [Feathers](http://feathersjs.com) Node.js framework.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies
    
    ```
    cd path/to/newshub-server; npm install
    ```

3. Start your app
    
    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Features

### Access Control System

Our access control system, located primarily in the `/utils/access.js` file, is designed to be flexible, scalable and extensible. Roles act as user groups and permission presets while permissions are granular levels of access control. Roles can also generally refer to both roles and permissions in certain cases. For example, the field to include a user's roles and permissions on a user record is simply called `roles`.

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## License

Copyright (c) 2015 Bharat Arimilli
