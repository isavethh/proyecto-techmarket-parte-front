import { apiRequest } from "./client";

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type SpecialistProfile = {
  id: string;
  nombre: string;
  especialidad: string;
  ubicacion: string;
  calificacion: number;
};

export type SpecialistService = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  tipo: string;
  destacado: boolean;
};

export type SpecialistServiceInput = {
  nombre: string;
  descripcion?: string;
  precio: number;
  moneda?: string;
  tipo: string;
  destacado?: boolean;
};

export type SpecialistPortfolioItem = {
  id: string;
  titulo: string;
  servicio: string;
  resultado: string;
  fecha: string;
};

export type SpecialistPortfolioItemInput = {
  titulo: string;
  servicio?: string;
  resultado?: string;
  fecha?: string;
};

export type CreateSpecialistServiceResponse = {
  id: string;
  nombre: string;
  mensaje: string;
};

export type CreateSpecialistPortfolioItemResponse = {
  id: string;
  mensaje: string;
};

export type MessageResponse = {
  mensaje: string;
};

export type SpecialistAvailability = {
  id?: string;
  estado?: string;
  status?: string;
  diasAtencion?: string | string[];
  dias?: string | string[];
  workingDays?: string | string[];
  horario?: string | TimeRange;
  horarios?: string | TimeRange;
  hours?: string | TimeRange;
  modalidad?: string | string[];
  mode?: string;
  cobertura?: string;
  coverage?: string;
  tiempoRespuesta?: string;
  responseTime?: string;
  detalle?: string;
  detail?: string;
};

export type SpecialistAvailabilityInput = {
  estado?: string;
  dias?: string[];
  inicio?: string;
  fin?: string;
  modalidad?: string[];
  cobertura?: string;
  tiempoRespuesta?: string;
};

export type TimeRange = {
  inicio?: string;
  fin?: string;
  start?: string;
  end?: string;
};

export type SpecialistCalendarItem = {
  id?: string;
  titulo?: string;
  title?: string;
  descripcion?: string;
  description?: string;
  detalle?: string;
  detail?: string;
  fecha?: string;
  date?: string;
  hora?: string;
  time?: string;
  tipo?: string;
  type?: string;
};

export type SpecialistCalendarBlockInput = {
  fecha: string;
  hora: string;
  fin?: string;
  motivo?: string;
};

export type SpecialistRequest = {
  id?: string;
  requestId?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  servicio?: string;
  service?: string;
  propuesta?: string;
  proposal?: string;
  mensaje?: string;
  message?: string;
  estado?: string;
  status?: string;
  fecha?: string;
  date?: string;
  createdAt?: string;
};

export type SpecialistRequestAction = "aceptar" | "rechazar";

export type RespondSpecialistRequestInput = {
  accion: SpecialistRequestAction;
};

export type SpecialistRequestActionResponse = {
  accion: string;
  mensaje: string;
};

export type SpecialistProject = {
  id?: string;
  projectId?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  nombre?: string;
  name?: string;
  titulo?: string;
  title?: string;
  servicio?: string;
  service?: string;
  estado?: string;
  status?: string;
  fechaInicio?: string;
  startDate?: string;
  fechaFin?: string;
  endDate?: string;
  progreso?: number | string;
  progress?: number | string;
};

export type SpecialistProjectStatus = "en_progreso" | "completado" | "cancelado";

export type UpdateSpecialistProjectStatusInput = {
  estado: SpecialistProjectStatus;
};

export type SpecialistProjectStatusResponse = {
  estado: string;
  mensaje: string;
};

export type SpecialistProjectHistory = {
  id?: string;
  historyId?: string;
  projectId?: string;
  proyecto?: string;
  project?: string;
  titulo?: string;
  title?: string;
  detalle?: string;
  detail?: string;
  descripcion?: string;
  description?: string;
  estado?: string;
  status?: string;
  fecha?: string;
  date?: string;
  createdAt?: string;
};

export type SpecialistChatMessage = {
  id?: string;
  messageId?: string;
  from?: string;
  sender?: string;
  remitente?: string;
  role?: string;
  texto?: string;
  text?: string;
  mensaje?: string;
  message?: string;
  message_body?: string;
  messageBody?: string;
  body?: string;
  content?: string;
  contenido?: string;
  hora?: string;
  time?: string;
  fecha?: string;
  date?: string;
  created_at?: string;
  createdAt?: string;
  author_user_id?: string;
  authorUserId?: string;
};

export type SpecialistChat = {
  id?: string;
  chatId?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  iniciales?: string;
  initials?: string;
  servicio?: string;
  service?: string;
  serviceName?: string;
  service_name?: string;
  subject?: string;
  ticketSubject?: string;
  title?: string;
  description?: string;
  estado?: string;
  status?: string;
  ultimoMensaje?: string;
  last_message?: string;
  latestMessage?: string;
  latest_message?: string;
  messageBody?: string;
  message_body?: string;
  text?: string;
  content?: string;
  lastMessage?: string;
  hora?: string;
  time?: string;
  fecha?: string;
  date?: string;
  unread?: number | string;
  noLeidos?: number | string;
  messages?: SpecialistChatMessage[];
  mensajes?: SpecialistChatMessage[];
  ticketMessages?: SpecialistChatMessage[];
  messageList?: SpecialistChatMessage[];
  ultimaActividad?: string;
  ticketCode?: string;
  ticket_code?: string;
  ticket_subject?: string;
};

export type SpecialistChatDetail = SpecialistChat & {
  messages?: SpecialistChatMessage[];
  mensajes?: SpecialistChatMessage[];
  ticketMessages?: SpecialistChatMessage[];
  messageList?: SpecialistChatMessage[];
  value?: SpecialistChatMessage[] | SpecialistChat;
  data?: SpecialistChatMessage[] | SpecialistChat;
};

export type CreateSpecialistChatMessageInput = {
  contenido: string;
  tipo?: string;
};

export type CreateSpecialistChatMessageResponse = {
  id: string;
  fecha: string;
};

export type SpecialistFile = {
  id?: string;
  fileId?: string;
  nombre?: string;
  name?: string;
  filename?: string;
  tipo?: string;
  type?: string;
  mimeType?: string;
  tamano?: string | number;
  size?: string | number;
  fechaCarga?: string;
  uploadedAt?: string;
  createdAt?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  proyecto?: string;
  project?: string;
  relatedTo?: string;
  url?: string;
};

export type CreateSpecialistFileInput = {
  url: string;
  nombre: string;
  tipo?: string;
  tamano?: string;
};

export type CreateSpecialistFileResponse = {
  id: string;
  mensaje: string;
};

export type SpecialistWallet = {
  id?: string;
  saldoDisponible?: number | string;
  availableBalance?: number | string;
  saldoPendiente?: number | string;
  pendingBalance?: number | string;
  moneda?: string;
  currency?: string;
  metodoRetiro?: string;
  withdrawMethod?: string;
  estado?: string;
  status?: string;
};

export type SpecialistEarningsSummary = {
  ingresosTotales?: number | string;
  totalEarnings?: number | string;
  ingresosMes?: number | string;
  monthlyEarnings?: number | string;
  pagosPendientes?: number | string;
  pendingPayments?: number | string;
  comisiones?: number | string;
  commissions?: number | string;
  serviciosPagados?: number | string;
  paidServices?: number | string;
};

export type SpecialistTransaction = {
  id?: string;
  transactionId?: string;
  cliente?: string;
  customer?: string;
  clientName?: string;
  proyecto?: string;
  project?: string;
  service?: string;
  servicio?: string;
  monto?: number | string;
  amount?: number | string;
  comision?: number | string;
  commission?: number | string;
  estado?: string;
  status?: string;
  tipo?: string;
  type?: string;
  fecha?: string;
  date?: string;
  createdAt?: string;
  moneda?: string;
  currency?: string;
};

export type CreateSpecialistWithdrawalInput = {
  monto: number;
};

export type SpecialistWithdrawalResponse = {
  monto?: string;
  mensaje?: string;
  fechaEstimada?: string;
};

export type SpecialistReview = {
  id?: string;
  reviewId?: string;
  usuario?: string;
  user?: string;
  cliente?: string;
  customer?: string;
  comentario?: string;
  comment?: string;
  rating?: number | string;
  stars?: number | string;
  estrellas?: number | string;
  fecha?: string;
  date?: string;
  createdAt?: string;
  servicio?: string;
  service?: string;
};

export type RespondSpecialistReviewInput = {
  respuesta: string;
};

export type SpecialistReviewRespondResponse = {
  respuesta?: string;
  mensaje?: string;
};

export type SpecialistCertification = {
  id?: string;
  certificationId?: string;
  titulo?: string;
  title?: string;
  nombre?: string;
  name?: string;
  institucion?: string;
  entidad?: string;
  issuer?: string;
  emisor?: string;
  estado?: string;
  status?: string;
  fechaObtencion?: string;
  fecha?: string;
  date?: string;
  issuedAt?: string;
  archivoUrl?: string;
  credentialUrl?: string;
  url?: string;
};

export type CreateSpecialistCertificationInput = {
  nombre: string;
  institucion?: string;
  fechaObtencion?: string;
  archivoUrl?: string;
};

export type CreateSpecialistCertificationResponse = {
  id: string;
  mensaje: string;
};

export type SpecialistAiInsightPayload = {
  summary?: string;
  resumen?: string;
  dataPoints?: string[];
  datos?: string[];
  advice?: string;
  consejo?: string;
  nextStep?: string;
  siguientePaso?: string;
  actionPlan?: string[];
  planAccion?: string[];
  watchItems?: string[];
  indicadores?: string[];
  priority?: string;
  prioridad?: string;
  confidence?: string;
  confianza?: string;
  focusLabel?: string;
  etiquetaFoco?: string;
  focusHref?: string;
  enlaceFoco?: string;
};

export type SpecialistAiInsights = {
  recommendedQuestions?: string[];
  preguntasRecomendadas?: string[];
  scenarioPrompts?: { title?: string; titulo?: string; prompt?: string; impact?: string; impacto?: string }[];
  prompts?: { title?: string; titulo?: string; prompt?: string; impact?: string; impacto?: string }[];
  radarBars?: { label?: string; etiqueta?: string; value?: number | string; valor?: number | string }[];
  radar?: { label?: string; etiqueta?: string; value?: number | string; valor?: number | string }[];
  insight?: SpecialistAiInsightPayload;
  value?: SpecialistAiInsights;
  data?: SpecialistAiInsights;
};

export type SpecialistAiQueryRequest = {
  consulta: string;
};

export type SpecialistAiQueryResponse = SpecialistAiInsightPayload & {
  value?: SpecialistAiInsightPayload;
  data?: SpecialistAiInsightPayload;
};

export type PricingSuggestionRequest = {
  serviceId?: string;
  serviceName?: string;
};

export type PricingSuggestionResponse = SpecialistAiQueryResponse;

export type SpecialistImprovementPlanRequest = {
  focus?: string;
};

export type SpecialistImprovementPlanResponse = SpecialistAiQueryResponse;

export type SpecialistScheduleOptimizationResponse = SpecialistAiQueryResponse;

type ListResponse<T> = {
  value: T[];
  Count: number;
};

export async function loginTechMarket(email?: string, password?: string) {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: {
      email: email ?? "admin@gmail.com",
      password: password ?? "admin",
    },
  });
}

export async function getSpecialistProfile(token: string, userId: string) {
  return apiRequest<SpecialistProfile>("/api/specialists/profile", {
    token,
    userId,
  });
}

export async function getSpecialistServices(token: string, userId: string) {
  return apiRequest<SpecialistService[] | ListResponse<SpecialistService>>(
    "/api/specialists/services",
    {
      token,
      userId,
    }
  );
}

export async function createSpecialistService(
  token: string,
  userId: string,
  body: SpecialistServiceInput,
) {
  return apiRequest<CreateSpecialistServiceResponse>("/api/specialists/services", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function updateSpecialistService(
  token: string,
  userId: string,
  serviceId: string,
  body: Partial<SpecialistServiceInput>,
) {
  return apiRequest<MessageResponse>(`/api/specialists/services/${serviceId}`, {
    method: "PUT",
    token,
    userId,
    body,
  });
}

export async function deleteSpecialistService(token: string, userId: string, serviceId: string) {
  return apiRequest<MessageResponse>(`/api/specialists/services/${serviceId}`, {
    method: "DELETE",
    token,
    userId,
  });
}

export async function getSpecialistPortfolio(token: string, userId: string) {
  return apiRequest<
    SpecialistPortfolioItem[] | ListResponse<SpecialistPortfolioItem>
  >("/api/specialists/portfolio", {
    token,
    userId,
  });
}

export async function createSpecialistPortfolioItem(
  token: string,
  userId: string,
  body: SpecialistPortfolioItemInput,
) {
  return apiRequest<CreateSpecialistPortfolioItemResponse>("/api/specialists/portfolio", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function getSpecialistAvailability(token: string, userId: string) {
  return apiRequest<SpecialistAvailability>("/api/specialists/availability", {
    token,
    userId,
  });
}

export async function updateSpecialistAvailability(
  token: string,
  userId: string,
  body: SpecialistAvailabilityInput,
) {
  const { tiempoRespuesta, ...availabilityBody } = body;
  const response = await apiRequest<MessageResponse>("/api/specialists/availability", {
    method: "PUT",
    token,
    userId,
    body: availabilityBody,
  });

  if (tiempoRespuesta !== undefined && body.estado) {
    await apiRequest("/api/specialists/availability/status", {
      method: "PATCH",
      token,
      userId,
      body: {
        estado: body.estado,
        tiempoRespuesta,
      },
    });
  }

  return response;
}

export async function getSpecialistCalendar(token: string, userId: string) {
  return apiRequest<SpecialistCalendarItem[] | ListResponse<SpecialistCalendarItem>>(
    "/api/specialists/calendar",
    {
      token,
      userId,
    }
  );
}

export async function createSpecialistCalendarBlock(
  token: string,
  userId: string,
  body: SpecialistCalendarBlockInput,
) {
  return apiRequest<MessageResponse>("/api/specialists/calendar/blocks", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function deleteSpecialistCalendarBlock(token: string, userId: string, blockId: string) {
  return apiRequest<MessageResponse>(`/api/specialists/calendar/blocks/${encodeURIComponent(blockId)}`, {
    method: "DELETE",
    token,
    userId,
  });
}

export async function getSpecialistRequests(token: string, userId: string) {
  return apiRequest<SpecialistRequest[] | ListResponse<SpecialistRequest> | { data: SpecialistRequest[] }>(
    "/api/specialists/requests",
    {
      token,
      userId,
    }
  );
}

export async function respondSpecialistRequest(
  token: string,
  userId: string,
  requestId: string,
  body: RespondSpecialistRequestInput,
) {
  return apiRequest<SpecialistRequestActionResponse>(`/api/specialists/requests/${requestId}/respond`, {
    method: "PATCH",
    token,
    userId,
    body,
  });
}

export async function getSpecialistProjects(token: string, userId: string) {
  return apiRequest<SpecialistProject[] | ListResponse<SpecialistProject> | { data: SpecialistProject[] }>(
    "/api/specialists/projects",
    {
      token,
      userId,
    }
  );
}

export async function updateSpecialistProjectStatus(
  token: string,
  userId: string,
  projectId: string,
  body: UpdateSpecialistProjectStatusInput,
) {
  return apiRequest<SpecialistProjectStatusResponse>(`/api/specialists/projects/${encodeURIComponent(projectId)}/status`, {
    method: "PATCH",
    token,
    userId,
    body,
  });
}

export async function getSpecialistProjectsHistory(token: string, userId: string) {
  return apiRequest<
    SpecialistProjectHistory[] | ListResponse<SpecialistProjectHistory> | { data: SpecialistProjectHistory[] }
  >("/api/specialists/projects/history", {
    token,
    userId,
  });
}

export async function getSpecialistChats(token: string, userId: string) {
  return apiRequest<SpecialistChat[] | ListResponse<SpecialistChat> | { data: SpecialistChat[] }>(
    "/api/specialists/chats",
    {
      token,
      userId,
    }
  );
}

export async function getSpecialistChatById(token: string, userId: string, chatId: string) {
  return apiRequest<SpecialistChatDetail>(`/api/specialists/chats/${chatId}`, {
    token,
    userId,
  });
}

export async function sendSpecialistChatMessage(
  token: string,
  userId: string,
  chatId: string,
  body: CreateSpecialistChatMessageInput,
) {
  return apiRequest<CreateSpecialistChatMessageResponse>(`/api/specialists/chats/${chatId}/messages`, {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function getSpecialistFiles(token: string, userId: string) {
  return apiRequest<SpecialistFile[] | ListResponse<SpecialistFile> | { data: SpecialistFile[] }>(
    "/api/specialists/files",
    {
      token,
      userId,
    }
  );
}

export async function createSpecialistFile(token: string, userId: string, body: CreateSpecialistFileInput) {
  return apiRequest<CreateSpecialistFileResponse>("/api/specialists/files", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function deleteSpecialistFile(token: string, userId: string, fileId: string) {
  return apiRequest<MessageResponse>(`/api/specialists/files/${fileId}`, {
    method: "DELETE",
    token,
    userId,
  });
}

export async function getSpecialistWallet(token: string, userId: string) {
  return apiRequest<SpecialistWallet>("/api/specialists/wallet", {
    token,
    userId,
  });
}

export async function requestSpecialistWithdrawal(
  token: string,
  userId: string,
  body: CreateSpecialistWithdrawalInput,
) {
  return apiRequest<SpecialistWithdrawalResponse>("/api/specialists/wallet/withdraw", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function getSpecialistEarningsSummary(token: string, userId: string) {
  return apiRequest<SpecialistEarningsSummary>("/api/specialists/earnings/summary", {
    token,
    userId,
  });
}

export async function getSpecialistTransactions(token: string, userId: string) {
  return apiRequest<SpecialistTransaction[] | ListResponse<SpecialistTransaction> | { data: SpecialistTransaction[] }>(
    "/api/specialists/transactions",
    {
      token,
      userId,
    }
  );
}

export async function getSpecialistReviews(token: string, userId: string) {
  return apiRequest<SpecialistReview[] | ListResponse<SpecialistReview> | { data: SpecialistReview[] }>(
    "/api/specialists/reviews",
    {
      token,
      userId,
    }
  );
}

export async function respondSpecialistReview(
  token: string,
  userId: string,
  reviewId: string,
  body: RespondSpecialistReviewInput,
) {
  return apiRequest<SpecialistReviewRespondResponse>(`/api/specialists/reviews/${reviewId}/respond`, {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function getSpecialistCertifications(token: string, userId: string) {
  return apiRequest<SpecialistCertification[] | ListResponse<SpecialistCertification> | { data: SpecialistCertification[] }>(
    "/api/specialists/certifications",
    {
      token,
      userId,
    }
  );
}

export async function createSpecialistCertification(
  token: string,
  userId: string,
  body: CreateSpecialistCertificationInput,
) {
  return apiRequest<CreateSpecialistCertificationResponse>("/api/specialists/certifications", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function deleteSpecialistCertification(token: string, userId: string, certificationId: string) {
  return apiRequest<MessageResponse>(`/api/specialists/certifications/${certificationId}`, {
    method: "DELETE",
    token,
    userId,
  });
}

export async function getSpecialistAiInsights(token: string, userId: string) {
  return apiRequest<SpecialistAiInsights>("/api/specialists/ai/insights", {
    token,
    userId,
  });
}

export async function sendSpecialistAiQuery(token: string, userId: string, question: string) {
  return apiRequest<SpecialistAiQueryResponse>("/api/specialists/ai/query", {
    method: "POST",
    token,
    userId,
    body: { consulta: question.trim() } satisfies SpecialistAiQueryRequest,
  });
}

export async function getSpecialistPricingSuggestion(
  token: string,
  userId: string,
  body: PricingSuggestionRequest = {},
) {
  return apiRequest<PricingSuggestionResponse>("/api/specialists/ai/pricing-suggestion", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function getSpecialistImprovementPlan(
  token: string,
  userId: string,
  body: SpecialistImprovementPlanRequest = {},
) {
  return apiRequest<SpecialistImprovementPlanResponse>("/api/specialists/ai/improvement-plan", {
    method: "POST",
    token,
    userId,
    body,
  });
}

export async function getSpecialistScheduleOptimization(token: string, userId: string) {
  return apiRequest<SpecialistScheduleOptimizationResponse>("/api/specialists/ai/schedule-optimization", {
    method: "POST",
    token,
    userId,
  });
}
