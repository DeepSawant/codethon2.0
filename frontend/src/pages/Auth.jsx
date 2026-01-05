import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.username, formData.email, formData.password, formData.role);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.msg || 'Authentication failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form glass">
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {isLogin ? 'Welcome Back' : 'Join ResQNet'}
                </h2>
                {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="input-group">
                            <label>Role</label>
                            <select
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="user">Public User</option>
                                <option value="volunteer">Volunteer</option>
                                <option value="authority">Authority</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem', opacity: 0.8 }}>
                    <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', color: 'var(--secondary)', textDecoration: 'underline' }}>
                        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                    <div style={{ marginTop: '1rem' }}>
                        <button onClick={() => navigate('/')} style={{ background: 'none', color: 'white', opacity: 0.6 }}>
                            &larr; Back to Map
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
