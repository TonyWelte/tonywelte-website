import { minimize_Powell } from "optimization-js";

const generateRandomPoints = (numPoints) => {
  const xValues = Array.from(
    { length: numPoints },
    () => Math.random() * 20 - 10
  ); // Random x values between -10 and 10
  const yValues = Array.from(
    { length: numPoints },
    () => Math.random() * 20 - 10
  ); // Random y values between -10 and 10

  const randomPoints = xValues.map((x, index) => [x, yValues[index]]);

  return randomPoints;
};

const pathCost = (points, start, end, obstacles, distancePenaltyWeight) => {
  // 1. Calculate the cost based on conditions:
  //    a. First point close to start, last point close to end
  const startEndPenalty =
    distancePenaltyWeight *
    (Math.pow(points[0][0] - start[0], 2) +
      Math.pow(points[0][1] - start[1], 2) +
      Math.pow(points[points.length - 1][0] - end[0], 2) +
      Math.pow(points[points.length - 1][1] - end[1], 2));

  //    b. Minimize distances between consecutive points
  const distancePenalty =
    distancePenaltyWeight *
    points.slice(1).reduce((sum, [x, y], index) => {
      const [prevX, prevY] = points[index]; // Handle the case when index is 0
      return sum + Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2);
    }, 0);

  // Avoid obstacle
  //   const obstaclePenalty = 0.0;
  const obstaclePenalty = obstacles.reduce((sum, obstacle) => {
    if (obstacle.type === "circle") {
      return (
        sum +
        points.reduce((sum2, [x, y]) => {
          return (
            sum2 +
            Math.max(
              0.0,
              1 /
                (Math.pow(x - obstacle.x, 2) +
                  Math.pow(y - obstacle.y, 2) -
                  Math.pow(obstacle.radius, 2))
            )
          );
        }, 0)
      );
    } else {
      return 0.0;
    }
  }, 0);

  const totalCost = startEndPenalty + distancePenalty + obstaclePenalty;

  return totalCost;
};


const optimizePoints = (
  randomPoints,
  start,
  end,
  obstacles,
  numPoints,
  distancePenaltyWeight,
  iterations = 3,
  learningRate = 0.01
) => {
  let points = randomPoints;

  for (let iteration = 0; iteration < iterations; iteration++) {
    const costFunction = (p) =>
      pathCost(
        Array.from({ length: numPoints }, (_, index) => [
          p[index * 2],
          p[index * 2 + 1],
        ]),
        start,
        end,
        obstacles,
        distancePenaltyWeight
      );

    const result = minimize_Powell(costFunction, points.flat());
    console.log(result);
    points = Array.from({ length: numPoints }, (_, index) => [
      result.argument[index * 2],
      result.argument[index * 2 + 1],
    ]);

    if (iteration % 10 === 0) {
      console.log(`Iteration ${iteration + 1}, Cost: ${result.fx}`);
    }
  }

  return points;
};

export { generateRandomPoints, optimizePoints };
