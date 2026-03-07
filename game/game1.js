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
    { id: 1, text: "Integer", color: "color-1", def: "Integer: Whole numbers", example: "Dim num As Integer = 42" },
    { id: 2, text: "String", color: "color-2", def: "String: Text data", example: "Dim name As String = \"Hello\"" },
    { id: 3, text: "Boolean", color: "color-3", def: "Boolean: True/False", example: "Dim flag As Boolean = True" },
    { id: 4, text: "Single", color: "color-4", def: "Single: Decimal numbers", example: "Dim dec As Single = 3.14" },
    { id: 5, text: "Array", color: "color-5", def: "Array: Collection of items", example: "Dim arr(5) As Integer" },
    { id: 6, text: "Variant", color: "color-6", def: "Variant: Any data type", example: "Dim v As Variant" },
    { id: 7, text: "Long", color: "color-7", def: "Long: Large integers", example: "Dim bigNum As Long" },
    { id: 8, text: "Double", color: "color-8", def: "Double: Double precision", example: "Dim dbl As Double = 1.5" },
    { id: 9, text: "Currency", color: "color-9", def: "Currency: Money format", example: "Dim money As Currency" },
    { id: 10, text: "Date", color: "color-10", def: "Date: Date value", example: "Dim dt As Date = #1/1/2024#" },
    { id: 11, text: "Object", color: "color-11", def: "Object: Base class", example: "Dim obj As Object" },
    { id: 12, text: "Byte", color: "color-12", def: "Byte: 0-255 values", example: "Dim b As Byte = 255" },
    { id: 13, text: "Decimal", color: "color-13", def: "Decimal: Precise numbers", example: "Dim dec As Decimal" },
    { id: 14, text: "Short", color: "color-14", def: "Short: Small integers", example: "Dim s As Short = 100" },
    { id: 15, text: "Char", color: "color-15", def: "Char: Single character", example: "Dim c As Char = \"A\"" }
];

const htmlPairs = [
    { id: 1, text: "<div>", color: "color-1", def: "Div: Block-level container", example: "<div>Content</div>" },
    { id: 2, text: "<span>", color: "color-2", def: "Span: Inline container", example: "<span>Text</span>" },
    { id: 3, text: "<a>", color: "color-3", def: "Anchor: Hyperlink", example: "<a href=\"url\">Link</a>" },
    { id: 4, text: "<img>", color: "color-4", def: "Image: Embeds pictures", example: "<img src=\"image.jpg\">" },
    { id: 5, text: "<ul>", color: "color-5", def: "Unordered List", example: "<ul><li>Item</li></ul>" },
    { id: 6, text: "<p>", color: "color-6", def: "Paragraph: Text block", example: "<p>This is a paragraph.</p>" },
    { id: 7, text: "<h1>", color: "color-7", def: "Heading 1: Main title", example: "<h1>Title</h1>" },
    { id: 8, text: "<h2>", color: "color-8", def: "Heading 2: Subtitle", example: "<h2>Subtitle</h2>" },
    { id: 9, text: "<button>", color: "color-9", def: "Button: Clickable button", example: "<button>Click</button>" },
    { id: 10, text: "<input>", color: "color-10", def: "Input: User input field", example: "<input type=\"text\">" },
    { id: 11, text: "<form>", color: "color-11", def: "Form: Input container", example: "<form>Inputs</form>" },
    { id: 12, text: "<table>", color: "color-12", def: "Table: Data table", example: "<table><tr><td>Cell</td></tr></table>" },
    { id: 13, text: "<tr>", color: "color-13", def: "Table Row: Table row", example: "<tr><td>Data</td></tr>" },
    { id: 14, text: "<td>", color: "color-14", def: "Table Data: Cell", example: "<td>Content</td>" },
    { id: 15, text: "<br>", color: "color-15", def: "Break: Line break", example: "Line 1<br>Line 2" }
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
let isTimerPaused = false;
let examplePopupTimeout = null;

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
        'easy': 60,
        'medium': 45,
        'hard': 20
    };
    timeLeft = difficultyTime[currentDifficulty];
    
    const timerEl = document.getElementById('timer');
    timerEl.classList.remove('warning', 'danger');
    timerEl.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
    
    const allPairs = getPairsForMode();
    let levelPairs = allPairs.slice(0, pairsCount);
    let cardData = [];
    levelPairs.forEach(p => {
        cardData.push({ id: p.id, text: p.text, color: p.color, def: p.def, example: p.example });
        cardData.push({ id: p.id, text: p.text, color: p.color, def: p.def, example: p.example });
    });

    cardData.sort(() => Math.random() - 0.5);

    cardData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.color = data.color;
        card.dataset.def = data.def;
        card.dataset.example = data.example || '';
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
        const timerEl = document.getElementById('timer');
        timerEl.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
        
        timerEl.classList.remove('warning', 'danger');
        if (timeLeft <= 5) {
            timerEl.classList.add('danger');
        } else if (timeLeft <= 10) {
            timerEl.classList.add('warning');
        }
        
        const defContainer = document.querySelector('.definition-section');
        const defText = document.getElementById('definition-text');
        
        if ((currentMode === 'html' || currentMode === 'vb') && c1.dataset.example) {
            defText.innerHTML = '<div class="def-text">' + c1.dataset.def + '</div>';
            showExamplePopup(c1.dataset.example);
        } else {
            defText.innerHTML = '<div class="def-text">' + c1.dataset.def + '</div>';
        }
        defContainer.classList.add('shock-container');
        defText.classList.add('shock-text');

        createStars();

        setTimeout(() => {
            defContainer.classList.remove('shock-container');
            defText.classList.remove('shock-text');
        }, 600);

        c1.classList.add('matched');
        c2.classList.add('matched');
        
        matchedCount++;
        flippedCards = [];
        if (matchedCount === pairsCount) setTimeout(nextLevel, 1000);
    } else {
        playSound('audio/wrong.mp3'); 
        
        const penalty = getWrongPenalty();
        if (penalty > 0) {
            timeLeft = Math.max(0, timeLeft - penalty);
            const timerEl = document.getElementById('timer');
            timerEl.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
            
            timerEl.classList.remove('warning', 'danger');
            if (timeLeft <= 5) {
                timerEl.classList.add('danger');
            } else if (timeLeft <= 10) {
                timerEl.classList.add('warning');
            }
        }
        
        if (currentDifficulty === 'hard') {
            c1.dataset.tempId = 'exclude1';
            c2.dataset.tempId = 'exclude2';
            
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            
            shuffleUnmatchedCards();
            
            flippedCards = [];
        } else {
            setTimeout(() => {
                c1.classList.remove('flipped');
                c2.classList.remove('flipped');
                flippedCards = [];
            }, 400);
        }
    }
}

function shuffleUnmatchedCards() {
    const grid = document.getElementById('card-grid');
    const allCards = Array.from(grid.querySelectorAll('.card'));
    
    const fixedCards = []; 
    const movableCards = []; 
    
    allCards.forEach((card, index) => {
        const isMatched = card.classList.contains('matched');
        const isExcluded = card.dataset.tempId === 'exclude1' || card.dataset.tempId === 'exclude2';
        
        if (isMatched || isExcluded) {
            fixedCards.push({ index, card });
        } else {
            movableCards.push({ index, card });
        }
    });
    
    if (movableCards.length < 2) {
        allCards.forEach(card => card.removeAttribute('data-temp-id'));
        return;
    }
    
    const cardsToShuffle = movableCards.map(m => m.card);
    
    for (let i = cardsToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardsToShuffle[i], cardsToShuffle[j]] = [cardsToShuffle[j], cardsToShuffle[i]];
    }
    
    const newGridOrder = new Array(allCards.length);
    
    fixedCards.forEach(({ index, card }) => {
        newGridOrder[index] = card;
    });
    
    movableCards.forEach(({ index }, i) => {
        newGridOrder[index] = cardsToShuffle[i];
    });
    
    grid.innerHTML = '';
    newGridOrder.forEach(card => grid.appendChild(card));
    
    grid.querySelectorAll('.card').forEach(card => card.removeAttribute('data-temp-id'));
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
        if (isTimerPaused) return;
        
        timeLeft--;
        const timerEl = document.getElementById('timer');
        timerEl.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;
        
        timerEl.classList.remove('pulse');
        void timerEl.offsetWidth;
        timerEl.classList.add('pulse');
        
        timerEl.classList.remove('warning', 'danger');
        if (timeLeft <= 5) {
            timerEl.classList.add('danger');
        } else if (timeLeft <= 10) {
            timerEl.classList.add('warning');
        }
        
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

function showExamplePopup(exampleCode) {
    const popup = document.getElementById('example-popup');
    const backdrop = document.getElementById('example-backdrop');
    const codeEl = document.getElementById('example-code');
    
    if (!popup || !backdrop || !codeEl) return;
    if (!exampleCode) return;
    
    codeEl.textContent = exampleCode;
    
    isTimerPaused = true;
    
    popup.classList.remove('hidden');
    backdrop.classList.remove('hidden');
    
    if (examplePopupTimeout) clearTimeout(examplePopupTimeout);
    examplePopupTimeout = setTimeout(hideExamplePopup, 3000);
}

function hideExamplePopup() {
    const popup = document.getElementById('example-popup');
    const backdrop = document.getElementById('example-backdrop');
    
    if (popup) popup.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
    
    isTimerPaused = false;
    
    if (examplePopupTimeout) {
        clearTimeout(examplePopupTimeout);
        examplePopupTimeout = null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('example-popup');
    const backdrop = document.getElementById('example-backdrop');
    
    if (popup) {
        popup.addEventListener('click', hideExamplePopup);
    }
    if (backdrop) {
        backdrop.addEventListener('click', hideExamplePopup);
    }
});

initGame();
