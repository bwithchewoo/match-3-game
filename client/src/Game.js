import { useEffect, useState, useRef } from 'react'

import anemo from "./assets/anemo.png"
import dendro from "./assets/dendro.png"
import electro from "./assets/electro.png"
import geo from "./assets/geo.png"
import hydro from "./assets/hydro.png"
import pyro from "./assets/pyro.png"
import vultur from "./assets/Vultur.jpg"
import caeli from "./assets/Caeli.jpg"
import primogem from "./assets/primogem.png"
// top left is 0,0 bottom right is 7,7
const rows = 8
const columns = 8
const candyColors = [

    anemo,
    dendro,
    electro,
    geo,
    hydro,
    pyro
]
const horizontalLineClear = caeli
const verticalLineClear = vultur
const clearAll = primogem

function Game({ user }) {
    const [boardId, setBoardId] = useState(null)
    const [pieces, setPieces] = useState([])
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [activePiece, setActivePiece] = useState(null);
    const [boardMoving, setBoardMoving] = useState(false);
    const [anemoScore, setAnemoScore] = useState(0)
    const [dendroScore, setDendroScore] = useState(0)
    const [electroScore, setElectroScore] = useState(0)
    const [geoScore, setGeoScore] = useState(0)
    const [hydroScore, setHydroScore] = useState(0)
    const [pyroScore, setPyroScore] = useState(0)
    const [initialScoreSet, setInitialScoreSet] = useState(false)

    useEffect(() => {
        if (!boardMoving && pieces) {
            // upate!
            let newPieces = []
            for (let i = 0; i < pieces.length; i++) {
                for (let j = 0; j < pieces[i].length; j++) {
                    let newPiece = { ...pieces[i][j] }
                    newPiece.row = i;
                    newPiece.column = j;
                    newPieces.push(newPiece)
                }
            }
            console.log(user)
            fetch(`/updateboard`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    'someParamKey': newPieces
                }),
            })
            if (initialScoreSet === true) {
                fetch(`/updatescore`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        'id': boardId,
                        'anemo_score': anemoScore,
                        'dendro_score': dendroScore,
                        'hydro_score': hydroScore,
                        'geo_score': geoScore,
                        'pyro_score': pyroScore,
                        'electro_score': electroScore

                    }),
                })
                    .then((r) => {
                        const hasAnemo100 = user.achievements.find(element => element.achievement_id === 1)
                        if (!hasAnemo100 && anemoScore >= 100) {
                            fetch("/user_achievements", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    "user_id": user.id,
                                    "achievement_id": 1
                                }),
                            })
                        }
                    })
            }
        }
    }, [boardMoving])

    const createCopyOfPieces = () => {
        return copyHelper(pieces)
    }
    const copyHelper = (copy_target) => {
        return copy_target.map((row) => {
            return row.map((piece) => {
                return { ...piece }
            });
        });
    }

    const increaseScore = (pieceColor, scoreIncrease) => {
        if (pieceColor === anemo) {
            let newScore = anemoScore + scoreIncrease
            setAnemoScore(newScore)
        }
        else if (pieceColor === dendro) {
            let newScore = dendroScore + scoreIncrease
            setDendroScore(newScore)
        }
        else if (pieceColor === electro) {
            let newScore = electroScore + scoreIncrease
            setElectroScore(newScore)
        } else if (pieceColor === hydro) {
            let newScore = hydroScore + scoreIncrease
            setHydroScore(newScore)
        } else if (pieceColor === pyro) {
            let newScore = pyroScore + scoreIncrease
            setPyroScore(newScore)
        } else if (pieceColor === geo) {
            let newScore = geoScore + scoreIncrease
            setGeoScore(newScore)
        }
    }

    //L match logic: look for match 3 in row -> at each index of the matching pieces, check the two pieces above and the two pieces below
    const checkForLMatch = (newPieces) => {

        let matchExists = false
        for (let i = 0; i < newPieces.length; i++) {
            for (let j = 0; j < newPieces[i].length - 2; j++) {
                const currentPiece = newPieces[i][j]
                const rightOfCurrentPiece = newPieces[i][j + 1]
                const twoRightOfCurrentPiece = newPieces[i][j + 2]
                const current3Row = [[i, j], [i, j + 1], [i, j + 2]]
                if (currentPiece.color === rightOfCurrentPiece.color && currentPiece.color === twoRightOfCurrentPiece.color) {
                    current3Row.forEach((indexes) => {
                        const row = indexes[0]
                        const col = indexes[1]

                        if (i >= 2 && newPieces[row - 1][col].color === currentPiece.color && newPieces[row - 2][col].color === currentPiece.color) {
                            matchExists = true
                            increaseScore(currentPiece.color, 5)
                            increaseScore(currentPiece.color, 5)
                            currentPiece.color = primogem
                            rightOfCurrentPiece.color = ''
                            twoRightOfCurrentPiece.color = ''
                            newPieces[row - 1][col].color = ''
                            newPieces[row - 2][col].color = ''

                        } else if (i >= 1 && i < newPieces.length - 1 && newPieces[row - 1][col].color === currentPiece.color && newPieces[row + 1][col].color === currentPiece.color) {
                            matchExists = true
                            increaseScore(currentPiece.color, 5)
                            increaseScore(currentPiece.color, 5)
                            currentPiece.color = primogem
                            rightOfCurrentPiece.color = ''
                            twoRightOfCurrentPiece.color = ''
                            newPieces[row - 1][col].color = ''
                            newPieces[row + 1][col].color = ''
                        } else if (i < newPieces.length - 2 && newPieces[row + 1][col].color === currentPiece.color && newPieces[row + 2][col].color === currentPiece.color) {
                            matchExists = true
                            increaseScore(currentPiece.color, 5)
                            increaseScore(currentPiece.color, 5)
                            currentPiece.color = primogem
                            rightOfCurrentPiece.color = ''
                            twoRightOfCurrentPiece.color = ''
                            newPieces[row + 1][col].color = ''
                            newPieces[row + 2][col].color = ''
                        }
                    })
                }

            }
        }
        return [newPieces, matchExists]
    }

    const checkForColumnOfThree = (newPieces) => {
        //make copy of pieces bc state can't be changed without setstate
        let matchExists = false
        //check all pieces in board state
        for (let i = 0; i < newPieces.length - 2; i++) {
            for (let j = 0; j < newPieces[i].length; j++) {
                const currentPiece = newPieces[i][j]
                const belowCurrentPiece = newPieces[i + 1][j]
                const secondBelowCurrentPiece = newPieces[i + 2][j]

                if (currentPiece.color != '' && currentPiece.color === belowCurrentPiece.color && currentPiece.color === secondBelowCurrentPiece.color) {
                    increaseScore(currentPiece.color, 3)
                    currentPiece.color = ''
                    belowCurrentPiece.color = ''
                    secondBelowCurrentPiece.color = ''
                    matchExists = true
                }
            }
        }
        return [newPieces, matchExists]

    }

    const checkForColumnOfFour = (newPieces) => {
        let matchExists = false
        for (let i = 0; i < newPieces.length - 3; i++) {
            for (let j = 0; j < newPieces[i].length; j++) {
                const currentPiece = newPieces[i][j]
                const belowCurrentPiece = newPieces[i + 1][j]
                const secondBelowCurrentPiece = newPieces[i + 2][j]
                const thirdBelowCurrentPiece = newPieces[i + 3][j]

                if (currentPiece.color != '' && currentPiece.color === belowCurrentPiece.color && currentPiece.color === secondBelowCurrentPiece.color && currentPiece.color === thirdBelowCurrentPiece.color) {
                    increaseScore(currentPiece.color, 4)
                    currentPiece.color = caeli
                    belowCurrentPiece.color = ''
                    secondBelowCurrentPiece.color = ''
                    thirdBelowCurrentPiece.color = ''
                    matchExists = true
                }
            }
        }
        return [newPieces, matchExists]
    }

    const checkForColumnOfFive = (newPieces) => {
        let matchExists = false
        for (let i = 0; i < newPieces.length - 4; i++) {
            for (let j = 0; j < newPieces[i].length; j++) {
                const currentPiece = newPieces[i][j]
                const belowCurrentPiece = newPieces[i + 1][j]
                const secondBelowCurrentPiece = newPieces[i + 2][j]
                const thirdBelowCurrentPiece = newPieces[i + 3][j]
                const fourBelowCurrentPiece = newPieces[i + 4][j]

                if (currentPiece.color != '' && currentPiece.color === belowCurrentPiece.color && currentPiece.color === secondBelowCurrentPiece.color && currentPiece.color === thirdBelowCurrentPiece.color && currentPiece.color === fourBelowCurrentPiece.color) {
                    increaseScore(currentPiece.color, 5)
                    currentPiece.color = primogem
                    belowCurrentPiece.color = ''
                    secondBelowCurrentPiece.color = ''
                    thirdBelowCurrentPiece.color = ''
                    fourBelowCurrentPiece.color = ''
                    matchExists = true
                }
            }
        }
        return [newPieces, matchExists]
    }
    const checkForRowOfThree = (newPieces) => {
        let matchExists = false
        for (let i = 0; i < newPieces.length; i++) {
            for (let j = 0; j < newPieces[i].length - 2; j++) {
                const currentPiece = newPieces[i][j]
                const rightOfCurrentPiece = newPieces[i][j + 1]
                const twoRightOfCurrentPiece = newPieces[i][j + 2]
                if (currentPiece.color != '' && currentPiece.color === rightOfCurrentPiece.color && currentPiece.color === twoRightOfCurrentPiece.color) {
                    matchExists = true
                    increaseScore(currentPiece.color, 3)
                    currentPiece.color = ''
                    rightOfCurrentPiece.color = ''
                    twoRightOfCurrentPiece.color = ''
                }
            }
        }
        return [newPieces, matchExists]
    }

    const checkForRowOfFour = (newPieces) => {
        let matchExists = false
        for (let i = 0; i < newPieces.length; i++) {
            for (let j = 0; j < newPieces[i].length - 3; j++) {
                const currentPiece = newPieces[i][j]
                const rightOfCurrentPiece = newPieces[i][j + 1]
                const twoRightOfCurrentPiece = newPieces[i][j + 2]
                const threeRightOfCurrentPiece = newPieces[i][j + 3]
                if (currentPiece.color != '' && currentPiece.color === rightOfCurrentPiece.color && currentPiece.color === twoRightOfCurrentPiece.color && currentPiece.color === threeRightOfCurrentPiece.color) {
                    matchExists = true
                    increaseScore(currentPiece.color, 4)
                    currentPiece.color = vultur
                    rightOfCurrentPiece.color = ''
                    twoRightOfCurrentPiece.color = ''
                    threeRightOfCurrentPiece.color = ''
                }
            }
        }
        return [newPieces, matchExists]
    }

    const checkForRowOfFive = (newPieces) => {
        let matchExists = false
        for (let i = 0; i < newPieces.length; i++) {
            for (let j = 0; j < newPieces[i].length - 4; j++) {
                const currentPiece = newPieces[i][j]
                const rightOfCurrentPiece = newPieces[i][j + 1]
                const twoRightOfCurrentPiece = newPieces[i][j + 2]
                const threeRightOfCurrentPiece = newPieces[i][j + 3]
                const fourRightOfCurrentPiece = newPieces[i][j + 4]
                if (currentPiece.color != '' && currentPiece.color === rightOfCurrentPiece.color && currentPiece.color === twoRightOfCurrentPiece.color && currentPiece.color === threeRightOfCurrentPiece.color && currentPiece.color === fourRightOfCurrentPiece.color) {
                    matchExists = true
                    increaseScore(currentPiece.color, 5)
                    currentPiece.color = primogem
                    rightOfCurrentPiece.color = ''
                    twoRightOfCurrentPiece.color = ''
                    threeRightOfCurrentPiece.color = ''
                    fourRightOfCurrentPiece.color = ''
                }
            }
        }
        return [newPieces, matchExists]
    }



    const checkForMatches = (newPieces) => {
        let matchExists = false

        let result = checkForLMatch(newPieces);
        newPieces = result[0]
        if (result[1] === true) {
            matchExists = result[1];
        }
        result = checkForColumnOfFive(newPieces);
        newPieces = result[0]
        if (result[1] === true) {
            matchExists = result[1];
        }
        result = checkForColumnOfFour(newPieces);
        newPieces = result[0]
        if (result[1] === true) {
            matchExists = result[1];
        }
        result = checkForColumnOfThree(newPieces);
        newPieces = result[0]
        if (result[1] === true) {
            matchExists = result[1];
        }
        result = checkForRowOfFive(newPieces);
        newPieces = result[0]
        if (result[1] === true) {
            matchExists = result[1];
        }
        result = checkForRowOfFour(newPieces);
        newPieces = result[0]
        if (result[1] === true) {
            matchExists = result[1];
        }
        result = checkForRowOfThree(newPieces);
        newPieces = result[0]
        if (result[1] === true) {
            matchExists = result[1];
        }

        return [newPieces, matchExists]
    }

    const applyGravity = (newPieces) => {
        setBoardMoving(true);
        newPieces = copyHelper(newPieces);
        let moved = false;
        for (let i = newPieces.length - 1; i >= 0; i--) {
            for (let j = 0; j < newPieces[i].length; j++) {
                // For the top rows, generate a new piece
                if (i === 0 && newPieces[i][j].color === '') {
                    newPieces[i][j].color = candyColors[Math.floor(Math.random() * candyColors.length)];
                    moved = true;
                }
                // For other rows, switch pieces if current piece is empty and piece above is not empty.
                else if (newPieces[i][j].color === '' && newPieces[i - 1][j].color !== '') {
                    [newPieces[i][j].color, newPieces[i - 1][j].color] = [newPieces[i - 1][j].color, newPieces[i][j].color];
                    moved = true;
                }
            }
        }
        setPieces(newPieces);
        if (moved) {
            // if moved is true, continue applying gravity
            setTimeout(() => {
                applyGravity(newPieces);
            }, 200)
        } else {
            // if moved is false, stop applying gravity...
            // and..
            let matchResult = checkForMatches(newPieces)
            if (matchResult[1] === true) {
                setPieces(matchResult[0])
                setTimeout(() => {
                    applyGravity(matchResult[0])
                }, 200)
            } else {
                setBoardMoving(false);
            }

        }

        return moved;
    }

    const boardRef = useRef(null)
    const grabPiece = (e) => {
        if (boardMoving) {
            return;
        }
        const wholeBoard = boardRef.current

        if (e.target.className === "piece" && wholeBoard) {
            setGridX(Math.floor((e.clientX - wholeBoard.offsetLeft) / 100))
            setGridY(Math.floor((e.clientY - wholeBoard.offsetTop) / 100))
            const x = e.clientX
            const y = e.clientY
            e.target.style.position = "absolute"
            e.target.style.left = `${x}px`
            e.target.style.top = `${y}px`
            setActivePiece(e.target)
        }
    }

    const movePiece = (e) => {
        const wholeBoard = boardRef.current;
        if (activePiece && wholeBoard) {
            let minX = wholeBoard.offsetLeft;
            let minY = wholeBoard.offsetTop;
            let maxX = wholeBoard.offsetLeft + wholeBoard.clientWidth - 100;
            let maxY = wholeBoard.offsetTop + wholeBoard.clientHeight - 100;
            let xOfLeftPiece = gridX * 100 - wholeBoard.offsetLeft - 23
            let yOfTopPiece = gridY * 100 - 60
            let yOfBottomPiece = gridY * 100 + 138
            let xOfRightPiece = gridX * 100 + 138
            const x = e.clientX - 50
            const y = e.clientY - 50
            activePiece.style.position = "absolute";

            minX = Math.max(minX, xOfLeftPiece)
            maxX = Math.min(maxX, xOfRightPiece)
            minY = Math.max(minY, yOfTopPiece)
            maxY = Math.min(maxY, yOfBottomPiece)

            if (x < minX) {
                activePiece.style.left = `${minX}px`
            }
            else if (x > maxX) {
                activePiece.style.left = `${maxX}px`
            } else {
                activePiece.style.left = `${x}px`
            }
            if (y < minY) {
                activePiece.style.top = `${minY}px`
            }
            else if (y > maxY) {
                activePiece.style.top = `${maxY}px`
            }
            else {
                activePiece.style.top = `${y}px`
            }
        }
    }


    const dropPiece = (e) => {
        const wholeBoard = boardRef.current
        if (activePiece && wholeBoard) {
            const x = Math.floor((e.clientX - wholeBoard.offsetTop) / 100)
            const y = Math.abs(Math.floor((e.clientY - wholeBoard.offsetTop) / 100));

            let newPieces = createCopyOfPieces();
            [newPieces[gridY][gridX].color, newPieces[y][x].color] = [newPieces[y][x].color, newPieces[gridY][gridX].color];
            const resetActivePiece = () => {
                activePiece.style.position = '';
                activePiece.style.left = '';
                activePiece.style.top = '';
                setActivePiece(null);
            }
            if ((x === gridX && y === gridY) || (x === gridX - 1 && y === gridY - 1) || (x === gridX - 1 && y === gridY + 1) || (x === gridX + 1 && y === gridY + 1) || (x === gridX + 1 && y === gridY - 1) || (x < gridX - 1) || (x > gridX + 1) || (y < gridY - 1) || (y > gridY + 1)) {
                resetActivePiece();
                return;
                // VERTICAL LINE CLEAR LOGIC
            } else if (newPieces[y][x].color === vultur) {
                let clearedPieces = {}
                clearedPieces[anemo] = 0
                clearedPieces[dendro] = 0
                clearedPieces[hydro] = 0
                clearedPieces[pyro] = 0
                clearedPieces[geo] = 0
                clearedPieces[electro] = 0
                resetActivePiece()
                for (let i = 0; i < newPieces.length; i++) {
                    for (let j = 0; j < newPieces[i].length; j++) {
                        if (j === x) {
                            if (newPieces[i][j].color === anemo) {
                                clearedPieces[anemo] += 1
                            } else if (newPieces[i][j].color === dendro) {
                                clearedPieces[dendro] += 1
                            } else if (newPieces[i][j].color === hydro) {
                                clearedPieces[hydro] += 1
                            }
                            else if (newPieces[i][j].color === pyro) {
                                clearedPieces[pyro] += 1
                            } else if (newPieces[i][j].color === geo) {
                                clearedPieces[geo] += 1
                            } else if (newPieces[i][j].color === electro) {
                                clearedPieces[electro] += 1
                            }
                            newPieces[i][j].color = ''
                        }
                    }
                }
                setPieces(newPieces);
                setAnemoScore(anemoScore + clearedPieces[anemo])
                setDendroScore(dendroScore + clearedPieces[dendro])
                setHydroScore(hydroScore + clearedPieces[hydro])
                setPyroScore(pyroScore + clearedPieces[pyro])
                setGeoScore(geoScore + clearedPieces[geo])
                setElectroScore(electroScore + clearedPieces[electro])
                setTimeout(() => {
                    applyGravity(newPieces)
                }, 300)
            } else if (newPieces[gridY][gridX].color === vultur) {
                let clearedPieces = {}
                clearedPieces[anemo] = 0
                clearedPieces[dendro] = 0
                clearedPieces[hydro] = 0
                clearedPieces[pyro] = 0
                clearedPieces[geo] = 0
                clearedPieces[electro] = 0
                resetActivePiece()
                for (let i = 0; i < newPieces.length; i++) {
                    for (let j = 0; j < newPieces[i].length; j++) {
                        if (j === gridX) {
                            if (newPieces[i][j].color === anemo) {
                                clearedPieces[anemo] += 1
                            } else if (newPieces[i][j].color === dendro) {
                                clearedPieces[dendro] += 1
                            } else if (newPieces[i][j].color === hydro) {
                                clearedPieces[hydro] += 1
                            }
                            else if (newPieces[i][j].color === pyro) {
                                clearedPieces[pyro] += 1
                            } else if (newPieces[i][j].color === geo) {
                                clearedPieces[geo] += 1
                            } else if (newPieces[i][j].color === electro) {
                                clearedPieces[electro] += 1
                            }
                            newPieces[i][j].color = ''
                        }
                    }
                }
                setAnemoScore(anemoScore + clearedPieces[anemo])
                setDendroScore(dendroScore + clearedPieces[dendro])
                setHydroScore(hydroScore + clearedPieces[hydro])
                setPyroScore(pyroScore + clearedPieces[pyro])
                setGeoScore(geoScore + clearedPieces[geo])
                setElectroScore(electroScore + clearedPieces[electro])
                setPieces(newPieces);
                setTimeout(() => {
                    applyGravity(newPieces)
                }, 300)
                // HORIZONTAL LINE CLEAR LOGIC
            } else if (newPieces[y][x].color === caeli) {
                let clearedPieces = {}
                clearedPieces[anemo] = 0
                clearedPieces[dendro] = 0
                clearedPieces[hydro] = 0
                clearedPieces[pyro] = 0
                clearedPieces[geo] = 0
                clearedPieces[electro] = 0
                resetActivePiece()
                for (let i = 0; i < newPieces.length; i++) {
                    for (let j = 0; j < newPieces[i].length; j++) {
                        if (i === y) {
                            if (newPieces[i][j].color === anemo) {
                                clearedPieces[anemo] += 1
                            } else if (newPieces[i][j].color === dendro) {
                                clearedPieces[dendro] += 1
                            } else if (newPieces[i][j].color === hydro) {
                                clearedPieces[hydro] += 1
                            }
                            else if (newPieces[i][j].color === pyro) {
                                clearedPieces[pyro] += 1
                            } else if (newPieces[i][j].color === geo) {
                                clearedPieces[geo] += 1
                            } else if (newPieces[i][j].color === electro) {
                                clearedPieces[electro] += 1
                            }
                            newPieces[i][j].color = ''
                        }
                    }
                }
                setAnemoScore(anemoScore + clearedPieces[anemo])
                setDendroScore(dendroScore + clearedPieces[dendro])
                setHydroScore(hydroScore + clearedPieces[hydro])
                setPyroScore(pyroScore + clearedPieces[pyro])
                setGeoScore(geoScore + clearedPieces[geo])
                setElectroScore(electroScore + clearedPieces[electro])
                setPieces(newPieces);
                setTimeout(() => {
                    applyGravity(newPieces)
                }, 300)
            }
            else if (newPieces[gridY][gridX].color === caeli) {
                let clearedPieces = {}
                clearedPieces[anemo] = 0
                clearedPieces[dendro] = 0
                clearedPieces[hydro] = 0
                clearedPieces[pyro] = 0
                clearedPieces[geo] = 0
                clearedPieces[electro] = 0
                resetActivePiece()
                for (let i = 0; i < newPieces.length; i++) {
                    for (let j = 0; j < newPieces[i].length; j++) {
                        if (i === gridY) {
                            if (newPieces[i][j].color === anemo) {
                                clearedPieces[anemo] += 1
                            } else if (newPieces[i][j].color === dendro) {
                                clearedPieces[dendro] += 1
                            } else if (newPieces[i][j].color === hydro) {
                                clearedPieces[hydro] += 1
                            }
                            else if (newPieces[i][j].color === pyro) {
                                clearedPieces[pyro] += 1
                            } else if (newPieces[i][j].color === geo) {
                                clearedPieces[geo] += 1
                            } else if (newPieces[i][j].color === electro) {
                                clearedPieces[electro] += 1
                            }
                            newPieces[i][j].color = ''
                        }
                    }
                }
                setAnemoScore(anemoScore + clearedPieces[anemo])
                setDendroScore(dendroScore + clearedPieces[dendro])
                setHydroScore(hydroScore + clearedPieces[hydro])
                setPyroScore(pyroScore + clearedPieces[pyro])
                setGeoScore(geoScore + clearedPieces[geo])
                setElectroScore(electroScore + clearedPieces[electro])
                setPieces(newPieces);
                setTimeout(() => {
                    applyGravity(newPieces)
                }, 300)
            }
            // CLEAR ALL OF TARGET COLOR
            else if (newPieces[y][x].color === primogem) {
                let clearedPieces = {}
                clearedPieces[anemo] = 0
                clearedPieces[dendro] = 0
                clearedPieces[hydro] = 0
                clearedPieces[pyro] = 0
                clearedPieces[geo] = 0
                clearedPieces[electro] = 0
                resetActivePiece()

                const primoColor = newPieces[gridY][gridX].color
                for (let i = 0; i < newPieces.length; i++) {
                    for (let j = 0; j < newPieces[i].length; j++) {
                        if (newPieces[i][j].color === primoColor) {
                            if (primoColor === anemo) {
                                clearedPieces[anemo] += 1
                            } else if (primoColor === dendro) {
                                clearedPieces[dendro] += 1
                            } else if (primoColor === hydro) {
                                clearedPieces[hydro] += 1
                            }
                            else if (primoColor === pyro) {
                                clearedPieces[pyro] += 1
                            } else if (primoColor === geo) {
                                clearedPieces[geo] += 1
                            } else if (primoColor === electro) {
                                clearedPieces[electro] += 1
                            }
                            newPieces[i][j].color = ''
                        }
                    }
                }
                newPieces[y][x].color = ''
                setAnemoScore(anemoScore + clearedPieces[anemo])
                setDendroScore(dendroScore + clearedPieces[dendro])
                setHydroScore(hydroScore + clearedPieces[hydro])
                setPyroScore(pyroScore + clearedPieces[pyro])
                setGeoScore(geoScore + clearedPieces[geo])
                setElectroScore(electroScore + clearedPieces[electro])
                setPieces(newPieces);
                setTimeout(() => {
                    applyGravity(newPieces)
                }, 600)
            } else if (newPieces[gridY][gridX].color === primogem) {
                resetActivePiece()
                const primoColor = newPieces[y][x].color
                for (let i = 0; i < newPieces.length; i++) {
                    for (let j = 0; j < newPieces[i].length; j++) {
                        if (newPieces[i][j].color === primoColor) {
                            newPieces[i][j].color = ''
                        }
                    }
                }
                newPieces[gridY][gridX].color = ''
                setPieces(newPieces);
                setTimeout(() => {
                    applyGravity(newPieces)
                }, 600)
            } else {
                resetActivePiece()

                let matchExists = checkForMatches(newPieces)[1]
                if (matchExists) {
                    setPieces(newPieces);
                    setBoardMoving(true)
                    setTimeout(() => {
                        applyGravity(newPieces);
                    }, 200)
                }
            }
        }
    }

    const generateColors = () => {
        const randomColorArrangement = []
        for (let j = 0; j < rows; j++) {
            let insertRow = []
            for (let i = 0; i < columns; i++) {
                let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
                while ((i > 1 && randomColor === insertRow[i - 1] && randomColor === insertRow[i - 2]) ||
                    (j > 1 && randomColor === randomColorArrangement[j - 1][i] && randomColor === randomColorArrangement[j - 2][i])) {
                    randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
                }
                insertRow.push(randomColor)
            }
            randomColorArrangement.push(insertRow)
        }
        return randomColorArrangement
    }

    const createinitialBoard = (colorArrangement) => {
        const newBoardPieces = []
        for (let j = 0; j < rows; j++) {
            // for every row
            let insertRow = [];

            for (let i = 0; i < columns; i++) {
                // for every column in the row
                // create a piece
                let rowPiece = { color: colorArrangement[j][i], row: j, column: i }
                insertRow.push(rowPiece)
            }
            newBoardPieces.push(insertRow)
        }



        fetch("/boards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: user.id }),
        })
            .then((r) => r.json())
            .then((newBoard) => {

                let arrayOfPieces = []
                // Add created board_id to every piece in newBoardPieces
                for (let j = 0; j < newBoardPieces.length; j++) {
                    for (let i = 0; i < newBoardPieces[j].length; i++) {
                        newBoardPieces[j][i].board_id = newBoard.id
                        arrayOfPieces.push(newBoardPieces[j][i])
                    }
                }

                arrayOfPieces.forEach(piece =>
                    fetch("/pieces", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(piece),
                    }))
                setAnemoScore(0)
                setDendroScore(0)
                setElectroScore(0)
                setGeoScore(0)
                setHydroScore(0)
                setPyroScore(0)
                setBoardId(newBoard.id)
                setPieces(newBoardPieces)
            })


    }



    const recreateOldBoard = (boardsData) => {

        const newBoardPieces = []
        for (let j = 0; j < rows; j++) {
            let insertRow = [];
            for (let i = 0; i < columns; i++) {
                let rowPiece
                for (let k = 0; k < boardsData[0].pieces.length; k++) {

                    if (boardsData[0].pieces[k].row === j && boardsData[0].pieces[k].column === i) {
                        rowPiece = boardsData[0].pieces[k]
                    }
                }
                insertRow.push(rowPiece)
            }
            newBoardPieces.push(insertRow)
        }
        setAnemoScore(boardsData[0].anemo_score)
        setDendroScore(boardsData[0].dendro_score)
        setElectroScore(boardsData[0].electro_score)
        setGeoScore(boardsData[0].geo_score)
        setHydroScore(boardsData[0].hydro_score)
        setPyroScore(boardsData[0].pyro_score)
        setPieces(newBoardPieces)
        setBoardId(boardsData[0].id)
        setInitialScoreSet(true)
    }

    const resetBoard = () => {
        console.log(boardId)
        if (boardId) {
            fetch(`/boards/${boardId}`,
                { method: 'DELETE' })
                .then(() => {
                    setBoardId(null)
                    setPieces([])
                })
        }
    }

    useEffect(() => {
        if (user !== null && !boardId) {
            let boardsData = []
            let newBoardId = null;
            fetch(`/boards/${user.id}`)
                .then(response => response.json())
                .then(data => {
                    boardsData = data
                    if (boardsData.length !== 0) {
                        newBoardId = boardsData[0].id
                    }
                })
                .then(r => {
                    if (newBoardId && boardsData[0].pieces.length === 64) { // && 64 pieces check
                        recreateOldBoard(boardsData)
                    } else {
                        const colorArrangement = generateColors()
                        createinitialBoard(colorArrangement)
                    }
                })
        }
    }, [user, boardId])



    return (
        <div>
            <div className="app">
                <div onMouseUp={(e) => dropPiece(e)} onMouseDown={(e) => grabPiece(e)} onMouseMove={(e) => movePiece(e)} ref={boardRef} className="game">
                    {pieces.map(row => {
                        return row.map((piece) => {
                            return <div className='tile' key={`${piece.row}, ${piece.column}`}><div style={{ backgroundImage: `url(${piece.color}`, backgroundSize: '100%' }} className="piece"></div></div>
                        })
                    })}
                </div>

                <div className="scoreboard">
                    <div className="score">
                        <img src={anemo} height="100px" width="100px" />
                        Anemo Score: {anemoScore}
                    </div>
                    <div className="score">
                        <img src={dendro} height="100px" width="100px" />
                        Dendro Score: {dendroScore}
                    </div>
                    <div className="score">
                        <img src={electro} height="100px" width="100px" />
                        Electro Score: {electroScore}
                    </div>
                    <div className="score">
                        <img src={hydro} height="100px" width="100px" />
                        Hydro Score: {hydroScore}
                    </div>
                    <div className="score">
                        <img src={pyro} height="100px" width="100px" />
                        Pyro Score: {pyroScore}
                    </div>
                    <div className="score">
                        <img src={geo} height="100px" width="100px" />
                        Geo Score: {geoScore}
                    </div>
                </div>
            </div>
            <button onClick={resetBoard}>Reset Board</button>
        </div>
    );
}

export default Game;
