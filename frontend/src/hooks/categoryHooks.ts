import { useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { Product } from "../types/Product";

export const useCategoryQuery = (category: string) =>
  useQuery({
    queryKey: ["products", category],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`/api/categories/${category}`)).data,
  });
