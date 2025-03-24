# GoMovies API

## Prerequisites
- Go (version 1.20 or higher)
- SQLite (included with GORM, no separate installation needed)
- Recommended API Testing Tool: Postman, curl, or Thunder Client

## API Endpoint Examples

### 1. Get All Movies
**Endpoint:** `GET /movies/`
**Description:** Retrieves all movies in the database

**Example Request:**
```bash
curl http://localhost:8080/movies/
```

**Example Response:**
```json
[
  {
    "id": 1,
    "title": "Inception",
    "director": "Christopher Nolan",
    "year": 2010,
    "rating": 8.8,
    "image_url": "uploads/img_randomstring.jpg"
  },
  {
    "id": 2,
    "title": "The Matrix",
    "director": "Wachowski Sisters",
    "year": 1999,
    "rating": 8.7,
    "image_url": ""
  }
]
```

### 2. Get Movie by ID
**Endpoint:** `GET /movies/:id`
**Description:** Retrieves a specific movie by its ID

**Example Request:**
```bash
curl http://localhost:8080/movies/1
```

**Example Response:**
```json
{
  "id": 1,
  "title": "Inception",
  "director": "Christopher Nolan", 
  "year": 2010,
  "rating": 8.8,
  "image_url": "uploads/img_randomstring.jpg"
}
```

### 3. Create a Movie
**Endpoint:** `POST /movies/`
**Description:** Creates a new movie entry

**Example Request:**
```bash
curl -X POST http://localhost:8080/movies/ \
     -H "Content-Type: application/json" \
     -d '{
           "title": "Interstellar",
           "director": "Christopher Nolan",
           "year": 2014,
           "rating": 8.6
         }'
```

**Example Response:**
```json
{
  "id": 3,
  "title": "Interstellar",
  "director": "Christopher Nolan",
  "year": 2014,
  "rating": 8.6,
  "image_url": ""
}
```

### 4. Update a Movie
**Endpoint:** `PUT /movies/:id`
**Description:** Updates an existing movie's details

**Example Request:**
```bash
curl -X PUT http://localhost:8080/movies/3 \
     -H "Content-Type: application/json" \
     -d '{
           "rating": 8.7
         }'
```

**Example Response:**
```json
{
  "id": 3,
  "title": "Interstellar",
  "director": "Christopher Nolan",
  "year": 2014,
  "rating": 8.7,
  "image_url": ""
}
```

### 5. Delete a Movie
**Endpoint:** `DELETE /movies/:id`
**Description:** Deletes a movie by its ID

**Example Request:**
```bash
curl -X DELETE http://localhost:8080/movies/3
```

**Example Response:**
```json
{
  "message": "Movie has been deleted!"
}
```

### 6. Upload Movie Image
**Endpoint:** `POST /movies/:id/upload`
**Description:** Uploads an image for a specific movie

**Example Request (using curl):**
```bash
curl -X POST http://localhost:8080/movies/1/upload \
     -F "image=@/path/to/movie/poster.jpg"
```

**Example Response:**
```json
{
  "id": 1,
  "title": "Inception",
  "director": "Christopher Nolan",
  "year": 2010,
  "rating": 8.8,
  "image_url": "uploads/img_randomGeneratedString.jpg"
}
```

## Setup Instructions
### 1. Clone the Repository
```bash
# Clone the repository
git clone https://github.com/cseri502/GoMovies.git

# Navigate to the backend directory
cd GoMovies/backend
```

### 2. Install Go Dependencies
```bash
# Download and install project dependencies
go mod tidy
```

### 3. Run the Application
```bash
# Run the application
go run main.go

# Or build and execute
go build
./go-movies-api
```

### 4. Verify Installation
- The application will start on `http://localhost:8080`
- A `movies.db` SQLite database will be created automatically
- The server will log startup information

## API Validation Rules
- All movie entries require:
  - Title (string)
  - Director (string)
  - Year (integer)
  - Rating (float)
- Image upload is optional
- Image files are saved with unique generated names
