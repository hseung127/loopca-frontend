export function handleAuthSuccess(data, navigate) {
  // 백엔드 응답 { token, member: { memberId, nickname, points } }
  localStorage.setItem("token", data.token);
  localStorage.setItem("member", JSON.stringify(data.member));

  // 홈으로 이동
  navigate("/");
}



export function logout(navigate) {
  localStorage.removeItem("token");
  localStorage.removeItem("member");
  navigate("/login");
}

export function getCurrentMember() {
  const member = localStorage.getItem("member");
  return member ? JSON.parse(member) : null;
}
