import { useState } from "react";
import "./../styles/Profile.css";

export default function Profile() {
  const [user, setUser] = useState({
    name: "김룹카",
    points: 350,
    level: 3,
  });
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState(user.name);

  const handleSave = () => {
    setUser({ ...user, name: newName });
    setShowModal(false);
  };

  return (
    <div className="profile-page">
      {/* 아바타 */}
      <div className="avatar">
        <div className="avatar-circle">🐌</div>
        <h3 className="name">{user.name}</h3>
      </div>

      {/* 포인트 박스 */}
      <div className="info-box">
        <span>Points</span>
        <span className="highlight">{user.points}</span>
      </div>

      {/* 버튼 영역 */}
      <button className="profile-btn" onClick={() => setShowModal(true)}>
        ✏️ Edit
      </button>
      <button className="profile-btn">🏃‍♂️ Lv.{user.level}</button>

      {/* 이름 수정 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>이름 수정</h4>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input-box"
            />
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                취소
              </button>
              <button className="modal-btn save" onClick={handleSave}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
