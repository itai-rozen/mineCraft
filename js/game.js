const game = {
    board: null,
    mineCraftClasses: ['sky', 'cloud', 'leaves', 'wood', 'stone', 'grass', 'ground'],
    domElements: {
        gameBoard: dqs('.game-board'),
        gameBoardCopy: null,
        shovelButton: dqs('.shovel-btn'),
        axeButton: dqs('.axe-btn'),
        pickAxeButton: dqs('.pickaxe-btn'),
        startButton: dqs('.start-btn'),
        startScreen: dqs('.start-screen'),
        inventory: {
            grass: dqs('.inv-grass'),
            wood: dqs('.inv-wood'),
            leaves: dqs('.inv-wood'),
            stone: dqs('.inv-stone'),
            ground: dqs('.inv-ground')
        },
    },
    booleans: {
        isShovelOn: false,
        isAxeOn: false,
        isPickAxeOn: false,
        isHoldingElement: false
    },
    currItem: null,
    inventory: {
        grass: 0,
        wood: 0,
        ground: 0,
        stone: 0
    },
    handleClick(e) {
        console.log(e.key)
        if (this.isHoldingElement) { }
        else if (this.isAxeOn || this.isPickaxeOn || this.isShovelOn) {

        } else {

        }
    }
}

game.domElements.startButton.addEventListener('click', () => init())

function init(){
    const { domElements, inventory } = game
    const { startScreen, shovelButton, axeButton, pickAxeButton } = domElements
    addClass(startScreen, 'hide')
    shovelButton.addEventListener('click', useTool)
    axeButton.addEventListener('click', useTool)
    pickAxeButton.addEventListener('click', useTool)
    inventory.content = null
    createBoard()
    renderBoard()
}
init()
function updateToolActiveClass(el) {
    console.log(el.classList[0])
    const toolButtons = dqsa('.tool-btn')
    toolButtons.forEach(button => {
        console.log(button.classList[0])
        if (button.classList[0] === el.classList[0]) button.classList.toggle('active')
        else removeClass(button,'active')
    })
}
function useTool({ target }) {
    let { booleans } = game
    const dataAttribute = target.getAttribute('data-boolean')
    for (let toolBoolean in booleans) {
        booleans[toolBoolean] = (toolBoolean === dataAttribute) ? !booleans[toolBoolean] : false
    }
    updateToolActiveClass(target)
}

const inventoryItemsEl = dqsa('.inventory-item')
inventoryItemsEl.forEach(itemEl => {
    let dataAttr = itemEl.getAttribute('data-item')
    itemEl.addEventListener('click', () => {
        if (+itemEl.textContent === 0 || game.booleans.isHoldingElement) return
        game.booleans.isPickAxeOn = false
        game.booleans.isShovelOn = false
        game.booleans.isAxeOn = false
        game.currItem = dataAttr
        game.booleans.isHoldingElement = true
        game.inventory[game.currItem]--
        itemEl.querySelector('.item-amount').textContent--
        console.log('inventory after removing: ',itemEl.textContent)
        if (+itemEl.textContent === 0) removeClass(itemEl,dataAttr)
    })
})


function createBoard() {
    // const ROWS = 25
    // const COLS = 25
    // const board = [Array(ROWS).fill(Array(COLS).fill(0))]
    game.board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 4, 0, 0],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 4, 0, 0],
        [0, 0, 0, 0, 4, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 4, 4, 4, 0],
        [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
        [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
    ];
}

function renderBoard() {
    game.board.forEach((gameRow, i) => gameRow.forEach((gameTile, j) => {
        const { booleans, inventory, domElements, mineCraftClasses } = game
        const currBlockClass = mineCraftClasses[gameTile]
        const currInventoryDomEl = domElements.inventory[currBlockClass]
        const tileEl = document.createElement('div')
        tileEl.setAttribute('data-x', i)
        tileEl.setAttribute('data-y', j)
        addClass(tileEl, 'sky')
        addClass(tileEl, currBlockClass)
        tileEl.addEventListener('click', () => {
            console.log('hi giant event listener')
            const { isAxeOn, isPickAxeOn, isShovelOn } = booleans
            const { currItem } = game
            if ((isAxeOn && (currBlockClass === 'wood' || currBlockClass === 'leaves')) ||
                (isPickAxeOn && (currBlockClass === 'stone')) ||
                (isShovelOn && (currBlockClass === 'ground' || currBlockClass === 'grass'))) {
                console.log('item is harvested!')
                gameTile = 0
                inventory[currBlockClass]++
                removeClass(tileEl, currBlockClass)
                if (currBlockClass === 'leaves') inventory.wood++
                else game.inventory[currBlockClass]++
                
                addClass(currInventoryDomEl, currBlockClass === 'leaves' ? 'wood' : currBlockClass)
                currInventoryDomEl.querySelector('.item-amount').textContent++
            }
            if (!booleans.isAxeOn && !booleans.isPickAxeOn && !booleans.isShovelOn && booleans.isHoldingElement && gameTile === 0) {
                const classIdx = mineCraftClasses.findIndex(mineCraftClass => mineCraftClass === currItem)
                console.log('class index @ tile event listener: ',classIdx)
                addClass(tileEl,mineCraftClasses[classIdx])
                booleans.isHoldingElement = false
            }        
        })
        game.domElements.gameBoard.append(tileEl)
    }))
}


