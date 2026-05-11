// ==========================================================================
// Ambassador API — Shared TypeScript Types
// ==========================================================================
// These types are placeholder contracts. Adjust them once the backend
// response shapes are confirmed.
// ==========================================================================

// ---------------------------------------------------------------------------
// Common / Shared
// ---------------------------------------------------------------------------

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};

export type StatusUpdate = {
  status: string;
};

// ---------------------------------------------------------------------------
// Me / Dashboard
// ---------------------------------------------------------------------------

export type AmbassadorMe = {
  id: string;
  nombre: string;
  email: string;
  tipo: string;
  estado: string;
  nivel: string;
  ciudad: string;
  residencia: string;
  especialidad: string;
  bio: string;
  fotoUrl: string | null;
  creadoEn: string;
};

export type DashboardKpi = {
  label: string;
  value: string | number;
  helper: string;
};

export type AmbassadorDashboard = {
  kpis: DashboardKpi[];
  referredBusinesses: number;
  activeBusinesses: number;
  pendingCommission: number;
  totalCommission: number;
};

export type ActivityItem = {
  id: string;
  type: string;
  description: string;
  date: string;
  metadata?: Record<string, unknown>;
};

export type WeeklyActivity = {
  week: string;
  activities: ActivityItem[];
  totalActions: number;
};

export type ReferredBusiness = {
  id: string;
  name: string;
  category: string;
  city: string;
  referredAt: string;
  status: string;
  monthlyLeads: number;
  conversionRate: number;
  growthRate: number;
  rating: number;
  userScore: number;
  userView: string;
  topComment: string;
  valueScore: number;
  commissionGenerated: number;
  reputationContribution: number;
  strengths: string[];
  risks: string[];
};

// ---------------------------------------------------------------------------
// Opportunities
// ---------------------------------------------------------------------------

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  status: string;
  saved: boolean;
  createdAt: string;
  expiresAt: string | null;
};

export type OpportunityStatusUpdate = {
  status: string;
};

// ---------------------------------------------------------------------------
// Missions (both /me/missions and /missions)
// ---------------------------------------------------------------------------

export type Mission = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  reward: number;
  progress: number;
  goal: number;
  startedAt: string | null;
  completedAt: string | null;
  expiresAt: string | null;
};

// ---------------------------------------------------------------------------
// Ambassador by ID
// ---------------------------------------------------------------------------

export type AmbassadorPublic = {
  id: string;
  nombre: string;
  nivel: string;
  ciudad: string;
  especialidad: string;
  fotoUrl: string | null;
  estado: string;
};

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export type AmbassadorProfile = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  ciudad: string;
  residencia: string;
  especialidad: string;
  bio: string;
  fotoUrl: string | null;
};

export type UpdateProfilePayload = Partial<Omit<AmbassadorProfile, "id" | "fotoUrl">>;

export type ProfileStats = {
  totalReferrals: number;
  activeBusinesses: number;
  totalCommission: number;
  averageRating: number;
  conversionRate: number;
  reputationScore: number;
};

export type PhotoUploadResponse = {
  url: string;
};

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export type AmbassadorSettings = {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
  timezone: string;
  [key: string]: unknown;
};

export type UpdateSettingsPayload = Partial<AmbassadorSettings>;

// ---------------------------------------------------------------------------
// Referral Links
// ---------------------------------------------------------------------------

export type ReferralLink = {
  id: string;
  url: string;
  code: string;
  label: string;
  status: string;
  clicks: number;
  conversions: number;
  createdAt: string;
};

export type CreateReferralLinkPayload = {
  label: string;
  targetType?: string;
  campaign?: string;
};

export type UpdateReferralLinkPayload = Partial<CreateReferralLinkPayload>;

export type ReferralLinkStatusUpdate = {
  status: string;
};

export type ReferralLinkQr = {
  qrImageUrl: string;
  linkId: string;
};

export type ReferralCode = {
  code: string;
  type: string;
  usesRemaining: number | null;
  expiresAt: string | null;
};

// ---------------------------------------------------------------------------
// Referrals
// ---------------------------------------------------------------------------

export type Referral = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
};

export type CreateReferralPayload = {
  businessName: string;
  contactName: string;
  email?: string;
  phone?: string;
  category: string;
  city: string;
  source: string;
  notes?: string;
};

export type UpdateReferralPayload = Partial<CreateReferralPayload>;

export type ReferralStatusUpdate = {
  status: string;
};

export type ReferralActivityItem = {
  id: string;
  type: string;
  description: string;
  date: string;
};

export type ReferralNote = {
  id: string;
  text: string;
  createdAt: string;
  authorId: string;
};

export type CreateReferralNotePayload = {
  text: string;
};

export type ReferralFileUploadResponse = {
  id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
};

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export type Lead = {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  city: string;
  source: string;
  status: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  notes: string;
};

export type CreateLeadPayload = {
  businessName: string;
  contactName: string;
  email?: string;
  phone?: string;
  category: string;
  city: string;
  source: string;
  notes?: string;
};

export type UpdateLeadPayload = Partial<CreateLeadPayload>;

export type LeadStatusUpdate = {
  status: string;
};

export type LeadConversionResult = {
  referralId: string;
  message: string;
};

// ---------------------------------------------------------------------------
// Commissions
// ---------------------------------------------------------------------------

export type Commission = {
  id: string;
  source: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  howGenerated: string;
};

export type CommissionsSummary = {
  totalAccumulated: number;
  totalMonth: number;
  totalPending: number;
  totalPaid: number;
  averagePerBusiness: number;
};

export type CommissionDisputePayload = {
  reason: string;
  details: string;
};

export type CommissionDisputeResult = {
  disputeId: string;
  status: string;
  message: string;
};

// ---------------------------------------------------------------------------
// Earnings / Wallet / Payouts
// ---------------------------------------------------------------------------

export type Wallet = {
  balance: number;
  currency: string;
  lastUpdated: string;
};

export type WithdrawPayload = {
  amount: number;
  payoutMethodId: string;
};

export type WithdrawResult = {
  transactionId: string;
  amount: number;
  status: string;
  estimatedArrival: string;
};

export type Payout = {
  id: string;
  amount: number;
  status: string;
  method: string;
  requestedAt: string;
  completedAt: string | null;
};

export type PayoutMethod = {
  id: string;
  type: string;
  label: string;
  details: Record<string, string>;
  isDefault: boolean;
};

export type CreatePayoutMethodPayload = {
  type: string;
  label: string;
  details: Record<string, string>;
  isDefault?: boolean;
};

export type EarningsCommissions = {
  commissions: Commission[];
  total: number;
};

export type EarningsCommissionsSummary = CommissionsSummary;

export type EarningsWallet = Wallet;

export type EarningsPayouts = {
  payouts: Payout[];
  total: number;
};

// ---------------------------------------------------------------------------
// Network
// ---------------------------------------------------------------------------

export type NetworkOverview = {
  totalMembers: number;
  levelBreakdown: { level: string; count: number }[];
  activeMembers: number;
};

export type NetworkTreeNode = {
  id: string;
  nombre: string;
  nivel: string;
  estado: string;
  activeBusinesses: number;
  children: NetworkTreeNode[];
};

export type NetworkInvitation = {
  id: string;
  email: string;
  nombre: string;
  status: string;
  sentAt: string;
  expiresAt: string;
};

export type CreateNetworkInvitationPayload = {
  email: string;
  nombre: string;
  message?: string;
};

export type NetworkRanking = {
  rank: number;
  ambassadorId: string;
  nombre: string;
  score: number;
  referrals: number;
  commissions: number;
}[];

// ---------------------------------------------------------------------------
// Chats
// ---------------------------------------------------------------------------

export type Chat = {
  id: string;
  participantId: string;
  participantName: string;
  participantType: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

export type CreateChatPayload = {
  participantId: string;
  initialMessage?: string;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  readAt: string | null;
};

export type SendMessagePayload = {
  content: string;
};

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export type PerformanceReport = {
  period: string;
  referrals: number;
  conversions: number;
  commissions: number;
  reputationScore: number;
  trendData: { date: string; value: number }[];
};

export type ReferralsReport = {
  total: number;
  byStatus: { status: string; count: number }[];
  bySource: { source: string; count: number }[];
  byMonth: { month: string; count: number }[];
};

export type CommissionsReport = {
  total: number;
  byType: { type: string; amount: number }[];
  byMonth: { month: string; amount: number }[];
};

export type ConversionFunnelReport = {
  stages: { stage: string; count: number; rate: number }[];
};

export type ExportReportParams = {
  type: string;
  format: string;
  dateFrom?: string;
  dateTo?: string;
};

// ---------------------------------------------------------------------------
// AI
// ---------------------------------------------------------------------------

export type AiQueryPayload = {
  query: string;
  context?: Record<string, unknown>;
};

export type AiQueryResponse = {
  answer: string;
  confidence: number;
  sources: string[];
};

export type AiInsight = {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  actionSuggestion: string;
  createdAt: string;
};

export type ProspectScorePayload = {
  businessName: string;
  category: string;
  city: string;
  contactInfo?: Record<string, string>;
};

export type ProspectScoreResponse = {
  score: number;
  factors: { factor: string; impact: string; weight: number }[];
  recommendation: string;
};

export type FollowUpSuggestionPayload = {
  referralId: string;
  context?: string;
};

export type FollowUpSuggestionResponse = {
  suggestion: string;
  channel: string;
  timing: string;
  templateMessage: string;
};

export type ImprovementPlanPayload = {
  focusArea?: string;
};

export type ImprovementPlanResponse = {
  plan: { step: number; action: string; expectedImpact: string; deadline: string }[];
  overallGoal: string;
};

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

export type HistoryEntry = {
  id: string;
  type: string;
  action: string;
  description: string;
  date: string;
  metadata?: Record<string, unknown>;
};

export type HistorySummary = {
  totalActions: number;
  byType: { type: string; count: number }[];
  byMonth: { month: string; count: number }[];
  recentActions: HistoryEntry[];
};
