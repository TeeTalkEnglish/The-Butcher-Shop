// ===== TOOL DATA — local images =====
const tools = [
  {
    id: 1,
    img: "images/boning-knife.jpg",
    label: "Boning Knife",
    name: "Boning Knife",
    hint: "Flexible blade for removing bones from meat"
  },
  {
    id: 2,
    img: "images/cleaver.jpg",
    label: "Cleaver",
    name: "Cleaver",
    hint: "Heavy rectangular blade for chopping through bone"
  },
  {
    id: 3,
    img: "images/meat-saw.jpg",
    label: "Meat Saw",
    name: "Meat Saw",
    hint: "Used to cut through thick bones"
  },
  {
    id: 4,
    img: "images/knife-sharpener.jpg",
    label: "Knife Sharpener",
    name: "Knife Sharpener",
    hint: "Steel rod used to hone a blade's edge"
  },
  {
    id: 5,
    img: "images/meat-hook.jpg",
    label: "Meat Hook",
    name: "Meat Hook",
    hint: "Curved hook for hanging carcasses"
  },
  {
    id: 6,
    img: "images/chainmail-glove.jpg",
    label: "Chainmail Glove",
    name: "Chainmail Glove",
    hint: "Metal mesh glove for hand protection"
  },
  {
    id: 7,
    img: "images/apron.jpg",
    label: "Butcher's Apron",
    name: "Butcher's Apron",
    hint: "Protective covering worn over clothes"
  },
  {
    id: 8,
    img: "images/thermometer.jpg",
    label: "Meat Thermometer",
    name: "Meat Thermometer",
    hint: "Checks internal temperature of meat"
  },
];

// ===== STATE =====
let selected      = null;
let matched       = new Set();
let attempts      = 0;
let timerSeconds  = 0;
let timerInterval = null;

// ===== DOM REFS =====
const board        = document.getElementById('game-board');
const scoreEl      = document.getElementById('score');
const totalEl      = document.getElementById('total');
const attemptsEl   = document.getElementById('attempts');
const timerEl      = document.getElementById('timer');
const resultBanner = document.getElementById('result-banner');
const finalStats   = document.getElementById('final-stats');

// ===== INIT =====
function initGame() {
  matched.clear();
  selected               = null;
  attempts               = 0;
  attemptsEl.textContent = 0;
  scoreEl.textContent    = 0;
  totalEl.textContent    = tools.length;
  resultBanner.classList.add('hidden');

  const shuffledTools = shuffle([...tools]);
  const shuffledNames = shuffle([...tools]);

  const leftCol      = document.createElement('div');
  leftCol.className  = 'column';
  const rightCol     = document.createElement('div');
  rightCol.className = 'column';

  shuffledTools.forEach(tool => leftCol.appendChild(makeCard('tool', tool)));
  shuffledNames.forEach(tool => rightCol.appendChild(makeCard('name', tool)));

  board.innerHTML = '';
  board.appendChild(leftCol);
  board.appendChild(rightCol);

  timerSeconds        = 0;
  timerEl.textContent = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timerSeconds++;
    timerEl.textContent = timerSeconds;
  }, 1000);
}

// ===== CARD FACTORY =====
function makeCard(type, tool) {
  const card      = document.createElement('div');
  card.className  = `card ${type}`;
  card.dataset.id = tool.id;

  if (type === 'tool') {
    // NO label shown — image only!
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${tool.img}" alt="${tool.label}" onerror="this.src=''; this.alt='?'"/>
      </div>
    `;
  } else {
    card.textContent = tool.name;
  }

  card.addEventListener('click', () => onCardClick(card, type));
  return card;
}

// ===== CLICK HANDLER =====
function onCardClick(card, type) {
  const id = parseInt(card.dataset.id);
  if (matched.has(id) || card.classList.contains('matched')) return;

  if (selected && selected.element === card) {
    card.classList.remove('selected');
    selected = null;
    return;
  }

  if (selected && selected.type === type) {
    selected.element.classList.remove('selected');
    card.classList.add('selected');
    selected = { type, id, element: card };
    return;
  }

  if (!selected) {
    card.classList.add('selected');
    selected = { type, id, element: card };
    return;
  }

  attempts++;
  attemptsEl.textContent = attempts;

  if (selected.id === id) {
    [selected.element, card].forEach(el => {
      el.classList.remove('selected');
      el.classList.add('matched');
    });
    matched.add(id);
    scoreEl.textContent = matched.size;
    selected = null;
    if (matched.size === tools.length) endGame();
  } else {
    const wrongA = selected.element;
    const wrongB = card;
    [wrongA, wrongB].forEach(el => el.classList.add('wrong'));
    setTimeout(() => {
      [wrongA, wrongB].forEach(el => el.classList.remove('wrong', 'selected'));
      selected = null;
    }, 600);
  }
}

// ===== END GAME =====
function endGame() {
  clearInterval(timerInterval);
  finalStats.textContent = `⏱ Time: ${timerSeconds}s  |  ❌ Attempts: ${attempts}`;
  resultBanner.classList.remove('hidden');
}

// ===== RESTART =====
function restartGame() {
  initGame();
}

// ===== SHUFFLE =====
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== START =====
initGame();