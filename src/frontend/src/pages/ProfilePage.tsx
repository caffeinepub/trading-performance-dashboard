import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, Gift, User, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const REFERRAL_CODE = "Apex2020";
const ACCOUNT_BALANCE = 1000;
const TRANSACTION_FEE = 50;
const TIMER_SECONDS = 15 * 60; // 15 minutes

export function ProfilePage() {
  const [referralInput, setReferralInput] = useState("");
  const [balanceUnlocked, setBalanceUnlocked] = useState(false);
  const [referralError, setReferralError] = useState(false);
  const [withdrawalOpen, setWithdrawalOpen] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleReferralSubmit = () => {
    if (referralInput.trim() === REFERRAL_CODE) {
      setBalanceUnlocked(true);
      setReferralError(false);
    } else {
      setReferralError(true);
    }
  };

  const handleWithdraw = () => {
    setWithdrawalOpen(true);
    setTimerActive(false);
    setSecondsLeft(TIMER_SECONDS);
    setTimerDone(false);
  };

  const handlePayFee = () => {
    if (!timerActive && !timerDone) {
      setTimerActive(true);
    }
  };

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerActive(false);
            setTimerDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerActive]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = ((TIMER_SECONDS - secondsLeft) / TIMER_SECONDS) * 100;

  return (
    <main className="container mx-auto max-w-lg px-4 py-10">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account and referrals
          </p>
        </div>
      </div>

      {/* Referral Code Section */}
      <div className="rounded-xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Referral Code
          </h2>
        </div>
        {!balanceUnlocked ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              Enter your referral code to unlock your account balance.
            </p>
            <div className="flex gap-2">
              <Input
                data-ocid="profile.referral.input"
                placeholder="Enter referral code"
                value={referralInput}
                onChange={(e) => {
                  setReferralInput(e.target.value);
                  setReferralError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleReferralSubmit()}
                className={referralError ? "border-red-500" : ""}
              />
              <Button
                data-ocid="profile.referral.submit_button"
                onClick={handleReferralSubmit}
              >
                Apply
              </Button>
            </div>
            {referralError && (
              <p
                data-ocid="profile.referral.error_state"
                className="text-xs text-red-500 mt-2"
              >
                Invalid referral code. Please try again.
              </p>
            )}
          </>
        ) : (
          <div
            data-ocid="profile.referral.success_state"
            className="flex items-center gap-2 text-green-400"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              Referral code applied successfully!
            </span>
          </div>
        )}
      </div>

      {/* Account Balance Section */}
      {balanceUnlocked && (
        <div
          className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-4"
          data-ocid="profile.balance.card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Account Balance
            </h2>
          </div>
          <div className="text-4xl font-bold text-primary mt-2">
            ${ACCOUNT_BALANCE.toLocaleString()}.00
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Available for withdrawal
          </p>

          {/* Withdrawal Section */}
          <div className="mt-6 pt-5 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Withdrawal
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Withdraw your available balance to your USDT wallet.
            </p>
            <Button
              data-ocid="profile.withdrawal.primary_button"
              className="w-full"
              onClick={handleWithdraw}
            >
              Withdraw Funds
            </Button>
          </div>
        </div>
      )}

      {/* Withdrawal Dialog */}
      <Dialog open={withdrawalOpen} onOpenChange={setWithdrawalOpen}>
        <DialogContent
          data-ocid="profile.withdrawal.dialog"
          className="max-w-sm bg-[#1a1a1a] border border-zinc-700 p-0 overflow-hidden"
        >
          <div className="bg-[#111] px-6 pt-6 pb-4 text-center">
            {/* USDT Header */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#26a17b]">
                <span className="text-white font-bold text-xs">₮</span>
              </div>
              <span className="text-white font-bold text-lg">USDT</span>
              <span className="ml-1 rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300 font-medium">
                TRC20
              </span>
            </div>

            {/* QR Code Image */}
            <div className="flex justify-center mb-4">
              <div className="rounded-2xl bg-white p-3 w-52 h-52 flex items-center justify-center">
                <img
                  src="/assets/uploads/Screenshot_2026-03-17-15-35-31-39_08800057d42e3b72e31ae4fd4c41ba57-1.jpg"
                  alt="USDT TRC20 QR Code"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            {/* Wallet Address */}
            <p className="text-white font-mono text-sm break-all mb-1 leading-relaxed">
              TUTkHGWCcazJrxLKiRWWBhnkmZnfWYVVNR
            </p>
            <p className="text-zinc-400 text-xs mb-5">No memo required</p>

            {/* Transaction Fee Box */}
            <div className="rounded-lg bg-zinc-800 border border-zinc-600 px-4 py-3 mb-5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Transaction Fee</span>
                <span className="text-white font-bold text-base">
                  ${TRANSACTION_FEE}
                </span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                Send $50 USDT to the address above to process your withdrawal.
              </p>
            </div>

            {/* Timer Section */}
            {!timerActive && !timerDone && (
              <Button
                data-ocid="profile.withdrawal.confirm_button"
                className="w-full bg-[#26a17b] hover:bg-[#1e8a68] text-white font-semibold"
                onClick={handlePayFee}
              >
                I've Paid the Fee — Start Processing
              </Button>
            )}

            {(timerActive || timerDone) && (
              <div
                data-ocid="profile.withdrawal.loading_state"
                className="mt-1"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-[#26a17b]" />
                  <span className="text-zinc-300 text-sm font-medium">
                    Processing Withdrawal
                  </span>
                </div>

                {!timerDone ? (
                  <>
                    <div className="text-4xl font-mono font-bold text-white mb-2">
                      {formatTime(secondsLeft)}
                    </div>
                    <p className="text-zinc-500 text-xs mb-3">
                      Estimated processing time
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#26a17b] rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div
                    data-ocid="profile.withdrawal.success_state"
                    className="flex flex-col items-center gap-2 py-2"
                  >
                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                    <p className="text-green-400 font-semibold">
                      Withdrawal Submitted!
                    </p>
                    <p className="text-zinc-400 text-xs">
                      Your withdrawal is being reviewed. Funds will arrive
                      shortly.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-6 pb-5">
            <Button
              data-ocid="profile.withdrawal.close_button"
              variant="ghost"
              className="w-full text-zinc-400 hover:text-white"
              onClick={() => setWithdrawalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
