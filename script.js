document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const skyContainer = document.getElementById("sky-container");
  const kickElementsWrapper = document.getElementById("kick-elements-wrapper");
  const allStar = document.getElementById("allstar");
  const explosion = document.getElementById("explosion");
  const tooltip = document.getElementById("tooltip");
  const bgMusic = document.getElementById("bg-music");
  const playPauseBtn = document.getElementById("play-pause-btn");
  const mainContainer = document.querySelector(".container");

  const planets = [...document.querySelectorAll(".planet")];
  let currentPlanetIndex = planets.findIndex(p => p.classList.contains("sol"));
  if (currentPlanetIndex === -1) {
    currentPlanetIndex = 0;
  }

  const titleText = " Assim estava o céu quando os rumos de nossas vidas se encontraram 💜";
  let titleIndex = 0;

  let messageLoopTimeoutId;
  let isHovering = false;
  let pausedPlanetIndex = currentPlanetIndex;
  const TOOLTIP_TRANSITION_DURATION = 500;
  const AUTO_MESSAGE_DELAY = 8500;

  setInterval(() => {
    document.title = titleText.slice(titleIndex) + titleText.slice(0, titleIndex);
    titleIndex = (titleIndex + 1) % titleText.length;
  }, 200);

  const messages = {
    sol: "☀️ Sou aquele raio de luz meio torto que invade o aquário, faz cócegas e anima o peixinho, provocando sorrisos sem nem pedir licença ☀️",
    lua: "🌙 E eu observo tudo de longe, como quem não se apega, mas sente. Sou o aconchego nas noites de silêncio, o sussurro doce que chega de mansinho 🌙",
    venus: "💖 Sou o toque que acontece até no silêncio entre dois olhares. Amor, pra mim, é liberdade de coexistir lado a lado, sem cobrar nada em troca  💖",
    marte: "🔥 Sou o fogo que arde no peito, o chute na canela que empurra suavemente ao progresso e o abraço quente de quem não tem intenção de te soltar 🔥",
    mercurio: "🧠 Falo baixinho, nas entrelinhas, com um toque de mistério e poesia que só quem sabe ouvir entende 🧠",
    jupiter: "🌱 Sou a fé, a semente que escolhe seu tempo pra brotar. Crescer não é pressa, é raiz 🌱",
    saturno: "⏳ Sou o tempo que ensina que o que é verdadeiro não se apressa. A maturidade é um gesto calmo de quem já esperou muito ⏳",
    urano: "⚡ Sou o estalo que tira o véu dos olhos, com leveza para não assustar e firmeza para permanecer ⚡",
    netuno: "🌊 Trago a névoa dos sonhos e das saudades que a gente não sabe de onde vêm mas sempre atende 🌊",
    plutao: "🏹 Mostro o fim que prepara terreno pro recomeço. Dentro da desconstrução mora a semente da transformação  🏹"
  };

  let animationStarted = false;

  function updateMusicButtonState() {
    playPauseBtn.textContent = bgMusic.paused ? "▶️" : "⏸️";
  }

  giftBox.addEventListener("click", async () => {
    if (animationStarted) return;
    animationStarted = true;

    try {
      await bgMusic.play();
      updateMusicButtonState();
    } catch (e) {
      console.log("Autoplay bloqueado pelo navegador. Por favor, abra a caixa para reproduzir a música.");
    }

    giftBox.classList.add("kick-animation");
    
    kickElementsWrapper.style.opacity = "1";
    
    allStar.style.animation = "allstarAnimation 1.8s forwards";
    
    setTimeout(() => {
      explosion.style.animation = "explosionAnimation 0.5s forwards";
    }, 900);
    
    setTimeout(() => {
      giftBox.style.display = "none";
      
      kickElementsWrapper.style.animation = "none";
      kickElementsWrapper.style.opacity = "0";
      allStar.style.animation = "none";
      allStar.style.opacity = "0";
      explosion.style.animation = "none";
      explosion.style.opacity = "0";

      mainContainer.classList.add("hidden");

      skyContainer.style.visibility = "visible";
      skyContainer.style.opacity = "1";
      playPauseBtn.style.display = "inline-block";

      startMessageLoop();
      addPlanetHoverListeners();
    }, 2500);
  });

  playPauseBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
    updateMusicButtonState();
  });

  bgMusic.addEventListener('play', updateMusicButtonState);
  bgMusic.addEventListener('pause', updateMusicButtonState);
  bgMusic.addEventListener('ended', updateMusicButtonState);

  function showTooltip(planet, message) {
    tooltip.textContent = message;

    requestAnimationFrame(() => {
      const tooltipRect = tooltip.getBoundingClientRect();
      const rect = planet.getBoundingClientRect();

      let top = window.scrollY + rect.top - tooltipRect.height - 12;
      let left = window.scrollX + rect.left + rect.width / 2 - tooltipRect.width / 2;
      left = Math.min(Math.max(left, 8), window.innerWidth - tooltipRect.width - 8);
      if (top < window.scrollY + 8) top = window.scrollY + rect.bottom + 12;

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.opacity = "1";
      tooltip.classList.add("visible");
    });
  }

  function hideTooltip() {
    tooltip.style.opacity = "0";
    tooltip.classList.remove("visible");
  }

  function startMessageLoop() {
    clearTimeout(messageLoopTimeoutId);

    if (isHovering) {
      return;
    }

    hideTooltip();

    messageLoopTimeoutId = setTimeout(() => {
      if (isHovering) {
        clearTimeout(messageLoopTimeoutId);
        return;
      }

      const planetToDisplay = planets[currentPlanetIndex];
      const keyToDisplay = [...planetToDisplay.classList].find(c => messages[c]) || "";

      if (messages[keyToDisplay]) {
        showTooltip(planetToDisplay, messages[keyToDisplay]);
      }

      currentPlanetIndex = (currentPlanetIndex + 1) % planets.length;
      messageLoopTimeoutId = setTimeout(startMessageLoop, AUTO_MESSAGE_DELAY);
    }, TOOLTIP_TRANSITION_DURATION);
  }

  function addPlanetHoverListeners() {
    planets.forEach(planet => {
      planet.addEventListener("mouseenter", () => {
        isHovering = true;
        clearTimeout(messageLoopTimeoutId);

        pausedPlanetIndex = currentPlanetIndex;

        hideTooltip();

        setTimeout(() => {
          const key = [...planet.classList].find(c => messages[c]) || "";
          if (messages[key]) {
            showTooltip(planet, messages[key]);
          }
        }, TOOLTIP_TRANSITION_DURATION);
      });

      planet.addEventListener("mouseleave", () => {
        hideTooltip();
        isHovering = false;

        setTimeout(() => {
          currentPlanetIndex = pausedPlanetIndex;
          startMessageLoop();
        }, TOOLTIP_TRANSITION_DURATION);
      });
    });
  }

  document.addEventListener("mousemove", (e) => {
    const star = document.createElement("div");
    star.className = "star";
    star.style.position = "fixed";
    star.style.left = `${e.clientX}px`;
    star.style.top = `${e.clientY}px`;
    star.style.pointerEvents = "none";
    document.body.appendChild(star);

    setTimeout(() => {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, 1000);
  });

  updateMusicButtonState();
});
