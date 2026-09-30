/**
 * 異世界音遊記憶問答 - Galgame 遊戲邏輯引擎
 */

// 1. 遊戲問答資料結構
const questions = [
    {
        speaker: "戶山香澄",
        question: "武士道老闆是誰？",
        options: ["本谷高明", "木谷高高", "木谷高明", "社長好帥"],
        correct: 2,
        reactionCorrect: "對！是木谷高明！我好像想起來了！",
        reactionWrong: "唔……好像不是這個答案，再想想看！"
    },
    {
        speaker: "星乃一歌",
        question: "CHUNITHM 是不是手遊？",
        options: ["是", "不是", "幹社長都不揪", "社長求救！(我不會理你哈哈）"],
        correct: 1,
        reactionCorrect: "原來如此……所以它不是手遊！",
        reactionWrong: "等等……我覺得答案好像不是這個。"
    },
    {
        speaker: "戶山香澄",
        question: "Parappa the rapper 的主角叫什麼？",
        options: ["Parrpa", "PapaPa", "Parappa", "社長"],
        correct: 2,
        reactionCorrect: "Parappa！這個名字我想起來了！",
        reactionWrong: "不對不對！再仔細想想！"
    },
    {
        speaker: "星乃一歌",
        question: "在介紹街機時，社長共舉例了幾個例子？",
        options: ["1個", "2個", "3個", "跟社幹一樣多人"],
        correct: 2,
        reactionCorrect: "是3個！我們又想起一件事情了。",
        reactionWrong: "好像不是這個……"
    },
    {
        speaker: "戶山香澄",
        question: "BangDream 共有幾個團？",
        options: ["12個", "9個", "關我屁事", "好多個"],
        correct: 0,
        reactionCorrect: "12個！我好像真的開始恢復記憶了！",
        reactionWrong: "奇怪……明明就在嘴邊……"
    },
    {
        speaker: "星乃一歌",
        question: "社長介紹的第一款音遊是什麼？",
        options: ["touch me", "toUch Me", "TOUCH ME", "Touch me"],
        correct: 3,
        reactionCorrect: "是 Touch me！這個我記起來了！",
        reactionWrong: "大小寫……好像很重要……"
    },
    {
        speaker: "戶山香澄",
        question: "社長的啟蒙音遊是哪一款？",
        options: ["這款", "那款", "夢幻鋼琴", "答案是世界計畫"],
        correct: 2,
        reactionCorrect: "夢幻鋼琴！原來這就是啟蒙音遊！",
        reactionWrong: "嗯……好像不是這個答案。"
    },
    {
        speaker: "星乃一歌",
        question: "世界計畫範例影片試舉哪個團當例子？",
        options: ["25時", "Wonderlands Showtime", "Leo/need", "More More Jump"],
        correct: 0,
        reactionCorrect: "25時……我想起來了！",
        reactionWrong: "好像不是這個團……"
    },
    {
        speaker: "戶山香澄",
        question: "下列哪一個不是社長舉例的手機音遊？",
        options: ["Cytus", "Hololive Dreams", "偶像夢幻祭", "夢幻鋼琴"],
        correct: 1,
        reactionCorrect: "Hololive Dreams！原來這個不是社長舉例的手機音遊！",
        reactionWrong: "等等，好像有哪裡不對……"
    },
    {
        speaker: "星乃一歌",
        question: "滿不滿意今天的課？",
        options: ["滿意", "滿意", "滿意", "滿意"],
        correct: [0, 1, 2, 3], // 全部皆算對
        reactionCorrect: "太好了！看來你真的很滿意今天的課！",
        reactionWrong: "太好了！看來你真的很滿意今天的課！"
    }
];

// 開場與結尾劇情對話腳本
const introDialogue = [
    { speaker: "戶山香澄", text: "這裡是哪裡……？感覺是一個從來沒看過的世界……" },
    { speaker: "星乃一歌", text: "妳也是穿越過來的嗎？請問……這裡是哪裡？" },
    { speaker: "戶山香澄", text: "哇！妳好！我是戶山香澄！但我……好像想不起來自己原本住在哪裡了……" },
    { speaker: "星乃一歌", text: "我是星乃一歌。其實我也一樣，頭好暈……只記得自己好像非常喜歡音樂……" },
    { speaker: "戶山香澄", text: "對！音樂！我也最喜歡音樂了！還有……好像跟某個「音樂遊戲」的世界有關……" },
    { speaker: "星乃一歌", text: "看來我們都暫時失憶了呢。不過……那邊好像有人在看著我們？" },
    { speaker: "戶山香澄", text: "真的耶！太好了！那位朋友，你可以透過問答，幫助我們找回失去的記憶嗎？" }
];

const endingDialogue = [
    { speaker: "星乃一歌", text: "我想起來了……全部都想起來了！" },
    { speaker: "戶山香澄", text: "我也是！原本的樂團、同伴們……還有那些閃閃發光的歌曲！" },
    { speaker: "星乃一歌", text: "原來我們原本生活在不同的音樂世界。" },
    { speaker: "戶山香澄", text: "謝謝你！如果沒有你的幫助，我們可能還是什麼都想不起來。" },
    { speaker: "星乃一歌", text: "真的非常謝謝你。" },
    { speaker: "雙人", text: "謝謝你幫助我們找回記憶！" }
];

// 2. 狀態管理
let gameState = "START"; // START, INTRO, QUIZ, REACTION, ENDING_DIALOGUE, END
let currentQIndex = 0;
let currentScript = [];
let currentScriptIndex = 0;

// 打字機控制變數
let isTyping = false;
let currentFullText = "";
let typingTimer = null;

// DOM 元素引用
const startScreen = document.getElementById("start-screen");
const mainScreen = document.getElementById("main-screen");
const endingScreen = document.getElementById("ending-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const charKasumi = document.getElementById("char-kasumi");
const charIchika = document.getElementById("char-ichika");
const dialogueBox = document.getElementById("dialogue-box");
const speakerNameEl = document.getElementById("speaker-name");
const dialogueTextEl = document.getElementById("dialogue-text");

const quizProgressEl = document.getElementById("quiz-progress");
const currentQNumEl = document.getElementById("current-q-num");
const optionsContainer = document.getElementById("options-container");
const optionBtns = document.querySelectorAll(".option-btn");
const resultBanner = document.getElementById("result-banner");

// 3. 初始化與事件綁定
window.addEventListener("DOMContentLoaded", () => {
    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", resetGame);
    dialogueBox.addEventListener("click", handleDialogueClick);

    optionBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const selectedIdx = parseInt(btn.getAttribute("data-index"));
            handleAnswer(selectedIdx);
        });
    });
});

// 開始遊戲
function startGame() {
    startScreen.classList.remove("active");
    mainScreen.classList.add("active");
    
    currentQIndex = 0;
    gameState = "INTRO";
    currentScript = introDialogue;
    currentScriptIndex = 0;
    
    quizProgressEl.classList.add("hidden");
    optionsContainer.classList.add("hidden");
    resultBanner.classList.add("hidden");

    showNextScriptSentence();
}

// 重新遊玩
function resetGame() {
    endingScreen.classList.remove("active");
    startScreen.classList.add("active");
    gameState = "START";
}

// 4. 打字機與對話系統核心
function playDialogue(speaker, text) {
    // 設置發言者名字與款式
    speakerNameEl.textContent = speaker;
    if (speaker === "星乃一歌") {
        speakerNameEl.classList.add("ichika-style");
    } else {
        speakerNameEl.classList.remove("ichika-style");
    }

    // 設置角色高亮亮暗
    if (speaker === "戶山香澄") {
        charKasumi.classList.add("active-speaker");
        charIchika.classList.remove("active-speaker");
    } else if (speaker === "星乃一歌") {
        charKasumi.classList.remove("active-speaker");
        charIchika.classList.add("active-speaker");
    } else { // 雙人或旁白
        charKasumi.classList.add("active-speaker");
        charIchika.classList.add("active-speaker");
    }

    // 啟動打字機效果
    currentFullText = text;
    dialogueTextEl.textContent = "";
    isTyping = true;
    let charIdx = 0;

    if (typingTimer) clearInterval(typingTimer);

    typingTimer = setInterval(() => {
        if (charIdx < currentFullText.length) {
            dialogueTextEl.textContent += currentFullText.charAt(charIdx);
            charIdx++;
        } else {
            completeTyping();
        }
    }, 35);
}

// 立即完成打字機
function completeTyping() {
    if (typingTimer) clearInterval(typingTimer);
    dialogueTextEl.textContent = currentFullText;
    isTyping = false;
}

// 對話框點擊處理 (兩段式點擊)
function handleDialogueClick() {
    // 如果選項顯示中，禁止點擊對話框推進
    if (!optionsContainer.classList.contains("hidden")) return;

    if (isTyping) {
        // 第一次點擊：立刻顯示全文字
        completeTyping();
    } else {
        // 第二次點擊：推進劇情或狀態
        if (gameState === "INTRO") {
            currentScriptIndex++;
            showNextScriptSentence();
        } else if (gameState === "QUIZ_INTRO") {
            showQuizOptions();
        } else if (gameState === "REACTION") {
            resultBanner.classList.add("hidden");
            currentQIndex++;
            if (currentQIndex < questions.length) {
                loadQuiz(currentQIndex);
            } else {
                startEndingDialogue();
            }
        } else if (gameState === "ENDING_DIALOGUE") {
            currentScriptIndex++;
            showNextEndingSentence();
        }
    }
}

// 腳本對話推進 (開場)
function showNextScriptSentence() {
    if (currentScriptIndex < currentScript.length) {
        const line = currentScript[currentScriptIndex];
        playDialogue(line.speaker, line.text);
    } else {
        // 開場劇情結束 -> 載入第 1 題
        loadQuiz(0);
    }
}

// 5. 問答系統核心
function loadQuiz(index) {
    gameState = "QUIZ_INTRO";
    const qData = questions[index];

    quizProgressEl.classList.remove("hidden");
    currentQNumEl.textContent = index + 1;

    optionsContainer.classList.add("hidden");
    resultBanner.classList.add("hidden");

    // 由角色提出問題
    playDialogue(qData.speaker, qData.question);
}

// 顯示四個選項
function showQuizOptions() {
    gameState = "QUIZ_OPTIONS";
    const qData = questions[currentQIndex];

    optionBtns.forEach((btn, idx) => {
        btn.textContent = `${String.fromCharCode(65 + idx)}. ${qData.options[idx]}`;
    });

    optionsContainer.classList.remove("hidden");
}

// 玩家選擇答案處理
function handleAnswer(selectedIdx) {
    optionsContainer.classList.add("hidden");
    const qData = questions[currentQIndex];

    let isCorrect = false;
    if (Array.isArray(qData.correct)) {
        isCorrect = qData.correct.includes(selectedIdx);
    } else {
        isCorrect = (selectedIdx === qData.correct);
    }

    // 顯示結果橫條
    resultBanner.classList.remove("hidden", "correct", "wrong");
    if (isCorrect) {
        resultBanner.classList.add("correct");
        resultBanner.textContent = "✓ 正確！";
    } else {
        resultBanner.classList.add("wrong");
        resultBanner.textContent = "✕ 答錯了！";
    }

    // 進入反應階段
    gameState = "REACTION";
    const reactionText = isCorrect ? qData.reactionCorrect : qData.reactionWrong;
    playDialogue(qData.speaker, reactionText);
}

// 6. 結尾劇情與結局畫面
function startEndingDialogue() {
    gameState = "ENDING_DIALOGUE";
    quizProgressEl.classList.add("hidden");
    currentScript = endingDialogue;
    currentScriptIndex = 0;
    showNextEndingSentence();
}

function showNextEndingSentence() {
    if (currentScriptIndex < currentScript.length) {
        const line = currentScript[currentScriptIndex];
        playDialogue(line.speaker, line.text);
    } else {
        // 劇情結束，進入最終音遊大師畫面
        mainScreen.classList.remove("active");
        endingScreen.classList.add("active");
        gameState = "END";
    }
}
