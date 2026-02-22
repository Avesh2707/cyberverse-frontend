import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Compete() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flags, setFlags] = useState({});
  const [results, setResults] = useState({});
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => { API.get('/compete').then(r => { setChallenges(r.data.data); setLoading(false); }); }, []);

  const submit = async (id) => {
    if (!flags[id]) return;
    setSubmitting(id);
    try {
      const res = await API.post('/submit-flag', { challenge_id: id, submitted_flag: flags[id] });
      setResults(p => ({...p, [id]: { success:true, msg: res.data.message }}));
      API.get('/compete').then(r => setChallenges(r.data.data));
    } catch (err) {
      setResults(p => ({...p, [id]: { success:false, msg: err.response?.data?.message || 'Wrong flag!' }}));
    } finally { setSubmitting(null); }
  };

  const ptColor = { easy:'var(--green)', medium:'var(--yellow)', hard:'#ff8800', insane:'var(--red)' };

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        <p className="section-title">// COMPETE MODE</p>
        <div style={{marginBottom:'32px'}}>
          <h2 className="section-heading" style={{marginBottom:'4px'}}>Competitive Challenges</h2>
          <div style={{display:'flex',gap:'24px',fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-dim)'}}>
            <span style={{color:'var(--green)'}}>✓ Points affect leaderboard</span>
            <span>✓ Advanced difficulty</span>
            <span>✓ Real CTF style</span>
          </div>
        </div>

        {/* Banner */}
        <div style={{background:'rgba(255,68,68,0.05)',border:'1px solid rgba(255,68,68,0.3)',padding:'12px 16px',marginBottom:'32px',fontFamily:'var(--font-mono)',fontSize:'12px',color:'#ff8800',letterSpacing:'1px'}}>
          ⚠️ WARNING: Points scored here count towards global ranking. Compete wisely.
        </div>

        {loading ? <div className="loading-screen" style={{minHeight:'40vh'}}><div className="loading-bar"/></div> : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {challenges.map(c => (
              <div key={c._id} style={{background:'var(--card)',border:`1px solid ${c.isSolved?'var(--green)':'var(--border)'}`,padding:'20px',position:'relative'}}>
                {c.isSolved && <div style={{position:'absolute',top:'12px',right:'12px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--green)',border:'1px solid var(--green)',padding:'2px 8px'}}>✓ SOLVED</div>}
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',alignItems:'center',marginBottom:'12px'}}>
                  <h3 style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'16px'}}>{c.title}</h3>
                  <span className={`badge badge-${c.difficulty}`}>{c.difficulty}</span>
                  <span style={{fontFamily:'var(--font-title)',fontSize:'16px',color:ptColor[c.difficulty]||'var(--green)',marginLeft:'auto',fontWeight:700}}>⚡ {c.points}</span>
                </div>
                <p style={{color:'var(--text-dim)',fontSize:'13px',lineHeight:1.7,marginBottom:'16px'}}>{c.description}</p>
                {!c.isSolved && (
                  <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                    <input placeholder="CV{flag}" value={flags[c._id]||''} onChange={e=>setFlags(p=>({...p,[c._id]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&submit(c._id)}
                      style={{flex:1,minWidth:'180px',background:'#050505',border:'1px solid var(--border)',color:'var(--text)',padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:'13px',outline:'none'}} />
                    <button onClick={()=>submit(c._id)} disabled={submitting===c._id} className="btn btn-primary" style={{padding:'10px 20px',fontSize:'12px'}}>
                      {submitting===c._id?'...':'SUBMIT FLAG'}
                    </button>
                  </div>
                )}
                {results[c._id] && <div className={`alert ${results[c._id].success?'alert-success':'alert-error'}`} style={{marginTop:'12px',marginBottom:0}}>{results[c._id].msg}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
