# Create project directories
mkdir -p backend/src
mkdir -p backend/config
mkdir -p database

# Move schema.sql to database folder
mv sql/schema.sql database/schema.sql

# Create backend folder structure
echo "node_modules/" > backend/.gitignore
echo "{
  \"name\": \"grapework-backend\",
  \"version\": \"1.0.0\",
  \"description\": \"Backend server for GrapeWork application\",
  \"main\": \"src/server.js\",
  \"scripts\": {
    \"start\": \"node src/server.js\",
    \"dev\": \"nodemon src/server.js\"
  },
  \"dependencies\": {
    \"express\": \"^4.17.1\",
    \"mysql2\": \"^2.3.0\",
    \"cors\": \"^2.8.5\",
    \"dotenv\": \"^10.0.0\",
    \"bcryptjs\": \"^2.4.3\",
    \"jsonwebtoken\": \"^8.5.1\"
  },
  \"devDependencies\": {
    \"nodemon\": \"^2.0.12\"
  }
}" > backend/package.json

# Create backend configuration file
echo "module.exports = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'grapework',
    port: process.env.DB_PORT || 3306
  },
  production: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  }
}" > backend/config/database.js

# Create backend server file
echo "const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const config = require('../config/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool(config[process.env.NODE_ENV || 'development']);

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Routes will be added here

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});" > backend/src/server.js

# Create environment file template
echo "NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=grapework
DB_PORT=3306
JWT_SECRET=your_jwt_secret_here" > backend/.env.example

# Create README file
echo "# GrapeWork Application

## Project Structure
```
.
├── backend/           # Backend server code
│   ├── config/       # Configuration files
│   ├── src/          # Source code
│   └── .env          # Environment variables
├── database/         # Database scripts and migrations
│   └── schema.sql    # Database schema
├── frontend/         # Frontend application code
└── README.md         # Project documentation
```

## Setup Instructions

### Database Setup
1. Create a MySQL database
2. Run the schema.sql script from the database folder

### Backend Setup
1. Navigate to backend folder
2. Copy .env.example to .env and update values
3. Run `npm install`
4. Run `npm start` for production or `npm run dev` for development

### Frontend Setup
1. Open index.html in a web browser

## Development

### Backend Development
- Server runs on port 3000 by default
- Uses MySQL database
- RESTful API endpoints

### Frontend Development
- Pure HTML/CSS/JavaScript
- Bootstrap for styling
- Modular JavaScript architecture" > README.md

# Organize frontend files into a frontend folder
mkdir -p frontend/{js,styles,assets}
mv js frontend/js
mv styles frontend/styles
mv *.html frontend/

# Update git repository
git add .
git commit -m "Reorganize project structure with backend and database folders"
git push origin main