import { useRef, useEffect, useCallback } from 'react';

// ---- Snippets with deep indentation and varied visual rhythm ----
const SNIPPETS_LONG = [
  // Heavily nested React component
  `import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TreeNode<T> {
  id: string
  label: string
  children?: TreeNode<T>[]
  expanded?: boolean
  data?: T
}

export function RecursiveTree<T>({
  nodes, depth = 0, onSelect,
}: {
  nodes: TreeNode<T>[]
  depth?: number
  onSelect?: (id: string) => void
}) {
  const [expanded, setExpanded] =
    useState<Set<string>>(new Set())

  const toggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      prev.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  return (
    <ul className="pl-4 border-l border-border">
      {nodes.map(node => {
        const isOpen = expanded.has(node.id)
        const hasChildren =
          node.children && node.children.length > 0

        return (
          <motion.li
            key={node.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="py-1"
          >
            <button
              onClick={() => {
                toggle(node.id)
                onSelect?.(node.id)
              }}
              className="flex items-center gap-2
                text-sm hover:text-accent-purple"
            >
              {hasChildren && (
                <span>{isOpen ? '▾' : '▸'}</span>
              )}
              {node.label}
            </button>
            <AnimatePresence>
              {isOpen && hasChildren && (
                <RecursiveTree
                  nodes={node.children!}
                  depth={depth + 1}
                  onSelect={onSelect}
                />
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </ul>
  )
}`,

  // API route with middleware chain
  `import { Router } from 'koa-router'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { Context, Next } from 'koa'

const router = new Router({ prefix: '/api' })

async function authMiddleware(
  ctx: Context, next: Next
) {
  const token = ctx.headers
    .authorization?.replace('Bearer ', '')
  if (!token) {
    ctx.status = 401
    ctx.body = { error: 'Unauthorized' }
    return
  }
  try {
    const payload = jwt.verify(
      token, process.env.JWT_SECRET!
    )
    ctx.state.user = payload
    await next()
  } catch {
    ctx.status = 403
    ctx.body = { error: 'Invalid token' }
  }
}

router.post('/upload', authMiddleware,
  async (ctx: Context) => {
    const file = ctx.request.files?.file
    if (!file) {
      ctx.status = 400
      ctx.body = { error: 'No file' }
      return
    }
    const chunks: Buffer[] = []
    for await (const chunk of file) {
      chunks.push(chunk)
    }
    const hash = await bcrypt.hash(
      Buffer.concat(chunks).toString(), 10
    )
    ctx.body = { hash, size: file.size }
  }
)

export default router`,

  // TypeScript generic utility types
  `type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object
      ? DeepPartial<T[K]>
      : T[K]
  }

type AsyncReturnType<
  T extends (...args: any[]) => Promise<any>
> = T extends (...args: any[]) => Promise<infer R>
  ? R : never

type Merge<A, B> = Omit<A, keyof B> & B

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

interface UseAgentOptions {
  model: 'gpt-4' | 'claude-3.5'
  temperature: number
  maxTokens: number
  stream: boolean
}

type AgentConfig = Prettify<
  Merge<
    DeepPartial<UseAgentOptions>,
    { apiKey: string; endpoint: string }
  >
>`,

  // Zustand store with middleware
  `import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface EditorStore {
  components: ComponentNode[]
  selectedId: string | null
  history: ComponentNode[][]
  historyIndex: number

  addComponent: (comp: ComponentNode) => void
  removeComponent: (id: string) => void
  updateProps: (id: string,
    props: Record<string, unknown>) => void
  undo: () => void
  redo: () => void
}

export const useEditorStore =
  create<EditorStore>()(
    devtools(
      persist(
        (set, get) => ({
          components: [],
          selectedId: null,
          history: [[]],
          historyIndex: 0,

          addComponent: (comp) =>
            set(state => {
              const next = [...state.components, comp]
              const newHistory = state.history
                .slice(0, state.historyIndex + 1)
              return {
                components: next,
                history: [...newHistory, next],
                historyIndex:
                  state.historyIndex + 1,
              }
            }),

          undo: () =>
            set(state => ({
              components:
                state.history[state.historyIndex - 1]
                  || state.components,
              historyIndex:
                Math.max(0, state.historyIndex - 1),
            })),

          redo: () =>
            set(state => ({
              components:
                state.history[state.historyIndex + 1]
                  || state.components,
              historyIndex:
                Math.min(state.history.length - 1,
                  state.historyIndex + 1),
            })),
        }),
        { name: 'editor-store' }
      )
    )
  )`,
];

const SNIPPETS_SHORT = [
  `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: { port: 5173 },
})`,

  `import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  { path: '/', element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'blog', element: <Blog /> },
      { path: 'projects',
        element: <Projects /> },
    ],
  },
])`,

  `{
  "name": "anine-digital-garden",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.460.0"
  }
}`,

  `export default {
  darkMode: 'class',
  theme: { extend: {
    colors: {
      accent: { purple: '#7C3AED' },
    },
  } },
}`,
];

// ---- Syntax tokenizer ----
type TokenType = 'keyword' | 'string' | 'type' | 'comment' | 'default';

const KEYWORDS = new Set([
  'import', 'export', 'from', 'default', 'const', 'let', 'var',
  'function', 'return', 'if', 'else', 'for', 'while', 'async', 'await',
  'try', 'catch', 'throw', 'new', 'class', 'extends', 'interface',
  'type', 'enum', 'implements', 'typeof', 'instanceof', 'void',
  'switch', 'case', 'break', 'continue', 'do', 'in', 'of',
  'public', 'private', 'protected', 'readonly', 'static', 'abstract',
  'get', 'set', 'keyof', 'infer', 'never', 'unknown', 'any',
]);

function tokenize(line: string): { text: string; type: TokenType }[] {
  const tokens: { text: string; type: TokenType }[] = [];
  const trimmed = line.trimStart();
  const leading = line.length - trimmed.length;

  if (leading > 0) {
    tokens.push({ text: ' '.repeat(leading), type: 'default' });
  }

  let rest = trimmed;
  if (rest.startsWith('//') || rest.startsWith('/*')) {
    tokens.push({ text: rest, type: 'comment' });
    return tokens;
  }

  const regex = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|([A-Z][A-Za-z0-9_]+(?:\.[A-Z][A-Za-z0-9_]+)*\b)|([a-zA-Z_$][\w$]*)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rest)) !== null) {
    // Text before token
    if (match.index > lastIndex) {
      tokens.push({
        text: rest.slice(lastIndex, match.index),
        type: 'default',
      });
    }

    const full = match[0];

    if (match[1]) {
      tokens.push({ text: full, type: 'string' });
    } else if (match[2]) {
      tokens.push({ text: full, type: 'type' });
    } else if (match[3] && KEYWORDS.has(match[3])) {
      tokens.push({ text: full, type: 'keyword' });
    } else {
      tokens.push({ text: full, type: 'default' });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < rest.length) {
    tokens.push({ text: rest.slice(lastIndex), type: 'default' });
  }

  return tokens;
}

// ---- Layer config ----
interface LayerConfig {
  fontSize: number;
  lineH: number;
  alphaMin: number;
  alphaMax: number;
  speedMin: number;
  speedMax: number;
  direction: 1 | -1; // 1=down, -1=up
  snippets: string[];
}

const LAYERS: LayerConfig[] = [
  {
    fontSize: 11, lineH: 18,
    alphaMin: 0.06, alphaMax: 0.10,
    speedMin: 0.03, speedMax: 0.06,
    direction: 1, // down
    snippets: SNIPPETS_LONG,
  },
  {
    fontSize: 13, lineH: 22,
    alphaMin: 0.10, alphaMax: 0.16,
    speedMin: 0.06, speedMax: 0.10,
    direction: -1, // up
    snippets: SNIPPETS_SHORT,
  },
  {
    fontSize: 14, lineH: 24,
    alphaMin: 0.05, alphaMax: 0.09,
    speedMin: 0.08, speedMax: 0.14,
    direction: -1, // up
    snippets: SNIPPETS_LONG,
  },
];

interface Column {
  x: number;
  y: number;
  snippet: string;
  speed: number;
  alpha: number;
  layer: number;
}

function getTypeColor(type: TokenType, alpha: number, isDark: boolean): string {
  const colors: Record<TokenType, [number, number, number]> = {
    keyword: [139, 92, 246],   // purple
    string:  [6, 182, 212],    // cyan
    type:    [59, 130, 246],   // blue
    comment: isDark ? [100, 110, 130] : [140, 150, 170],
    default: isDark ? [148, 163, 184] : [100, 110, 125],
  };
  const [r, g, b] = colors[type];
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

// ---- Component ----
export function CodeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const themeRef = useRef(true);

  const initColumns = useCallback((width: number, height: number) => {
    const cols: Column[] = [];

    for (let layerIdx = 0; layerIdx < LAYERS.length; layerIdx++) {
      const cfg = LAYERS[layerIdx];
      const columnsPerLayer = Math.floor(width / 220) + 2;
      const gap = width / columnsPerLayer;

      for (let c = 0; c < columnsPerLayer; c++) {
        const snippet = cfg.snippets[c % cfg.snippets.length];
        const lines = snippet.split('\n');
        const totalH = lines.length * cfg.lineH;
        cols.push({
          x: gap * c + (Math.random() - 0.5) * 60,
          y: Math.random() * height - totalH * 0.3,
          snippet,
          speed: cfg.speedMin + Math.random() * (cfg.speedMax - cfg.speedMin),
          alpha: cfg.alphaMin + Math.random() * (cfg.alphaMax - cfg.alphaMin),
          layer: layerIdx,
        });
      }
    }
    columnsRef.current = cols;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    function isDark() {
      return !document.documentElement.classList.contains('light');
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initColumns(canvas!.width, canvas!.height);
    }

    resize();
    window.addEventListener('resize', resize);

    const observer = new MutationObserver(() => {
      themeRef.current = isDark();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    themeRef.current = isDark();

    // Pre-tokenize all lines
    const tokenCache = new Map<string, { text: string; type: TokenType }[]>();
    function getTokens(line: string) {
      if (tokenCache.has(line)) return tokenCache.get(line)!;
      const tokens = tokenize(line);
      tokenCache.set(line, tokens);
      return tokens;
    }

    function draw() {
      const dark = themeRef.current;
      const w = canvas!.width;
      const h = canvas!.height;

      ctx!.clearRect(0, 0, w, h);

      // Draw layers back to front
      for (let layerIdx = 0; layerIdx < LAYERS.length; layerIdx++) {
        const cfg = LAYERS[layerIdx];

        for (const col of columnsRef.current) {
          if (col.layer !== layerIdx) continue;

          const lines = col.snippet.split('\n');
          const totalH = lines.length * cfg.lineH;
          const fadeLines = 3;
          ctx!.font = `${cfg.fontSize}px "JetBrains Mono","Fira Code",monospace`;

          for (let i = 0; i < lines.length; i++) {
            const ly = col.y + i * cfg.lineH;
            if (ly < -cfg.lineH || ly > h + cfg.lineH) continue;

            // Edge fading
            let effectiveAlpha = col.alpha;
            if (i < fadeLines) {
              effectiveAlpha *= (i + 1) / (fadeLines + 1);
            }
            const fromBottom = lines.length - 1 - i;
            if (fromBottom < fadeLines) {
              effectiveAlpha *= (fromBottom + 1) / (fadeLines + 1);
            }

            const tokens = getTokens(lines[i]);
            let cx = col.x;
            for (const tok of tokens) {
              ctx!.fillStyle = getTypeColor(tok.type, effectiveAlpha, dark);
              ctx!.fillText(tok.text, cx, ly);
              cx += ctx!.measureText(tok.text).width;
            }
          }

          col.y += col.speed * cfg.direction;

          // Loop
          if (cfg.direction === -1 && col.y + totalH < 0) {
            col.y = h;
          } else if (cfg.direction === 1 && col.y > h + cfg.lineH) {
            col.y = -totalH;
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [initColumns]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full pointer-events-none"
      style={{ zIndex: 0, height: '100vh' }}
    />
  );
}
