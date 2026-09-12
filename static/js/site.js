const VIDEO_ROOT = "./static/videos";

// ACT slots are intentionally reserved here. Add the ACT paths with the same
// task/pool structure, then enable the ACT policy button in index.html.
const simulationVideos = {
  dp: {
    lift: {
      50: ["dp-sim/lift/lift_cut50.mp4", "dp-sim/lift/lift_50.mp4"],
      100: ["dp-sim/lift/lift_cut100.mp4", "dp-sim/lift/lift_100.mp4"]
    },
    can: {
      50: ["dp-sim/can/can_cut50.mp4", "dp-sim/can/can_50.mp4"],
      100: ["dp-sim/can/can_cut100.mp4", "dp-sim/can/can_100.mp4"]
    },
    square: {
      50: ["dp-sim/square/square_cut50.mp4", "dp-sim/square/square_50.mp4"],
      100: ["dp-sim/square/square_cut100.mp4", "dp-sim/square/square_100.mp4"]
    },
    toolhang: {
      50: ["dp-sim/toolhang/toolhang_cut50.mp4", "dp-sim/toolhang/toolhang_50.mp4"],
      100: ["dp-sim/toolhang/toolhang_cut100.mp4", "dp-sim/toolhang/toolhang_100.mp4"]
    },
    transport: {
      50: ["dp-sim/transport/transport_cut50.mp4", "dp-sim/transport/transport_50.mp4"],
      100: ["dp-sim/transport/transport_cut100.mp4", "dp-sim/transport/transport_100.mp4"]
    }
  },
  act: {
      lift: {
      50: ["act-sim/lift/lift-cut50.mp4", "act-sim/lift/lift-50.mp4"],
      100: ["act-sim/lift/lift-cut100.mp4", "act-sim/lift/lift-100.mp4"]
    },
    can: {
      50: ["act-sim/can/can-cut50.mp4", "act-sim/can/can-50.mp4"],
      100: ["act-sim/can/can-cut100.mp4", "act-sim/can/can-100.mp4"]
    },
    square: {
      50: ["act-sim/square/square-cut50.mp4", "act-sim/square/square-50.mp4"],
      100: ["act-sim/square/square-cut100.mp4", "act-sim/square/square-100.mp4"]
    },
    toolhang: {
      50: ["act-sim/toolhang/toolhang-cut50.mp4", "act-sim/toolhang/toolhang-50.mp4"],
      100: ["act-sim/toolhang/toolhang-cut100.mp4", "act-sim/toolhang/toolhang-100.mp4"]
    },
    transport: {
      50: ["act-sim/transport/transport-cut50.mp4", "act-sim/transport/transport-50.mp4"],
      100: ["act-sim/transport/transport-cut100.mp4", "act-sim/transport/transport-100.mp4"]
    }
  }
};

const realVideos = {
  bookfetching: {
    50: ["bookfetching/book_cut50.mp4", "bookfetching/book_50.mp4"],
    100: ["bookfetching/book_cut100.mp4", "bookfetching/book_100.mp4"]
  },
  waterstowing: {
    50: ["waterstowing/shop_cut50.mp4", "waterstowing/shop_50.mp4"],
    100: ["waterstowing/shop_cut100.mp4", "waterstowing/shop_100.mp4"]
  },
  traysetting: {
    50: ["traysetting/tray_cut50.mp4", "traysetting/tray_50.mp4"],
    100: ["traysetting/tray_cut100.mp4", "traysetting/tray_100.mp4"]
  }
};

const detectionImages = {
  can: [{ path: "can.png", label: "Can" }],
  lift: [{ path: "lift.png", label: "Lift" }],
  square: [{ path: "square.png", label: "Square" }],
  toolhang: [{ path: "toolhang.png", label: "Tool Hang" }],
  transport: [
    { path: "transport0.png", label: "Transport — left arm" },
    { path: "transport1.png", label: "Transport — right arm" }
  ],
  book: [{ path: "book.png", label: "Book Fetching" }],
  shop: [{ path: "shop.png", label: "Water Stowing" }],
  tray: [
    { path: "tray0.png", label: "Tray Setting — left arm" },
    { path: "tray1.png", label: "Tray Setting — right arm" }
  ]
};

const ablationVideos = {
  bookfetching: {
    label: "Book Fetching",
    tsd: ["bookfetching/book_cut100.mp4", "TSD (P+A)"],
    precise: ["bookfetching/book_cut_onlyprecision.mp4", "Precise only"],
    preciseMatched: ["bookfetching/book_70.mp4", "Full-Traj (P-matched)"],
    agile: ["bookfetching/book_cut_onlyagility.mp4", "Agile only"],
    agileMatched: ["bookfetching/book_39.mp4", "Full-Traj (A-matched)"]
  },
  toolhang: {
    label: "Tool Hang",
    tsd: ["dp-sim/toolhang/toolhang_cut100.mp4", "TSD (P+A)"],
    precise: ["ablation/toolhang/toolhang_agility.mp4", "Precise only"],
    preciseMatched: ["ablation/toolhang/toolhang_25.mp4", "Full-Traj (P-matched)"],
    agile: ["ablation/toolhang/toolhang_precision.mp4", "Agile only"],
    agileMatched: ["ablation/toolhang/toolhang_65.mp4", "Full-Traj (A-matched)"]
  }
};

function setVideo(video, relativePath) {
  video.pause();
  video.removeAttribute("src");
  if (relativePath) {
    video.src = `${VIDEO_ROOT}/${relativePath}`;
  }
  video.load();
}

function activateControl(panel, control, value) {
  panel.querySelectorAll(`[data-control="${control}"]`).forEach((button) => {
    button.classList.toggle("active", button.dataset.value === value);
  });
}

function initializeSimulationPanel() {
  const panel = document.querySelector('[data-comparison="simulation"]');
  if (!panel) return;

  const state = { policy: "dp", task: "lift", pool: "50" };
  const tsdVideo = document.getElementById("sim-tsd-video");
  const fullVideo = document.getElementById("sim-full-video");
  const tsdLabel = document.getElementById("sim-tsd-label");
  const fullLabel = document.getElementById("sim-full-label");

  function render() {
    const pair = simulationVideos[state.policy]?.[state.task]?.[state.pool];
    if (!pair) return;
    setVideo(tsdVideo, pair[0]);
    setVideo(fullVideo, pair[1]);
    tsdLabel.textContent = `TSD-${state.pool}`;
    fullLabel.textContent = `Full-${state.pool}`;
  }

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-control]");
    if (!button || button.disabled) return;
    const control = button.dataset.control;
    state[control] = button.dataset.value;
    activateControl(panel, control, button.dataset.value);
    render();
  });

  render();
}

function initializeRealPanel() {
  const panel = document.querySelector('[data-comparison="real"]');
  if (!panel) return;

  const state = { task: "bookfetching", pool: "50" };
  const tsdVideo = document.getElementById("real-tsd-video");
  const fullVideo = document.getElementById("real-full-video");
  const tsdLabel = document.getElementById("real-tsd-label");
  const fullLabel = document.getElementById("real-full-label");

  function render() {
    const pair = realVideos[state.task]?.[state.pool];
    if (!pair) return;
    setVideo(tsdVideo, pair[0]);
    setVideo(fullVideo, pair[1]);
    tsdLabel.textContent = `TSD-${state.pool}`;
    fullLabel.textContent = `Full-${state.pool}`;
  }

  panel.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-control]");
    if (!button) return;
    const control = button.dataset.control;
    state[control] = button.dataset.value;
    activateControl(panel, control, button.dataset.value);
    render();
  });

  render();
}

function initializeDetectionBrowser() {
  const taskSelect = document.getElementById("detection-task");
  const image = document.getElementById("detection-image");
  const caption = document.getElementById("detection-caption");
  const armControls = document.getElementById("detection-arm-controls");
  if (!taskSelect || !image || !caption || !armControls) return;

  let arm = 0;

  function render() {
    const entries = detectionImages[taskSelect.value];
    arm = Math.min(arm, entries.length - 1);
    const selected = entries[arm];
    image.src = `./static/images/detection/${selected.path}`;
    image.alt = `TSD detection result for ${selected.label}`;
    caption.textContent = selected.label;
    armControls.hidden = entries.length === 1;
    armControls.querySelectorAll("button[data-arm]").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.arm) === arm);
    });
  }

  taskSelect.addEventListener("change", () => {
    arm = 0;
    render();
  });

  armControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-arm]");
    if (!button) return;
    arm = Number(button.dataset.arm);
    render();
  });

  render();
}

function initializeAblationBrowser() {
  const taskSelect = document.getElementById("ablation-task");
  const conditionSelect = document.getElementById("ablation-condition");
  const video = document.getElementById("ablation-video");
  const caption = document.getElementById("ablation-video-caption");
  if (!taskSelect || !conditionSelect || !video || !caption) return;

  function render() {
    const task = ablationVideos[taskSelect.value];
    const selected = task[conditionSelect.value];
    setVideo(video, selected[0]);
    caption.textContent = `${task.label} — ${selected[1]}`;
  }

  taskSelect.addEventListener("change", render);
  conditionSelect.addEventListener("change", render);
  render();
}

initializeSimulationPanel();
initializeRealPanel();
initializeDetectionBrowser();
initializeAblationBrowser();

if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) {
    document.documentElement.style.scrollBehavior = "auto";
    target.scrollIntoView();
    requestAnimationFrame(() => {
      document.documentElement.style.removeProperty("scroll-behavior");
    });
  }
}
