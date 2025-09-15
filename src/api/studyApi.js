import api from "./api";

export const studyApi = {
  // 마지막 미완료 세션 조회
  getLastSession: async (groupIdx) => {
    const res = await api.get(`/api/study/lastSession`, {
      params: { groupIdx },
    });
    return res.data; // StudySessionResponse | null
  },

  // 새 세션 생성
  createSession: async (form) => {
    const res = await api.post(`/api/study/session`, form);
    return res.data; // studySessionIdx
  },

  // 학습 사이클 시작
  startCycle: async (sessionIdx, cycleNo) => {
    const res = await api.get(`/api/study/${sessionIdx}/cycle/${cycleNo}`);
    return res.data; // CycleStartResponse
  },

  // 학습 사이클 종료
  endCycle: async (sessionIdx, cycleNo, updateList) => {
    const res = await api.post(`/api/study/${sessionIdx}/cycle/${cycleNo}/end`, updateList);
    return res.data; // CycleEndResponse
  },

  // 완료 화면 요약 조회
  getComplete: async (sessionIdx, cycleNo) => {
    const res = await api.get(`/api/study/complete`, {
      params: { sessionIdx, cycleNo },
    });
    return res.data; // CompleteResponse
  },

  // 세션 보상 수령
  claimReward: async (sessionIdx) => {
    const res = await api.post(`/api/study/reward`, null, {
      params: { sessionIdx },
    });
    return res.data; // RewardResponse
  },
};
