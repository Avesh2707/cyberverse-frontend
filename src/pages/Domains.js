import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const ICONS = {'web-security':'🌐','network-security':'🔌','cryptography':'🔐','reverse-engineering':'⚙️','forensics':'🔍','osint':'📡','malware-analysis':'🦠','cloud-security':'☁️','binary-exploitation':'💣'};

export default function Domains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/domains').then(r => { setDomains(r.data.data); setLoading(false); });
  }, []);

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        <p className="section-title">// DOMAINS</p>
        <h2 className="section-heading">Choose Your Path</h2>
        {loading ? <div className="loading-screen" style={{minHeight:'40vh'}}><div className="loading-bar"/></div> : (
          <div className="grid-3">
            {domains.map(d => (
              <Link to={`/domains/${d.slug}`} key={d._id} style={{textDecoration:'none'}}>
                <div className="card" style={{cursor:'pointer',height:'100%'}}>
                  <div style={{fontSize:'40px',marginBottom:'16px'}}>{ICONS[d.slug]||'🔒'}</div>
                  <h3 style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'18px',marginBottom:'8px'}}>{d.name}</h3>
                  <span className={`badge badge-${d.difficulty_level==='beginner'?'easy':d.difficulty_level==='intermediate'?'medium':'hard'}`} style={{marginBottom:'12px',display:'inline-block'}}>{d.difficulty_level}</span>
                  <p style={{fontFamily:'var(--font-ui)',fontSize:'13px',color:'var(--text-dim)',lineHeight:1.6,marginBottom:'16px'}}>{d.description}</p>
                  <div style={{display:'flex',justifyContent:'space-between',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-dim)',borderTop:'1px solid var(--border)',paddingTop:'12px',marginTop:'auto'}}>
                    <span>📚 {d.total_challenges} challenges</span>
                    <span style={{color:'var(--green)'}}>EXPLORE →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
