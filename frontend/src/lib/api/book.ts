import { AUTH_TOKEN_STORAGE_KEY } from "../constants/auth";
import API from "./axios";

export const getBooks = async (page: number, limit: number, search: string) => {
  const res = await API.get(
    `/books?page=${page}&limit=${limit}&search=${search}`,
  );
  return res.data;
};

export const deleteBook = async (id: string) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  const res = await API.delete(`/books/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const getBookById = async (id: string) => {
  const res = await API.get(`/books/${id}`);
  return res.data;
};

export const updateBook = async (id: string, data: {}) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  await API.patch(`/books/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
