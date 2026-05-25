export type CollegeSummary = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  type: "PRIVATE" | "PUBLIC" | "DEEMED";
  averageFees: number;
  averagePackage: number;
  highestPackage: number;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
};

export type CollegeDetail = CollegeSummary & {
  establishedYear: number;
  overview: string;
  website: string | null;
  courses: Array<{
    id: string;
    name: string;
    degree: string;
    duration: string;
    annualFees: number;
    seats: number;
  }>;
  placements: Array<{
    id: string;
    year: number;
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
    topRecruiters: string[];
  }>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
};

export type PaginatedColleges = {
  data: CollegeSummary[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};
