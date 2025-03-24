export interface Movie {
  id: number;      
  title: string;
  year: number;
  director: string;
  image_url?: string;
  rating: number;  
}

export interface MovieFormData {
  title: string;
  year: number;
  director: string;
  rating: number;    
}

export interface ApiMovieResponse {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  title: string;
  year: number;
  director: string;
  rating: number;
  image_url?: string;
}