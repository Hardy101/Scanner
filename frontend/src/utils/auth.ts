export const isAuthenticated = (): boolean => {
  const token = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));

  return token ? true : false;
};
