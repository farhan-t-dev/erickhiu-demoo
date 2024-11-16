document.getElementById("startSimulation").addEventListener("click", startSimulation);
document.getElementById("nextStep").addEventListener("click", nextStep);

let tape = [];
let headPosition = 0;
let currentState = "find_food";

// Emoji mapping
const emojis = {
    d: "🦆", // Duck
    F: "🐛", // Food (Fish)
    G: "🌊", // Goal
    s: "🐾", // Footsteps
    0: "🟫", // Obstacle
    1: "💧"  // Water (Path)
};

// State colors
const stateColors = {
    default: "#ccc",
    active: "#ffcb05",
    transition: "#ff5722" // Highlight color for transitions
};

// State and transition data
const states = [
    { id: "q0", label: "search", x: 100, y: 100 },
    { id: "q1", label: "back", x: 250, y: 250 },
    { id: "q2", label: "no more", x: 400, y: 100 },
    { id: "q3", label: "walk", x: 550, y: 250 },
    { id: "qh", label: "happy", x: 700, y: 100 }
];

const transitions = [
    { from: "q0", to: "q1", label: `${emojis.F}→${emojis[0]}, L` },
    { from: "q0", to: "q2", label: `${emojis.G}→L` },
    { from: "q0", to: "q0", label: `${emojis[0]} | ${emojis.d}→R` },
    { from: "q1", to: "q0", label: `${emojis.d}→R` },
    { from: "q1", to: "q1", label: `${emojis[0]}→L` },
    { from: "q2", to: "q2", label: `${emojis[0]}→${emojis[1]}, L` },
    { from: "q2", to: "q3", label: `${emojis.d}→${emojis.s}, R` },
    { from: "q3", to: "q3", label: `${emojis[1]}→${emojis.s}, R` },
    { from: "q3", to: "qh", label: `${emojis.G}→R` }
];

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
    drawStateDiagram();

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
        cellElement.textContent = emojis[cell] || cell; // Map to emoji or show as-is

        // Highlight the cell at the head position
        if (index === headPosition) {
            cellElement.style.border = "2px solid #ffcb05";
            cellElement.style.backgroundColor = "#ffcb05";
            cellElement.style.color = "#00274c";
        }

        tapeContainer.appendChild(cellElement);
    });
}

function drawStateDiagram() {
    const stateDiagramContainer = document.getElementById("stateDiagram");
    stateDiagramContainer.innerHTML = ""; // Clear previous diagram

    const svg = d3.select("#stateDiagram")
        .append("svg")
        .attr("width", 800)
        .attr("height", 400);

    // Draw states (circles)
    svg.selectAll("circle")
        .data(states)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 30)
        .attr("fill", stateColors.default)
        .attr("id", d => `state-${d.id}`);

    // Add state labels
    svg.selectAll("text")
        .data(states)
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#000")
        .text(d => d.label);

    // Draw transitions (arrows)
    transitions.forEach(transition => {
        const fromState = states.find(s => s.id === transition.from);
        const toState = states.find(s => s.id === transition.to);

        const dx = (toState.x - fromState.x) * 1.2; // Adjust distance from center
        const dy = (toState.y - fromState.y) * 1.2;

        if (fromState.id === toState.id) {
            // For q0 (find_food) and q2 (prepare_to_end)
            if (fromState.id === "q0" | fromState.id === "q2"){
                svg.append("path")
                .attr(
                    "d",
                    `M ${fromState.x - 20} ${fromState.y - 20} 
                     A 30 30 0 1 1 ${fromState.x + 20} ${fromState.y - 20}`
                )
                .attr("fill", "none")
                .attr("stroke", "#666")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .attr("class", `transition-line transition-${fromState.id}-${toState.id}`);

            // Label for self-loop
            svg.append("text")
                .attr("x", fromState.x - 60)
                .attr("y", fromState.y - 60)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#333")
                .text(transition.label);
            }
            // For q1 (back to duck) and q3 (duck can walk)
            else{
                svg.append("path")
                .attr(
                    "d",
                    `M ${fromState.x + 20} ${fromState.y + 20} 
                     A 30 30 0 1 1 ${fromState.x - 20} ${fromState.y + 20}`
                )
                .attr("fill", "none")
                .attr("stroke", "#666")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .attr("class", `transition-line transition-${fromState.id}-${toState.id}`);
        
            // Label for self-loop
            svg.append("text")
                .attr("x", fromState.x)
                .attr("y", fromState.y + 100) // Place label below the loop
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#333")
                .text(transition.label);
            }

        } else {
            // For q0 (find food) to q2 (prepare to end)
            if (fromState.id === "q0" & toState.id === "q2"){
                svg.append("line")
                .attr("x1", fromState.x + dx / 10)
                .attr("y1", fromState.y + dy / 10)
                .attr("x2", toState.x - dx / 10)
                .attr("y2", toState.y - dy / 10)
                .attr("stroke", "#666")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .attr("class", `transition-line transition-${fromState.id}-${toState.id}`);

            // Add transition label
            svg.append("text")
                .attr("x", (fromState.x + toState.x) / 2)
                .attr("y", (fromState.y + toState.y) / 2 - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#333")
                .text(transition.label);
            }
            else if ((fromState.id === "q2" & toState.id === "q3") |
                     (fromState.id === "q3" & toState.id === "qh")){
                svg.append("line")
                .attr("x1", fromState.x + dx / 10)
                .attr("y1", fromState.y + dy / 10)
                .attr("x2", toState.x - dx / 10)
                .attr("y2", toState.y - dy / 10)
                .attr("stroke", "#666")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .attr("class", `transition-line transition-${fromState.id}-${toState.id}`);

            // Add transition label
            svg.append("text")
                .attr("x", (fromState.x + toState.x) / 2 + 40)
                .attr("y", (fromState.y + toState.y) / 2 )
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#333")
                .text(transition.label);
            }
            // TODO: q0 (find food) and q1 (back to duck)
            else if ((fromState.id === "q0" && toState.id === "q1") || (fromState.id === "q1" && toState.id === "q0")) {
                const offsetx = (fromState.id === "q0") ? -10 : 10; // Offset for spacing between parallel lines
                const offsety = (fromState.id === "q0") ? 10 : -10; // Offset for spacing between parallel lines
            
                svg.append("line")
                .attr("x1", fromState.x + dx / 10 + offsetx)
                .attr("y1", fromState.y + dy / 10 + offsety)
                .attr("x2", toState.x - dx / 10 + offsetx)
                .attr("y2", toState.y - dy / 10 + offsety)
                .attr("stroke", "#666")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .attr("class", `transition-line transition-${fromState.id}-${toState.id}`);
            
                // Add transition label
                svg.append("text")
                    .attr("x", (fromState.x + toState.x) / 2 + 3 * offsetx) // Add horizontal offset
                    .attr("y", (fromState.y + toState.y) / 2 + 3 * offsety) // Add vertical offset
                    .attr("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("fill", "#333")
                    .text(transition.label);
            }
            else{ // Should not need this
                svg.append("line")
                .attr("x1", fromState.x + dx / 10)
                .attr("y1", fromState.y + dy / 10)
                .attr("x2", toState.x - dx / 10)
                .attr("y2", toState.y - dy / 10)
                .attr("stroke", "#666")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#arrow)")
                .attr("class", `transition-line transition-${fromState.id}-${toState.id}`);

            // Add transition label
            svg.append("text")
                .attr("x", (fromState.x + toState.x) / 2)
                .attr("y", (fromState.y + toState.y) / 2 - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "#333")
                .text(transition.label);
            }
        }

    });


    // Add arrowhead
    svg.append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#666");

    highlightCurrentState();
}

function highlightCurrentState() {
    d3.selectAll("circle")
        .attr("fill", d => d.id === currentState ? stateColors.active : stateColors.default);

    // Reset all transitions to default stroke
    d3.selectAll(".transition-line").attr("stroke", "#666").attr("stroke-width", 2);

    // Find the active transition
    const activeTransition = transitions.find(t => t.from === currentState);
    if (activeTransition) {
        const activeLine = d3.select(`.transition-${activeTransition.from}-${activeTransition.to}`);

        // Temporarily change the color of the arrow
        activeLine
            .attr("stroke", stateColors.transition)
            .attr("stroke-width", 4);

        // Reset the color after 0.5 seconds
        setTimeout(() => {
            activeLine
                .attr("stroke", "#666")
                .attr("stroke-width", 2);
        }, 500);
    }
}


function nextStep() {
    const currentSymbol = tape[headPosition];

    // Track the previous state
    const previousState = currentState;

    // Turing machine transition logic based on the current state and symbol
    switch (currentState) {
        case "find_food":
            if (currentSymbol === 'F') {
                tape[headPosition] = '0'; // Consume food
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
                tape[headPosition] = '1'; // Overwrite with '1'
                headPosition--; // Move left
            } else if (currentSymbol === 'd') {
                tape[headPosition] = 's'; // Duck is full
                currentState = "duck_can_walk";
                headPosition++; // Move right
            }
            break;

        case "duck_can_walk":
            if (currentSymbol === '1') {
                tape[headPosition] = 's'; // Duck steps
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

    // Identify the active transition
    const activeTransition = transitions.find(
        t => t.from === previousState && t.to === currentState
    );

    if (activeTransition) {
        const activeLine = d3.select(`.transition-${activeTransition.from}-${activeTransition.to}`);

        // Temporarily change the color of the arrow
        activeLine
            .attr("stroke", stateColors.transition)
            .attr("stroke-width", 4);

        // Reset the color after 0.5 seconds
        setTimeout(() => {
            activeLine
                .attr("stroke", "#666")
                .attr("stroke-width", 2);
        }, 500);
    }

    // Update tape and state display after each step
    displayTape();
    highlightCurrentState();
}