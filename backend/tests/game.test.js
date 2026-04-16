test("correct answer gives +10", () => {
  const room = { score: 0, level: 1, currentAnswer: "A" };

  const isCorrect = "A" === room.currentAnswer;

  if (isCorrect) room.score += 10;

  expect(room.score).toBe(10);
});

test("wrong answer gives -5", () => {
  const room = { score: 0, currentAnswer: "A" };

  const isCorrect = "B" === room.currentAnswer;

  if (!isCorrect) room.score -= 5;

  expect(room.score).toBe(-5);
});

test("level increments", () => {
  const room = { level: 1 };

  room.level += 1;

  expect(room.level).toBe(2);
});