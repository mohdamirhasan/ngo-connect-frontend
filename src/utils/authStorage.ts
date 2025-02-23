const TOKEN_KEY = "token";


export const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
