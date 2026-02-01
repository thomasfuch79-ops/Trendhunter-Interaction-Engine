"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import data from "../data.json";

// TODO: 优化 Spring Physics 参数以获得更自然的弹出效果
// TODO: 实现 120fps 性能优化，考虑使用 will-change 和 GPU 加速
// TODO: 添加触摸设备支持

interface OutfitItem {
  id: string;
  name: string;
  svgPath: string;
}

export default function OutfitStage() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { imageUrl, items } = data as {
    imageUrl: string;
    items: OutfitItem[];
  };

  // TODO: 调整 spring 配置以实现更流畅的动画
  const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 20,
    mass: 0.8,
  };

  return (
    <div className="relative w-[400px] h-[600px] overflow-hidden rounded-2xl">
      {/* 背景图片 - 保持静止 */}
      <img
        src={imageUrl}
        alt="Outfit"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* SVG Mask 交互层 */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {items.map((item) => (
            <clipPath key={`clip-${item.id}`} id={`clip-${item.id}`}>
              <path d={item.svgPath} />
            </clipPath>
          ))}
        </defs>

        {/* 可交互的轮廓区域 */}
        {items.map((item) => (
          <g key={item.id}>
            {/* 隐形的交互热区 */}
            <path
              d={item.svgPath}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            />
          </g>
        ))}
      </svg>

      {/* TODO: 考虑使用 CSS contain 属性优化渲染性能 */}
      {/* 弹出效果层 */}
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={`popup-${item.id}`}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: hoveredItem === item.id ? 1 : 0,
            }}
            transition={{ duration: 0.15 }}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 600"
              preserveAspectRatio="xMidYMid slice"
              style={{
                filter:
                  hoveredItem === item.id
                    ? "drop-shadow(0 10px 30px rgba(0,0,0,0.5))"
                    : "none",
              }}
            >
              <defs>
                <clipPath id={`popup-clip-${item.id}`}>
                  <path d={item.svgPath} />
                </clipPath>
              </defs>

              {/* TODO: 优化 transform-origin 计算，使缩放中心更精确 */}
              <motion.g
                clipPath={`url(#popup-clip-${item.id})`}
                initial={{ scale: 1 }}
                animate={{
                  scale: hoveredItem === item.id ? 1.1 : 1,
                }}
                transition={springConfig}
                style={{
                  transformOrigin: "center center",
                  transformBox: "fill-box",
                }}
              >
                <image
                  href={imageUrl}
                  x="0"
                  y="0"
                  width="400"
                  height="600"
                  preserveAspectRatio="xMidYMid slice"
                />
              </motion.g>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hover 时显示 item 名称 */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-black font-medium text-sm shadow-lg"
          >
            {items.find((i) => i.id === hoveredItem)?.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
