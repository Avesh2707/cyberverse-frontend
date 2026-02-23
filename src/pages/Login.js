import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MatrixBg from '../components/MatrixBg';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
      <MatrixBg />
      <div className="scanline" />
      <div style={{ width:'100%', maxWidth:'420px', padding:'0 20px', position:'relative', zIndex:2 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <h1 style={{ fontFamily:'var(--font-title)', fontSize:'32px', fontWeight:900, color:'var(--green)', textShadow:'0 0 30px var(--green-glow)', letterSpacing:'4px' }}>OPEN<span style={{color:'#555'}}>LABS</span></h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-dim)', marginTop:'8px', letterSpacing:'3px' }}>HACK. LEARN. DOMINATE.</p>
        </div>

        {/* Card */}
        <div style={{ background:'#0f0f0f', border:'1px solid var(--border)', padding:'32px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--green),transparent)' }} />

          <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-dim)', letterSpacing:'3px', marginBottom:'24px' }}>
            <span style={{ color:'var(--green)' }}>$</span> ./authenticate --user
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <input type="email" placeholder="user@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%', marginTop:'8px' }} disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'LOGIN →'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'24px', fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-dim)' }}>
            No account? <Link to="/register" style={{ color:'var(--green)', textDecoration:'none' }}>REGISTER</Link>
          </p>
        </div>

        {/* Demo creds */}
        <div style={{ marginTop:'16px', background:'rgba(0,255,65,0.03)', border:'1px solid var(--border)', padding:'12px 16px', fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-dim)' }}>
          <span style={{ color:'var(--green)' }}># </span>Demo: admin@openlabs.io / Admin@12345
        </div>
      </div>
    </div>
  );
}
