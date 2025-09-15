import Header from "./Header";
import BottomNav from "./BottomNav";

export default function Layout({
  children,
  title,
  showEditBtn,
  showBackBtn,
  showSettingsBtn,
  showBottomNav = true,
}) {
  return (
    <div className="layout">
      <Header
        title={title}
        showEditBtn={showEditBtn}
        showBackBtn={showBackBtn}
        showSettingsBtn={showSettingsBtn}
      />
      <main style={{ flex: 1 }}>{children}</main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
