import api from "./api";

export const cardGroupApi = {
  // 아이디(토큰)별 그룹 목록 불러오기
  getGroups: async () => {
    const res = await api.get("/api/cardGroup");
    return res.data;
  },

  // 그룹 생성
  createGroup: async (form) => {
    const res = await api.post("/api/cardGroup", form);
    return res.data;
  },

  // 그룹 삭제
  deleteGroup: async (id) => {
    return api.delete(`/api/cardGroup/${id}`);
  },
};
