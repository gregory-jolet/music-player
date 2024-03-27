const musicData = [
  { id: 1, title: "midnight-forest", artist: "Syouki_Takahashi" },
  { id: 2, title: "Solar", artist: "Betical" },
  { id: 3, title: "Electric-Feel", artist: "TEEMID" },
  { id: 4, title: "Aurora", artist: "SLUMB" },
  { id: 5, title: "Lost-Colours", artist: "Fakear" },
];

const musicPlayer = document.querySelector("audio");
const musicTitle = document.querySelector(".music-title");
const artistName = document.querySelector(".artist-name");
const thumbnail = document.querySelector(".thumbnail");
const indexTxt = document.querySelector(".current-index");

let currentMusicIndex = 1;

function populateUI({ title, artist }) {
  musicTitle.textContent = title;
  artistName.textContent = artist;
  thumbnail.src = `/src/images/${title}.png`;
  musicPlayer.src = `/src/music/${title}.mp3`;
  indexTxt.textContent = `${currentMusicIndex}/${musicData.length}`;
}

populateUI(musicData[currentMusicIndex - 1]);

const playBtn = document.querySelector(".play-btn");

playBtn.addEventListener("click", handlePlayPause);

function handlePlayPause() {
  if (musicPlayer.paused) play();
  else pause();
}

function play() {
  playBtn.querySelector("img").src = "./src/icons/pause-icon.svg";
  musicPlayer.play();
}

function pause() {
  playBtn.querySelector("img").src = "./src/icons/play-icon.svg";
  musicPlayer.pause();
}

const displayCurrentTime = document.querySelector(".current-time");
const durationTime = document.querySelector(".duration-time");
const progressBar = document.querySelector(".progress-bar");

musicPlayer.addEventListener("loadeddata", fillDurationVariables);

let current, totalDuration;

function fillDurationVariables() {
  current = musicPlayer.currentTime;
  totalDuration = musicPlayer.duration;

  formatValue(current, displayCurrentTime);
  formatValue(totalDuration, durationTime);
}

function formatValue(value, element) {
  const currentMin = Math.trunc(value / 60);
  let currentSec = Math.trunc(value % 60);

  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  element.textContent = `${currentMin} : ${currentSec}`;
}

musicPlayer.addEventListener("timeupdate", updateProgress);

function updateProgress(e) {
  current = e.srcElement.currentTime;
  formatValue(current, displayCurrentTime);

  // eg 10 /100 = 0.1 = 10%
  const progressValue = current / totalDuration;
  progressBar.style.transform = `scaleX(${progressValue})`;
}

const progressBarContainer = document.querySelector(".progress-container");

progressBarContainer.addEventListener("click", setProgress);

let rect = progressBarContainer.getBoundingClientRect();
let width = rect.width;

function setProgress(e) {
  const x = e.clientX - rect.left;
  //console.warn(x, width, totalDuration);
  musicPlayer.currentTime = (x / width) * totalDuration;
}

const btnShuffle = document.querySelector(".shuffle");
btnShuffle.addEventListener("click", switchShuffle);

let shuffle = false;
function switchShuffle() {
    btnShuffle.classList.toggle("active");
    shuffle = !shuffle;
}

const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");

[prevBtn, nextBtn].forEach((btn) => btn.addEventListener("click", changeSound));
musicPlayer.addEventListener("ended", changeSound);

function changeSound(e) {
    if (shuffle) {
        playShuffleSound();
        return;
    }
  
  e.target.classList.contains("next-btn") || e.type === "ended"
    ? currentMusicIndex++
    : currentMusicIndex--;

  if (currentMusicIndex < 1) currentMusicIndex = musicData.length;
  else if (currentMusicIndex > musicData.length) currentMusicIndex = 1;

  populateUI(musicData[currentMusicIndex - 1]);
  play();
}

function playShuffleSound() {
    const musicsWithoutCurrentSong = musicData.filter(el => el.id !== currentMusicIndex)
    const randomMusic = musicsWithoutCurrentSong[Math.trunc(Math.random() * musicsWithoutCurrentSong.length)];

    currentMusicIndex = randomMusic.id;
    populateUI(randomMusic);
    play();
}
