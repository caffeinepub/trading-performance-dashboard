import {
  CandlestickSeries,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
  type SeriesType,
  createChart,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { PriceData } from "../backend.d";

interface TradingChartProps {
  data: PriceData[];
  symbol: string;
  height?: number;
}

// Use literal hex/rgb for canvas drawing API (cannot resolve CSS variables)
const BG_COLOR = "#0e111a";
const TEXT_COLOR = "#94a3b8";
const AMBER_COLOR = "#d4a017";
const GRID_COLOR = "rgba(255,255,255,0.04)";
const GREEN_COLOR = "#22c55e";
const RED_COLOR = "#ef4444";
const BORDER_COLOR = "rgba(255,255,255,0.1)";

function toChartData(data: PriceData[]) {
  return data
    .map((d) => ({
      time: Number(d.time) as unknown as import("lightweight-charts").Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))
    .sort((a, b) => Number(a.time) - Number(b.time));
}

export function TradingChart({
  data,
  symbol,
  height = 320,
}: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<SeriesType> | null>(null);

  // Create chart on mount, recreate if height changes
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: BG_COLOR },
        textColor: TEXT_COLOR,
        fontFamily: "'Geist Mono', monospace",
        fontSize: 11,
      },
      width: containerRef.current.clientWidth,
      height,
      grid: {
        vertLines: { color: GRID_COLOR },
        horzLines: { color: GRID_COLOR },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: AMBER_COLOR,
          width: 1,
          style: 2,
        },
        horzLine: {
          color: AMBER_COLOR,
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: BORDER_COLOR,
      },
      timeScale: {
        borderColor: BORDER_COLOR,
        timeVisible: true,
      },
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: GREEN_COLOR,
      downColor: RED_COLOR,
      borderUpColor: GREEN_COLOR,
      borderDownColor: RED_COLOR,
      wickUpColor: GREEN_COLOR,
      wickDownColor: RED_COLOR,
    });

    seriesRef.current = candleSeries;

    // Responsive resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        chart.applyOptions({ width });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [height]);

  // Update chart data whenever data prop changes
  useEffect(() => {
    if (!seriesRef.current) return;
    if (!data || data.length === 0) return;

    const chartData = toChartData(data);
    seriesRef.current.setData(chartData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  const hasData = data && data.length > 0;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="chart-container w-full overflow-hidden"
        style={{ height }}
        data-ocid={`${symbol.toLowerCase()}.canvas_target`}
      />
      {!hasData && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-card/80 rounded"
          data-ocid={`${symbol.toLowerCase()}_chart.empty_state`}
        >
          <p className="text-muted-foreground font-mono text-sm">
            No chart data — add from Admin Panel
          </p>
        </div>
      )}
    </div>
  );
}
