import apiClient from "../apiClient";
import { useMutation } from "@tanstack/react-query";

export const useFetchClientSecret = () => {
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await apiClient.post("api/create-payment/", {
        orderId: orderId,
      });
      return response.data;
    },
  });
};

export const useFetchPayment = () => {
  return useMutation({
    mutationFn: async (orderId) => {
      const response = await apiClient.post("api/mark-order-as-paid/", {
        orderId: orderId,
      });
      return response.data;
    },
  });
};
