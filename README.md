# UIP_Project

## Team members
- Simon Pislar

## Description
This is a project for the course User Interface Programming. The project is a web application version of the swedish game "Ryktet går".
The game is best played with at least 4 players.

## Running the application
All instructions are sure to work on MacOS. If you are using another operating system, some parts of the instructions might have to be altered.
### Server
The folliwng instructions are for running the server.
#### Install Java
You need to install Java. You can download Java [here](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).
After you have installed Java, you can run the following command in the terminal to check if the installation was successful:
```
java -version
```
If it was successful, you should see the version of Java.
#### Install Mysql
Now you have to setup a mysql database. You can download mysql [here](https://dev.mysql.com/downloads/mysql/).
After you have installed mysql, you can run the following command in the terminal to check if the installation was successful:
```
mysql --version
```
If it was successful, you should see the version of mysql. You can now create a database by running the following command in the terminal:
```
mysql -u root -p
```
After you have run the command, you should be prompted to enter a password. You can now create a database by running the following command in the terminal:
```
CREATE DATABASE ryktetgar;
```
After you have created the database, you can run the following command in the terminal to check if the database was created:
```
SHOW DATABASES;
```
If it was successful, you should see the database you created. You can now create a user by running the following command in the terminal:
```
CREATE USER 'ryktetgar'@'localhost' IDENTIFIED BY 'ryktetgar';
```
After you have created the user, you can run the following command in the terminal to check if the user was created:
```
SELECT User FROM mysql.user;
```
If it was successful, you should see the user you created. You can now grant the user access to the database by running the following command in the terminal:
```
GRANT ALL PRIVILEGES ON ryktetgar.* TO 'ryktetgar'@'localhost';
```
After you have granted the user access to the database, you can run the following command in the terminal to check if the user has access to the database:
```
SHOW GRANTS FOR 'ryktetgar'@'localhost';
```
If it was successful, you should see the user has access to the database. You can now exit the mysql shell by running the following command in the terminal:
```
exit
```
You now need to update the application.properties file located in the resources folder in the server project. You need to update the following lines:
```
spring.datasource.url=jdbc:mysql://localhost:3306/ryktetgar
spring.datasource.username=ryktetgar
spring.datasource.password=ryktetgar
```
You need to update the username and password to the username and password you created.
#### Install Maven
After that you need to install Maven. You can download Maven [here](https://maven.apache.org/download.cgi).
After you have installed Maven, you can run the following command in the terminal to check if the installation was successful:
```
mvn -v
```
If it was successful, you should see the version of Maven. To run the server, you need to navigate to the folder where the project is located.
After you have navigated to the folder, you can run the following command in the terminal:
```
mvn clean install
mvn spring-boot:run
```
After you have run the commands, you should see a message in the terminal that says "Tomcat started on port(s): 8080 (http) with context path ''".
### Client
The following instructions are for running the client.
#### Update server address
You need to update the server address in the client module. To do this, navigate to the src folder in the client project and open the file clientConfig.json. 
You need to update the server address to the address where the server is running. The default address is "http://localhost:8080". You also need 
to update the websocket address. This is done in the same file. The default address is "ws://localhost:8080/ws". The file should look like this:
```
{
  "serverIP": "http://localhost:8080"
  "serverWS": "ws://localhost:8080/ws"
}
```
#### Install Node.js
To run the application, you need to have Node.js installed. If you don't have it installed, you can download it [here](https://nodejs.org/en/). 
After you have installed Node.js, you can run the following command in the terminal to check if the installation was successful:
```
node -v npm -v
```
If it was successful, you should see the version of Node.js and npm.
To run the application, you need to navigate to the folder where the project is located.
After you have navigated to the folder, you can run the following command in the terminal:
```
npm install
npm start
```
After you have run the commands, you should see a message in the terminal that says "Server is running on port 3000".
You can now open a web browser and navigate to the following URL:
```
http://localhost:3000/
```
You should now see the application running in the web browser.
