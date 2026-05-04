"use client";

import type { ReactNode } from "react";

type MarkdownMessageProps = {
  content: string;
};

type Block =
  | { type: "paragraph"; lines: string[] }
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; lines: string[] }
  | { type: "code"; code: string };

const specialLinePattern = /^(\s*([-*+]\s+|\d+\.\s+|#{1,3}\s+|>\s+|```)|\s*$)/;

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-3 text-sm leading-7 break-words">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }
      if (index < lines.length) {
        index += 1;
      }
      blocks.push({ type: "code", code: codeLines.join("\n") });
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3,
        text: heading[2]
      });
      index += 1;
      continue;
    }

    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = (lines[index] ?? "").trim().match(/^[-*+]\s+(.+)$/);
        if (!item) {
          break;
        }
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      const items: string[] = [];
      while (index < lines.length) {
        const item = (lines[index] ?? "").trim().match(/^\d+\.\s+(.+)$/);
        if (!item) {
          break;
        }
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (index < lines.length) {
        const quote = (lines[index] ?? "").trim().match(/^>\s+(.+)$/);
        if (!quote) {
          break;
        }
        quoteLines.push(quote[1]);
        index += 1;
      }
      blocks.push({ type: "blockquote", lines: quoteLines });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && !specialLinePattern.test(lines[index] ?? "")) {
      paragraphLines.push((lines[index] ?? "").trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", lines: paragraphLines });
  }

  return blocks.length ? blocks : [{ type: "paragraph", lines: [content] }];
}

function renderBlock(block: Block, index: number) {
  if (block.type === "heading") {
    const className =
      block.level === 1
        ? "text-lg font-semibold leading-7"
        : block.level === 2
          ? "text-base font-semibold leading-7"
          : "text-sm font-semibold leading-7";
    const Tag = (`h${block.level}` as "h1" | "h2" | "h3");
    return (
      <Tag key={index} className={className}>
        {renderInline(block.text)}
      </Tag>
    );
  }

  if (block.type === "ul") {
    return (
      <ul key={index} className="ml-5 list-disc space-y-1 marker:text-muted-foreground">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex} className="pl-1">
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol key={index} className="ml-5 list-decimal space-y-1 marker:text-muted-foreground">
        {block.items.map((item, itemIndex) => (
          <li key={itemIndex} className="pl-1">
            {renderInline(item)}
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote key={index} className="border-l-2 border-border pl-3 text-muted-foreground">
        {block.lines.map((line, lineIndex) => (
          <p key={lineIndex}>{renderInline(line)}</p>
        ))}
      </blockquote>
    );
  }

  if (block.type === "code") {
    return (
      <pre key={index} className="max-w-full overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs leading-6">
        <code>{block.code}</code>
      </pre>
    );
  }

  return (
    <p key={index} className="whitespace-pre-wrap">
      {renderInline(block.lines.join("\n"))}
    </p>
  );
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const value = match[0];
    if (value.startsWith("**") && value.endsWith("**")) {
      nodes.push(
        <strong key={nodes.length} className="font-semibold">
          {value.slice(2, -2)}
        </strong>
      );
    } else if (value.startsWith("`") && value.endsWith("`")) {
      nodes.push(
        <code key={nodes.length} className="rounded bg-muted px-1.5 py-0.5 text-xs">
          {value.slice(1, -1)}
        </code>
      );
    } else {
      const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = link?.[2] ?? "";
      if (link && isSafeHref(href)) {
        nodes.push(
          <a
            key={nodes.length}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#3F3FF3] underline underline-offset-4"
          >
            {link[1]}
          </a>
        );
      } else {
        nodes.push(value);
      }
    }

    lastIndex = match.index + value.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function isSafeHref(href: string) {
  return href.startsWith("https://") || href.startsWith("http://") || href.startsWith("mailto:");
}
