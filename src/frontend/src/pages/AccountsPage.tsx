import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, TrendingDown, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useClientAccounts } from "../hooks/useQueries";

function formatCurrency(val: number) {
  return `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function AccountsPage() {
  const { data: accounts, isLoading } = useClientAccounts();

  // Fallback demo accounts if empty
  const displayAccounts =
    accounts && accounts.length > 0
      ? accounts
      : [
          {
            id: BigInt(1),
            name: "Client Alpha",
            capital: 500000,
            pnl: 42500,
            status: "profit",
          },
          {
            id: BigInt(2),
            name: "Client Beta",
            capital: 300000,
            pnl: -8200,
            status: "loss",
          },
          {
            id: BigInt(3),
            name: "Client Gamma",
            capital: 750000,
            pnl: 91000,
            status: "profit",
          },
          {
            id: BigInt(4),
            name: "Client Delta",
            capital: 200000,
            pnl: 15600,
            status: "profit",
          },
          {
            id: BigInt(5),
            name: "Client Epsilon",
            capital: 1000000,
            pnl: -23400,
            status: "loss",
          },
        ];

  const totalCapital = displayAccounts.reduce((sum, a) => sum + a.capital, 0);
  const totalPnL = displayAccounts.reduce((sum, a) => sum + a.pnl, 0);
  const profitAccounts = displayAccounts.filter(
    (a) => a.status === "profit",
  ).length;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/"
            data-ocid="accounts.back.link"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 border border-primary/30">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">
                Client Accounts
              </h1>
              <p className="text-sm text-muted-foreground">
                Performance overview for all managed accounts
              </p>
            </div>
          </div>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
        >
          <Card className="bg-card border-border glow-amber">
            <CardContent className="p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Total Capital
              </p>
              <p className="font-mono font-bold text-2xl text-primary tabular-nums">
                {formatCurrency(totalCapital)}
              </p>
            </CardContent>
          </Card>
          <Card
            className={`bg-card border-border ${totalPnL >= 0 ? "glow-green" : "glow-red"}`}
          >
            <CardContent className="p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Total PnL
              </p>
              <p
                className={`font-mono font-bold text-2xl tabular-nums ${totalPnL >= 0 ? "text-success" : "text-destructive"}`}
              >
                {totalPnL >= 0 ? "+" : ""}
                {formatCurrency(totalPnL)}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Profitable Accounts
              </p>
              <p className="font-mono font-bold text-2xl text-success tabular-nums">
                {profitAccounts} / {displayAccounts.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Accounts table / cards */}
        <Card className="bg-card border-border" data-ocid="accounts.table">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-display">
              Account Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : displayAccounts.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 text-center"
                data-ocid="accounts.empty_state"
              >
                <Users className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No accounts yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Add accounts from the Admin Panel
                </p>
              </div>
            ) : (
              <>
                {/* Desktop table header */}
                <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-2 border-b border-border text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  <span className="col-span-2">Account</span>
                  <span className="text-right">Capital</span>
                  <span className="text-right">PnL</span>
                  <span className="text-center">Status</span>
                </div>
                <div className="divide-y divide-border">
                  {displayAccounts.map((account, i) => (
                    <motion.div
                      key={String(account.id)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      data-ocid={`accounts.item.${i + 1}`}
                      className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors"
                    >
                      {/* Name */}
                      <div className="col-span-2 sm:col-span-2 flex items-center gap-2">
                        <div
                          className={`h-8 w-8 rounded flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                            account.status === "profit"
                              ? "bg-success/15 text-success"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {account.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm text-foreground truncate">
                          {account.name}
                        </span>
                      </div>

                      {/* Capital */}
                      <div className="sm:text-right">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          Capital:{" "}
                        </span>
                        <span className="font-mono text-sm text-foreground">
                          {formatCurrency(account.capital)}
                        </span>
                      </div>

                      {/* PnL */}
                      <div className="sm:text-right">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          PnL:{" "}
                        </span>
                        <span
                          className={`font-mono text-sm font-semibold ${
                            account.pnl >= 0
                              ? "text-success"
                              : "text-destructive"
                          }`}
                        >
                          {account.pnl >= 0 ? "+" : ""}
                          {formatCurrency(account.pnl)}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="sm:text-center flex sm:justify-center items-center">
                        <Badge
                          className={
                            account.status === "profit"
                              ? "bg-success/15 text-success border-success/30 hover:bg-success/20"
                              : "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20"
                          }
                          variant="outline"
                        >
                          {account.status === "profit" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {account.status === "profit" ? "Profit" : "Loss"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
