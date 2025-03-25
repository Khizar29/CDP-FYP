import DashboardHeader from "../DashboardHeader";

const HeaderAdmin = ({ onToggleSidebar }) => {
  return (
    <div>
      <DashboardHeader role="admin" onToggleSidebar={onToggleSidebar} />
      {/* Admin Dashboard Content */}
    </div>
  );
};

export default HeaderAdmin;
