import { dropdownManagementFormSchema } from "./../schemas/schemas";
import type { addPlatformFeeSchema } from "@/schemas/schemas";
import type { LucideIcon } from "lucide-react";
import type z from "zod";

// AUTH Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  code?: number;
  success?: boolean;
  response?: {
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  data?: {
    user?: {
      id: string;
      email: string;
      name?: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success?: boolean;
  message?: string;
  data?: {
    accessToken: string;
  };
  // Backend actual response format
  code?: number;
  response?: {
    accessToken?: string;
    token?: {
      accessToken?: string;
    };
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const UserRole = {
  ADMIN: 1,
  LAWYER: 2,
  OFFICER: 3,
  CLIENT: 4,
} as const;

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export type Transaction = {
  id: string;
  clientName: string;
  lawyerName: string;
  answerPrice: string;
  platformFees: string;
  lawyerShare: string;
  transactionDate: string;
};

export type CasePhase = {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
};

export type State = {
  id: string;
  nameAr: string;
  nameEn: string;
  nameFr: string;
};

export type Banner = {
  id: string;
  image: string;
  link: string;
  status: "active";
  type: "lawyer" | "client";
};

export type BannerFormData = {
  image: string | null;
  link: string;
  status: "active";
  type: "lawyer" | "client";
};

export type ConsultationPackage = {
  id: string;
  name: string;
  numberOfConsultations: number;
  price: number;
  isActive: boolean;
};

export type ConsultationPackageFormData = {
  name: string;
  numberOfConsultations: number;
  price: number;
  isActive: boolean;
};

export type NavItem = {
  label: string;
  icon?: LucideIcon;
  path: string;
  disabled?: boolean;
  children?: NavItem[];
  roles: [];
};

export type AddPlatformFeeFormType = z.infer<typeof addPlatformFeeSchema>;
export type DropdownManagementFormType = z.infer<
  typeof dropdownManagementFormSchema
>;
export type SearchParams = {
  page: number;
  limit: number;
  search: string;
};

export interface ApiResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  nextPageUrl?: string | null;
  prevPageUrl?: string | null;
}

export type VerificationFile = {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type UserInfo = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: number;
  imgUrl: string;
  isEmailVerified: boolean;
  status: number;
  createdByLawyerId: string | null;
  imageCover: string;
  description: string | null;
  verificationStatus: number;
  verifiedAt: string | null;
};

export type PendingLawyer = {
  id: string;
  userInfo: UserInfo;
  verificationFiles: VerificationFile[];
  verificationStatus: number;
  verifiedAt: string | null;
};

export type UserPost = {
  id: string;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  action: string | null;
};
export type Report = {
  id: string;
  /** Present on Taubyte seed/API; legacy Nest used userPost body instead */
  reason?: string;
  createdBy?: string;
  createdByRole?: number;
  reportedBy?: string;
  reportedByRole?: number;

  canAccess?: boolean;
  canPost?: boolean;
  untilDate?: string | null;
  /** Numeric (legacy) or string status from API ("pending", "reviewed", …) */
  status?: number | string;
  comment?: string;
  action?: number;
  PostDate?: string | null;
  userPost?: UserPost;
};

export const ReportStatusEnum = {
  Pending: 1,
  Banned: 2,
  BannedFromPosting: 3,
  Ignored: 4,
} as const;

export type ReportStatusEnum =
  (typeof ReportStatusEnum)[keyof typeof ReportStatusEnum];


export interface lawyerPackage  {
  id:string;
  name:string;
  numberOfCases:number;
  numberOfAssistants:number;
  price:number;
  durationInDays:number;
  isActive:boolean;
  createdAt:string;
} 

export interface CreateLawyerPackageDto {
  name:string;
  numberOfCases:number;
  numberOfAssistants:number;
  price:number;
  durationInDays:number;
  isActive:boolean;
}

export interface UpdateLawyerPackageDto {
  name:string;
  numberOfCases:number;
  numberOfAssistants:number;
  price:number;
  durationInDays:number;
  isActive:boolean;
}

export interface LawyerPackagesQueryParams {
  search?:string;
  page?:number;
  limit?:number;
}

export interface SubscriptionHistoryQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data:T[];
  total:number;
  page:number;
  limit:number;
}


export interface CleanupResponse {
  deactivatedCount: number;
  message: string;
}
export interface Subscription {
  id: string;
  lawyerId: string;
  lawyerName: string; // Assuming flattened or nested, adapting based on typical API
  packageId: string;
  packageName: string;
  startDate: string;
  endDate: string;
  status: string; // active, expired, etc.
  price: number;
  lawyer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  package: {
    id: string;
    name: string;
    price: number;
  };
  createdAt: string;
}

export interface SubscriptionHistoryQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}
