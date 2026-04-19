import axiosInstance from "@/api/axios";

export default async function gerDashboardStatus({
  dateTo,
  dateFrom,
  lawyerId,
}: {
  dateTo?: string;
  dateFrom?: string;
  lawyerId?: string;
}) {
  const respones = await axiosInstance.get(`/users-lawyers/dashboard-stats`, {
    params: {
      dateTo,
      dateFrom,
      lawyerId,
    },
  });
  return respones.data;
}

export async function getAllLawyers() {
  const response = await axiosInstance.get("/users-lawyers/get");
  return response.data;
}
