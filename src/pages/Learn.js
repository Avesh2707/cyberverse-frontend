import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const ICONS = {
  'web-security':'🌐','network-security':'🔌',
  'cryptography':'🔐','reverse-engineering':'⚙️',
  'forensics':'🔍','osint':'📡',
  'malware-analysis':'🦠','cloud-security':'☁️',
  'binary-exploitation':'💣'
};

export default function Learn() {
  const [domains, setDomains] = useState([]);
  const [selected, setSelected] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modLoading, setModLoading] = useState(false);

  useEffect(() => {
    API.get('/domains').then(r => {
      setDomains(r.data.data);
      setLoading(false);
    });
  }, []);

  const loadModules = (domain) => {
    setSelected(domain);
    setModLoading(true);
    API.get(`/learn/${domain.slug}`).then(r => {
      setModules(r.data.data?.modules || []);
      setModLoading(false);
    }).catch(() => { setModules([]); setModLoading(false); });
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        <p className="section-title">// LEARNING CENTER</p>
        <h2 className="section-heading">Learn & Master Skills</h2>

        <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:'24px', alignItems:'start'}}>
          
          {/* Left — Domain List */}
          <div>
            <div style={{fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-dim)', letterSpacing:'2px', marginBottom:'12px'}}>
              SELECT DOMAIN:
            </div>
            {loading ? <div className="loading-bar" style={{marginTop:'20px'}}/> : (
              domains.map(d => (
                <div key={d._id} onClick={() => loadModules(d)}
                  style={{
                    padding:'14px 16px', marginBottom:'8px',
                    background: selected?._id === d._id ? 'rgba(0,255,65,0.1)' : 'var(--card)',
                    border: `1px solid ${selected?._id === d._id ? 'var(--green)' : 'var(--border)'}`,
                    cursor:'pointer', transition:'all 0.2s',
                    display:'flex', alignItems:'center', gap:'12px'
                  }}>
                  <span style={{fontSize:'20px'}}>{ICONS[d.slug]||'🔒'}</span>
                  <div>
                    <div style={{fontFamily:'var(--font-ui)', fontWeight:600, fontSize:'14px', color: selected?._id===d._id ? 'var(--green)' : 'var(--text)'}}>{d.name}</div>
                    <div style={{fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--text-dim)'}}>{d.total_challenges} challenges</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right — Modules */}
          <div>
            {!selected && (
              <div style={{textAlign:'center', padding:'80px 40px', border:'1px solid var(--border)', fontFamily:'var(--font-mono)', color:'var(--text-dim)'}}>
                <div style={{fontSize:'40px', marginBottom:'16px'}}>📚</div>
                <div style={{fontSize:'13px', letterSpacing:'2px'}}>SELECT A DOMAIN TO START LEARNING</div>
              </div>
            )}

            {selected && (
              <div>
                <div style={{marginBottom:'24px', padding:'16px', background:'var(--card)', border:'1px solid var(--border)'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                    <span style={{fontSize:'32px'}}>{ICONS[selected.slug]}</span>
                    <div>
                      <h3 style={{fontFamily:'var(--font-title)', fontSize:'18px', fontWeight:900, color:'var(--green)'}}>{selected.name}</h3>
                      <p style={{fontFamily:'var(--font-ui)', fontSize:'13px', color:'var(--text-dim)', marginTop:'4px'}}>{selected.description}</p>
                    </div>
                  </div>
                </div>

                {modLoading && <div className="loading-bar"/>}

                {!modLoading && modules.length === 0 && (
                  <div style={{textAlign:'center', padding:'60px', border:'1px solid var(--border)', fontFamily:'var(--font-mono)', color:'var(--text-dim)', fontSize:'13px'}}>
                    <div style={{fontSize:'32px', marginBottom:'12px'}}>🚧</div>
                    Modules coming soon for this domain!<br/>
                    <span style={{fontSize:'11px', marginTop:'8px', display:'block'}}>Meanwhile — <Link to={`/domains/${selected.slug}`} style={{color:'var(--green)'}}>try the challenges →</Link></span>
                  </div>
                )}

                {!modLoading && modules.map((mod, i) => (
                  <div key={mod._id} className="card" style={{marginBottom:'16px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px'}}>
                      <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                        <div style={{width:'32px', height:'32px', background:'var(--green-faint)', border:'1px solid var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-title)', fontSize:'12px', color:'var(--green)', fontWeight:900, flexShrink:0}}>
                          {String(i+1).padStart(2,'0')}
                        </div>
                        <h3 style={{fontFamily:'var(--font-ui)', fontWeight:700, fontSize:'16px'}}>{mod.title}</h3>
                      </div>
                      <span style={{fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--text-dim)', border:'1px solid var(--border)', padding:'3px 8px', whiteSpace:'nowrap'}}>
                        ⏱ {mod.estimated_time} min
                      </span>
                    </div>

                    {/* Content Preview */}
                    <div style={{background:'#050505', border:'1px solid var(--border)', padding:'16px', fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-dim)', lineHeight:1.8, maxHeight:'150px', overflow:'hidden', position:'relative', marginBottom:'16px'}}>
                      {mod.content_markdown?.slice(0,400)}...
                      <div style={{position:'absolute', bottom:0, left:0, right:0, height:'40px', background:'linear-gradient(transparent, #050505)'}}/>
                    </div>

                    {/* Video */}
                    {mod.video_url && (
                      <a href={mod.video_url} target="_blank" rel="noreferrer">
                        <button className="btn btn-outline" style={{padding:'8px 16px', fontSize:'11px', marginBottom:'12px'}}>
                          ▶ WATCH VIDEO
                        </button>
                      </a>
                    )}

                    {/* Resources */}
                    {mod.resources_links?.length > 0 && (
                      <div>
                        <div style={{fontFamily:'var(--font-mono)', fontSize:'11px', color:'var(--green)', letterSpacing:'2px', marginBottom:'8px'}}>// RESOURCES</div>
                        {mod.resources_links.map((r, j) => (
                          <a key={j} href={r.url} target="_blank" rel="noreferrer" style={{display:'block', fontFamily:'var(--font-mono)', fontSize:'12px', color:'var(--text-dim)', textDecoration:'none', padding:'6px 0', borderBottom:'1px solid rgba(0,255,65,0.05)'}}>
                            <span style={{color:'var(--green)'}}>→ </span>{r.title}
                            <span style={{color:'var(--border)', marginLeft:'8px'}}>[{r.type}]</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}