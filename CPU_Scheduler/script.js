let priorityPreference = 1; // Priority preference for sorting (1 for high, -1 for low)

document.getElementById("priority-toggle-btn").onclick = () => {
    let currentPriorityPreference = document.getElementById("priority-toggle-btn").value;
    if (currentPriorityPreference === "high") {
        document.getElementById("priority-toggle-btn").value = "low";
        document.getElementById("priority-toggle-btn").innerText = "Low";
        document.getElementById("priority-toggle-btn").style.backgroundColor = "yellow";

    } else {
        document.getElementById("priority-toggle-btn").value = "high";
        document.getElementById("priority-toggle-btn").innerText = "High";
        document.getElementById("priority-toggle-btn").style.backgroundColor = "rgba(53,241,19,0.9)";
    }
    priorityPreference *= -1;
};

let selectedAlgorithm = document.getElementById('algo');
function checkTimeQuantumInput() {
    let timeQuantumDiv = document.querySelector("#time-quantum").classList;
    if (selectedAlgorithm.value == 'rr') {
        timeQuantumDiv.remove("hide");
    } else {
        timeQuantumDiv.add("hide");
    }
}

function checkPriorityCell() {
    let priorityCells = document.querySelectorAll(".priority-hide");
    if (selectedAlgorithm.value == "pnp" || selectedAlgorithm.value == "pp") {
        priorityCells.forEach((element) => {
            element.classList.remove("hide");
        });
    } else {
        priorityCells.forEach((element) => {
            element.classList.add("hide");
        });
    }
}

selectedAlgorithm.onchange = () => {
    checkTimeQuantumInput();
    checkPriorityCell();
};

function inputOnChange() {
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        if (input.type == 'number') {
            input.onchange = () => {
                let inputVal = Number(input.value);
                let isInt = Number.isInteger(inputVal);
                if (input.parentNode.classList.contains('arrival-time') || input.id == 'context-switch') {
                    if (!isInt || (isInt && inputVal < 0)) {
                        input.value = 0;
                    } else {
                        input.value = inputVal;
                    }
                } else {
                    if (!isInt || (isInt && inputVal < 1)) {
                        input.value = 1;
                    } else {
                        input.value = inputVal;
                    }
                }
            };
        }
    });
}
inputOnChange();
let process = 1;

function gcd(x, y) {
    while (y) {
        let t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function lcm(x, y) {
    return (x * y) / gcd(x, y);
}

function lcmAll() {
    let result = 1;
    for (let i = 0; i < process; i++) {
        result = lcm(result, document.querySelector(".main-table").rows[2 * i + 2].cells.length);
    }
    return result;
}

function updateColspan() {
    let totalColumns = lcmAll();
    let processHeading = document.querySelector("thead .process-time");
    processHeading.setAttribute("colspan", totalColumns);
    let processTimes = [];
    let table = document.querySelector(".main-table");
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    for (let i = 0; i < process; i++) {
        let row1 = table.rows[2 * i + 1].cells;
        let row2 = table.rows[2 * i + 2].cells;
        for (let j = 0; j < processTimes[i]; j++) {
            row1[j + 3].setAttribute("colspan", totalColumns / processTimes[i]);
            row2[j].setAttribute("colspan", totalColumns / processTimes[i]);
        }
    }
}

function addremove() {
    let processTimes = [];
    let table = document.querySelector(".main-table");
    for (let i = 0; i < process; i++) {
        let row = table.rows[2 * i + 2].cells;
        processTimes.push(row.length);
    }
    let addButtons = document.querySelectorAll(".add-btn");
    for (let i = 0; i < process; i++) {
        addButtons[i].onclick = () => {
            let table = document.querySelector(".main-table");
            let row1 = table.rows[2 * i + 1];
            let row2 = table.rows[2 * i + 2];
            let newCell1 = row1.insertCell(processTimes[i] + 3);
            newCell1.innerHTML = "IO";
            newCell1.classList.add("process-time", "io", "process-heading");
            let newCell2 = row2.insertCell(processTimes[i]);
            newCell2.innerHTML = `<input type="number" min="1" step="1" value="1" id="bs${i + 1}_${processTimes[i] + 1}" class="box">`;
            newCell2.classList.add("process-time", "io", "process-input");
            let newCell3 = row1.insertCell(processTimes[i] + 4);
            newCell3.innerHTML = "CPU";
            newCell3.classList.add("process-time", "cpu", "process-heading");
            let newCell4 = row2.insertCell(processTimes[i] + 1);
            newCell4.innerHTML = `<input type="number" min="1" step="1" value="1" id="bs${i + 1}_${processTimes[i] + 2}" class="box">`;
            newCell4.classList.add("process-time", "cpu", "process-input");
            processTimes[i] += 2;
            updateColspan();
            inputOnChange();
        };
    }
    let removeButtons = document.querySelectorAll(".remove-btn");
    for (let i = 0; i < process; i++) {
        removeButtons[i].onclick = () => {
            if (processTimes[i] > 1) {
                let table = document.querySelector(".main-table");
                processTimes[i]--;
                let row1 = table.rows[2 * i + 1];
                row1.deleteCell(processTimes[i] + 3);
                let row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                processTimes[i]--;
                table = document.querySelector(".main-table");
                row1 = table.rows[2 * i + 1];
                row1.deleteCell(processTimes[i] + 3);
                row2 = table.rows[2 * i + 2];
                row2.deleteCell(processTimes[i]);
                updateColspan();
            }
        };
    }
}
addremove();

function addProcess() {
    process++;
    let rowHTML1 = `
        <td class="process-id" rowspan="2">P${process}</td>
        <td class="priority-hide" rowspan="2"><input type="number" min="0" step="1" value="0" id="pr${process}" class="box"></td>
        <td class="arrival-time" rowspan="2"><input type="number" min="0" step="1" value="0" id="ar${process}" class="box"></td>
        <td class="process-time cpu process-heading" colspan="">CPU</td>
        <td class="process-btn" rowspan="2">
            <div class="btn-container">
                <button type="button" class="add-btn">+</button>
                <button type="button" class="remove-btn">−</button>
            </div>  
        </td>
    `;
    let rowHTML2 = `
        <td class="process-time cpu process-input"><input type="number" min="0" step="1" value="0" id="bs${process}_1" class="box"></td>
    `;
    let table = document.querySelector(".main-table tbody");
    table.insertRow(table.rows.length).innerHTML = rowHTML1;
    table.insertRow(table.rows.length).innerHTML = rowHTML2;
    checkPriorityCell();
    addremove();
    updateColspan();
    inputOnChange();
}

function deleteProcess() {
    let table = document.querySelector(".main-table");
    if (process > 1) {
        table.deleteRow(table.rows.length - 1);
        table.deleteRow(table.rows.length - 1);
        process--;
    }
    updateColspan();
    inputOnChange();
}

document.querySelector(".add-process-btn").onclick = () => {
    addProcess();
};
document.querySelector(".remove-process-btn").onclick = () => {
    deleteProcess();
};

class Input {
    constructor() {
        this.processId = [];
        this.priority = [];
        this.arrivalTime = [];
        this.processTime = [];
        this.processTimeLength = [];
        this.totalBurstTime = [];
        this.algorithm = "";
        this.algorithmType = "";
        this.timeQuantum = 0;
        this.contextSwitch = 0;
    }
}

class Utility {
    constructor() {
        this.remainingProcessTime = [];
        this.remainingBurstTime = [];
        this.remainingTimeRunning = [];
        this.currentProcessIndex = [];
        this.start = [];
        this.done = [];
        this.returnTime = [];
        this.currentTime = 0;
    }
}

class Output {
    constructor() {
        this.completionTime = [];
        this.turnAroundTime = [];
        this.waitingTime = [];
        this.responseTime = [];
        this.schedule = [];
        this.contextSwitches = 0;
        this.averageTimes = [];
    }
}

function setAlgorithmNameType(input, algorithm) {
    input.algorithm = algorithm;
    switch (algorithm) {
        case 'fcfs':
        case 'sjf':
        case 'ljf':
        case 'pnp':
            input.algorithmType = "nonpreemptive";
            break;
        case 'srtf':
        case 'lrtf':
        case 'pp':
            input.algorithmType = "preemptive";
            break;
        case 'rr':
            input.algorithmType = "roundrobin";
            break;
    }
}

function setInput(input) {
    const isPriorityAlgorithm = selectedAlgorithm.value === 'pp' || selectedAlgorithm.value === 'pnp';
    for (let i = 1; i <= process; i++) {
        input.processId.push(i - 1);
        
        const priorityInput = document.getElementById(`pr${i}`);
        if (isPriorityAlgorithm && priorityInput) {
            input.priority.push(Number(priorityInput.value) || 1);
        } else {
            input.priority.push(1);
        }

        const arrivalInput = document.getElementById(`ar${i}`);
        if (!arrivalInput) {
            console.error(`Arrival time input ar${i} not found`);
            input.arrivalTime.push(0);
        } else {
            input.arrivalTime.push(Number(arrivalInput.value) || 0);
        }

        let processTimes = [];
        let processTimeCount = document.querySelector(".main-table").rows[2 * i].cells.length;
        for (let j = 0; j < processTimeCount; j++) {
            const burstInput = document.getElementById(`bs${i}_${j + 1}`);
            if (!burstInput) {
                console.error(`Burst time input bs${i}_${j + 1} not found`);
                processTimes.push(1);
            } else {
                processTimes.push(Number(burstInput.value) || 1);
            }
        }
        input.processTime.push(processTimes);
        input.processTimeLength.push(processTimeCount);
    }

    input.totalBurstTime = new Array(process).fill(0);
    input.processTime.forEach((e1, i) => {
        e1.forEach((e2, j) => {
            if (j % 2 == 0) {
                input.totalBurstTime[i] += e2;
            }
        });
    });

    setAlgorithmNameType(input, selectedAlgorithm.value);
    input.contextSwitch = Number(document.querySelector("#context-switch").value) || 0;
    input.timeQuantum = Number(document.querySelector("#tq").value) || 0;
}

function setUtility(input, utility) {
    utility.remainingProcessTime = input.processTime.slice();
    utility.remainingBurstTime = input.totalBurstTime.slice();
    utility.remainingTimeRunning = new Array(process).fill(0);
    utility.currentProcessIndex = new Array(process).fill(0);
    utility.start = new Array(process).fill(false);
    utility.done = new Array(process).fill(false);
    utility.returnTime = input.arrivalTime.slice();
}

function reduceSchedule(schedule) {
    let newSchedule = [];
    let currentScheduleElement = schedule[0][0];
    let currentScheduleLength = schedule[0][1];
    for (let i = 1; i < schedule.length; i++) {
        if (schedule[i][0] == currentScheduleElement) {
            currentScheduleLength += schedule[i][1];
        } else {
            newSchedule.push([currentScheduleElement, currentScheduleLength]);
            currentScheduleElement = schedule[i][0];
            currentScheduleLength = schedule[i][1];
        }
    }
    newSchedule.push([currentScheduleElement, currentScheduleLength]);
    return newSchedule;
}

function outputAverageTimes(output) {
    let avgct = 0;
    output.completionTime.forEach((element) => {
        avgct += element;
    });
    avgct /= process;
    let avgtat = 0;
    output.turnAroundTime.forEach((element) => {
        avgtat += element;
    });
    avgtat /= process;
    let avgwt = 0;
    output.waitingTime.forEach((element) => {
        avgwt += element;
    });
    avgwt /= process;
    let avgrt = 0;
    output.responseTime.forEach((element) => {
        avgrt += element;
    });
    avgrt /= process;
    return [avgct, avgtat, avgwt, avgrt];
}

function setOutput(input, output) {
    for (let i = 0; i < process; i++) {
        output.turnAroundTime[i] = output.completionTime[i] - input.arrivalTime[i];
        output.waitingTime[i] = output.turnAroundTime[i] - input.totalBurstTime[i];
    }
    output.schedule = reduceSchedule(output.schedule);
    output.averageTimes = outputAverageTimes(output);
}

function showGanttChart(output, outputDiv) {
    const wrapper = document.createElement("div");
    wrapper.id = "gantt-chart-wrapper";

    let ganttChartHeading = document.createElement("h3");
    ganttChartHeading.innerHTML = "Gantt Chart";
    wrapper.appendChild(ganttChartHeading);
    
    const ganttContainer = document.createElement("div");
    ganttContainer.className = "gantt-container";
    ganttContainer.style.marginTop = "20px";
    ganttContainer.style.marginBottom = "30px";
    ganttContainer.style.width = "100%";
    ganttContainer.style.overflowX = "auto";
    
    const ganttChart = document.createElement("div");
    ganttChart.className = "gantt-chart";
    ganttChart.style.display = "flex";
    ganttChart.style.height = "50px";
    ganttChart.style.marginBottom = "10px";
    ganttChart.style.position = "relative";
    
    let totalTime = 0;
    output.schedule.forEach(element => {
        totalTime += element[1];
    });
    
    let currentTime = 0;
    output.schedule.forEach(element => {
        const processBlock = document.createElement("div");
        processBlock.className = "gantt-block";
        processBlock.style.position = "relative";
        processBlock.style.height = "100%";
        processBlock.style.width = `${(element[1] / totalTime) * 100}%`;
        
        if (element[0] === -2) {
            processBlock.style.backgroundColor = "grey";
            processBlock.textContent = "";
        } else if (element[0] === -1) {
            processBlock.style.backgroundColor = "#f0f0f0";
            processBlock.textContent = "Idle";
        } else {
            processBlock.style.backgroundColor = `hsl(${(element[0] * 60) % 360}, 70%, 70%)`;
            processBlock.textContent = `P${element[0]}`;
        }
        
        processBlock.style.display = "flex";
        processBlock.style.justifyContent = "center";
        processBlock.style.alignItems = "center";
        processBlock.style.color = element[0] === -1 ? "#666" : "#000";
        processBlock.style.fontWeight = "bold";
        processBlock.style.border = "1px solid #333";
        
        ganttChart.appendChild(processBlock);
        currentTime += element[1];
    });
    
    ganttContainer.appendChild(ganttChart);
    
    const timeMarkers = document.createElement("div");
    timeMarkers.className = "gantt-time-markers";
    timeMarkers.style.display = "flex";
    timeMarkers.style.position = "relative";
    
    currentTime = 0;
    output.schedule.forEach(element => {
        const startMarker = document.createElement("div");
        startMarker.className = "gantt-time-marker";
        startMarker.style.position = "relative";
        startMarker.style.width = `${(element[1] / totalTime) * 100}%`;
        startMarker.style.textAlign = "left";
        startMarker.textContent = currentTime;
        
        timeMarkers.appendChild(startMarker);
        currentTime += element[1];
    });
    
    const endMarker = document.createElement("div");
    endMarker.className = "gantt-time-marker-end";
    endMarker.style.position = "absolute";
    endMarker.style.right = "0";
    endMarker.textContent = currentTime;
    timeMarkers.appendChild(endMarker);
    
    ganttContainer.appendChild(timeMarkers);
    wrapper.appendChild(ganttContainer);

    outputDiv.appendChild(wrapper);
}


function showTimelineChart(output, outputDiv) {
    // Create container
    const container = document.createElement("div");
    container.id = "timeline-chart-container"; // or use: container.classList.add("timeline-chart-container");

    // Heading
    const timelineChartHeading = document.createElement("h3");
    timelineChartHeading.innerHTML = "Timeline Chart";
    container.appendChild(timelineChartHeading);
    
    // Timeline container
    const timelineContainer = document.createElement("div");
    timelineContainer.className = "timeline-container";
    timelineContainer.style.marginTop = "20px";
    timelineContainer.style.marginBottom = "30px";
    timelineContainer.style.width = "100%";
    
    const processTimelines = {};
    let currentTime = 0;
    let maxTime = 0;
    
    output.schedule.forEach(element => {
        const [processId, duration] = element;
        const endTime = currentTime + duration;
        
        if (processId > 0) {
            if (!processTimelines[processId]) {
                processTimelines[processId] = [];
            }
            processTimelines[processId].push({ start: currentTime, end: endTime });
        }
        
        currentTime = endTime;
        maxTime = Math.max(maxTime, endTime);
    });
    
    Object.keys(processTimelines).sort((a, b) => a - b).forEach(processId => {
        const processRow = document.createElement("div");
        processRow.className = "timeline-row";
        processRow.style.display = "flex";
        processRow.style.alignItems = "center";
        processRow.style.marginBottom = "10px";
        
        const processLabel = document.createElement("div");
        processLabel.className = "timeline-label";
        processLabel.style.width = "50px";
        processLabel.style.flexShrink = 0;
        processLabel.style.fontWeight = "bold";
        processLabel.textContent = `P${processId}`;
        processRow.appendChild(processLabel);
        
        const timelineBar = document.createElement("div");
        timelineBar.className = "timeline-bar";
        timelineBar.style.position = "relative";
        timelineBar.style.height = "30px";
        timelineBar.style.flexGrow = 1;
        timelineBar.style.backgroundColor = "#f0f0f0";
        timelineBar.style.border = "1px solid #ccc";
        
        processTimelines[processId].forEach(segment => {
            const executionSegment = document.createElement("div");
            executionSegment.className = "timeline-segment";
            executionSegment.style.position = "absolute";
            executionSegment.style.left = `${(segment.start / maxTime) * 100}%`;
            executionSegment.style.width = `${((segment.end - segment.start) / maxTime) * 100}%`;
            executionSegment.style.height = "100%";
            executionSegment.style.backgroundColor = `hsl(${(processId * 60) % 360}, 70%, 70%)`;
            executionSegment.style.border = "1px solid #333";
            
            timelineBar.appendChild(executionSegment);
        });
        
        processRow.appendChild(timelineBar);
        timelineContainer.appendChild(processRow);
    });
    
    const timeScale = document.createElement("div");
    timeScale.className = "timeline-scale";
    timeScale.style.display = "flex";
    timeScale.style.marginLeft = "50px";
    timeScale.style.position = "relative";
    timeScale.style.height = "20px";
    
    const interval = Math.max(1, Math.ceil(maxTime / 10));
    for (let t = 0; t <= maxTime; t += interval) {
        const marker = document.createElement("div");
        marker.className = "timeline-marker";
        marker.style.position = "absolute";
        marker.style.left = `${(t / maxTime) * 100}%`;
        marker.style.transform = "translateX(-50%)";
        marker.style.borderLeft = "1px solid #999";
        marker.style.height = "10px";
        marker.style.paddingTop = "10px";
        marker.style.fontSize = "12px";
        marker.textContent = t;
        
        timeScale.appendChild(marker);
    }
    
    timelineContainer.appendChild(timeScale);
    container.appendChild(timelineContainer);

    // Append everything to the given outputDiv
    outputDiv.appendChild(container);
}


function showFinalTable(input, output, outputDiv) {
    // Create a container div
    let container = document.createElement("div");
    container.id = "final-table-container"; // or use: container.classList.add("final-table-container");

    // Heading
    let finalTableHeading = document.createElement("h3");
    finalTableHeading.innerHTML = "Final Table";
    container.appendChild(finalTableHeading);

    // Create the table
    let table = document.createElement("table");
    table.classList.add("final-table");
    let thead = table.createTHead();
    let row = thead.insertRow(0);
    let headings = [
        "Process",
        "Arrival Time",
        "Total Burst Time",
        "Completion Time",
        "Turn Around Time",
        "Waiting Time",
        "Response Time",
    ];
    headings.forEach((element, index) => {
        let cell = row.insertCell(index);
        cell.innerHTML = element;
    });

    let tbody = table.createTBody();
    for (let i = 0; i < process; i++) {
        let row = tbody.insertRow(i);
        let cell = row.insertCell(0);
        cell.innerHTML = "P" + (i + 1);
        cell = row.insertCell(1);
        cell.innerHTML = input.arrivalTime[i];
        cell = row.insertCell(2);
        cell.innerHTML = input.totalBurstTime[i];
        cell = row.insertCell(3);
        cell.innerHTML = output.completionTime[i];
        cell = row.insertCell(4);
        cell.innerHTML = output.turnAroundTime[i];
        cell = row.insertCell(5);
        cell.innerHTML = output.waitingTime[i];
        cell = row.insertCell(6);
        cell.innerHTML = output.responseTime[i];
    }
    container.appendChild(table);

    // CPU Utilization
    let tbt = 0;
    input.totalBurstTime.forEach((element) => (tbt += element));
    let lastct = 0;
    output.completionTime.forEach((element) => (lastct = Math.max(lastct, element)));

    let cpu = document.createElement("p");
    cpu.innerHTML = "CPU Utilization : " + ((tbt / lastct) * 100).toFixed(2) + "%";
    container.appendChild(cpu);

    let tp = document.createElement("p");
    tp.innerHTML = "Throughput : " + (process / lastct).toFixed(2);
    container.appendChild(tp);

    let avgTAT = document.createElement("p");
    avgTAT.innerHTML = "Average Turnaround Time: " + output.averageTimes[1].toFixed(2);
    container.appendChild(avgTAT);

    let avgWT = document.createElement("p");
    avgWT.innerHTML = "Average Waiting Time: " + output.averageTimes[2].toFixed(2);
    container.appendChild(avgWT);

    let avgRT = document.createElement("p");
    avgRT.innerHTML = "Average Response Time: " + output.averageTimes[3].toFixed(2);
    container.appendChild(avgRT);

    if (input.contextSwitch > 0) {
        let cs = document.createElement("p");
        cs.innerHTML = "Number of Context Switches : " + (output.contextSwitches - 1);
        container.appendChild(cs);
    }

    // Append the container to the outputDiv
    outputDiv.appendChild(container);
}


function showOutput(input, output, outputDiv) {
    showGanttChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showTimelineChart(output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
    showFinalTable(input, output, outputDiv);
    outputDiv.insertAdjacentHTML("beforeend", "<hr>");
}

function CPUScheduler(input, utility, output) {
    function updateReadyQueue(currentTime, remain, ready, block) {
        let candidatesRemain = remain.filter((element) => input.arrivalTime[element] <= currentTime);
        let candidatesBlock = block.filter((element) => utility.returnTime[element] <= currentTime);
        let candidates = candidatesRemain.concat(candidatesBlock);
        candidates.sort((a, b) => utility.returnTime[a] - utility.returnTime[b]);
        candidates.forEach(element => {
            moveElement(element, remain, ready);
            moveElement(element, block, ready);
        });
    }

    function moveElement(value, from, to) {
        let index = from.indexOf(value);
        if (index != -1) {
            from.splice(index, 1);
        }
        if (to.indexOf(value) == -1) {
            to.push(value);
        }
    }

    let remain = input.processId.slice();
    let ready = [];
    let running = [];
    let block = [];
    let terminate = [];
    let currentTime = 0;
    let lastFound = -1;

    while (utility.done.some((element) => element == false)) {
        updateReadyQueue(currentTime, remain, ready, block);
        let found = -1;
        if (running.length == 1) {
            found = running[0];
        } else if (ready.length > 0) {
            if (input.algorithm == 'rr') {
                found = ready[0];
                utility.remainingTimeRunning[found] = Math.min(utility.remainingProcessTime[found][utility.currentProcessIndex[found]], input.timeQuantum);
            } else {
                let candidates = ready;
                candidates.sort((a, b) => a - b);
                candidates.sort((a, b) => {
                    switch (input.algorithm) {
                        case 'fcfs':
                            return utility.returnTime[a] - utility.returnTime[b];
                        case 'sjf':
                        case 'srtf':
                            return utility.remainingBurstTime[a] - utility.remainingBurstTime[b];
                        case 'ljf':
                        case 'lrtf':
                            return utility.remainingBurstTime[b] - utility.remainingBurstTime[a];
                        case 'pnp':
                        case 'pp':
                            return priorityPreference * (input.priority[a] - input.priority[b]);
                    }
                });
                found = candidates[0];
                if (input.algorithmType == "preemptive" && found >= 0 && lastFound >= 0 && found != lastFound) {
                    output.schedule.push([-2, input.contextSwitch]);
                    for (let i = 0; i < input.contextSwitch; i++) {
                        currentTime++;
                        updateReadyQueue(currentTime, remain, ready, block);
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            }
            moveElement(found, ready, running);
            if (utility.start[found] == false) {
                utility.start[found] = true;
                output.responseTime[found] = currentTime - input.arrivalTime[found];
            }
        }
        currentTime++;
        if (found != -1) {
            output.schedule.push([found + 1, 1]);
            utility.remainingProcessTime[found][utility.currentProcessIndex[found]]--;
            utility.remainingBurstTime[found]--;

            if (input.algorithm == 'rr') {
                utility.remainingTimeRunning[found]--;
                if (utility.remainingTimeRunning[found] == 0) {
                    if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                        utility.currentProcessIndex[found]++;
                        if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                            utility.done[found] = true;
                            output.completionTime[found] = currentTime;
                            moveElement(found, running, terminate);
                        } else {
                            utility.returnTime[found] = currentTime + input.processTime[found][utility.currentProcessIndex[found]];
                            utility.currentProcessIndex[found]++;
                            moveElement(found, running, block);
                        }
                        updateReadyQueue(currentTime, remain, ready, block);
                    } else {
                        updateReadyQueue(currentTime, remain, ready, block);
                        moveElement(found, running, ready);
                    }
                    output.schedule.push([-2, input.contextSwitch]);
                    for (let i = 0; i < input.contextSwitch; i++) {
                        currentTime++;
                        updateReadyQueue(currentTime, remain, ready, block);
                    }
                    if (input.contextSwitch > 0) {
                        output.contextSwitches++;
                    }
                }
            } else {
                if (utility.remainingProcessTime[found][utility.currentProcessIndex[found]] == 0) {
                    utility.currentProcessIndex[found]++;
                    if (utility.currentProcessIndex[found] == input.processTimeLength[found]) {
                        utility.done[found] = true;
                        output.completionTime[found] = currentTime;
                        moveElement(found, running, terminate);
                    } else {
                        utility.returnTime[found] = currentTime + input.processTime[found][utility.currentProcessIndex[found]];
                        utility.currentProcessIndex[found]++;
                        moveElement(found, running, block);
                    }
                    if (running.length == 0) {
                        output.schedule.push([-2, input.contextSwitch]);
                        for (let i = 0; i < input.contextSwitch; i++) {
                            currentTime++;
                            updateReadyQueue(currentTime, remain, ready, block);
                        }
                        if (input.contextSwitch > 0) {
                            output.contextSwitches++;
                        }
                    }
                    lastFound = -1;
                } else if (input.algorithmType == "preemptive") {
                    moveElement(found, running, ready);
                    lastFound = found;
                }
            }
        } else {
            output.schedule.push([-1, 1]);
            lastFound = -1;
        }
    }
    output.schedule.pop();
}

function calculateOutput() {
    try {
        let outputDiv = document.getElementById("output");
        if (!outputDiv) throw new Error("Output div not found");
        outputDiv.innerHTML = "";
        let mainInput = new Input();
        let mainUtility = new Utility();
        let mainOutput = new Output();
        setInput(mainInput);
        setUtility(mainInput, mainUtility);
        CPUScheduler(mainInput, mainUtility, mainOutput);
        setOutput(mainInput, mainOutput);
        showOutput(mainInput, mainOutput, outputDiv);

        let compareSection = document.getElementById("compare-section");
        if (!compareSection) throw new Error("Compare section not found");
        compareSection.style.display = "block";
        let compareAlgo = document.getElementById("compare-algo");
        if (compareAlgo) compareAlgo.value = "none";
        let compareResults = document.createElement("div");
        compareResults.id = "compare-results";
        outputDiv.appendChild(compareResults);
    } catch (error) {
        console.error("Error in calculateOutput:", error);
    }
}

function compareAlgorithms() {
    try {
        const primaryAlgo = document.getElementById("algo").value;
        const secondaryAlgo = document.getElementById("compare-algo").value;

        if (primaryAlgo === "none" || secondaryAlgo === "none") return;
        if (primaryAlgo === secondaryAlgo) return;

        const compareResults = document.getElementById("compare-results");
        if (!compareResults) throw new Error("Compare results div not found");

        // Clear previous content and create a wrapper
        compareResults.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.id = "compare-results-container";

        const heading = document.createElement("h3");
        heading.textContent = "Algorithm Comparison";
        wrapper.appendChild(heading);

        const container = document.createElement("div");
        container.className = "compare-container";

        [primaryAlgo, secondaryAlgo].forEach(algo => {
            const input = new Input();
            setInput(input);
            setAlgorithmNameType(input, algo);
            if (algo === "rr") {
                input.timeQuantum = Number(document.getElementById("tq").value) || 2;
            }

            const utility = new Utility();
            const output = new Output();
            setUtility(input, utility);
            CPUScheduler(input, utility, output);
            setOutput(input, output);

            const section = document.createElement("div");
            section.className = "compare-section";
            section.innerHTML = `<h4>${algo.toUpperCase()}</h4>`;
            showFinalTable(input, output, section);

            // const avgTAT = document.createElement("p");
            // avgTAT.innerHTML = `Average Turnaround Time: ${output.averageTimes[1].toFixed(2)}`;
            // section.appendChild(avgTAT);

            // const avgWT = document.createElement("p");
            // avgWT.innerHTML = `Average Waiting Time: ${output.averageTimes[2].toFixed(2)}`;
            // section.appendChild(avgWT);

            container.appendChild(section);
        });

        wrapper.appendChild(container);
        compareResults.appendChild(wrapper);
    } catch (error) {
        console.error("Error in compareAlgorithms:", error);
    }
}


document.getElementById("compare").onclick = () => {
    compareAlgorithms();
    document.getElementById('compare-results').scrollIntoView({
      behavior: 'smooth'
    });
};

document.getElementById("calculate").onclick = () => {
    calculateOutput();
    document.getElementById('output').scrollIntoView({
      behavior: 'smooth'
    });
    document.body.classList.add("scroll-enabled");
};

document.getElementById("theme-toggle").onclick = () => {
    document.body.classList.toggle("dark-mode");
};