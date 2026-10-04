# Smart Expense Tracker

A full-stack expense management application built using **React, Spring Boot, and MySQL**.

The application allows users to manage their transactions, track expenses and income, filter transactions by month, and visualize expense information through charts.

## 👨‍💻 Author

**E. Madhu**

## 🚀 Features

- Add income and expense transactions
- Edit existing transactions
- Delete transactions
- Store transaction title, amount, type, category, and date
- View recent transactions
- Filter transactions by month
- View expense information using charts
- MySQL database integration
- REST API using Spring Boot
- React-based responsive frontend

## 🛠️ Technologies Used

### Frontend

- React
- JavaScript
- Vite
- CSS
- Recharts

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven

### Database

- MySQL

### Tools

- Eclipse
- Visual Studio Code
- Git
- GitHub

## 📁 Project Structure

```text
SmartExpenseTracker/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
├── .gitignore
└── README.md
```

## 🗄️ Database

The application uses a MySQL database named:

```text
smart_expense_tracker_new
```

The backend connects to MySQL using Spring Data JPA.

### Database configuration

The database password is intentionally **not stored in GitHub**.

The backend uses the following environment variable:

```properties
spring.datasource.password=${DB_PASSWORD}
```

Set the environment variable before running the backend.

### PowerShell

```powershell
$env:DB_PASSWORD="your_mysql_password"
```

## ▶️ How to Run the Project

### 1. Start the Backend

Open PowerShell and navigate to the backend:

```powershell
cd "D:\FullStackProjects\SmartExpenseTracker\backend"
```

Set the database password:

```powershell
$env:DB_PASSWORD="your_mysql_password"
```

Start Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend runs on:

```text
http://localhost:8083
```

Make sure MySQL is running before starting the backend.

---

### 2. Start the Frontend

Open another PowerShell window:

```powershell
cd "D:\FullStackProjects\SmartExpenseTracker\frontend"
```

Install dependencies if required:

```powershell
npm install
```

Start the React development server:

```powershell
npm run dev
```

Vite will provide the local frontend URL in the terminal, normally:

```text
http://localhost:5173
```

## 🔄 Application Flow

```text
React Frontend
      ↓
REST API
      ↓
Spring Boot Backend
      ↓
Spring Data JPA / Hibernate
      ↓
MySQL Database
```

## 📊 Main Functionality

The application manages financial transactions containing:

- Title
- Amount
- Type
- Category
- Date

Users can add, edit, delete, view, and filter transactions. The application also provides chart-based expense visualization.

## 🎯 Project Goal

The goal of this project is to build a practical full-stack application while applying concepts from:

- Java
- Spring Boot
- REST APIs
- JPA/Hibernate
- MySQL
- React
- Git and GitHub

## 📌 Future Improvements

Possible future enhancements include:

- User authentication and login
- Budget management
- Expense alerts
- Advanced reports
- Export transactions to CSV/PDF
- Cloud database integration
- Deployment to a cloud platform

## 📄 License

This project is created for learning and portfolio purposes.

---

**Developed by E. Madhu**
