import React, { useEffect, useRef, useState } from 'react';
import { advanceGame, createGame, startGame, queueTurn, type Direction } from '../lib/snake';

const keys: Record<string, Direction> = {
  ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down',
  ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right',
};

export const SnakeGame: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const [game, setGame] = useState(createGame);
  const boardRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const footerVisible = useRef(false);
  const running = game.status === 'running';
  const score = game.snake.length - 3;

  useEffect(() => {
    if (!enabled) {
      setGame(previous => previous.status === 'running'
        ? { ...previous, turns: [], status: 'paused' } : previous);
      return;
    }
    if (!running) return;
    const timer = window.setInterval(() => {
      setGame(previous => advanceGame(previous));
    }, 150);
    return () => window.clearInterval(timer);
  }, [running, enabled]);

  useEffect(() => {
    const resize = new ResizeObserver(([entry]) => {
      const columns = Math.max(12, Math.floor(entry.contentRect.width / 20));
      const rows = Math.max(6, Math.floor(entry.contentRect.height / 20));
      setGame(previous => previous.columns === columns && previous.rows === rows
        ? previous : createGame(columns, rows));
    });
    if (boardRef.current) resize.observe(boardRef.current);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const pause = () => setGame(previous =>
      previous.status === 'running' ? { ...previous, turns: [], status: 'paused' } : previous);
    const onVisibilityChange = () => { if (document.hidden) pause(); };
    const observer = new IntersectionObserver(([entry]) => {
      footerVisible.current = entry.isIntersecting && entry.intersectionRatio >= 0.5;
      if (!footerVisible.current) pause();
    }, { threshold: 0.5 });
    const footer = boardRef.current?.closest('footer');
    if (footer) observer.observe(footer);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', pause);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', pause);
    };
  }, []);

  const toggleGame = () => {
    setGame(previous => {
      if (previous.status === 'running') return { ...previous, turns: [], status: 'paused' };
      return startGame(previous);
    });
    boardRef.current?.focus({ preventScroll: true });
  };

  const steer = (direction: Direction) => {
    setGame(previous => queueTurn(previous, direction));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!boardRef.current || boardRef.current.disabled || !footerVisible.current || document.hidden || event.defaultPrevented ||
        event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target !== boardRef.current &&
        target?.closest('a, button, input, textarea, select, [contenteditable], [role="textbox"]')) return;

      const direction = keys[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (direction) {
        event.preventDefault();
        if (event.repeat) return;
        setGame(previous => previous.status === 'running'
          ? queueTurn(previous, direction) : startGame(previous, direction));
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setGame(previous => previous.status === 'running'
          ? { ...previous, turns: [], status: 'paused' } : previous);
      } else if (event.key === ' ' || event.key === 'Enter') {
        if (event.repeat) {
          event.preventDefault();
        } else if (event.key === ' ' && target !== boardRef.current) {
          event.preventDefault();
          setGame(previous => previous.status === 'running'
            ? { ...previous, turns: [], status: 'paused' } : startGame(previous));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <button
      ref={boardRef}
      type="button"
      disabled={!enabled}
      aria-label={`Snake game. ${game.status}. Score: ${score}. Arrow keys or WASD to play. Click or press Space to ${running ? 'pause' : 'play'}. Swipe to steer.`}
      onClick={event => {
        if (event.detail > 0 && swipe.current?.moved) return;
        toggleGame();
      }}
      onPointerDown={event => {
        swipe.current = { x: event.clientX, y: event.clientY, moved: false };
        if (event.pointerType !== 'mouse' && running) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }}
      onPointerMove={event => {
        if (!running || event.pointerType === 'mouse' || !swipe.current) return;
        const dx = event.clientX - swipe.current.x;
        const dy = event.clientY - swipe.current.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 16) return;
        steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
        swipe.current = { x: event.clientX, y: event.clientY, moved: true };
      }}
      onPointerCancel={() => { swipe.current = null; }}
      onBlur={() => setGame(previous =>
        previous.status === 'running' ? { ...previous, turns: [], status: 'paused' } : previous)}
      className="group relative block w-full flex-1 overflow-hidden bg-transparent border-0 p-0 outline-none"
      style={{ touchAction: running ? 'none' : 'pan-y' }}
    >
      <svg
        viewBox={`0 0 ${game.columns} ${game.rows}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g opacity={game.status === 'over' ? 0.2 : 1}>
          {game.snake.map((cell, index) => (
            <rect
              key={cell}
              x={cell % game.columns + 0.06}
              y={Math.floor(cell / game.columns) + 0.06}
              width={0.88}
              height={0.88}
              rx={0.12}
              fill={index === 0 ? '#FFFFFF' : '#FFE500'}
            />
          ))}
          {game.food !== null && (
            <circle
              cx={game.food % game.columns + 0.5}
              cy={Math.floor(game.food / game.columns) + 0.5}
              r={0.3}
              fill="#FFE500"
            />
          )}
        </g>
        <rect
          x={game.snake[0] % game.columns - 0.12}
          y={Math.floor(game.snake[0] / game.columns) - 0.12}
          width={1.24}
          height={1.24}
          rx={0.2}
          fill="none"
          stroke="#FFE500"
          strokeWidth={0.1}
          className="opacity-0 group-focus-visible:opacity-100"
        />
      </svg>
      {game.status === 'over' && (
        <span role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <span className="text-3xl sm:text-4xl font-bold text-[#FFE500] tabular-nums">Score: {score}</span>
          <span className="hidden sm:block text-sm text-white">Press WASD / ↑ ↓ ← → to retry</span>
          <span className="sm:hidden text-sm text-white">Tap to retry</span>
        </span>
      )}
    </button>
  );
};
