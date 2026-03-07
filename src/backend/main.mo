import Float "mo:core/Float";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  stable let userProfiles = Map.empty<Principal, UserProfile>();

  // Performance Metrics Type
  type PerformanceMetrics = {
    overallPnL : Float;
    winRatio : Float;
    totalTrades : Nat;
    monthlyPnL : Float;
    lastUpdated : Int;
  };

  stable var performanceMetrics : PerformanceMetrics = {
    overallPnL = 0.0;
    winRatio = 0.0;
    totalTrades = 0;
    monthlyPnL = 0.0;
    lastUpdated = 0;
  };

  // Instrument Types
  type PriceData = {
    time : Int;
    open : Float;
    high : Float;
    low : Float;
    close : Float;
  };

  public type InstrumentStats = {
    symbol : Text;
    scalps : Nat;
    wins : Nat;
    losses : Nat;
    weeklyPnL : Float;
    chartData : [PriceData];
  };

  stable let instruments = Map.empty<Text, InstrumentStats>();

  // Client Account Type
  type ClientAccount = {
    id : Nat;
    name : Text;
    capital : Float;
    pnl : Float;
    status : Text;
  };

  stable let clientAccounts = Map.empty<Nat, ClientAccount>();

  // User Profile Functions (Required by Frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Performance Metrics Functions
  public shared ({ caller }) func updatePerformanceMetrics(metrics : PerformanceMetrics) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update performance metrics");
    };
    performanceMetrics := metrics;
  };

  public query func getPerformanceMetrics() : async PerformanceMetrics {
    performanceMetrics;
  };

  // Instrument Stats Functions
  public shared ({ caller }) func updateInstrumentStats(symbol : Text, stats : InstrumentStats) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update instrument stats");
    };
    instruments.add(symbol, stats);
  };

  public query func getInstrumentStats(symbol : Text) : async InstrumentStats {
    switch (instruments.get(symbol)) {
      case (?stats) { stats };
      case (null) { Runtime.trap("Instrument not found") };
    };
  };

  public query func getAllInstrumentStats() : async [InstrumentStats] {
    instruments.values().toArray();
  };

  public query func getAllInstrumentStatsSortedByScalps() : async [InstrumentStats] {
    let statsArray = instruments.values().toArray();
    statsArray.sort(
      func(a : InstrumentStats, b : InstrumentStats) : Order.Order {
        Nat.compare(b.scalps, a.scalps);
      },
    );
  };

  // Client Account Functions
  public shared ({ caller }) func addClientAccount(account : ClientAccount) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add client accounts");
    };
    clientAccounts.add(account.id, account);
  };

  public shared ({ caller }) func editClientAccount(id : Nat, account : ClientAccount) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can edit client accounts");
    };
    switch (clientAccounts.get(id)) {
      case (null) { Runtime.trap("Client account does not exist") };
      case (?_) { clientAccounts.add(id, account) };
    };
  };

  public shared ({ caller }) func deleteClientAccount(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete client accounts");
    };
    switch (clientAccounts.get(id)) {
      case (null) { Runtime.trap("Client account does not exist") };
      case (?_) { clientAccounts.remove(id) };
    };
  };

  public query func getAllClientAccounts() : async [ClientAccount] {
    clientAccounts.values().toArray();
  };

  public query func getClientAccount(id : Nat) : async ?ClientAccount {
    clientAccounts.get(id);
  };

  // Weekly Scalp Summary
  public query func getWeeklyScalpSummary() : async Nat {
    let currentTime = Time.now();
    let weekStart = currentTime - (7 * 24 * 60 * 60 * 1_000_000_000);

    var totalScalps : Nat = 0;

    switch (instruments.get("XAUUSD")) {
      case (?stats) {
        let hasRecentData = stats.chartData.any(
          func(data : PriceData) : Bool { data.time >= weekStart },
        );
        if (hasRecentData) {
          totalScalps += stats.scalps;
        };
      };
      case (null) {};
    };

    switch (instruments.get("USOIL")) {
      case (?stats) {
        let hasRecentData = stats.chartData.any(
          func(data : PriceData) : Bool { data.time >= weekStart },
        );
        if (hasRecentData) {
          totalScalps += stats.scalps;
        };
      };
      case (null) {};
    };

    totalScalps;
  };
};
