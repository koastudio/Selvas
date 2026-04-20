/* ================================================
   SELVAS — Training JS: Quiz + Progress + Copy
   ================================================ */

const CORRECT = { q1: 'b', q2: 'c', q3: 'd', q4: 'c', q5: 'b' };

const EXPLANATIONS = {
  q1: {
    ok:  '¡Correcto! Siempre verifica primero que el problema no sea de tu equipo o conexión antes de reportar.',
    err: 'Incorrecto. El primer paso es verificar que es un bug real: recarga la página, limpia caché y prueba en otro navegador.'
  },
  q2: {
    ok:  '¡Correcto! Sin pasos, pantalla, comportamiento esperado/actual y evidencia, el reporte es imposible de trabajar.',
    err: 'Incorrecto. Un buen reporte necesita pasos para reproducir, pantalla afectada, comportamiento esperado vs. actual y evidencia visual.'
  },
  q3: {
    ok:  '¡Correcto! Si ninguna venta puede procesarse, el negocio está bloqueado — eso es Crítico.',
    err: 'Incorrecto. Si un proceso principal del negocio está completamente bloqueado, la prioridad es Crítico 🔴.'
  },
  q4: {
    ok:  '¡Correcto! Agregar tus observaciones al ticket existente evita duplicados y enriquece el reporte.',
    err: 'Incorrecto. Debes agregar tus observaciones como comentario en el ticket ya existente para evitar duplicados.'
  },
  q5: {
    ok:  '¡Correcto! Una captura o video es la evidencia más clara y directa para reportes visuales.',
    err: 'Incorrecto. La evidencia ideal para un problema visual es una captura de pantalla o video que muestre claramente el error.'
  }
};

/* ── PROGRESS BAR ─────────────────────────────── */
function updateProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  document.getElementById('progressBar').style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

/* ── COPY TEMPLATE ────────────────────────────── */
function copyTemplate() {
  const text = document.getElementById('templateText').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    const orig = btn.textContent;
    btn.textContent = '¡Copiado!';
    btn.style.background = '#16a34a';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
    }, 2000);
  }).catch(() => {
    /* fallback for browsers without clipboard API */
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
}

/* ── QUIZ ─────────────────────────────────────── */
function checkQuiz() {
  let score = 0;
  const total = Object.keys(CORRECT).length;

  Object.entries(CORRECT).forEach(([qId, correctVal]) => {
    const selected = document.querySelector(`input[name="${qId}"]:checked`);
    const feedback = document.getElementById('f' + qId.slice(1));
    const labels   = document.querySelectorAll(`input[name="${qId}"]`);

    /* reset styles */
    labels.forEach(inp => inp.parentElement.classList.remove('correct', 'wrong'));

    if (!selected) {
      feedback.textContent = 'Por favor selecciona una respuesta.';
      feedback.className   = 'quiz-feedback err';
      return;
    }

    const isCorrect = selected.value === correctVal;
    if (isCorrect) {
      score++;
      selected.parentElement.classList.add('correct');
      feedback.textContent = '✓ ' + EXPLANATIONS[qId].ok;
      feedback.className   = 'quiz-feedback ok';
    } else {
      selected.parentElement.classList.add('wrong');
      /* highlight correct answer */
      const correctInp = document.querySelector(`input[name="${qId}"][value="${correctVal}"]`);
      if (correctInp) correctInp.parentElement.classList.add('correct');
      feedback.textContent = '✗ ' + EXPLANATIONS[qId].err;
      feedback.className   = 'quiz-feedback err';
    }
  });

  /* result banner */
  const resultEl = document.getElementById('quizResult');
  resultEl.style.display = 'block';

  if (score === total) {
    resultEl.className   = 'quiz-result pass';
    resultEl.textContent = `🎉 ¡Perfecto! ${score}/${total} respuestas correctas. ¡Has dominado el módulo!`;
    showCompletion();
  } else if (score >= Math.ceil(total * 0.6)) {
    resultEl.className   = 'quiz-result pass';
    resultEl.textContent = `✓ Resultado: ${score}/${total}. Buen trabajo, pero revisa las respuestas marcadas para reforzar tu aprendizaje.`;
    if (score === total) showCompletion();
  } else {
    resultEl.className   = 'quiz-result fail';
    resultEl.textContent = `✗ Resultado: ${score}/${total}. Te recomendamos releer las secciones 02 y 03 e intentarlo nuevamente.`;
  }

  resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showCompletion() {
  const box = document.getElementById('completionBox');
  box.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
