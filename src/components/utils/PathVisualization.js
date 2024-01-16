import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PathVisualization = ({
  pointsArray,
  start,
  end,
  obstacles,
  updateStartPoint,
  updateEndPoint,
  updateObstaclePoint,
}) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Clear previous visualization
    svg.selectAll("*").remove();

    // Set up SVG dimensions
    const width = 800;
    const height = 800;

    // Create scales for mapping data to screen coordinates
    const xScale = d3.scaleLinear().domain([-10, 10]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

    // Define marker
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowheadstart')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'green');
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowheadend')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'red');

    // Plot the points
    svg
      .selectAll("circle")
      .data(pointsArray)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 5)
      .attr("fill", "blue");
    svg
      .append("path")
      .datum([[start.x, start.y]].concat(pointsArray).concat([[end.x, end.y]]))
      .attr("fill", "none")
      .attr("class", "dotted-line")
      .attr("stroke", "grey")
      .attr(
        "d",
        d3
          .line()
          .x((d) => xScale(d[0]))
          .y((d) => yScale(d[1]))
          .defined((d) => !isNaN(d[0]) && !isNaN(d[1]))
          .curve(d3.curveLinear)
      );

    // Create circles for the start and end points
    const startCircle = svg
      .append("circle")
      .attr("cx", xScale(start.x))
      .attr("cy", yScale(start.y))
      .attr("r", 5)
      .style("fill", "green")
      .call(d3.drag().on("drag", handleDragStart));
    
    if(start.theta !== undefined) {
    svg
      .selectAll('start.arrow')
      .data([start])
      .enter()
      .append('line')
      .attr('class', 'arrow')
      .attr('x1', (d) => xScale(d.x))
      .attr('y1', (d) => yScale(d.y))
      .attr('x2', (d) => xScale(d.x + 1.0 * Math.cos(d.theta)))
      .attr('y2', (d) => yScale(d.y + 1.0 * Math.sin(d.theta)))
      .attr('marker-end', 'url(#arrowheadstart)')
      .attr('stroke', 'green')
      .attr('stroke-width', 2);
    }

    const endCircle = svg
      .append("circle")
      .attr("cx", xScale(end.x))
      .attr("cy", yScale(end.y))
      .attr("r", 5)
      .style("fill", "red")
      .call(d3.drag().on("drag", handleDragEnd));

    if(end.theta !== undefined) {
    svg
      .selectAll('end.arrow')
      .data([end])
      .enter()
      .append('line')
      .attr('class', 'arrow')
      .attr('x1', (d) => xScale(d.x))
      .attr('y1', (d) => yScale(d.y))
      .attr('x2', (d) => xScale(d.x + 1.0 * Math.cos(d.theta)))
      .attr('y2', (d) => yScale(d.y + 1.0 * Math.sin(d.theta)))
      .attr('marker-end', 'url(#arrowheadend)')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('fill', 'red');
    }


    svg
      .selectAll(".obstacle-circle")
      .data(obstacles)
      .enter()
      .append("circle")
      .attr("class", "obstacle-circle")
      .attr("cx", (obstacle) => xScale(obstacle.x))
      .attr("cy", (obstacle) => yScale(obstacle.y))
      .attr("r", (obstacle) => xScale(obstacle.radius) - xScale(0))
      .style("fill", "orange")
      .style("stroke", "black")
      .call(d3.drag().on("drag", handleDragObstacle));

    // Drag event handlers for the start point
    function handleDragStart(event) {
      // Get the current mouse position
      const [x, y] = [event.x, event.y];

      // Update the position of the start circle
      startCircle.attr("cx", x).attr("cy", y);

      // Update the start point in the parent component or state
      updateStartPoint({ x: xScale.invert(x), y: yScale.invert(y) });
    }

    // Drag event handlers for the end point
    function handleDragEnd(event) {
      console.log(event);
      // Get the current mouse position
      const [x, y] = [event.x, event.y];

      // Update the position of the end circle
      endCircle.attr("cx", x).attr("cy", y);

      // Update the end point in the parent component or state
      updateEndPoint({ x: xScale.invert(x), y: yScale.invert(y) });
    }

    // Drag event handlers for the obstacle point
    function handleDragObstacle(event, d) {
      d.x += xScale.invert(event.dx) - xScale.invert(0);
      d.y += yScale.invert(event.dy) - yScale.invert(0);

      // Update the end point in the parent component or state
      updateObstaclePoint(obstacles);
    }
  }, [
    pointsArray,
    start,
    end,
    obstacles,
    updateStartPoint,
    updateEndPoint,
    updateObstaclePoint,
  ]);

  return (
    <svg
      ref={svgRef}
      width={800}
      height={800}
      style={{ border: "solid" }}
    ></svg>
  );
};

export default PathVisualization;
