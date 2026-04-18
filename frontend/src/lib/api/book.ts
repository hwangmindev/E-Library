import { AUTH_TOKEN_STORAGE_KEY } from "../constants/auth";
import API from "./axios";

export const getBooks = async (page: number, limit: number, search: string) => {
  const res = await API.get(
    `/books?page=${page}&limit=${limit}&search=${search}`,
  );
  return res.data;
};

export const deletBook = async (id: string) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  await API.delete(`/books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
