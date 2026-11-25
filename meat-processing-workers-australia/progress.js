const progressKey = "teetalkenglish-meat-processing-workers-week-";
const completedWeeks = new Set();

document.querySelectorAll("[data-progress-week]").forEach((card) => {
  const week = card.dataset.progressWeek;
  const complete = localStorage.getItem(`${progressKey}${week}`) === "complete";
  const status = card.querySelector("[data-status]");
  const progress = card.querySelector("[data-week-progress]");

  if (complete) {
    completedWeeks.add(week);
  }

  status.textContent = complete ? "Complete" : "Not started";
  status.classList.toggle("is-complete", complete);
  progress.value = complete ? 1 : 0;
});

document.querySelectorAll("[data-complete-week]").forEach((checkbox) => {
  const week = checkbox.dataset.completeWeek;
  checkbox.checked = localStorage.getItem(`${progressKey}${week}`) === "complete";

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      localStorage.setItem(`${progressKey}${week}`, "complete");
    } else {
      localStorage.removeItem(`${progressKey}${week}`);
    }
  });
});

const courseProgress = document.getElementById("course-progress");
const courseProgressText = document.getElementById("course-progress-text");

if (courseProgress && courseProgressText) {
  const completedCount = completedWeeks.size;
  courseProgress.value = completedCount;
  courseProgressText.textContent = `${completedCount} of 4 weeks complete`;
}

window.addEventListener("storage", (event) => {
  if (!event.key || !event.key.startsWith(progressKey)) {
    return;
  }

  const week = event.key.slice(progressKey.length);
  const complete = event.newValue === "complete";
  const card = document.querySelector(`[data-progress-week="${week}"]`);

  if (card) {
    const status = card.querySelector("[data-status]");
    const progress = card.querySelector("[data-week-progress]");
    status.textContent = complete ? "Complete" : "Not started";
    status.classList.toggle("is-complete", complete);
    progress.value = complete ? 1 : 0;
  }

  const checkbox = document.querySelector(`[data-complete-week="${week}"]`);
  if (checkbox) {
    checkbox.checked = complete;
  }

  if (complete) {
    completedWeeks.add(week);
  } else {
    completedWeeks.delete(week);
  }

  if (courseProgress && courseProgressText) {
    courseProgress.value = completedWeeks.size;
    courseProgressText.textContent = `${completedWeeks.size} of 4 weeks complete`;
  }
});
