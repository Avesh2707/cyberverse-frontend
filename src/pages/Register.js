import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MatrixBg from '../components/MatrixBg';

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', password:'', college_name:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await register(form); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0a' }}>
      <MatrixBg />
      <div className="scanline" />
      <div style={{ width:'100%', maxWidth:'440px', padding:'0 20px', position:'relative', zIndex:2 }}>
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <h1 style={{ fontFamily:'var(--font-title)', fontSize:'28px', fontWeight:900, color:'var(--green)', textShadow:'0 0 30px var(--green-glow)', letterSpacing:'4px' }}>JOIN OPENLABS</h1>
          <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-dim)', marginTop:'8px', letterSpacing:'2px' }}>CREATE YOUR HACKER IDENTITY</p>
        </div>
        <div style={{ background:'#0f0f0f', border:'1px solid var(--border)', padding:'32px', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--green),transparent)' }} />
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="input-group"><label>Username</label><input placeholder="h4x0r_name" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required /></div>
            <div className="input-group"><label>Email</label><input type="email" placeholder="user@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
            <div className="input-group"><label>Password</label><input type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required /></div>
            <div className="input-group"><label>College Name</label><input placeholder="Your Institution" value={form.college_name} onChange={e=>setForm({...form,college_name:e.target.value})} required /></div>
            <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:'8px'}} disabled={loading}>{loading?'CREATING ACCOUNT...':'REGISTER →'}</button>
          </form>
          <p style={{textAlign:'center',marginTop:'24px',fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-dim)'}}>Already a hacker? <Link to="/login" style={{color:'var(--green)',textDecoration:'none'}}>LOGIN</Link></p>
        </div>
      </div>
    </div>
  );
}
