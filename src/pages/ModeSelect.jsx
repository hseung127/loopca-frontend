import {
  AcademicCapIcon,
  PlayIcon,
  ArrowPathIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { studyApi } from "../api/studyApi";
import "./../styles/ModeSelect.css";

export default function ModeSelect() {
  const navigate = useNavigate();
  const { groupIdx } = useParams();
  const [mode, setMode] = useState("smart");   // "smart" | "normal"
  const [orderType, setOrderType] = useState("sequential"); // "sequential" | "random"

  // 학습 시작
  const handleStart = async () => {
    try {
      const form = {
        groupIdx,
        mode,
        orderType,
      };

      const sessionIdx = await studyApi.createSession(form); // 항상 새로운 세션 생성
      const cycleNo = 1; // 항상 첫번째 반복

      // 첫 사이클은 항상 1
      sessionStorage.setItem("groupIdx", groupIdx);     // 카드 그룹
      sessionStorage.setItem("sessionIdx", sessionIdx); // 한 번의 학습 세션 식별자
      sessionStorage.setItem("cycleNo", cycleNo);       // 그 학습 세션 안에서 몇 번째 반복(사이클)인지

      navigate(`/flashcard/${groupIdx}/${sessionIdx}/${cycleNo}?orderType=${orderType}`);
    } catch (err) {
      console.error("세션 생성 실패:", err);
      alert("세션 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="mode-select">
      <h2 className="title">학습모드 선택</h2>
      <p className="subtitle">모드와 정렬을 선택하세요</p>

      {/* 학습모드 */}
      <div className="section">
        <h3>학습모드</h3>
        <div className="btn-group">
          <button
            className={`select-btn ${mode === "smart" ? "active" : ""}`}
            onClick={() => setMode("smart")}
          >
            <AcademicCapIcon className="icon" />
            스마트모드
          </button>
          <button
            className={`select-btn ${mode === "normal" ? "active" : ""}`}
            onClick={() => setMode("normal")}
            style={{ pointerEvents: "none" }}
            disabled
          >
            <PlayIcon className="icon" />
            일반모드
          </button>
        </div>
      </div>

      {/* 정렬 */}
      <div className="section">
        <h3>정렬</h3>
        <div className="btn-group">
          <button
            className={`select-btn ${orderType === "sequential" ? "active" : ""}`}
            onClick={() => setOrderType("sequential")}
          >
            <ListBulletIcon className="icon" />
            순차
          </button>
          <button
            className={`select-btn ${orderType === "random" ? "active" : ""}`}
            onClick={() => setOrderType("random")}
          >
            <ArrowPathIcon className="icon" />
            랜덤
          </button>
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        className="start-btn"
        onClick={handleStart}
      >
        🚀 시작
      </button>
    </div>
  );
}
