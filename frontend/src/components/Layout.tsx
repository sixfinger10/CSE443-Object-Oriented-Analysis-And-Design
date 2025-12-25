import { useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 1, icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { id: 2, icon: '📚', label: 'My Library', path: '/my-library' },
    { id: 3, icon: '➕', label: 'Add Item', path: '/add-item' },
    { id: 4, icon: '🔍', label: 'Search', path: '/search' },
    { id: 5, icon: '⭐', label: 'Favorites', path: '/favorites' },
    { id: 6, icon: '📝', label: 'My Lists', path: '/my-lists' },
    { id: 7, icon: '📁', label: 'Categories', path: '/categories' },
    { id: 8, icon: '🔄', label: 'Sync', path: '/sync' },
    { id: 9, icon: '⚙️', label: 'Settings', path: '/settings' },
    { id: 10, icon: '🚪', label: 'Logout', path: '/logout' },
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.label === 'Logout') {
      localStorage.clear();
      navigate('/login');
      return;
    }

    navigate(item.path);
  };

  // Aktif menüyü current path'e göre belirle
  const getActiveLabel = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="layout-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <rect x="12" y="8" width="24" height="32" rx="2" stroke="white" strokeWidth="2"/>
              <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="20" x2="32" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="26" x2="28" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>PLMS</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${getActiveLabel() === item.label ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;