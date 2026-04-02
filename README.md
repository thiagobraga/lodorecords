<div align="center">
  <img src="./app/public/images/lodo-records-logo-black-transparent.png" alt="Lodo Records" width="220" />
  <h1>Lodo Records</h1>
</div>

A full-stack e-commerce application for a music record store, built with React app and Node.js api, containerized with Docker.

## Docker Setup

This project includes a Docker Compose configuration for easy development and deployment.

### Prerequisites

- Docker
- Docker Compose

### Getting Started

1. Clone the repository and navigate to the project directory:
   ```bash
   cd lodorecords
   ```

2. Build and start all services:
   ```bash
   docker-compose up --build
   ```

3. The application will be available at:
   - App: http://localhost:3000
   - API: http://localhost:5000
   - MongoDB: localhost:27017
   - Mongo Express: http://localhost:8081

### Services

- **MongoDB**: Database service running on port 27017
- **api**: Node.js/Express API server running on port 5000
- **app**: React application running on port 3000
- **Mongo Express**: MongoDB web-based admin interface running on port 8081

### Development

For development with hot reloading:

```bash
# Start services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build api
docker-compose up api
```

### Environment Variables

The API service uses the following environment variables:
- `NODE_ENV`: Set to 'development'
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (5000)
- `JWT_SECRET`: Secret key for JWT tokens
- `CLIENT_URL`: app URL for redirects
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

The App service uses:
- `REACT_APP_API_URL`: API URL

### Data Persistence

MongoDB data is persisted using Docker volumes. To reset the database:

```bash
docker-compose down -v
docker-compose up --build
```

---

## Seeding the Database

The project includes a seed script to populate the database with initial data (bands and products).

### Using Docker

Run the seed script inside the API container:

```bash
docker exec -it lodo-api node seedData.js
```

### Without Docker

If running locally without Docker:

```bash
cd api
node seedData.js
```

### What Gets Seeded

The seed script creates:
- **4 Bands**: Artigo DZ9?, Autoboneco, Revel, and Sociopata
- **7 Products**: Albums and singles from these bands

**Note**: Running the seed script will clear all existing data before inserting new records.

---

## Using Mongo Express

Mongo Express is a web-based MongoDB admin interface for easy database management.

### Accessing Mongo Express

1. Make sure all services are running:
   ```bash
   docker-compose up -d
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8081
   ```

3. Login credentials:
   - **Username**: `admin`
   - **Password**: `password123`

### Features

- View and edit documents in collections
- Create, update, and delete collections
- Import/export data
- View database statistics
- Execute queries directly

### Useful Operations

- **View Products**: Navigate to `lodorecords` → `products`
- **View Bands**: Navigate to `lodorecords` → `bands`
- **View Orders**: Navigate to `lodorecords` → `orders`
- **View Users**: Navigate to `lodorecords` → `users`

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

---

### Products API

#### Get All Products

```bash
# Request
curl http://localhost:5000/api/products

# HTTP Alternative
GET http://localhost:5000/api/products
```

**Response:**
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "_id": "...",
      "name": "Sociopata - Corrosão (2016)",
      "price": 20.00,
      "category": "cd",
      "artist": "Sociopata",
      "countInStock": 15
    }
  ]
}
```

#### Get Product by ID

```bash
# Request
curl http://localhost:5000/api/products/{productId}

# Example
curl http://localhost:5000/api/products/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Sociopata - Corrosão (2016)",
    "description": "Debut album featuring aggressive metal tracks...",
    "price": 20.00,
    "category": "cd",
    "images": ["/images/merch/sociopata-corrosao.jpg"],
    "countInStock": 15,
    "featured": true,
    "artist": "Sociopata",
    "releaseDate": "2016-06-15T00:00:00.000Z"
  }
}
```

#### Create Product (Admin Only)

```bash
# Request
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Album",
    "description": "Description here",
    "price": 25.00,
    "category": "vinyl",
    "artist": "Artist Name",
    "countInStock": 10
  }'
```

#### Update Product (Admin Only)

```bash
# Request
curl -X PUT http://localhost:5000/api/products/{productId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Album Name",
    "price": 30.00
  }'
```

#### Delete Product (Admin Only)

```bash
# Request
curl -X DELETE http://localhost:5000/api/products/{productId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Bands API

#### Get All Bands

```bash
# Request
curl http://localhost:5000/api/bands

# HTTP Alternative
GET http://localhost:5000/api/bands
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "...",
      "name": "Artigo DZ9?",
      "genre": "Punk Rock / Hardcore",
      "description": "Veteran hardcore punk band...",
      "logo": "/images/bands/artigodz9.png",
      "featured": true,
      "active": true
    }
  ]
}
```

#### Get Band by ID

```bash
# Request
curl http://localhost:5000/api/bands/{bandId}
```

#### Create Band (Admin Only)

```bash
# Request
curl -X POST http://localhost:5000/api/bands \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Band",
    "genre": "Rock",
    "description": "Band description",
    "formedYear": 2020,
    "active": true
  }'
```

#### Update Band (Admin Only)

```bash
# Request
curl -X PUT http://localhost:5000/api/bands/{bandId} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "description": "Updated description"
  }'
```

#### Delete Band (Admin Only)

```bash
# Request
curl -X DELETE http://localhost:5000/api/bands/{bandId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Authentication API

#### Google OAuth Login

```bash
# Initiate Google OAuth flow
GET http://localhost:5000/api/auth/google
```

This will redirect to Google's OAuth consent screen.

#### Get Current User

```bash
# Request
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

#### Logout

```bash
# Request
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Admin Check

```bash
# Request
curl http://localhost:5000/api/auth/admin-check \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Orders API

#### Get All Orders

```bash
# Request
curl http://localhost:5000/api/orders
```

#### Get Order by ID

```bash
# Request
curl http://localhost:5000/api/orders/{orderId}
```

#### Create Order

```bash
# Request
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderItems": [
      {
        "product": "507f1f77bcf86cd799439011",
        "quantity": 2,
        "price": 20.00
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "São Paulo",
      "postalCode": "01234-567",
      "country": "Brazil"
    },
    "paymentMethod": "pix",
    "totalPrice": 40.00
  }'
```

#### Update Order

```bash
# Request
curl -X PUT http://localhost:5000/api/orders/{orderId} \
  -H "Content-Type: application/json" \
  -d '{
    "isPaid": true,
    "paidAt": "2024-01-15T10:30:00.000Z"
  }'
```

#### Delete Order

```bash
# Request
curl -X DELETE http://localhost:5000/api/orders/{orderId}
```

---

## Authentication

Most admin endpoints require JWT authentication. To authenticate:

1. Login via Google OAuth: `GET /api/auth/google`
2. The JWT token will be set as an httpOnly cookie
3. For API testing, include the token in the Authorization header:
   ```
   Authorization: Bearer YOUR_JWT_TOKEN
   ```

---

## Common Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart project (rebuild and start)
docker-compose down --timeout 0
docker-compose up --build -d

# View container status
docker-compose ps

# Access api shell
docker exec -it lodo-api sh

# Access app shell
docker exec -it lodo-app sh

# View MongoDB logs
docker-compose logs -f mongodb

# Remove all containers and volumes (fresh start)
docker-compose down -v
docker-compose up --build
```