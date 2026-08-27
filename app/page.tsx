'use client';

import { useEffect, useRef, useState } from 'react';

type Question = { chapter: string; eyebrow: string; question: string; options: string[]; answer: number; wrong: string };

const questions: Question[] = [
  { chapter: 'The beginning', eyebrow: 'Origin story', question: 'How did Amber and Fabian first meet?', options: ['At church', 'Through mutual friends', 'At a party', 'On an app'], answer: 0, wrong: 'Not quite—that would be a different meet-cute. Try again!' },
  { chapter: 'First impressions', eyebrow: 'She noticed', question: 'What was the first thing Amber noticed about Fabian?', options: ['His smile', 'His kindness', 'His sense of humor', 'His style'], answer: 2, wrong: 'A good guess… but Amber remembers it differently 😂' },
  { chapter: 'Date number one', eyebrow: 'Where it began', question: 'Where did Amber and Fabian go on their very first date?', options: ['Coffee shop', 'Bowling Alley', 'Movie theater', 'Ice cream + walk'], answer: 1, wrong: 'Cute idea, wrong memory. Take another swing!' },
  { chapter: 'The big yes', eyebrow: 'Officially official', question: 'What year did Amber and Fabian get married?', options: ['2018', '2019', '2015', '2013'], answer: 2, wrong: 'Careful—this one belongs in the family history books!' },
  { chapter: 'Opposites attract', eyebrow: 'Fabian’s favorite', question: 'Which of these is something Fabian LOVES that Amber does not?', options: ['Loose-leaf tea', 'Salads', 'Chinese entertainment', 'Spicy food'], answer: 2, wrong: 'Nope! Apparently love does have its limits 😄' },
  { chapter: 'Bukata files', eyebrow: 'Current obsession', question: 'What is Bukata’s obsession right now?', options: ['Animals', 'Pretend cooking', 'Pouring activities', 'Books'], answer: 3, wrong: 'A reasonable guess, but the tiny expert says otherwise!' },
  { chapter: 'Adulting unlocked', eyebrow: 'A major milestone', question: 'Which milestone made Amber and Fabian feel like “real adults”?', options: ['Surviving sleep training', 'First family vacation', 'Setting up baby gates', 'Buying a second stroller'], answer: 2, wrong: 'Not the moment that made it official—try again!' },
  { chapter: 'A very special day', eyebrow: 'Never forget', question: 'What is their daughter’s birthday?', options: ['October 15', 'November 1', 'December 3', 'September 28'], answer: 1, wrong: 'Ooooh, so close to being in trouble 😂 Try again!' },
  { chapter: 'Family favorites', eyebrow: 'Perfect weekend', question: 'Which weekend activity is the family’s favorite way to spend time together?', options: ['Park playtime', 'Coffee + pastries outing', 'Visiting animals', 'Backyard painting and crafts'], answer: 0, wrong: 'That sounds fun—but it isn’t the family favorite!' },
];

const confetti = Array.from({ length: 30 }, (_, i) => ({ left: `${(i * 37) % 100}%`, delay: `${(i % 8) * .08}s`, color: ['#f58ca5', '#ffcad6', '#fff1cf', '#ca9ce1'][i % 4] }));

export default function Home() {
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'reveal'>('welcome');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [revealed, setRevealed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const q = questions[index];

  useEffect(() => {
    if (status !== 'wrong') return;
    const timer = window.setTimeout(() => setStatus('idle'), 650);
    return () => window.clearTimeout(timer);
  }, [status]);

  function choose(optionIndex: number) {
    if (status === 'correct') return;
    setSelected(optionIndex);
    setStatus(optionIndex === q.answer ? 'correct' : 'wrong');
  }

  function continueGame() {
    if (index === questions.length - 1) {
      setScreen('reveal');
      return;
    }
    setIndex((current) => current + 1);
    setSelected(null);
    setStatus('idle');
  }

  function openReveal() {
    setRevealed(true);
    window.setTimeout(() => videoRef.current?.play().catch(() => undefined), 350);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#170d16] text-[#fff8f1]">
      <div className="aurora aurora-one" /><div className="aurora aurora-two" /><div className="grain" />
      <nav className="relative z-20 flex items-center justify-between px-5 py-5 md:px-12 md:py-6">
        <button className="brand" onClick={() => setScreen('welcome')} aria-label="Return to welcome screen"><span>A+F</span> Private archive</button>
        <span className="archive-pill">{screen === 'quiz' ? `${index + 1} of ${questions.length} unlocked` : 'Est. forever'}</span>
      </nav>

      {screen === 'welcome' && (
        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-78px)] max-w-6xl items-center px-6 pb-16 md:px-12">
          <div className="grid w-full items-end gap-12 md:grid-cols-[1.15fr_.85fr]">
            <div className="max-w-3xl animate-rise">
              <p className="eyebrow">For one very important person</p>
              <h1 className="hero-title">The Amber<br /><span>&amp; Fabian</span><br />Archives</h1>
              <p className="hero-copy">Every love story leaves clues. Remember nine moments, unlock every chapter, and discover what’s waiting at the end.</p>
              <button className="primary-button mt-9" onClick={() => setScreen('quiz')}>Begin the story <span aria-hidden="true">→</span></button>
            </div>
            <div className="archive-card hidden rotate-2 md:flex">
              <span className="card-number">09</span>
              <div><p className="micro-label">Case file</p><h2 className="font-display mt-3 text-5xl leading-none">One more<br />chapter</h2></div>
              <div className="flex items-end justify-between"><p className="max-w-[180px] text-xs leading-5 text-white/45">Authorized access requires an excellent memory.</p><span className="text-3xl">♡</span></div>
            </div>
          </div>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-78px)] max-w-3xl items-center px-5 pb-14 md:px-8">
          <div className="w-full animate-rise" key={index}>
            <div className="mb-5 flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-rose-100/45"><span>Chapter {String(index + 1).padStart(2, '0')} · {q.chapter}</span><span>{Math.round(((index + 1) / questions.length) * 100)}%</span></div>
            <div className="progress-track"><div className="progress-value" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
            <div className={`question-card mt-6 ${status === 'wrong' ? 'shake' : ''}`}>
              <span className="ghost-number">{String(index + 1).padStart(2, '0')}</span>
              <p className="eyebrow mb-0">{q.eyebrow}</p>
              <h2 className="font-display relative mt-4 max-w-2xl text-[clamp(2.15rem,6vw,4rem)] leading-[1.04] tracking-[-0.035em]">{q.question}</h2>
              <div className="relative mt-8 grid gap-3 sm:grid-cols-2">
                {q.options.map((option, optionIndex) => {
                  const isCorrect = status === 'correct' && optionIndex === q.answer;
                  const isWrong = selected === optionIndex && status === 'wrong';
                  return <button key={option} className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`} onClick={() => choose(optionIndex)}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}{isCorrect && <b>✓</b>}</button>;
                })}
              </div>
              <div className="relative mt-5 min-h-16" aria-live="polite">
                {status === 'idle' && <p className="hint">Choose wisely. Unlimited guesses are allowed.</p>}
                {status === 'wrong' && <p className="feedback wrong-copy">✕ {q.wrong}</p>}
                {status === 'correct' && <div className="correct-row"><p className="feedback correct-copy">✓ Correct—chapter unlocked!</p><button className="continue-button" onClick={continueGame}>{index === questions.length - 1 ? 'Open final archive' : 'Next chapter'} →</button></div>}
              </div>
            </div>
          </div>
        </section>
      )}

      {screen === 'reveal' && (
        <section className="relative z-10 mx-auto min-h-[calc(100vh-78px)] max-w-6xl px-5 pb-16 pt-6 md:px-12">
          {!revealed ? (
            <div className="mx-auto flex max-w-3xl flex-col items-center py-[10vh] text-center animate-rise">
              <div className="seal">♡</div><p className="eyebrow mt-7">Archive complete</p>
              <h1 className="font-display mt-4 text-[clamp(3.7rem,9vw,7.5rem)] leading-[.88] tracking-[-0.06em]">You unlocked<br /><span className="italic text-[#ffcad6]">one more chapter.</span></h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-white/55">Some stories don’t end. They make room for something beautifully new.</p>
              <button className="primary-button mt-9" onClick={openReveal}>Reveal the surprise <span aria-hidden="true">♡</span></button>
            </div>
          ) : (
            <div className="reveal-grid animate-reveal">
              <div className="reveal-copy">
                <p className="eyebrow">Our family is growing</p>
                <h1 className="font-display mt-3 text-[clamp(4.5rem,10vw,8rem)] leading-[.82] tracking-[-0.065em]">Baby<br /><span className="italic text-[#ffcad6]">on board.</span></h1>
                <p className="mt-7 max-w-md text-lg leading-8 text-white/65">The next chapter of the Amber &amp; Fabian story is already being written. We can’t wait to meet you, little one. ♡</p>
              </div>
              <div className="media-stack">
                <video ref={videoRef} className="reveal-video" src="/reveal.mp4" controls playsInline preload="metadata" />
                <div className="ultrasound-frame"><img src="/ultrasound.jpg" alt="Ultrasound photograph revealing the new baby" /></div>
              </div>
              <div className="confetti" aria-hidden="true">{confetti.map((piece, i) => <i key={i} style={{ left: piece.left, animationDelay: piece.delay, background: piece.color }} />)}</div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
