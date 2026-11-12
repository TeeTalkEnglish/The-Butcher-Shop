const readerWindow = document.getElementById("reader-window");
const readerContent = document.getElementById("reader-content");
const readerStatus = document.getElementById("reader-status");
const fontSizeLabel = document.getElementById("font-size-label");
const scrollSpeed = document.getElementById("scroll-speed");
const speedLabel = document.getElementById("speed-label");
const startScrollButton = document.getElementById("start-scroll");

const vocabularyItems = [
  {
    word: "Beef",
    partOfSpeech: "noun",
    definition: "Meat from a cow.",
    example: "The butcher trimmed the beef before packing it.",
    image: "images/beef-unsplash.jpg",
    alt: "A selection of raw beef steaks and meat cuts on a wooden board",
    credit: "Unsplash",
    creditHref: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f"
  },
  {
    word: "Pork",
    partOfSpeech: "noun",
    definition: "Meat from a pig.",
    example: "The butcher kept the pork cold before preparing it.",
    image: "images/pork-hk.jpg",
    alt: "Frozen raw pork cuts in a metal container",
    credit: "Presixlla MOON · CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:HK_food_ingredient_red_meat_frozen_pork_chop_raw_butt_steak_October_2021_SS2_011.jpg",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    word: "Butcher knife",
    partOfSpeech: "noun",
    definition: "A strong, sharp knife used to cut and prepare meat.",
    example: "The butcher used a butcher knife to cut the meat into portions.",
    image: "../../game2-tools-match/images/boning-knife.jpg",
    alt: "A long butcher's boning knife with a metal blade and black handle",
    credit: "TeeTalkEnglish lesson assets",
    creditHref: "../../game2-tools-match/images/boning-knife.jpg"
  },
  {
    word: "Protective gloves",
    partOfSpeech: "plural noun",
    definition: "Gloves worn to help protect the hands while doing a task.",
    example: "The worker wore protective gloves while handling the equipment.",
    image: "../../game2-tools-match/images/chainmail-glove.jpg",
    alt: "A metal chainmail glove protecting a worker's hand during meat cutting",
    credit: "TeeTalkEnglish lesson assets",
    creditHref: "../../game2-tools-match/images/chainmail-glove.jpg"
  },
  {
    word: "Apron",
    partOfSpeech: "noun",
    definition: "A garment worn over clothes to protect them from dirt or spills.",
    example: "The butcher wore an apron to keep their clothes clean.",
    image: "../../game2-tools-match/images/apron.jpg",
    alt: "A white waterproof apron worn over work clothes",
    credit: "TeeTalkEnglish lesson assets",
    creditHref: "../../game2-tools-match/images/apron.jpg"
  },
  {
    word: "Weighing scale",
    partOfSpeech: "noun phrase",
    definition: "A device used to measure how heavy something is.",
    example: "She placed the meat on the weighing scale.",
    image: "images/weighing-meat.jpg",
    alt: "A butcher weighing meat at a counter beneath a hanging scale",
    credit: "Sarumakame · CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Weighing_the_meat.jpg",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    word: "Meat grinder",
    partOfSpeech: "noun phrase",
    definition: "A machine that cuts meat into small pieces by pushing it through a plate.",
    example: "The butcher cleaned the meat grinder after use.",
    image: "images/meat-grinder.jpg",
    alt: "A metal hand-cranked meat grinder with a hopper, handle, and perforated plate",
    credit: "Dmitry Makeev · CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Metal_meat_grinders.jpg",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    word: "Meat bandsaw",
    partOfSpeech: "noun phrase",
    definition: "A powered saw with a continuous blade used to cut large pieces of meat or bone.",
    example: "A trained worker used the meat bandsaw to cut a large piece of meat.",
    image: "images/meat-bandsaw.jpg",
    alt: "A meat cutter working beside a large upright commercial bandsaw",
    credit: "USDAgov · Public domain",
    creditHref: "https://commons.wikimedia.org/wiki/File:Agriculture_Secretary_Vilsack_at_Rustic_Cuts_growing_in_Iowa_(20210709-OSEC-LSC-0320).jpg"
  },
  {
    word: "Cold storage",
    partOfSpeech: "noun phrase",
    definition: "A chilled room or space where food is kept cold.",
    example: "The team stored the meat in cold storage.",
    image: "images/cold-storage.jpg",
    alt: "Interior of a historic meat cold-storage room with refrigeration equipment",
    credit: "Historic American Buildings Survey · Public domain",
    creditHref: "https://commons.wikimedia.org/wiki/File:Interior_view_of_a_former_cold_storage_room._-_M._T._Marcello_Company_Building,_105_Harris_Avenue,_Providence,_Providence_County,_RI_HABS_RI,4-PROV,200-10.tif"
  },
  {
    word: "Packaging",
    partOfSpeech: "noun",
    definition: "Materials used to wrap and protect a product for storage or sale.",
    example: "The worker checked the packaging before placing the meat in the chiller.",
    image: "images/meat-packages.jpg",
    alt: "Rows of packaged meat in a refrigerated supermarket display",
    credit: "Mattes · CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:Meat_packages_in_a_Roman_supermarket.jpg",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    word: "Food thermometer",
    partOfSpeech: "noun phrase",
    definition: "A tool used to measure the temperature of food.",
    example: "The cook checked the meat with a food thermometer.",
    image: "../../game2-tools-match/images/thermometer.jpg",
    alt: "A digital food thermometer with a metal temperature probe",
    credit: "TeeTalkEnglish lesson assets",
    creditHref: "../../game2-tools-match/images/thermometer.jpg"
  },
  {
    word: "Handwashing station",
    partOfSpeech: "noun phrase",
    definition: "A designated place with water and soap for washing hands.",
    example: "Workers washed their hands at the handwashing station.",
    image: "images/handwashing-commons.jpg",
    alt: "A portable handwashing station with a water dispenser, tap, and soap",
    credit: "Wabyona Bingi · CC BY-SA 4.0",
    creditHref: "https://commons.wikimedia.org/wiki/File:A_touchless_handwashing_tap_and_solid_bar_soap_dispenser_kit.jpg",
    licenseHref: "https://creativecommons.org/licenses/by-sa/4.0/"
  }
];

const quizImage = document.getElementById("quiz-image");
const quizImageCredit = document.getElementById("quiz-image-credit");
const quizProgress = document.getElementById("quiz-progress");
const quizCountdown = document.getElementById("quiz-countdown");
const quizAnswer = document.getElementById("quiz-answer");
const quizStatus = document.getElementById("quiz-status");
const quizPrevious = document.getElementById("quiz-previous");
const quizNext = document.getElementById("quiz-next");
let currentVocabularyIndex = 0;
let vocabularyCountdown;

function renderVocabularyQuestion() {
  window.clearInterval(vocabularyCountdown);
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  const item = vocabularyItems[currentVocabularyIndex];
  let secondsRemaining = 3;

  quizImage.src = item.image;
  quizImage.alt = item.alt;
  quizImageCredit.replaceChildren();
  const creditLink = document.createElement("a");
  creditLink.href = item.creditHref;
  creditLink.textContent = item.credit;
  creditLink.target = "_blank";
  creditLink.rel = "noopener noreferrer";
  quizImageCredit.append("Image source: ", creditLink);
  if (item.licenseHref) {
    const licenseLink = document.createElement("a");
    licenseLink.href = item.licenseHref;
    licenseLink.textContent = "License";
    licenseLink.target = "_blank";
    licenseLink.rel = "noopener noreferrer";
    quizImageCredit.append(" · ", licenseLink);
  }

  document.getElementById("quiz-word").textContent = item.word;
  document.getElementById("quiz-part-of-speech").textContent = item.partOfSpeech;
  document.getElementById("quiz-definition").textContent = item.definition;
  document.getElementById("quiz-example").textContent = item.example;
  quizProgress.textContent = `Question ${currentVocabularyIndex + 1} of ${vocabularyItems.length}`;
  quizAnswer.hidden = true;
  quizCountdown.textContent = `Answer in ${secondsRemaining} seconds. Think about it.`;
  quizPrevious.disabled = currentVocabularyIndex === 0;
  quizNext.disabled = currentVocabularyIndex === vocabularyItems.length - 1;
  quizStatus.textContent = "";

  vocabularyCountdown = window.setInterval(() => {
    secondsRemaining -= 1;
    if (secondsRemaining > 0) {
      quizCountdown.textContent = `Answer in ${secondsRemaining} seconds.`;
      return;
    }

    window.clearInterval(vocabularyCountdown);
    quizAnswer.hidden = false;
    quizCountdown.textContent = "Answer revealed.";
  }, 1000);
}

quizImage.addEventListener("error", () => {
  quizStatus.textContent = "This vocabulary photo could not be loaded.";
  console.error("Vocabulary photo failed to load:", quizImage.src);
});

quizPrevious.addEventListener("click", () => {
  if (currentVocabularyIndex === 0) {
    return;
  }
  currentVocabularyIndex -= 1;
  renderVocabularyQuestion();
});

quizNext.addEventListener("click", () => {
  if (currentVocabularyIndex >= vocabularyItems.length - 1) {
    return;
  }
  currentVocabularyIndex += 1;
  renderVocabularyQuestion();
});

document.getElementById("quiz-pronounce").addEventListener("click", () => {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    quizStatus.textContent = "Speech playback is not supported by this browser.";
    return;
  }

  window.speechSynthesis.cancel();
  const pronunciation = new SpeechSynthesisUtterance(vocabularyItems[currentVocabularyIndex].word);
  pronunciation.lang = "en-US";
  pronunciation.rate = 0.85;
  pronunciation.onerror = (event) => {
    console.error("Vocabulary pronunciation failed:", event.error);
    quizStatus.textContent = "The pronunciation could not be played. Check your device's speech settings.";
  };
  window.speechSynthesis.speak(pronunciation);
  quizStatus.textContent = `Playing pronunciation: ${vocabularyItems[currentVocabularyIndex].word}.`;
});

renderVocabularyQuestion();

let fontSize = 28;
let scrollTimer;
let isScrolling = false;

function updateReaderStatus(message) {
  readerStatus.textContent = message;
}

function stopScrolling() {
  if (scrollTimer) {
    window.clearInterval(scrollTimer);
    scrollTimer = undefined;
  }
  isScrolling = false;
}

function beginScrolling() {
  if (!readerContent.querySelector(".model-answer")) {
    updateReaderStatus("No transcript-based model answer is available yet. Scrolling will be ready when an answer is added.");
    return;
  }

  stopScrolling();
  isScrolling = true;
  startScrollButton.textContent = "Start scrolling";
  updateReaderStatus("Scrolling. Use Pause to stop or Reset scrolling to return to the beginning.");
  scrollTimer = window.setInterval(() => {
    readerWindow.scrollTop += Number(scrollSpeed.value) * 0.45;
    const atBottom = readerWindow.scrollTop + readerWindow.clientHeight >= readerWindow.scrollHeight - 1;

    if (atBottom) {
      stopScrolling();
      startScrollButton.textContent = "Start scrolling";
      updateReaderStatus("End of reading area. Use Reset scrolling to start again.");
    }
  }, 50);
}

document.getElementById("increase-font").addEventListener("click", () => {
  fontSize = Math.min(42, fontSize + 2);
  readerContent.style.fontSize = `${fontSize}px`;
  fontSizeLabel.textContent = `${fontSize} px`;
});

document.getElementById("decrease-font").addEventListener("click", () => {
  fontSize = Math.max(20, fontSize - 2);
  readerContent.style.fontSize = `${fontSize}px`;
  fontSizeLabel.textContent = `${fontSize} px`;
});

scrollSpeed.addEventListener("input", () => {
  speedLabel.textContent = scrollSpeed.value;
});

document.getElementById("start-scroll").addEventListener("click", () => {
  if (isScrolling) {
    updateReaderStatus("Scrolling is already running.");
    return;
  }
  beginScrolling();
});

document.getElementById("pause-scroll").addEventListener("click", () => {
  if (!isScrolling) {
    updateReaderStatus(readerContent.querySelector(".model-answer")
      ? "Scrolling is paused. Press Start scrolling to continue."
      : "No transcript-based model answer is available yet.");
    return;
  }
  stopScrolling();
  startScrollButton.textContent = "Resume scrolling";
  updateReaderStatus("Scrolling paused.");
});

document.getElementById("reset-scroll").addEventListener("click", () => {
  stopScrolling();
  readerWindow.scrollTop = 0;
  startScrollButton.textContent = "Start scrolling";
  updateReaderStatus("Reading area reset to the beginning.");
});

const readerShell = document.getElementById("reader-shell");
const fullscreenButton = document.getElementById("fullscreen-reader");

function updateFullscreenButton() {
  const isFullscreen = document.fullscreenElement === readerShell ||
    document.webkitFullscreenElement === readerShell;
  fullscreenButton.textContent = isFullscreen ? "Exit fullscreen" : "Fullscreen";
  fullscreenButton.setAttribute("aria-label", isFullscreen ? "Exit fullscreen reading mode" : "Enter fullscreen reading mode");
}

fullscreenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement === readerShell || document.webkitFullscreenElement === readerShell) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    } else if (readerShell.requestFullscreen) {
      await readerShell.requestFullscreen();
    } else if (readerShell.webkitRequestFullscreen) {
      readerShell.webkitRequestFullscreen();
    } else {
      updateReaderStatus("Fullscreen reading is not supported by this browser.");
    }
  } catch (error) {
    console.error("Could not change fullscreen mode:", error);
    updateReaderStatus("Fullscreen could not be opened. You can still read in the page.");
  }
});

document.addEventListener("fullscreenchange", updateFullscreenButton);
document.addEventListener("webkitfullscreenchange", updateFullscreenButton);

const challengeTimer = document.getElementById("challenge-timer");
const challengeStatus = document.getElementById("challenge-status");
const startChallengeButton = document.getElementById("start-challenge");
let challengeInterval;
let challengeSeconds = 60;
let challengePhase = "ready";

function showTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function stopChallengeTimer() {
  if (challengeInterval) {
    window.clearInterval(challengeInterval);
    challengeInterval = undefined;
  }
}

function setChallengePhase(phase) {
  challengePhase = phase;
  challengeSeconds = 60;
  challengeTimer.textContent = showTime(challengeSeconds);
  challengeTimer.setAttribute("aria-label", phase === "speaking" ? "Speaking timer" : "Preparation countdown");
  startChallengeButton.textContent = phase === "preparation" ? "Skip prep and start speaking" : "Start 1-minute preparation";
}

function runChallengePhase(phase) {
  stopChallengeTimer();
  setChallengePhase(phase);
  challengeStatus.textContent = phase === "preparation"
    ? "Preparation started. Make a few notes, then speak naturally."
    : "Your 60-second speaking challenge has started. Speak naturally; do not memorize an answer.";

  challengeInterval = window.setInterval(() => {
    challengeSeconds -= 1;
    challengeTimer.textContent = showTime(challengeSeconds);

    if (challengeSeconds <= 0) {
      stopChallengeTimer();
      if (challengePhase === "preparation") {
        runChallengePhase("speaking");
      } else {
        challengePhase = "complete";
        startChallengeButton.textContent = "Start again";
        challengeTimer.textContent = "00:00";
        challengeStatus.textContent = "Challenge complete. Try again with a different example.";
      }
    }
  }, 1000);
}

startChallengeButton.addEventListener("click", () => {
  if (challengePhase === "preparation") {
    runChallengePhase("speaking");
  } else {
    runChallengePhase("preparation");
  }
});

document.getElementById("reset-challenge").addEventListener("click", () => {
  stopChallengeTimer();
  challengePhase = "ready";
  challengeSeconds = 60;
  challengeTimer.textContent = showTime(challengeSeconds);
  challengeTimer.setAttribute("aria-label", "Preparation countdown");
  startChallengeButton.textContent = "Start 1-minute preparation";
  challengeStatus.textContent = "Plan a few ideas, then speak naturally instead of memorizing an answer.";
});
