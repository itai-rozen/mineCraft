const game = {
    board: null,
    mineCraftClasses: ['sky', 'cloud', 'leaves', 'wood', 'stone', 'grass', 'ground'],
    domElements: {
        gameBoard: dqs('.game-board'),
        shovelButton: dqs('.shovel-btn'),
        axeButton: dqs('.axe-btn'),
        pickAxeButton: dqs('.pickaxe-btn'),
        startButton: dqs('.start-btn'),
        restartButton: dqs('.restart-btn'),
        createButton: dqs('.create-btn'),
        newPlayButton: dqs('.play-created-btn'),
        startScreen: dqs('.start-screen'),
        inventoryContainer: {
            grass: dqs('.inv-grass'),
            wood: dqs('.inv-wood'),
            leaves: dqs('.inv-leaves'),
            stone: dqs('.inv-stone'),
            ground: dqs('.inv-ground')
        },
    },
    booleans: {
        isShovelOn: false,
        isAxeOn: false,
        isPickAxeOn: false,
        isHoldingElement: false,
    },
    currItem: null,
    inventory: {
        grass: 0,
        wood: 0,
        leaves: 0,
        ground: 0,
        stone: 0
    }
}

game.domElements.startButton.addEventListener('click', () => init)

function init() {
    const { domElements, inventory } = game
    const { gameBoard, inventoryContainer, startScreen, createButton, restartButton } = domElements
    addClass(startScreen, 'hide')
    const toolButtons = dqsa('.tool-btn')
    toolButtons.forEach(button => button.addEventListener('click', handleTool))
    const inventoryItems = dqsa('.inventory-item')
    inventoryItems.forEach(itemEl => itemEl.addEventListener('click', handleItem))
    restartButton.addEventListener('click', () => init())
    gameBoard.innerHTML = ''
    resetBooleans()
    resetInventory(inventory, inventoryContainer)
    createBoard()
    renderBoard(game.board)
}
init()
function updateToolActiveClass(el) {
    const toolButtons = dqsa('.tool-btn')
    toolButtons.forEach(button => {
        if (button.classList[0] === el.classList[0]) button.classList.toggle('active')
        else removeClass(button, 'active')
    })
}

function handleTool({ target }) {
    let { booleans } = game
    const dataAttribute = target.getAttribute('data-boolean')
    for (let toolBoolean in booleans) {
        booleans[toolBoolean] = (toolBoolean === dataAttribute) ? !booleans[toolBoolean] : false
    }
    updateToolActiveClass(target)
}

function handleItem({ target }) {
    const {  booleans, inventory } = game
    const itemEl = target
    const dataAttr = target.getAttribute('data-item')
    if (+itemEl.textContent === 0 || booleans.isHoldingElement) return
    resetBooleans()
    game.currItem = dataAttr
    booleans.isHoldingElement = true
    inventory[game.currItem]--
    itemEl.querySelector('.item-amount').textContent--
    if (+itemEl.textContent === 0) removeClass(itemEl, dataAttr)
}


function resetInventory(inventoryObj, inventoryDomObj) {
    for (let item in inventoryObj) inventoryObj[item] =  0
    for (let domEl in inventoryDomObj) {
        addClass(inventoryDomObj[domEl], domEl)
        inventoryDomObj[domEl].querySelector('.item-amount').textContent =  0
    }
}
function resetBooleans() {
    const { booleans } = game
    for (boolean in booleans) booleans[boolean] = false
    const toolButtonEls = dqsa('.tool-btn')
    toolButtonEls.forEach(tool => removeClass(tool, 'active'))
}

function createBoard(size = 25) {
    let board = []
    const tilesToEnhance = []

        for (let i = size - 1; i >= 0; i--) {
            board[i] = []
            for (let j = size - 1; j >= 0; j--) {
                let currCell
                    if (i > (size / 1.5)) currCell = 6
                    else if (i < (size / 4)) currCell = Math.random() > 0.95 ? 1 : 0
                    else currCell = getTile(board[i + 1][j], size, i)
                    if (currCell === 2 || currCell === 1) tilesToEnhance.push({ tile: currCell, i: i, j: j })
                board[i][j] = currCell
            }
    }

    board = enhanceTiles(tilesToEnhance, board, size)
    game.board = board

}

function getTile(nextTileNum, size, i, start = 0) {
    let currTileNum
    if (nextTileNum === 6) return getRandomIdx([5, 6])
    else if (nextTileNum === 5) return getRandomIdx([0, 3, 4, 5, 6])
    else if (nextTileNum === 3) {
        currTileNum = (Math.random() > 0.7) ? 2 : 3
        return currTileNum
    }
    else return 0

}




function enhanceTiles(tiles, board, boardLength) {
    tiles.reverse().forEach(tileObj => {
        const { i, j, tile } = tileObj
        if (i - 1 > 0) {
            board[i - 1][j] = tile
            board[i - 1][j - 1] = tile
            board[i][j - 1] = tile
            board[i - 1][j + 1] = tile
            board[i][j + 1] = tile
        }
    })
    return board
}

function renderBoard(board) {
    const { mineCraftClasses, domElements } = game
    domElements.gameBoard.innerHTML= ''
    board.forEach((gameRow, i) => gameRow.forEach((gameTile, j) => {
        const currBlockClass = mineCraftClasses[gameTile]
        const tileEl = createTileElement(i, j, currBlockClass, gameTile)
        tileEl.addEventListener('click', addTileAttributes)
        domElements.gameBoard.append(tileEl)
    }))
}


function createTileElement(i, j, elClass = "", tileNum) {
    const el = document.createElement('div')
    el.setAttribute('data-x', i)
    el.setAttribute('data-y', j)
    el.setAttribute('data-tile', tileNum)
    addClass(el, 'sky')
    addClass(el, elClass)
    return el
}

function addTileAttributes(e) {
    const { booleans, domElements, board, inventory, mineCraftClasses } = game
    const { isAxeOn, isPickAxeOn, isShovelOn } = booleans
    const tileEl = e.target
    const i = e.target.getAttribute('data-x')
    const j = e.target.getAttribute('data-y')
    const currBlockNum = board[i][j]
    let currBlockClass = mineCraftClasses[currBlockNum]
    const currInventoryDomEl = domElements.inventoryContainer[currBlockClass]
    if ((isAxeOn && (currBlockClass === 'wood' || currBlockClass === 'leaves')) ||
        (isPickAxeOn && (currBlockClass === 'stone')) ||
        (isShovelOn && (currBlockClass === 'ground' || currBlockClass === 'grass'))) {
        // item is being harvested
        harvestItem(currBlockNum, tileEl, currBlockClass, currInventoryDomEl)
    }
    // holding block item
    if (!booleans.isAxeOn && !booleans.isPickAxeOn && !booleans.isShovelOn && booleans.isHoldingElement && currBlockNum === 0) {
        placeItem(tileEl)
    }

}

function harvestItem(tileNum, el, currClass, inventoryEl) {
    tileNum = 0
    removeClass(el, currClass)
    updateInventory(currClass, inventoryEl)
}

function updateInventory(currClass, el) {
    const { inventory} = game
    addClass(el, currClass)
    inventory[currClass]++
    el.querySelector('.item-amount').textContent =  inventory[currClass]
}

function placeItem(el) {
    const { mineCraftClasses, currItem, booleans } = game
    const classIdx = mineCraftClasses.findIndex(mineCraftClass => mineCraftClass === currItem)
    addClass(el, mineCraftClasses[classIdx])
    booleans.isHoldingElement = false
}


