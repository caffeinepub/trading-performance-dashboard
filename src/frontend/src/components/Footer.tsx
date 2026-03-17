import { AlertTriangle } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      {/* Disclaimer */}
      <div className="bg-destructive/5 border-b border-destructive/20 px-4 py-3">
        <div className="container mx-auto flex items-start gap-2.5 max-w-4xl">
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-destructive/80">
              Risk Disclaimer:
            </span>{" "}
            Trading involves risk. Profits and losses are subject to market
            conditions. Past performance does not guarantee future results. All
            performance data displayed is for informational purposes only and
            does not constitute financial advice.
          </p>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-mono">APEX</span>
          <span className="text-xs text-primary font-mono">TRADE</span>
          <span className="text-xs text-muted-foreground">
            — Trading Performance Dashboard
          </span>
        </div>
        <p className="text-xs text-muted-foreground">© {year}</p>
      </div>
    </footer>
  );
}
