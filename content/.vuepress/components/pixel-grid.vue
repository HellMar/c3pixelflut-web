<template>
  <section id="pixelGrid"></section>
</template>

<script>
import p5 from "p5";

var s = function(sketch) {
  sketch.disableFriendlyErrors = true;

  var grid = [];
  var gridBuffer = [];

  // 40C3 palette, ordered by energy (low -> high); top = neutral so the logo glows #DFEED5
  var colors = [
    "#031202", // dark
    "#3B5831", // additional-09
    "#584744", // additional-11
    "#7EAE83", // additional-08
    "#13AEA3", // additional-01
    "#999FCD", // additional-02
    "#B78FBF", // additional-03
    "#EB5D9D", // additional-04
    "#EB6F83", // additional-05
    "#F28931", // additional-06
    "#FAB93E", // additional-07
    "#FAB93E", // additional-07
    "#75B54B", // primary
    "#75B54B", // primary
    "#DFEED5", // neutral
    "#DFEED5"  // neutral
  ];

  var runners = [];

  // 40C3 motifs (CC0, from the official design package) that get "flooded"
  // into the grid from time to time and then decay like any other energy.
  var motifFiles = [
    // icons
    "Icon_Blinkenheart", "Chaosknoten", "Icon_Smiley", "Icon_Cat", "Star",
    "Icon_TV", "Icon_USB", "Icon_Trojan", "Icon_HelloThere", "Icon_Bitspider",
    "Icon_Swirl", "Icon_10", "Icon_Boot", "Chaospost", "Fairydust",
    "Icon_Blob0", "Icon_Blob1", "Icon_Blob2", "Icon_Blob3",
    // citizens
    "bip", "bep", "Adam", "Barbara", "Mona"
  ];
  // thin line-art needs more cells to stay recognizable (default min: 8)
  var MIN_WIDTH = { bip: 20 };
  var motifs = [];
  var stamps = [];
  var STAMP_EVERY = 60;  // frames between new motifs (2s at 30fps)
  var STAMP_IN = 15;     // frames to pixel a motif in (random pixel order)
  var STAMP_HOLD = 40;   // frames the motif stays complete
  var STAMP_OUT = 20;    // frames to pixel it out again (random pixel order)
  var STAMP_MAX = 4;     // max. motifs held at the same time
  var logo;

  // wordmark "c3Pixelflut" rendered in Jersey 10, cached per size
  var wordmark = null;

  sketch.setup = function() {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.frameRate(30);
    sketch.noStroke();
    sketch.background(3, 18, 2);

    initGrid(Math.floor(sketch.width / 10)+1, Math.floor(sketch.height / 10)+1);
    logo = document.querySelector("#logo");
    motifFiles.forEach(name => loadMotif(name, "/40c3/" + name + ".svg"));
  };

  sketch.draw = function() {
    if (sketch.frameCount % 30 === 0) {
      addRandomEnergy();
    }
    if (sketch.frameCount % 60 === 0) {
      addRunner()
    }
    if (sketch.frameCount % STAMP_EVERY === 0 && stamps.length < STAMP_MAX) {
      addStamp()
      // now and then a second one at once
      if (Math.random() < 0.3) { addStamp() }
    }

    moveRunners()
    applyStamps()

    spreadEnergy();
    reduceEntropy()
    // wordmark last: exact colors and clean gaps, no glow bleeding into letters
    energyLogo()
    drawGrid();
  };

  sketch.windowResized = function() {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.background(3, 18, 2);
    initGrid(Math.floor(sketch.width / 10)+1, Math.floor(sketch.height / 10)+1);
    stamps = [];
  };

  sketch.touchStarted = function() {
    increaseEnergy(
      Math.floor(sketch.mouseX / 10),
      Math.floor(sketch.mouseY / 10),
      colors.length * 500
    );
  };

  sketch.touchMoved = function() {
    increaseEnergy(
      Math.floor(sketch.mouseX / 10),
      Math.floor(sketch.mouseY / 10),
      sketch.random(colors.length, colors.length * 200)
    );
  };

  sketch.mouseMoved = function() {
    increaseEnergy(
      Math.floor(sketch.mouseX / 10),
      Math.floor(sketch.mouseY / 10),
      colors.length
    );
  };

  function initGrid(gridWidth, gridHeight) {
    for (let x = 0; x < gridWidth; x++) {
      grid[x] = [];

      for (let y = 0; y < gridHeight; y++) {
        grid[x][y] = 0;
      }
    }

    grid.forEach((el, i) => {
      gridBuffer[i] = el.slice(0);
    });

    drawGrid(true);
  }

  function drawPixel(x, y) {
    let val = Math.floor(grid[x][y]);
    if (val >= colors.length) {
      val = colors.length - 1;
    }
    if (val < 0) {
      val = 0;
    }

    sketch.fill(colors[val]);
    sketch.rect(x * 10, y * 10, 5, 5);
  }

  function drawGrid(fullDraw) {
    // only draw changed pixels
    grid.forEach((col, x) => {
      col.forEach((pxl, y) => {
        let oldPxl = gridBuffer[x][y];
        if (Math.floor(pxl) != Math.floor(oldPxl) || fullDraw) {
          drawPixel(x, y);
        }
      });
    });
    // after draw set new gridBuffer
    grid.forEach((el, i) => {
      gridBuffer[i] = el.slice(0);
    });
  }

  function reduceEntropy() {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        decreaseEnergy(x, y);
      }
    }
  }

  function decreaseEnergy(x, y) {
    let mod = Math.random() / 8;
    if (grid[x][y] - mod < 0) {
      grid[x][y] = 0;
    } else {
      if (grid[x][y] > colors.length) {grid[x][y] = colors.length;}
      grid[x][y] = grid[x][y] - mod;
    }
  }

  function increaseEnergy(x, y, mod) {
    if (x < grid.length && x >= 0 && y >= 0) {grid[x][y] = mod ? mod : colors.length;}
  }

  function spreadEnergy() {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        let burnFactor = 6;
        let initEnergy = grid[x][y];
        let spreadEnergy = sketch.random(0, initEnergy) / (8*burnFactor);
        let burned = sketch.random(0, initEnergy/1.5) / burnFactor;

        if (Math.floor(initEnergy) != 0) {
          // spread energy to lower level cells around
          if (y-1 >= 0 && grid[x][y-1] < initEnergy) {
            grid[x][y-1] = grid[x][y-1] + spreadEnergy;
          }
          if (y+1 < grid[x].length && grid[x][y+1] < initEnergy) {
            grid[x][y+1] = grid[x][y+1] + spreadEnergy;
          }
          if (x-1 >= 0 && grid[x-1][y] < initEnergy) {
            grid[x-1][y] = grid[x-1][y] + spreadEnergy;
          }
          if (x+1 < grid.length && grid[x+1][y] < initEnergy) {
            grid[x+1][y] = grid[x+1][y] + spreadEnergy;
          }
        }

        // subtract burned energy
        if (grid[x][y] - burned < 0) {
          grid[x][y] = 0;
        } else {
          grid[x][y] = grid[x][y] - burned;
        }
      }
    }
  }

  function addRandomEnergy() {
    increaseEnergy(
      Math.floor(sketch.random(0, grid.length-1)),
      Math.floor(sketch.random(0, grid[0].length-1)),
      sketch.random(colors.length, colors.length * 2000)
    );
  }

  function addRunner() {
    let dir = Math.floor(sketch.random(0,4));
    let x, y;

    // set starting point on edge depending on direction
    switch (dir) {
      case 0:
        x = Math.floor(sketch.random(0, grid.length - 1));
        y = grid[0].length - 1;
        break;
      case 1:
        x = 0;
        y = Math.floor(sketch.random(0, grid[0].length - 1));
        break;
      case 2:
        x = Math.floor(sketch.random(0, grid.length - 1));
        y = 0;
        break;
      case 3:
        x = grid.length - 1;
        y = Math.floor(sketch.random(0, grid[0].length - 1));
        break;
    }

    runners.push({x, y, dir})
  }

  function moveRunners() {
    runners.forEach((runner, index) => {
      increaseEnergy(
        runner.x,
        runner.y,
        colors.length
      )

      // move in direction
      switch (runner.dir) {
        case 0:
          runner.y--
          break;
        case 1:
          runner.x++
          break;
        case 2:
          runner.y++
          break;
        case 3:
          runner.x--
          break;
      }

      // remove if end is reached
      if (runner.x < 0 || runner.x >= grid.length || runner.y < 0 || runner.y >= grid[0].length) {
        runners.splice(index, 1);
      }
    })
  }

  // Load an SVG and give it an explicit size (the package SVGs only have a
  // viewBox, which some browsers refuse to draw onto a canvas).
  function loadMotif(name, url) {
    fetch(url)
      .then(res => res.ok ? res.text() : Promise.reject(res.status))
      .then(text => {
        let svg = new DOMParser().parseFromString(text, "image/svg+xml").documentElement;
        let vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
        if (vb.length !== 4 || !vb[2] || !vb[3]) { return; }
        svg.setAttribute("width", vb[2]);
        svg.setAttribute("height", vb[3]);
        let img = new Image();
        img.onload = () => motifs.push({ name: name, img: img, ratio: vb[3] / vb[2] });
        img.src = "data:image/svg+xml;charset=utf-8," +
          encodeURIComponent(new XMLSerializer().serializeToString(svg));
      })
      .catch(() => {});
  }

  function addStamp() {
    let gridW = grid.length;
    let gridH = grid[0].length;
    if (!motifs.length || gridW < 12 || gridH < 12) { return; }

    let motif = motifs[Math.floor(sketch.random(0, motifs.length))];

    // find a free spot outside logo, nav, content panels and footer;
    // shrink the motif a bit on later tries, give up if nothing fits
    let blocked = blockedAreas();
    let pos = null, w, h;
    let minW = MIN_WIDTH[motif.name] || 8;
    for (let tries = 0; tries < 30 && !pos; tries++) {
      let maxW = Math.max(minW + 4, Math.min(26, gridW / 3)) - tries / 3;
      if (maxW < minW) { break; }
      w = Math.floor(sketch.random(minW, maxW + 1));
      h = Math.max(1, Math.round(w * motif.ratio));
      if (w >= gridW || h >= gridH) { continue; }
      let x = Math.floor(sketch.random(0, gridW - w));
      let y = Math.floor(sketch.random(0, gridH - h));
      if (!overlapsAny(blocked, x, y, w, h)) { pos = { x: x, y: y }; }
    }
    if (!pos) { return; }

    let canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(motif.img, 0, 0, w, h);
    let px = ctx.getImageData(0, 0, w, h).data;

    // energy = brightness * alpha, so dark details (eyes, mouths) stay holes
    let energy = [];
    for (let i = 0; i < w * h; i++) {
      let r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], a = px[i * 4 + 3];
      energy.push((Math.max(r, g, b) / 255) * (a / 255) * colors.length);
    }

    stamps.push({
      x: pos.x,
      y: pos.y,
      w: w,
      h: h,
      energy: energy,
      // random per-pixel threshold -> order in which pixels appear / vanish
      order: energy.map(() => Math.random()),
      age: 0
    });
  }

  // areas motifs must keep clear of (viewport coords -> grid cells, plus margin)
  var BLOCK_SELECTOR = "#logo, .nav nav, main, .card, footer";
  var BLOCK_MARGIN = 2;
  function blockedAreas() {
    let areas = [];
    document.querySelectorAll(BLOCK_SELECTOR).forEach(el => {
      let r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) { return; }
      if (r.bottom < 0 || r.top > sketch.height) { return; }
      areas.push({
        x0: Math.floor(r.left / 10) - BLOCK_MARGIN,
        y0: Math.floor(r.top / 10) - BLOCK_MARGIN,
        x1: Math.ceil(r.right / 10) + BLOCK_MARGIN,
        y1: Math.ceil(r.bottom / 10) + BLOCK_MARGIN
      });
    });
    return areas;
  }
  function overlapsAny(areas, x, y, w, h) {
    return areas.some(a => x < a.x1 && x + w > a.x0 && y < a.y1 && y + h > a.y0);
  }

  function applyStamps() {
    for (let i = stamps.length - 1; i >= 0; i--) {
      let st = stamps[i];
      st.age++;
      let shown = Math.min(1, st.age / STAMP_IN);                           // pixel in
      let gone = Math.max(0, (st.age - STAMP_IN - STAMP_HOLD) / STAMP_OUT); // pixel out

      for (let x = 0; x < st.w; x++) {
        for (let y = 0; y < st.h; y++) {
          let gx = st.x + x, gy = st.y + y;
          let idx = y * st.w + x;
          let e = st.energy[idx];
          if (e <= 1 || gx >= grid.length || gy >= grid[gx].length) { continue; }

          let t = st.order[idx];
          if (t < gone) {
            // pixeled out: clear it once, then let the grid take over
            if (!st.cleared) { st.cleared = new Uint8Array(st.energy.length); }
            if (!st.cleared[idx]) { grid[gx][gy] = 0; st.cleared[idx] = 1; }
          } else if (t < shown && grid[gx][gy] < e) {
            grid[gx][gy] = e;
          }
        }
      }
      if (gone >= 1) { stamps.splice(i, 1); }
    }
  }

  // Render the wordmark at grid resolution: "c3" in primary, the rest in neutral.
  // energyLogo runs right before drawGrid, so these land exactly on the palette:
  var E_PRIMARY = 13.5; // colors[13] = #75B54B
  var E_NEUTRAL = 15.5; // colors[15] = #DFEED5
  var LOGO_PAD = 1;     // cells around the glyphs that are kept (almost) dark
  var GAP_MAX = 3;      // gaps/halo glow at most up to colors[2]; random cap per frame -> lively, never mushy
  var LETTER_GAP = 0;   // extra cells between letters (keep in sync with letter-spacing in CSS)

  // wordmark animation (frames at 30fps)
  var LOGO_IN = 30;           // pixel in on page load (random pixel order)
  var FLICKER_RATE = 0.004;   // chance per letter pixel and frame to get "overwritten"
  var FLICKER_LEN = [6, 24];  // frames an overwritten pixel flickers before it returns
  var logoAge = 0;
  function buildWordmark(cellsW, cellsH, fontPx) {
    let c = document.createElement("canvas");
    c.width = cellsW;
    c.height = cellsH;
    let ctx = c.getContext("2d");
    ctx.font = fontPx + 'px "Jersey 10"';
    ctx.textBaseline = "alphabetic";
    let baseline = Math.round(fontPx * 0.77); // matches line-height: 1 in CSS
    // letter by letter, with LETTER_GAP extra cells so the letters don't run together
    let x = 0;
    "c3Pixelflut".split("").forEach((ch, i) => {
      ctx.fillStyle = i < 2 ? "#ff0000" : "#00ff00";
      ctx.fillText(ch, Math.round(x), baseline);
      x += ctx.measureText(ch).width + LETTER_GAP * fontPx / 18.75;
    });

    let px = ctx.getImageData(0, 0, cellsW, cellsH).data;
    // every cell inside the glyph bounding box (+ padding) gets a fixed value:
    // letter cells their color, all others 0 -> crisp, readable gaps
    let on = [];
    let x0 = cellsW, y0 = cellsH, x1 = -1, y1 = -1;
    for (let y = 0; y < cellsH; y++) {
      for (let x = 0; x < cellsW; x++) {
        let i = (y * cellsW + x) * 4;
        if (px[i + 3] < 110) { continue; }
        on[y * cellsW + x] = px[i] > px[i + 1] ? E_PRIMARY : E_NEUTRAL;
        x0 = Math.min(x0, x); y0 = Math.min(y0, y);
        x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
    }
    let cells = [];
    for (let y = y0 - LOGO_PAD; y <= y1 + LOGO_PAD; y++) {
      for (let x = x0 - LOGO_PAD; x <= x1 + LOGO_PAD; x++) {
        let inside = x >= 0 && y >= 0 && x < cellsW && y < cellsH;
        cells.push({ x: x, y: y, e: (inside && on[y * cellsW + x]) || 0, t: Math.random() });
      }
    }
    return { key: cellsW + "x" + cellsH + "@" + fontPx, cells: cells };
  }

  function energyLogo() {
    if (!logo) { return; }
    // on small phones the wordmark is shown as real text instead
    if (parseFloat(window.getComputedStyle(logo).opacity) > 0.5) { return; }
    if (document.fonts && !document.fonts.check('20px "Jersey 10"')) {
      document.fonts.load('20px "Jersey 10"');
      return;
    }

    let rect = logo.getBoundingClientRect();
    let cellsW = Math.ceil(rect.width / 10);
    let cellsH = Math.ceil(rect.height / 10);
    let fontPx = parseFloat(window.getComputedStyle(logo).fontSize) / 10;
    if (!cellsW || !cellsH || !fontPx) { return; }

    let key = cellsW + "x" + cellsH + "@" + fontPx;
    if (!wordmark || wordmark.key !== key) {
      wordmark = buildWordmark(cellsW, cellsH, fontPx);
    }

    // pixel in once on load; afterwards single pixels get overwritten all the time
    logoAge++;
    let shown = Math.min(1, logoAge / LOGO_IN);

    let ox = Math.floor(rect.left / 10);
    let oy = Math.floor(rect.top / 10);
    wordmark.cells.forEach(c => {
      let gx = ox + c.x, gy = oy + c.y;
      if (gx < 0 || gx >= grid.length || gy < 0 || gy >= grid[gx].length) { return; }

      let letter = c.e > 0 && c.t < shown;
      if (letter && !c.hit && shown >= 1 && Math.random() < FLICKER_RATE) {
        c.hit = Math.floor(sketch.random(FLICKER_LEN[0], FLICKER_LEN[1]));
      }
      if (letter && c.hit > 0) {
        // overwritten: flicker through the colorful middle of the palette
        c.hit--;
        grid[gx][gy] = sketch.random(3, 12);
      } else if (letter) {
        grid[gx][gy] = c.e;          // exact wordmark color
      } else {
        // gaps, halo, not yet shown: may glow a little, capped randomly each frame
        grid[gx][gy] = Math.min(grid[gx][gy], Math.random() * GAP_MAX);
      }
    });
  }
};

export default {
  mounted() {
    let pixelGrid = new p5(s, "pixelGrid");
  }
};
</script>
