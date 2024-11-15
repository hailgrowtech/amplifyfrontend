import React, { useState, useEffect } from "react";
import { PieChart, Pie, Legend, Tooltip } from "recharts";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const PieCharts = () => {
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerWidth <= 768 ? 245 : 300;
      setChartHeight(height);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PieChart width={350} height={chartHeight} className="ml-[-3rem] md:mt-0 mt-[-2rem]">
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={data01}
        cx={200}
        cy={150}
        outerRadius={80}
        fill="#8884d8"
        label
      />
      <Tooltip />
    </PieChart>
  );
};

export default PieCharts;