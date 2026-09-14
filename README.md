# Smart Recruitment Matching Platform (SRMP)

## 📌 Project Overview

The Smart Recruitment Matching Platform (SRMP) is a web-based recruitment platform designed to connect Job Seekers and Employers through an efficient job matching and recruitment process.

The platform allows Job Seekers to create profiles, manage their skills and experience, search and apply for vacancies, while Employers can create company profiles, publish job vacancies, review applicants and manage recruitment activities.

The system also provides Administrator functionality for managing users and monitoring the platform.

---

## 🎯 Main Objectives

- Connect qualified Job Seekers with suitable job opportunities.
- Allow Employers to publish and manage job vacancies.
- Provide a structured Job Seeker profile and application process.
- Support automated/rule-based candidate and vacancy matching.
- Provide secure authentication and role-based access.
- Allow Administrators to manage users and system activities.
- Provide a centralized recruitment management platform.

---

## 👥 User Roles

The system contains three main user roles:

### 1. Job Seeker

Job Seekers can:

- Register and log in.
- Create and manage their profile.
- Add skills, education and experience.
- Upload/manage CV information.
- Browse available job vacancies.
- View job details.
- Apply for suitable vacancies.
- View application status.
- Receive notifications.

### 2. Employer

Employers can:

- Register and log in.
- Create and manage company information.
- Create job vacancies.
- Update and manage vacancies.
- View applicants.
- Review candidate information.
- Manage application status.
- Send/manage contact requests where applicable.

### 3. Administrator

Administrators can:

- Log in to the administration area.
- Manage users.
- Monitor system activities.
- Manage platform-related information.

---

# 🛠️ Technology Stack

## Frontend

- Angular 21.2.x
- TypeScript 5.9.x
- HTML5
- CSS3
- Tailwind CSS 4.1.x
- RxJS
- Angular Router

## Backend

- ASP.NET Core Web API
- .NET 8
- C#
- Entity Framework Core 8.0.30
- JWT Bearer Authentication
- BCrypt.Net-Next
- Swagger / OpenAPI

## Database

- Microsoft SQL Server
- SQL Server LocalDB
- Entity Framework Core Migrations

## Development Tools

- Visual Studio
- Visual Studio Code
- Git
- GitHub
- SQL Server Management Studio (SSMS)
- npm
- Prettier
- Vitest
- JSDOM

---

# 🏗️ Project Structure

```text
Smart-Recruitment-Matching-Platform/
│
├── Backend/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Models/
│   ├── Repositories/
│   ├── Services/
│   ├── Data/
│   ├── Migrations/
│   ├── Storage/
│   ├── Properties/
│   ├── Program.cs
│   ├── appsettings.json
│   └── Backend.csproj
│
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/
│   │   │   ├── shared/
│   │   │   ├── core/
│   │   │   └── ...
│   │   ├── assets/
│   │   └── styles.css
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
│
└── README.md
