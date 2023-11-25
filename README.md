<p align="center">
    <a href="https://vps.rarcos.com:10451/" target="_blank">
        <img src="./frontend/gesmerca/src/assets/img/icons/gesmerca.png" alt="GesMerCa Logo">
    </a>
    +
    <a href="https://angular.io/" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg" width=150 alt="Angular Logo">
    </a>
    +
    <a href="https://spring.io/projects/spring-boot" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/commons/7/79/Spring_Boot.svg" width=130 alt="Spring Logo">
    </a>
</p>

<p align="center"><a href="https://vps.rarcos.com:10451/" target="_blank">Try the demo online</a></p>

# Frontend - Angular

## How to run it locally

1. [Download](https://github.com/rubenarcos2/proyecto_daw/archive/refs/heads/main.zip) or clone the [repository](https://github.com/rubenarcos2/proyecto_daw.git) to your local machine:

```bash
$ git clone https://github.com/rubenarcos2/proyecto_daw.git
```

2. Go to directory `cd frontend/gesmerca` inside:
3. Run `npm install` inside the downloaded/cloned folder:

```bash
$ npm install
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build to production serve

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# Backend - Spring Boot

## Requirements

For building and running the application you need:

- [JDK 1.8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
- [Maven 3](https://maven.apache.org)

## Running the application locally

There are several ways to run a Spring Boot application on your local machine. One way is to execute the `main` method in the `gesmerca\backend\gesmerca\src\main\java\com\rarcos\gesmerca\GesMerCaApplication.java` class from your IDE.

Alternatively you can use the [Spring Boot Maven plugin](https://docs.spring.io/spring-boot/docs/current/reference/html/build-tool-plugins-maven-plugin.html) like so:

```shell
mvn spring-boot:run
```
