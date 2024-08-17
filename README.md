# Fortuna Starter App

## About

**Fortuna** is a React/Typescript frontend and Spring/Java backend starter app meant to provide a quick way to begin 
development on web applications.

## Getting Started

### Development Setup

1. Install Java with [SDKMAN!](https://sdkman.io/)
   ```shell
   curl -s "https://get.sdkman.io" | bash
   
   . ~/.zshrc
   sdk install java 17.0.11-librca
   ```
   Export `JAVA_HOME` by opening your `.zshrc` file
   ```shell
   vi ~/.zshrc
   ```
   Add `export JAVA_HOME="$HOME/.sdkman/candidates/java/current/bin"` (press `i` to insert text),
   save and exit (press `esc`, type `:x`, and press `enter`),
   and source your `.zshrc` file
   ```shell
   source ~/.zshrc
   ```
   or
   ```shell
   . ~/.zshrc
   ```
2. Install node with [nvm](https://github.com/nvm-sh/nvm)
   ```shell
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   
   nvm install 20
   nvm use 20
   ```
3. Install yarn
    ```shell
    npm install --global yarn
    ```
4. [Install Docker](https://docs.docker.com/get-docker/)
5. Install IntelliJ IDEA
6. Clone the Repository
7. Setup Java
    1. In IntelliJ, open `Project Structure` > `Platform Settings` > `SDKs`, click the `+`,
       and select the option ending in `.sdkman/candidates/java/current`; name it `liberica-17`
    2. In this same window, go to `Project Settings` > `Project`, set the SDK to `liberica-17`
       and the Language level to `SDK default`
    3. In IntelliJ, open `Settings` > `Build, Execution, Deployment` > `Build Tools`,
       and set the Gradle JVM to be `liberica-17`.
8. Setup EditorConfig
   1. In IntelliJ, open `Settings` > `Editor` > `Code Style`, and check `Enable EditorConfig support`
9. Setup ESLint
   1. In a Terminal, navigate to the `frontend` folder and run `yarn install`
      (This step is not needed if dependencies are already up-to-date.)
   2. Go into IntelliJ settings and search for `ESLint` to find the settings
      under `Languages & Frameworks` > `Javascript` > `Code Quality` > `ESLint`
   3. Select `Automatic ESLint configuration`
   4. Check the box to `Run eslint --fix on save`
10. Setup Prettier
    1. In a Terminal, navigate to the `frontend` folder and run `yarn install`
       (This step is not needed if dependencies are already up-to-date.)
    2. Go into IntelliJ settings and search for `Prettier` to find the settings
       under `Languages & Frameworks` > `Javascript` > `Prettier`
    3. Select `Automatic Prettier configuration`
    4. Check the boxes to run Prettier `Run on save`
11. (Optional) Install the Multirun plugin
12. (Optional) Install the `Key Promoter X` plugin
    1. Open IntelliJ settings and navigate to `Plugins`
    2. Search the marketplace for `Key Promoter X` and install the plugin
    3. When the installation has finished, you will be prompted to restart the IDE
13. (Optional) Install the [Testing Playground](https://testing-playground.com/) extension in Chrome
    1. Navigate to the
       [Testing Playground Chrome Extension page](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano)
    2. Install the extension
    3. To use the extension, when using the dev tools in Chrome, navigate to the tab with the frog icon
14. (Optional) Add command line aliases
    1. Open your `.zshrc` file
    2. Add the following environment variables
       ```
       # Command Aliases
       #alias br="SPRING_PROFILES_ACTIVE=dev ./gradlew bootRun"
       #alias tb="./gradlew test"
       #alias tf="./gradlew testFrontend"
       #alias tj="./gradlew testJourney"
       #alias ta="./gradlew testAll"
       #alias fc="./gradlew flywayClean"
       #alias fm="./gradlew flywayMigrate"
       #alias dd="docker-compose down"
       #alias du="docker-compose up -d"
       ```
    3. Save, exit, and source your `.zshrc` file

## Setting up SonarQube (Optional)
SonarQube is a software analysis tool that allows users to view test coverage, code duplication, and code smells throughout the application. SonarQube can be set up locally and ran periodically to get a snapshot of Mercury's health. <br>
1. Set up SonarQube:
    1. Complete steps 1-4 in this [knowledge base article](https://knowledgebase.swf.army.mil/blog/2023-10-26-local-sonarqube).
    2. The gradlePlugin mentioned in step 5 is configured in Mercury.
2. Generate a SonarQube coverage report
    1. Run frontend and backend tests in order to generate a current coverage report. You can use `./gradlew testUnit` to run only frontend and backend tests.
    2. Run `./gradlew sonar -Dsonar.token=$SONAR_USER_TOKEN` to upload your coverage reports to SonarQube.
    3. Visit `localhost:9500` to view SonarQube code analysis.
    4. (Optional) You can create an alias that runs all tests and uploads the report to SonarQube: `./gradlew testUnits && ./gradlew sonar -Dsonar.token=$SONAR_USER_TOKEN`

## Running the App Locally

If you installed the Multirun plugin, then make sure Docker is running and run the `Fortuna` run config.
