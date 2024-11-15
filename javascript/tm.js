document.getElementById("startSimulation").addEventListener("click", startSimulation);
document.getElementById("nextStep").addEventListener("click", nextStep);

let tape = [];
let headPosition = 0;
let currentState = "find_food";

function startSimulation() {
    const tapeInput = document.getElementById("tapeInput").value;

    // Validate user input to ensure it only contains '0' and 'F'
    if (!/^[0F]*$/.test(tapeInput)) {
        alert("Tape can only contain the characters '0' and 'F'.");
        return;
    }

    // Initialize tape: Add duck ('d') at the beginning and a goal ('G') at the end
    tape = ['d', ...tapeInput.split(""), 'G'];
    headPosition = 0;
    currentState = "find_food";

    // Display the tape
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
        cellElement.textContent = cell === 'G' ? ' ' : cell; // Display goal 'G' as a blank space for the user

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
            } else if (currentSymbol === 'G') {
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
                tape[headPosition] = 's';  // Duck is full
                currentState = "duck_can_walk";
                headPosition++; // Move right
            }
            break;

        case "duck_can_walk":
            if (currentSymbol === '1') {
                tape[headPosition] = 's';  // Duck steps
                headPosition++; // Move right
            } else if (currentSymbol === 'G') {
                currentState = "happy";
            }
            break;

        case "happy":
            alert("The duck has reached the goal!");
            document.getElementById("nextStep").style.display = "none"; // Hide "Next Step" button
            return;

        default:
            break;
    }

    // Update tape display after each step
    displayTape();
}
