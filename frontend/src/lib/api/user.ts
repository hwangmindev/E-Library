import API from "./axios";

export const findUserById = async (userId: string) => {
  const res = await API.get(`users/${userId}`);
  return res.data;
};
