// LOADING TO PASSWORD
setTimeout(() => {
    let loading = document.getElementById("loadingScreen");
    if (loading) loading.style.display = "none";

    let pass = document.getElementById("passwordScreen");
    if (pass) pass.classList.remove("hidden");
}, 4000);

// PASSWORD CHECK
function checkPassword() {
    let input = document.getElementById("passwordInput").value;
    if (input === "15122025") {
        window.location.href = "main.html";
    } else {
        document.getElementById("error").innerHTML = "Itu bukan tanggal kita...";
    }
}

// MUSIC PLAY
document.addEventListener("click", function() {
    let music = document.getElementById("bgMusic");
    if (music) music.play();
}, { once: true });

// REAL BEAT DETECTION
let audioContext;
let analyser;
let source;
let dataArray;

document.addEventListener("click", async function() {

    let music = document.getElementById("bgMusic");
    if (!music) return;

    music.play();
    let chorusTriggered = false;

music.addEventListener("timeupdate", () => {

    // GANTI ANGKA INI kalau perlu (detik chorus)
    if (music.currentTime >= 80 && !chorusTriggered) {

        chorusTriggered = true;

        let text = document.getElementById("chorusText");
        if (text) {
            text.classList.remove("hidden");
            text.classList.add("show");
        }

        // Glow lebih kuat
        let overlay = document.getElementById("glowOverlay");
        if (overlay) {
            overlay.style.transition = "1s";
            overlay.style.background =
                "radial-gradient(circle, rgba(255,77,166,0.8), transparent)";
        }

        // Slow cinematic zoom
        document.body.classList.add("zoom-effect");
    }
});


    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(music);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    let bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    function animateBeat() {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }

        let average = sum / bufferLength;

        // Glow intensity based on average volume
        let glow = average / 255;

        let overlay = document.getElementById("glowOverlay");
        if (overlay) {
            overlay.style.background =
                `radial-gradient(circle, rgba(255,77,166,${glow}), transparent)`;
        }

        requestAnimationFrame(animateBeat);
    }

    animateBeat();

}, { once: true });


// RELATIONSHIP COUNTER
function updateCounter() {
    let startDate = new Date("2025-12-15");
    let now = new Date();
    let diff = now - startDate;
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let counter = document.getElementById("counter");
    if (counter)
        counter.innerHTML = "Kita sudah bersama selama " + days + " hari 🤍";
}
updateCounter();

// FLOATING HEARTS
const canvas = document.getElementById("heartsCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let hearts = [];

    for (let i = 0; i < 25; i++) {
        hearts.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 10 + Math.random() * 15,
            speed: 0.5 + Math.random()
        });
    }

    function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size/2, y - size/2,
                      x - size, y + size/3,
                      x, y + size);
    ctx.bezierCurveTo(x + size, y + size/3,
                      x + size/2, y - size/2,
                      x, y);
    ctx.fill();
}

function drawHearts() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    hearts.forEach(h => {
        ctx.fillStyle = "rgba(255,77,166,0.8)";
        drawHeart(h.x, h.y, h.size);

        h.y -= h.speed;
        if (h.y < 0) h.y = canvas.height;
    });

    requestAnimationFrame(drawHearts);
}


    drawHearts();
}

window.addEventListener("resize", () => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
