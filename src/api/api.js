import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 요청마다 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 공통 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      alert("네트워크 오류. 다시 시도해주세요.");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 나머지 에러는 그대로 던져서 개별 API에서 처리
    return Promise.reject(error);
  }
);

export default api;
