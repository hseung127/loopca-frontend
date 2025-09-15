
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { studyApi } from "../api/studyApi";
import { useEffect } from "react";
import "./../styles/FlashcardComplete.css";

export default function FlashcardComplete() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const savedGroupIdx = sessionStorage.getItem("groupIdx");
  const savedSessionIdx = sessionStorage.getItem("sessionIdx");
  const savedCycleNo = sessionStorage.getItem("cycleNo");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await studyApi.getComplete(savedSessionIdx, savedCycleNo);
        setSummary(data);
        console.log(data)
      } catch (err) {
        console.error("Error fetching complete summary", err);
      } finally {
        setLoading(false);
      }
    };
    loadSummary();
  }, []);

  const handleClaimReward = async () => {
    try {
      const res = await studyApi.claimReward(savedSessionIdx);
      alert(`${res.message} +${res.rewardPoint} 포인트`);
      handleHome();
      // 상태 갱신
      //setSummary({ ...summary, rewardReceived: true });
    } catch (err) {
      console.error("Error claiming reward", err);
    }
  };

  const handleHome = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (loading) return <p>Loading...</p>;
  if (!summary) return <p>데이터 없음</p>;

  return (
    <div className="complete-page">
      {/* ─ 헤더 ─ */}
      <header className="complete-header">
        <h2>LoopCa</h2>
      </header>

      {/* ─ 본문 ─ */}
      <div className="complete-body">
        <h3 className="done-title">학습 완료!</h3>

        <div className="summary-box">
        {summary.groupName && (
          <>
          <p><strong>학습내용</strong></p>
          <p className="group">{summary.groupName}</p>
          <p>단어: <span className="highlight">{summary.totalCards}개</span></p>
          <p>반복: <span className="highlight">{savedCycleNo}회</span></p>
          </>
        )}
        </div>

        <div className="reward-box">
          <span>Reward</span>
          <span className="reward-point">+100 point</span>
        </div>
      </div>

      {/* ─ 하단 버튼 ─ */}
      <div className="bottom-btn-area">
        {!summary.rewardReceived && (
            <button className="receive-btn" onClick={handleClaimReward}>보상 받기</button>
        )}
        {summary.rewardReceived && (
            <button className="receive-btn" onClick={handleHome}>목록으로가기</button>
        )}
      </div>
    </div>
  );
}
