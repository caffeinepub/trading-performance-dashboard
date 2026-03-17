import { Link } from "@tanstack/react-router";
import { BarChart3, TrendingUp } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          data-ocid="nav.link"
          className="flex items-center gap-2 group"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 border border-primary/30 group-hover:border-primary/60 transition-colors">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-foreground">
            APEX<span className="text-primary">TRADE</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            data-ocid="nav.home.link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors [&.active]:text-primary [&.active]:bg-primary/10"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Performance</span>
          </Link>
          <Link
            to="/accounts"
            data-ocid="nav.accounts.link"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors [&.active]:text-primary [&.active]:bg-primary/10"
          >
            <span>Accounts</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
