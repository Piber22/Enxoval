document.addEventListener('DOMContentLoaded', () => {

  /* ── ENV PARTICLES ── */
  const pCont = document.querySelector('.env-particles');
  const pColors = ['#00d4ff','#0080aa','#c8667a','#c9a96e','#80c0e8'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'env-p';
    p.style.cssText = `
      left:${Math.random()*100}%;
      width:${3+Math.random()*5}px;height:${3+Math.random()*5}px;
      background:${pColors[Math.floor(Math.random()*pColors.length)]};
      --d:${4+Math.random()*6}s;--dl:${Math.random()*5}s;
    `;
    pCont.appendChild(p);
  }

  /* ── ENVELOPE OPEN ── */
  const envWrap = document.querySelector('.env-wrap');
  const envScreen = document.getElementById('envelope-screen');
  const main = document.getElementById('main-content');
  let opened = false;

  function openEnv() {
    if (opened) return;
    opened = true;
    envWrap.classList.add('opening');
    setTimeout(() => {
      envScreen.style.transition = 'opacity 1.2s ease';
      envScreen.style.opacity = '0';
      main.classList.add('visible');
    }, 1900);
    setTimeout(() => {
      envScreen.style.display = 'none';
      fireConfetti();
    }, 3100);
  }

  envWrap.addEventListener('click', openEnv);
  envWrap.addEventListener('touchstart', openEnv, { passive: true });
  setTimeout(() => { if (!opened) openEnv(); }, 4200);

  /* ── CONFETTI ── */
  function fireConfetti() {
    const cols = ['#00d4ff','#c8667a','#c9a96e','#80a0ff','#a0e0f0','#e0a0c0'];
    const emojis = ['🌸','✨','🐇','💙','🌀','⭐'];
    for (let i = 0; i < 55; i++) {
      const pc = document.createElement('div');
      pc.className = 'cpiece';
      const isEmoji = Math.random() > .55;
      if (isEmoji) {
        pc.textContent = emojis[Math.floor(Math.random()*emojis.length)];
        pc.style.fontSize = '14px';
        pc.style.background = 'none';
      } else {
        pc.style.width = `${5+Math.random()*5}px`;
        pc.style.height = `${5+Math.random()*5}px`;
        pc.style.borderRadius = Math.random()>.5 ? '50%' : '0';
        pc.style.background = cols[Math.floor(Math.random()*cols.length)];
      }
      pc.style.left = `${Math.random()*100}vw`;
      pc.style.top = '-12px';
      pc.style.setProperty('--d', `${2+Math.random()*3}s`);
      pc.style.setProperty('--dl', `${Math.random()*1.8}s`);
      pc.style.setProperty('--dr', `${(Math.random()-.5)*180}px`);
      document.body.appendChild(pc);
      setTimeout(() => pc.remove(), 6000);
    }
  }

  /* ── PARALLAX ── */
  const layerBg  = document.querySelector('.layer-bg');
  const layerFog = document.querySelector('.layer-fog');

  function handleParallax(e) {
    let tiltX, tiltY;
    if (e.type === 'deviceorientation') {
      tiltX = (e.gamma || 0) / 30;   // -1 to 1
      tiltY = ((e.beta  || 0) - 20) / 40;
    } else {
      const rect = document.querySelector('.hero').getBoundingClientRect();
      tiltX = ((e.clientX - window.innerWidth/2) / window.innerWidth) * 2;
      tiltY = ((e.clientY - rect.top - rect.height/2) / rect.height) * 2;
    }
    const s1 = 14; const s2 = 6;
    layerBg .style.transform = `translate(${tiltX*s1}px, ${tiltY*s1}px) scale(1.18)`;
    layerFog.style.transform = `translate(${tiltX*s2}px, ${tiltY*s2}px) scale(1.09)`;
  }

  // Gyroscope (mobile)
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ – request on first touch
    document.addEventListener('touchstart', () => {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') window.addEventListener('deviceorientation', handleParallax);
      }).catch(() => {});
    }, { once: true });
  } else if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleParallax);
  }

  // Fallback: touch drag
  let lastTouch = null;
  document.querySelector('.hero')?.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (!lastTouch) { lastTouch = t; return; }
    const fakeE = {
      type: 'mousemove',
      clientX: t.clientX,
      clientY: t.clientY
    };
    handleParallax(fakeE);
    lastTouch = t;
  }, { passive: true });

  // Mouse (desktop preview)
  document.querySelector('.hero')?.addEventListener('mousemove', handleParallax);

  /* ── SCROLL REVEAL ── */
  const revEls = document.querySelectorAll('.reveal');
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: .14 });
  revEls.forEach(el => ro.observe(el));

  // Stagger info cards
  document.querySelectorAll('.info-card').forEach((c,i) => {
    c.style.transitionDelay = `${i*0.1}s`;
  });
  document.querySelectorAll('.manual-item').forEach((m,i) => {
    m.classList.add('reveal');
    m.style.transitionDelay = `${i*0.08}s`;
    ro.observe(m);
  });

  /* ── PIX MODAL ── */
  const pixModal = document.getElementById('modal-pix');
  document.getElementById('btn-pix').addEventListener('click', () => {
    document.body.classList.add('no-scroll');
    pixModal.classList.add('open');
    genQR();
  });
  document.getElementById('close-pix').addEventListener('click', () => closeModal(pixModal));
  pixModal.addEventListener('click', e => { if(e.target===pixModal) closeModal(pixModal); });

  let qrDone = false;
  function genQR() {
    if (qrDone) return;
    qrDone = true;
    const canvas = document.getElementById('qr-canvas');
    if (window.QRCode) {
      QRCode.toCanvas(canvas,
        '00020126360014BR.GOV.BCB.PIX0114+5551992906115520400005303986540650.005802BR5907Isabela6009VIAM%C3%83O62070503***6304ABCD',
        { width: 166, margin: 1, color: { dark: '#07080d', light: '#ffffff' } },
        () => {}
      );
    } else {
      drawFallbackQR(canvas);
    }
  }

  function drawFallbackQR(c) {
    c.width = 166; c.height = 166;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,166,166);
    ctx.fillStyle = '#07080d';
    // draw finder patterns
    [[2,2],[2,12],[12,2]].forEach(([ox,oy]) => {
      ctx.fillRect(ox*8,oy*8,56,56);
      ctx.fillStyle = '#fff';
      ctx.fillRect(ox*8+8,oy*8+8,40,40);
      ctx.fillStyle = '#07080d';
      ctx.fillRect(ox*8+16,oy*8+16,24,24);
    });
    // data modules (decorative)
    const seed = [1,0,1,1,0,1,0,1,1,0,1,0,0,1,1,0,1,1,0,1];
    for (let r=0;r<20;r++) for (let c2=0;c2<20;c2++) {
      if (r<8&&(c2<8||c2>12)) continue;
      if (r>12&&c2<8) continue;
      if ((seed[(r+c2)%seed.length]^seed[(r*c2+3)%seed.length])===1)
        ctx.fillRect(c2*8+3,r*8+3,6,6);
    }
  }

  document.getElementById('copy-pix').addEventListener('click', function() {
    const key = '51992906115';
    navigator.clipboard?.writeText(key).catch(()=>{});
    this.textContent = '✓  CHAVE COPIADA!';
    setTimeout(() => this.textContent = 'COPIAR CHAVE PIX', 2200);
  });

  /* ── GIFTS MODAL ── */
  const giftsModal = document.getElementById('modal-gifts');
  document.getElementById('btn-gifts').addEventListener('click', () => {
    document.body.classList.add('no-scroll');
    giftsModal.classList.add('open');
  });
  document.getElementById('close-gifts').addEventListener('click', () => closeModal(giftsModal));
  giftsModal.addEventListener('click', e => { if(e.target===giftsModal) closeModal(giftsModal); });

  function closeModal(m) {
    m.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  /* ── STARS IN THANKS ── */
  const starsEl = document.querySelector('.thanks-stars');
  if (starsEl) {
    for (let i=0;i<55;i++) {
      const s = document.createElement('div');
      s.className = 'tstar';
      const op = .08 + Math.random()*.45;
      const sz = 1 + Math.random()*2.5;
      s.style.cssText = `
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        width:${sz}px;height:${sz}px;
        --op:${op};--d:${2+Math.random()*5}s;--dl:${Math.random()*3}s;
      `;
      starsEl.appendChild(s);
    }
  }

  /* ── CONFIRM BUTTON PULSE ── */
  const confirmBtn = document.getElementById('btn-confirm');
  setInterval(() => {
    confirmBtn.style.boxShadow = '0 0 30px rgba(0,212,255,0.3)';
    setTimeout(() => confirmBtn.style.boxShadow = '', 300);
  }, 3500);

});
