"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LedgerEntry,
  INITIAL_LEDGER_ENTRIES,
  calculateLedgerSummary,
  executeMfsPayment,
  executeCardPayment,
  detectCardBrand,
  PaymentMethod,
} from "@/lib/rent-ledger";
import { GlassBadge } from "@/components/ui/GlassBadge";
import { EditorialButton } from "@/components/ui/EditorialButton";
import { EcosystemNavMenu } from "@/components/navigation";
import {
  CreditCard,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  ChevronLeft,
  Home,
  Users,
  ShieldCheck,
  CalendarCheck,
  Scale,
  FileCheck2,
  X,
  Wallet,
  Building,
  ArrowUpRight,
} from "lucide-react";

export default function RentLedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>(INITIAL_LEDGER_ENTRIES);
  const [checkoutEntry, setCheckoutEntry] = useState<LedgerEntry | null>(null);
  const [paymentRail, setPaymentRail] = useState<"card" | "mfs">("card");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("bKash");
  const [walletNumber, setWalletNumber] = useState("01711234567");
  const [mfsPin, setMfsPin] = useState("12345");
  const [cardholderName, setCardholderName] = useState("Dr. Farhana Yasmin");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("821");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [receiptEntry, setReceiptEntry] = useState<LedgerEntry | null>(null);

  const summary = calculateLedgerSummary(entries);

  const detectedBrand = detectCardBrand(cardNumber);

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutEntry) return;

    let result;
    if (paymentRail === "card") {
      result = executeCardPayment({
        ledgerEntryId: checkoutEntry.id,
        cardholderName,
        cardNumber,
        expiryDate: cardExpiry,
        cvv: cardCvv,
        amountBdt: checkoutEntry.amountBdt,
      });
    } else {
      result = executeMfsPayment({
        ledgerEntryId: checkoutEntry.id,
        method: selectedMethod === "Nagad" ? "Nagad" : "bKash",
        walletNumber,
        amountBdt: checkoutEntry.amountBdt,
      });
    }

    if (!result.success) {
      setCheckoutError(result.error || "Payment verification failed.");
      return;
    }

    // Update entry to paid
    const updated = entries.map((en) =>
      en.id === checkoutEntry.id
        ? {
            ...en,
            status: "paid" as const,
            trxId: result.trxId,
            receiptNumber: result.receiptNumber,
            paymentMethod: result.paymentMethod,
            cardLast4: result.last4Digits,
            paidAt: result.paidAt,
          }
        : en
    );

    setEntries(updated);
    setReceiptEntry(
      updated.find((en) => en.id === checkoutEntry.id) || null
    );
    setCheckoutEntry(null);
    setCheckoutError(null);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-primary flex flex-col font-sans print:bg-white print:text-black">
      {/* Top Header (Hidden in Print) */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-hairline print:hidden">
        <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 h-20 sm:h-22 flex items-center justify-between gap-6">
          {/* Logo & Back */}
          <div className="flex items-center gap-5 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink-primary font-medium transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center p-1.5 text-canvas shadow-subtle shrink-0">
                <Image src="/logo.png" alt="RentPulse" width={26} height={26} className="brightness-200" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-ink-primary">
                RentPulse
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <EcosystemNavMenu currentPath="/ledger" />
            <GlassBadge variant="forest">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cards & MFS Gateway</span>
            </GlassBadge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-10 w-full print:p-0 print:m-0 print:max-w-none">
        {/* Hero Card (Hidden in Print) */}
        <div className="mb-8 bg-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-card print:hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3">
                <GlassBadge variant="forest">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Tenancy Financial Ledger</span>
                </GlassBadge>
                <span className="text-xs text-ink-tertiary">
                  Double-Entry Accounting • Visa, Mastercard, AMEX & MFS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary tracking-tight">
                Automated Rent Ledger & Card / MFS Gateway
              </h1>
              <p className="text-sm text-ink-secondary mt-2.5 leading-relaxed">
                Reconcile monthly rent outlays, building maintenance service charges, and refundable security deposits. Pay invoices via debit/credit cards (Visa, Mastercard, AMEX) or mobile banking (bKash, Nagad) with instant TrxID digests and statutory digital rent receipts.
              </p>
            </div>

            {/* Inception Summary Card */}
            <div className="p-5 rounded-2xl bg-muted-sand/40 border border-hairline flex items-center gap-6 shrink-0">
              <div className="text-center">
                <div className="text-xs text-ink-tertiary">Security Deposit</div>
                <div className="text-xl font-display font-bold text-ink-primary mt-0.5">
                  ৳{summary.securityDepositHeld.toLocaleString()}
                </div>
                <div className="text-[10px] text-forest font-semibold mt-0.5">Held in Escrow</div>
              </div>
              <div className="h-8 w-[1px] bg-hairline" />
              <div className="text-center">
                <div className="text-xs text-ink-tertiary">Outstanding Due</div>
                <div className="text-xl font-display font-bold text-terracotta mt-0.5">
                  ৳{summary.outstandingBalance.toLocaleString()}
                </div>
                <div className="text-[10px] text-terracotta font-semibold mt-0.5">1 Pending Invoice</div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Metrics Cards (Hidden in Print) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 print:hidden">
          <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-card">
            <span className="text-xs text-ink-tertiary block">Total Invoiced (Tenancy to Date)</span>
            <div className="text-2xl font-display font-bold text-ink-primary mt-1">
              ৳{summary.totalInvoiced.toLocaleString()}
            </div>
            <span className="text-[11px] text-ink-secondary mt-1 block">Includes monthly rent & utilities</span>
          </div>

          <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-card">
            <span className="text-xs text-ink-tertiary block">Total Settled via MFS</span>
            <div className="text-2xl font-display font-bold text-forest mt-1">
              ৳{summary.totalPaid.toLocaleString()}
            </div>
            <span className="text-[11px] text-forest font-semibold mt-1 block">Reconciled with TrxIDs</span>
          </div>

          <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-card">
            <span className="text-xs text-ink-tertiary block">Current Due Balance</span>
            <div className="text-2xl font-display font-bold text-terracotta mt-1">
              ৳{summary.outstandingBalance.toLocaleString()}
            </div>
            <span className="text-[11px] text-terracotta font-semibold mt-1 block">Due by 7th of Month</span>
          </div>

          <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-card">
            <span className="text-xs text-ink-tertiary block">Refundable Security Deposit</span>
            <div className="text-2xl font-display font-bold text-ink-primary mt-1">
              ৳{summary.securityDepositHeld.toLocaleString()}
            </div>
            <span className="text-[11px] text-forest font-semibold mt-1 block">Statutory 2-Month Cap</span>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="bg-surface border border-hairline rounded-3xl p-6 sm:p-8 shadow-card mb-8 print:hidden">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-hairline">
            <div>
              <h2 className="text-lg font-display font-bold text-ink-primary">
                Tenancy Transaction History
              </h2>
              <p className="text-xs text-ink-secondary mt-0.5">
                Itemized log of invoices, security deposits, and MFS remittances for Majestine Lake Residence Flat 5-B
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-hairline rounded-2xl overflow-hidden">
              <thead className="bg-muted-sand/60 text-ink-secondary">
                <tr>
                  <th className="p-3.5 font-semibold">Date</th>
                  <th className="p-3.5 font-semibold">Cycle / Type</th>
                  <th className="p-3.5 font-semibold">Description</th>
                  <th className="p-3.5 font-semibold">Amount (BDT)</th>
                  <th className="p-3.5 font-semibold">TrxID / Method</th>
                  <th className="p-3.5 font-semibold">Status</th>
                  <th className="p-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {entries.map((entry) => {
                  const isPaid = entry.status === "paid";
                  return (
                    <tr key={entry.id} className="hover:bg-muted-sand/20 transition-colors">
                      <td className="p-3.5 text-ink-secondary font-mono">{entry.date}</td>
                      <td className="p-3.5 font-semibold text-ink-primary">{entry.monthCycle}</td>
                      <td className="p-3.5 text-ink-secondary">{entry.description}</td>
                      <td className="p-3.5 font-mono font-bold text-ink-primary">
                        ৳{entry.amountBdt.toLocaleString()}
                      </td>
                      <td className="p-3.5 font-mono">
                        {entry.trxId.startsWith("BK") ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E2136E] bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200">
                            bKash: {entry.trxId}
                          </span>
                        ) : entry.trxId.startsWith("NG") ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F7931E] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                            Nagad: {entry.trxId}
                          </span>
                        ) : entry.paymentMethod === "Visa" || entry.paymentMethod === "Mastercard" || entry.paymentMethod === "AMEX" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                            💳 {entry.paymentMethod} •••• {entry.cardLast4 || "4242"}
                          </span>
                        ) : (
                          <span className="text-ink-tertiary">{entry.trxId}</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <GlassBadge variant={isPaid ? "forest" : "terracotta"}>
                          {isPaid ? "Paid & Reconciled" : "Pending Payment"}
                        </GlassBadge>
                      </td>
                      <td className="p-3.5 text-right">
                        {isPaid ? (
                          <button
                            type="button"
                            onClick={() => setReceiptEntry(entry)}
                            className="inline-flex items-center gap-1 text-xs text-forest hover:underline font-semibold"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>View Receipt</span>
                          </button>
                        ) : (
                          <EditorialButton
                            variant="primary"
                            size="sm"
                            onClick={() => setCheckoutEntry(entry)}
                          >
                            <span>Pay Invoice</span>
                          </EditorialButton>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Banner */}
        <div className="mt-10 pt-6 border-t border-hairline text-center text-xs text-ink-tertiary print:hidden">
          RentPulse Digital Rent Ledger • Multi-Rail Card & MFS Gateway • Statutory Money Receipt
        </div>
      </main>

      {/* Payment Checkout Modal (Cards & MFS) */}
      {checkoutEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-sm animate-fade-in print:hidden">
          <div className="bg-surface border border-hairline rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-hairline">
              <div>
                <GlassBadge variant="forest">
                  Multi-Rail Payment Gateway
                </GlassBadge>
                <h3 className="text-xl font-display font-bold text-ink-primary mt-2">
                  Pay Rent & Service Charge
                </h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  {checkoutEntry.monthCycle} • <strong>৳{checkoutEntry.amountBdt.toLocaleString()}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutEntry(null)}
                className="p-1 rounded-full text-ink-tertiary hover:text-ink-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              {checkoutError && (
                <div className="p-3 rounded-xl bg-terracotta-light text-terracotta border border-terracotta/20 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Payment Rail Switcher: Card vs MFS */}
              <div className="flex items-center p-1 bg-muted-sand/50 rounded-2xl border border-hairline">
                <button
                  type="button"
                  onClick={() => setPaymentRail("card")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentRail === "card"
                      ? "bg-forest text-canvas shadow-subtle"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Debit / Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentRail("mfs")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentRail === "mfs"
                      ? "bg-forest text-canvas shadow-subtle"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>bKash / Nagad (MFS)</span>
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentRail === "card" ? (
                <div className="space-y-3.5 pt-1">
                  {/* Cardholder Name */}
                  <div>
                    <label className="text-ink-secondary font-medium block mb-1">
                      Cardholder Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="e.g. Dr. Farhana Yasmin"
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 text-ink-primary focus:outline-none focus:border-forest"
                    />
                  </div>

                  {/* Card Number with Brand Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-ink-secondary font-medium">Card Number *</label>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-forest/10 text-forest border border-forest/20">
                        {detectedBrand}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono text-ink-primary focus:outline-none focus:border-forest"
                      />
                      <CreditCard className="w-4 h-4 text-ink-tertiary absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-ink-secondary font-medium block mb-1">Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/28"
                        maxLength={5}
                        className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono text-ink-primary focus:outline-none focus:border-forest text-center"
                      />
                    </div>
                    <div>
                      <label className="text-ink-secondary font-medium block mb-1">Security Code (CVV) *</label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="821"
                        maxLength={4}
                        className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono text-ink-primary focus:outline-none focus:border-forest text-center"
                      />
                    </div>
                  </div>

                  {/* 3D Secure / Security Note */}
                  <div className="p-2.5 rounded-xl bg-forest/5 border border-forest/15 flex items-center gap-2 text-[11px] text-forest">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Protected by 256-bit SSL & 3D Secure 2.0 (Visa Secure / ID Check)</span>
                  </div>
                </div>
              ) : (
                /* MFS Payment Form */
                <div className="space-y-3.5 pt-1">
                  <div>
                    <label className="text-ink-primary font-semibold block mb-2 uppercase tracking-wider text-[11px]">
                      Select Mobile Financial Service
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedMethod("bKash")}
                        className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                          selectedMethod === "bKash"
                            ? "bg-[#E2136E] text-white border-[#E2136E] shadow-sm"
                            : "bg-muted-sand/40 border-hairline hover:bg-muted-sand text-ink-primary"
                        }`}
                      >
                        bKash (বিকাশ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedMethod("Nagad")}
                        className={`p-3 rounded-2xl border text-center font-bold transition-all cursor-pointer ${
                          selectedMethod === "Nagad"
                            ? "bg-[#F7931E] text-white border-[#F7931E] shadow-sm"
                            : "bg-muted-sand/40 border-hairline hover:bg-muted-sand text-ink-primary"
                        }`}
                      >
                        Nagad (নগদ)
                      </button>
                    </div>
                  </div>

                  {/* Recipient Landlord Info */}
                  <div className="p-2.5 rounded-xl bg-muted-sand/30 border border-hairline flex items-center justify-between">
                    <div>
                      <span className="text-ink-tertiary block text-[10px]">Recipient (Landlord)</span>
                      <span className="font-semibold text-ink-primary">{checkoutEntry.landlordName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-ink-tertiary block text-[10px]">Merchant Account</span>
                      <span className="font-mono font-semibold text-ink-primary">+880 1711-892341</span>
                    </div>
                  </div>

                  {/* Tenant Wallet Mobile Number */}
                  <div>
                    <label className="text-ink-secondary font-medium block mb-1">
                      Your {selectedMethod} Account Number (11 Digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={walletNumber}
                      onChange={(e) => setWalletNumber(e.target.value)}
                      placeholder="01711234567"
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono text-ink-primary focus:outline-none focus:border-forest"
                    />
                  </div>

                  {/* MFS Simulation PIN */}
                  <div>
                    <label className="text-ink-secondary font-medium block mb-1">
                      MFS Authorization PIN (Simulator)
                    </label>
                    <input
                      type="password"
                      required
                      value={mfsPin}
                      onChange={(e) => setMfsPin(e.target.value)}
                      className="w-full bg-muted-sand/40 border border-hairline rounded-xl px-3.5 py-2 font-mono text-ink-primary focus:outline-none focus:border-forest"
                    />
                    <span className="text-[10px] text-ink-tertiary mt-1 block">
                      *Sandbox test PIN: 12345. Reconciles transaction in real-time.
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-hairline flex items-center justify-end gap-3">
                <EditorialButton variant="outline" size="sm" onClick={() => setCheckoutEntry(null)}>
                  Cancel
                </EditorialButton>
                <EditorialButton variant="primary" size="sm" type="submit">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize ৳{checkoutEntry.amountBdt.toLocaleString()}</span>
                </EditorialButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Digital Rent Receipt Modal & Printable View */}
      {receiptEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/50 backdrop-blur-sm animate-fade-in print:static print:p-0 print:bg-white">
          <div className="bg-surface border border-hairline rounded-3xl w-full max-w-xl p-8 shadow-card space-y-6 print:border-none print:shadow-none print:p-0">
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-hairline print:hidden">
              <span className="text-xs font-semibold uppercase text-forest">
                Official Tenancy Rent Receipt
              </span>
              <div className="flex items-center gap-2">
                <EditorialButton variant="outline" size="sm" onClick={handlePrintReceipt}>
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </EditorialButton>
                <button
                  type="button"
                  onClick={() => setReceiptEntry(null)}
                  className="p-1 rounded-full text-ink-tertiary hover:text-ink-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Statutory Money Receipt */}
            <div className="space-y-6 text-xs text-ink-primary">
              <div className="text-center pb-4 border-b-2 border-ink-primary/20 space-y-1">
                <div className="font-serif font-bold text-lg">বাড়ি ভাড়ার মানি রিসিট</div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-forest font-bold">
                  Official Residential Tenancy Money Receipt
                </div>
                <div className="font-mono text-xs text-ink-secondary">
                  Receipt No: <strong>{receiptEntry.receiptNumber || "RP-RCPT-814902"}</strong> • TrxID: <strong>{receiptEntry.trxId}</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-muted-sand/30 p-4 rounded-2xl border border-hairline">
                <div>
                  <span className="text-ink-tertiary block">ভাড়াটিয়ার নাম (Tenant)</span>
                  <strong className="text-ink-primary">{receiptEntry.tenantName}</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block">বাড়িওয়ালার নাম (Lessor)</span>
                  <strong className="text-ink-primary">{receiptEntry.landlordName}</strong>
                </div>
                <div>
                  <span className="text-ink-tertiary block">ভাড়াকৃত ফ্ল্যাট / ঠিকানা</span>
                  <span className="text-ink-primary">{receiptEntry.propertyTitle}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary block">ভাড়ার মাস / চক্র</span>
                  <strong className="text-forest">{receiptEntry.monthCycle}</strong>
                </div>
              </div>

              <div className="border border-hairline rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-ink-tertiary block">পরিশোধিত অর্থের পরিমাণ (Remitted Amount)</span>
                  <div className="text-2xl font-mono font-bold text-forest mt-0.5">
                    ৳{receiptEntry.amountBdt.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-ink-secondary italic mt-0.5 block">
                    {receiptEntry.description}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-ink-tertiary block">পেমেন্ট মাধ্যম (Gateway)</span>
                  <span className="font-bold text-ink-primary block">
                    {receiptEntry.paymentMethod === "Visa" ||
                    receiptEntry.paymentMethod === "Mastercard" ||
                    receiptEntry.paymentMethod === "AMEX" ? (
                      <span className="inline-flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-forest" />
                        <span>{receiptEntry.paymentMethod} •••• {receiptEntry.cardLast4 || "4242"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-forest" />
                        <span>{receiptEntry.paymentMethod} (MFS)</span>
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-ink-tertiary">
                    {receiptEntry.paidAt ? new Date(receiptEntry.paidAt).toLocaleDateString() : receiptEntry.date}
                  </span>
                </div>
              </div>

              <div className="pt-8 border-t border-hairline grid grid-cols-2 gap-8 text-center text-[11px]">
                <div>
                  <div className="border-b border-ink-primary/40 pb-6 mb-1" />
                  <span>গ্রহীতার স্বাক্ষর (Lessor / Receiver)</span>
                </div>
                <div>
                  <div className="border-b border-ink-primary/40 pb-6 mb-1" />
                  <span>প্রদানকারীর স্বাক্ষর (Tenant / Payer)</span>
                </div>
              </div>

              <div className="text-center text-[9px] font-mono text-ink-tertiary pt-2">
                Generated via RentPulse Multi-Rail Payment Gateway (Cards & MFS) • Digitally Verified & Reconciled
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
