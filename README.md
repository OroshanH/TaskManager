# TaskManager
Task management tool built with React, Tailwind CSS, and TanStack Query, with a Java/Spring Boot backend using an H2 database.

**How to run the Task manager**
(Java 17+ & Node.JS + npm is required)

Frontend: 
(Powershell terminal)
cd frontend
npm install
npm run dev
The frontend should now be running at http://localhost:5173

Backend:
cd backend
.\mvnw.cmd spring-boot:run

The H2 database can be accesed at http://localhost:8080/h2-console
JDBC URL: jdbc:h2:file:./data/appdb
Username: sa 
