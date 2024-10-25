import axiosClient from "./axiosClient";

const handleAPI = async (
  url: string,
  data?: any,
  method?: "post" | "get" | "delete" | "put"
) => {
  return await axiosClient(url, { method: method ?? "get", data });
};

export default handleAPI;
