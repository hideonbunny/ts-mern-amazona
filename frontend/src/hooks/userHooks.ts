import { useMutation } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { UserInfo } from "../types/UserInfo";

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      username = email,
      password,
    }: {
      email: string;
      username: string;
      password: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin/`, {
          email,
          username,
          password,
        })
      ).data,
  });

export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup/`, {
          name,
          email,
          password,
        })
      ).data,
  });
