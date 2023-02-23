const cards = document.querySelectorAll(".memory-card");
const count = document.querySelector(".count");

let hasFlippedCard = false; // 用於記錄玩家是否已經點擊了一張牌
let lockBoard = false; // 用來防止使用者在兩張卡牌翻開後翻開更多的卡牌
let firstCard, secondCard; // 用來追蹤使用者翻開的第一張卡牌和第二張卡牌
let counter = 0;
let totalCardCount = cards.length; // 計算牌的總數

function flipCard() {
  if (lockBoard) return; //防止兩張牌都被翻開時，還能翻別的牌
  if (this == firstCard) return; //如果玩家已經點擊這張牌的話，就return

  this.classList.add("flip");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  } else {
    secondCard = this;
  }

  checkForMatch();
}

function checkForMatch() {
  // 如果牌組配對成功 => isMatch
  // 就不可以再點擊那組牌 => disableCards()
  // 配對錯誤就把該牌組蓋起來 => unflipCards()

  counter++;
  count.innerHTML = `點擊次數:${counter}`;
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  if (isMatch) {
    disableCards();

    // 檢查是否所有牌都已經被翻開
    totalCardCount -= 2;
    if (totalCardCount == 0) {
      setTimeout(() => {
        alert("遊戲結束!");
        alert(`你共花了${counter}次`);
      }, 500);
      return;
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  // 移除監聽事件，釋放記憶體
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * 16);
    card.style.order = randomPos;
  });
})();

cards.forEach((card) => card.addEventListener("click", flipCard));
