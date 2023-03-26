# YuanshenServer

Just something I did in my free time. Nothing serious. Maybe i'll update it *some* day.  
Most of the credit goes to RustySamovar.

Requires json & protos in the `assets/json` & `assets/protos` folders.

Can be deployed with docker-compose.

The main objective was to play around with Typescript, Monorepos and Docker. Making a private server for a certain anime game was secondary.

This project was generated using [Nx](https://nx.dev).

<p style="text-align: center;"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="450"></p>

🔎 **Smart, Fast and Extensible Build System**

## Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.
