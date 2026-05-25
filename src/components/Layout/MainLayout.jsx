import { Outlet } from 'react-router-dom';
import Header from '../Header';

const MainLayout = () => {
  return (
    <>
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;

