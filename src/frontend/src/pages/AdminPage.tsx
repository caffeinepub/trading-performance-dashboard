import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronDown,
  Edit2,
  Loader2,
  LogIn,
  LogOut,
  PlusCircle,
  Save,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  ClientAccount,
  InstrumentStats,
  PerformanceMetrics,
  PriceData,
} from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddClientAccount,
  useClientAccounts,
  useDeleteClientAccount,
  useEditClientAccount,
  useInstrumentStats,
  useIsAdmin,
  usePerformanceMetrics,
  useUpdateInstrumentStats,
  useUpdatePerformanceMetrics,
} from "../hooks/useQueries";

// ── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className="w-full max-w-sm bg-card border-border glow-amber"
          data-ocid="admin.modal"
        >
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Shield className="h-7 w-7 text-primary" />
              </div>
            </div>
            <CardTitle className="font-display text-xl">Admin Access</CardTitle>
            <CardDescription>
              Login with Internet Identity to manage trading performance data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              onClick={login}
              disabled={isLoggingIn}
              data-ocid="admin.login.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login with Internet Identity
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Only authorized administrators can access this panel.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── Not Admin Screen ──────────────────────────────────────────────────────────

function NotAdminScreen() {
  const { clear } = useInternetIdentity();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card
        className="w-full max-w-sm bg-card border-border glow-red"
        data-ocid="admin.error_state"
      >
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="h-14 w-14 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center justify-center">
              <X className="h-7 w-7 text-destructive" />
            </div>
          </div>
          <CardTitle className="font-display text-xl">Access Denied</CardTitle>
          <CardDescription>
            Your account does not have admin privileges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={clear}
            data-ocid="admin.logout.button"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Performance Tab ───────────────────────────────────────────────────────────

function PerformanceTab() {
  const { data: metrics, isLoading } = usePerformanceMetrics();
  const updateMutation = useUpdatePerformanceMetrics();

  const [form, setForm] = useState({
    overallPnL: "",
    winRatio: "",
    totalTrades: "",
    monthlyPnL: "",
  });

  useEffect(() => {
    if (metrics) {
      setForm({
        overallPnL: String(metrics.overallPnL),
        winRatio: String(metrics.winRatio),
        totalTrades: String(metrics.totalTrades),
        monthlyPnL: String(metrics.monthlyPnL),
      });
    }
  }, [metrics]);

  const handleSave = () => {
    const updated: PerformanceMetrics = {
      overallPnL: Number.parseFloat(form.overallPnL) || 0,
      winRatio: Number.parseFloat(form.winRatio) || 0,
      totalTrades: BigInt(Number.parseInt(form.totalTrades, 10) || 0),
      monthlyPnL: Number.parseFloat(form.monthlyPnL) || 0,
      lastUpdated: BigInt(Date.now()),
    };

    updateMutation.mutate(updated, {
      onSuccess: () => toast.success("Performance metrics saved!"),
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="performance.panel">
      <div>
        <h3 className="font-display font-semibold text-base mb-1">
          Overall Performance
        </h3>
        <p className="text-sm text-muted-foreground">
          Update the main metrics shown on the public dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="overallPnL" className="text-sm font-mono">
            Overall PnL (₹)
          </Label>
          <Input
            id="overallPnL"
            type="number"
            value={form.overallPnL}
            onChange={(e) =>
              setForm((p) => ({ ...p, overallPnL: e.target.value }))
            }
            placeholder="e.g. 150000"
            className="font-mono bg-input border-border"
            data-ocid="performance.overall_pnl.input"
          />
          <p className="text-xs text-muted-foreground">Use negative for loss</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="winRatio" className="text-sm font-mono">
            Win Ratio (%)
          </Label>
          <Input
            id="winRatio"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={form.winRatio}
            onChange={(e) =>
              setForm((p) => ({ ...p, winRatio: e.target.value }))
            }
            placeholder="e.g. 68.5"
            className="font-mono bg-input border-border"
            data-ocid="performance.win_ratio.input"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="totalTrades" className="text-sm font-mono">
            Total Trades
          </Label>
          <Input
            id="totalTrades"
            type="number"
            min="0"
            value={form.totalTrades}
            onChange={(e) =>
              setForm((p) => ({ ...p, totalTrades: e.target.value }))
            }
            placeholder="e.g. 342"
            className="font-mono bg-input border-border"
            data-ocid="performance.total_trades.input"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="monthlyPnL" className="text-sm font-mono">
            Monthly PnL (₹)
          </Label>
          <Input
            id="monthlyPnL"
            type="number"
            value={form.monthlyPnL}
            onChange={(e) =>
              setForm((p) => ({ ...p, monthlyPnL: e.target.value }))
            }
            placeholder="e.g. 28000"
            className="font-mono bg-input border-border"
            data-ocid="performance.monthly_pnl.input"
          />
          <p className="text-xs text-muted-foreground">Use negative for loss</p>
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={updateMutation.isPending}
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-6"
        data-ocid="performance.save.primary_button"
      >
        {updateMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Performance
          </>
        )}
      </Button>

      {updateMutation.isSuccess && (
        <p
          className="text-sm text-success flex items-center gap-1.5"
          data-ocid="performance.success_state"
        >
          <Check className="h-4 w-4" /> Saved successfully
        </p>
      )}
    </div>
  );
}

// ── Instrument Tab ────────────────────────────────────────────────────────────

interface ChartRowForm {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface InstrumentFormProps {
  symbol: string;
  displayName: string;
}

function InstrumentForm({ symbol, displayName }: InstrumentFormProps) {
  const { data: stats, isLoading } = useInstrumentStats(symbol);
  const updateMutation = useUpdateInstrumentStats();

  const [form, setForm] = useState({
    scalps: "",
    wins: "",
    losses: "",
    weeklyPnL: "",
  });

  const [chartRows, setChartRows] = useState<ChartRowForm[]>([]);
  const [showChartEditor, setShowChartEditor] = useState(false);
  const [newRow, setNewRow] = useState<ChartRowForm>({
    time: "",
    open: "",
    high: "",
    low: "",
    close: "",
  });

  useEffect(() => {
    if (stats) {
      setForm({
        scalps: String(stats.scalps),
        wins: String(stats.wins),
        losses: String(stats.losses),
        weeklyPnL: String(stats.weeklyPnL),
      });
      setChartRows(
        stats.chartData.map((d) => ({
          time: String(d.time),
          open: String(d.open),
          high: String(d.high),
          low: String(d.low),
          close: String(d.close),
        })),
      );
    }
  }, [stats]);

  const handleSave = () => {
    const updated: InstrumentStats = {
      symbol,
      scalps: BigInt(Number.parseInt(form.scalps, 10) || 0),
      wins: BigInt(Number.parseInt(form.wins, 10) || 0),
      losses: BigInt(Number.parseInt(form.losses, 10) || 0),
      weeklyPnL: Number.parseFloat(form.weeklyPnL) || 0,
      chartData: chartRows
        .filter((r) => r.time && r.open && r.close)
        .map(
          (r): PriceData => ({
            time: BigInt(Number.parseInt(r.time, 10)),
            open: Number.parseFloat(r.open),
            high: Number.parseFloat(r.high),
            low: Number.parseFloat(r.low),
            close: Number.parseFloat(r.close),
          }),
        ),
    };

    updateMutation.mutate(
      { symbol, stats: updated },
      {
        onSuccess: () => toast.success(`${symbol} stats saved!`),
        onError: (err) => toast.error(`Failed: ${err.message}`),
      },
    );
  };

  const addChartRow = () => {
    if (!newRow.time || !newRow.open || !newRow.close) {
      toast.error("Time, Open, and Close are required");
      return;
    }
    setChartRows((prev) => [...prev, { ...newRow }]);
    setNewRow({ time: "", open: "", high: "", low: "", close: "" });
  };

  const removeChartRow = (index: number) => {
    setChartRows((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="space-y-5 pb-6 border-b border-border last:border-0">
      <h4 className="font-display font-semibold text-sm text-primary uppercase tracking-wider">
        {displayName} ({symbol})
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-mono">Scalps</Label>
          <Input
            type="number"
            value={form.scalps}
            onChange={(e) => setForm((p) => ({ ...p, scalps: e.target.value }))}
            className="font-mono bg-input border-border"
            data-ocid={`${symbol.toLowerCase()}.scalps.input`}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-mono">Wins</Label>
          <Input
            type="number"
            value={form.wins}
            onChange={(e) => setForm((p) => ({ ...p, wins: e.target.value }))}
            className="font-mono bg-input border-border"
            data-ocid={`${symbol.toLowerCase()}.wins.input`}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-mono">Losses</Label>
          <Input
            type="number"
            value={form.losses}
            onChange={(e) => setForm((p) => ({ ...p, losses: e.target.value }))}
            className="font-mono bg-input border-border"
            data-ocid={`${symbol.toLowerCase()}.losses.input`}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-mono">Weekly PnL (₹)</Label>
          <Input
            type="number"
            value={form.weeklyPnL}
            onChange={(e) =>
              setForm((p) => ({ ...p, weeklyPnL: e.target.value }))
            }
            className="font-mono bg-input border-border"
            data-ocid={`${symbol.toLowerCase()}.weekly_pnl.input`}
          />
        </div>
      </div>

      {/* Chart data editor toggle */}
      <div>
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShowChartEditor((v) => !v)}
          data-ocid={`${symbol.toLowerCase()}.chart.toggle`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showChartEditor ? "rotate-180" : ""}`}
          />
          Chart Data ({chartRows.length} candles)
        </button>

        {showChartEditor && (
          <div className="mt-3 space-y-3">
            {/* Existing rows */}
            {chartRows.length > 0 && (
              <div className="border border-border rounded overflow-hidden">
                <div className="grid grid-cols-6 gap-2 px-3 py-2 bg-muted/40 text-xs font-mono uppercase text-muted-foreground">
                  <span>Time (unix)</span>
                  <span>Open</span>
                  <span>High</span>
                  <span>Low</span>
                  <span>Close</span>
                  <span />
                </div>
                <div className="divide-y divide-border max-h-48 overflow-y-auto">
                  {chartRows.map((row, i) => (
                    <div
                      key={`${row.time}-${i}`}
                      className="grid grid-cols-6 gap-2 px-3 py-2 text-xs font-mono"
                      data-ocid={`${symbol.toLowerCase()}.chart.item.${i + 1}`}
                    >
                      <span className="text-muted-foreground truncate">
                        {row.time}
                      </span>
                      <span>{row.open}</span>
                      <span className="text-success">{row.high}</span>
                      <span className="text-destructive">{row.low}</span>
                      <span>{row.close}</span>
                      <button
                        type="button"
                        onClick={() => removeChartRow(i)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-ocid={`${symbol.toLowerCase()}.chart.delete_button.${i + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new row */}
            <div className="grid grid-cols-5 gap-2">
              <Input
                placeholder="Unix time"
                value={newRow.time}
                onChange={(e) =>
                  setNewRow((p) => ({ ...p, time: e.target.value }))
                }
                className="font-mono text-xs bg-input border-border"
                data-ocid={`${symbol.toLowerCase()}.chart_time.input`}
              />
              <Input
                placeholder="Open"
                value={newRow.open}
                onChange={(e) =>
                  setNewRow((p) => ({ ...p, open: e.target.value }))
                }
                className="font-mono text-xs bg-input border-border"
                data-ocid={`${symbol.toLowerCase()}.chart_open.input`}
              />
              <Input
                placeholder="High"
                value={newRow.high}
                onChange={(e) =>
                  setNewRow((p) => ({ ...p, high: e.target.value }))
                }
                className="font-mono text-xs bg-input border-border"
              />
              <Input
                placeholder="Low"
                value={newRow.low}
                onChange={(e) =>
                  setNewRow((p) => ({ ...p, low: e.target.value }))
                }
                className="font-mono text-xs bg-input border-border"
              />
              <Input
                placeholder="Close"
                value={newRow.close}
                onChange={(e) =>
                  setNewRow((p) => ({ ...p, close: e.target.value }))
                }
                className="font-mono text-xs bg-input border-border"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={addChartRow}
              className="border-border"
              data-ocid={`${symbol.toLowerCase()}.chart.secondary_button`}
            >
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Add Candle
            </Button>
          </div>
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={updateMutation.isPending}
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        data-ocid={`${symbol.toLowerCase()}.save.primary_button`}
      >
        {updateMutation.isPending ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Save className="mr-2 h-3.5 w-3.5" />
        )}
        Save {symbol}
      </Button>
    </div>
  );
}

function InstrumentsTab() {
  return (
    <div className="space-y-6" data-ocid="instruments.panel">
      <div>
        <h3 className="font-display font-semibold text-base mb-1">
          Instrument Statistics
        </h3>
        <p className="text-sm text-muted-foreground">
          Update stats and chart data for each traded instrument.
        </p>
      </div>
      <InstrumentForm symbol="XAUUSD" displayName="Gold / USD" />
      <InstrumentForm symbol="USOIL" displayName="US Crude Oil" />
    </div>
  );
}

// ── Accounts Tab ──────────────────────────────────────────────────────────────

interface AccountFormData {
  name: string;
  capital: string;
  pnl: string;
  status: string;
}

const emptyAccountForm = (): AccountFormData => ({
  name: "",
  capital: "",
  pnl: "",
  status: "profit",
});

function AccountsTab() {
  const { data: accounts, isLoading } = useClientAccounts();
  const addMutation = useAddClientAccount();
  const editMutation = useEditClientAccount();
  const deleteMutation = useDeleteClientAccount();

  const [form, setForm] = useState<AccountFormData>(emptyAccountForm());
  const [editingId, setEditingId] = useState<bigint | null>(null);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Account name is required");
      return;
    }

    const accountData: ClientAccount = {
      id: editingId ?? BigInt(0),
      name: form.name.trim(),
      capital: Number.parseFloat(form.capital) || 0,
      pnl: Number.parseFloat(form.pnl) || 0,
      status: form.status,
    };

    if (editingId !== null) {
      editMutation.mutate(
        { id: editingId, account: accountData },
        {
          onSuccess: () => {
            toast.success("Account updated");
            setForm(emptyAccountForm());
            setEditingId(null);
          },
          onError: (err) => toast.error(`Failed: ${err.message}`),
        },
      );
    } else {
      addMutation.mutate(accountData, {
        onSuccess: () => {
          toast.success("Account added");
          setForm(emptyAccountForm());
        },
        onError: (err) => toast.error(`Failed: ${err.message}`),
      });
    }
  };

  const startEdit = (account: ClientAccount) => {
    setEditingId(account.id);
    setForm({
      name: account.name,
      capital: String(account.capital),
      pnl: String(account.pnl),
      status: account.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyAccountForm());
  };

  const handleDelete = (id: bigint) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast.success("Account deleted"),
      onError: (err) => toast.error(`Failed: ${err.message}`),
    });
  };

  const isPending = addMutation.isPending || editMutation.isPending;

  return (
    <div className="space-y-6" data-ocid="accounts_admin.panel">
      {/* Add/Edit form */}
      <Card className="bg-secondary/30 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-display">
            {editingId !== null ? "Edit Account" : "Add New Account"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-mono">Account Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Client Alpha"
                className="bg-input border-border"
                data-ocid="accounts_admin.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono">Capital (₹)</Label>
              <Input
                type="number"
                value={form.capital}
                onChange={(e) =>
                  setForm((p) => ({ ...p, capital: e.target.value }))
                }
                placeholder="500000"
                className="font-mono bg-input border-border"
                data-ocid="accounts_admin.capital.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono">PnL (₹)</Label>
              <Input
                type="number"
                value={form.pnl}
                onChange={(e) =>
                  setForm((p) => ({ ...p, pnl: e.target.value }))
                }
                placeholder="42500"
                className="font-mono bg-input border-border"
                data-ocid="accounts_admin.pnl.input"
              />
              <p className="text-xs text-muted-foreground">
                Use negative for loss
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-mono">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}
              >
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="accounts_admin.status.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="profit">Profit</SelectItem>
                  <SelectItem value="loss">Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="accounts_admin.submit.primary_button"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : editingId !== null ? (
                <Check className="mr-2 h-3.5 w-3.5" />
              ) : (
                <PlusCircle className="mr-2 h-3.5 w-3.5" />
              )}
              {editingId !== null ? "Update Account" : "Add Account"}
            </Button>
            {editingId !== null && (
              <Button
                variant="outline"
                size="sm"
                onClick={cancelEdit}
                className="border-border"
                data-ocid="accounts_admin.cancel.cancel_button"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator className="bg-border" />

      {/* Account list */}
      <div>
        <h3 className="font-display font-semibold text-sm mb-3">
          Current Accounts ({accounts?.length ?? 0})
        </h3>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : !accounts || accounts.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground text-sm"
            data-ocid="accounts_admin.empty_state"
          >
            No accounts added yet
          </div>
        ) : (
          <div className="space-y-2">
            {accounts.map((account, i) => (
              <motion.div
                key={String(account.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between gap-3 p-3 rounded bg-secondary/30 border border-border"
                data-ocid={`accounts_admin.item.${i + 1}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-7 w-7 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                      account.status === "profit"
                        ? "bg-success/15 text-success"
                        : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {account.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {account.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      ₹{account.capital.toLocaleString("en-IN")} capital ·{" "}
                      <span
                        className={
                          account.pnl >= 0 ? "text-success" : "text-destructive"
                        }
                      >
                        {account.pnl >= 0 ? "+" : ""}₹
                        {account.pnl.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                    onClick={() => startEdit(account)}
                    data-ocid={`accounts_admin.edit_button.${i + 1}`}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(account.id)}
                    disabled={deleteMutation.isPending}
                    data-ocid={`accounts_admin.delete_button.${i + 1}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export function AdminPage() {
  const { identity, isInitializing, clear } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing || (isLoggedIn && adminLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="flex flex-col items-center gap-3"
          data-ocid="admin.loading_state"
        >
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-mono">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  if (!isAdmin) {
    return <NotAdminScreen />;
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 border border-primary/30">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-2xl text-foreground">
                  Admin Panel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Update trading performance data
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="text-muted-foreground hover:text-destructive"
              data-ocid="admin.logout.button"
            >
              <LogOut className="mr-1.5 h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="performance" data-ocid="admin.tab">
          <TabsList className="bg-secondary/50 border border-border mb-6 w-full sm:w-auto">
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.performance.tab"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="instruments"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.instruments.tab"
            >
              Instruments
            </TabsTrigger>
            <TabsTrigger
              value="accounts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.accounts.tab"
            >
              Accounts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <PerformanceTab />
          </TabsContent>

          <TabsContent value="instruments">
            <InstrumentsTab />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountsTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
