import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BranchDivider, FloralAccent } from './FloralSVG';

/* Persist to MongoDB */
async function saveRSVP(entry) {
  const response = await fetch('/api/rsvps', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(entry),
  });
  if (!response.ok) {
    throw new Error('Failed to save RSVP');
  }
  return await response.json();
}

export default function RSVPModal({ onClose }) {
  const [step,       setStep]      = useState('form'); // 'form' | 'success'
  const [side,       setSide]      = useState('');
  const [attendance, setAttendance] = useState('yes');
  const [name,       setName]      = useState('');
  const [phone,      setPhone]     = useState('');
  const [guests,     setGuests]    = useState('1');
  const [notes,      setNotes]     = useState('');
  const [errors,     setErrors]    = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim())  e.name  = 'Please enter your full name';
    if (!phone.trim()) e.phone = 'Please enter your phone number';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const entry = {
      id: Date.now(),
      side: side || 'unspecified',
      name: name.trim(),
      phone: phone.trim(),
      message: notes.trim(),
      attendance,
      guests: attendance === 'yes' ? guests : '0',
      timestamp: new Date().toISOString(),
    };

    try {
      setErrors(p => ({ ...p, submit: '' }));
      await saveRSVP(entry);
      setStep('success');

      if (attendance === 'yes') {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 },
          colors: ['#D89B84', '#EEC9B9', '#C4877B', '#FFFDF9', '#A46752'] });
        setTimeout(() => confetti({ particleCount: 80, spread: 60, angle: 60, origin: { x: 0, y: 0.6 },
          colors: ['#D89B84', '#EEC9B9', '#A46752'] }), 300);
        setTimeout(() => confetti({ particleCount: 80, spread: 60, angle: 120, origin: { x: 1, y: 0.6 },
          colors: ['#D89B84', '#EEC9B9', '#A46752'] }), 400);
      }
    } catch (err) {
      console.error(err);
      setErrors(p => ({ ...p, submit: 'Failed to submit RSVP. Please verify database connection and try again.' }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4">
      <div
        className="relative w-full md:max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden"
        style={{ background: '#FAF3F0', maxHeight: '95vh', overflowY: 'auto' }}
      >
        {/* Floral decoration top */}
        <div className="flex justify-center pt-6 pb-2">
          <FloralAccent className="w-20 h-20 animate-float" />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blush/20 flex items-center justify-center z-10"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#A46752" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="px-6 pb-8">
          {step === 'form' ? (
            <>
              {/* Title */}
              <div className="text-center mb-5">
                <h2
                  className="font-cursive text-4xl text-blush-dark"
                  style={{ fontFamily: "'Alex Brush', cursive" }}
                >
                  Confirm Attendance
                </h2>
                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-blush mt-1">
                  Please respond by July 10, 2026
                </p>
                <BranchDivider className="w-44 mx-auto mt-3" />
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Side selector */}
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-brown-deep/60 mb-2">
                    Which side are you from?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'bride', label: "Bride's Side" },
                      { val: 'groom', label: "Groom's Side" },
                    ].map(({ val, label }) => (
                      <button
                        key={val} type="button"
                        onClick={() => setSide(val)}
                        className="py-2.5 rounded-xl text-xs font-bold tracking-wide border-2 transition-all duration-200"
                        style={{
                          background: side === val
                            ? val === 'bride'
                              ? 'linear-gradient(135deg, #E91E8C, #F06292)'
                              : 'linear-gradient(135deg, #1976D2, #64B5F6)'
                            : '#F5F5F5',
                          color: side === val ? '#fff' : '#888',
                          borderColor: side === val
                            ? val === 'bride' ? '#E91E8C' : '#1976D2'
                            : 'transparent',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attendance toggle */}
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-brown-deep/60 mb-2">
                    Will you attend? *
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'yes', label: 'Gladly Attend' },
                      { val: 'no',  label: 'Regretfully Decline' },
                    ].map(({ val, label }) => (
                      <button
                        key={val} type="button"
                        onClick={() => setAttendance(val)}
                        className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all duration-200
                          ${attendance === val
                            ? val === 'yes'
                              ? 'bg-blush/20 border-blush text-blush-dark shadow-sm'
                              : 'bg-rose-100/40 border-rose-400/60 text-rose-700 shadow-sm'
                            : 'bg-white border-blush/20 text-brown-deep/50 hover:bg-blush/5'
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="rsvp-name" className="block font-sans text-[9px] uppercase tracking-[0.18em] text-brown-deep/60 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="rsvp-name" type="text"
                    value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                    placeholder="Your complete name"
                    className={`w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border-2 transition-colors
                      ${errors.name ? 'border-red-300' : 'border-blush/20 focus:border-blush'}`}
                  />
                  {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="rsvp-phone" className="block font-sans text-[9px] uppercase tracking-[0.18em] text-brown-deep/60 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="rsvp-phone" type="tel"
                    value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                    placeholder="+94 77 000 0000"
                    className={`w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border-2 transition-colors
                      ${errors.phone ? 'border-red-300' : 'border-blush/20 focus:border-blush'}`}
                  />
                  {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
                </div>

                {/* Guests (only if attending) */}
                {attendance === 'yes' && (
                  <div>
                    <label htmlFor="rsvp-guests" className="block font-sans text-[9px] uppercase tracking-[0.18em] text-brown-deep/60 mb-1">
                      Number of Guests
                    </label>
                    <select
                      id="rsvp-guests"
                      value={guests} onChange={e => setGuests(e.target.value)}
                      className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border-2 border-blush/20 focus:border-blush transition-colors"
                    >
                      {['1','2','3','4','5'].map(n => (
                        <option key={n} value={n}>{n} {n === '1' ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label htmlFor="rsvp-notes" className="block font-sans text-[9px] uppercase tracking-[0.18em] text-brown-deep/60 mb-1">
                    Special Notes / Message
                  </label>
                  <textarea
                    id="rsvp-notes" rows={3}
                    value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Dietary needs, a kind message…"
                    className="w-full bg-white rounded-xl px-4 py-3 text-sm outline-none border-2 border-blush/20 focus:border-blush transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                {errors.submit && <p className="text-red-500 text-xs font-semibold text-center mb-2">{errors.submit}</p>}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl font-sans text-sm font-bold uppercase tracking-widest text-white transition-transform active:scale-95 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #D89B84, #A46752)' }}
                >
                  Confirm Attendance
                </button>
              </form>
            </>
          ) : (
            /* ── SUCCESS STATE ── */
            <div className="text-center py-8 flex flex-col items-center animate-fade-in-up">
              <FloralAccent className="w-24 h-24 mb-4 animate-float" />
              <h3
                className="font-cursive text-4xl text-blush-dark mb-3"
                style={{ fontFamily: "'Alex Brush', cursive" }}
              >
                {attendance === 'yes' ? 'See you there!' : "We'll miss you!"}
              </h3>
              <BranchDivider className="w-40 mx-auto mb-4" />
              <p className="font-serif text-sm italic text-brown-deep/70 max-w-xs leading-relaxed">
                {attendance === 'yes'
                  ? `Thank you, ${name}! We can't wait to celebrate with you on July 24th. Your presence means everything to us.`
                  : `Thank you, ${name}. We understand and appreciate you letting us know. You'll be in our hearts on our special day.`
                }
              </p>
              <p
                className="font-cursive text-2xl text-blush mt-6"
                style={{ fontFamily: "'Alex Brush', cursive" }}
              >
                Yashara &amp; Anuruddha
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow"
                style={{ background: 'linear-gradient(135deg, #D89B84, #A46752)' }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
