# 🎬 Movie Recommender Web App

A full-stack movie web application that uses the [MovieLens dataset](https://grouplens.org/datasets/movielens/) as a movie database. Built with **React** for the frontend and **ASP.NET Core Web API** for the backend. The app supports movie browsing, filtering, and poster loading via **TMDB API**.

---

## 🧱 Tech Stack

| Layer       | Technology                  |
|-------------|------------------------------|
| Frontend    | React (with Hooks)           |
| Backend     | ASP.NET Core Web API         |
| Database    | MovieLens Dataset (CSV)      |
| Poster API  | The Movie Database (TMDB) API|
| Styling     | Bootstrap                    |
| Communication | RESTful API (`fetch`)     |

---

## 🚀 Features

- ✅ View a paginated list of movies from MovieLens
- ✅ Filter movies by title or genre
- ✅ View detailed movie info
- ✅ Dynamically load movie posters from TMDB via `tmdbId`

---

## ⚙️ Backend Setup (ASP.NET Core)

### Step 1: Import MovieLens data
- Import data from CSV files (`movies.csv`, `links.csv`, `ratings.csv`)
- Store them in memory or database
- Expose them via REST API

### Example Endpoints:
| Endpoint                      | Description              |
|------------------------------|--------------------------|
| `GET /api/movie`             | Get all movies           |
| `GET /api/movie/links`       | Get TMDB links per movie |
| `GET /api/movie/{id}`        | Get details by movie ID  |
| `GET /api/movie/genre/{g}`   | Recommend by genre       |

---

## 💻 Frontend Setup (React)

### Install and run
```bash
cd client
npm install
npm start



🔑 TMDB API Key

   1. Sign up at https://www.themoviedb.org/

   2. Get your API Key under your profile settings

   3. Replace YOUR_API_KEY in the code


## 📚 Credits

- **MovieLens Dataset** by [GroupLens Research](https://grouplens.org/datasets/movielens/)  
  The MovieLens dataset provides real-world data for movie ratings, which serves as the foundation for this app's movie data.

- **Posters by** [TMDB (The Movie Database)](https://www.themoviedb.org/)  
  Fetch movie posters and images dynamically using the TMDB API, providing a rich visual experience for the users.

- **Built with ❤️** using [React](https://reactjs.org/) & [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)  
  The frontend is built using React for an interactive user interface, while the backend is powered by ASP.NET Core Web API for handling data requests.

- **Source Code & Contributions** by [Phurisk Kruachari](https://github.com/phurisk)  
  Check out the [GitHub repository](https://github.com/phurisk) for more information, contributions, and the full project.

---

Feel free to visit my GitHub for more projects and contributions! 💻👨‍💻
