from __future__ import annotations

import hashlib
import html
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable
from xml.etree import ElementTree as ET


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


REPO_ROOT = Path(__file__).resolve().parents[1]
IDEA_ROOT = REPO_ROOT.parent
SOURCE_DIR = IDEA_ROOT / "整理区"
KNOWLEDGE_BASE_DIR = IDEA_ROOT / "canbe_knowledge_base"
OUTPUT_ROOT = SOURCE_DIR / "博客整理"
OUTPUT_DIRECT_DIR = OUTPUT_ROOT / "整理区转博客"
OUTPUT_KB_DIR = OUTPUT_ROOT / "知识库转博客"
MANIFEST_PATH = OUTPUT_ROOT / "manifest.json"

CATEGORY_SORT = {
    "AI与大模型": 10,
    "机器学习": 20,
    "Python开发": 30,
    "Java后端": 40,
    "前端开发": 50,
    "数据库": 60,
    "开发运维": 70,
    "项目实践": 80,
    "知识整理": 90,
}

CATEGORY_HINTS: list[tuple[str, tuple[str, ...]]] = [
    (
        "Java后端",
        (
            "spring",
            "springboot",
            "java",
            "mybatis",
            "maven",
            "权限",
            "bean",
        ),
    ),
    (
        "前端开发",
        (
            "react",
            "vue",
            "vite",
            "javascript",
            "typescript",
            "css",
            "前端",
        ),
    ),
    (
        "数据库",
        (
            "mysql",
            "redis",
            "sql",
            "binlog",
            "canal",
            "es库",
            "数据库",
        ),
    ),
    (
        "开发运维",
        (
            "linux",
            "docker",
            "vagrant",
            "虚拟机",
            "nginx",
            "部署",
            "运维",
            "安装",
        ),
    ),
    (
        "项目实践",
        (
            "项目",
            "实战",
            "报错",
            "修改项目名称",
            "使用手册",
        ),
    ),
    (
        "Python开发",
        (
            "python",
            "pytorch",
            "闭包",
            "装饰器",
            "面向对象",
            "类",
        ),
    ),
    (
        "机器学习",
        (
            "机器学习",
            "回归",
            "决策树",
            "随机森林",
            "svm",
            "准确率",
            "召回率",
            "交叉验证",
            "聚类",
            "贝叶斯",
            "误差",
            "有监督",
            "无监督",
        ),
    ),
    (
        "AI与大模型",
        (
            "大模型",
            "rag",
            "transformer",
            "token",
            "embedding",
            "prompt",
            "rerank",
            "agent",
            "chunk",
            "nlp",
            "clip",
            "多模态",
            "向量",
            "图文",
            "检索",
            "重排序",
            "上下文工程",
        ),
    ),
]

SECTION_HINTS = {
    "AI与大模型": [
        "先建立“问题场景 -> 技术链路 -> 落地收益”的阅读顺序，避免只记术语不记关系。",
        "如果材料里同时出现检索、重排、Prompt 组装，应把它们看成一条串联流水线，而不是孤立模块。",
        "这类主题适合边看边画结构图，尤其是输入、处理中间层和最终生成结果的因果关系。",
    ],
    "机器学习": [
        "优先区分任务类型、评价指标和模型假设，再看公式和优化方法，学习路径会更稳。",
        "同类算法容易混淆时，最好把“适用数据、优缺点、训练代价”并排比较。",
        "如果材料里带评价指标，最好同步理解指标偏高或偏低分别意味着什么业务问题。",
    ],
    "Python开发": [
        "阅读时先抓数据类型、控制流、对象模型，再看 API 细节，能减少死记硬背。",
        "涉及示例代码的地方，最好自己把输入输出手推一遍，确认状态变化和返回值。",
        "如果主题和第三方组件有关，优先建立“连接、操作、异常处理”这三段式理解。",
    ],
    "Java后端": [
        "后端材料优先看配置入口、依赖注入关系和请求处理链路，整体结构比零碎注解更关键。",
        "涉及框架配置时，最好同步记录默认行为和覆盖方式，避免只会抄配置不会排错。",
        "如果文章讨论 Bean、配置类、条件装配，本质上都是“容器如何决定装不装、装什么”。",
    ],
    "前端开发": [
        "前端资料适合按“项目初始化 -> 目录结构 -> 状态/路由 -> 构建发布”这条主线阅读。",
        "如果材料里同时包含工程配置和页面代码，应区分“构建层问题”和“组件层问题”。",
        "对 React/Vue 这类内容，理解数据流和组件边界，通常比背 API 更重要。",
    ],
    "数据库": [
        "数据库类内容建议先确认“数据结构、访问方式、性能瓶颈”三个层级，再看细节命令。",
        "一旦涉及优化，必须明确优化对象是查询、索引、网络往返还是缓存命中率。",
        "Redis 和 MySQL 不应混着背，前者偏数据结构与响应速度，后者偏事务、索引与一致性。",
    ],
    "开发运维": [
        "运维主题要先抓环境边界：宿主机、虚拟机、容器、网络、端口分别是谁在负责。",
        "安装和部署材料最好同步补齐验证步骤，否则流程跑完也无法确认系统是否真的可用。",
        "如果文档出现多层工具链，应把它们理解成“镜像层、运行层、编排层”的分工问题。",
    ],
    "项目实践": [
        "项目型文章更看重步骤顺序、依赖关系和回滚路径，而不是单个命令本身。",
        "排错材料要把“现象、定位、根因、修复、预防”拆开记录，后续复用价值更高。",
        "如果是整项目知识，建议读者先看整体架构，再回到具体模块和报错细节。",
    ],
    "知识整理": [
        "整理型文章重点不在信息量，而在信息的组织方式是否让后续复习更低成本。",
        "面对概念密集材料，先抓总线索，再回看局部定义，能减少“知道词但不知道关系”的问题。",
        "如果读者准备把它继续扩写，建议先补例子，再补边界条件，最后才补术语细节。",
    ],
}


@dataclass
class SourceArticle:
    source_kind: str
    source_path: Path
    title: str
    body: str
    category: str
    summary: str
    keywords: list[str]
    output_path: Path


def read_text(path: Path) -> str:
    for encoding in ("utf-8", "utf-8-sig", "gb18030"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return path.read_text(encoding="utf-8", errors="ignore")


def strip_html_tags(text: str) -> str:
    text = re.sub(r"</?font[^>]*>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"</?span[^>]*>", "", text, flags=re.IGNORECASE)
    return text


def clean_markdown(text: str) -> tuple[str, list[str]]:
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = strip_html_tags(text)
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r"\[\[(.+?)\]\]", r"\1", text)
    text = re.sub(r"(?m)^(alias|tags|type|status)::.*$", "", text)
    text = re.sub(r"(?m)\s+#card\b", "", text)
    text = re.sub(r"(?m)\s+#面试[^\s]*", "", text)
    text = re.sub(r"!\[(.*?)\]\(((?!https?://)[^)]+)\)", r"> 附图素材：\2", text)
    text = html.unescape(text)

    keywords: list[str] = []
    lines: list[str] = []
    for raw_line in text.split("\n"):
        line = raw_line.replace("\t", "    ").rstrip()
        if not line.strip():
            lines.append("")
            continue
        if line.startswith("tags::"):
            keywords.extend(
                [item.strip() for item in line.split("::", 1)[1].split(",") if item.strip()]
            )
            continue
        line = re.sub(r"\s{3,}", "  ", line)
        lines.append(line)

    cleaned = "\n".join(lines)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    return cleaned, keywords


def normalize_title(raw_title: str) -> str:
    title = raw_title.replace("___", "：")
    title = title.replace("__", "：")
    title = title.replace("_", " ")
    title = re.sub(r"\s+", " ", title).strip()
    return title


def plain_text_excerpt(text: str) -> str:
    plain = re.sub(r"(?m)^#+\s*", "", text)
    plain = re.sub(r"(?m)^\s*[-*]\s*", "", plain)
    plain = re.sub(r"`{1,3}", "", plain)
    plain = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", plain)
    plain = re.sub(r"https?://\S+", "", plain)
    plain = re.sub(r"附图素材：\S+", "", plain)
    plain = re.sub(r"\s+", " ", plain).strip()
    return plain


def build_summary(title: str, cleaned_body: str) -> str:
    excerpt = plain_text_excerpt(cleaned_body)
    if excerpt:
        excerpt = excerpt[:120].rstrip("，。；;,. ")
        return f"{title}这篇文章基于现有素材整理，重点梳理{excerpt}。"
    return f"{title}这篇文章基于现有素材整理，重点抽取主题脉络、核心概念与实践重点。"


def choose_category(title: str, body: str) -> str:
    explicit_title_rules = [
        ("Java后端", ("springboot", "spring", "权限管理")),
        ("前端开发", ("react", "vue", "前端")),
        ("数据库", ("sql优化", "mysql", "redis", "binlog", "canal")),
        ("开发运维", ("linux", "软件安装", "虚拟机", "vagrant", "docker")),
        ("项目实践", ("报错汇总", "项目实战", "修改项目名称")),
        ("AI与大模型", ("ai时代", "大模型开发", "rag", "prompt", "transformer", "agent")),
        ("Python开发", ("python", "pytorch", "闭包", "装饰器")),
        ("机器学习", ("机器学习", "回归", "聚类", "决策树", "随机森林")),
    ]
    title_target = title.lower()
    for category, hints in explicit_title_rules:
        if any(hint in title_target for hint in hints):
            return category

    target = f"{title}\n{body}".lower()
    for category, hints in CATEGORY_HINTS:
        if any(hint in target for hint in hints):
            return category
    return "知识整理"


def build_keywords(title: str, cleaned_body: str, source_keywords: Iterable[str]) -> list[str]:
    pieces: list[str] = []
    pieces.extend([item.strip() for item in re.split(r"[：:/\-\s]+", title) if item.strip()])
    pieces.extend(source_keywords)
    body_tokens = re.findall(r"[A-Za-z][A-Za-z0-9+\-_.]{1,30}", cleaned_body)
    pieces.extend(body_tokens[:8])
    unique: list[str] = []
    seen: set[str] = set()
    for item in pieces:
        value = item.strip()
        if not value or len(value) > 30:
            continue
        key = value.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(value)
        if len(unique) >= 8:
            break
    return unique


def material_note(source_kind: str, relative_source: str) -> str:
    label = "整理区原始资料" if source_kind == "direct" else "canbe_knowledge_base 素材整理"
    return f"> 素材来源：{label} / `{relative_source}`"


def intro_for(source_kind: str, title: str, category: str) -> str:
    if source_kind == "direct":
        return (
            f"这篇文章基于已有整理稿继续做博客化改写，目标不是重复抄笔记，"
            f"而是把 `{title}` 放回 `{category}` 这个知识上下文里，形成更适合连续阅读的结构。"
        )
    return (
        f"这篇文章来自知识库素材的二次整理。原始资料更偏卡片、提纲或碎片记录，"
        f"这里把它重新组织为一篇可阅读、可复盘、可继续扩写的博客稿。"
    )


def wrap_blog_article(
    *,
    source_kind: str,
    title: str,
    category: str,
    relative_source: str,
    summary: str,
    cleaned_body: str,
) -> str:
    practice_lines = "\n".join(f"- {line}" for line in SECTION_HINTS[category])
    return (
        f"# {title}\n\n"
        f"{material_note(source_kind, relative_source)}\n"
        f"> 分类建议：{category}\n\n"
        f"## 导读\n\n"
        f"{summary}\n\n"
        f"## 这篇文章在讲什么\n\n"
        f"{intro_for(source_kind, title, category)}\n\n"
        f"## 正文整理\n\n"
        f"{cleaned_body}\n\n"
        f"## 实战建议\n\n"
        f"{practice_lines}\n\n"
        f"## 小结\n\n"
        f"回到 `{title}` 这个主题，真正要抓住的不是零散知识点，而是它在 `{category}` 语境里的位置、边界和可落地用法。"
    )


def write_blog_output(base_dir: Path, category: str, order: int, title: str, content: str) -> Path:
    category_dir = base_dir / category
    category_dir.mkdir(parents=True, exist_ok=True)
    safe_name = re.sub(r"[<>:\"/\\\\|?*]", "-", title).strip()
    safe_name = safe_name[:80] if len(safe_name) > 80 else safe_name
    file_path = category_dir / f"{order:03d}-{safe_name}.md"
    file_path.write_text(content, encoding="utf-8")
    return file_path


def traverse_xmind_topic(topic: dict, depth: int = 0) -> list[str]:
    title = topic.get("title", "").strip()
    lines: list[str] = []
    if title:
        prefix = "  " * depth + "- "
        lines.append(f"{prefix}{title}")
    children = topic.get("children", {}).get("attached", [])
    for child in children:
        lines.extend(traverse_xmind_topic(child, depth + 1))
    return lines


def extract_xmind_markdown(path: Path) -> tuple[str, str]:
    with zipfile.ZipFile(path) as archive:
        data = json.loads(archive.read("content.json").decode("utf-8"))
    root = data[0]["rootTopic"]
    title = normalize_title(root.get("title") or path.stem)
    lines = traverse_xmind_topic(root)
    body = "## 思维导图整理\n\n" + "\n".join(lines)
    return title, body


def extract_drawio_markdown(path: Path) -> tuple[str, str]:
    root = ET.fromstring(read_text(path))
    values: list[str] = []
    for elem in root.iter():
        value = elem.attrib.get("value")
        if not value:
            continue
        value = html.unescape(re.sub(r"<[^>]+>", "", value)).strip()
        if value:
            values.append(value)

    unique_values: list[str] = []
    seen: set[str] = set()
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        unique_values.append(value)

    title = normalize_title(path.stem)
    lines = "\n".join(f"- {item}" for item in unique_values[:120])
    body = "## 流程图要点整理\n\n" + lines
    return title, body


def collect_direct_sources() -> list[tuple[Path, str, str]]:
    sources: list[tuple[Path, str, str]] = []
    for path in sorted(SOURCE_DIR.glob("*.md")):
        text, _ = clean_markdown(read_text(path))
        sources.append((path, normalize_title(path.stem), text))

    for path in sorted(SOURCE_DIR.glob("*.xmind")):
        title, body = extract_xmind_markdown(path)
        sources.append((path, title, body))

    for path in sorted(SOURCE_DIR.glob("*.drawio")):
        title, body = extract_drawio_markdown(path)
        sources.append((path, title, body))
    return sources


def collect_knowledge_sources() -> list[tuple[Path, str, str]]:
    pages_dir = KNOWLEDGE_BASE_DIR / "pages"
    sources: list[tuple[Path, str, str]] = []
    for path in sorted(pages_dir.glob("*.md")):
        title = normalize_title(path.stem)
        body, _ = clean_markdown(read_text(path))
        sources.append((path, title, body))
    return sources


def render_articles() -> list[SourceArticle]:
    shutil.rmtree(OUTPUT_ROOT, ignore_errors=True)
    OUTPUT_DIRECT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_KB_DIR.mkdir(parents=True, exist_ok=True)

    articles: list[SourceArticle] = []
    order = 1

    for source_kind, sources, output_dir in (
        ("direct", collect_direct_sources(), OUTPUT_DIRECT_DIR),
        ("knowledge", collect_knowledge_sources(), OUTPUT_KB_DIR),
    ):
        for source_path, title, raw_body in sources:
            cleaned_body, source_keywords = clean_markdown(raw_body)
            category = choose_category(title, cleaned_body)
            summary = build_summary(title, cleaned_body)
            keywords = build_keywords(title, cleaned_body, source_keywords)
            relative_source = source_path.relative_to(IDEA_ROOT).as_posix()
            blog_content = wrap_blog_article(
                source_kind=source_kind,
                title=title,
                category=category,
                relative_source=relative_source,
                summary=summary,
                cleaned_body=cleaned_body,
            )
            output_path = write_blog_output(output_dir, category, order, title, blog_content)
            articles.append(
                SourceArticle(
                    source_kind=source_kind,
                    source_path=source_path,
                    title=title,
                    body=blog_content,
                    category=category,
                    summary=summary,
                    keywords=keywords,
                    output_path=output_path,
                )
            )
            order += 1

    manifest = {
        "generatedAt": datetime.now().isoformat(timespec="seconds"),
        "repoRoot": str(REPO_ROOT),
        "articleCount": len(articles),
        "directCount": sum(1 for item in articles if item.source_kind == "direct"),
        "knowledgeCount": sum(1 for item in articles if item.source_kind == "knowledge"),
        "categories": sorted({item.category for item in articles}),
        "articles": [
            {
                "title": item.title,
                "category": item.category,
                "summary": item.summary,
                "sourceKind": item.source_kind,
                "sourcePath": str(item.source_path),
                "outputPath": str(item.output_path),
                "keywords": item.keywords,
            }
            for item in articles
        ],
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return articles


def sql_escape(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("\x00", "")
        .replace("\n", "\\n")
        .replace("\r", "")
        .replace("'", "\\'")
    )


def pick_cover(covers: list[str], seed_text: str) -> str:
    digest = hashlib.md5(seed_text.encode("utf-8")).hexdigest()
    index = int(digest[:8], 16) % len(covers)
    return covers[index]


def plain_content(text: str) -> str:
    cleaned = re.sub(r"(?m)^#+\s*", "", text)
    cleaned = re.sub(r"(?m)^\s*[-*]\s*", "", cleaned)
    cleaned = re.sub(r"`{1,3}", "", cleaned)
    cleaned = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", cleaned)
    cleaned = re.sub(r"\n{2,}", "\n\n", cleaned)
    return cleaned.strip()


def build_sql(articles: list[SourceArticle], covers: list[str]) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines = [
        "SET NAMES utf8mb4;",
        "START TRANSACTION;",
        "DELETE FROM sys_article WHERE ai_describe LIKE 'AUTO_IMPORT|direct|%' OR ai_describe LIKE 'AUTO_IMPORT|knowledge|%';",
    ]

    for category, sort in CATEGORY_SORT.items():
        lines.append(
            "INSERT INTO sys_category(name, sort, create_time, update_time) "
            f"SELECT '{sql_escape(category)}', {sort}, '{now}', '{now}' FROM DUAL "
            f"WHERE NOT EXISTS (SELECT 1 FROM sys_category WHERE name = '{sql_escape(category)}');"
        )

    for article in articles:
        cover = pick_cover(covers, article.title)
        marker = f"AUTO_IMPORT|{article.source_kind}|{article.source_path.relative_to(IDEA_ROOT).as_posix()}"
        content = plain_content(article.body)
        keyword_str = ",".join(article.keywords)
        lines.append(
            "INSERT INTO sys_article("
            "user_id, category_id, title, cover, summary, content, content_md, "
            "read_type, is_stick, status, is_original, is_carousel, is_recommend, "
            "original_url, quantity, keywords, ai_describe, create_time, update_time"
            ") "
            "SELECT "
            "3, id, "
            f"'{sql_escape(article.title)}', "
            f"'{sql_escape(cover)}', "
            f"'{sql_escape(article.summary[:480])}', "
            f"'{sql_escape(content)}', "
            f"'{sql_escape(article.body)}', "
            "0, 0, 0, 1, 0, 0, NULL, 0, "
            f"'{sql_escape(keyword_str)}', "
            f"'{sql_escape(marker)}', "
            f"'{now}', '{now}' "
            "FROM sys_category "
            f"WHERE name = '{sql_escape(article.category)}' LIMIT 1;"
        )

    lines.append("COMMIT;")
    return "\n".join(lines) + "\n"


def run_mysql(sql_text: str) -> None:
    cmd = [
        "wsl",
        "-d",
        "Ubuntu",
        "-u",
        "root",
        "--",
        "bash",
        "-lc",
        "docker exec -i rag-mysql mysql --default-character-set=utf8mb4 -uroot -p123456 canbe_blog",
    ]
    subprocess.run(cmd, input=sql_text.encode("utf-8"), check=True)


def fetch_cover_pool() -> list[str]:
    upload_dir = REPO_ROOT / "blog-server" / "upload"
    covers = [path.name for path in sorted(upload_dir.glob("*.jpg"))]
    if not covers:
        raise RuntimeError("未找到可用封面图，blog-server/upload 目录为空。")
    return covers


def verify_import() -> dict[str, int]:
    count_cmd = [
        "wsl",
        "-d",
        "Ubuntu",
        "-u",
        "root",
        "--",
        "bash",
        "-lc",
        "docker exec rag-mysql mysql --default-character-set=utf8mb4 -Nse "
        "\"SELECT COUNT(*) FROM sys_article WHERE ai_describe LIKE 'AUTO_IMPORT|direct|%'; "
        "SELECT COUNT(*) FROM sys_article WHERE ai_describe LIKE 'AUTO_IMPORT|knowledge|%'; "
        "SELECT COUNT(*) FROM sys_category WHERE name IN ('AI与大模型','机器学习','Python开发','Java后端','前端开发','数据库','开发运维','项目实践','知识整理');\" canbe_blog -uroot -p123456",
    ]
    result = subprocess.run(count_cmd, capture_output=True, check=True)
    stdout = result.stdout.decode("utf-8", errors="replace")
    values = [line.strip() for line in stdout.splitlines() if line.strip().isdigit()]
    direct_count, knowledge_count, category_count = (int(values[i]) for i in range(3))
    return {
        "direct_count": direct_count,
        "knowledge_count": knowledge_count,
        "category_count": category_count,
    }


def main() -> None:
    if not SOURCE_DIR.exists():
        raise RuntimeError(f"素材目录不存在: {SOURCE_DIR}")
    if not KNOWLEDGE_BASE_DIR.exists():
        raise RuntimeError(f"知识库目录不存在: {KNOWLEDGE_BASE_DIR}")

    articles = render_articles()
    covers = fetch_cover_pool()
    sql_text = build_sql(articles, covers)
    run_mysql(sql_text)
    verification = verify_import()

    direct_articles = sum(1 for item in articles if item.source_kind == "direct")
    knowledge_articles = sum(1 for item in articles if item.source_kind == "knowledge")
    print(json.dumps(
        {
            "generatedArticles": len(articles),
            "directArticles": direct_articles,
            "knowledgeArticles": knowledge_articles,
            "outputRoot": str(OUTPUT_ROOT),
            "manifest": str(MANIFEST_PATH),
            "verification": verification,
        },
        ensure_ascii=False,
        indent=2,
    ))


if __name__ == "__main__":
    main()
