# 开心大话骰

一个基于原生 JavaScript 和微信小游戏 API 开发的轻量单机摇骰子小游戏。

项目采用竖屏布局，进入游戏后点击底部“摇一摇”按钮即可触发摇骰动画，并在动画结束后展示 5 颗骰子的随机结果，适合聚会互动、桌游助兴等场景。

## 演示视频

<video src="./test.mp4" controls muted playsinline width="360"></video>

如果当前 Markdown 平台不支持内嵌播放，可直接打开视频文件查看效果：

- [项目演示视频 test.mp4](./test.mp4)

## 功能特性

- 原生微信小游戏工程，无需依赖 Web 前端框架
- 点击“摇一摇”按钮触发开盅/摇骰动画
- 每次摇动后生成 5 颗随机骰子结果
- 支持摇骰音效播放
- 竖屏界面布局，适配安全区和不同机型尺寸
- 不依赖登录、支付或网络接口即可体验核心玩法

## 技术栈

- 微信小游戏 API
- 原生 JavaScript
- CommonJS 模块化
- Canvas 2D 渲染
- `wx.createInnerAudioContext` 音频能力

## 项目结构

```text
.
├── assets/
│   └── audio/
│       └── shake.mp3
├── src/
│   ├── animation/
│   │   └── CupAnimator.js
│   ├── audio/
│   │   └── AudioManager.js
│   ├── components/
│   │   ├── BottomControls.js
│   │   ├── CupView.js
│   │   ├── DiceRenderer.js
│   │   ├── TopShortcutBar.js
│   │   └── TrayView.js
│   ├── core/
│   │   ├── GameApp.js
│   │   ├── InputManager.js
│   │   ├── Layout.js
│   │   └── Renderer.js
│   ├── models/
│   │   └── DiceSet.js
│   ├── scenes/
│   │   └── MainScene.js
│   ├── state/
│   │   └── GameState.js
│   └── utils/
│       └── easing.js
├── game.js
├── game.json
├── project.config.json
├── test.mp4
├── 微信小游戏发布说明.md
└── 微信小游戏5分钟快速发布清单.md
```

## 核心文件说明

- `game.js`：项目入口，负责创建并启动游戏实例
- `src/core/GameApp.js`：管理 Canvas、渲染器、输入、音频和生命周期
- `src/scenes/MainScene.js`：主场景逻辑，包括点击交互、摇骰流程和渲染
- `src/models/DiceSet.js`：生成 5 颗骰子的随机结果和布局信息
- `src/state/GameState.js`：维护摇骰阶段、输入锁定和当前结果状态
- `src/audio/AudioManager.js`：管理音效播放
- `src/core/Layout.js`：负责竖屏布局和安全区适配

## 运行方式

本项目不是基于 `npm` 的 Web 工程，运行方式为微信小游戏标准流程。

1. 打开微信开发者工具
2. 导入当前项目目录
3. 确认工程类型为“小游戏”
4. 使用 `project.config.json` 中的配置运行项目
5. 在开发者工具中进行预览或真机调试

## 发布方式

可通过微信开发者工具执行上传、体验版验证和提审发布。

仓库中已提供两份辅助文档：

- `微信小游戏发布说明.md`
- `微信小游戏5分钟快速发布清单.md`

## 当前实现说明

- 当前核心玩法已经可用：点击按钮后播放摇骰流程并展示结果
- 项目当前已接入摇骰音效资源 `assets/audio/shake.mp3`
- 左右侧功能按钮目前为预留入口，点击后显示“开发中”提示
- 顶部快捷入口位目前保留，尚未配置具体功能项
- 项目为单机玩法，不依赖服务端接口

## 适用场景

- 聚会摇骰子
- 桌游辅助
- 喝酒游戏互动
- 微信小游戏原生 Canvas 项目参考

## 备注

- 工程类型：微信小游戏
- 屏幕方向：竖屏（`portrait`）
- 入口文件：`game.js`
