# TrendHunter Interaction Engine Challenge

## 任务目标

优化服装图片的 **Pop-out 交互效果**，实现以下目标：

### 1. Spring Physics 优化

- 调整 `stiffness`、`damping`、`mass` 参数
- 实现自然、流畅的弹出动画
- 确保动画响应迅速且不生硬

### 2. 120fps 性能优化

- 使用 GPU 加速（`will-change`、`transform`）
- 避免布局抖动（Layout Thrashing）
- 优化重绘区域，减少不必要的渲染
- 考虑使用 `CSS contain` 属性隔离渲染

## 技术栈

- Next.js 16 (App Router)
- Framer Motion
- SVG Mask / ClipPath
- Tailwind CSS

## 开发

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。
