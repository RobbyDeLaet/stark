# Stark Showcase

## About
This is the showcase of Stark.

## Showcase structure
TODO doc; see #393

## Configuration
Most of the configuration files at the root of the showcase either fully reuse or extend Stark's configuration files.
Most of the time you won't need to change these, but they allow you to customize things when needed.

## Getting Started

### System configuration
What you need to run this app:
* `node` and `npm`
* Ensure you're running the latest versions Node `v8.x.x`+ and NPM `5.8.x`+

> If you have `nvm` installed, which is highly recommended you can do a `nvm install --lts && nvm use` in `$` to run with the latest Node LTS. You can also have this `zsh` done for you [automatically](https://github.com/creationix/nvm#calling-nvm-use-automatically-in-a-directory-with-a-nvmrc-file)

### Global dependencies
Once you have those, you should install these globals with `npm install --global`:
* Windows only: `npm install -g node-pre-gyp`

TODO review/complete; see #34

### Installing
First, clone the project:

```bash
# --depth 1 removes all but one .git commit history
git clone --depth 1 https://github.com/NationalBankBelgum/stark.git
```

Then go to the showcase folder (`cd showcase`) and install all dependencies using: `npm install`.

TODO review/complete; see #34

### Running the app
After you have installed all dependencies you can now run the app.
Run `npm run server` to start a local (development) server using `webpack-dev-server` which will watch, build (in-memory), and reload for you.
The port will be displayed to you as `http://0.0.0.0:3000` (or if you prefer IPv6, if you're using `express` server, then it's `http://[::1]:3000/`).

You may enable Hot Module Replacement (HMR) using:

```bash
npm run server:dev:hmr
```

You may also start the server in production mode using the following:
```bash
npm run build:prod
npm run server:prod
```

## Build commands

### Reference
Refer to the Stark developer guide: https://github.com/NationalBankBelgium/stark 

### Build files
```bash
# development
npm run build:dev
# production (jit)
npm run build:prod
# AoT
npm run build:aot
```

### Hot Module Replacement (HMR) mode
```bash
npm run server:dev:hmr
```

### Watch mode
```bash
npm run watch
```

### Run unit tests
```bash
npm run test
```

### Watch and run tests
```bash
npm run watch:test
```

### Run end-to-end tests
```bash
# update Webdriver (optional, done automatically by postinstall script)
npm run webdriver:update # cfr #35
# this will start a test server and launch Protractor
npm run e2e
```

### Continuous Integration (CI): run unit tests and e2e tests together
```bash
# this will test both your JIT and AoT builds
npm run ci
```

### Run Protractor's elementExplorer (for end-to-end)
```bash
npm run e2e:live
```

### Build Docker
```bash
npm run build:docker
```

For more details, refer to the deployment section below.

## Good to know
### AoT Don'ts
The following are some things that will make AoT compile fail.

- Don’t use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don’t use default exports.
- Don’t use `form.controls.controlName`, use `form.get(‘controlName’)`
- Don’t use `control.errors?.someError`, use `control.hasError(‘someError’)`
- Don’t use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public

### Type definitions
When including 3rd party modules you also need to include the type definition for the module.
When you include a module that doesn't include TypeScript type definitions inside of the module you can include external type definitions with @types

```
npm install @types/node
npm install @types/lodash
```

If you can't find the type definition in the registry then you can make use of an ambient definition in the custom-typings.d.ts file.

For example:
```typescript
declare module "my-module" {
  export function doesSomething(value: string): string;
}
```

If you're prototyping and you will fix the types later you can also declare it as type any:

```typescript
declare var assert: any;
declare var _: any;
declare var $: any;
```

If you're importing a module that uses Node.js modules which are CommonJS you need to import as

```typescript
import * as _ from 'lodash';
```

### External Stylesheets
TODO explain how stylesheets are loaded.

## Tools

### TypeScript-aware editors
We have good experience using these editors:

* [Visual Studio Code](https://code.visualstudio.com/)
* [IntelliJ IDEA](https://www.jetbrains.com/idea/download/)
* [Webstorm](https://www.jetbrains.com/webstorm/download/)
* [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
* [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

### Visual Studio Code + Debugger for Chrome
> Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and see docs for instructions to launch Chrome

The included `.vscode` automatically connects to the webpack development server on port `3000`.

## Deployment

### Docker

To run project you only need host machine with **operating system** with installed **git** (to clone this repo)
and [docker](https://www.docker.com/) and thats all - any other software is not needed
(other software like node.js etc. will be automatically downloaded and installed inside docker container during build step based on dockerfile).

#### Install docker

##### MacOS:

`brew cask install docker`

And run docker by Mac bottom menu> launchpad > docker (on first run docker will ask you about password)

##### Ubuntu:

```
sudo apt-get update
sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sudo apt-add-repository 'deb https://apt.dockerproject.org/repo ubuntu-xenial main'
sudo apt-get update
apt-cache policy docker-engine
sudo apt-get install -y docker-engine
sudo systemctl status docker  # test:  shoud be ‘active’
```
And add your user to docker group (to avoid `sudo` before using `docker` command in future):
```
sudo usermod -aG docker $(whoami)
```
and logout and login again.

#### Build image
Because *node.js* is big memory consumer you need 1-2GB RAM or virtual memory to build docker image.

Go to the main project folder. To build big (~280MB) image which has cached data and is able to **FAST** rebuild  
(this is good for testing or staging environment) type:

`docker build -t stark-showcase .`

To build **SMALL** (~20MB) image without cache (so each rebuild will take the same amount of time as first build)
(this is good for production environment) type:

`docker build --squash="true" -t stark-showcase .`

The **stark-showcase** name used in above commands is only example image name.
To remove intermediate images created by docker on build process, type:

`docker rmi -f $(docker images -f "dangling=true" -q)`

#### Run image

To run created docker image on [localhost:8080](localhost:8080) type (parameter `-p 8080:80` is host:container port mapping)

`docker run --name stark-showcase -p 8080:80 stark-showcase &`

And that's all, you can open browser and go to [localhost:8080](localhost:8080).

#### Build and Run image using docker-compose

To create and run docker image on [localhost:8080](localhost:8080) as part of large project you may use **docker-compose**. Type 

`docker-compose up &`

And that's all, you can open browser and go to [localhost:8080](localhost:8080).