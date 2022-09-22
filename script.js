let keys = {}
let letterElements = []
let canva = document.querySelector('.canva')

let numberOfRemainingLetters
let numberOfBadKeyPressed = 0

/**
 * @returns {[HTMLElement]} list of html key element
 */
function getKeyList() {
    const keyboardElement = document.querySelector("#keyboard")
    return Array.from(keyboardElement.children)
}

/**
 * @param {int} max
 * @returns {int} random value
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * @param {[HTMLElement]} keyList   List of key elements
 */
function buildKeyArray(keyList) {
    keyList.forEach(key => {
        keys[key.innerText] = {
            "pressed": false,
            "isInWord": false
        }
    })
}

/**
 * Create hideLetterElements
 * @param {*} word
 * @returns {Uppercase}
 */
function setupWord(word) {
    const upperWord = word.toUpperCase()
    const wordElement = document.querySelector(".word")
    let letter
    let letterElement

    for (let i = 0; i < upperWord.length; i++) {
        letter = upperWord.charAt(i)
        keys[letter].isInWord = true
        letterElement = createHideLetterElement(i)
        wordElement.appendChild(letterElement)
        letterElements.push(letterElement)
    }
    return upperWord
}

/**
 * function that show a hidden letter
 * @param {string} word
 */
function showOneLetter(word) {
    const letterToShow = word.charAt(getRandomInt(numberOfRemainingLetters))
    keys[letterToShow].pressed = true
    document.querySelector(`.key#${letterToShow}`).classList.add("goodKey")
    numberOfRemainingLetters -= revealLetter(letterToShow, getLettersPosition(letterToShow, word))
}

/**
 * Reveal one letter
 * @param {*} letter
 * @param {*} lettersPosition   position of letter to reveal
 * @returns number of occurences of revealed letter
 */
function revealLetter(letter, lettersPosition) {
    let nbLetters = 0
    for (let i = 0; i < lettersPosition.length; i++) {
        console.log(letterElements[lettersPosition[i]])
        letterElements[lettersPosition[i]].innerText = letter
        nbLetters++
    }
    return nbLetters
}

/**
 * Create a hide letter element
 * @param {*} index
 * @returns {HTMLElement} letterElement
 */
function createHideLetterElement(index) {
    const letterElement = document.createElement("div")
    letterElement.innerText = "\u00A0"
    letterElement.setAttribute("class","letter");
    letterElement.setAttribute("id",index);
    return letterElement
}

/**
 * @param {string} letter
 * @param {string} word
 * @returns {[int]} positions of @param letter to show in @param word
 */
function getLettersPosition(letter, word) {
    positions = []
    for (let i = 0; i < word.length; i++) {
        if (word[i] == letter)  {
            positions.push(i)
        }
    }
    return positions
}

/**
 * Add event listner on key press
 * @param {HTMLElement} keyList
 * @param {string} word
 */
function addKeyPressListner(keyList, word) {
    keyList.forEach(key => {
        /**
         * On event "click" :
         *      Anonymous function that check if key pressed is in word. And do consequences actions.
         */
        key.addEventListener("click", () => {
            if (!keys[key.innerText].pressed) {
                if (keys[key.innerText].isInWord) {
                    console.log(key.innerText)
                    key.classList.add("goodKey")
                    numberOfRemainingLetters -= revealLetter(key.innerText, getLettersPosition(key.innerText, word))
                } else {
                    key.classList.add("badKey")
                    numberOfBadKeyPressed++
                    updateCanva()
                }
                keys[key.innerText].pressed = true
                if (numberOfBadKeyPressed == 5) {
                    endGame(false)
                } else if (numberOfRemainingLetters == 0) {
                    endGame(true)
                }
            }
        })
    })
}

/**
 * Convert degrees to radians
 * @param {int} degrees
 * @returns radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/** Add base in canva */
function addBaseInCanva(ctx) {
    ctx.fillRect(100, 130, 100, 8)
}

/** Add pole in canva */
function addPoleInCanva(ctx) {
    ctx.fillRect(126, 30, 8, 100)
}

/** Add beam in canva */
function addBeamInCanva(ctx) {
    ctx.fillRect(120, 35, 70, 6)
}

/** add rope in canva */
function addRopeInCanva(ctx) {
    ctx.fillRect(175, 40, 3, 20)
    ctx.beginPath()
    ctx.arc(176.5, 70, 10, degToRad(0), degToRad(360), false)
    ctx.stroke()
}

/** add guy in canva */
function addGuyInCanva(ctx) {
    ctx.beginPath();
    ctx.arc(176.5, 73, 7, degToRad(0), degToRad(360), false);
    ctx.fill();

    ctx.fillRect(174, 80, 5, 20)
    ctx.fillRect(162, 85, 30, 2)

    ctx.rotate(degToRad(70))
    ctx.fillRect(150, -134, 20, 3)

    ctx.rotate(degToRad(45))
    ctx.fillRect(12, -202, 20, 3)
}

/** Update canva for the hangman */
function updateCanva() {
    const ctx = canva.getContext('2d')
    ctx.fillStyle = 'rgb(0, 0, 0)'
    switch(numberOfBadKeyPressed) {
        case 1:
            addBaseInCanva(ctx)
            break
        case 2:
            addPoleInCanva(ctx)
            break
        case 3:
            addBeamInCanva(ctx)
            break
        case 4:
            addRopeInCanva(ctx)
            break
        case 5:
            addGuyInCanva(ctx)
            break
    }
}

/**
 * function that calls actions when game is over
 * @param {bool} isWin  true if is win false else
 */
function endGame(isWin) {
    for (const [key, value] of Object.entries(keys)) {
        value.pressed = true
    }
    if (isWin) {
        console.log("Its win ! :D")
    } else {
        console.log("You loose :O")
    }
}

/**
 * Function that setup and start game
 */
function startGame() {
    const keyList = getKeyList()
    keys = {}
    buildKeyArray(keyList)
    const word = setupWord("testons")
    numberOfRemainingLetters = word.length
    showOneLetter(word)
    addKeyPressListner(keyList, word)
}

window.onload = () => {
    startGame()
    document.querySelector("button.reload").addEventListener("click", () => {
        startGame()
    })
}
