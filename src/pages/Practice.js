import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function Practice() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flags, setFlags] = useState({});
  const [results, setResults] = useState({});
  const [submitting, setSubmitting] = useState(null);

  const load = () => { setLoading(true); API.get('/practice').then(r => { setChallenges(r.data.data); setLoading(false); }); };
  useEffect(load, []);

  const submit = async (id) => {
    if (!flags[id]) return;
    setSubmitting(id);
    try {
      const res = await API.post('/submit-flag', { challenge_id: id, submitted_flag: flags[id] });
      setResults(p => ({...p, [id]: { success:true, msg: res.data.message }}));
    } catch (err) {
      setResults(p => ({...p, [id]: { success:false, msg: err.response?.data?.message || 'Wrong flag!' }}));
    } finally { setSubmitting(null); }
  };

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        <p className="section-title">// PRACTICE MODE</p>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'32px',flexWrap:'wrap',gap:'16px'}}>
          <div>
            <h2 className="section-heading" style={{marginBottom:'4px'}}>Random Challenges</h2>
            <p style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-dim)'}}>⚠️ Practice mode — points earned won't affect leaderboard</p>
          </div>
          <button onClick={load} className="btn btn-outline">🔄 REFRESH</button>
        </div>

        {loading ? <div className="loading-screen" style={{minHeight:'40vh'}}><div className="loading-bar"/></div> : (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            {challenges.length === 0 && <div style={{textAlign:'center',color:'var(--text-dim)',fontFamily:'var(--font-mono)',padding:'60px'}}>No practice challenges available. Try refreshing!</div>}
            {challenges.map(c => (
              <div key={c._id} className="card">
                <div style={{display:'flex',flexWrap:'wrap',gap:'8px',alignItems:'center',marginBottom:'12px'}}>
                  <h3 style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'16px'}}>{c.title}</h3>
                  <span className={`badge badge-${c.difficulty}`}>{c.difficulty}</span>
                  <span style={{fontFamily:'var(--font-title)',fontSize:'14px',color:'var(--green)',marginLeft:'auto'}}>⚡ {c.points} pts</span>
                </div>
                <p style={{color:'var(--text-dim)',fontSize:'13px',lineHeight:1.7,marginBottom:'16px'}}>{c.description}</p>
                <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                  <input
                    placeholder="CV{your_flag}"
                    value={flags[c._id]||''}
                    onChange={e=>setFlags(p=>({...p,[c._id]:e.target.value}))}
                    onKeyDown={e=>e.key==='Enter'&&submit(c._id)}
                    style={{flex:1,minWidth:'180px',background:'#050505',border:'1px solid var(--border)',color:'var(--text)',padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:'13px',outline:'none'}}
                  />
                  <button onClick={()=>submit(c._id)} disabled={submitting===c._id} className="btn btn-primary" style={{padding:'10px 20px',fontSize:'12px'}}>
                    {submitting===c._id?'...':'SUBMIT'}
                  </button>
                </div>
                {results[c._id] && <div className={`alert ${results[c._id].success?'alert-success':'alert-error'}`} style={{marginTop:'12px',marginBottom:0}}>{results[c._id].msg}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
