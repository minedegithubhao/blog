import kojiImage from "@/assets/images/ai-companions/koji-kun.png";
import mochiImage from "@/assets/images/ai-companions/mochi-chan.png";
import yukiImage from "@/assets/images/ai-companions/yuki-star.png";

export interface AICompanionCard {
  id: string;
  role: string;
  name: string;
  description: string;
  image: string;
  accent: string;
  theme: "peach" | "ocean" | "gold";
}

export const AI_COMPANIONS: AICompanionCard[] = [
  {
    id: "mochi-chan",
    role: "Support Agent",
    name: "Mochi-Chan",
    description: "偏陪伴、偏治愈的内容搭子，适合做轻松交流与灵感整理。",
    image: mochiImage,
    accent: "温柔对话",
    theme: "peach",
  },
  {
    id: "koji-kun",
    role: "Creative Lead",
    name: "Koji-Kun",
    description: "偏理性、偏结构化的创作助手，适合做方案拆解与思路推进。",
    image: kojiImage,
    accent: "结构推演",
    theme: "ocean",
  },
  {
    id: "yuki-star",
    role: "Spark Expert",
    name: "Yuki-Star",
    description: "偏表达、偏视觉感的灵感角色，适合做标题、文案与氛围发散。",
    image: yukiImage,
    accent: "灵感点亮",
    theme: "gold",
  },
];

