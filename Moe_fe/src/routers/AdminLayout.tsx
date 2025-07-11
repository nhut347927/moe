import Header from '@/pages/client/Header';
import { Outlet } from 'react-router-dom';


const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Header />
      
      <div className="admin-content">
      <Outlet />
      </div>
      
      {/* <Footer /> */}
    </div>
  );
};

export default AdminLayout;
