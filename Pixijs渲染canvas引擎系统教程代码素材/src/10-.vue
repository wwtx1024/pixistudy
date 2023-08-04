<template>
  <div></div>
</template>

<script setup>
// 导入pixi.js

import * as PIXI from "pixi.js";

// 创建应用
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xffffff,
  resolution: window.devicePixelRatio || 1,
  antialias: true, // 抗锯齿
});

// 将应用画布添加到DOM中
document.body.appendChild(app.view);

// 创建容器
const container = new PIXI.Container();

// 将容器添加到舞台
app.stage.addChild(container);

// 添加恐龙小游戏的精灵纹理
const baseTexture = PIXI.BaseTexture.from("./textures/game.png");
const frameWidth = 88;
const frameHeight = 100;

// 创建恐龙纹理
const dinoTexture = new PIXI.Texture(
  baseTexture,
  new PIXI.Rectangle(75, 0, frameWidth, frameHeight)
);
// // 创建恐龙精灵
const dino = new PIXI.Sprite(dinoTexture);
dino.visible = false;
container.addChild(dino);

// 恐龙跑步动画;
const runTexture = new PIXI.Texture(
  baseTexture,
  new PIXI.Rectangle(1675, 0, frameWidth, frameHeight)
);
const runSprite = new PIXI.Sprite(runTexture);
runSprite.visible = false;
container.addChild(runSprite);

let runTextures = [];
for (let i = 0; i < 2; i++) {
  runTextures.push(
    new PIXI.Texture(
      baseTexture,
      new PIXI.Rectangle(1680 + (2 + i) * frameWidth, 0, 82, frameHeight)
    )
  );
}
const runAnimation = new PIXI.AnimatedSprite(runTextures);
runAnimation.animationSpeed = 0.1;
runAnimation.play();
runAnimation.visible = false;
container.addChild(runAnimation);

// 恐龙死亡动画;
let deadTextures = [];
for (let i = 0; i < 2; i++) {
  deadTextures.push(
    new PIXI.Texture(
      baseTexture,
      new PIXI.Rectangle(1680 + (0 + i) * frameWidth, 0, 82, frameHeight)
    )
  );
}
const deadAnimation = new PIXI.AnimatedSprite(deadTextures);
deadAnimation.animationSpeed = 0.1;
deadAnimation.play();
deadAnimation.visible = false;
container.addChild(deadAnimation);

// 恐龙跳跃精灵
const jumpTexture = new PIXI.Texture(
  baseTexture,
  new PIXI.Rectangle(1680, 0, 82, frameHeight)
);
const jumpSprite = new PIXI.Sprite(jumpTexture);
jumpSprite.visible = false;
container.addChild(jumpSprite);

// 地面精灵
const groundTexture = new PIXI.Texture(
  baseTexture,
  new PIXI.Rectangle(50, 100, 2300, 30)
);
// 设置纹理水平镜像重复
groundTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

const groundSprite = new PIXI.TilingSprite(groundTexture);
groundSprite.width = window.innerWidth;
groundSprite.height = 30;
// 设置地面精灵的位置
groundSprite.position.set(0, window.innerHeight - 50);

container.addChild(groundSprite);

// 仙人掌精灵
const cactusTexture = new PIXI.Texture(
  baseTexture,
  new PIXI.Rectangle(515, 0, 30, 60)
);
const cactusSprite = new PIXI.Sprite(cactusTexture);
cactusSprite.x = window.innerWidth;
cactusSprite.y = window.innerHeight - 50 - 50;
container.addChild(cactusSprite);

// 创建文字
let startText = new PIXI.Text("开始游戏", {
  fontSize: 30,
  fill: 0x333333,
  align: "center",
});
startText.x = app.screen.width / 2;
startText.y = app.screen.height / 2;
startText.anchor.set(0.5);
container.addChild(startText);
startText.interactive = true;
startText.on("click", () => {
  playGame();
});

let isGameing = false;

// 开始游戏
function playGame(e) {
  // 恐龙跑步动画;
  runAnimation.x = 60;
  runAnimation.y = window.innerHeight - 50 - frameHeight;
  runAnimation.visible = true;
  // 恐龙死亡动画;
  deadAnimation.x = 60;
  deadAnimation.y = window.innerHeight - 50 - frameHeight;
  deadAnimation.visible = false;
  // 恐龙跳跃精灵
  jumpSprite.x = 60;
  jumpSprite.y = window.innerHeight - 50 - frameHeight;
  jumpSprite.visible = false;
  isGameing = true;
}

let gravity = 1;
let jumpVelocity = 10;
let isGameOver = false;
let score = 0;
app.ticker.add((delta) => {
  if (isGameOver) return;
  if (isGameing) {
    // 地面精灵
    groundSprite.tilePosition.x -= 10;
    // 仙人掌精灵
    cactusSprite.x -= 10;
    if (cactusSprite.x <= -30) {
      cactusSprite.x = window.innerWidth;
      score++;
    }
  }

  if (jumpSprite.visible) {
    jumpVelocity -= gravity;
    jumpSprite.y -= jumpVelocity;
    if (jumpSprite.y >= window.innerHeight - 50 - frameHeight) {
      console.log("跳跃结束");
      jumpSprite.y = window.innerHeight - 50 - frameHeight;
      jumpVelocity = 20;
      runAnimation.visible = true;
      jumpSprite.visible = false;
    }
  }

  // 判断跳跃精灵与仙人掌精灵是否碰撞
  if (
    jumpSprite.y > cactusSprite.y - 60 &&
    jumpSprite.x + 60 > cactusSprite.x &&
    jumpSprite.x - 60 < cactusSprite.x
  ) {
    // 游戏结束
    gameOver();
  }
});

function gameOver() {
  console.log("游戏结束");
  // 游戏结束
  isGameOver = true;
  startText.visible = false;
  let endText = new PIXI.Text("游戏结束，最后得分：" + score, {
    fontSize: 30,
    fill: 0x333333,
    align: "center",
  });
  endText.x = app.screen.width / 2;
  endText.y = app.screen.height / 2;
  endText.anchor.set(0.5);
  container.addChild(endText);
  endText.interactive = true;
  endText.on("click", () => {
    location.reload();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    runAnimation.visible = false;
    jumpSprite.visible = true;
    jumpVelocity = 20;
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
canvas {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
}
</style>
