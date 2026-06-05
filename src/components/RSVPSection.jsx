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

export default function RSVPSection() {
  const [step, setStep]         = useState('form'); // 'form' | 'success'
  const [side, setSide]         = useState('');      // 'bride' | 'groom'
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [message, setMessage]   = useState('');
  const [attendance, setAttend] = useState('');      // 'yes' | 'no'
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!side)         e.side     = 'Please select which side you are from';
    if (!name.trim())  e.name     = 'Please enter your full name';
    if (!phone.trim()) e.phone    = 'Please enter your phone number';
    if (!attendance)   e.attend   = 'Please let us know if you will attend';
    return e;
  };

  const handleSubmit = async (chosen) => {
    const finalAttend = chosen ?? attendance;
    const e = validate();
    // attendance is set via button click so re-check
    const finalErrors = { ...e };
    if (!finalAttend) finalErrors.attend = 'Please let us know if you will attend';
    else delete finalErrors.attend;
    if (Object.keys(finalErrors).length) { setErrors(finalErrors); return; }

    const entry = {
      id: Date.now(),
      side,
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      attendance: finalAttend,
      timestamp: new Date().toISOString(),
    };

    try {
      setErrors(p => ({ ...p, submit: '' }));
      await saveRSVP(entry);
      setStep('success');

      if (finalAttend === 'yes') {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.55 },
          colors: ['#D89B84', '#EEC9B9', '#C4877B', '#FFFDF9', '#A46752'] });
        setTimeout(() => confetti({ particleCount: 80, spread: 60, angle: 60,  origin: { x: 0, y: 0.6 },
          colors: ['#D89B84', '#EEC9B9', '#A46752'] }), 300);
        setTimeout(() => confetti({ particleCount: 80, spread: 60, angle: 120, origin: { x: 1, y: 0.6 },
          colors: ['#D89B84', '#EEC9B9', '#A46752'] }), 400);
      }
    } catch (err) {
      console.error(err);
      setErrors(p => ({ ...p, submit: 'Failed to submit RSVP. Please verify database connection and try again.' }));
    }
  };

  const inputClass = (err) =>
    `w-full bg-white rounded-xl px-4 py-3.5 text-sm outline-none border-2 transition-colors font-sans
     ${err ? 'border-red-300 focus:border-red-400' : 'border-[#E8D5C8] focus:border-[#D89B84]'}`;

  return (
    <section
      id="rsvp"
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: '#FFFDF9' }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <FloralAccent className="w-80 h-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#D89B84] mb-3">
            Join Us
          </p>
          <h2
            className="font-serif font-bold"
            style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', color: '#3E2723' }}
          >
            RSVP
          </h2>
          <p className="font-sans text-sm text-[#A46752] mt-2">
            Please let us know if you can join our celebration
          </p>
          <BranchDivider className="w-48 mx-auto mt-5" />
        </div>

        {step === 'form' ? (
          <div className="space-y-5">
            {/* Side selector */}
            <div>
              <p className="font-sans text-xs font-semibold text-[#3E2723]/70 mb-2">
                Which side are you from? <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setSide('bride'); setErrors(p => ({ ...p, side: '' })); }}
                  className="py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95"
                  style={{
                    background: side === 'bride' ? 'linear-gradient(135deg, #E91E8C, #F06292)' : '#F0F0F0',
                    color: side === 'bride' ? '#fff' : '#888',
                    boxShadow: side === 'bride' ? '0 4px 16px rgba(233,30,140,.3)' : 'none',
                  }}
                >
                  Bride's Side (Yashara)
                </button>
                <button
                  type="button"
                  onClick={() => { setSide('groom'); setErrors(p => ({ ...p, side: '' })); }}
                  className="py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95"
                  style={{
                    background: side === 'groom' ? 'linear-gradient(135deg, #1976D2, #64B5F6)' : '#F0F0F0',
                    color: side === 'groom' ? '#fff' : '#888',
                    boxShadow: side === 'groom' ? '0 4px 16px rgba(25,118,210,.3)' : 'none',
                  }}
                >
                  Groom's Side (Anuruddha)
                </button>
              </div>
              {errors.side && <p className="text-red-400 text-[10px] mt-1">{errors.side}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block font-sans text-xs font-semibold text-[#3E2723]/70 mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                placeholder="Enter your first & last name"
                className={inputClass(errors.name)}
              />
              {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block font-sans text-xs font-semibold text-[#3E2723]/70 mb-1.5">
                Telephone / WhatsApp No <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })); }}
                placeholder="+94 77 123 4567"
                className={inputClass(errors.phone)}
              />
              {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block font-sans text-xs font-semibold text-[#3E2723]/70 mb-1.5">
                Message for the couple{' '}
                <span className="font-normal text-[#3E2723]/40">(Optional)</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Share your wishes or any special requests…"
                className="w-full bg-white rounded-xl px-4 py-3.5 text-sm outline-none border-2 border-[#E8D5C8] focus:border-[#D89B84] transition-colors resize-none font-sans"
              />
            </div>

            {/* Attendance buttons */}
            <div>
              <p className="font-sans text-xs font-semibold text-[#3E2723]/70 mb-2">
                Will you attend? <span className="text-red-400">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAttend('yes');
                    setErrors(p => ({ ...p, attend: '' }));
                    handleSubmit('yes');
                  }}
                  className="py-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                    boxShadow: '0 4px 16px rgba(76,175,80,.35)',
                  }}
                >
                  Yes, I'll be there!
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttend('no');
                    setErrors(p => ({ ...p, attend: '' }));
                    handleSubmit('no');
                  }}
                  className="py-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 active:scale-95 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #F44336, #EF5350)',
                    boxShadow: '0 4px 16px rgba(244,67,54,.35)',
                  }}
                >
                  Sorry, I can't attend
                </button>
              </div>
              {errors.attend && <p className="text-red-400 text-[10px] mt-1">{errors.attend}</p>}
              {errors.submit && <p className="text-red-500 text-xs font-semibold text-center mt-3">{errors.submit}</p>}
            </div>
          </div>
        ) : (
          /* ── SUCCESS ── */
          <div className="text-center py-12 flex flex-col items-center">
            <FloralAccent className="w-24 h-24 mb-4 animate-float" />
            <h3
              className="font-cursive text-5xl mb-3"
              style={{ fontFamily: "'Alex Brush', cursive", color: '#A46752' }}
            >
              {attendance === 'yes' ? 'See you there!' : "We'll miss you!"}
            </h3>
            <BranchDivider className="w-44 mx-auto mb-5" />
            <p className="font-serif text-sm italic text-[#3E2723]/70 max-w-xs leading-relaxed">
              {attendance === 'yes'
                ? `Thank you, ${name}! We can't wait to celebrate with you on July 24th. Your presence means everything to us.`
                : `Thank you, ${name}. We understand and appreciate you letting us know. You'll be in our hearts on our special day.`}
            </p>
            <p
              className="font-cursive text-3xl text-[#D89B84] mt-6"
              style={{ fontFamily: "'Alex Brush', cursive" }}
            >
              Yashara & Anuruddha
            </p>
            <button
              onClick={() => setStep('form')}
              className="mt-6 px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-md transition-transform active:scale-95"
              style={{ background: 'linear-gradient(135deg, #D89B84, #A46752)' }}
            >
              Submit Another Response
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
