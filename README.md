# Taskwise

**Taskwise** is a multi-user task management API that allows users to create, assign, and comment on tasks with role-based access controls. Built with TypeScript, Express, Supabase (PostgreSQL), and Drizzle ORM.

## 🔧 Features

- User authentication and authorization (JWT based)
- Create, update, and delete tasks
- Assign tasks to users
- Commenting system with admin override
- Role-based permissions for task updates
- Input validation using Zod

## 🧰 Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js with Express.js
- **Authentication & Authorization**: Json Web Tokens (JWT)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Encryption**: bcrypt
- **Environment Config**: dotenv

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- Supabase project set up (or any PostgreSQL instance)

### Installation

```bash
git clone https://github.com/Jessepelumi/taskwise.git
cd taskwise
npm install
```

## 🌐 Live API

A live version of the API is available here:  
🔗 [https://taskwise-js54.onrender.com/api/tasks](https://taskwise-js54.onrender.com/api/tasks)

> You can use this URL with Postman, Insomnia, or cURL to test endpoints in real time.
