import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PriceData {
    low: number;
    high: number;
    close: number;
    open: number;
    time: bigint;
}
export interface InstrumentStats {
    chartData: Array<PriceData>;
    scalps: bigint;
    weeklyPnL: number;
    wins: bigint;
    losses: bigint;
    symbol: string;
}
export interface ClientAccount {
    id: bigint;
    pnl: number;
    status: string;
    name: string;
    capital: number;
}
export interface UserProfile {
    name: string;
}
export interface PerformanceMetrics {
    totalTrades: bigint;
    winRatio: number;
    lastUpdated: bigint;
    monthlyPnL: number;
    overallPnL: number;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addClientAccount(account: ClientAccount): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteClientAccount(id: bigint): Promise<void>;
    editClientAccount(id: bigint, account: ClientAccount): Promise<void>;
    getAllClientAccounts(): Promise<Array<ClientAccount>>;
    getAllInstrumentStats(): Promise<Array<InstrumentStats>>;
    getAllInstrumentStatsSortedByScalps(): Promise<Array<InstrumentStats>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientAccount(id: bigint): Promise<ClientAccount | null>;
    getInstrumentStats(symbol: string): Promise<InstrumentStats>;
    getPerformanceMetrics(): Promise<PerformanceMetrics>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeeklyScalpSummary(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateInstrumentStats(symbol: string, stats: InstrumentStats): Promise<void>;
    updatePerformanceMetrics(metrics: PerformanceMetrics): Promise<void>;
}
