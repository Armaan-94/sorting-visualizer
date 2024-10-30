const n = 40;
const array = [];

init();

let audioCtx = null;

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime + dur
    );
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init() {
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    const copy = [...array];
    const moves = mergeSort(copy);
    animate(moves);
}

function animate(moves) {
    if (moves.length == 0) {
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    if (move.type == "swap") {
        array[i] = move.value;
    }
    playNote(200 + array[i] * 500);
    showBars(move);
    setTimeout(function () {
        animate(moves);
    }, 50);
}

function mergeSort(array) {
    const moves = [];
    function mergeSortHelper(arr, start, end) {
        if (end - start < 2) return;

        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(arr, start, mid);
        mergeSortHelper(arr, mid, end);
        merge(arr, start, mid, end);
    }

    function merge(arr, start, mid, end) {
        let i = start, j = mid;
        const temp = [];

        while (i < mid && j < end) {
            moves.push({ indices: [i, j], type: "comp" });
            if (arr[i] < arr[j]) {
                temp.push(arr[i++]);
            } else {
                temp.push(arr[j++]);
            }
        }
        while (i < mid) temp.push(arr[i++]);
        while (j < end) temp.push(arr[j++]);

        for (let k = start; k < end; k++) {
            moves.push({ indices: [k], value: temp[k - start], type: "swap" });
            arr[k] = temp[k - start];
        }
    }

    mergeSortHelper(array, 0, array.length);
    return moves;
}

function showBars(move) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
        }
        container.appendChild(bar);
    }
}
