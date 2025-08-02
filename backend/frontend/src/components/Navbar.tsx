import { Link } from '@tanstack/react-router';
import { useAuth } from '../features/auth/AuthProvider';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-600 text-white">
      <div className="flex gap-6">
        <Link to="/" className="hover:text-blue-200 font-medium">Dashboard</Link>
        <Link to="/tickets" className="hover:text-blue-200 font-medium">Tickets</Link>
        <Link to="/users" className="hover:text-blue-200 font-medium">Users</Link>
        <Link to="/menu" className="hover:text-blue-200 font-medium">Menu</Link>
      </div>
      
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-blue-100">
            Welcome, {user.username} ({user.role})
          </span>
        )}
        <button
          onClick={logout}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
