import React, { useEffect, useState } from 'react';
import PathVisualization from './utils/PathVisualization';
import { optimizePoints, generateRandomPoints } from './utils/pathOptimizer';

const OptimalPathEstimation = () => {
  const [optimizedPoints, setOptimizedPoints] = useState([]);
  const numPointsToOptimize = 30;
  const [startPoint, setStartPoint] = useState({ x: 1, y: 1});
  const [endPoint, setEndPoint] = useState({ x: 8, y: -6});
  const [obstacles, setObstacles] = useState([{type: 'circle', x: 5, y: 5, radius: 1}, {type: 'circle', x: -5, y: 5, radius: 2}]);
  const [needOptimization, setNeedOptimization] = useState(false);
  const distancePenaltyWeight = 10.0;

  useEffect(() => {
    const randomPoints = generateRandomPoints(numPointsToOptimize);
    setOptimizedPoints(randomPoints);
  }, []);

  // Functions to update the start and end points
  const updateStartPoint = (newStartPoint) => {
    setStartPoint((prevStartPoint) => ({ ...prevStartPoint, ...newStartPoint }));
    setNeedOptimization(true);
  };

  const updateEndPoint = (newEndPoint) => {
    setEndPoint((prevEndPoint) => ({ ...prevEndPoint, ...newEndPoint }));
    setNeedOptimization(true);
  };

  const updateObstaclePoint = (newObstacles) => {
    console.log(newObstacles);
    setObstacles(newObstacles);
    setNeedOptimization(true);
  };


  useEffect(() => {
    if(!needOptimization){
        return;
    }

    const newPoints = optimizePoints(
      optimizedPoints,
      [startPoint.x, startPoint.y],
      [endPoint.x, endPoint.y],
      obstacles,
      numPointsToOptimize,
      distancePenaltyWeight,
    );
    setOptimizedPoints(newPoints);
    setNeedOptimization(false);
  }, [startPoint, endPoint, obstacles, optimizedPoints, needOptimization]);


  return (
    <section id="optimal-path-estimation">
      <h2>OptimalPathEstimation</h2>
      <PathVisualization pointsArray={optimizedPoints} start={startPoint} end={endPoint} obstacles={obstacles} updateStartPoint={updateStartPoint} updateEndPoint={updateEndPoint} updateObstaclePoint={updateObstaclePoint} />
    </section>
  );
};

export default OptimalPathEstimation;
