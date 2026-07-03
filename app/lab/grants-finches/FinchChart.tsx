"use client";

import { CATEGORY_COLORS, type CausalSection, type YearPoint } from "./data";
import styles from "./grants-finches.module.css";

const WIDTH = 900;
const HEIGHT = 220;
const PAD_LEFT = 46;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

type FinchChartProps = {
  label: string;
  unit: string;
  points: YearPoint[];
  sections: CausalSection[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
};

export default function FinchChart({
  label,
  unit,
  points,
  sections,
  activeSectionId,
  onSelectSection,
}: FinchChartProps) {
  const years = points.map((p) => p.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const values = points.map((p) => p.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valuePad = (maxValue - minValue) * 0.12 || 0.1;
  const yMin = minValue - valuePad;
  const yMax = maxValue + valuePad;

  const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xForYear = (year: number) =>
    PAD_LEFT + ((year - minYear) / (maxYear - minYear)) * plotWidth;
  const yForValue = (value: number) =>
    PAD_TOP + (1 - (value - yMin) / (yMax - yMin)) * plotHeight;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xForYear(p.year).toFixed(2)},${yForValue(p.value).toFixed(2)}`)
    .join(" ");

  const yearTicks: number[] = [];
  for (let y = Math.ceil(minYear / 5) * 5; y <= maxYear; y += 5) {
    yearTicks.push(y);
  }

  return (
    <div className={styles.chartBlock}>
      <div className={styles.chartHeader}>
        <span className={styles.chartLabel}>{label}</span>
        <span className={styles.chartUnit}>{unit}</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={styles.chartSvg}
        role="img"
        aria-label={`${label} by year, 1973 to 2012, divided into clickable causal sections`}
      >
        {sections.map((section) => {
          const x1 = xForYear(Math.max(section.startYear, minYear));
          const x2 = xForYear(Math.min(section.endYear, maxYear));
          const isActive = section.id === activeSectionId;
          return (
            <rect
              key={section.id}
              x={x1}
              y={PAD_TOP}
              width={Math.max(x2 - x1, 0)}
              height={plotHeight}
              fill={CATEGORY_COLORS[section.category]}
              opacity={isActive ? 0.32 : 0.14}
              stroke={isActive ? CATEGORY_COLORS[section.category] : "transparent"}
              strokeWidth={isActive ? 2 : 0}
              className={styles.chartSection}
              onClick={() => onSelectSection(section.id)}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              aria-label={`${section.title}, ${section.startYear} to ${section.endYear}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSection(section.id);
                }
              }}
            />
          );
        })}

        {yearTicks.map((year) => (
          <g key={year}>
            <line
              x1={xForYear(year)}
              x2={xForYear(year)}
              y1={PAD_TOP}
              y2={PAD_TOP + plotHeight}
              stroke="rgba(29, 42, 36, 0.12)"
              strokeWidth={1}
            />
            <text
              x={xForYear(year)}
              y={HEIGHT - 8}
              fontSize={10}
              textAnchor="middle"
              fill="var(--foreground)"
              opacity={0.55}
            >
              {year}
            </text>
          </g>
        ))}

        <text x={4} y={yForValue(yMax) + 4} fontSize={10} fill="var(--foreground)" opacity={0.55}>
          {maxValue.toFixed(2)}
        </text>
        <text x={4} y={yForValue(yMin) + 4} fontSize={10} fill="var(--foreground)" opacity={0.55}>
          {minValue.toFixed(2)}
        </text>

        <path d={linePath} fill="none" stroke="var(--foreground)" strokeWidth={2} />
        {points.map((p) => (
          <circle
            key={p.year}
            cx={xForYear(p.year)}
            cy={yForValue(p.value)}
            r={1.6}
            fill="var(--foreground)"
          />
        ))}
      </svg>
    </div>
  );
}
