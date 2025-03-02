
document.addEventListener("DOMContentLoaded", () => {
  const startScreen = document.getElementById("startScreen");
  const gameContainer = document.getElementById("game-container");
  const startButton = document.getElementById("startButton");
  const gameStatus = document.getElementById("game-status");
  const timeDisplay = document.getElementById("time");
  const scoreDisplay = document.getElementById("score");
  const holesContainer = document.getElementById("holes-container");

  let score = 0, time = 10, gameStarted = false, gameInterval;

  // スタートボタンをクリック //
  startButton.addEventListener("click", () => {
    startScreen.classList.add("hidden");  // 説明画面を非表示
    gameContainer.classList.remove("hidden"); // ゲーム画面を表示
    startGame();  // ここでゲームを開始する
  });

  function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    score = 0;
    time = 10; // 残り時間をリセット
    scoreDisplay.textContent = `得点: ${score}`;
    startButton.textContent = "STOP";

    let moleIntervalTime = 1000;  // 最初は1秒ごとに出現

    // すべての穴のもぐらをリセット
    document.querySelectorAll(".hole img").forEach(img => {
      if (img.classList.contains("mole") || img.classList.contains("wrong01") || img.classList.contains("wrongMole02")) {
          img.remove();
        }
      });

    function spawnMoleLoop() {
        if (!gameStarted) return; // ゲームが終了したら止める

        randomMole();
        
        // もぐらの出現間隔を短くする（最大で400msまで）
        if (moleIntervalTime > 170) {
            moleIntervalTime -= 100;  // 100msずつ短縮
        }

        setTimeout(spawnMoleLoop, moleIntervalTime);
    }

    spawnMoleLoop(); // ループ開始

    // 残り時間のカウントダウンを開始
    timeInterval = setInterval(() => {
        time--;
        document.getElementById("timeValue").textContent = time;

        if (time <= 0) {
            stopGame(); // 時間が 0 になったらゲームを止める
        }
    }, 1000);
}

function stopGame() {
    clearInterval(timeInterval); // カウントダウンを止める
    gameStarted = false; // これで `spawnMoleLoop()` のループが止まる
    startButton.textContent = "START";
    gameStatus.textContent = `ゲーム終了！ 得点: ${score}`;
}


  function randomMole() {
    const holes = document.querySelectorAll(".hole");

    function getRandomHole () {
      const availableHoles = [...holes].filter(hole => !hole.dataset.active);
      if(availableHoles.length === 0) return null;
      return availableHoles[Math.floor(Math.random() * availableHoles.length)];
    }

    function showMole () {
      const hole = getRandomHole();
      if (!hole) return;
      hole.dataset.active = true; 
      hole.appendChild(moleElement);
      const hideTimeout = setTimeout(() => {
        if (moleElement.parentElement) {
            hole.removeChild(moleElement);
        }
        delete hole.dataset.active;
    }, 950);

    // 🔹 クリックされたら `setTimeout` を止めて、代わりに 5 秒間表示
    moleElement.addEventListener("click", () => {
        clearTimeout(hideTimeout); // 🔥 もぐらが勝手に消えないようにする
    });
    }

    let moleType;
    const randomNum = Math.random();
    if (randomNum < 0.6) {
        moleType = 'correct';
    } else if (randomNum < 0.8) {
        moleType = 'wrong01';
    } else {
        moleType = 'wrongMole02';
    }

    const moleElement = createMole(moleType);

    moleElement.style.display = "block"; //もぐらを表示
    
    showMole();
  }

  // クリックイベントを親要素である holesContainer で管理する
  holesContainer.addEventListener("click", function(event) {
    // クリックされたターゲットがもぐら画像かどうかを確認
    const moleElement = event.target;
    
    // クリックされた要素が画像で、かつそのクラス名が "mole" や "wrong01" や "wrongMole02" の場合に処理を行う
    if (moleElement.tagName.toLowerCase() === "img" && (moleElement.classList.contains("mole") || moleElement.classList.contains("wrong01") || moleElement.classList.contains("wrongMole02"))) {
      handleMoleClick(moleElement);
    }
  });

  function createMole(type) {
    const moleElement = document.createElement("img");
    if (type === "correct") {
      moleElement.src = "mole-correct.png";
      moleElement.classList.add("mole");
    } else if (type === "wrong01") {
      moleElement.src = "wrongMole01.png";
      moleElement.classList.add("wrong01");
    } else if (type === "wrongMole02") {
      moleElement.src = "wrongMole02.png";
      moleElement.classList.add("wrongMole02");
    }
    
    moleElement.classList.add(type);
    return moleElement;
  }

  function handleMoleClick(moleElement) {
    // クラス名が "mole" や "wrong01" や "wrongMole02" に基づいて得点を処理する
    if (moleElement.classList.contains("mole")) {
      score += 100;  // 正しいもぐらの場合は得点を加算
      moleElement.src = "mole-correct_hit.png";  // 叩かれた後の画像に変更
    } else if (moleElement.classList.contains("wrong01")) {
      score -= 50;
      moleElement.src = "wrongMole01_hit.png";
  } else if (moleElement.classList.contains("wrongMole02")) {
      score -= 50;
      moleElement.src = "wrongMole02_hit.png"; 
  }

    scoreDisplay.textContent = `得点: ${score}`;
    // 変更した画像を短時間表示してから削除
    setTimeout(() => {
      if (moleElement.parentElement) {
          moleElement.parentElement.removeChild(moleElement);
      }
  }, 800); // 1000ms後に非表示
  }

  function stopGame() {
    clearInterval(timeInterval);
    clearInterval(gameInterval);
    gameStarted = false;
  
    //ゲーム終了画面を表示
    const gameOverScreen = document.getElementById("endScreen");
    const finalScore = document.getElementById("finalScore");
  
    finalScore.textContent = `得点: ${score}点`;
    endScreen.classList.remove("hidden");
  }

   //リスタートボタン
  document.getElementById("restartButton").addEventListener("click", () => {
    location.reload(); // ページをリロードしてリセット
  });

});
