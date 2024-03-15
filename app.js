const gameNode = document.querySelector("#game-board");
const winningText = document.querySelector("#victory-message");
const startButton = document.querySelector("#new-game-button");

const visibleClass = "visible";
const flipTimeout = 650;

const cardElements = ["🍓", "🍉", "🍌", "🍏", "🍒", "🍇"];
const cardAmount = 12;

let visibleCards = [];

startButton.addEventListener("click", startGame);

function startGame() {
  // Очищаем игровое поле
  [gameNode, winningText].forEach((element) => (element.innerHTML = ""));

  const cardValues = generateArrayWithPairs(cardElements, cardAmount);

  cardValues.forEach(renderCard);

  const renderedCards = document.querySelectorAll(".card");

  renderedCards.forEach((card) => card.classList.add(visibleClass));

  setTimeout(() => {
    renderedCards.forEach((card) =>
      card.classList.remove(visibleClass)
    );
  }, flipTimeout * 2);
}

function generateArrayWithPairs(arr, fieldSize) {
  if (arr.length * 2 !== fieldSize) {
    const errorMessage =
      "Невозможно создать массив с парами из указанного массива и размера.";

    console.error(errorMessage);
    return null;
  }

  const randomArray = [];
  const elementCounts = {};

  for (const item of arr) {
    elementCounts[item] = 0;
  }

  while (randomArray.length < fieldSize) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomElement = arr[randomIndex];

    if (elementCounts[randomElement] < 2) {
      randomArray.push(randomElement);
      elementCounts[randomElement]++;
    }
  }

  return randomArray;
}

function renderCard(cardText = "") {
  const card = document.createElement("div");
  card.classList.add("card");

  const cardInner = document.createElement("div");
  cardInner.classList.add("card-inner");

  const cardFront = document.createElement("div");
  cardFront.classList.add("card-front");

  const cardBack = document.createElement("div");
  cardBack.classList.add("card-back");

  cardFront.textContent = "?";
  cardBack.textContent = cardText;

  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);

  card.appendChild(cardInner);

  card.addEventListener("click", handleCardClick.bind(this, card));

  gameNode.appendChild(card);
}

function handleCardClick(card) {
  // Не реагируем на нажатие на открытую карточку
  if (card.classList.contains(visibleClass)) {
    return;
  }

  // Функция проверки выигрыша
  const checkVictory = () => {
    const visibleCardsNodes = document.querySelectorAll(
      `.${visibleClass}`
    );

    // Если кол-во открытых карт равно общему кол-ву карт, то это победа
    const isVictory = visibleCardsNodes.length === cardAmount;
    const victoryMessage = "Поздравляю, вы победили!";

    if (isVictory) {
      winningText.textContent = victoryMessage;
    }
  };

  // Проверяем на выигрыш после анимации открытия карты
  card
    .querySelector(".card-inner")
    .addEventListener("transitionend", checkVictory);

  // Добавляем карте класс visible, запуская анимацию поворота
  card.classList.add(visibleClass);

  // Добавляем карту в массив открытых карт
  visibleCards.push(card);

  // Так как нам нужно проверять каждые 2 отрытые карты, делаем такое условие
  if (visibleCards.length % 2 !== 0) {
    return;
  }

  // Получаем последнюю и предпоследнюю открытые карты, чтобы проверять совпадают ли они
  const [prelastCard, lastCard] = visibleCards.slice(-2);

  // Если две последние открытые карты не совпадают, убираем их из массива открытых карт
  if (lastCard.textContent !== prelastCard.textContent) {
    visibleCards = visibleCards.slice(0, visibleCards.length - 2);

    // Через 500 мс закрываем те карты, которые не совпали
    setTimeout(() => {
      [lastCard, prelastCard].forEach((card) =>
        card.classList.remove(visibleClass)
      );
    }, flipTimeout);
  }
}

startGame();