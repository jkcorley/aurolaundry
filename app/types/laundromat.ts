export interface Laundromat {
  laundromat_id: string;
  name: string;
  address: string;
  neighborhood: string;
  borough: string;
  rating: number;
  total_user_ratings: number;
  phone?: string;
  hours_of_operation?: string;
  google_maps_url?: string;
  latitude?: number;
  longitude?: number;
  photo_reference?: string;
  accessible?: boolean;
  top_review_text?: string;
  top_review_author?: string;
  top_review_rating?: number;
  totalMachines: number;
  activeMachines: number;
}

export interface Machine {
  machine_id: string;
  laundromat_id: string;
  status: 'active' | 'inactive' | 'maintenance';
  type: string;
  last_maintenance?: string;
  next_maintenance?: string;
}

export interface BoroughCounts {
  [key: string]: number;
} 