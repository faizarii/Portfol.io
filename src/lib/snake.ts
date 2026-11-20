export const COLUMNS = 24;
export const ROWS = 10;

export type Direction = 'up' | 'down' | 'left' | 'right';
export const OPPOSITE: Record<Direction, Direction> = {
  up: 'down', down: 'up', left: 'right', right: 'left',
};

export interface SnakeGame {
  columns: number;
  rows: number;
  snake: number[];
  direction: Direction;
  turns: Direction[];
  food: number | null;
  status: 'ready' | 'running' | 'paused' | 'over' | 'won';
}

function placeFood(snake: number[], cells: number, random: () => number): number | null {
  const free = Array.from({ length: cells }, (_, cell) => cell)
    .filter(cell => !snake.includes(cell));
  return free.length ? free[Math.floor(random() * free.length)] : null;
}

export function createGame(columns = COLUMNS, rows = ROWS): SnakeGame {
  const middleRow = Math.floor(rows / 2) * columns;
  const head = middleRow + Math.floor(columns / 4);
  return {
    columns,
    rows,
    snake: [head, head - 1, head - 2],
    direction: 'right',
    turns: [],
    food: middleRow + Math.floor(columns * 2 / 3),
    status: 'ready',
  };
}

export function startGame(game: SnakeGame, requested?: Direction): SnakeGame {
  const next = game.status === 'paused' ? game : createGame(game.columns, game.rows);
  const reverse = requested === OPPOSITE[next.direction];
  const direction = reverse && game.status === 'paused' ? next.direction : requested ?? next.direction;
  return {
    ...next,
    snake: reverse && game.status !== 'paused' ? [...next.snake].reverse() : next.snake,
    direction,
    turns: requested ? [direction] : [],
    status: 'running',
  };
}

export function queueTurn(game: SnakeGame, direction: Direction): SnakeGame {
  const last = game.turns[game.turns.length - 1] ?? game.direction;
  if (game.status !== 'running' || game.turns.length >= 2 ||
    direction === last || direction === OPPOSITE[last]) return game;
  return { ...game, turns: [...game.turns, direction] };
}

export function advanceGame(
  game: SnakeGame,
  requested: Direction = game.turns[0] ?? game.direction,
  random: () => number = Math.random,
): SnakeGame {
  if (game.status !== 'running') return game;
  const { columns, rows } = game;
  const direction = requested === OPPOSITE[game.direction] ? game.direction : requested;
  const head = game.snake[0];
  const x = head % columns + (direction === 'right' ? 1 : direction === 'left' ? -1 : 0);
  const y = Math.floor(head / columns) + (direction === 'down' ? 1 : direction === 'up' ? -1 : 0);
  const next = ((y + rows) % rows) * columns + ((x + columns) % columns);
  const eating = next === game.food;
  const body = eating ? game.snake : game.snake.slice(0, -1);

  if (body.includes(next)) {
    return { ...game, direction, turns: [], status: 'over' };
  }

  const snake = [next, ...body];
  const food = eating ? placeFood(snake, columns * rows, random) : game.food;
  return { columns, rows, snake, direction, turns: game.turns.slice(1), food, status: food === null ? 'won' : 'running' };
}
