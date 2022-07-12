/**
 @author kiwi
 @date 2022.07.10

 [
     {
        'id': 8000,
        'key': 'Precision',
        'icon': iconURI,
        'name': Precision',
        'slots': [ ← list of objects with a single key, 'runes'
            {
                'runes': [
                    {
                        'id': 8005,
                        'key': "PressTheAttack",
                        'icon': imgURI,
                        'name': 'Press the Attack',
                        'shortDesc': blurb,
                        'longDesc': blurb
                    },
                    {
                        'id': 8005,
                        'key': "LethalTempo",
                        ...
                    },
                ]
            }
        ]
     },
     ...,
     {}
 ]

 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */

let rootURI = 'https://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/'
let runesPath = 'runesReforged.json'

let runesReforged
let runeObj /* compiled data filled in via JSON */

function preload() {
    font = loadFont('data/consola.ttf')
    let req = rootURI + runesPath
    runesReforged = loadJSON(req)
}

/**
 "After you have selected your Primary Path you can select two Runes from the
 Secondary Path you have chosen. This Secondary Path doesn't provides you
 with a Keystone Rune unlike the Primary Path."

 coding plan
 ☒ load runes reforged JSON
 ☒ output 5 branch names
 ☐ output all slot names

 ☐ display one image
 ☐ display domination tree images
 ☐ display array of 5 images

 */

function setup() {
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    // for (const path of Object.keys(runesReforged)) {}

    /* runesReforged.JSON is actually a 5-object array, one for each path */
    const paths = []
    for (const index in runesReforged) {
        /* this returns {id: 8100, key: 'Domination', icon: etc} */
        paths.push(runesReforged[index])
    }

    for (const path of paths) {
        console.log(`path name → ${path['name']}`)

        /*
            each path has 4 sets of runes with keystone at top
            each path has a key, 'slots':
                list of objects with a single key, 'runes'
                keystone is the 1st of 4 slots
         */
        let slots = path['slots']
        for (const slotIndex in slots) {
            const slot = slots[slotIndex]
            const runesPerSlot = Object.keys(slot['runes']).length
            console.log(`» ${path['name']}, tier ${int(slotIndex)+1} → ${runesPerSlot} runes`)

            for (const runeIndex in Object.keys(slot['runes'])) {
                const rune = slot['runes'][runeIndex]
                if (int(slotIndex) === 0) {
                    console.log(`🗝️: ${rune['name']}`)
                } else {
                    console.log(`${rune['name']}`)
                }
            }
        }
    }
}


function draw() {
    background(234, 34, 24)

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()

    if (frameCount > 3000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

        /* semi-transparent background */
        fill(0, 0, 0, 10)
        rectMode(CORNERS)
        const TOP_PADDING = 3 /* extra padding on top of the 1st line */
        rect(
            0,
            height,
            width,
            DEBUG_Y_OFFSET - LINE_HEIGHT*this.debugMsgList.length - TOP_PADDING
        )

        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}