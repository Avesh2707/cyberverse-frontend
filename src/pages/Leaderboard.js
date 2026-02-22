import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { API.get('/leaderboard').then(r => { setData(r.data.data); setLoading(false); }); }, []);

  const medalColor = ['#FFD700','#C0C0C0','#CD7F32'];

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        <p className="section-title">// GLOBAL RANKINGS</p>
        <h2 className="section-heading">Leaderboard</h2>

        {/* Current user rank */}
        {data?.currentUser && (
          <div style={{background:'rgba(0,255,65,0.05)',border:'1px solid var(--green)',padding:'16px 20px',marginBottom:'32px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'12px'}}>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'13px'}}>
              <span style={{color:'var(--text-dim)'}}>YOUR RANK: </span>
              <span style={{color:'var(--green)',fontFamily:'var(--font-title)',fontSize:'20px',fontWeight:900}}>#{data.currentUser.rank}</span>
            </div>
            <div style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-dim)'}}>
              {data.currentUser.total_points} pts · {data.currentUser.challenges_solved} solved
            </div>
          </div>
        )}

        {loading ? <div className="loading-screen" style={{minHeight:'40vh'}}><div className="loading-bar"/></div> : (
          <div>
            {/* Table header */}
            <div style={{display:'grid',gridTemplateColumns:'60px 1fr 1fr 120px 100px',gap:'16px',padding:'12px 16px',fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-dim)',letterSpacing:'2px',borderBottom:'1px solid var(--border)',textTransform:'uppercase'}}>
              <span>Rank</span><span>Hacker</span><span>College</span><span>Challenges</span><span style={{textAlign:'right'}}>Points</span>
            </div>

            {data?.leaderboard?.map((entry, i) => {
              const isMe = entry.user_id === user?.id;
              return (
                <div key={entry._id} style={{display:'grid',gridTemplateColumns:'60px 1fr 1fr 120px 100px',gap:'16px',padding:'14px 16px',borderBottom:'1px solid rgba(0,255,65,0.05)',background:isMe?'rgba(0,255,65,0.04)':'transparent',transition:'background 0.2s',alignItems:'center'}}
                  onMouseEnter={e=>e.currentTarget.style.background=isMe?'rgba(0,255,65,0.08)':'rgba(255,255,255,0.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background=isMe?'rgba(0,255,65,0.04)':'transparent'}>
                  <span style={{fontFamily:'var(--font-title)',fontSize:'16px',fontWeight:900,color:medalColor[i]||'var(--text-dim)'}}>
                    {i<3?['🥇','🥈','🥉'][i]:`#${entry.rank}`}
                  </span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:isMe?'var(--green)':'var(--text)',fontWeight:isMe?700:400}}>
                    {entry.username}{isMe&&<span style={{fontSize:'10px',color:'var(--green)',marginLeft:'8px',border:'1px solid var(--green)',padding:'1px 6px'}}>YOU</span>}
                  </span>
                  <span style={{fontFamily:'var(--font-ui)',fontSize:'12px',color:'var(--text-dim)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{entry.college_name||'—'}</span>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-dim)',textAlign:'center'}}>{entry.challenges_solved||0}</span>
                  <span style={{fontFamily:'var(--font-title)',fontSize:'14px',fontWeight:700,color:'var(--green)',textAlign:'right',textShadow:'0 0 10px var(--green-glow)'}}>{entry.total_points}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
