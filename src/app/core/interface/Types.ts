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
  progress_percent?: number;
  start_date?: Date;
  end_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
}
export interface ITask {
  user?: string;
  goal_id: string;
  title: string;
  description: string;
  image?: IImage; // Optional image field
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  progress_percent?: number;
  start_date?: Date;
  end_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
}

export interface ILogin {
  email: string | null;
  password: string | null;
}

export interface IRegister {
  userName: string | null;
  email: string | null;
  password: string | null;
}
export interface ICategories {
  Name: string | null;
  color: string | null;
  id?: string;
}
