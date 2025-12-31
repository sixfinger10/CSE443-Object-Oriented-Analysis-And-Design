import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MyLibrary from './pages/MyLibrary';
import AddItem from './pages/AddItem';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import Categories from './pages/Categories';
import MyLists from './pages/MyLists';
import Settings from './pages/Settings';
import Sync from './pages/Sync';

// Protected Route - Login olmadan Dashboard'a girilmesin
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana sayfa - Login'e yönlendir */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login sayfası */}
        <Route path="/login" element={<Login />} />
        
        {/* Register sayfası */}
        <Route path="/register" element={<Register />} />
        
        {/* Forgot Password sayfası */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Korumalı sayfalar - Layout ile sarılı */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/my-library" 
          element={
            <ProtectedRoute>
              <Layout>
                <MyLibrary />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/add-item" 
          element={
            <ProtectedRoute>
              <Layout>
                <AddItem />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/search" 
          element={
            <ProtectedRoute>
              <Layout>
                <Search />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <Layout>
                <Favorites />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/my-lists" 
          element={
            <ProtectedRoute>
              <Layout>
                <MyLists />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <Layout>
                <Categories />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/sync" 
          element={
            <ProtectedRoute>
              <Layout>
                <Sync />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;