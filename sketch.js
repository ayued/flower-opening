let flowers = [];
let sizeIncrease = 0; // 花びらの最大サイズ増加量
let maxFlowerSize; // 花の最大サイズ

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 100);
  updateMaxFlowerSize();
}

function draw() {
  background(0);
  
  for (let flower of flowers) {
    flower.update();
    flower.display();
  }
  
  // 花びらの最大サイズを少しずつ大きくする（最大サイズを超えない範囲で）
  sizeIncrease = min(sizeIncrease + 0.05, maxFlowerSize - 80);
}

function mousePressed() {
  flowers.push(new Flower(mouseX, mouseY));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateMaxFlowerSize();
}

function updateMaxFlowerSize() {
  maxFlowerSize = min(width, height) * 0.9;
}

class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.petals = [];
    this.maxPetals = 300; // 画面上の最大花びら数
    this.addPetalInterval = 5; // 花びらを追加する間隔（フレーム数）
    this.hueValue = 180; // 各花の色相の初期値（青系）
  }
  
  update() {
    // 一定間隔で新しい花びらを追加
    if (frameCount % this.addPetalInterval === 0) {
      this.petals.push(new Petal(this.hueValue));
    }
    
    // 各花びらの更新
    for (let i = this.petals.length - 1; i >= 0; i--) {
      this.petals[i].update();
      
      // 完全に透明になった花びらを削除
      if (this.petals[i].alpha <= 0) {
        this.petals.splice(i, 1);
      }
    }
    
    // 最大数を超えた場合、古い花びらのフェードアウトを開始
    if (this.petals.length > this.maxPetals) {
      this.petals[0].startFadeOut();
    }
    
    // 色相を少しずつ変化させる
    this.hueValue = (this.hueValue + 0.1) % 360;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    for (let petal of this.petals) {
      petal.display();
    }
    pop();
  }
}

class Petal {
  constructor(hueValue) {
    this.angle = random(360);
    this.size = 0;
    this.maxSize = min(random(40, 80) + sizeIncrease, maxFlowerSize / 2);
    this.growthSpeed = random(0.1, 0.3);
    this.hue = (hueValue + random(-15, 15) + 360) % 360;
    this.saturation = 80 - random(20);
    this.brightness = 100 - random(20);
    this.alpha = 70;
    this.fading = false;
    this.fadeSpeed = 1;
  }
  
  update() {
    if (this.size < this.maxSize) {
      this.size += this.growthSpeed;
    }
    if (this.fading) {
      this.alpha -= this.fadeSpeed;
      this.alpha = max(this.alpha, 0);
    }
  }
  
  display() {
    push();
    rotate(this.angle);
    noStroke();
    fill(this.hue, this.saturation, this.brightness, this.alpha);
    ellipse(this.size / 2, 0, this.size, this.size / 3);
    pop();
  }
  
  startFadeOut() {
    this.fading = true;
  }
}
