const flipSound = new Audio('audio/flip.ogg');
const correctSound = new Audio('audio/correct.mp3');
const wrongSound = new Audio('audio/wrong.mp3');

function escapeHtml(s) {
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

const dataTypesPairs = [
    { id: 1, text: "int", color: "color-1", def: "Integer: Whole numbers" },
    { id: 2, text: "str", color: "color-2", def: "String: Text data" },
    { id: 3, text: "bool", color: "color-3", def: "Boolean: True/False" },
    { id: 4, text: "float", color: "color-4", def: "Float: Decimal numbers" },
    { id: 5, text: "list", color: "color-5", def: "List: Collection of items" },
    { id: 6, text: "dict", color: "color-6", def: "Dictionary: Key-value pairs" },
    { id: 7, text: "tuple", color: "color-7", def: "Tuple: Ordered immutable sequence" },
    { id: 8, text: "set", color: "color-8", def: "Set: Unique unordered items" },
    { id: 9, text: "bytes", color: "color-9", def: "Bytes: Binary data" },
    { id: 10, text: "none", color: "color-10", def: "None: Null/empty value" },
    { id: 11, text: "range", color: "color-11", def: "Range: Number sequence" },
    { id: 12, text: "frozenset", color: "color-12", def: "FrozenSet: Immutable set" },
    { id: 13, text: "complex", color: "color-13", def: "Complex: Real+imaginary" },
    { id: 14, text: "bytearray", color: "color-14", def: "ByteArray: Mutable bytes" },
    { id: 15, text: "memoryview", color: "color-15", def: "MemoryView: Buffer access" }
];

const vbPairs = [
    { id: 1, text: "Integer", color: "color-1", def: "Integer: Whole numbers" },
    { id: 2, text: "String", color: "color-2", def: "String: Text data" },
    { id: 3, text: "Boolean", color: "color-3", def: "Boolean: True/False" },
    { id: 4, text: "Single", color: "color-4", def: "Single: Decimal numbers" },
    { id: 5, text: "Array", color: "color-5", def: "Array: Collection of items" },
    { id: 6, text: "Variant", color: "color-6", def: "Variant: Any data type" },
    { id: 7, text: "Long", color: "color-7", def: "Long: Large integers" },
    { id: 8, text: "Double", color: "color-8", def: "Double: Double precision" },
    { id: 9, text: "Currency", color: "color-9", def: "Currency: Money format" },
    { id: 10, text: "Date", color: "color-10", def: "Date: Date value" },
    { id: 11, text: "Object", color: "color-11", def: "Object: Base class" },
    { id: 12, text: "Byte", color: "color-12", def: "Byte: 0-255 values" },
    { id: 13, text: "Decimal", color: "color-13", def: "Decimal: Precise numbers" },
    { id: 14, text: "Short", color: "color-14", def: "Short: Small integers" },
    { id: 15, text: "Char", color: "color-15", def: "Char: Single character" }
];

const htmlPairs = [
    { id: 1, text: "<div>", color: "color-1", def: "Div: Block-level container" },
    { id: 2, text: "<span>", color: "color-2", def: "Span: Inline container" },
    { id: 3, text: "<a>", color: "color-3", def: "Anchor: Hyperlink" },
    { id: 4, text: "<img>", color: "color-4", def: "Image: Embeds pictures" },
    { id: 5, text: "<ul>", color: "color-5", def: "Unordered List" },
    { id: 6, text: "<p>", color: "color-6", def: "Paragraph: Text block" },
    { id: 7, text: "<h1>", color: "color-7", def: "Heading 1: Main title" },
    { id: 8, text: "<h2>", color: "color-8", def: "Heading 2: Subtitle" },
    { id: 9, text: "<button>", color: "color-9", def: "Button: Clickable button" },
    { id: 10, text: "<input>", color: "color-10", def: "Input: User input field" },
    { id: 11, text: "<form>", color: "color-11", def: "Form: Input container" },
    { id: 12, text: "<table>", color: "color-12", def: "Table: Data table" },
    { id: 13, text: "<tr>", color: "color-13", def: "Table Row: Table row" },
    { id: 14, text: "<td>", color: "color-14", def: "Table Data: Cell" },
    { id: 15, text: "<br>", color: "color-15", def: "Break: Line break" }
];

let currentLevel = 1;
let pairsCount = 4;
let score = 0;
let timeLeft = 30;
let timerInterval;
let flippedCards = [];
let matchedCount = 0;
let isGameOver = false;
let currentMode = 'datatypes';
let currentDifficulty = 'easy';
let isLoggedIn = false;

async function checkLoginStatus() {
    try {
        console.log('Checking login status...');
        const response = await fetch('../auth/me.php');
        const data = await response.json();
        console.log('Login status response:', data);
        isLoggedIn = data.logged_in === true;
        if (isLoggedIn) {
            console.log('User logged in:', data.user?.username);
        } else {
            console.log('Guest mode: Score will not be saved to leaderboard');
        }
    } catch (e) {
        console.error('Error checking login status:', e);
        isLoggedIn = false;
    }
}

function getMode() {
    const params = new URLSearchParams(window.location.search);
    const mode = (params.get('mode') || 'datatypes').toLowerCase();
    if (mode === 'vb') {
        currentMode = 'vb';
    } else if (mode === 'html') {
        currentMode = 'html';
    } else {
        currentMode = 'datatypes';
    }
    return currentMode;
}

function getDifficulty() {
    const params = new URLSearchParams(window.location.search);
    const diff = (params.get('difficulty') || 'easy').toLowerCase();
    currentDifficulty = ['easy', 'medium', 'hard'].includes(diff) ? diff : 'easy';
    return currentDifficulty;
}

function getTimeBonus() {
    const bonuses = {
        'easy': 5,
        'medium': 4,
        'hard': 3
    };
    return bonuses[currentDifficulty] || 5;
}

function getScoreForCorrect() {
    const scores = {
        'easy': 3,
        'medium': 5,
        'hard': 8
    };
    return scores[currentDifficulty] || 3;
}

function getLevelBonus() {
    const bonuses = {
        'easy': 5,
        'medium': 12,
        'hard': 15
    };
    return bonuses[currentDifficulty] || 5;
}

function getWrongPenalty() {
    const penalties = {
        'easy': 0,
        'medium': 1,
        'hard': 2
    };
    return penalties[currentDifficulty] || 0;
}

function getPairsForMode() {
    if (currentMode === 'vb') return vbPairs;
    if (currentMode === 'html') return htmlPairs;
    return dataTypesPairs;
}

function submitScore() {
    if (!isLoggedIn) {
        console.log('Guest score not submitted - user not logged in');
        return Promise.resolve();
    }
    
    const body = new URLSearchParams({
        score: String(score),
        mode: getMode(),
        difficulty: getDifficulty(),
        level: String(currentLevel),
    });

    console.log('Submitting score:', {
        score: score,
        mode: getMode(),
        difficulty: getDifficulty(),
        level: currentLevel,
        isLoggedIn: isLoggedIn
    });

    return fetch('../api/submit_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
        cache: 'no-store',
        keepalive: true,
    }).then(async response => {
        const text = await response.text();
        console.log('Score submission raw response:', text);
        if (!text || text.trim() === '') {
            console.error('Empty response from server');
            return { ok: false, error: 'empty_response' };
        }
        try {
            const data = JSON.parse(text);
            console.log('Score submission response:', data);
            if (!data.ok) {
                console.error('Score submission failed:', data.error || data.message);
            } else {
                console.log('Score saved successfully!');
            }
            return data;
        } catch (e) {
            console.error('JSON parse error:', e);
            return { ok: false, error: 'parse_error', message: e.message };
        }
    }).catch(error => {
        console.error('Score submission error:', error);
        return null;
    });
}

function initGame() {
    isGameOver = false;
    matchedCount = 0;
    flippedCards = [];
    const grid = document.getElementById('card-grid');
    grid.innerHTML = "";
    
    checkLoginStatus();
    
    getMode();
    getDifficulty();
    
    const difficultyTime = {
        'easy': 45,
        'medium': 30,
        'hard': 20
    };
    timeLeft = difficultyTime[currentDifficulty];
    
    const allPairs = getPairsForMode();
    let levelPairs = allPairs.slice(0, pairsCount);
    let cardData = [];
    levelPairs.forEach(p => {
        cardData.push({ id: p.id, text: p.text, color: p.color, def: p.def });
        cardData.push({ id: p.id, text: p.text, color: p.color, def: p.def });
    });

    cardData.sort(() => Math.random() - 0.5);

    cardData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.color = data.color;
        card.dataset.def = data.def;
        card.innerHTML = `
            <div class="card-back"></div>
            <div class="card-front ${data.color}">
                ${escapeHtml(data.text)}
            </div>
        `;
        card.addEventListener('click', flipCard);
        grid.appendChild(card);
    });
    startTimer();
}

function flipCard() {
    if (isGameOver) return;
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        flipSound.currentTime = 0;
        flipSound.play().catch(() => {});
        this.classList.add('flipped');
        flippedCards.push(this);
        if (flippedCards.length === 2) setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.color === c2.dataset.color) {
        playSound('audio/correct.mp3'); 
        
        const scoreForCorrect = getScoreForCorrect();
        score += scoreForCorrect;
        
        const timeBonus = getTimeBonus();
        timeLeft += timeBonus;
        
        document.getElementById('score').textContent = score;
        document.getElementById('timer').textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
        
        const defContainer = document.querySelector('.definition-section');
        const defText = document.getElementById('definition-text');
        
        defText.textContent = c1.dataset.def;
        defContainer.classList.add('shock-container');
        defText.classList.add('shock-text');

        createStars();

        setTimeout(() => {
            defContainer.classList.remove('shock-container');
            defText.classList.remove('shock-text');
        }, 600);

        matchedCount++;
        flippedCards = [];
        if (matchedCount === pairsCount) setTimeout(nextLevel, 1000);
    } else {
        playSound('audio/wrong.mp3'); 
        
        const penalty = getWrongPenalty();
        if (penalty > 0) {
            timeLeft = Math.max(0, timeLeft - penalty);
            document.getElementById('timer').textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
        }
        
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
        }, 400);
    }
}

function createStars() {
    const container = document.querySelector('.definition-section');
    const starCount = 15;

    const startX = container.offsetWidth / 2;
    const startY = container.offsetHeight / 2;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star-particle';
        star.style.left = startX + 'px';
        star.style.top = startY + 'px';

        const travelDistX = (Math.random() - 0.5) * 1000;
        const travelDistY = (Math.random() - 0.5) * 1000;

        star.style.setProperty('--tx', travelDistX + 'px');
        star.style.setProperty('--ty', travelDistY + 'px');

        container.appendChild(star);
        setTimeout(() => star.remove(), 800);
    }
}

function nextLevel() {
    clearInterval(timerInterval);
    
    const levelBonus = getLevelBonus();
    score += levelBonus;
    document.getElementById('score').textContent = score;
    
    if (isLoggedIn) {
        submitScore();
    }
    
    currentLevel++;
    document.getElementById('level').textContent = currentLevel;
    if (pairsCount < 6) pairsCount++;
    setTimeout(initGame, 1000);
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            isGameOver = true;
            submitScore().finally(() => {
                showGameOver();
            });
        }
    }, 1000);
}

function showGameOver() {
    const modal = document.getElementById('gameover-modal');
    const backdrop = document.getElementById('gameover-backdrop');
    const scoreEl = document.getElementById('gameover-score');
    const restartBtn = document.getElementById('gameover-restart');

    if (scoreEl) scoreEl.textContent = String(score);

    if (modal) {
        modal.removeAttribute('hidden');
    }
    if (backdrop) backdrop.removeAttribute('hidden');

    if (restartBtn) {
        restartBtn.onclick = () => location.reload();
    }
    
    if (!isLoggedIn) {
        const messageEl = document.getElementById('gameover-message');
        if (messageEl) {
            messageEl.textContent = 'Log in to save your score to the leaderboard!';
            messageEl.style.display = 'block';
        }
    }
}

function playSound(audioPath) {
    const sound = new Audio(audioPath);
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

initGame();
