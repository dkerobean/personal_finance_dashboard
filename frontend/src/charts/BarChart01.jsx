import React, { useRef, useEffect } from 'react';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

// Import utilities
import { tailwindConfig, formatValue } from '../utils/Utils';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, Legend);

function BarChart01({ data, width, height }) {
  const canvas = useRef(null);

  useEffect(() => {
    if (!data || !data.labels || !data.datasets) {
      console.error('Invalid data passed to BarChart01');
      return;
    }

    const ctx = canvas.current;
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        layout: {
          padding: {
            top: 12,
            bottom: 16,
            left: 20,
            right: 20,
          },
        },
        scales: {
          y: {
            grid: {
              drawBorder: false,
            },
            ticks: {
              maxTicksLimit: 5,
              callback: (value) => formatValue(value), // Display raw values
            },
          },
          x: {
            type: 'category',
            grid: {
              display: false,
              drawBorder: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: (context) => context[0].label, // Display the label (month)
              label: (context) => formatValue(context.parsed.y), // Display the value
            },
          },
          datalabels: {
            display: true,
            color: '#fff',
            align: 'end',
            anchor: 'end',
            formatter: (value) => formatValue(value), // Display value inside the bar
          },
        },
      },
    });

    return () => chart.destroy();
  }, [data]);

  return (
    <div className="relative">
      <canvas ref={canvas} width={width} height={height}></canvas>
    </div>
  );
}

export default BarChart01;
