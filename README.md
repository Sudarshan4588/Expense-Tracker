# 💰 Expense Tracker

A **web-based Expense Tracker** built with **Java Spring Boot**, **Spring Security**, and **JavaScript**.  
It allows users to **manage personal expenses**, **view analytics**, and **download yearly expense reports** as PDF.  

---

## 🌟 Features

- **User Authentication**
  - Login required to access the application.
  - Default credentials for testing:
    - **Username:** `user`
    - **Password:** `user123`

- **Expense Management (CRUD)**
  - **Add Expense:** Add a new expense with title, amount, category, and date.  
  - **View Expenses:** See all expenses in a table with filters.  
  - **Edit Expense:** Update existing expense details.  
  - **Delete Expense:** Remove an expense.  

- **Analytics**
  - **Total Expenses:** See total expenses for the current year.  
  - **Category-wise Expenses (Pie Chart):** Visualize which categories consume the most budget.  
  - **Month-wise Expenses (Bar Chart):** Track expenses month by month.  

- **PDF Export**
  - Download a **yearly PDF report** of all expenses for the current year.  

---
## 🚀 Installation

### 1️⃣ Clone the Repository
Open your terminal and run:

```bash
git clone https://github.com/Sudarshan4588/Expense_Tracker.git
cd Expense_Tracker
2️⃣ Open the Project in IntelliJ IDEA

Launch IntelliJ IDEA.

Click File → Open and select the Expense_Tracker folder.

Make sure Java 17+ or your configured JDK is installed.

3️⃣ Configure the Database
Configure PostgreSQL in application.properties:

spring.application.name=expense-tracker
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_trackers
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
server.port=8081
spring.security.user.name=user
spring.security.user.password=user123
Make sure PostgreSQL is running and the database expense_trackers exists.

4️⃣ Run the Application

Run ExpenseTrackerApplication.java from IntelliJ.

Backend API will be available at:

http://localhost:8081/api/expenses

5️⃣ Open the Frontend
Open in your browser:

http://localhost:8080

6️⃣ Login
Use the default credentials:

Username: user
Password: user123

7️⃣ Start Using the App
Add, edit, and delete expenses.

View charts side by side:

Pie chart → Total expenses by category

Bar chart → Expenses per month

Download a yearly PDF report of all expenses.

🔧 Tech Stack
Backend: Java, Spring Boot, Spring Security, Spring Data JPA

Frontend: HTML, CSS, JavaScript, Chart.js

Database: PostgreSQL

PDF Generation: jsPDF

