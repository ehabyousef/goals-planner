export interface IImage {
  id: string; // Cloudinary public_id
  url: string; // Cloudinary secure URL
}

export interface IGoal {
  user: string;
  category_id: string;
  title: string;
  description: string;
  image?: IImage; // Optional image field
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  progress_percent: number;
  start_date?: Date;
  end_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
