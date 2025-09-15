import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleAuthSuccess } from "../utils/auth";
import { authApi } from "../api/authApi";
import "./../styles/Auth.css";

export default function Login() {
  const [form, setForm] = useState({ memberId: "", password: "" });
  const navigate = useNavigate();

  // inputbox 입력 변경시
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();       // 새로고침 방지

      try {
        const data = await authApi.login(form);
        handleAuthSuccess(data, navigate);
      } catch (err) {
        alert("로그인 실패");
      }
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <h2>LoopCa</h2>
      </header>

      <h3 className="auth-title">로그인</h3>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="memberId"
          placeholder="로그인"
          value={form.memberId}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit" className="auth-btn">로그인</button>
      </form>

      <p className="auth-footer">
        계정이 없으신가요? <a href="/signup">회원가입</a>
      </p>
    </div>
  );
}
