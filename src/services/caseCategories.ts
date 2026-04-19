import axiosInstance from "@/api/axios";
import type { CaseCategory, CaseCategoryBodyType } from "@/pages/caseCategories/types";
import type { ApiResponse, SearchParams } from "@/types/types";



// ! Get Case Categories
export const getCaseCategories = async ({
  page,
  limit,
  search,
}: SearchParams): Promise<ApiResponse<CaseCategory[]>> => {
  const response = await axiosInstance.get("/case-categories/index", {
    params: {
      page,
      limit,
      search,
    },
  });

  return response.data.response || [];
};

//! create Case Category
export const createCaseCategory = async (
  data: CaseCategoryBodyType
): Promise<void> => {
  try {
    await axiosInstance.post("/case-categories/store", data);
  } catch (error) {
    console.error("Error creating case category:", error);
    throw error;
  }
};

// ! Update Case Category
export const updateCaseCategory = async (
  id: string,
  data: CaseCategoryBodyType
): Promise<void> => {
  try {
    await axiosInstance.patch("/case-categories/update", data, {
      params: { id },
    });
  } catch (error) {
    console.error("Error updating case category:", error);
    throw error;
  }
};

// ! Delete Case Category
export const deleteCaseCategory = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete("/case-categories/delete", {
      params: { id },
    });
  } catch (error) {
    console.error("Error deleting case category:", error);
    throw error;
  }
};
