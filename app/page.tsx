 "use client";
import { useRef, useState } from "react";
import { AudioLines, ArrowDownToLine, ArrowRight, Check, ChevronDown, CircleHelp, Disc3, Download, FileAudio, FileVideo, Headphones, Instagram, Link2, Music2, Search, ShieldCheck, Sparkles, UploadCloud, WandSparkles, Youtube, Zap } from "lucide-react";

type Track = { trackName: string; artistName: string; artworkUrl100: string; previewUrl?: string; trackViewUrl: string };
export default function Home() {
  const [url, setUrl] = useState("");
  const [urlStatus, setUrlStatus] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioName, setAudioName] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [musicStatus, setMusicStatus] = useState("");
  const [playing, setPlaying] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUrlSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = url.trim();
    if (!value) { setUrlStatus("Paste a video link first."); return; }
    let parsed: URL;
    try { parsed = new URL(value); } catch { setUrlStatus("That doesn't look like a valid URL."); return; }
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const allowed = ["youtube.com","youtu.be","instagram.com","tiktok.com"];
    if (!allowed.some(d => host === d || host.endsWith("." + d))) {
      setUrlStatus("Supported links: YouTube, Instagram or TikTok."); return;
    }
    setUrlStatus("Link looks good. To enable downloads, connect a compliant media-provider API in /api/resolve. This starter does not bypass platform restrictions.");
  }

  async function extractAudio() {
    if (!file) return;
    setBusy(true); setAudioUrl(""); setAudioName("");
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContextClass();
      const buffer = await context.decodeAudioData(await file.arrayBuffer());
      const channels = Math.min(buffer.numberOfChannels, 2);
      const sampleRate = buffer.sampleRate;
      const length = buffer.length * channels * 2 + 44;
      const out = new ArrayBuffer(length);
      const view = new DataView(out);
      const write = (offset:number, value:string) => { for(let i=0;i<value.length;i++) view.setUint8(offset+i,value.charCodeAt(i)); };
      write(0,"RIFF"); view.setUint32(4,length-8,true); write(8,"WAVE"); write(12,"fmt "); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,channels,true); view.setUint32(24,sampleRate,true); view.setUint32(28,sampleRate*channels*2,true); view.setUint16(32,channels*2,true); view.setUint16(34,16,true); write(36,"data"); view.setUint32(40,length-44,true);
      let pos=44;
      for(let i=0;i<buffer.length;i++) for(let ch=0;ch<channels;ch++) {
        let sample = Math.max(-1,Math.min(1,buffer.getChannelData(ch)[i]));
        view.setInt16(pos, sample < 0 ? sample*0x8000 : sample*0x7fff, true); pos += 2;
      }
      const blob = new Blob([out],{type:"audio/wav"});
      setAudioUrl(URL.createObjectURL(blob));
      setAudioName(file.name.replace(/\.[^/.]+$/,"") + ".wav");
      await context.close();
    } catch {
      setUrlStatus("");
      alert("This browser could not decode that file. Try MP4, MOV or WebM with a supported audio codec.");
    } finally { setBusy(false); }
  }

  async function searchMusic(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setMusicStatus("Searching…"); setTracks([]);
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=12`);
      const data = await response.json();
      setTracks(data.results || []);
      setMusicStatus(data.results?.length ? "Preview tracks and open official music pages below." : "No tracks found. Try another search.");
    } catch { setMusicStatus("Music search is temporarily unavailable. Please try again."); }
  }

  return <main className="min-h-screen overflow-hidden">
    <div className="fixed inset-0 pointer-events-none grid-bg opacity-70" />
    <div className="fixed -top-48 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-[130px] pointer-events-none"/>
    <div className="fixed top-[550px] -right-40 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none"/>
    <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
      <a href="#" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-glow"><AudioLines size={22}/></span><span className="brand text-xl font-bold tracking-tight">sonic<span className="text-violet-300">flow</span></span></a>
      <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex"><a className="hover:text-white" href="#tools">Tools</a><a className="hover:text-white" href="#music">Find music</a><a className="hover:text-white" href="#how">How it works</a></div>
      <a href="#tools" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400/50">Get started <ArrowRight className="ml-1 inline" size={15}/></a>
    </nav>

    <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-14 text-center md:px-8 md:pt-20">
      <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/[0.08] px-4 py-2 text-xs font-semibold tracking-wide text-violet-200"><Sparkles size={14}/> ONE WORKSPACE. ALL YOUR MEDIA.</div>
      <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.08] tracking-tight md:text-7xl">Your media.<br/><span className="gradient-text">Your way.</span></h1>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">Turn videos into audio, explore new music, and keep your creative workflow in one beautifully simple place.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400"><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-emerald-300"/> Private file processing</span><span className="h-1 w-1 rounded-full bg-slate-600"/><span className="flex items-center gap-2"><Zap size={15} className="text-amber-300"/> Fast and lightweight</span><span className="h-1 w-1 rounded-full bg-slate-600"/><span className="flex items-center gap-2"><Check size={15} className="text-cyan-300"/> No account required</span></div>
    </section>

    <section id="tools" className="relative z-10 mx-auto grid max-w-7xl gap-5 px-5 pb-20 md:grid-cols-2 md:px-8">
      <div className="glass rounded-3xl p-6 shadow-glow md:p-8">
        <div className="mb-6 flex items-start justify-between"><div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200"><Link2 size={22}/></div><h2 className="text-xl font-semibold">Video link downloader</h2><p className="mt-2 text-sm leading-6 text-slate-400">Add a supported link to prepare a video or audio download.</p></div><span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400">LINK TOOL</span></div>
        <div className="mb-4 flex gap-2">{[{name:"YouTube",icon:<Youtube size={16}/>,color:"text-red-300"},{name:"Instagram",icon:<Instagram size={16}/>,color:"text-pink-300"},{name:"TikTok",icon:<Music2 size={16}/>,color:"text-cyan-200"}].map(p=><span key={p.name} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 text-xs ${p.color}`}>{p.icon}{p.name}</span>)}</div>
        <form onSubmit={handleUrlSubmit} className="space-y-3"><label htmlFor="video-url" className="text-xs font-medium text-slate-300">Video URL</label><div className="flex gap-2"><input id="video-url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…" className="input-dark min-w-0 flex-1 rounded-xl px-4 py-3.5 text-sm" /><button className="btn-primary rounded-xl px-4 text-sm font-semibold transition" type="submit"><ArrowRight size={19}/></button></div></form>
        {urlStatus && <p className="mt-4 rounded-xl border border-violet-300/15 bg-violet-300/[0.06] p-3 text-xs leading-5 text-violet-100">{urlStatus}</p>}
        <p className="mt-4 text-[11px] leading-5 text-slate-500">Downloads require an approved provider integration. Only download content you own or are authorized to save.</p>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between"><div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200"><FileAudio size={22}/></div><h2 className="text-xl font-semibold">Video to audio</h2><p className="mt-2 text-sm leading-6 text-slate-400">Extract the audio from a video file right in your browser.</p></div><span className="rounded-full border border-emerald-300/20 bg-emerald-300/[0.06] px-3 py-1 text-[11px] text-emerald-200">BROWSER-BASED</span></div>
        <button onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(e.dataTransfer.files[0])setFile(e.dataTransfer.files[0]);}} className="group flex w-full flex-col items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.025] px-4 py-7 text-center transition hover:border-violet-300/50 hover:bg-violet-300/[0.04]">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06] text-slate-300 group-hover:text-violet-200"><UploadCloud size={24}/></span><span className="text-sm font-semibold">{file ? file.name : "Drop your video here or browse"}</span><span className="mt-2 text-xs text-slate-500">{file ? `${(file.size/1024/1024).toFixed(1)} MB · Ready to extract` : "MP4, MOV, WebM · File stays on your device"}</span>
          <input ref={fileRef} type="file" accept="video/*,audio/*" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)}/>
        </button>
        <button disabled={!file||busy} onClick={extractAudio} className="btn-primary mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40">{busy ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"/> Extracting audio…</> : <><WandSparkles size={17}/> Extract audio as WAV</>}</button>
        {audioUrl && <a href={audioUrl} download={audioName} className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.07] py-3 text-sm font-semibold text-emerald-200"><Download size={17}/> Download {audioName}</a>}
        <p className="mt-3 text-[11px] leading-5 text-slate-500">Audio export is WAV. Very large files may use substantial browser memory.</p>
      </div>
    </section>

    <section id="music" className="relative z-10 mx-auto max-w-7xl px-5 pb-20 md:px-8">
      <div className="glass rounded-3xl p-6 md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-400/10 text-pink-200"><Disc3 size={22}/></div><h2 className="text-2xl font-semibold md:text-3xl">Find your next <span className="gradient-text">favorite track.</span></h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Search a music catalogue, listen to available previews, and open official track pages.</p></div>
          <form onSubmit={searchMusic} className="flex w-full gap-2 md:max-w-md"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search artist or song…" className="input-dark w-full rounded-xl py-3.5 pl-11 pr-4 text-sm"/></div><button className="btn-primary rounded-xl px-5 text-sm font-semibold" type="submit">Search</button></form>
        </div>
        {musicStatus && <p className="mt-5 text-sm text-slate-400">{musicStatus}</p>}
        {tracks.length>0 && <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tracks.map((t,i)=><div key={`${t.trackName}-${i}`} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-3"><img src={t.artworkUrl100} alt="" className="h-14 w-14 rounded-xl object-cover"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{t.trackName}</p><p className="mt-1 truncate text-xs text-slate-400">{t.artistName}</p><div className="mt-2 flex gap-3 text-xs"><a href={t.trackViewUrl} target="_blank" rel="noreferrer" className="text-violet-200 hover:text-white">Official page ↗</a>{t.previewUrl&&<button onClick={()=>setPlaying(playing===t.previewUrl?"":t.previewUrl!)} className="text-cyan-200 hover:text-white">{playing===t.previewUrl?"Pause preview":"Play preview"}</button>}</div></div></div>)}</div>}
        {playing && <audio key={playing} src={playing} controls autoPlay onEnded={()=>setPlaying("")} className="mt-5 w-full"/>}
        <p className="mt-5 text-[11px] leading-5 text-slate-500">Music search uses Apple’s public catalogue API. Full-track downloads are not provided; use official services or artist-authorized download links.</p>
      </div>
    </section>

    <section id="how" className="relative z-10 mx-auto max-w-7xl px-5 pb-20 md:px-8">
      <div className="mb-8 text-center"><p className="text-xs font-semibold tracking-[.2em] text-violet-300">MADE TO FEEL EFFORTLESS</p><h2 className="mt-3 text-3xl font-semibold">A cleaner way to work with media</h2></div>
      <div className="grid gap-4 md:grid-cols-3">{[{n:"01",icon:<Link2 size={20}/>,title:"Paste a link",desc:"Start with a supported social video URL. Provider integration enables available formats."},{n:"02",icon:<FileVideo size={20}/>,title:"Extract locally",desc:"Choose a video and export its audio in your browser without uploading the file."},{n:"03",icon:<Headphones size={20}/>,title:"Discover music",desc:"Search artists and tracks, play previews, and follow official music pages."}].map(x=><div key={x.n} className="glass rounded-2xl p-6"><div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200">{x.icon}</span><span className="text-xs text-slate-600">{x.n}</span></div><h3 className="mt-5 text-lg font-semibold">{x.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{x.desc}</p></div>)}</div>
    </section>
    <footer className="relative z-10 border-t border-white/[0.07]"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-xs text-slate-500 md:flex-row md:px-8"><a href="#" className="brand text-sm font-bold text-slate-200">sonic<span className="text-violet-300">flow</span></a><span>Made for creators. Respect creators.</span><span>© {new Date().getFullYear()} SonicFlow</span></div></footer>
  </main>;
}