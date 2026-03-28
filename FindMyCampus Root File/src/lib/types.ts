export type College = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  website?: string;
  contactNumber?: string;
  email?: string;
  description: string;
  longDescription: string;
  courses: Course[];
  fees: number;
  awards: Award[];
  facilities: Facility[];
  heroImageUrl: string;
  galleryImageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Award = {
  title: string;
  description: string;
  imageUrl?: string;
};

export type Facility = {
  name: string;
  icon: string;
};

export type Course = {
  name: string;
  cutoff: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // stored in plain text for demo purposes
  contact?: string; // contact number for user details
  createdAt: Date;
};
