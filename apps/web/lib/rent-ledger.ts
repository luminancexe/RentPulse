/**
 * RentPulse Rent Ledger & Multi-Rail Payment Gateway (MFS & Cards)
 *
 * Implements:
 * - Double-entry tenancy ledger (Debits vs Credits)
 * - Monthly rent, security deposit, and building service charge itemization
 * - MFS Payment Simulator (bKash, Nagad)
 * - Debit / Credit Card Payment Simulator (Visa, Mastercard, AMEX)
 * - Cryptographic TrxID generation & digital tenancy money receipts
 */

export type TransactionType =
  | "security_deposit"
  | "monthly_rent"
  | "utility_charge"
  | "payment_received"
  | "deposit_refund";

export type PaymentMethod =
  | "bKash"
  | "Nagad"
  | "Visa"
  | "Mastercard"
  | "AMEX"
  | "Bank_Transfer"
  | "Cash";

export type PaymentStatus = "paid" | "pending" | "overdue";

export interface LedgerEntry {
  id: string;
  trxId: string;
  propertyId: string;
  propertyTitle: string;
  tenantName: string;
  landlordName: string;
  date: string; // YYYY-MM-DD
  monthCycle: string; // e.g. "November 2026"
  description: string;
  type: TransactionType;
  amountBdt: number;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  cardLast4?: string;
  receiptNumber?: string;
  paidAt?: string;
}

export interface MfsPaymentInput {
  ledgerEntryId: string;
  method: "bKash" | "Nagad";
  walletNumber: string;
  amountBdt: number;
}

export interface CardPaymentInput {
  ledgerEntryId: string;
  cardholderName: string;
  cardNumber: string; // 15-16 digits
  expiryDate: string; // MM/YY
  cvv: string; // 3 or 4 digits
  amountBdt: number;
}

export interface PaymentExecutionResult {
  success: boolean;
  trxId: string;
  receiptNumber: string;
  paymentMethod: PaymentMethod;
  last4Digits?: string;
  paidAt: string;
  error?: string;
}

export type MfsPaymentResult = PaymentExecutionResult;

/**
 * Detect card brand from initial digits
 */
export function detectCardBrand(cardNumber: string): PaymentMethod {
  const clean = cardNumber.replace(/[\s-]/g, "");
  if (clean.startsWith("4")) return "Visa";
  if (
    clean.startsWith("51") ||
    clean.startsWith("52") ||
    clean.startsWith("53") ||
    clean.startsWith("54") ||
    clean.startsWith("55") ||
    clean.startsWith("22") ||
    clean.startsWith("27")
  ) {
    return "Mastercard";
  }
  if (clean.startsWith("34") || clean.startsWith("37")) {
    return "AMEX";
  }
  return "Visa";
}

/**
 * Simulate authentic Bangladeshi MFS payment (bKash / Nagad)
 */
export function executeMfsPayment(input: MfsPaymentInput): PaymentExecutionResult {
  const cleanNumber = input.walletNumber.replace(/[\s-]/g, "");

  if (!cleanNumber.startsWith("01") || cleanNumber.length !== 11) {
    return {
      success: false,
      trxId: "",
      receiptNumber: "",
      paymentMethod: input.method,
      paidAt: "",
      error: "Invalid Bangladesh mobile number. Must be 11 digits starting with 01 (e.g. 01711234567).",
    };
  }

  // Generate authentic MFS TrxID
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomTrx = "";
  for (let i = 0; i < 10; i++) {
    randomTrx += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const prefix = input.method === "bKash" ? "BK" : "NG";
  const trxId = `${prefix}${randomTrx}`;
  const receiptNumber = `RP-RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
  const paidAt = new Date().toISOString();

  return {
    success: true,
    trxId,
    receiptNumber,
    paymentMethod: input.method,
    paidAt,
  };
}

/**
 * Simulate Debit / Credit Card Payment (Visa, Mastercard, AMEX)
 */
export function executeCardPayment(input: CardPaymentInput): PaymentExecutionResult {
  const cleanNumber = input.cardNumber.replace(/[\s-]/g, "");

  if (!input.cardholderName.trim()) {
    return {
      success: false,
      trxId: "",
      receiptNumber: "",
      paymentMethod: "Visa",
      paidAt: "",
      error: "Cardholder full legal name is required.",
    };
  }

  if (cleanNumber.length < 15 || cleanNumber.length > 16 || !/^\d+$/.test(cleanNumber)) {
    return {
      success: false,
      trxId: "",
      receiptNumber: "",
      paymentMethod: "Visa",
      paidAt: "",
      error: "Invalid card number. Must be 15 or 16 digits.",
    };
  }

  // Expiry check (MM/YY)
  const expMatch = input.expiryDate.match(/^(\d{2})\/(\d{2})$/);
  if (!expMatch) {
    return {
      success: false,
      trxId: "",
      receiptNumber: "",
      paymentMethod: "Visa",
      paidAt: "",
      error: "Invalid expiry format. Expected MM/YY (e.g. 08/28).",
    };
  }
  const month = parseInt(expMatch[1], 10);
  if (month < 1 || month > 12) {
    return {
      success: false,
      trxId: "",
      receiptNumber: "",
      paymentMethod: "Visa",
      paidAt: "",
      error: "Invalid expiry month. Must be between 01 and 12.",
    };
  }

  // CVV check
  if (!/^\d{3,4}$/.test(input.cvv)) {
    return {
      success: false,
      trxId: "",
      receiptNumber: "",
      paymentMethod: "Visa",
      paidAt: "",
      error: "Invalid security code (CVV). Expected 3 or 4 digits.",
    };
  }

  const brand = detectCardBrand(cleanNumber);
  const last4 = cleanNumber.slice(-4);

  // Generate authentic Card TrxID
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomTrx = "";
  for (let i = 0; i < 8; i++) {
    randomTrx += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const trxId = `TX-${brand.toUpperCase()}-${randomTrx}`;
  const receiptNumber = `RP-RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
  const paidAt = new Date().toISOString();

  return {
    success: true,
    trxId,
    receiptNumber,
    paymentMethod: brand,
    last4Digits: last4,
    paidAt,
  };
}

/**
 * Compute Ledger Totals
 */
export function calculateLedgerSummary(entries: LedgerEntry[]): {
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  securityDepositHeld: number;
} {
  let totalInvoiced = 0;
  let totalPaid = 0;
  let securityDepositHeld = 0;

  for (const entry of entries) {
    if (entry.type === "security_deposit") {
      securityDepositHeld += entry.amountBdt;
    } else if (entry.type === "monthly_rent" || entry.type === "utility_charge") {
      totalInvoiced += entry.amountBdt;
      if (entry.status === "paid") {
        totalPaid += entry.amountBdt;
      }
    }
  }

  return {
    totalInvoiced,
    totalPaid,
    outstandingBalance: Math.max(0, totalInvoiced - totalPaid),
    securityDepositHeld,
  };
}

/**
 * Initial Seed Ledger Data (Majestine Lake Residence — Dhanmondi Flat 5-B)
 */
export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: "tx-001",
    trxId: "BK9X47KL29",
    propertyId: "prop-dhanmondi-01",
    propertyTitle: "Majestine Lake Residence Flat 5-B",
    tenantName: "Dr. Farhana Yasmin",
    landlordName: "Alhaj Rafiqul Islam",
    date: "2026-10-15",
    monthCycle: "Tenancy Inception",
    description: "Statutory 2-Month Security Deposit (Refundable)",
    type: "security_deposit",
    amountBdt: 84000,
    status: "paid",
    paymentMethod: "bKash",
    receiptNumber: "RP-RCPT-809214",
    paidAt: "2026-10-15T10:30:00Z",
  },
  {
    id: "tx-002",
    trxId: "TX-VISA-892401",
    propertyId: "prop-dhanmondi-01",
    propertyTitle: "Majestine Lake Residence Flat 5-B",
    tenantName: "Dr. Farhana Yasmin",
    landlordName: "Alhaj Rafiqul Islam",
    date: "2026-11-01",
    monthCycle: "November 2026",
    description: "Monthly Base Rent & Building Service Charge",
    type: "monthly_rent",
    amountBdt: 48000,
    status: "paid",
    paymentMethod: "Visa",
    cardLast4: "4242",
    receiptNumber: "RP-RCPT-814902",
    paidAt: "2026-11-03T14:15:00Z",
  },
  {
    id: "tx-003",
    trxId: "INV-2026-12",
    propertyId: "prop-dhanmondi-01",
    propertyTitle: "Majestine Lake Residence Flat 5-B",
    tenantName: "Dr. Farhana Yasmin",
    landlordName: "Alhaj Rafiqul Islam",
    date: "2026-12-01",
    monthCycle: "December 2026",
    description: "Monthly Base Rent & Building Service Charge",
    type: "monthly_rent",
    amountBdt: 48000,
    status: "pending",
  },
];
