import { PlusIcon, ArrowRightCircleIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cardGroupApi } from "../api/cardGroupApi";
import { studyApi } from "../api/studyApi";
import * as XLSX from "xlsx";
import "./../styles/GroupList.css";

export default function GroupList() {
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState(""); // 그룹 설명
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState(""); // 파일명
  const member = JSON.parse(localStorage.getItem("member"));
  const memberId = member?.memberId; // 로그인 아이디

  // 최초 로딩 시 불러오기
  useEffect(() => {
    // 홈에 들어오면 무조건 세션 스토리지 초기화
    sessionStorage.clear();
    loadGroups();
  }, []);

  // 그룹 리스트 불러오기
  const loadGroups = async () => {
    try {
      const groups = await cardGroupApi.getGroups();
      setGroups(groups || []); // 초기 null 방지
    } catch (err) {
      setGroups([]); // 실패 시에도 빈 배열
      console.error("그룹 불러오기 실패");
    }
  };

  // 엑셀 업로드 처리
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      // header: 1 → 첫 행도 데이터로 읽고, 각 행을 배열로 반환
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const parsedData = rows.map((row) => ({
          frontText: row[0] || "",        // 첫 번째 컬럼
          backText: row[1] || "", // 두 번째 컬럼
      }));

      setExcelData(parsedData);
    };
    reader.readAsArrayBuffer(file);

    // 같은 파일 다시 업로드 가능하도록 초기화
    e.target.value = "";
  };

  // 업로드한 엑셀 데이터 삭제
  const handleClearExcel = () => {
    setExcelData([]);
    setFileName("");
  };

  // 그룹 저장
  const handleSave = async (e) => {
    e.preventDefault();       // 새로고침 방지

    try {
      await cardGroupApi.createGroup({
        groupName: newGroupName,
        description: newGroupDesc,
        cards: excelData,
      });
      alert("그룹 생성 완료!");
      handleCancel(); // 입력 데이터 초기화
      loadGroups(); // 리스트 새로고침
    } catch (err) {
      //alert(err.message);
      alert("그룹 생성 실패");
    }
  };

  // 모달 닫기시 입력 데이터 초기화
  const handleCancel = () => {
    setNewGroupName("");
    setNewGroupDesc("");
    setExcelData([]);
    setFileName("");
    setShowModal(false);   // 모달 닫기
  };

  // 카드 학습 화면으로 이동
  const handleGroupClick = async (groupIdx) => {
    // 이전 미완료 세션 체크
    const unfinishedSession = await studyApi.getLastSession(groupIdx);

    if (unfinishedSession && !unfinishedSession.completed) {
      const sessionIdx = unfinishedSession.studySessionIdx;
      const nextCycleNo = unfinishedSession.lastCycleNo === 0 ? 1 : unfinishedSession.lastCycleNo;
      const orderType = unfinishedSession.orderType;
      // 이어하기
      sessionStorage.setItem("groupIdx", groupIdx);
      sessionStorage.setItem("sessionIdx", sessionIdx);
      sessionStorage.setItem("cycleNo", nextCycleNo);
      navigate(`/flashcard/${groupIdx}/${sessionIdx}/${nextCycleNo}?orderType=${orderType}`);
    } else {
      // 새로 시작
      navigate(`/modeSelect/${groupIdx}`);
    }
  };

  return (
    <div className="main">
      {/* 상단 영역 */}
      <div className="group-list-header">
        <h3 className="section-title">Groups</h3>

          {groups.length > 0 && (   // 그룹이 있을 때만 수정 버튼 보이기
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
              <PencilSquareIcon className="icon" />
              {editMode ? "완료" : "수정"}
            </button>
          )}
      </div>

      {/* 그룹 목록 */}
      <div className="group-scroll">
      {groups.length === 0 ? (   // 그룹이 없을 때 안내 메시지
        <p className="empty-message">아직 그룹이 없어요. ➕ 버튼으로 새 그룹을 만들어보세요.</p>
      ) : (
        groups.map((g) => (
          <div className="group-card" key={g.idx} onClick={() => handleGroupClick(g.idx)}>
            <div className="group-info">
              <h4>{g.groupName}</h4>
              <p>{g.description}</p>
              <p>{g.updatedAt.split("T")[0]}</p>
            </div>
            {editMode ? (
              <button className="delete-btn" disabled>
                <TrashIcon className="icon" />
              </button>
            ) : (
              <ArrowRightCircleIcon className="icon" />
            )}
          </div>
        ))
      )}
      </div>

      {/* + 버튼 */}
      <button className="floating-btn" onClick={() => setShowModal(true)}>
        <PlusIcon className="icon" />
      </button>

      {/* 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>새 그룹 추가</h3>
            <input
              type="text"
              placeholder="그룹명"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="input-box"
            />

            {/* 그룹 설명 입력 */}
            <input
              type="text"
              placeholder="그룹 설명"
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              className="input-box"
            />

            <div className="excel-row">
              <button
                className="excel-upload-btn"
                onClick={() => document.getElementById("excel-upload").click()}
              >
                엑셀 업로드
              </button>
              {/* 숨겨진 파일 input */}
              <input
                type="file"
                accept=".xlsx, .xls"
                id="excel-upload"
                style={{ display: "none" }}
                onChange={handleExcelUpload}
              />
            </div>

            {/* 파일명 + 삭제 버튼 */}
            {fileName && (
              <div className="file-row">
                <span className="file-name">{fileName}</span>
                <button className="file-clear-btn" onClick={handleClearExcel}>✕</button>
              </div>
            )}

            {/* 엑셀 데이터 전체 보기 */}
            {excelData.length > 0 && (
              <div className="preview-box">
                <table className="excel-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>단어</th>
                      <th>설명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.map((row, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td className="truncate">{row.frontText || "No FrontText"}</td>
                        <td className="truncate">{row.backText || "No BackText"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={handleCancel}>취소</button>
              <button className="modal-btn save" onClick={handleSave} disabled={excelData.length === 0 && !newGroupName}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}