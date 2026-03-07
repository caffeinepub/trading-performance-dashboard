import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart2,
  Calendar,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { TradingChart } from "../components/TradingChart";
import {
  useInstrumentStats,
  usePerformanceMetrics,
  useWeeklyScalpSummary,
} from "../hooks/useQueries";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(val: number) {
  const abs = Math.abs(val);
  if (abs >= 100_000) {
    return `₹${(val / 100_000).toFixed(2)}L`;
  }
  return `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function formatDate(ts: bigint) {
  const ms = Number(ts);
  if (ms === 0) return "—";
  // If stored in nanoseconds (> year 2100 in ms)
  const date = new Date(ms > 1e13 ? ms / 1_000_000 : ms);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Metric Card ──────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  subLabel?: string;
  icon: React.ReactNode;
  trend?: "positive" | "negative" | "neutral";
  index: number;
  ocid: string;
}

function MetricCard({
  label,
  value,
  subLabel,
  icon,
  trend = "neutral",
  index,
  ocid,
}: MetricCardProps) {
  const trendColor =
    trend === "positive"
      ? "text-success"
      : trend === "negative"
        ? "text-destructive"
        : "text-primary";

  const glowClass =
    trend === "positive"
      ? "glow-green"
      : trend === "negative"
        ? "glow-red"
        : "glow-amber";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      data-ocid={ocid}
    >
      <Card
        className={`relative overflow-hidden scanlines ${glowClass} bg-card border-0`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              {label}
            </span>
            <div className="text-muted-foreground/50">{icon}</div>
          </div>
          <div
            className={`font-mono font-bold tabular-nums ${trendColor}`}
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", lineHeight: 1.1 }}
          >
            {value}
          </div>
          {subLabel && (
            <p className="mt-1.5 text-xs text-muted-foreground">{subLabel}</p>
          )}
        </CardContent>
        {/* Ambient glow accent line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px ${
            trend === "positive"
              ? "bg-success/40"
              : trend === "negative"
                ? "bg-destructive/40"
                : "bg-primary/40"
          }`}
        />
      </Card>
    </motion.div>
  );
}

function MetricCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5">
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-10 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

// ── Instrument Section ────────────────────────────────────────────────────────

interface InstrumentSectionProps {
  symbol: string;
  displayName: string;
  description: string;
  ocidPrefix: string;
}

function InstrumentSection({
  symbol,
  displayName,
  description,
  ocidPrefix,
}: InstrumentSectionProps) {
  const { data: stats, isLoading } = useInstrumentStats(symbol);

  const statItems = stats
    ? [
        {
          label: "Scalps",
          value: String(stats.scalps),
          icon: <Zap className="h-4 w-4" />,
          color: "text-primary",
        },
        {
          label: "Wins",
          value: String(stats.wins),
          icon: <Trophy className="h-4 w-4" />,
          color: "text-success",
        },
        {
          label: "Losses",
          value: String(stats.losses),
          icon: <XCircle className="h-4 w-4" />,
          color: "text-destructive",
        },
        {
          label: "Weekly PnL",
          value: `₹${stats.weeklyPnL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
          icon: <BarChart2 className="h-4 w-4" />,
          color: stats.weeklyPnL >= 0 ? "text-success" : "text-destructive",
        },
      ]
    : [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
      data-ocid={`${ocidPrefix}.section`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            {displayName}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Badge
          variant="outline"
          className="font-mono text-xs border-primary/40 text-primary"
        >
          {symbol}
        </Badge>
      </div>

      {/* Stats row */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statItems.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-2">
                  {stat.icon}
                  <span className="text-xs font-mono uppercase tracking-wide">
                    {stat.label}
                  </span>
                </div>
                <p
                  className={`font-mono font-bold text-2xl tabular-nums ${stat.color}`}
                >
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chart */}
      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <CardTitle className="text-sm font-mono text-muted-foreground">
              {symbol} / USD — Candlestick
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <Skeleton className="h-80 rounded-none" />
          ) : (
            <TradingChart
              data={stats?.chartData ?? []}
              symbol={symbol}
              height={320}
            />
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const { data: metrics, isLoading: metricsLoading } = usePerformanceMetrics();
  const { data: weeklyScalps } = useWeeklyScalpSummary();

  const overallPnL = metrics?.overallPnL ?? 0;
  const pnlTrend = overallPnL >= 0 ? "positive" : "negative";

  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <div className="relative border-b border-border overflow-hidden">
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.82 0.18 85) 1px, transparent 1px), linear-gradient(90deg, oklch(0.82 0.18 85) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="container mx-auto px-4 py-10 relative">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-8 bg-primary rounded-full" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest">
                Live Performance
              </span>
            </div>
            <h1
              className="font-display font-bold text-foreground"
              style={{ fontSize: "clamp(1.8rem, 5vw, 3rem)" }}
            >
              Trading Performance
              <br />
              <span className="text-primary">Dashboard</span>
            </h1>
            {metrics && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground font-mono">
                <Calendar className="h-3 w-3" />
                <span>Last updated: {formatDate(metrics.lastUpdated)}</span>
              </div>
            )}
          </motion.div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {metricsLoading ? (
              <>
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </>
            ) : (
              <>
                <MetricCard
                  label="Overall PnL"
                  value={formatCurrency(metrics?.overallPnL ?? 0)}
                  subLabel={`${(metrics?.overallPnL ?? 0) >= 0 ? "+" : ""}${(metrics?.overallPnL ?? 0).toFixed(1)}%`}
                  icon={
                    pnlTrend === "positive" ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )
                  }
                  trend={pnlTrend}
                  index={0}
                  ocid="metrics.overall_pnl.card"
                />
                <MetricCard
                  label="Win Ratio"
                  value={`${(metrics?.winRatio ?? 0).toFixed(1)}%`}
                  subLabel="Trade success rate"
                  icon={<Target className="h-5 w-5" />}
                  trend={
                    (metrics?.winRatio ?? 0) >= 50 ? "positive" : "negative"
                  }
                  index={1}
                  ocid="metrics.win_ratio.card"
                />
                <MetricCard
                  label="Total Trades"
                  value={String(metrics?.totalTrades ?? 0)}
                  subLabel="All time"
                  icon={<BarChart2 className="h-5 w-5" />}
                  trend="neutral"
                  index={2}
                  ocid="metrics.total_trades.card"
                />
                <MetricCard
                  label="Monthly PnL"
                  value={formatCurrency(metrics?.monthlyPnL ?? 0)}
                  subLabel="Current month"
                  icon={<RefreshCw className="h-5 w-5" />}
                  trend={
                    (metrics?.monthlyPnL ?? 0) >= 0 ? "positive" : "negative"
                  }
                  index={3}
                  ocid="metrics.monthly_pnl.card"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Instruments section */}
      <div className="container mx-auto px-4 py-10 space-y-12">
        {/* XAUUSD */}
        <InstrumentSection
          symbol="XAUUSD"
          displayName="Gold / US Dollar"
          description="XAU/USD scalping performance and price action"
          ocidPrefix="xauusd"
        />

        {/* USOIL */}
        <InstrumentSection
          symbol="USOIL"
          displayName="US Crude Oil"
          description="WTI crude oil scalping performance and price action"
          ocidPrefix="usoil"
        />

        {/* Portfolio Summary */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          data-ocid="portfolio.section"
        >
          <h2 className="font-display font-bold text-xl text-foreground mb-4">
            Portfolio Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border glow-amber">
              <CardContent className="p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Total Weekly Scalps
                </p>
                <p className="font-mono font-bold text-4xl text-primary tabular-nums">
                  {weeklyScalps !== undefined ? String(weeklyScalps) : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Combined XAUUSD + USOIL
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border sm:col-span-2">
              <CardContent className="p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
                  Portfolio Health
                </p>
                <div className="space-y-2">
                  {[
                    {
                      label: "Overall Return",
                      value: `${(metrics?.overallPnL ?? 0) >= 0 ? "+" : ""}${formatCurrency(metrics?.overallPnL ?? 0)}`,
                      positive: (metrics?.overallPnL ?? 0) >= 0,
                    },
                    {
                      label: "Win Rate",
                      value: `${(metrics?.winRatio ?? 0).toFixed(1)}%`,
                      positive: (metrics?.winRatio ?? 0) >= 50,
                    },
                    {
                      label: "This Month",
                      value: `${(metrics?.monthlyPnL ?? 0) >= 0 ? "+" : ""}${formatCurrency(metrics?.monthlyPnL ?? 0)}`,
                      positive: (metrics?.monthlyPnL ?? 0) >= 0,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {row.label}
                      </span>
                      <span
                        className={`font-mono font-semibold text-sm ${
                          row.positive ? "text-success" : "text-destructive"
                        }`}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
