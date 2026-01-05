import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar glass">
            <Link to="/" className="logo">
                <ShieldAlert size={32} />
                <span>ResQNet</span>
            </Link>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Hello, {user.username}</span>
                        {(user.role === 'authority' || user.role === 'volunteer') && (
                            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                                <LayoutDashboard size={18} />
                            </Link>
                        )}
                        <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <LogOut size={18} />
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                        <User size={18} style={{ marginRight: '0.5rem' }} /> Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
