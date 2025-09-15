const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = {
  signup: async (form) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) throw new Error("회원가입 실패");
    return response.json();
  },

  login: async (form) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!response.ok) throw new Error("로그인 실패");
    return response.json();
  },
};
