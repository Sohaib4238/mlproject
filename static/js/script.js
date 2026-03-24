/**
 * EduPredict · script.js
 * Dashboard interactions & animations
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ────────────────────────────────────────────
       1. Panel entrance animation (staggered)
    ──────────────────────────────────────────── */
    const panels = document.querySelectorAll('.panel, .info-card, .page-header');
    panels.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
        requestAnimationFrame(() => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 60);
        });
    });


    /* ────────────────────────────────────────────
       2. Score input → progress bar
    ──────────────────────────────────────────── */
    function bindScoreBar(inputId, barId) {
        const input = document.getElementById(inputId);
        const bar   = document.getElementById(barId);
        if (!input || !bar) return;

        input.addEventListener('input', () => {
            const val = Math.min(Math.max(parseFloat(input.value) || 0, 0), 100);
            bar.style.width = val + '%';

            // Color shift: cyan → amber → red
            if (val < 50) {
                bar.style.background = 'linear-gradient(90deg, #00e5ff, #00b4d8)';
            } else if (val < 75) {
                bar.style.background = 'linear-gradient(90deg, #00e5ff, #ffb300)';
            } else {
                bar.style.background = 'linear-gradient(90deg, #00e5ff, #ffb300, #2ed573)';
            }
        });

        // Validate range on blur
        input.addEventListener('blur', () => {
            let v = parseFloat(input.value);
            if (isNaN(v)) return;
            if (v < 0)   input.value = 0;
            if (v > 100) input.value = 100;
            input.dispatchEvent(new Event('input'));
        });
    }

    bindScoreBar('reading_score',  'reading-bar');
    bindScoreBar('writing_score',  'writing-bar');


    /* ────────────────────────────────────────────
       3. Form submit → loading state
    ──────────────────────────────────────────── */
    const form      = document.getElementById('predict-form');
    const submitBtn = document.getElementById('submit-btn');

    if (form && submitBtn) {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) return; // let browser handle native validation

            submitBtn.classList.add('loading');
            const textEl = submitBtn.querySelector('.btn-text');
            if (textEl) textEl.textContent = 'Processing Pipeline…';
        });
    }


    /* ────────────────────────────────────────────
       4. Select field: highlight parent on change
    ──────────────────────────────────────────── */
    document.querySelectorAll('select').forEach(sel => {
        sel.addEventListener('change', () => {
            const wrap = sel.closest('.input-wrap');
            if (!wrap) return;
            wrap.classList.add('selected');
            sel.style.color = 'var(--white)';
        });
    });


    /* ────────────────────────────────────────────
       5. Keyboard shortcut: Ctrl+Enter to submit
    ──────────────────────────────────────────── */
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (form) form.requestSubmit();
        }
    });


    /* ────────────────────────────────────────────
       6. Form field completion tracker
         → Enable submit glow when all fields filled
    ──────────────────────────────────────────── */
    const allInputs = form ? form.querySelectorAll('select, input[required]') : [];

    function checkCompletion() {
        if (!submitBtn) return;
        let filled = 0;
        allInputs.forEach(inp => {
            if (inp.value && inp.value !== '') filled++;
        });
        const pct = filled / allInputs.length;

        if (pct === 1) {
            submitBtn.style.boxShadow = '0 0 50px rgba(0,229,255,0.45), 0 0 100px rgba(0,229,255,0.15)';
        } else {
            submitBtn.style.boxShadow = '0 0 20px rgba(0,229,255,0.2)';
        }
    }

    allInputs.forEach(inp => {
        inp.addEventListener('change', checkCompletion);
        inp.addEventListener('input', checkCompletion);
    });


    /* ────────────────────────────────────────────
       7. Subtle parallax on panel hover
    ──────────────────────────────────────────── */
    document.querySelectorAll('.panel').forEach(panel => {
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / rect.width;
            const dy = (e.clientY - cy) / rect.height;
            panel.style.transform = `perspective(1200px) rotateY(${dx * 1.5}deg) rotateX(${-dy * 1.5}deg)`;
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.transition = 'transform 0.5s ease';
            panel.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
            setTimeout(() => panel.style.transition = '', 500);
        });
    });

});