document.querySelectorAll(".reveal-button").forEach((button) => {
  const answer = document.getElementById(button.getAttribute("aria-controls"));

  if (!answer) {
    console.error("Answer panel not found for reveal button:", button);
    return;
  }

  button.textContent = "Show answer";

  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    answer.hidden = isExpanded;
    button.setAttribute("aria-expanded", String(!isExpanded));
    button.textContent = isExpanded ? "Show answer" : "Hide answer";
  });
});

const playerStatus = document.getElementById("player-status");
const segmentTimes = {
  "day-1": { start: 0, end: 266, label: "Day 1" },
  "day-2": { start: 266, end: 533, label: "Day 2" },
  "day-3": { start: 533, end: 799, label: "Day 3" }
};

let player;
let activeSegment;
let playerReady = false;

function formatTime(seconds) {
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, "0")}`;
}

function updateSegmentStatus(state) {
  if (!activeSegment) {
    return;
  }

  if (state === YT.PlayerState.PLAYING) {
    playerStatus.textContent = `${activeSegment.label} is playing. Playback will pause at ${formatTime(activeSegment.end)}.`;
  } else if (state === YT.PlayerState.BUFFERING) {
    playerStatus.textContent = `${activeSegment.label} is buffering from ${formatTime(activeSegment.start)}. If it does not start, use the direct YouTube link.`;
  } else if (state === YT.PlayerState.PAUSED) {
    playerStatus.textContent = `${activeSegment.label} is paused at ${formatTime(player.getCurrentTime())}.`;
  } else if (state === YT.PlayerState.ENDED) {
    const finishedAtSegmentEnd = player.getCurrentTime() >= activeSegment.end - 0.5;
    const label = activeSegment.label;
    activeSegment = null;
    playerStatus.textContent = finishedAtSegmentEnd
      ? `${label} section finished. Use the next day’s button when you are ready.`
      : `The video ended before the ${label} section finished. Use a direct YouTube link to continue.`;
  } else {
    playerStatus.textContent = `Waiting for ${activeSegment.label} to start at ${formatTime(activeSegment.start)}. If it does not start, use the direct YouTube link.`;
  }
}

function initialisePlayer() {
  player = new YT.Player("video-player", {
    events: {
      onReady: () => {
        playerReady = true;
        playerStatus.textContent = "Video player ready. Choose a day’s button to play its section.";
      },
      onStateChange: (event) => updateSegmentStatus(event.data),
      onError: (event) => {
        playerStatus.textContent = `The embedded video could not play (YouTube error ${event.data}). Use a direct YouTube link instead.`;
      }
    }
  });
}

window.onYouTubeIframeAPIReady = initialisePlayer;

const youtubeApi = document.createElement("script");
youtubeApi.src = "https://www.youtube.com/iframe_api";
youtubeApi.async = true;
youtubeApi.onerror = () => {
  playerStatus.textContent = "The video controls could not load. Use a direct YouTube link for each section.";
};
document.head.append(youtubeApi);

document.querySelectorAll(".play-segment").forEach((button) => {
  button.addEventListener("click", () => {
    const segment = segmentTimes[button.dataset.segment];

    if (!segment) {
      console.error("Unknown video segment:", button.dataset.segment);
      return;
    }

    if (!playerReady) {
      playerStatus.textContent = "The embedded player is still loading. Use the direct YouTube link beside this button.";
      return;
    }

    activeSegment = segment;
    playerStatus.textContent = `Starting ${segment.label} at ${formatTime(segment.start)}.`;
    player.seekTo(segment.start, true);
    player.playVideo();
    window.setTimeout(() => {
      if (activeSegment === segment) {
        updateSegmentStatus(player.getPlayerState());
      }
    }, 1000);
  });
});

window.setInterval(() => {
  if (!playerReady || !activeSegment || player.getPlayerState() !== YT.PlayerState.PLAYING) {
    return;
  }

  if (player.getCurrentTime() >= activeSegment.end) {
    player.pauseVideo();
    playerStatus.textContent = `${activeSegment.label} section finished. Use the next day’s button when you are ready.`;
    activeSegment = null;
  }
}, 500);
