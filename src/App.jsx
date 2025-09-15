import "./styles/global.css";
import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";

function useBlockBrowserNav() {
  useEffect(() => {
    const handlePopState = () => {
      alert("브라우저 뒤로가기 / 앞으로가기는 허용되지 않습니다.");
      window.history.go(1);
    };

    // 기존 리스너 제거 후 다시 등록 (중복 방지)
    window.removeEventListener("popstate", handlePopState);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
}

function App() {
  useBlockBrowserNav();

  return <AppRouter />;
}

export default App;
