# 音效资源说明

## 需要添加的音效文件

在 `assets/audio/` 目录下添加以下 MP3 文件：

| 文件名 | 用途 | 建议时长 |
|--------|------|----------|
| shake.mp3 | 摇骰子滚动声 | 0.5-1s |
| open.mp3 | 开盅揭晓声 | 0.3-0.5s |
| win.mp3 | 胜利提示音 | 0.5-1s |
| lose.mp3 | 失败/喝酒提示音 | 0.5-1s |
| click.mp3 | 按钮点击声 | 0.1-0.2s |
| call.mp3 | 叫骰确认声 | 0.2-0.3s |

## 免费音效资源

可从以下网站下载：
- https://freesound.org
- https://soundbible.com
- https://mixkit.co/free-sound-effects/

## 使用 FFmpeg 生成测试音效

```bash
# 安装 ffmpeg (macOS)
brew install ffmpeg

# 生成简单的 beep 音效作为测试
ffmpeg -f lavfi -i "sine=frequency=800:duration=0.3" -y assets/audio/click.mp3
ffmpeg -f lavfi -i "sine=frequency=440:duration=0.5" -y assets/audio/shake.mp3
ffmpeg -f lavfi -i "sine=frequency=880:duration=0.5" -y assets/audio/win.mp3
ffmpeg -f lavfi -i "sine=frequency=220:duration=0.5" -y assets/audio/lose.mp3
ffmpeg -f lavfi -i "sine=frequency=600:duration=0.3" -y assets/audio/open.mp3
ffmpeg -f lavfi -i "sine=frequency=1000:duration=0.2" -y assets/audio/call.mp3
```

## 注意

如果没有音效文件，游戏仍可正常运行，只是没有声音效果。
