import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GroupList from "../pages/GroupList";
import Flashcard from "../pages/Flashcard";
import FlashcardComplete from "../pages/FlashcardComplete";
import Profile from "../pages/Profile";
import Layout from "../components/Layout";
import ModeSelect from "../pages/ModeSelect";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* 그룹 목록 */}
        <Route
          path="/"
          element={
            <Layout title="LoopCa" showBottomNav>
              <GroupList />
            </Layout>
          }
        />

        {/* 학습모드 선택 */}
        <Route
          path="/modeSelect/:groupIdx"
          element={
            <Layout title="LoopCa" showBackBtn showBottomNav={false}>
              <ModeSelect />
            </Layout>
          }
        />


        {/* 플래시카드 학습 */}
        <Route
          path="/flashcard/:groupIdx/:sessionIdx/:cycleNo"
          element={<Flashcard />}
        />

        {/* 학습 완료 화면 */}
        <Route path="/flashcard/complete" element={<FlashcardComplete />} />



        {/* 프로필 */}
        <Route
          path="/profile"
          element={
            <Layout title="Profile" showBottomNav>
              <Profile />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
