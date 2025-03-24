import axios from "axios";
import { Movie, MovieFormData } from "../types/movie";

const apiClient = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

const transformMovieResponse = (responseData: any): Movie => ({
  id: responseData.ID,
  title: responseData.title,
  year: responseData.year,
  director: responseData.director,
  rating: responseData.rating || 0,
  image_url: responseData.image_url,
});

export async function getAllMovies(): Promise<Movie[]> {
  try {
    const response = await apiClient.get("/movies");

    if (Array.isArray(response.data)) {
      return response.data.map(transformMovieResponse);
    } else {
      throw new Error("Invalid data format from server");
    }
  } catch (error) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch movies");
    }
    throw error;
  }
}

export async function getMovie(id: number): Promise<Movie> {
  try {
    const response = await apiClient.get(`/movies/${id}`);
    return transformMovieResponse(response.data);
  } catch (error) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch movie");
    }
    throw error;
  }
}

export async function createMovie(movieData: MovieFormData): Promise<Movie> {
  try {
    const response = await apiClient.post("/movies", movieData);
    return transformMovieResponse(response.data);
  } catch (error) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create movie");
    }
    throw error;
  }
}

export async function updateMovie(
  id: number,
  movieData: Partial<MovieFormData>
): Promise<Movie> {
  try {
    const response = await apiClient.put(`/movies/${id}`, movieData);
    return transformMovieResponse(response.data);
  } catch (error) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update movie");
    }
    throw error;
  }
}

export async function deleteMovie(id: number): Promise<void> {
  try {
    await apiClient.delete(`/movies/${id}`);
  } catch (error) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to delete movie");
    }
    throw error;
  }
}

export async function uploadMovieImage(
  id: number,
  imageFile: File
): Promise<Movie> {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(`/movies/${id}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return transformMovieResponse(response.data);
  } catch (error) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to upload image");
    }
    throw error;
  }
}

export async function rateMovie(id: number, rating: number): Promise<Movie> {
  try {
    const response = await apiClient.patch(`/movies/${id}`, { rating });
    return transformMovieResponse(response.data);
  } catch (error) {
    console.error("API error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to rate movie");
    }
    throw error;
  }
}
