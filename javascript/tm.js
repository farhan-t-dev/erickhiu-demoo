document.getElementById("startSimulation").addEventListener("click", startSimulation);
document.getElementById("nextStep").addEventListener("click", nextStep);

let tape = [];
let headPosition = 0;
let currentState = "find_food";

function startSimulation() {
    const tapeInput = document.getElementById("tapeInput").value;

    // Check if input starts with 'd' and is of correct length
    if (tapeInput[0] !== 'd' || tapeInput.length > 10) {
        alert("Tape must start with 'd' and have a maximum length of 10.");
        return;
    }

    // Initialize tape and display it
    tape = tapeInput.split("");
    headPosition = 0;
    currentState = "find_food";
    displayTape();
    
    // Show "Next Step" button
    document.getElementById("nextStep").style.display = "inline-block";
}

function displayTape() {
    const tapeContainer = document.getElementById("tapeContainer");
    tapeContainer.innerHTML = ""; // Clear previous tape display

    // Render each cell in the tape
    tape.forEach((cell, index) => {
        const cellElement = document.createElement("span");
        cellElement.className = "tape-cell";
        cellElement.textContent = cell;
        
        // Highlight the cell at the head position
        if (index === headPosition) {
            cellElement.style.border = "2px solid #ffcb05";
            cellElement.style.backgroundColor = "#ffcb05";
            cellElement.style.color = "#00274c";
        }
        
        tapeContainer.appendChild(cellElement);
    });
}

function nextStep() {
    const currentSymbol = tape[headPosition];
    
    // Turing machine transition logic based on the current state and symbol
    switch (currentState) {
        case "find_food":
            if (currentSymbol === 'F') {
                tape[headPosition] = '0';  // Consume food
                currentState = "back_to_duck";
                headPosition--; // Move left
            } else if (currentSymbol === '0' || currentSymbol === 'd') {
                headPosition++; // Move right
            } else if (currentSymbol === ' ') {
                currentState = "prepare_to_end";
                headPosition--; // Move left
            }
            break;
        
        case "back_to_duck":
            if (currentSymbol === 'd') {
                currentState = "find_food";
                headPosition++; // Move right
            } else {
                headPosition--; // Move left
            }
            break;

        case "prepare_to_end":
            if (currentSymbol === '0') {
                tape[headPosition] = '1';  // Overwrite with '1'
                headPosition--; // Move left
            } else if (currentSymbol === 'd') {
                tape[headPosition] = 'D';  // Duck is full
                currentState = "duck_can_walk";
                headPosition++; // Move right
            }
            break;

        case "duck_can_walk":
            if (currentSymbol === '1') {
                tape[headPosition] = 's';  // Duck steps
                headPosition++; // Move right
            } else if (currentSymbol === ' ') {
                currentState = "win";
            }
            break;

        case "win":
            alert("The duck has reached the end!");
            document.getElementById("nextStep").style.display = "none"; // Hide "Next Step" button
            return;

        default:
            break;
    }

    // Update tape display after each step
    displayTape();
}
