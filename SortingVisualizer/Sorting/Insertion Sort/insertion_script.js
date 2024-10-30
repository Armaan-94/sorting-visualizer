const n = 40;
const array = [];

init();

let audioCtx = null;

function playNote(freq){
    if(audioCtx == null){
        audioCtx = new(
            AudioContext ||
            webkitAudioContext ||
            window.webkitAudioContext
        )();//Used WebAudio API
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime+dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(
        0, audioCtx.currentTime+dur
    );//Used to stop clicking sound
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init(){
    for(let i = 0; i < n; i++){
        array[i] = Math.random();
    }
    showBars();
}

function play(){
    const copy = [...array];
    const moves = insertionSort(copy);
    animate(moves);
}

function animate(moves){
    if(moves.length == 0){
        showBars();
        return;
    }
    const move = moves.shift();
    const [i, j] = move.indices;
    if(move.type == "swap"){
        [array[i],array[j]] = [array[j],array[i]];
    }
    playNote(200+array[i]*500);
    playNote(200+array[j]*500);
    showBars(move);
    setTimeout(function(){
        animate(moves);
    },50);
}

function insertionSort(array){
    const moves = [];
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            moves.push({indices: [j + 1, j], type: "swap"});
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
    }
    return moves;
}

function showBars(move){
    container.innerHTML="";
    for(let i = 0; i < array.length; i++){
        const bar = document.createElement("div");
        bar.style.height = array[i]*100+"%";
        bar.classList.add("bar");

        if(move && move.indices.includes(i)){
            bar.style.backgroundColor=move.type=="swap"?"red":"blue";
        }
        container.appendChild(bar);
    }
}
