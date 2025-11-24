'use strict';

// ==================== 默认配置对象 ====================
const DEFAULT_CONFIG = {
  // 雪花配置
  snow: {
    count: 200,
    sizeRange: { min: 1, max: 3 },
    opacityRange: { min: 0.5, max: 1.0 },
    durationRange: { min: 9, max: 28 },
    delayRange: { min: 1, max: 10 },
    leftIniRange: { min: -10, max: 10 },
    leftEndRange: { min: -15, max: 10 },
    leftRange: { min: 0, max: 100 },
    zIndexInterval: 12,
    baseSize: 8,
    blur: 0.5
  },
  // 圣诞树配置
  tree: {
    heightRatio: 0.65,
    widthRatio: 0.75,
    topMarginRatio: 0.1,
    topMargin: 70,
    branchCountRatio: 430 / 1270,
    lastLayersNoDivide: 10,
    rotationDuration: 20,
    starOffset: -50,
    branchWidthBase: 15,
    branchWidthRatio: 1.8,
    branchHeight: 26,
    rotationRange: { min: 20, max: 100 }
  },
  // 树枝配置
  branch: {
    greenColorRange: { min: 50, max: 250 },
    otherColorRange: { min: 0, max: 50 }
  },
  // 文本配置
  text: {
    greetings: [
      'printf("{0}");',
      'cout << "{0}" << endl;',
      'WriteLn("{0}");',
      'System.out.println( "{0}" );',
      'print "{0}"',
      'fmt.Println("{0}");',
      'echo "{0}"',
      'say "{0}"',
      'print("{0}");',
      '(print "{0}")',
      'PRINT "{0}"',
      '<%= "{0}" %>',
      'System.Console.WriteLine("{0}");',
      'console.log("{0}");',
      'document.write("{0}")'
    ],
    messages: [
      "Merry Christmas!",
      "Happy New Year!",
      `Hello ${new Date().getFullYear() + 1}!`
    ],
    title: "Merry Christmas (◕‿-) ✧"
  }
};

// ==================== 工具类 ====================
class Utils {
  // 生成随机整数
  static getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // 生成随机浮点数
  static getRandomFloat(min, max, decimals = 1) {
    const value = Math.random() * (max - min) + min;
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  // 设置CSS transform属性
  static setTransform(element, value) {
    element.style.transform = value;
  }

  // 扩展String原型以支持格式化
  static extendStringFormat() {
    if (!String.prototype.format) {
      String.prototype.format = function () {
        const args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
          return typeof args[number] !== 'undefined' ? args[number] : match;
        });
      };
    }
  }
}

// ==================== 雪花生成器类 ====================
class SnowGenerator {
  constructor(config) {
    this.config = config;
    this.configs = [];
  }

  // 生成单个雪花配置
  generateConfig() {
    const { snow } = this.config;
    return {
      leftIni: Utils.getRandom(snow.leftIniRange.min, snow.leftIniRange.max),
      leftEnd: Utils.getRandom(snow.leftEndRange.min, snow.leftEndRange.max),
      size: Utils.getRandomFloat(snow.sizeRange.min, snow.sizeRange.max, 1),
      left: Utils.getRandom(snow.leftRange.min, snow.leftRange.max),
      duration: Utils.getRandom(snow.durationRange.min, snow.durationRange.max),
      delay: Utils.getRandom(snow.delayRange.min, snow.delayRange.max),
      opacity: Utils.getRandomFloat(snow.opacityRange.min, snow.opacityRange.max, 2)
    };
  }

  // 生成所有雪花配置
  generateConfigs() {
    this.configs = [];
    for (let i = 0; i < this.config.snow.count; i++) {
      this.configs.push(this.generateConfig());
    }
    return this.configs;
  }

  // 创建单个雪花元素
  createSnowElement(config, index) {
    const { snow } = this.config;
    const snowElement = document.createElement("div");
    snowElement.className = "snow";

    // 使用CSS变量动态设置样式
    snowElement.style.setProperty('--left-ini', `${config.leftIni}vw`);
    snowElement.style.setProperty('--left-end', `${config.leftEnd}vw`);
    snowElement.style.setProperty('--size', config.size);
    snowElement.style.left = `${config.left}vw`;
    snowElement.style.animation = `move1 ${config.duration}s linear -${config.delay}s infinite`;
    snowElement.style.opacity = config.opacity;

    // 设置zIndex
    if (index % snow.zIndexInterval === 0) {
      snowElement.style.zIndex = '99';
    }

    return snowElement;
  }

  // 初始化雪花
  init(container) {
    if (!container) return;

    this.generateConfigs();
    const fragment = document.createDocumentFragment();

    this.configs.forEach((config, index) => {
      const snowElement = this.createSnowElement(config, index);
      fragment.appendChild(snowElement);
    });

    container.appendChild(fragment);
  }
}

// ==================== 圣诞树生成器类 ====================
class TreeGenerator {
  constructor(config) {
    this.config = config;
  }

  // 创建树枝元素
  createBranch(width, height) {
    const { text, branch } = this.config;
    const div = document.createElement('div');
    const span = document.createElement('span');

    // 随机选择问候语和消息
    const greeting = text.greetings[Utils.getRandom(0, text.greetings.length - 1)];
    const message = text.messages[Utils.getRandom(0, text.messages.length - 1)];
    const textNode = document.createTextNode(greeting.format(message));

    div.id = "branch";
    div.className = "christmas";
    span.id = "text";
    span.appendChild(textNode);
    div.appendChild(span);

    // 设置尺寸
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;

    // 随机生成颜色
    const green = Utils.getRandom(branch.greenColorRange.min, branch.greenColorRange.max);
    const other = Utils.getRandom(branch.otherColorRange.min, branch.otherColorRange.max);
    div.style.backgroundColor = `rgba(${other}, ${green}, ${other}, 1)`;

    return div;
  }

  // 初始化圣诞树
  init(container) {
    if (!container) return;

    const { tree } = this.config;
    const height = window.innerHeight * tree.heightRatio;
    const width = height * tree.widthRatio;
    const star = container.querySelector(".star");
    const treeElement = container;

    // 设置星星位置
    if (star) {
      star.style.top = '0';
      star.style.left = `${width * 0.5 + tree.starOffset}px`;
    }

    // 设置树容器样式
    treeElement.style.marginTop = `${height * tree.topMarginRatio}px`;
    treeElement.style.width = `${width}px`;
    treeElement.style.height = `${height}px`;

    // 计算树枝数量
    const branchCount = Math.floor(tree.branchCountRatio * height);
    const fragment = document.createDocumentFragment();
    let count = 0;
    let rotate = 0;
    let divided = height / branchCount;

    // 生成树枝
    for (let i = 0; i < branchCount; i++) {
      // 最后N层不分割
      if (branchCount - i < tree.lastLayersNoDivide) {
        divided = 0;
      }

      const x = width / 2;
      const y = count + divided + tree.topMargin;
      count += divided;

      // 旋转角度
      rotate = (Utils.getRandom(tree.rotationRange.min, tree.rotationRange.max) + rotate) % 360;

      // 计算树枝宽度
      const elementWidth = tree.branchWidthBase + (((y - tree.topMargin) / height) * width / tree.branchWidthRatio);
      const elementHeight = tree.branchHeight;

      // 创建树枝
      const branchElement = this.createBranch(elementWidth, elementHeight);
      Utils.setTransform(
        branchElement,
        `translate3d(${x}px, ${y}px, 0px) rotateX(0deg) rotateY(${rotate}deg) rotateZ(0deg)`
      );
      fragment.appendChild(branchElement);
    }

    treeElement.appendChild(fragment);
    document.body.style.perspectiveOrigin = '50% 20%';
  }
}

// ==================== 主应用类 ====================
class ChristmasApp {
  constructor(config = DEFAULT_CONFIG) {
    this.config = config;
    this.snowGenerator = new SnowGenerator(config);
    this.treeGenerator = new TreeGenerator(config);
  }

  // 初始化应用
  init() {
    // 扩展String原型
    Utils.extendStringFormat();

    // 初始化圣诞树
    const treeContainer = document.getElementById("tree");
    if (treeContainer) {
      this.treeGenerator.init(treeContainer);
    }

    // 初始化雪花
    const snowContainer = document.getElementById("snow_container");
    if (snowContainer) {
      this.snowGenerator.init(snowContainer);
    }

    // 设置标题
    const titleElement = document.querySelector(".title");
    if (titleElement) {
      titleElement.textContent = this.config.text.title;
    }
  }
}

// ==================== 初始化 ====================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new ChristmasApp();
    app.init();
  });
} else {
  const app = new ChristmasApp();
  app.init();
}

