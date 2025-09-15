import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { studyApi } from "../api/studyApi";
import "./../styles/Flashcard.css";


export default function Flashcard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [showFront, setShowFront] = useState(true);
  const [isStarred, setIsStarred] = useState(false);

  const { groupIdx, sessionIdx, cycleNo } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderType = params.get("orderType") || "sequential";
  const mode = sessionStorage.getItem("mode") || "smart";

  const savedGroupIdx = sessionStorage.getItem("groupIdx");
  const savedSessionIdx = sessionStorage.getItem("sessionIdx");
  const savedCycleNo = sessionStorage.getItem("cycleNo");

  const [cardList, setCardList] = useState([]);
  const [currentCardNo, setCurrentCardNo] = useState(0);
  const totalCards = cardList.length;  // 총 카드 수

  useEffect(() => {
    if (savedGroupIdx !== groupIdx || savedSessionIdx !== sessionIdx || savedCycleNo !== cycleNo) {
      alert("세션이 만료되었거나 잘못된 접근입니다.");
      window.location.href = `/`;
    }
  }, [groupIdx, sessionIdx, cycleNo, navigate]);

  // 카드 리스트 바인딩 (DB → 프론트 → 세션스토리지 저장)
  useEffect(() => {
    if (loading) return; // 이미 호출 중이면 무시
    setLoading(true);

    const loadCards = async () => {
      // 이번 사이클(cycleNo)에 해당하는 카드 세션스토리지에 존재하면 가져오기
      const savedCardList = sessionStorage.getItem(`cardList_${cycleNo}`); //사이클번호로 구분
      if (savedCardList) {
        setCardList(JSON.parse(savedCardList));
        setCurrentCardNo(Number(sessionStorage.getItem("currentCardNo")));
        setLoading(false);
        return;
      }

      // 세션스토리지 없을 때만 DB에서 가져오기
      const data = await studyApi.startCycle(sessionIdx, cycleNo);
      setLoading(false);
      let cardList = data.cards;

      // 랜덤시 재배치
      if (orderType === "random") {
        cardList = [...cardList].sort(() => Math.random() - 0.5);
      }

      sessionStorage.setItem(`cardList_${cycleNo}`, JSON.stringify(cardList));
      sessionStorage.setItem("currentCardNo", 0);
      sessionStorage.setItem("totalCards", totalCards);
      setCardList(cardList);
      setCurrentCardNo(0);
    };

    loadCards();
  }, []);

   // 별 토글
   const toggleStar = (idx) => {
     setCardList((cardList) => {
       const updatedCardList = cardList.map((c, i) =>
         i === idx ? { ...c, starred: !c.starred } : c
       );
       sessionStorage.setItem(`cardList_${cycleNo}`, JSON.stringify(updatedCardList)); // 최신 상태 저장
       return updatedCardList;
     });
   };

   // 이전 카드
   const handlePrev = () => {
     if (currentCardNo > 0) {
       const prevNo = currentCardNo - 1;
       setCurrentCardNo(prevNo);
       sessionStorage.setItem("currentCardNo", prevNo);
       setShowFront(true);
     }
   };

  // 다음 카드
  const handleNext = () => {
    if (currentCardNo < totalCards - 1) {
      const nextNo = currentCardNo + 1;
      setCurrentCardNo(nextNo);
      sessionStorage.setItem("currentCardNo", nextNo);
      setShowFront(true);
    } else {
      handleEnd();
    }
  };

  // 사이클 종료
  const handleEnd = async () => {
    const updateList = cardList.map((c) => ({
      flashCardIdx: c.flashCardIdx,
      starred: c.starred,
    }));

    const result = await studyApi.endCycle(sessionIdx, cycleNo, updateList);

    if (result.hasNextCycle) {
      const nextCycleNo = Number(cycleNo) + 1;
      sessionStorage.setItem("cycleNo", nextCycleNo);
      window.location.href = `/flashcard/${groupIdx}/${sessionIdx}/${nextCycleNo}?orderType=${orderType}`;
    } else {
      navigate("/flashcard/complete");
    }
  };

  // 홈으로 이동
  const handleHome = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // 정렬 토글
  const toggleOrder = (newOrderType) => {
    // 리스트 초기화 > 로딩시 디비에서 새로 불러오도록
    sessionStorage.removeItem(`cardList_${cycleNo}`);

    // 리로딩
    const url = new URL(window.location.href);
    url.searchParams.set("orderType", newOrderType);
    window.location.href = url.toString();
  };


  return (
    <div className="study-page">
      {/* 헤더 */}
      <header className="study-header">
        <h2 className="title">LoopCa</h2>
        <button className="icon-btn" onClick={() => handleHome()}>
          <XMarkIcon className="icon" />
        </button>
      </header>

      {/* 그룹명 + 토글버튼 */}
      <div className="group-bar">
        <h3 className="group-title">CARDGROUP</h3>
        <div className="toggle-group">
          <button
            className={`toggle-btn ${orderType === "sequential" ? "active" : ""}`}
            onClick={() => toggleOrder("sequential")}
          >
            순차
          </button>
          <button
            className={`toggle-btn ${orderType === "random" ? "active" : ""}`}
            onClick={() => toggleOrder("random")}
          >
            랜덤
          </button>
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="card-area">
        {/* 별 버튼 */}
        {cardList.length > 0 && (
          <button
            className={`star-btn ${cardList[currentCardNo].starred ? "" : "active"}`}
            onClick={() => toggleStar(currentCardNo)}
          >
            {/*<StarIcon className="icon" /> */}
             {cardList[currentCardNo].starred ? "⭐" : "☆"}
          </button>
        )}

        {/* 좌/우 화살표 */}
        {cardList.length > 0 && currentCardNo > 0 &&
            <button className="arrow-btn left" onClick={handlePrev}>
                <ChevronLeftIcon className="icon" />
            </button>
        }
        <button className="arrow-btn right" onClick={handleNext}>
            <ChevronRightIcon className="icon" />
        </button>

        {/* 카드 */}
        <div
          className="flash-card"
          onClick={() => setShowFront(!showFront)}
        >
          {cardList.length > 0 && cardList[currentCardNo] ? (
            showFront
              ? cardList[currentCardNo].frontText
              : cardList[currentCardNo].backText
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* 하단 패널 */}
      <div className="bottom-panel">
        <div className="bottom-left">
          <button className="action-btn" disabled><PencilIcon className="icon" /> 수정</button>
          <button className="action-btn" disabled><TrashIcon className="icon" /> 삭제</button>
        </div>

        <div>
          {/* 순서 변경: 상태 먼저 */}
          <div className="status">{mode.toUpperCase()}MODE · {cycleNo}회차</div>

          {/* 진행바 + 수치 */}
          <div className="progress-row">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentCardNo + 1) / totalCards) * 100}%` }}
              />
            </div>

            <span className="progress-text">
                {(currentCardNo + 1).toString().padStart(2, "0")}/
                  {totalCards.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* 대화 영역 */}
      <div className="chat-row">
        <div className="chat-name">LoopCaBot</div>
        <div className="chat-bubble">오늘도 화이팅!</div>
      </div>
    </div>
  );
}
