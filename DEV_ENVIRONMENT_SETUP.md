# Development Environment Setup Guide

This guide explains how to automatically start your entire development environment (MySQL, Spring Boot, and Frontend) with a single command.

## 🚀 Quick Start

### Option 1: Full Environment (Recommended)
```bash
npm run dev:full
```

### Option 2: Using Batch File
```bash
npm run dev:batch
```

### Option 3: Using Node.js Script
```bash
node start-dev.js
```

## 📋 What Each Script Does

### 1. **MySQL Management**
- Checks if MySQL service is running
- Automatically starts MySQL if it's stopped
- Tests database connectivity
- Waits for MySQL to be ready

### 2. **Spring Boot Backend**
- Starts the Spring Boot application using Maven
- Waits for the backend to be ready
- Tests the API endpoint
- Runs in a separate terminal window

### 3. **Frontend Development Server**
- Starts the Vite development server
- Opens the application in your browser

## 🛠️ Available Scripts

### Package.json Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start only the frontend (original behavior) |
| `npm run dev:full` | Start everything (MySQL + Spring Boot + Frontend) |
| `npm run dev:batch` | Start everything using batch file |
| `npm run dev:backend` | Start only MySQL and Spring Boot |
