window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);

// Polyfill for requestAnimationFrame
window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

let canvas, ctx, w, h, particles = [], probability = 0.04,
    xPoint, yPoint;

function onLoad() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
    if (canvas) {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
}

function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
}

function update() {
    if (particles.length < 500 && Math.random() < probability) {
        createFirework();
    }
    particles = particles.filter(particle => particle.move());
}

function paint() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach(particle => particle.draw(ctx));

    // Narysuj tekst na canvasie
    ctx.fillStyle = 'white'; // Kolor tekstu
    ctx.font = '40px Poppins'; // Czcionka i rozmiar
    ctx.textAlign = 'center'; // Wyśrodkowanie tekstu
    ctx.textBaseline = 'middle'; // Wyrównanie do środka
    ctx.fillText("Bardzo dobrze, taka masz być", w / 2, h / 2); // Narysuj tekst
}

function createFirework() {
    xPoint = Math.random() * (w - 200) + 100;
    yPoint = Math.random() * (h - 200) + 100;
    const nFire = Math.random() * 50 + 100;
    const c = `rgb(${~~(Math.random() * 200 + 55)}, ${~~(Math.random() * 200 + 55)}, ${~~(Math.random() * 200 + 55)})`;
    for (let i = 0; i < nFire; i++) {
        const particle = new Particle();
        particle.color = c;
        const vy = Math.sqrt(25 - particle.vx * particle.vx);
        if (Math.abs(particle.vy) > vy) {
            particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
    }
}

function Particle() {
    this.w = this.h = Math.random() * 4 + 1;
    this.x = xPoint - this.w / 2;
    this.y = yPoint - this.h / 2;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.color;
}

Particle.prototype = {
    gravity: 0.05,
    move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        return !(this.x <= -this.w || this.x >= w || this.y >= h || this.alpha <= 0);
    },
    draw: function (c) {
        c.save();
        c.beginPath();
        c.translate(this.x + this.w / 2, this.y + this.h / 2);
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.closePath();
        c.fill();
        c.restore();
    }
}

const noButton = document.getElementById("no");
const yesButton = document.getElementById("yes");
const messageDiv = document.getElementById("message");

// Funkcja do losowego ustawienia pozycji dla przycisku "Nie"
noButton.addEventListener("mouseenter", () => {
    const maxX = window.innerWidth - noButton.clientWidth - 10; // 10px marginesu
    const maxY = window.innerHeight - noButton.clientHeight - 10; // 10px marginesu

    const randomX = Math.floor(Math.random() * Math.max(0, maxX));
    const randomY = Math.floor(Math.random() * Math.max(0, maxY));

    noButton.style.position = "absolute";
    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;
});

// Funkcja do dodania GIF-ów do siatki w losowej kolejności
function addBackgroundGifs() {
    const gifGrid = document.getElementById("gifGrid");
    const gifPaths = Array.from({ length: 16 }, (_, i) => `${i + 1}.gif`);
    const shuffledGifs = shuffleArray(gifPaths);

    shuffledGifs.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.classList.add("background-gif");
        gifGrid.appendChild(img);
    });
}

// Event listener for the "Tak" button
yesButton.addEventListener("click", () => {
    messageDiv.style.display = 'block'; // Show the message
    document.body.style.backgroundColor = "black"; // Change background to black
    canvas.style.display = 'block'; // Show the canvas for fireworks
    resizeCanvas(); // Ensure canvas is resized to full screen
});

// Event listener for the "Nie" button
noButton.addEventListener("click", () => {
    messageDiv.style.display = 'none'; // Hide the message
});