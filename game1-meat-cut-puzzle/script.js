/* =============================================
   GAME 1: Label the Cuts – Full Logic
   =============================================
   Drag & drop meat cut labeling game
   - Canvas-drawn animal outlines
   - Drag labels to correct drop zones
   - Scoring, timer, hints
   - Touch + mouse support
   ============================================= */

(function () {
  'use strict';

  // =============================================
  // ANIMAL DATA
  // Each cut has: name, color, and position (%)
  // x, y, w, h are percentages of canvas size
  // =============================================

  var ANIMALS = {
    beef: {
      emoji: '🐄',
      title: 'Beef',
      bodyColor: '#e8c4b8',
      bodyStroke: '#8b4513',
      cuts: [
        { name: 'Chuck',       color: '#e74c3c', x: 5,  y: 25, w: 16, h: 22 },
        { name: 'Rib',         color: '#e67e22', x: 21, y: 25, w: 14, h: 22 },
        { name: 'Short Loin',  color: '#f1c40f', x: 35, y: 25, w: 14, h: 22 },
        { name: 'Sirloin',     color: '#2ecc71', x: 49, y: 25, w: 14, h: 22 },
        { name: 'Round',       color: '#1abc9c', x: 63, y: 25, w: 18, h: 22 },
        { name: 'Brisket',     color: '#3498db', x: 5,  y: 52, w: 18, h: 20 },
        { name: 'Short Plate', color: '#9b59b6', x: 23, y: 52, w: 18, h: 20 },
        { name: 'Flank',       color: '#e84393', x: 41, y: 52, w: 16, h: 20 },
        { name: 'Shank',       color: '#fd79a8', x: 5,  y: 75, w: 16, h: 16 },
        { name: 'Rump',        color: '#00cec9', x: 63, y: 52, w: 18, h: 20 }
      ]
    },
    pork: {
      emoji: '🐷',
      title: 'Pork',
      bodyColor: '#f5d5c8',
      bodyStroke: '#a0522d',
      cuts: [
        { name: 'Shoulder Butt',   color: '#e74c3c', x: 5,  y: 25, w: 18, h: 22 },
        { name: 'Loin',            color: '#e67e22', x: 23, y: 25, w: 20, h: 22 },
        { name: 'Sirloin',         color: '#f1c40f', x: 43, y: 25, w: 14, h: 22 },
        { name: 'Ham (Leg)',       color: '#2ecc71', x: 57, y: 25, w: 22, h: 22 },
        { name: 'Picnic Shoulder', color: '#3498db', x: 5,  y: 52, w: 18, h: 20 },
        { name: 'Spare Ribs',     color: '#9b59b6', x: 23, y: 52, w: 18, h: 20 },
        { name: 'Belly',          color: '#e84393', x: 41, y: 52, w: 20, h: 20 },
        { name: 'Hock',           color: '#1abc9c', x: 63, y: 52, w: 16, h: 20 },
        { name: 'Trotter',        color: '#fd79a8', x: 63, y: 75, w: 16, h: 16 }
      ]
    },
    lamb: {
      emoji: '🐑',
      title: 'Lamb',
      bodyColor: '#f0ddd0',
      bodyStroke: '#8b6348',
      cuts: [
        { name: 'Neck',       color: '#e74c3c', x: 5,  y: 25, w: 12, h: 22 },
        { name: 'Shoulder',   color: '#e67e22', x: 17, y: 25, w: 16, h: 22 },
        { name: 'Rack',       color: '#f1c40f', x: 33, y: 25, w: 14, h: 22 },
        { name: 'Loin',       color: '#2ecc71', x: 47, y: 25, w: 16, h: 22 },
        { name: 'Leg',        color: '#1abc9c', x: 63, y: 25, w: 18, h: 22 },
        { name: 'Breast',     color: '#3498db', x: 17, y: 52, w: 20, h: 20 },
        { name: 'Shank (F)',  color: '#9b59b6', x: 5,  y: 52, w: 12, h: 20 },
        { name: 'Belly',      color: '#e84393', x: 37, y: 52, w: 18, h: 20 },
        { name: 'Chump',      color: '#00cec9', x: 55, y: 52, w: 14, h: 20 }
      ]
    }
  };

  // =============================================
  // GAME STATE
  // =============================================
  var currentAnimal = 'beef';
  var placedCount = 0;
  var totalCuts = 0;
  var mistakes = 0;
  var score = 0;
  var seconds = 0;
  var timerInterval = null;
  var isPlaying = false;
  var hintsUsed = 0;
  var maxHints = 3;

  // Track which cuts are placed
  var placedCuts = {};

  // Currently dragged label
  var draggedLabel = null;
  var draggedCutName = '';

  // =============================================
  // DOM REFERENCES
  // =============================================
  var animalCanvas = document.getElementById('animalCanvas');
  var ctx = animalCanvas.getContext('2d');
  var dropZoneContainer = document.getElementById('dropZoneContainer');
  var labelContainer = document.getElementById('labelContainer');
  var placedCountEl = document.getElementById('placedCount');
  var mistakeCountEl = document.getElementById('mistakeCount');
  var timerEl = document.getElementById('timer');
  var scoreEl = document.getElementById('score');
  var startBtn = document.getElementById('startBtn');
  var hintBtn = document.getElementById('hintBtn');
  var resetBtn = document.getElementById('resetBtn');
  var animalBtns = document.querySelectorAll('.animal-btn');
  var hintTooltip = document.getElementById('hintTooltip');
  var hintText = document.getElementById('hintText');

  // Modals
  var introModal = document.getElementById('introModal');
  var introStartBtn = document.getElementById('introStartBtn');
  var winModal = document.getElementById('winModal');
  var winMessage = document.getElementById('winMessage');
  var winPlaced = document.getElementById('winPlaced');
  var winMistakes = document.getElementById('winMistakes');
  var winTime = document.getElementById('winTime');
  var winScore = document.getElementById('winScore');
  var learnedList = document.getElementById('learnedList');
  var winNextBtn = document.getElementById('winNextBtn');
  var winReplayBtn = document.getElementById('winReplayBtn');

  // =============================================
  // DRAWING: Animal body outline on canvas
  // =============================================

  function drawAnimalBody() {
    var w = animalCanvas.width;
    var h = animalCanvas.height;
    var data = ANIMALS[currentAnimal];

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Background
    var bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#fdf6ee');
    bg.addColorStop(1, '#f5e6d0');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#5a2d0c';
    ctx.font = 'bold 18px -apple-system, sans-serif';
    ctx.fillText(data.emoji + ' ' + data.title.toUpperCase() + ' CUTS', w / 2, 28);

    // Underline
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.25, 36);
    ctx.lineTo(w * 0.75, 36);
    ctx.stroke();

    // Draw animal body shape
    drawBodyShape(ctx, w, h, data);

    // Draw cut section outlines with colors
    drawCutSections(ctx, w, h, data);

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(90, 45, 12, 0.3)';
    ctx.font = '9px sans-serif';
    ctx.fillText('Drag each label to the matching area', w / 2, h - 8);
  }

  // =============================================
  // DRAWING: Body shape per animal
  // =============================================

  function drawBodyShape(ctx, w, h, data) {
    var ox = w * 0.05;
    var oy = h * 0.22;
    var bw = w * 0.78;
    var bh = h * 0.52;

    ctx.save();
    ctx.beginPath();

    if (currentAnimal === 'beef') {
      // Beef: large rectangular body
      ctx.moveTo(ox, oy + bh * 0.1);
      ctx.quadraticCurveTo(ox + bw * 0.1, oy - bh * 0.05, ox + bw * 0.3, oy);
      ctx.quadraticCurveTo(ox + bw * 0.5, oy - bh * 0.08, ox + bw * 0.7, oy);
      ctx.quadraticCurveTo(ox + bw * 0.9, oy + bh * 0.02, ox + bw, oy + bh * 0.15);
      ctx.quadraticCurveTo(ox + bw + 10, oy + bh * 0.5, ox + bw, oy + bh * 0.85);
      ctx.quadraticCurveTo(ox + bw * 0.8, oy + bh + 5, ox + bw * 0.5, oy + bh);
      ctx.quadraticCurveTo(ox + bw * 0.2, oy + bh + 5, ox, oy + bh * 0.8);
      ctx.quadraticCurveTo(ox - 10, oy + bh * 0.5, ox, oy + bh * 0.1);
    } else if (currentAnimal === 'pork') {
      // Pork: rounder body
      ctx.moveTo(ox, oy + bh * 0.2);
      ctx.quadraticCurveTo(ox + bw * 0.05, oy - bh * 0.1, ox + bw * 0.25, oy);
      ctx.quadraticCurveTo(ox + bw * 0.5, oy - bh * 0.12, ox + bw * 0.75, oy);
      ctx.quadraticCurveTo(ox + bw, oy + bh * 0.05, ox + bw + 5, oy + bh * 0.35);
      ctx.quadraticCurveTo(ox + bw + 8, oy + bh * 0.65, ox + bw, oy + bh * 0.9);
      ctx.quadraticCurveTo(ox + bw * 0.7, oy + bh + 10, ox + bw * 0.4, oy + bh);
      ctx.quadraticCurveTo(ox + bw * 0.1, oy + bh + 5, ox, oy + bh * 0.75);
      ctx.quadraticCurveTo(ox - 8, oy + bh * 0.45, ox, oy + bh * 0.2);
    } else {
      // Lamb: smaller, compact body
      ctx.moveTo(ox, oy + bh * 0.15);
      ctx.quadraticCurveTo(ox + bw * 0.08, oy - bh * 0.05, ox + bw * 0.25, oy + bh * 0.02);
      ctx.quadraticCurveTo(ox + bw * 0.5, oy - bh * 0.1, ox + bw * 0.75, oy + bh * 0.02);
      ctx.quadraticCurveTo(ox + bw * 0.95, oy + bh * 0.1, ox + bw, oy + bh * 0.3);
      ctx.quadraticCurveTo(ox + bw + 5, oy + bh * 0.6, ox + bw * 0.95, oy + bh * 0.85);
      ctx.quadraticCurveTo(ox + bw * 0.75, oy + bh + 8, ox + bw * 0.45, oy + bh);
      ctx.quadraticCurveTo(ox + bw * 0.15, oy + bh + 5, ox + bw * 0.05, oy + bh * 0.8);
      ctx.quadraticCurveTo(ox - 5, oy + bh * 0.5, ox, oy + bh * 0.15);
    }

    ctx.closePath();
    ctx.fillStyle = data.bodyColor;
    ctx.fill();
    ctx.strokeStyle = data.bodyStroke;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }

  // =============================================
  // DRAWING: Cut section areas with colors
  // =============================================
  function drawCutSections(ctx, w, h, data) {
    data.cuts.forEach(function (cut, index) {
      var x = (cut.x / 100) * w;
      var y = (cut.y / 100) * h;
      var cw = (cut.w / 100) * w;
      var ch = (cut.h / 100) * h;

      // Filled rectangle with transparency
      ctx.fillStyle = cut.color + '25';
      ctx.fillRect(x, y, cw, ch);

      // Dashed border
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = cut.color + '60';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, cw, ch);
      ctx.setLineDash([]);

      // Just a "?" in center (no number)
      var cx = x + cw / 2;
      var cy = y + ch / 2;

      ctx.fillStyle = cut.color + '90';
      ctx.font = 'bold 18px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('?', cx, cy);

      ctx.textBaseline = 'alphabetic';
    });
  }


  // =============================================
  // CREATE: Drop zones over the canvas
  // =============================================

    function createDropZones() {
    dropZoneContainer.innerHTML = '';
    var data = ANIMALS[currentAnimal];

    data.cuts.forEach(function (cut, index) {
      var zone = document.createElement('div');
      zone.className = 'drop-zone';
      zone.setAttribute('data-cut', cut.name);
      zone.setAttribute('data-index', index);

      // Position using percentage values
      zone.style.left = cut.x + '%';
      zone.style.top = cut.y + '%';
      zone.style.width = cut.w + '%';
      zone.style.height = cut.h + '%';

      // Just a "?" (no number)
      var qMark = document.createElement('span');
      qMark.className = 'zone-question';
      qMark.textContent = '?';
      zone.appendChild(qMark);

      // Label text (shown when correctly placed)
      var labelSpan = document.createElement('span');
      labelSpan.className = 'zone-label-text';
      labelSpan.textContent = cut.name;
      zone.appendChild(labelSpan);

      // Drag over
      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        if (!zone.classList.contains('correct')) {
          zone.classList.add('drag-over');
        }
      });

      // Drag leave
      zone.addEventListener('dragleave', function () {
        zone.classList.remove('drag-over');
      });

      // Drop
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('drag-over');
        handleDrop(zone, cut.name, index);
      });

      dropZoneContainer.appendChild(zone);
    });
  }
  // =============================================
  // CREATE: Draggable labels
  // =============================================

    function createLabels() {
    labelContainer.innerHTML = '';
    var data = ANIMALS[currentAnimal];
    totalCuts = data.cuts.length;

    // Shuffle the cuts for label order
    var shuffled = data.cuts.map(function (cut, index) {
      return { name: cut.name, color: cut.color, origIndex: index };
    });
    shuffleArray(shuffled);

    shuffled.forEach(function (item, i) {
      var label = document.createElement('div');
      label.className = 'cut-label';
      label.setAttribute('draggable', 'true');
      label.setAttribute('data-cut', item.name);

      // Animation delay
      label.style.animationDelay = (i * 0.05) + 's';

      // Color dot only (no number)
      var dot = document.createElement('span');
      dot.className = 'label-dot';
      dot.style.background = item.color;
      label.appendChild(dot);

      // Name text only
      var textSpan = document.createElement('span');
      textSpan.textContent = item.name;
      label.appendChild(textSpan);

      // Drag events
      label.addEventListener('dragstart', function (e) {
        draggedLabel = label;
        draggedCutName = item.name;
        label.classList.add('dragging');
        e.dataTransfer.setData('text/plain', item.name);
        e.dataTransfer.effectAllowed = 'move';
      });

      label.addEventListener('dragend', function () {
        label.classList.remove('dragging');
        draggedLabel = null;
        draggedCutName = '';
        var zones = dropZoneContainer.querySelectorAll('.drop-zone');
        zones.forEach(function (z) { z.classList.remove('drag-over'); });
      });

      // Touch support
      addTouchSupport(label, item.name);

      labelContainer.appendChild(label);
    });

    updateStats();
  }


  // =============================================
  // TOUCH SUPPORT for mobile drag & drop
  // =============================================

  function addTouchSupport(label, cutName) {
    var clone = null;
    var startX = 0;
    var startY = 0;

    label.addEventListener('touchstart', function (e) {
      if (label.classList.contains('placed')) return;
      e.preventDefault();

      var touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;

      // Create a floating clone
      clone = label.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      clone.style.opacity = '0.85';
      clone.style.width = label.offsetWidth + 'px';
      clone.style.transform = 'scale(1.1)';
      clone.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
      document.body.appendChild(clone);
      positionClone(clone, touch);

      label.classList.add('dragging');
      draggedLabel = label;
      draggedCutName = cutName;
    }, { passive: false });

    label.addEventListener('touchmove', function (e) {
      if (!clone) return;
      e.preventDefault();
      var touch = e.touches[0];
      positionClone(clone, touch);

      // Highlight drop zone under finger
      var zones = dropZoneContainer.querySelectorAll('.drop-zone');
      zones.forEach(function (zone) {
        var rect = zone.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          if (!zone.classList.contains('correct')) {
            zone.classList.add('drag-over');
          }
        } else {
          zone.classList.remove('drag-over');
        }
      });
    }, { passive: false });

    label.addEventListener('touchend', function (e) {
      if (!clone) return;
      e.preventDefault();

      var touch = e.changedTouches[0];

      // Find which drop zone we're over
      var zones = dropZoneContainer.querySelectorAll('.drop-zone');
      var dropped = false;

      zones.forEach(function (zone) {
        zone.classList.remove('drag-over');
        var rect = zone.getBoundingClientRect();
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          var zoneCut = zone.getAttribute('data-cut');
          var zoneIndex = parseInt(zone.getAttribute('data-index'));
          handleDrop(zone, zoneCut, zoneIndex);
          dropped = true;
        }
      });

      // Clean up
      if (clone && clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      clone = null;
      label.classList.remove('dragging');
      draggedLabel = null;
      draggedCutName = '';
    }, { passive: false });
  }

  function positionClone(clone, touch) {
    clone.style.left = (touch.clientX - 60) + 'px';
    clone.style.top = (touch.clientY - 20) + 'px';
  }

  // =============================================
  // HANDLE DROP: Check correct/wrong
  // =============================================

  function handleDrop(zone, expectedCut, zoneIndex) {
    if (!isPlaying) return;
    if (zone.classList.contains('correct')) return;
    if (!draggedCutName) return;

    if (draggedCutName === expectedCut) {
      // ✅ CORRECT
      zone.classList.add('correct');

      if (draggedLabel) {
        draggedLabel.classList.add('placed');
        draggedLabel.setAttribute('draggable', 'false');
      }

      placedCuts[expectedCut] = true;
      placedCount++;
      score += calculatePoints();

      // Redraw the canvas to show the placed label
      redrawWithPlacements();

      updateStats();

      // Check if all placed
      if (placedCount >= totalCuts) {
        handleWin();
      }

    } else {
      // ❌ WRONG
      zone.classList.add('wrong');
      mistakes++;
      score = Math.max(0, score - 5);
      updateStats();

      // Remove wrong class after animation
      setTimeout(function () {
        zone.classList.remove('wrong');
      }, 500);
    }
  }

  // =============================================
  // REDRAW: Update canvas with placed labels
  // =============================================

  function redrawWithPlacements() {
    var w = animalCanvas.width;
    var h = animalCanvas.height;
    var data = ANIMALS[currentAnimal];

    // Redraw full diagram
    drawAnimalBody();

    // Override placed cuts with solid fill and name
    data.cuts.forEach(function (cut, index) {
      if (placedCuts[cut.name]) {
        var x = (cut.x / 100) * w;
        var y = (cut.y / 100) * h;
        var cw = (cut.w / 100) * w;
        var ch = (cut.h / 100) * h;

        // Solid fill
        ctx.fillStyle = cut.color + '50';
        ctx.fillRect(x, y, cw, ch);

        // Solid border
        ctx.strokeStyle = cut.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cw, ch);

        // Name in center
        var cx = x + cw / 2;
        var cy = y + ch / 2;

        // Background pill for text
        ctx.fillStyle = cut.color;
        var textWidth = ctx.measureText(cut.name).width;
        var pillW = textWidth + 16;
        var pillH = 20;
        roundRect(ctx, cx - pillW / 2, cy - pillH / 2, pillW, pillH, 4);
        ctx.fill();

        // Text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cut.name, cx, cy);

        // Checkmark
        ctx.fillStyle = '#27ae60';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('✓', cx + textWidth / 2 + 10, cy);

        ctx.textBaseline = 'alphabetic';
      }
    });
  }

  // =============================================
  // HELPER: Draw rounded rectangle
  // =============================================

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // =============================================
  // SCORING
  // =============================================

  function calculatePoints() {
    // Base 10 points per correct placement
    // Bonus for speed (under 60 seconds)
    var basePoints = 10;
    if (seconds < 30) basePoints += 5;
    else if (seconds < 60) basePoints += 3;
    return basePoints;
  }

  function calculateFinalScore() {
    var data = ANIMALS[currentAnimal];
    var base = placedCount * 10;
    var mistakePenalty = mistakes * 5;
    var hintPenalty = hintsUsed * 3;
    var timeBonus = 0;

    if (seconds < 30) timeBonus = 20;
    else if (seconds < 60) timeBonus = 10;
    else if (seconds < 120) timeBonus = 5;

    return Math.max(0, base - mistakePenalty - hintPenalty + timeBonus);
  }

  // =============================================
  // TIMER
  // =============================================

  function startTimer() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(function () {
      seconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateTimerDisplay() {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    timerEl.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  // =============================================
  // UPDATE STATS DISPLAY
  // =============================================

  function updateStats() {
    placedCountEl.textContent = placedCount + '/' + totalCuts;
    mistakeCountEl.textContent = mistakes;
    scoreEl.textContent = score;
  }

  // =============================================
  // HINT SYSTEM
  // =============================================

  function showHint() {
    if (hintsUsed >= maxHints) return;
    if (!isPlaying) return;

    var data = ANIMALS[currentAnimal];

    // Find the first unplaced cut
    var unplaced = null;
    for (var i = 0; i < data.cuts.length; i++) {
      if (!placedCuts[data.cuts[i].name]) {
        unplaced = data.cuts[i];
        break;
      }
    }

    if (!unplaced) return;

    hintsUsed++;
    hintText.textContent = '💡 Hint: "' + unplaced.name + '" goes in zone #' + (data.cuts.indexOf(unplaced) + 1);
    hintTooltip.classList.remove('hidden');

    // Flash the drop zone
    var zones = dropZoneContainer.querySelectorAll('.drop-zone');
    zones.forEach(function (zone) {
      if (zone.getAttribute('data-cut') === unplaced.name) {
        zone.style.boxShadow = '0 0 20px ' + unplaced.color;
        setTimeout(function () {
          zone.style.boxShadow = '';
        }, 2000);
      }
    });

    // Hide tooltip after 3 seconds
    setTimeout(function () {
      hintTooltip.classList.add('hidden');
    }, 3000);

    // Update hint button
    if (hintsUsed >= maxHints) {
      hintBtn.disabled = true;
      hintBtn.textContent = '💡 No hints left';
    } else {
      hintBtn.textContent = '💡 Hint (' + (maxHints - hintsUsed) + ' left)';
    }
  }

  // =============================================
  // WIN HANDLER
  // =============================================

  function handleWin() {
    isPlaying = false;
    stopTimer();

    var finalScore = calculateFinalScore();
    var timeStr = timerEl.textContent;
    var data = ANIMALS[currentAnimal];

    // Win message
    winMessage.textContent = 'You labeled all ' + data.title.toLowerCase() +
      ' cuts correctly!';

    // Score breakdown
    winPlaced.textContent = placedCount + '/' + totalCuts;
    winMistakes.textContent = mistakes;
    winTime.textContent = timeStr;
    winScore.textContent = finalScore + ' pts';

    // What you learned list
    learnedList.innerHTML = '';
    data.cuts.forEach(function (cut) {
      var item = document.createElement('div');
      item.className = 'learned-item';

      var dot = document.createElement('span');
      dot.className = 'learned-dot';
      dot.style.background = cut.color;

      var name = document.createElement('span');
      name.className = 'learned-name';
      name.textContent = cut.name;

      item.appendChild(dot);
      item.appendChild(name);
      learnedList.appendChild(item);
    });

    // Next animal button
    var animalKeys = Object.keys(ANIMALS);
    var currentIdx = animalKeys.indexOf(currentAnimal);
    var nextIdx = (currentIdx + 1) % animalKeys.length;
    var nextAnimal = animalKeys[nextIdx];
    winNextBtn.textContent = 'Next: ' + ANIMALS[nextAnimal].emoji + ' ' +
      ANIMALS[nextAnimal].title + ' →';
    winNextBtn.setAttribute('data-next', nextAnimal);

    winModal.classList.remove('hidden');
  }

  // =============================================
  // GAME ACTIONS
  // =============================================

  function startGame() {
    // Reset state
    placedCount = 0;
    mistakes = 0;
    score = 0;
    seconds = 0;
    hintsUsed = 0;
    placedCuts = {};
    isPlaying = true;

    // Reset hint button
    hintBtn.disabled = false;
    hintBtn.textContent = '💡 Hint (' + maxHints + ' left)';

    // Draw animal and create game elements
    drawAnimalBody();
    createDropZones();
    createLabels();
    updateStats();
    startTimer();

    // Update button
    startBtn.textContent = '🔀 Restart';
  }

  function resetGame() {
    isPlaying = false;
    stopTimer();
    placedCount = 0;
    mistakes = 0;
    score = 0;
    seconds = 0;
    hintsUsed = 0;
    placedCuts = {};

    hintBtn.disabled = true;
    hintBtn.textContent = '💡 Hint (3 left)';
    startBtn.textContent = '▶ Start Game';

    drawAnimalBody();
    createDropZones();
    labelContainer.innerHTML = '';
    updateStats();
    updateTimerDisplay();
  }

  function switchAnimal(animal) {
    currentAnimal = animal;

    // Update button styles
    animalBtns.forEach(function (btn) {
      btn.classList.remove('active');
      if (btn.getAttribute('data-animal') === animal) {
        btn.classList.add('active');
      }
    });

    resetGame();
  }

  // =============================================
  // UTILITY: Shuffle array
  // =============================================

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  // =============================================
  // EVENT LISTENERS
  // =============================================

  // Start button
  startBtn.addEventListener('click', function () {
    startGame();
  });

  // Reset button
  resetBtn.addEventListener('click', function () {
    resetGame();
  });

  // Hint button
  hintBtn.addEventListener('click', function () {
    showHint();
  });

  // Animal selector buttons
  animalBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var animal = btn.getAttribute('data-animal');
      switchAnimal(animal);
    });
  });

  // Intro modal start button
  introStartBtn.addEventListener('click', function () {
    introModal.classList.add('hidden');
  });

  // Win modal buttons
  winReplayBtn.addEventListener('click', function () {
    winModal.classList.add('hidden');
    startGame();
  });

  winNextBtn.addEventListener('click', function () {
    var next = winNextBtn.getAttribute('data-next');
    winModal.classList.add('hidden');
    switchAnimal(next);
    setTimeout(function () { startGame(); }, 300);
  });

  // Close modals on overlay click
  winModal.addEventListener('click', function (e) {
    if (e.target === winModal) winModal.classList.add('hidden');
  });

  // =============================================
  // INIT
  // =============================================

  function init() {
    drawAnimalBody();
    createDropZones();
    updateStats();
    updateTimerDisplay();
    totalCuts = ANIMALS[currentAnimal].cuts.length;
    placedCountEl.textContent = '0/' + totalCuts;
  }

  init();

})();