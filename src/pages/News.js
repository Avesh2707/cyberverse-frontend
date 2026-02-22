import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function News() {
  const [news, setNews] = useState([]);
  const [ctfs, setCtfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('news');

  useEffect(() => {
    Promise.all([API.get('/ctf-news'), API.get('/live-ctfs')]).then(([n, c]) => {
      setNews(n.data.data); setCtfs(c.data.data); setLoading(false);
    });
  }, []);

  const tabStyle = (t) => ({ fontFamily:'var(--font-mono)', fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', padding:'10px 24px', cursor:'pointer', border:'none', background:tab===t?'var(--green)':'transparent', color:tab===t?'#000':'var(--text-dim)', transition:'all 0.2s' });

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        <p className="section-title">// INTEL FEED</p>
        <h2 className="section-heading">CTF News & Events</h2>

        {/* Tabs */}
        <div style={{display:'flex',borderBottom:'1px solid var(--border)',marginBottom:'32px',gap:'4px'}}>
          <button style={tabStyle('news')} onClick={()=>setTab('news')}>📰 Cyber News</button>
          <button style={tabStyle('ctfs')} onClick={()=>setTab('ctfs')}>🏆 Live CTF Events</button>
        </div>

        {loading ? <div className="loading-screen" style={{minHeight:'40vh'}}><div className="loading-bar"/></div> : (
          tab === 'news' ? (
            <div className="grid-2">
              {news.map((n, i) => (
                <a key={i} href={n.url} target="_blank" rel="noreferrer" style={{textDecoration:'none'}}>
                  <div className="card" style={{cursor:'pointer',height:'100%'}}>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-dim)',letterSpacing:'2px',marginBottom:'8px',textTransform:'uppercase'}}>{n.source} · {n.published_at ? new Date(n.published_at).toLocaleDateString() : ''}</div>
                    <h3 style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'15px',lineHeight:1.5,marginBottom:'10px',color:'var(--text)'}}>{n.title}</h3>
                    <p style={{fontFamily:'var(--font-ui)',fontSize:'13px',color:'var(--text-dim)',lineHeight:1.6}}>{n.description}</p>
                    <div style={{marginTop:'16px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--green)'}}>READ MORE →</div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {ctfs.map((c, i) => (
                <div key={i} className="card">
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'12px'}}>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-dim)',letterSpacing:'2px',marginBottom:'8px',textTransform:'uppercase'}}>{c.format} · {c.location}</div>
                      <h3 style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'18px',marginBottom:'8px'}}>{c.event_name}</h3>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-dim)',display:'flex',gap:'24px',flexWrap:'wrap'}}>
                        <span>📅 Start: {new Date(c.start_date).toLocaleDateString()}</span>
                        <span>🏁 End: {new Date(c.end_date).toLocaleDateString()}</span>
                        {c.weight && <span>⚖️ Weight: {c.weight}</span>}
                      </div>
                    </div>
                    <a href={c.link} target="_blank" rel="noreferrer"><button className="btn btn-outline" style={{padding:'8px 16px',fontSize:'11px'}}>REGISTER →</button></a>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
