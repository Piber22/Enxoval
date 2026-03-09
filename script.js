/* ═══════════════════════════════════
   ALICE IN WONDERLAND INVITATION JS
═══════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Particles on envelope screen ───
  const container = document.querySelector('.floating-particles');
  const colors = ['#c8667a', '#5b9ea0', '#c9a96e', '#a880d0', '#f5a0b8'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      --dur: ${4 + Math.random() * 6}s;
      --delay: ${Math.random() * 4}s;
    `;
    container.appendChild(p);
  }

  // ─── Envelope open sequence ───
  const envelope = document.querySelector('.envelope-wrapper');
  const envelopeScreen = document.getElementById('envelope-screen');
  const mainContent = document.getElementById('main-content');
  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    envelope.classList.add('opening');

    setTimeout(() => {
      envelopeScreen.style.transition = 'opacity 1.2s ease';
      envelopeScreen.style.opacity = '0';
      mainContent.classList.add('visible');
    }, 1800);

    setTimeout(() => {
      envelopeScreen.style.display = 'none';
      fireConfetti();
    }, 3000);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('touchstart', openEnvelope, { passive: true });

  // Auto-open after 4s if user doesn't tap
  setTimeout(() => { if (!opened) openEnvelope(); }, 4000);

  // ─── Confetti ───
  function fireConfetti() {
    const colors = ['#c8667a', '#5b9ea0', '#c9a96e', '#a880d0', '#f5a0b8', '#e8d5b0', '#5b9ea0'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const isHeart = Math.random() > 0.6;
      if (isHeart) {
        piece.style.width = '12px';
        piece.style.height = '12px';
        piece.style.borderRadius = '0';
        piece.innerHTML = ['🌸', '🌷', '✨', '🫧', '🌺'][Math.floor(Math.random() * 5)];
        piece.style.background = 'none';
        piece.style.fontSize = '14px';
      }
      piece.style.cssText += `
        left: ${Math.random() * 100}vw;
        top: -10px;
        background: ${isHeart ? 'none' : colors[Math.floor(Math.random() * colors.length)]};
        --dur: ${2 + Math.random() * 3}s;
        --delay: ${Math.random() * 2}s;
        --drift: ${(Math.random() - 0.5) * 200}px;
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 6000);
    }
  }

  // ─── Scroll reveal ───
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  // ─── Staggered reveals for info cards ───
  document.querySelectorAll('.info-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });
  document.querySelectorAll('.manual-item').forEach((item, i) => {
    item.classList.add('reveal');
    item.style.transitionDelay = `${i * 0.1}s`;
    revealObserver.observe(item);
  });

  // ─── PIX Modal ───
  const pixBtn = document.getElementById('btn-pix');
  const pixModal = document.getElementById('modal-pix');
  const pixClose = document.getElementById('close-pix');
  const copyBtn = document.getElementById('copy-pix');

  pixBtn.addEventListener('click', () => {
    document.body.classList.add('modal-open');
    pixModal.classList.add('open');
    generateQR();
  });

  pixClose.addEventListener('click', closePixModal);
  pixModal.addEventListener('click', (e) => {
    if (e.target === pixModal) closePixModal();
  });

  function closePixModal() {
    pixModal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }

  let qrGenerated = false;
  function generateQR() {
    if (qrGenerated) return;
    qrGenerated = true;
    const canvas = document.getElementById('qr-canvas');
    if (window.QRCode) {
      QRCode.toCanvas(canvas, '00020126360014BR.GOV.BCB.PIX0114+5551999999992204Presente5204000053039865406100.005802BR5913Isabela Festa6009SAO PAULO62070503***6304ABCD', {
        width: 180,
        margin: 1,
        color: { dark: '#2d1a2e', light: '#fffdf8' }
      }, () => {});
    } else {
      // Fallback visual QR placeholder
      drawPlaceholderQR(canvas);
    }
  }

  function drawPlaceholderQR(canvas) {
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fffdf8';
    ctx.fillRect(0, 0, 180, 180);
    // Draw a simple QR-like pattern
    ctx.fillStyle = '#2d1a2e';
    const size = 9;
    const pattern = [
      [1,1,1,1,1,1,1,0,1,0,1,0,0,0,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,1,1,0,1,1,0,1,0,1,1,0,0,1,0,1,1,0,1,0],
      [0,1,1,0,1,0,0,1,0,1,0,1,1,0,0,1,1,0,1,0,1],
      [1,0,0,0,1,1,1,0,1,0,1,1,0,0,1,0,0,0,1,1,0],
      [0,0,1,0,0,1,0,1,0,1,0,1,1,0,0,1,0,1,0,0,1],
      [1,1,0,1,0,0,1,0,1,0,1,1,0,0,1,1,0,0,0,1,0],
      [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,1,0,1,0,0],
      [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,1,1,0,0,1,0],
      [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,0,0,0,1,0,1],
      [1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,0],
      [1,0,1,1,1,0,1,0,0,1,1,1,1,0,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,1,1,0,0,0],
      [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,0,0,1,1,0],
    ];
    pattern.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) ctx.fillRect(c * size, r * size, size - 1, size - 1);
      });
    });
  }

  copyBtn.addEventListener('click', () => {
    const key = '(51) 99290-6115';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(key).then(() => {
        copyBtn.textContent = '✓ Chave copiada!';
        setTimeout(() => copyBtn.textContent = 'Copiar chave Pix', 2000);
      });
    } else {
      copyBtn.textContent = '✓ Chave copiada!';
      setTimeout(() => copyBtn.textContent = 'Copiar chave Pix', 2000);
    }
  });

  // ─── Gifts Modal ───
  const giftsBtn = document.getElementById('btn-gifts');
  const giftsModal = document.getElementById('modal-gifts');
  const giftsClose = document.getElementById('close-gifts');

  giftsBtn.addEventListener('click', () => {
    document.body.classList.add('modal-open');
    giftsModal.classList.add('open');
  });
  giftsClose.addEventListener('click', () => {
    giftsModal.classList.remove('open');
    document.body.classList.remove('modal-open');
  });
  giftsModal.addEventListener('click', (e) => {
    if (e.target === giftsModal) {
      giftsModal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  });

  // ─── Twinkling stars in thanks section ───
  const starsContainer = document.querySelector('.thanks-stars');
  if (starsContainer) {
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'thanks-star';
      const op = 0.1 + Math.random() * 0.5;
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${1 + Math.random() * 3}px;
        height: ${1 + Math.random() * 3}px;
        --op: ${op};
        --dur: ${2 + Math.random() * 4}s;
        --delay: ${Math.random() * 3}s;
      `;
      starsContainer.appendChild(star);
    }
  }

  // ─── Page decorations ───
  const decoContainer = document.getElementById('main-content');
  const decoEmojis = ['🐇', '🎂', '🌹', '⭐', '🎀', '🌸', '🫧', '🌺', '✨'];
  decoEmojis.forEach((emoji, i) => {
    const d = document.createElement('div');
    d.className = 'page-decoration';
    d.textContent = emoji;
    d.style.cssText = `
      top: ${10 + i * 12}%;
      ${i % 2 === 0 ? 'left: 2%' : 'right: 2%'};
      --dur: ${6 + i * 1.5}s;
      --delay: ${i * 0.5}s;
    `;
    decoContainer.appendChild(d);
  });

  // ─── Heartbeat on confirm button ───
  const confirmBtn = document.getElementById('btn-confirm');
  setInterval(() => {
    confirmBtn.style.transform = 'scale(1.03)';
    setTimeout(() => confirmBtn.style.transform = 'scale(1)', 150);
  }, 3000);

});
