import axiosInstance from "@/api/axios";

import type { SearchParams } from "@/types/types";

// ! Get Case Categories
export const getAllPendingLawyers = async ({
  page,
  limit,
  search,
}: SearchParams) => {
  const response = await axiosInstance.get(
    "/users-lawyers/lawyers/verifiying",
    {
      params: {
        page,
        limit,
        search,
      },
    }
  );

  return response.data.response || [];
};

export const verifyLawyer = async (lawyerId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.put(
      `/users-lawyers/accept/verifiying`,
      { lawyerId }
    );

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error verfing lawyer:", error);
    return false;
  }
};
