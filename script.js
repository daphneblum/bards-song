const audio = document.getElementById('audio');
const playButton = document.getElementById('play-pause-button');
const progressBar = document.getElementById('progressBar');
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('dropArea');
const coverImage = document.getElementById('coverImage');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('previous-button');

let playlist = [];
let currentIndex = -1;

const coverImages = [
    './assets/default-cover.png'
];

function handleFiles(files) {
    for (const file of files) {
        if (!file || !file.type.startsWith('audio/')) continue;

        const url = URL.createObjectURL(file);
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension

        const song = {
            name: fileName,
            url: url,
            cover: "default-cover.png"
        };
        playlist.push(song);
    }

    if (currentIndex === -1 && playlist.length > 0) {
        currentIndex = 0;
        loadTrack(currentIndex);
    }
}

function getSequentialCover(index) {
    const coverIndex = index % coverImages.length;
    return coverImages[coverIndex];
}

function loadTrack(index) {
    const song = playlist[index];
    if (!song) return;

    audio.src = song.url;
    document.querySelector('.song-title').textContent = song.name;

    const cover = getSequentialCover(index);
    coverImage.src = `${cover}?t=${Date.now()}`;
    coverImage.style.display = 'block';

    coverImage.onerror = () => {
        coverImage.src = 'default-cover.png';
    }

    isPlaying = false;
}

nextButton.addEventListener('click', () => {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    console.log('Next track index:', currentIndex);
    loadTrack(currentIndex);
});

prevButton.addEventListener('click', () => {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
});

let isPlaying = false;
console.log('electronAPI:', window.electronAPI);
console.log('windown.electronAPI:', window.electronAPI);

fileInput.addEventListener('change', (event) => {
    handleFiles(event.target.files);
});

dropArea.addEventListener('dragover', (event) => {
    if (event.target.closest("button")) return;

    fileInput.click();
});

dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("dragover");
    handleFiles(event.dataTransfer.files);
});

playButton.addEventListener('click', () => {
    if (!audio.src) return;

    if (isPlaying) {
        audio.pause();
        playButton.textContent = 'Play';
    } else {
        audio.play();
        playButton.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

function attachWindowControlListeners() {
    const minimizeButton = document.getElementById('minimize-button');
    const closeButton = document.getElementById('close-button');

    console.log("Attaching window controls", { minimizeButton, closeButton, electronAPI: window.electronAPI});

    if (minimizeButton && window.electronAPI) {
        minimizeButton.addEventListener('click', () => {
            window.electronAPI.minimizeWindow();
        });
    }

    if (closeButton && window.electronAPI) {
        closeButton.addEventListener('click', () => {
            window.electronAPI.closeWindow();
        });
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', attachWindowControlListeners);
} else {
    attachWindowControlListeners();
}

