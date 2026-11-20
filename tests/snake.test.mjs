import assert from 'node:assert/strict';
import { test } from 'node:test';
import { advanceGame, createGame, startGame, queueTurn, COLUMNS, ROWS } from '../src/lib/snake.ts';

const running = (changes = {}) => ({ ...createGame(), status: 'running', ...changes });

test('moves, ignores reversal, and leaves inactive games unchanged', () => {
  const initial = createGame();
  assert.equal(advanceGame(initial), initial);
  assert.deepEqual(advanceGame(running()).snake, [127, 126, 125]);
  assert.equal(advanceGame(running(), 'left').snake[0], 127);
  assert.equal(advanceGame(running(), 'up').snake[0], 102);
  for (const status of ['paused', 'over', 'won']) {
    const game = running({ status });
    assert.equal(advanceGame(game), game);
  }
});

test('food grows the snake and respawns only on an empty cell', () => {
  const next = advanceGame(running({ food: 127 }), 'right', () => 0);
  assert.deepEqual(next.snake, [127, 126, 125, 124]);
  assert.equal(next.food, 0);
  assert.ok(!next.snake.includes(next.food));
});

test('all four edges wrap to the opposite side', () => {
  for (const [head, direction, expected] of [
    [47, 'right', 24], [24, 'left', 47], [5, 'up', 221], [221, 'down', 5],
  ]) {
    const next = advanceGame(running({ snake: [head], direction }));
    assert.equal(next.status, 'running');
    assert.equal(next.snake[0], expected);
  }
});

test('body collisions, including across an edge, end the game', () => {
  assert.equal(advanceGame(running({ snake: [25, 26, 50, 49], direction: 'up' }), 'right').status, 'over');
  const ended = advanceGame(running({ snake: [47, 46, 24, 25] }));
  assert.equal(ended.status, 'over');
  assert.equal(ended.snake.length - 3, 1);
  assert.equal(startGame(ended).snake.length - 3, 0);
});

test('the snake can enter the cell its tail is leaving', () => {
  const next = advanceGame(running({ snake: [25, 26, 50, 49], direction: 'left' }), 'down');
  assert.equal(next.status, 'running');
  assert.deepEqual(next.snake, [49, 25, 26, 50]);
});

test('filling the board wins without trying to place more food', () => {
  const snake = Array.from({ length: COLUMNS * ROWS - 1 }, (_, index) => index);
  const final = advanceGame(running({
    snake: [238, ...snake.filter(cell => cell !== 238)],
    direction: 'right',
    food: 239,
  }));
  assert.equal(final.status, 'won');
  assert.equal(final.food, null);
  assert.equal(final.snake.length, COLUMNS * ROWS);
});

test('responsive board sizes keep movement, food, and collisions within the field', () => {
  for (const [columns, rows] of [[16, 13], [72, 22]]) {
    const game = { ...createGame(columns, rows), status: 'running' };
    assert.equal(new Set(game.snake).size, 3);
    assert.ok(!game.snake.includes(game.food));
    assert.ok(game.snake.every(cell => cell >= 0 && cell < columns * rows));
    assert.equal(advanceGame(game, 'up').snake[0], game.snake[0] - columns);
    const grown = advanceGame({ ...game, food: game.snake[0] + 1 }, 'right', () => 0.99);
    assert.ok(grown.food >= 0 && grown.food < columns * rows);
    assert.ok(!grown.snake.includes(grown.food));
    assert.equal(advanceGame({ ...game, snake: [columns - 1] }).snake[0], 0);
  }
});

test('a direction key starts a new round in any direction without reversing into its body', () => {
  for (const direction of ['up', 'down', 'left', 'right']) {
    const game = startGame(createGame(), direction);
    assert.equal(game.status, 'running');
    assert.equal(game.direction, direction);
    assert.equal(advanceGame(game).status, 'running');
  }
});

test('resuming preserves the round and rejects reversal; restarting resets the round', () => {
  const paused = running({ status: 'paused', snake: [126, 125, 124, 123], food: 0 });
  const resumed = startGame(paused, 'left');
  assert.deepEqual(resumed.snake, paused.snake);
  assert.equal(resumed.food, 0);
  assert.equal(resumed.direction, 'right');
  assert.equal(resumed.status, 'running');
  assert.deepEqual(startGame({ ...paused, status: 'over' }), { ...createGame(), status: 'running' });
});

test('quick up then right inputs execute on consecutive steps', () => {
  const queued = queueTurn(queueTurn(running(), 'up'), 'right');
  assert.deepEqual(queued.turns, ['up', 'right']);
  const first = advanceGame(queued);
  assert.equal(first.direction, 'up');
  assert.equal(first.snake[0], 102);
  assert.deepEqual(first.turns, ['right']);
  const second = advanceGame(first);
  assert.equal(second.direction, 'right');
  assert.equal(second.snake[0], 103);
  assert.deepEqual(second.turns, []);
});

test('queued turns reject duplicates and reversals without losing valid inputs', () => {
  const initial = running();
  assert.equal(queueTurn(initial, 'right'), initial);
  assert.equal(queueTurn(initial, 'left'), initial);
  const up = queueTurn(initial, 'up');
  assert.equal(queueTurn(up, 'up'), up);
  assert.equal(queueTurn(up, 'down'), up);
  const left = queueTurn(up, 'left');
  assert.deepEqual(left.turns, ['up', 'left']);
  assert.equal(queueTurn(left, 'down'), left);
  assert.equal(advanceGame(advanceGame(left)).direction, 'left');
});

test('inputs immediately after starting are retained, while resuming clears old turns', () => {
  const started = startGame(createGame(), 'up');
  const queued = queueTurn(started, 'right');
  assert.deepEqual(queued.turns, ['up', 'right']);
  assert.equal(advanceGame(queued).direction, 'up');
  assert.equal(advanceGame(advanceGame(queued)).direction, 'right');
  assert.deepEqual(startGame({ ...queueTurn(started, 'right'), status: 'paused' }).turns, []);
  for (const status of ['ready', 'paused', 'over', 'won']) {
    const game = { ...createGame(), status };
    assert.equal(queueTurn(game, 'up'), game);
  }
});
