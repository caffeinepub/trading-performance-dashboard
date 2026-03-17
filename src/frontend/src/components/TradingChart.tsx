import { useEffect, useRef } from "react";

// ── Global TradingView type declaration ────────────────────────────────────────

declare global {
  interface Window {
    TradingView: unknown;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
  /** Data source prefix, e.g. "OANDA" or "TVC". Defaults to "OANDA". */
  source?: string;
}

export function TradingChart({
  symbol,
  height = 400,
  source = "OANDA",
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = `tradingview_${symbol}`;

  useEffect(() => {
    // Clear previous widget if any
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        // Ensure the inner div still exists (React may have re-rendered)
        if (!document.getElementById(containerId)) {
          const inner = document.createElement("div");
          inner.id = containerId;
          containerRef.current.appendChild(inner);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (window.TradingView as any).widget({
          width: "100%",
          height,
          symbol: `${source}:${symbol}`,
          interval: "60",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#0e111a",
          enable_publishing: false,
          allow_symbol_change: false,
          hide_side_toolbar: false,
          studies: [],
          container_id: containerId,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Remove the injected script tag on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Clear the widget container
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol, height, containerId, source]);

  return (
    <div
      style={{ height, width: "100%" }}
      data-ocid={`${symbol.toLowerCase()}.canvas_target`}
    >
      <div
        ref={containerRef}
        id={containerId}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
