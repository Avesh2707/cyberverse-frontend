import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get(`/users/${user?.username}`),
      API.get('/users/submissions')
    ]).then(([p, s]) => {
      setProfile(p.data.data);
      setSubmissions(s.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="loading-screen"><div className="loading-bar"/></div>;

  return (
    <div className="app-wrapper">
      <Navbar />
      <div className="page fade-in">
        <div style={{display:'grid',gridTemplateColumns:'300px 1fr',gap:'32px',alignItems:'start',flexWrap:'wrap'}}>
          {/* Left — Profile card */}
          <div>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',padding:'32px',textAlign:'center',position:'relative',marginBottom:'20px'}}>
              <div style={{position:'absolute',top:0,left:0,right:0,height:'3px',background:'linear-gradient(90deg,transparent,var(--green),transparent)'}}/>
              <div style={{width:'80px',height:'80px',background:'var(--green-faint)',border:'2px solid var(--green)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'32px'}}>
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <h2 style={{fontFamily:'var(--font-title)',fontSize:'20px',fontWeight:900,color:'var(--green)',marginBottom:'4px'}}>{user?.username}</h2>
              <p style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-dim)',marginBottom:'16px'}}>{user?.college_name}</p>
              <div style={{display:'flex',justifyContent:'space-around',borderTop:'1px solid var(--border)',paddingTop:'16px'}}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-title)',fontSize:'20px',fontWeight:900,color:'var(--green)'}}>{profile?.user?.totalPoints||0}</div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-dim)'}}>POINTS</div>
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontFamily:'var(--font-title)',fontSize:'20px',fontWeight:900,color:'var(--green)'}}>#{profile?.user?.rank||'?'}</div>
                  <div style={{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--text-dim)'}}>RANK</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {profile?.user?.badges?.length > 0 && (
              <div style={{background:'var(--card)',border:'1px solid var(--border)',padding:'20px'}}>
                <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--green)',letterSpacing:'2px',marginBottom:'16px'}}>// BADGES</div>
                {profile.user.badges.map((b, i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                    <span style={{fontSize:'20px'}}>{b.icon}</span>
                    <div>
                      <div style={{fontFamily:'var(--font-ui)',fontWeight:600,fontSize:'13px'}}>{b.name}</div>
                      <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-dim)'}}>{b.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — Activity */}
          <div>
            <p className="section-title">// RECENT ACTIVITY</p>
            <div style={{marginTop:'16px',display:'flex',flexDirection:'column',gap:'8px'}}>
              {submissions.length === 0 && <div style={{fontFamily:'var(--font-mono)',fontSize:'13px',color:'var(--text-dim)',padding:'40px',textAlign:'center',border:'1px solid var(--border)'}}>No submissions yet. Start hacking!</div>}
              {submissions.map((s, i) => (
                <div key={i} style={{background:'var(--card)',border:'1px solid var(--border)',padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'8px'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-ui)',fontWeight:600,fontSize:'14px',marginBottom:'4px'}}>{s.challenge_id?.title||'Challenge'}</div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:'11px',color:'var(--text-dim)'}}>{new Date(s.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontFamily:'var(--font-title)',fontSize:'14px',color:'var(--green)',fontWeight:700}}>+{s.points_earned} pts</div>
                    <span className={`badge badge-${s.challenge_id?.difficulty||'easy'}`}>{s.challenge_id?.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
