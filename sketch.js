// ============================================================
// DRONE DO MELADO – O Segredo de Capanema
// Concurso Agrinho 2026 – SENAR-PR
// Versão FINAL COMPLETA
// ============================================================

// IMAGENS
let imgFundo, imgDrone, imgCana, imgBalde, imgAbelha;
let imgEngenho, imgMelado, imgParque, imgRio, imgTelaFinal;

// TELAS: 0=menu 1=intro 2=jogo 3=quiz 4=producao 5=segredo 6=final
let tela = 0;

// ZONA DO SOLO
const SOLO_TOPO  = 215;
const SOLO_FUNDO = 470;
const BALDE_X    = 630;

// DRONE
let drone = { x:300, y:320, w:70, h:50, velX:0, velY:0, speed:3.5, angle:0 };

// CANAS
let canas      = [];
let totalCanas = 18;

// PONTUAÇÃO E TEMPO
let pontos      = 0;
let coletadas   = 0;
let tempoInicio = 0;
let tempoTotal  = 0;
let melhorTempo = Infinity;

// ABELHAS
let abelhas = [];
const TOTAL_ABELHAS = 4;

// BALDE
let baldeX, baldeY;
const BALDE_W = 80, BALDE_H = 100;

// PARTÍCULAS e TRILHA
let particulas = [];
let trilha     = [];

// PRODUÇÃO
let progressoProd = 0;
let prodCompleta  = false;

// SEGREDO
let segredoFase  = 0;
let segredoTimer = 0;

// QUIZ
const PERGUNTAS = [
  {
    pergunta: "O que as abelhas fazem para ajudar a agricultura?",
    opcoes: [
      "A) Destroem as plantas",
      "B) Polinizam as flores e aumentam a producao",
      "C) Comem os frutos",
      "D) Nao tem relacao com a agricultura"
    ],
    correta: 1,
    explicacao: "As abelhas polinizam as flores, garantindo frutos e\nsementes - incluindo a cana-de-acucar de Capanema!"
  },
  {
    pergunta: "Por que o melado de Capanema e especial?",
    opcoes: [
      "A) E feito com acucar refinado",
      "B) E produzido em fabricas modernas",
      "C) Vem de cana proxima a riquezas naturais do Parana",
      "D) E importado de outro estado"
    ],
    correta: 2,
    explicacao: "A proximidade com o Rio Iguacu e o Parque Nacional\ngarante qualidade unica ao melado de Capanema!"
  },
  {
    pergunta: "O que e agricultura sustentavel?",
    opcoes: [
      "A) Produzir sem se preocupar com o meio ambiente",
      "B) Usar apenas maquinas antigas",
      "C) Produzir alimentos preservando os recursos naturais",
      "D) Desmatar florestas para plantar mais"
    ],
    correta: 2,
    explicacao: "Agricultura sustentavel equilibra producao e preservacao!\nAgro forte + futuro sustentavel = Capanema!"
  },
  {
    pergunta: "Para que serve o bagaco da cana-de-acucar?",
    opcoes: [
      "A) E jogado fora sem utilidade",
      "B) Pode gerar energia eletrica limpa (biomassa)",
      "C) E usado para construir casas",
      "D) E exportado como ouro"
    ],
    correta: 1,
    explicacao: "O bagaco da cana gera energia eletrica renovavel!\nNada e desperdicado na agroindustria sustentavel!"
  },
  {
    pergunta: "Qual rio ajuda a preservar o equilibrio ambiental de Capanema?",
    opcoes: [
      "A) Rio Amazonas",
      "B) Rio Sao Francisco",
      "C) Rio Iguacu",
      "D) Rio Paraiba"
    ],
    correta: 2,
    explicacao: "O Rio Iguacu e fundamental para preservar a agua,\na fauna e a flora da regiao de Capanema!"
  }
];

let quizAtivo        = false;
let quizPerguntaIdx  = 0;
let quizRespondida   = false;
let quizRespostaUser = -1;
let quizTimer        = 0;
let quizAcertos      = 0;
let quizProxima      = 6;
let quizPerguntas    = [];

// CURIOSIDADES DO MENU
const CURIOSIDADES_MENU = [
  { texto: "Capanema produz um dos melhores melados do Brasil!", autor: "Terra do Melado" },
  { texto: "Uma abelha visita ate 5.000 flores por dia!", autor: "Ciencias da Natureza" },
  { texto: "O Rio Iguacu abastece comunidades em todo o Parana.", autor: "Geografia do Parana" },
  { texto: "O bagaco da cana pode gerar energia eletrica limpa!", autor: "Sustentabilidade" },
  { texto: "Drones agricolas reduzem o uso de agrotoxicos em 40%.", autor: "Tecnologia no Campo" },
  { texto: "Preservar o solo garante colheitas para as proximas geracoes.", autor: "Programa Agrinho" },
  { texto: "O melado e rico em ferro, calcio e potassio!", autor: "Nutricao e Saude" },
  { texto: "A cana-de-acucar e uma das plantas mais eficientes do mundo.", autor: "Botanica" }
];
let curiosidadeMenu = null;

// "QUER SABER MAIS?"
let querSaberMais = null;

// CONQUISTAS
let conquistas     = [];
let filaConquistas = [];
let conquistaTimer = 0;
let conquistaAtual = null;

// ESTRELAS TELA FINAL
let estrelas = [];

// TIMERS
let timerAux   = 0;
let introTimer = 0;
let introAlpha = 0;

// BOTÃO MENU
let btnX, btnY;
const BTN_W = 220, BTN_H = 55;

// ÁUDIO
let audioCtx = null;

function iniciarAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function tocarNota(freq, duracao, tipo, volume) {
  if (!audioCtx) return;
  let o = audioCtx.createOscillator();
  let g = audioCtx.createGain();
  o.connect(g);
  g.connect(audioCtx.destination);
  o.type = tipo || 'sine';
  o.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(volume || 0.2, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duracao);
  o.start();
  o.stop(audioCtx.currentTime + duracao);
}

function tocarNotaFutura(freq, inicio, duracao, volume) {
  if (!audioCtx) return;
  let o = audioCtx.createOscillator();
  let g = audioCtx.createGain();
  o.connect(g);
  g.connect(audioCtx.destination);
  o.type = 'sine';
  o.frequency.setValueAtTime(freq, audioCtx.currentTime + inicio);
  g.gain.setValueAtTime(volume || 0.18, audioCtx.currentTime + inicio);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + inicio + duracao);
  o.start(audioCtx.currentTime + inicio);
  o.stop(audioCtx.currentTime + inicio + duracao);
}

function somColeta() {
  tocarNota(520, 0.12, 'sine', 0.22);
  tocarNotaFutura(880, 0.12, 0.15, 0.18);
}

function somAbelha() {
  tocarNota(440, 0.2, 'sine', 0.28);
  tocarNotaFutura(1200, 0.2, 0.25, 0.22);
}

function somAcerto() {
  tocarNota(660, 0.15, 'sine', 0.22);
  tocarNotaFutura(880, 0.15, 0.2, 0.2);
}

function somErro() {
  tocarNota(200, 0.3, 'sawtooth', 0.18);
}

function somConquista() {
  tocarNotaFutura(523,  0.0,  0.28, 0.18);
  tocarNotaFutura(659,  0.11, 0.28, 0.18);
  tocarNotaFutura(784,  0.22, 0.28, 0.18);
  tocarNotaFutura(1047, 0.33, 0.28, 0.18);
}

// ============================================================
// PRELOAD
// ============================================================
function preload() {
  imgFundo     = loadImage('fundo.png');
  imgDrone     = loadImage('drone.png');
  imgCana      = loadImage('cana.png');
  imgBalde     = loadImage('balde_melado.png');
  imgAbelha    = loadImage('abelha_bonus.png');
  imgEngenho   = loadImage('engenho.png');
  imgMelado    = loadImage('melado.png');
  imgParque    = loadImage('parque_iguacu.png');
  imgRio       = loadImage('rio_iguacu.png');
  imgTelaFinal = loadImage('tela_final.png');
}

// ============================================================
// SETUP
// ============================================================
function setup() {
  createCanvas(800, 500);
  textFont('Georgia');
  imageMode(CENTER);
  rectMode(CORNER);

  btnX   = width / 2 - BTN_W / 2;
  btnY   = 370;
  baldeX = width - 95;
  baldeY = SOLO_TOPO + (SOLO_FUNDO - SOLO_TOPO) / 2;

  for (let i = 0; i < 60; i++) {
    estrelas.push({ x: random(width), y: random(height), r: random(1, 3) });
  }

  let mt = localStorage.getItem('droneMelhorTempo');
  melhorTempo = (mt !== null) ? parseFloat(mt) : Infinity;

  sortearCuriosidade();
  iniciarJogo();
}

// ============================================================
// HELPERS
// ============================================================
function sortearCuriosidade() {
  curiosidadeMenu = CURIOSIDADES_MENU[floor(random(CURIOSIDADES_MENU.length))];
}

function embaralhar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j   = floor(random(i + 1));
    let tmp = arr[i];
    arr[i]  = arr[j];
    arr[j]  = tmp;
  }
  return arr;
}

function canaSobrepos(cx, cy) {
  for (let i = 0; i < canas.length; i++) {
    if (dist(cx, cy, canas[i].x, canas[i].y) < 62) return true;
  }
  return false;
}

// Retângulo arredondado compatível com todas as versões p5.js
function rRect(x, y, w, h, r) {
  r = min(r, w / 2, h / 2);
  beginShape();
  vertex(x + r, y);
  vertex(x + w - r, y);
  quadraticVertex(x + w, y,     x + w, y + r);
  vertex(x + w, y + h - r);
  quadraticVertex(x + w, y + h, x + w - r, y + h);
  vertex(x + r, y + h);
  quadraticVertex(x,     y + h, x,     y + h - r);
  vertex(x, y + r);
  quadraticVertex(x,     y,     x + r, y);
  endShape(CLOSE);
}

// ============================================================
// INICIAR JOGO
// ============================================================
function iniciarJogo() {
  pontos        = 0;
  coletadas     = 0;
  particulas    = [];
  trilha        = [];
  progressoProd = 0;
  prodCompleta  = false;
  segredoFase   = 0;
  segredoTimer  = 0;
  timerAux      = 0;
  tempoInicio   = millis();
  tempoTotal    = 0;
  introTimer    = 0;
  introAlpha    = 0;
  querSaberMais = null;

  quizAtivo        = false;
  quizRespondida   = false;
  quizRespostaUser = -1;
  quizTimer        = 0;
  quizAcertos      = 0;
  quizPerguntaIdx  = 0;
  quizPerguntas    = embaralhar(PERGUNTAS.slice()).slice(0, 3);
  quizProxima      = 6;

  drone.x     = 300;
  drone.y     = SOLO_TOPO + (SOLO_FUNDO - SOLO_TOPO) / 2;
  drone.velX  = 0;
  drone.velY  = 0;
  drone.angle = 0;

  canas = [];
  let tent = 0;
  while (canas.length < totalCanas && tent < 400) {
    tent++;
    let cx = random(50, BALDE_X - 30);
    let cy = random(SOLO_TOPO + 55, SOLO_FUNDO - 20);
    if (!canaSobrepos(cx, cy)) {
      canas.push({ x: cx, y: cy, w: 32, h: 68, ativa: true });
    }
  }

  abelhas = [];
  for (let i = 0; i < TOTAL_ABELHAS; i++) {
    abelhas.push(criarAbelha());
  }

  iniciarConquistas();
  filaConquistas = [];
  conquistaTimer = 0;
  conquistaAtual = null;

  sortearCuriosidade();
}

function criarAbelha() {
  return {
    x:    random(80, BALDE_X - 60),
    y:    random(SOLO_TOPO + 20, SOLO_FUNDO - 35),
    w:    48, h: 48,
    velX: random(1.4, 2.6) * (random() > 0.5 ? 1 : -1),
    velY: random(0.8, 1.8) * (random() > 0.5 ? 1 : -1),
    ativa: true
  };
}

// ============================================================
// CONQUISTAS
// ============================================================
function iniciarConquistas() {
  conquistas = [
    {
      titulo: 'Primeiro Corte!',
      desc: 'Coletou a primeira cana.',
      desbloqueada: false,
      condicao: function() { return coletadas >= 1; }
    },
    {
      titulo: 'Meio Caminho!',
      desc: 'Coletou metade da plantacao.',
      desbloqueada: false,
      condicao: function() { return coletadas >= Math.ceil(totalCanas / 2); }
    },
    {
      titulo: 'Amigo das Abelhas!',
      desc: 'Coletou todas as abelhas bonus.',
      desbloqueada: false,
      condicao: function() {
        if (abelhas.length === 0) return false;
        for (let i = 0; i < abelhas.length; i++) {
          if (abelhas[i].ativa) return false;
        }
        return true;
      }
    },
    {
      titulo: 'Mestre do Agro!',
      desc: 'Acertou todas as perguntas!',
      desbloqueada: false,
      condicao: function() {
        return quizPerguntas.length > 0 && quizAcertos >= quizPerguntas.length;
      }
    },
    {
      titulo: 'Colheita Completa!',
      desc: 'Toda a plantacao colhida!',
      desbloqueada: false,
      condicao: function() { return coletadas >= totalCanas; }
    }
  ];
}

function verificarConquistas() {
  for (let i = 0; i < conquistas.length; i++) {
    let c = conquistas[i];
    if (!c.desbloqueada && c.condicao()) {
      c.desbloqueada = true;
      filaConquistas.push(c);
      somConquista();
    }
  }
  if (conquistaAtual === null && filaConquistas.length > 0) {
    conquistaAtual = filaConquistas.shift();
    conquistaTimer = 210;
  }
}

function desenharConquistaToast() {
  if (conquistaAtual === null) return;
  conquistaTimer--;

  let alpha = 255;
  let offY  = 0;
  if (conquistaTimer > 175) offY  = map(conquistaTimer, 210, 175, -65, 0);
  if (conquistaTimer < 45)  alpha = map(conquistaTimer, 45, 0, 255, 0);

  let tx = width - 265;
  let ty = 58 + offY;

  fill(0, 0, 0, alpha * 0.5);
  rRect(tx + 3, ty + 3, 248, 65, 12);
  fill(160, 100, 0, alpha);
  rRect(tx, ty, 248, 65, 12);
  fill(255, 230, 0, alpha);
  rRect(tx + 2, ty + 2, 244, 20, 10);

  textAlign(LEFT, CENTER);
  fill(40, 15, 0, alpha);
  textSize(10);
  textStyle(BOLD);
  text("CONQUISTA DESBLOQUEADA!", tx + 10, ty + 12);
  fill(255, alpha);
  textSize(14);
  textStyle(BOLD);
  text(conquistaAtual.titulo, tx + 10, ty + 35);
  fill(210, 255, 210, alpha);
  textSize(11);
  textStyle(NORMAL);
  text(conquistaAtual.desc, tx + 10, ty + 53);
  textAlign(CENTER, CENTER);

  if (conquistaTimer <= 0) conquistaAtual = null;
}

// ============================================================
// DRAW
// ============================================================
function draw() {
  background(30, 80, 30);
  if      (tela === 0) desenharMenu();
  else if (tela === 1) desenharIntro();
  else if (tela === 2) desenharJogo();
  else if (tela === 3) desenharQuiz();
  else if (tela === 4) desenharProducao();
  else if (tela === 5) desenharSegredo();
  else if (tela === 6) desenharFinal();
}

// ============================================================
// TELA 0 – MENU
// ============================================================
function desenharMenu() {
  for (let i = 0; i < height; i++) {
    stroke(lerpColor(color(10, 60, 20), color(5, 30, 10), i / height));
    line(0, i, width, i);
  }
  noStroke();

  fill(0, 0, 0, 138);
  rRect(width / 2 - 290, 48, 580, 360, 22);

  fill(255, 220, 0);
  textSize(42);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("DRONE DO MELADO", width / 2, 112);

  fill(180, 255, 150);
  textSize(18);
  textStyle(NORMAL);
  text("CAPANEMA - PARANA", width / 2, 155);

  stroke(255, 220, 0, 180);
  strokeWeight(2);
  line(width / 2 - 210, 174, width / 2 + 210, 174);
  noStroke();

  if (curiosidadeMenu !== null) {
    fill(0, 0, 0, 120);
    rRect(width / 2 - 252, 186, 504, 54, 10);
    fill(255, 220, 80);
    textSize(13);
    textStyle(ITALIC);
    textAlign(CENTER, CENTER);
    text(curiosidadeMenu.texto, width / 2, 204);
    fill(180, 220, 180);
    textSize(11);
    textStyle(NORMAL);
    text("Fonte: " + curiosidadeMenu.autor, width / 2, 226);
  }

  fill(200, 230, 200);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("Controles: Setas ou WASD  |  Responda perguntas e ganhe pontos!", width / 2, 258);
  text("Colete as " + totalCanas + " canas e as " + TOTAL_ABELHAS + " abelhas bonus!", width / 2, 276);
  text("Pressione R para reiniciar a qualquer momento", width / 2, 294);

  if (melhorTempo !== Infinity) {
    fill(255, 220, 80);
    textSize(13);
    text("Melhor tempo: " + nf(melhorTempo, 1, 1) + "s", width / 2, 316);
  }

  let hover = mouseX > btnX && mouseX < btnX + BTN_W &&
              mouseY > btnY && mouseY < btnY + BTN_H;
  fill(0, 0, 0, 85);
  rRect(btnX + 4, btnY + 4, BTN_W, BTN_H, 14);
  fill(hover ? color(255, 190, 0) : color(200, 130, 0));
  rRect(btnX, btnY, BTN_W, BTN_H, 14);
  fill(255);
  textSize(21);
  textStyle(BOLD);
  text("COMECAR", width / 2, btnY + BTN_H / 2 + 1);

  fill(120, 180, 120);
  textSize(11);
  textStyle(NORMAL);
  text("Concurso Agrinho 2026 - SENAR-PR  |  Agro forte, futuro sustentavel",
       width / 2, height - 15);

  push();
  translate(88, 85);
  rotate(sin(frameCount * 0.04) * 0.08);
  image(imgDrone, 0, 0, 90, 65);
  pop();

  image(imgCana, width - 76,  height - 76, 36, 72);
  image(imgCana, width - 114, height - 66, 30, 62);
}

// ============================================================
// TELA 1 – INTRO
// ============================================================
function desenharIntro() {
  introTimer++;

  for (let i = 0; i < height; i++) {
    stroke(lerpColor(color(10, 70, 15), color(30, 100, 20), i / height));
    line(0, i, width, i);
  }
  noStroke();

  introAlpha = min(introAlpha + 4, 255);

  for (let i = 0; i < 8; i++) {
    let cx = map(i, 0, 7, 60, width - 60);
    fill(50, 150, 30, introAlpha * 0.5);
    rect(cx - 4, height - 140, 8, 120, 4);
    fill(60, 180, 40, introAlpha * 0.5);
    ellipse(cx, height - 138, 22, 36);
  }

  let bob = sin(frameCount * 0.07) * 5;
  push();
  translate(width / 2, 108 + bob);
  stroke(200, 200, 200, introAlpha * 0.8);
  strokeWeight(2.5);
  let hp = [[-24,-18],[24,-18],[-24,18],[24,18]];
  for (let i = 0; i < hp.length; i++) {
    push();
    translate(hp[i][0], hp[i][1]);
    rotate(frameCount * 0.3 + i * HALF_PI);
    line(-12, 0, 12, 0);
    pop();
  }
  noStroke();
  image(imgDrone, 0, 0, 90, 65);
  pop();

  fill(0, 0, 0, introAlpha * 0.7);
  rRect(width / 2 - 315, 162, 630, 210, 20);

  textAlign(CENTER, CENTER);

  if (introTimer > 18) {
    fill(255, 220, 0, introAlpha);
    textSize(26);
    textStyle(BOLD);
    text("Participe da nossa Agroindustria!", width / 2, 198);
  }
  if (introTimer > 48) {
    fill(200, 255, 200, introAlpha);
    textSize(16);
    textStyle(NORMAL);
    text("Vamos colher a cana e produzir o famoso", width / 2, 236);
  }
  if (introTimer > 72) {
    fill(255, 180, 0, introAlpha);
    textSize(22);
    textStyle(BOLD);
    text("MELADO DE CAPANEMA!", width / 2, 264);
  }
  if (introTimer > 100) {
    fill(220, 240, 220, introAlpha);
    textSize(14);
    textStyle(ITALIC);
    text("Controle o drone, colete as canas e responda perguntas", width / 2, 298);
    text("sobre agricultura e sustentabilidade para ganhar pontos!", width / 2, 316);
  }

  if (introTimer > 138) {
    let bx  = width / 2 - 105;
    let by  = 358;
    let bw  = 210;
    let bh  = 46;
    let hov = mouseX > bx && mouseX < bx + bw &&
              mouseY > by && mouseY < by + bh;
    fill(0, 0, 0, 82);
    rRect(bx + 3, by + 3, bw, bh, 12);
    fill(hov ? color(255, 190, 0) : color(180, 110, 0));
    rRect(bx, by, bw, bh, 12);
    fill(255);
    textSize(18);
    textStyle(BOLD);
    text("JOGAR AGORA!", width / 2, by + bh / 2 + 1);
  }

  if (introTimer > 420) {
    tempoInicio = millis();
    tela = 2;
  }
}

// ============================================================
// TELA 2 – JOGO
// ============================================================
function desenharJogo() {
  image(imgFundo, width / 2, height / 2, width, height);

  for (let i = 0; i < canas.length; i++) {
    if (canas[i].ativa) {
      image(imgCana, canas[i].x, canas[i].y, canas[i].w, canas[i].h);
    }
  }

  for (let i = 0; i < abelhas.length; i++) {
    atualizarUmaAbelha(abelhas[i]);
    if (abelhas[i].ativa) {
      let osci = sin(frameCount * 0.09 + i * 1.2) * 4;
      image(imgAbelha, abelhas[i].x, abelhas[i].y + osci, abelhas[i].w, abelhas[i].h);
    }
  }

  atualizarTrilha();
  atualizarDrone();
  desenharDrone();
  atualizarParticulas();
  desenharHUD();
  desenharBalde();
  verificarConquistas();
  desenharConquistaToast();

  tempoTotal = (millis() - tempoInicio) / 1000;

  // Verifica se abre quiz
  if (!quizAtivo &&
      quizPerguntaIdx < quizPerguntas.length &&
      coletadas >= quizProxima &&
      coletadas < totalCanas) {
    quizAtivo        = true;
    quizRespondida   = false;
    quizRespostaUser = -1;
    quizTimer        = 0;
    tela = 3;
    return;
  }

  if (coletadas >= totalCanas) {
    if (tempoTotal < melhorTempo) {
      melhorTempo = tempoTotal;
      localStorage.setItem('droneMelhorTempo', str(melhorTempo));
    }
    tela = 4;
  }
}

// ============================================================
// ATUALIZA DRONE
// ============================================================
function atualizarDrone() {
  drone.velX = 0;
  drone.velY = 0;

  if (keyIsDown(LEFT_ARROW)  || keyIsDown(65)) drone.velX = -drone.speed;
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) drone.velX =  drone.speed;
  if (keyIsDown(UP_ARROW)    || keyIsDown(87)) drone.velY = -drone.speed;
  if (keyIsDown(DOWN_ARROW)  || keyIsDown(83)) drone.velY =  drone.speed;

  if (drone.velX !== 0 && drone.velY !== 0) {
    drone.velX *= 0.707;
    drone.velY *= 0.707;
  }

  drone.x = constrain(drone.x + drone.velX, drone.w / 2, BALDE_X - drone.w / 2);
  drone.y = constrain(drone.y + drone.velY, drone.h / 2 + 40, height - drone.h / 2 - 10);
  drone.angle += 0.3;

  for (let i = 0; i < canas.length; i++) {
    let c = canas[i];
    if (c.ativa && dist(drone.x, drone.y, c.x, c.y) < 40) {
      c.ativa = false;
      coletadas++;
      pontos += 10;
      gerarParticulas(c.x, c.y, color(100, 200, 60));
      somColeta();
    }
  }

  for (let i = 0; i < abelhas.length; i++) {
    let a = abelhas[i];
    if (a.ativa && dist(drone.x, drone.y, a.x, a.y) < 46) {
      a.ativa = false;
      pontos += 50;
      gerarParticulas(a.x, a.y, color(255, 220, 0));
      somAbelha();
    }
  }
}

// ============================================================
// DESENHA DRONE
// ============================================================
function desenharDrone() {
  push();
  translate(drone.x, drone.y);
  let bob = sin(frameCount * 0.07) * 2.5;
  translate(0, bob);

  if (drone.y > SOLO_TOPO - 20) {
    let sa = map(drone.y, SOLO_TOPO, SOLO_FUNDO, 18, 78);
    fill(0, 0, 0, sa);
    noStroke();
    ellipse(0, drone.h / 2 + 10, 55, 12);
  }

  stroke(200, 200, 200, 200);
  strokeWeight(2.5);
  let hp = [[-22,-16],[22,-16],[-22,16],[22,16]];
  for (let i = 0; i < hp.length; i++) {
    push();
    translate(hp[i][0], hp[i][1]);
    rotate(drone.angle + i * HALF_PI);
    line(-12, 0, 12, 0);
    pop();
  }

  noStroke();
  image(imgDrone, 0, 0, drone.w, drone.h);
  pop();
}

// ============================================================
// ATUALIZA UMA ABELHA
// ============================================================
function atualizarUmaAbelha(a) {
  if (!a.ativa) return;
  a.x += a.velX;
  a.y += a.velY;

  if (a.x < 50 || a.x > BALDE_X - 58) {
    a.velX *= -1;
    a.x = constrain(a.x, 50, BALDE_X - 58);
  }
  if (a.y < SOLO_TOPO + 14) {
    a.velY = abs(a.velY);
    a.y    = SOLO_TOPO + 14;
  }
  if (a.y > SOLO_FUNDO - 26) {
    a.velY = -abs(a.velY);
    a.y    = SOLO_FUNDO - 26;
  }
}

// ============================================================
// TRILHA
// ============================================================
function atualizarTrilha() {
  if (drone.velX !== 0 || drone.velY !== 0) {
    trilha.push({ x: drone.x, y: drone.y, alpha: 170 });
  }
  if (trilha.length > 24) trilha.shift();

  noStroke();
  for (let i = 0; i < trilha.length; i++) {
    let t  = trilha[i];
    let sz = map(i, 0, trilha.length, 2, 7);
    t.alpha -= 7;
    fill(150, 220, 255, max(t.alpha, 0));
    ellipse(t.x, t.y, sz, sz);
  }
}

// ============================================================
// HUD
// ============================================================
function desenharHUD() {
  fill(0, 0, 0, 168);
  rRect(10, 8, 510, 38, 10);

  textAlign(LEFT, CENTER);
  textStyle(BOLD);

  fill(255, 230, 100);
  textSize(13);
  text("Pts: " + pontos, 18, 27);

  fill(180, 255, 150);
  text("Canas: " + coletadas + "/" + totalCanas, 118, 27);

  fill(200, 200, 255);
  text("Melado: " + floor((coletadas / totalCanas) * 100) + "%", 262, 27);

  let abCol = 0;
  for (let i = 0; i < abelhas.length; i++) {
    if (!abelhas[i].ativa) abCol++;
  }
  fill(255, 220, 80);
  text("Abelhas: " + abCol + "/" + TOTAL_ABELHAS, 382, 27);

  fill(0, 0, 0, 168);
  rRect(10, 52, 300, 26, 8);
  fill(255, 200, 100);
  textSize(12);
  text("Tempo: " + nf(tempoTotal, 1, 1) + "s", 18, 65);

  if (melhorTempo !== Infinity) {
    fill(180, 255, 180);
    text("Rec: " + nf(melhorTempo, 1, 1) + "s", 155, 65);
  }

  fill(0, 0, 0, 168);
  rRect(10, 84, 240, 26, 8);
  fill(220, 200, 255);
  textSize(12);
  text("Quiz: " + quizAcertos + "/" + quizPerguntas.length + " acertos", 18, 97);

  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  fill(180, 255, 180, 165);
  textSize(11);
  text("Setas ou WASD para mover  |  R = reiniciar", width / 2 - 55, height - 12);
}

// ============================================================
// BALDE
// ============================================================
function desenharBalde() {
  let pct        = coletadas / totalCanas;
  let altInterna = 82;
  let enchimento = pct * altInterna;

  fill(0, 0, 0, 158);
  rRect(width - 155, SOLO_TOPO + 8, 151, 225, 12);

  fill(255, 220, 0);
  textSize(10);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("BALDE DO MELADO", width - 80, SOLO_TOPO + 26);

  image(imgBalde, baldeX, baldeY + 30, BALDE_W, BALDE_H);

  let topMel = (baldeY + 30) + 40 - enchimento;
  noStroke();
  fill(120, 60, 0, 215);
  rect(baldeX - 27, topMel, 54, enchimento);
  fill(180, 100, 30, 65);
  rect(baldeX - 27, topMel, 10, enchimento);

  fill(255, 200, 100);
  textSize(15);
  textStyle(BOLD);
  text(floor(pct * 100) + "%", baldeX, baldeY + 100);

  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
}

// ============================================================
// PARTÍCULAS
// ============================================================
function gerarParticulas(px, py, cor) {
  for (let i = 0; i < 18; i++) {
    particulas.push({
      x: px, y: py,
      velX: random(-3.5, 3.5),
      velY: random(-4.5, 0.5),
      alpha: 255,
      cor: cor,
      r: random(4, 11)
    });
  }
}

function atualizarParticulas() {
  for (let i = particulas.length - 1; i >= 0; i--) {
    let p   = particulas[i];
    p.x    += p.velX;
    p.y    += p.velY;
    p.velY += 0.2;
    p.alpha -= 9;
    noStroke();
    fill(red(p.cor), green(p.cor), blue(p.cor), p.alpha);
    ellipse(p.x, p.y, p.r, p.r);
    if (p.alpha <= 0) particulas.splice(i, 1);
  }
}

// ============================================================
// TELA 3 – QUIZ
// ============================================================
function desenharQuiz() {
  image(imgFundo, width / 2, height / 2, width, height);
  fill(0, 20, 0, 205);
  rect(0, 0, width, height);

  let p = quizPerguntas[quizPerguntaIdx];

  fill(20, 60, 20, 245);
  rRect(width / 2 - 342, 38, 684, 430, 20);

  fill(255, 220, 0);
  rRect(width / 2 - 340, 40, 680, 44, 18);

  fill(30, 15, 0);
  textSize(13);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("PERGUNTA " + (quizPerguntaIdx + 1) + " de " + quizPerguntas.length +
       "   |   Quiz do Campo   |   +30 pontos por acerto",
       width / 2, 62);

  fill(255, 240, 180);
  textSize(16);
  textStyle(BOLD);
  text(p.pergunta, width / 2, 115);

  let opcW  = 282;
  let opcH  = 54;
  let gap   = 12;
  let startX = width / 2 - 298;
  let startY = 152;

  for (let i = 0; i < p.opcoes.length; i++) {
    let col = i % 2;
    let row = floor(i / 2);
    let ox  = startX + col * (opcW + 32);
    let oy  = startY + row * (opcH + gap);

    let hov = !quizRespondida &&
              mouseX > ox && mouseX < ox + opcW &&
              mouseY > oy && mouseY < oy + opcH;

    let corBtn;
    if (!quizRespondida) {
      if (hov) corBtn = color(255, 190, 0);
      else     corBtn = color(40, 100, 40);
    } else {
      if (i === p.correta)            corBtn = color(0, 180, 60);
      else if (i === quizRespostaUser) corBtn = color(200, 40, 40);
      else                            corBtn = color(40, 60, 40, 160);
    }

    fill(0, 0, 0, 80);
    rRect(ox + 3, oy + 3, opcW, opcH, 12);
    fill(corBtn);
    rRect(ox, oy, opcW, opcH, 12);

    let icone = "";
    if (quizRespondida) {
      if (i === p.correta)             icone = " OK";
      else if (i === quizRespostaUser) icone = " X";
    }

    fill(255);
    textSize(12);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(p.opcoes[i] + icone, ox + opcW / 2, oy + opcH / 2);
  }

  if (quizRespondida) {
    let acertou = (quizRespostaUser === p.correta);
    quizTimer++;

    if (acertou) fill(0, 120, 40, 235);
    else         fill(150, 20, 20, 235);
    rRect(width / 2 - 312, 292, 624, 58, 14);

    fill(255);
    textSize(15);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);

    if (acertou) text("CORRETO! +30 pontos!", width / 2, 310);
    else         text("Nao foi dessa vez...", width / 2, 310);

    textSize(12);
    textStyle(ITALIC);
    text(p.explicacao, width / 2, 332);

    let progW = map(quizTimer, 0, 200, 0, 584);
    fill(0, 0, 0, 120);
    rRect(width / 2 - 292, 358, 584, 14, 7);
    if (acertou) fill(0, 200, 80);
    else         fill(220, 100, 0);
    rRect(width / 2 - 292, 358, progW, 14, 7);

    fill(200, 230, 200);
    textSize(12);
    textStyle(NORMAL);
    text("Continuando o jogo em instantes...", width / 2, 384);

    fill(0, 0, 0, 140);
    rRect(width / 2 - 292, 398, 584, 34, 10);
    fill(200, 255, 200);
    textSize(12);
    textStyle(BOLD);
    text("Canas: " + coletadas + "/" + totalCanas +
         "  |  Pontos: " + pontos +
         "  |  Acertos: " + quizAcertos + "/" + quizPerguntas.length,
         width / 2, 415);

    if (quizTimer >= 200) {
      quizAtivo     = false;
      quizPerguntaIdx++;
      if (quizPerguntaIdx === 1) quizProxima = 13;
      else                       quizProxima = 9999;
      tela = 2;
    }

  } else {
    fill(180, 230, 180);
    textSize(12);
    textStyle(ITALIC);
    textAlign(CENTER, CENTER);
    text("Clique na resposta correta para ganhar pontos extras!", width / 2, 310);
  }
}

// ============================================================
// TELA 4 – PRODUÇÃO + "QUER SABER MAIS?"
// ============================================================
function desenharProducao() {
  for (let i = 0; i < height; i++) {
    stroke(lerpColor(color(20, 50, 10), color(60, 30, 0), i / height));
    line(0, i, width, i);
  }
  noStroke();

  image(imgEngenho, width / 2 - 140, height / 2 - 20, 200, 160);
  image(imgMelado,  width / 2 + 130, height / 2 - 20, 140, 140);

  fill(255, 220, 0);
  textSize(24);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("PRODUZINDO O MELADO DE CAPANEMA...", width / 2, 55);

  fill(220, 180, 100);
  textSize(14);
  textStyle(ITALIC);
  text("A cana coletada agora vira o famoso melado da Terra do Melado!", width / 2, 86);

  progressoProd = min(progressoProd + 0.5, 100);

  let barX = width / 2 - 220;
  let barY = height - 148;
  let barW = 440;
  let barH = 34;

  fill(40, 20, 0);
  rRect(barX, barY, barW, barH, barH / 2);

  let pct = progressoProd / 100;
  fill(lerpColor(color(180, 80, 0), color(255, 160, 0), pct));
  rRect(barX, barY, barW * pct, barH, barH / 2);

  fill(255, 255, 255, 52);
  rRect(barX, barY, barW * pct, barH / 2, barH / 2);

  fill(255);
  textSize(15);
  textStyle(BOLD);
  text(floor(progressoProd) + "%", width / 2, barY + barH / 2 + 1);

  fill(200, 240, 200);
  textSize(12);
  textStyle(NORMAL);
  text("Canas: " + coletadas + "  |  Pontos: " + pontos +
       "  |  Tempo: " + nf(tempoTotal, 1, 1) + "s" +
       "  |  Quiz: " + quizAcertos + "/" + quizPerguntas.length + " acertos",
       width / 2, height / 2 + 90);

  let bobD = sin(frameCount * 0.08) * 6;
  image(imgDrone, width / 2, height / 2 - 108 + bobD, 70, 50);

  if (progressoProd >= 100) {
    if (querSaberMais === null) {
      fill(0, 0, 0, 205);
      rRect(width / 2 - 305, height - 142, 610, 124, 18);

      fill(255, 230, 0);
      textSize(17);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text("Quer descobrir o segredo do melado de Capanema?", width / 2, height - 112);

      fill(200, 240, 200);
      textSize(13);
      textStyle(NORMAL);
      text("Saiba por que nossa agricultura e tao especial!", width / 2, height - 90);

      // Botão SIM
      let simX = width / 2 - 136;
      let simY = height - 74;
      let simW = 118;
      let simH = 42;
      let hSim = mouseX > simX && mouseX < simX + simW &&
                 mouseY > simY && mouseY < simY + simH;
      fill(0, 0, 0, 80);
      rRect(simX + 3, simY + 3, simW, simH, 12);
      fill(hSim ? color(0, 210, 80) : color(0, 155, 55));
      rRect(simX, simY, simW, simH, 12);
      fill(255);
      textSize(16);
      textStyle(BOLD);
      text("SIM!", simX + simW / 2, simY + simH / 2 + 1);

      // Botão NÃO
      let naoX = width / 2 + 18;
      let naoY = height - 74;
      let naoW = 118;
      let naoH = 42;
      let hNao = mouseX > naoX && mouseX < naoX + naoW &&
                 mouseY > naoY && mouseY < naoY + naoH;
      fill(0, 0, 0, 80);
      rRect(naoX + 3, naoY + 3, naoW, naoH, 12);
      fill(hNao ? color(210, 50, 50) : color(155, 30, 30));
      rRect(naoX, naoY, naoW, naoH, 12);
      fill(255);
      textSize(16);
      textStyle(BOLD);
      text("NAO", naoX + naoW / 2, naoY + naoH / 2 + 1);

    } else {
      if (!prodCompleta) {
        prodCompleta = true;
        timerAux     = 80;
      }
      timerAux--;
      fill(255, 200, 0, map(timerAux, 80, 0, 0, 200));
      rect(0, 0, width, height);
      if (timerAux <= 0) {
        if (querSaberMais === true) {
          tela         = 5;
          segredoFase  = 0;
          segredoTimer = 0;
        } else {
          tela = 6;
        }
      }
    }
  }
}

// ============================================================
// TELA 5 – SEGREDO DE CAPANEMA
// ============================================================
function desenharSegredo() {
  segredoTimer++;

  if (segredoFase === 0) {
    image(imgParque, width / 2, height / 2, width, height);
    fill(0, 0, 0, 118);
    rect(0, 0, width, height);

    fill(0, 0, 0, 165);
    rRect(width / 2 - 288, height - 152, 576, 78, 14);

    fill(255, 240, 180);
    textSize(18);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text("Voce sabe por que o melado de Capanema e tao especial?", width / 2, height - 124);

    fill(200, 240, 200);
    textSize(13);
    textStyle(ITALIC);
    text("Descubra o segredo desta terra incrivel do Parana...", width / 2, height - 100);

    let bob = sin(frameCount * 0.07) * 4;
    image(imgDrone, 76, 76 + bob, 80, 58);

    if (segredoTimer > 250) {
      segredoFase  = 1;
      segredoTimer = 0;
    }

  } else {
    image(imgRio, width / 2, height / 2, width, height);
    fill(0, 20, 40, 142);
    rect(0, 0, width, height);

    fill(0, 0, 0, 172);
    rRect(width / 2 - 328, height / 2 - 105, 656, 228, 18);

    textAlign(CENTER, CENTER);

    if (segredoTimer > 20) {
      fill(200, 240, 255);
      textSize(15);
      textStyle(BOLD);
      text("Porque nossa agricultura cresce ao lado de uma das maiores\nriquezas naturais do Brasil.",
           width / 2, height / 2 - 65);
    }
    if (segredoTimer > 85) {
      fill(180, 255, 200);
      textSize(13);
      textStyle(NORMAL);
      text("O Rio Iguacu e o Parque Nacional do Iguacu ajudam a preservar\na agua, a biodiversidade e o equilibrio ambiental.",
           width / 2, height / 2 + 5);
    }
    if (segredoTimer > 155) {
      fill(255, 230, 100);
      textSize(15);
      textStyle(BOLD);
      text("Produzir e preservar caminham juntos.", width / 2, height / 2 + 65);
    }

    if (segredoTimer > 220) {
      let hov = mouseX > width / 2 - 98 && mouseX < width / 2 + 98 &&
                mouseY > height - 62    && mouseY < height - 20;
      fill(0, 0, 0, 82);
      rRect(width / 2 - 96, height - 60, 194, 44, 12);
      fill(hov ? color(255, 190, 0) : color(180, 110, 0));
      rRect(width / 2 - 98, height - 62, 194, 44, 12);
      fill(255);
      textSize(15);
      textStyle(BOLD);
      text("Continuar", width / 2, height - 39);
    }

    if (segredoTimer > 400) tela = 6;
  }
}

// ============================================================
// TELA 6 – FINAL
// ============================================================
function desenharFinal() {
  image(imgTelaFinal, width / 2, height / 2, width, height);
  fill(0, 0, 0, 155);
  rect(0, 0, width, height);

  noStroke();
  for (let i = 0; i < estrelas.length; i++) {
    let e = estrelas[i];
    let a = map(sin(frameCount * 0.05 + e.x), -1, 1, 50, 255);
    fill(255, 240, 180, a);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
  }

  fill(160, 100, 0, 208);
  rRect(width / 2 - 308, height / 2 - 148, 616, 316, 22);
  fill(0, 0, 0, 100);
  rRect(width / 2 - 304, height / 2 - 144, 608, 308, 20);

  fill(255, 230, 0);
  textSize(32);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text("AGRO FORTE,", width / 2, height / 2 - 106);
  text("FUTURO SUSTENTAVEL", width / 2, height / 2 - 68);

  stroke(255, 200, 0, 200);
  strokeWeight(2);
  line(width / 2 - 228, height / 2 - 44, width / 2 + 228, height / 2 - 44);
  noStroke();

  fill(180, 255, 180);
  textSize(19);
  textStyle(NORMAL);
  text("CAPANEMA - PARANA", width / 2, height / 2 - 14);

  fill(255, 200, 80);
  textSize(21);
  textStyle(BOLD);
  text("TERRA DO MELADO", width / 2, height / 2 + 22);

  fill(220, 240, 255);
  textSize(14);
  textStyle(ITALIC);
  text("Obrigado por jogar.", width / 2, height / 2 + 56);

  fill(200, 230, 200);
  textSize(12);
  textStyle(NORMAL);
  text("TECNOLOGIA + AGRICULTURA + PRESERVACAO", width / 2, height / 2 + 78);

  // Estatísticas
  fill(0, 0, 0, 145);
  rRect(width / 2 - 275, height / 2 + 96, 550, 72, 10);

  let abFinal = 0;
  for (let i = 0; i < abelhas.length; i++) {
    if (!abelhas[i].ativa) abFinal++;
  }

  let conquFinal = 0;
  for (let i = 0; i < conquistas.length; i++) {
    if (conquistas[i].desbloqueada) conquFinal++;
  }

  fill(255, 240, 150);
  textSize(13);
  textStyle(BOLD);
  text("Pontos: " + pontos +
       "   |   Tempo: " + nf(tempoTotal, 1, 1) + "s" +
       "   |   Abelhas: " + abFinal + "/" + TOTAL_ABELHAS,
       width / 2, height / 2 + 116);

  // Linha 2 de stats – sem operador ternário dentro do text()
  let recStr = "";
  if (melhorTempo !== Infinity) {
    recStr = "   |   Recorde: " + nf(melhorTempo, 1, 1) + "s";
  }
  fill(200, 255, 200);
  textSize(13);
  text("Quiz: " + quizAcertos + "/" + quizPerguntas.length +
       "   |   Conquistas: " + conquFinal + "/" + conquistas.length +
       recStr,
       width / 2, height / 2 + 138);

  // Botão jogar novamente
  let hover = mouseX > width / 2 - 118 && mouseX < width / 2 + 118 &&
              mouseY > height - 68      && mouseY < height - 26;
  fill(0, 0, 0, 82);
  rRect(width / 2 - 116, height - 66, 234, 44, 14);
  fill(hover ? color(255, 168, 0) : color(180, 100, 0));
  rRect(width / 2 - 118, height - 68, 234, 44, 14);
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("Jogar Novamente", width / 2, height - 45);

  fill(140, 190, 140);
  textSize(11);
  textStyle(NORMAL);
  text("Concurso Agrinho 2026 - SENAR-PR", width / 2, height - 14);
}

// ============================================================
// MOUSE PRESSED
// ============================================================
function mousePressed() {
  iniciarAudio();

  // TELA 0 – Menu → Intro
  if (tela === 0) {
    if (mouseX > btnX && mouseX < btnX + BTN_W &&
        mouseY > btnY && mouseY < btnY + BTN_H) {
      iniciarJogo();
      tela = 1;
    }
  }

  // TELA 1 – Intro → Jogo (botão JOGAR AGORA)
  if (tela === 1 && introTimer > 138) {
    let bx = width / 2 - 105;
    let by = 358;
    let bw = 210;
    let bh = 46;
    if (mouseX > bx && mouseX < bx + bw &&
        mouseY > by && mouseY < by + bh) {
      tempoInicio = millis();
      tela = 2;
    }
  }

  // TELA 3 – Quiz → clique nas opções
  if (tela === 3 && !quizRespondida) {
    let p      = quizPerguntas[quizPerguntaIdx];
    let opcW   = 282;
    let opcH   = 54;
    let gap    = 12;
    let startX = width / 2 - 298;
    let startY = 152;

    for (let i = 0; i < p.opcoes.length; i++) {
      let col = i % 2;
      let row = floor(i / 2);
      let ox  = startX + col * (opcW + 32);
      let oy  = startY + row * (opcH + gap);

      if (mouseX > ox && mouseX < ox + opcW &&
          mouseY > oy && mouseY < oy + opcH) {
        quizRespondida   = true;
        quizRespostaUser = i;
        quizTimer        = 0;

        if (i === p.correta) {
          pontos += 30;
          quizAcertos++;
          somAcerto();
        } else {
          somErro();
        }
      }
    }
  }

  // TELA 4 – Produção → botões SIM / NÃO
  if (tela === 4 && progressoProd >= 100 && querSaberMais === null) {
    let simX = width / 2 - 136;
    let simY = height - 74;
    let simW = 118;
    let simH = 42;
    if (mouseX > simX && mouseX < simX + simW &&
        mouseY > simY && mouseY < simY + simH) {
      querSaberMais = true;
    }

    let naoX = width / 2 + 18;
    let naoY = height - 74;
    let naoW = 118;
    let naoH = 42;
    if (mouseX > naoX && mouseX < naoX + naoW &&
        mouseY > naoY && mouseY < naoY + naoH) {
      querSaberMais = false;
    }
  }

  // TELA 5 – Segredo → botão Continuar
  if (tela === 5 && segredoFase === 1 && segredoTimer > 220) {
    if (mouseX > width / 2 - 98 && mouseX < width / 2 + 98 &&
        mouseY > height - 62    && mouseY < height - 20) {
      tela = 6;
    }
  }

  // TELA 6 – Final → Jogar Novamente
  if (tela === 6) {
    if (mouseX > width / 2 - 118 && mouseX < width / 2 + 118 &&
        mouseY > height - 68     && mouseY < height - 26) {
      iniciarJogo();
      tela = 0;
    }
  }
}

// ============================================================
// KEY PRESSED – atalhos de teclado
// ============================================================
function keyPressed() {
  // R = reinicia em qualquer tela
  if (key === 'r' || key === 'R') {
    iniciarJogo();
    tela = 0;
  }
}
// ============================================================
// FIM DO SKETCH – DRONE DO MELADO
// Concurso Agrinho 2026 – SENAR-PR
// ============================================================
