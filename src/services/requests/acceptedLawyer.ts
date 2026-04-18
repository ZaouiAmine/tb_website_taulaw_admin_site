import axiosInstance from "@/api/axios";

export const acceptLawyer = async (lawyerId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.put(`/users-lawyers/accept`, {
      lawyerId,
    });

    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error accepting lawyer:", error);
    return false;
  }
};
