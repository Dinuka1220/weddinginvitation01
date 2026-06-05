import React, { useState, useEffect, useMemo } from 'react';

/* ── helpers ── */
async function fetchRSVPs() {
  const response = await fetch('/api/rsvps');
  if (!response.ok) {
    throw new Error('Failed to fetch RSVPs');
  }
  return await response.json();
}

async function deleteRSVPs() {
  const response = await fetch('/api/rsvps', {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to clear RSVPs');
  }
  return await response.json();
}
function toCSV(data) {
  const header = ['ID', 'Name', 'Side', 'Phone', 'Message', 'Attendance', 'Submitted At'];
  const rows = data.map(r => [
    r.id,
    `"${r.name}"`,
    r.side === 'bride' ? "Bride's Side" : "Groom's Side",
    `"${r.phone}"`,
    `"${(r.message || '').replace(/"/g, '""')}"`,
    r.attendance === 'yes' ? 'Attending' : 'Declining',
    new Date(r.timestamp).toLocaleString(),
  ]);
  return [header, ...rows].map(r => r.join(',')).join('\n');
}
function downloadCSV(data) {
  const blob = new Blob([toCSV(data)], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wedding-rsvp-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── stat card ── */
function StatCard({ label, value, color, icon }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2 shadow-sm border"
      style={{ background: '#FFFDF9', borderColor: 'rgba(216,155,132,.2)' }}
    >
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] uppercase tracking-widest text-[#3E2723]/50">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <span className="font-serif text-3xl font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

const ADMIN_PIN = '2407';

export default function AdminPanel() {
  const [pin,         setPin]       = useState('');
  const [loggedIn,    setLoggedIn]  = useState(false);
  const [pinError,    setPinError]  = useState('');
  const [data,        setData]      = useState([]);
  const [filter,      setFilter]    = useState('all');   // all | attending | declining | bride | groom
  const [search,      setSearch]    = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const [refreshKey,  setRefreshKey] = useState(0);
  const [loading,     setLoading]   = useState(false);
  const [error,       setError]     = useState('');

  useEffect(() => {
    if (loggedIn) {
      const loadData = async () => {
        setLoading(true);
        setError('');
        try {
          const res = await fetchRSVPs();
          setData(res);
        } catch (err) {
          console.error(err);
          setError('Failed to load RSVP data. Please check MongoDB connection.');
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [loggedIn, refreshKey]);

  const handleClearAll = async () => {
    setLoading(true);
    setError('');
    try {
      await deleteRSVPs();
      setData([]);
      setConfirmClear(false);
    } catch (err) {
      console.error(err);
      setError('Failed to delete RSVP data from MongoDB.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) { setLoggedIn(true); setPinError(''); }
    else { setPinError('Incorrect PIN. Please try again.'); setPin(''); }
  };

  const filtered = useMemo(() => {
    let d = [...data];
    if (filter === 'attending')  d = d.filter(r => r.attendance === 'yes');
    if (filter === 'declining')  d = d.filter(r => r.attendance === 'no');
    if (filter === 'bride')      d = d.filter(r => r.side === 'bride');
    if (filter === 'groom')      d = d.filter(r => r.side === 'groom');
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(r => r.name.toLowerCase().includes(q) || r.phone.includes(q));
    }
    return d;
  }, [data, filter, search]);

  const stats = useMemo(() => ({
    total:     data.length,
    attending: data.filter(r => r.attendance === 'yes').length,
    declining: data.filter(r => r.attendance === 'no').length,
    bride:     data.filter(r => r.side === 'bride').length,
    groom:     data.filter(r => r.side === 'groom').length,
  }), [data]);

  /* ── login screen ── */
  if (!loggedIn) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ background: 'linear-gradient(135deg, #FAF3F0 0%, #F0E0D8 100%)' }}
      >
        {/* Decorative rings */}
        <div className="absolute w-80 h-80 rounded-full border border-[#D89B84]/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-60 h-60 rounded-full border border-[#D89B84]/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <form
          onSubmit={handleLogin}
          className="relative w-full max-w-xs mx-4 rounded-3xl p-8 shadow-xl border"
          style={{ background: '#FFFDF9', borderColor: 'rgba(216,155,132,.25)' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ background: 'radial-gradient(circle at 35% 35%, #E8C4A0, #B88050, #8B5E35)' }}
            >
              <svg viewBox="0 0 60 60" className="w-9 h-9">
                <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(255,253,249,.3)" strokeWidth="1.5"/>
                <text x="30" y="28" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="10" fill="#FFFDF9" fontWeight="700">A</text>
                <text x="30" y="40" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="10" fill="#FFFDF9" fontWeight="700">Y</text>
              </svg>
            </div>
            <h1 className="font-serif text-xl font-semibold text-[#3E2723]">Admin Panel</h1>
            <p className="font-sans text-xs text-[#3E2723]/50 mt-1 tracking-wide">Yashara & Anuruddha · 24.07.2026</p>
          </div>

          <label className="block font-sans text-[10px] uppercase tracking-widest text-[#3E2723]/50 mb-2">
            Enter PIN
          </label>
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={e => { setPin(e.target.value); setPinError(''); }}
            placeholder="• • • •"
            className="w-full bg-[#FAF3F0] rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] outline-none border-2 border-[#E8D5C8] focus:border-[#D89B84] transition-colors"
            autoFocus
          />
          {pinError && (
            <p className="text-red-400 text-[10px] text-center mt-2">{pinError}</p>
          )}
          <button
            type="submit"
            className="w-full mt-5 py-3.5 rounded-2xl font-sans text-sm font-bold uppercase tracking-widest text-white shadow-md transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg, #D89B84, #A46752)' }}
          >
            Unlock
          </button>
          <p className="font-sans text-[9px] text-center text-[#3E2723]/30 mt-4 tracking-wider">
            Default PIN: 2407
          </p>
        </form>
      </div>
    );
  }

  /* ── dashboard ── */
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: '#FAF3F0', fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 px-4 md:px-8 py-4 flex items-center justify-between border-b shadow-sm"
        style={{ background: '#FFFDF9', borderColor: 'rgba(216,155,132,.2)' }}
      >
        <div>
          <h1 className="font-serif text-lg font-semibold text-[#3E2723]">RSVP Dashboard</h1>
          <p className="font-sans text-[10px] text-[#3E2723]/40 tracking-wider">Yashara & Anuruddha · July 24, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="p-2.5 rounded-xl border transition-all hover:bg-[#FAF3F0] active:scale-95"
            style={{ borderColor: 'rgba(216,155,132,.3)' }}
            title="Refresh"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#A46752]">
              <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
          <button
            onClick={() => downloadCSV(data)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-transform active:scale-95"
            style={{ background: 'linear-gradient(135deg, #D89B84, #A46752)' }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => setLoggedIn(false)}
            className="p-2.5 rounded-xl border transition-all hover:bg-[#FAF3F0] active:scale-95"
            style={{ borderColor: 'rgba(216,155,132,.3)' }}
            title="Log out"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#A46752]">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-sans">
            <span>{error}</span>
            <button onClick={() => setError('')} className="font-bold hover:opacity-80">✕</button>
          </div>
        )}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center justify-center py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-[#D89B84]/20 text-[#A46752] text-xs font-sans">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[#A46752]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Synchronizing with MongoDB...</span>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard label="Total RSVPs"  value={stats.total}     color="#A46752" icon="📋" />
          <StatCard label="Attending"    value={stats.attending} color="#4CAF50" icon="✅" />
          <StatCard label="Declining"    value={stats.declining} color="#F44336" icon="❌" />
          <StatCard label="Bride's Side" value={stats.bride}     color="#E91E8C" icon="👰" />
          <StatCard label="Groom's Side" value={stats.groom}     color="#1976D2" icon="🤵" />
        </div>

        {/* ── Filters & search ── */}
        <div
          className="rounded-2xl p-5 border space-y-4"
          style={{ background: '#FFFDF9', borderColor: 'rgba(216,155,132,.2)' }}
        >
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all',       label: `All (${data.length})` },
              { key: 'attending', label: `Attending (${stats.attending})` },
              { key: 'declining', label: `Declining (${stats.declining})` },
              { key: 'bride',     label: `Bride's Side (${stats.bride})` },
              { key: 'groom',     label: `Groom's Side (${stats.groom})` },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  background: filter === f.key ? 'linear-gradient(135deg, #D89B84, #A46752)' : '#FAF3F0',
                  color:      filter === f.key ? '#fff' : '#A46752',
                  boxShadow:  filter === f.key ? '0 2px 10px rgba(164,103,82,.25)' : 'none',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search + actions row */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex-1 min-w-[180px] relative">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 fill-[#A46752]/50">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" fill="none" strokeWidth="2"/>
              </svg>
              <input
                type="text"
                placeholder="Search by name or phone…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#FAF3F0] rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none border-2 border-[#E8D5C8] focus:border-[#D89B84] transition-colors"
              />
            </div>
            {/* Mobile CSV export */}
            <button
              onClick={() => downloadCSV(data)}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #D89B84, #A46752)' }}
            >
              CSV
            </button>
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all hover:bg-red-50"
              style={{ borderColor: '#FFCDD2', color: '#F44336' }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4zm-3 5v10H8V9h8zm2-2H7v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V7z"/>
              </svg>
              Clear All
            </button>
          </div>
        </div>

        {/* ── Submissions table ── */}
        <div
          className="rounded-2xl border overflow-hidden shadow-sm"
          style={{ borderColor: 'rgba(216,155,132,.2)' }}
        >
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-[#D89B84] mb-2">No responses yet</p>
              <p className="font-sans text-xs text-[#3E2723]/40">
                {data.length > 0 ? 'No results match your filter.' : 'RSVP submissions will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #F5E8E4, #FAF3F0)' }}>
                    {['Name', 'Side', 'Phone', 'Message', 'Attendance', 'Date', ''].map((h, index) => (
                      <th
                        key={index}
                        className="px-4 py-3.5 text-left font-sans text-[9px] uppercase tracking-widest text-[#3E2723]/50 font-semibold"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{ background: i % 2 === 0 ? '#FFFDF9' : '#FAF3F0' }}
                      className="border-t transition-colors hover:bg-[#F5E8E4]/50"
                      onMouseEnter={e => e.currentTarget.style.background = '#F5E8E4'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#FFFDF9' : '#FAF3F0'}
                    >
                      <td className="px-4 py-3 font-sans font-semibold text-[#3E2723] text-xs whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                          style={{
                            background: row.side === 'bride' ? 'rgba(233,30,140,.1)' : 'rgba(25,118,210,.1)',
                            color:      row.side === 'bride' ? '#C2185B' : '#1565C0',
                          }}
                        >
                          {row.side === 'bride' ? "Bride's" : "Groom's"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-[#3E2723]/70 whitespace-nowrap">
                        {row.phone}
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-[#3E2723]/55 max-w-[180px] truncate">
                        {row.message || <span className="italic opacity-50">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                          style={{
                            background: row.attendance === 'yes' ? 'rgba(76,175,80,.12)' : 'rgba(244,67,54,.12)',
                            color:      row.attendance === 'yes' ? '#2E7D32' : '#C62828',
                          }}
                        >
                          {row.attendance === 'yes' ? 'Attending' : 'Declining'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans text-xs text-[#3E2723]/40 whitespace-nowrap">
                        {new Date(row.timestamp).toLocaleString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={async () => {
                            if (window.confirm(`Are you sure you want to delete ${row.name}'s RSVP?`)) {
                              setLoading(true);
                              setError('');
                              try {
                                const res = await fetch(`/api/rsvps/${row.id}`, { method: 'DELETE' });
                                if (!res.ok) throw new Error();
                                setData(prev => prev.filter(r => r.id !== row.id));
                              } catch (err) {
                                setError('Failed to delete RSVP.');
                              } finally {
                                setLoading(false);
                              }
                            }
                          }}
                          className="p-1 rounded text-red-500 hover:bg-red-50 active:scale-95 transition-all inline-block"
                          title="Delete RSVP"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <p className="text-center font-sans text-[10px] text-[#3E2723]/30 tracking-widest pb-4">
          Yashara & Anuruddha Wedding · Admin Panel · {new Date().getFullYear()}
        </p>
      </main>

      {/* ── Confirm clear dialog ── */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-3xl p-8 shadow-2xl border text-center"
            style={{ background: '#FFFDF9', borderColor: 'rgba(216,155,132,.25)' }}
          >
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="font-serif text-xl font-semibold text-[#3E2723] mb-2">Clear All Data?</h3>
            <p className="font-sans text-sm text-[#3E2723]/60 mb-6 leading-relaxed">
              This will permanently delete all <strong>{data.length}</strong> RSVP responses. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-3 rounded-2xl text-sm font-bold border-2 transition-all hover:bg-[#FAF3F0]"
                style={{ borderColor: 'rgba(216,155,132,.3)', color: '#A46752' }}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 py-3 rounded-2xl text-sm font-bold text-white shadow-md transition-transform active:scale-95"
                style={{ background: 'linear-gradient(135deg, #F44336, #C62828)' }}
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
