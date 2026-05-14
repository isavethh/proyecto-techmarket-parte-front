# Endpoints pendientes para completar Embajador

## Prospectos

Endpoint actual usado:
- `GET /api/ambassadors/leads`
- `POST /api/ambassadors/leads`

Falta ampliar respuesta de leads o agregar detalle:
- `GET /api/ambassadors/leads/{leadId}` con `contacto`, `telefono`, `ciudad`, `fechaCreacion`, `proximaAccion`, `fechaProximaAccion`, `notasEmbajador` e `historialAcciones`.
- `POST /api/ambassadors/leads/{leadId}/notes` para persistir notas del embajador.
- `GET /api/ambassadors/leads/{leadId}/activity` para historial de seguimiento.

## Negocios referidos

Endpoint actual disponible:
- `GET /api/ambassadors/referrals`

Falta detalle analitico por negocio:
- `GET /api/ambassadors/referrals/{referralId}/metrics` con `monthlyLeads`, `conversionRate`, `growthRate`, `rating`, `valueScore`, `commissionGenerated` y `reputationContribution`.
- `GET /api/ambassadors/referrals/{referralId}/user-insights` con `userScore`, `userView`, `topComment`, `strengths` y `risks`.
- `GET /api/ambassadors/referrals/{referralId}/recommendations` para acciones sugeridas.

## Onboarding

Endpoints base disponibles:
- `GET /api/ambassadors/onboarding`
- `GET /api/ambassadors/onboarding/{onboardingId}`
- `GET /api/ambassadors/onboarding/{onboardingId}/tasks`
- `PATCH /api/ambassadors/onboarding/tasks/{taskId}/status`

Falta soporte para la pantalla completa:
- `GET /api/ambassadors/onboarding/{onboardingId}/snapshot` con datos de perfil, catalogo, publicaciones, evidencias y promocion.
- `POST /api/ambassadors/onboarding/{onboardingId}/notes` para notas del embajador.
- `POST /api/ambassadors/onboarding/{onboardingId}/actions` para disparar acciones como verificar registro, activar negocio o solicitar evidencias.

## Link/QR de referido

Endpoints disponibles para links:
- `GET /api/ambassadors/referral-links`
- `POST /api/ambassadors/referral-links`
- `GET /api/ambassadors/referral-links/{linkId}/qr`

Falta que el dashboard reciba o cree un link principal por defecto:
- `GET /api/ambassadors/referral-links/default`
- o incluir `defaultReferralLinkId` en `GET /api/ambassadors/profile`.

## Vision de usuarios

Actualmente la vista usa datos de demostracion.

Endpoints propuestos:
- `GET /api/ambassadors/user-vision/summary`
- `GET /api/ambassadors/user-vision/by-referral`
- `GET /api/ambassadors/user-vision/comments`
- `GET /api/ambassadors/user-vision/trends`
