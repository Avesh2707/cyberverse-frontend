import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const DOMAIN_ICONS = { 'web-security':'🌐','network-security':'🔌','cryptography':'🔐','reverse-engineering':'⚙️','forensics':'🔍','osint':'📡','malware-analysis':'🦠','cloud-security':'☁️','binary-exploitation':'💣' };

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard').then(r => { setData(r.data.data); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div style={{fontFamily:'var(--font-title)',fontSize:'20px',color:'var(--green)',letterSpacing:'4px'}}>OPENLABS</div>
      <div className="loading-bar"/>
      <span style={{fontSize:'12px',letterSpacing:'2px'}}>LOADING SYSTEMS...</span>
    </div>
  );

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        {/* Header */}
        <div style={{marginBottom:'40px', borderBottom:'1px solid var(--border)', paddingBottom:'24px'}}>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-dim)',marginBottom:'8px',letterSpacing:'2px'}}>
            <span style={{color:'var(--green)'}}>$</span> whoami
          </div>
          <h1 style={{fontFamily:'var(--font-title)',fontSize:'36px',fontWeight:900,color:'var(--text)'}}>
            Hi, <span style={{color:'var(--green)',textShadow:'0 0 20px var(--green-glow)'}}>{user?.username}</span>
          </h1>
          <p style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-dim)',marginTop:'8px'}}>
            Welcome back, Agent. Your mission awaits.
          </p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label:'Challenges Solved', value: data?.stats?.completedChallenges || 0, icon:'🎯' },
            { label:'Total Points', value: data?.stats?.totalPoints || 0, icon:'⚡' },
            { label:'Global Rank', value: `#${data?.stats?.rank || '?'}`, icon:'🏆' },
            { label:'Badges Earned', value: data?.stats?.badgesEarned || 0, icon:'🏅' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div style={{fontSize:'24px',marginBottom:'8px'}}>{s.icon}</div>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{display:'flex',gap:'12px',marginBottom:'48px',flexWrap:'wrap'}}>
          <Link to="/practice"><button className="btn btn-primary">⚔️ Practice Mode</button></Link>
          <Link to="/compete"><button className="btn btn-outline">🏆 Compete</button></Link>
          <Link to="/leaderboard"><button className="btn btn-outline">📊 Leaderboard</button></Link>
          <Link to="/news"><button className="btn btn-outline">📰 CTF News</button></Link>
        </div>

        {/* Domains */}
        <div>
          <p className="section-title">// LEARNING PATHS</p>
          <h2 className="section-heading">Security Domains</h2>
          <div className="grid-3">
            {data?.domains?.map((domain) => (
              <Link to={`/domains/${domain.slug}`} key={domain._id} style={{textDecoration:'none'}}>
                <div className="card" style={{cursor:'pointer'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                    <span style={{fontSize:'28px'}}>{DOMAIN_ICONS[domain.slug] || '🔒'}</span>
                    <div>
                      <div style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'16px',color:'var(--text)'}}>{domain.name}</div>
                      <span className={`badge badge-${domain.difficulty_level === 'beginner' ? 'easy' : domain.difficulty_level === 'intermediate' ? 'medium' : 'hard'}`}>
                        {domain.difficulty_level}
                      </span>
                    </div>
                  </div>
                  <p style={{fontFamily:'var(--font-ui)',fontSize:'13px',color:'var(--text-dim)',lineHeight:1.6,marginBottom:'16px'}}>{domain.description}</p>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-dim)'}}>
                    <span>{domain.total_challenges} challenges</span>
                    <span style={{color:'var(--green)'}}>ENTER →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
