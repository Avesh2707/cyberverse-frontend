import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';

export default function DomainDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [flagInputs, setFlagInputs] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    API.get(`/domains/${slug}`).then(r => { setData(r.data.data); setLoading(false); });
  }, [slug]);

  const submitFlag = async (challengeId) => {
    const flag = flagInputs[challengeId];
    if (!flag) return;
    setSubmitting(challengeId);
    try {
      const res = await API.post('/submit-flag', { challenge_id: challengeId, submitted_flag: flag });
      setResults(prev => ({ ...prev, [challengeId]: { success: true, msg: res.data.message } }));
      // Refresh
      API.get(`/domains/${slug}`).then(r => setData(r.data.data));
    } catch (err) {
      setResults(prev => ({ ...prev, [challengeId]: { success: false, msg: err.response?.data?.message || 'Error' } }));
    } finally { setSubmitting(null); }
  };

  const diffColor = { easy:'var(--green)', medium:'var(--yellow)', hard:'#ff8800', insane:'var(--red)' };

  if (loading) return <div className="loading-screen"><div className="loading-bar"/></div>;

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        {/* Domain header */}
        <div style={{marginBottom:'40px',borderBottom:'1px solid var(--border)',paddingBottom:'24px'}}>
          <p className="section-title">// {data?.domain?.name}</p>
          <h1 style={{fontFamily:'var(--font-title)',fontSize:'28px',fontWeight:900,marginBottom:'8px'}}>{data?.domain?.name}</h1>
          <p style={{color:'var(--text-dim)',fontFamily:'var(--font-ui)',fontSize:'14px'}}>{data?.domain?.description}</p>
        </div>

        {/* Challenges */}
        <p className="section-title">// CHALLENGES [{data?.challenges?.length}]</p>
        <div style={{display:'flex',flexDirection:'column',gap:'16px',marginTop:'16px'}}>
          {data?.challenges?.map(c => (
            <div key={c._id} style={{background:'var(--card)',border:`1px solid ${c.isSolved ? 'var(--green)' : 'var(--border)'}`,padding:'20px',position:'relative',opacity:c.isSolved?0.7:1}}>
              {c.isSolved && <div style={{position:'absolute',top:'12px',right:'12px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--green)',border:'1px solid var(--green)',padding:'2px 8px'}}>✓ SOLVED</div>}
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px',flexWrap:'wrap'}}>
                <h3 style={{fontFamily:'var(--font-ui)',fontWeight:700,fontSize:'16px'}}>{c.title}</h3>
                <span className={`badge badge-${c.difficulty}`}>{c.difficulty}</span>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-dim)',border:'1px solid var(--border)',padding:'2px 8px'}}>{c.type}</span>
                <span style={{fontFamily:'var(--font-title)',fontSize:'14px',color:diffColor[c.difficulty],marginLeft:'auto'}}>⚡ {c.points} pts</span>
              </div>
              <p style={{color:'var(--text-dim)',fontSize:'13px',lineHeight:1.7,marginBottom:'16px'}}>{c.description}</p>

              {/* Hints */}
              {c.hints?.length > 0 && (
                <details style={{marginBottom:'12px'}}>
                  <summary style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--yellow)',cursor:'pointer',letterSpacing:'1px'}}>💡 HINTS ({c.hints.length})</summary>
                  {c.hints.map((h,i) => <p key={i} style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-dim)',marginTop:'8px',paddingLeft:'16px'}}>→ {h.text} {h.cost>0 && <span style={{color:'var(--red)'}}>(-{h.cost} pts)</span>}</p>)}
                </details>
              )}

              {/* Flag submission */}
              {!c.isSolved && (
                <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap'}}>
                  <input
                    placeholder="CV{flag_here}"
                    value={flagInputs[c._id] || ''}
                    onChange={e => setFlagInputs(p => ({...p,[c._id]:e.target.value}))}
                    onKeyDown={e => e.key==='Enter' && submitFlag(c._id)}
                    style={{flex:1,minWidth:'200px',background:'#050505',border:'1px solid var(--border)',color:'var(--text)',padding:'10px 14px',fontFamily:'var(--font-mono)',fontSize:'13px',outline:'none'}}
                  />
                  <button onClick={()=>submitFlag(c._id)} disabled={submitting===c._id} className="btn btn-primary" style={{padding:'10px 20px',fontSize:'12px'}}>
                    {submitting===c._id ? 'CHECKING...' : 'SUBMIT FLAG'}
                  </button>
                </div>
              )}
              {results[c._id] && (
                <div className={`alert ${results[c._id].success?'alert-success':'alert-error'}`} style={{marginTop:'12px',marginBottom:0}}>
                  {results[c._id].msg}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
