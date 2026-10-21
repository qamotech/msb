(() => {
  const sets = [
    {title:'Static Electricity', questions:[
      ['What moves between materials when they are rubbed together?', ['Electrons','Whole atoms always','Light rays'],0],
      ['What do opposite electric charges do?', ['Repel','Attract','Disappear'],1],
      ['What do two matching electric charges do?', ['Attract','Repel','Turn into magnets'],1],
      ['A rubbed balloon can stick to a wall because of…', ['Electric attraction','Gravity switching off','Glue appearing'],0],
      ['A sudden movement of built-up charge is called…', ['Evaporation','Discharge','Condensation'],1],
      ['Which is an example of a large electric discharge?', ['A rainbow','Lightning','A shadow'],1],
      ['Which material usually holds static charge well?', ['Copper wire','Plastic','Salt water'],1],
      ['Which choice is safe during a thunderstorm?', ['Stand under a lone tree','Fly a kite','Go inside a substantial building'],2]
    ]},
    {title:'Current & Flow', questions:[
      ['A bulb lights when its circuit is…', ['Closed','Open','Missing its power source'],0],
      ['What supplies energy in a simple battery circuit?', ['The battery','The plastic cover','The switch alone'],0],
      ['Which material is a good electrical conductor?', ['Rubber','Copper','Dry plastic'],1],
      ['Which material helps insulate a wire?', ['Copper','Aluminum','Plastic'],2],
      ['Opening a switch normally…', ['Breaks the conducting path','Adds another battery','Makes the wire longer'],0],
      ['Electric current describes…', ['The flow of electric charge','The color of a battery','The size of a bulb'],0],
      ['A traditional bulb glows when its filament…', ['Freezes','Heats up','Fills with water'],1],
      ['Which power source belongs in a supervised classroom circuit activity?', ['A wall outlet','An exposed mains wire','A suitable low-voltage battery'],2]
    ]}
  ];
  const host = document.getElementById('worksheetContainer');
  const progress = document.getElementById('progressFill');
  let active = -1;
  const answers = sets.map(() => []);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function updateProgress() {
    const count = answers[active].filter(Number.isInteger).length;
    progress.style.width = `${count / sets[active].questions.length * 100}%`;
    progress.setAttribute('role','progressbar');
    progress.setAttribute('aria-valuemin','0');
    progress.setAttribute('aria-valuemax','8');
    progress.setAttribute('aria-valuenow', String(count));
    progress.setAttribute('aria-label','Questions answered');
  }
  function open(index) {
    active = index;
    const set = sets[index];
    host.innerHTML = `<form class="clark-quiz"><h2 tabindex="-1">${esc(set.title)}</h2><p>Choose one answer per question, then check your work.</p>${set.questions.map(([question,options], q) => `<fieldset><legend>${q+1}. ${esc(question)}</legend>${options.map((option,i) => `<label><input type="radio" name="electricity-${q}" value="${i}" data-question="${q}" ${answers[index][q]===i?'checked':''}>${esc(option)}</label>`).join('')}<p class="clark-quiz-feedback" data-feedback="${q}"></p></fieldset>`).join('')}<p id="electricity-result" role="status" aria-live="polite"></p><div class="clark-quiz-actions"><button type="submit">Check answers</button><button type="button" data-action="retry">Try again</button><button type="button" data-action="print">Print worksheet</button></div></form>`;
    host.querySelector('form').addEventListener('change', event => {
      if (!event.target.matches('input[data-question]')) return;
      answers[active][Number(event.target.dataset.question)] = Number(event.target.value);
      host.querySelector('#electricity-result').textContent = '';
      host.querySelectorAll('[data-feedback]').forEach(el => {el.textContent='';});
      updateProgress();
    });
    host.querySelector('form').addEventListener('submit', event => {
      event.preventDefault();
      const done = answers[active].filter(Number.isInteger).length;
      if (done !== 8) {host.querySelector('#electricity-result').textContent=`Answer all 8 questions first (${done}/8 answered).`;return;}
      let score = 0;
      set.questions.forEach(([,options,correct], q) => {
        const right = answers[active][q] === correct;
        if (right) score++;
        host.querySelector(`[data-feedback="${q}"]`).textContent = right ? 'Correct!' : `Review: ${options[correct]}.`;
      });
      host.querySelector('#electricity-result').textContent = `${score}/8 correct. ${score===8?'Great work!':'Review the feedback and try again.'}`;
    });
    host.querySelector('[data-action="retry"]').addEventListener('click', () => {answers[active]=[];open(active);});
    host.querySelector('[data-action="print"]').addEventListener('click', () => {
      document.body.classList.add('clark-print-quiz');
      try {window.print();} finally {document.body.classList.remove('clark-print-quiz');}
    });
    document.querySelectorAll('[data-ws]').forEach(el => el.setAttribute('aria-pressed',String(Number(el.dataset.ws)===active)));
    updateProgress();host.querySelector('h2').focus();
  }
  document.querySelectorAll('[data-ws]').forEach(card => {
    card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-pressed','false');
    card.addEventListener('click',()=>open(Number(card.dataset.ws)));
    card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();card.click();}});
  });
})();
