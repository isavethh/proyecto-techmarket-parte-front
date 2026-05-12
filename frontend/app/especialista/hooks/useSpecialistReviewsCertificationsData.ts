"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createSpecialistCertification,
  deleteSpecialistCertification,
  getSpecialistCertifications,
  getSpecialistReviews,
  loginTechMarket,
  respondSpecialistReview,
  type CreateSpecialistCertificationInput,
  type SpecialistCertification,
  type SpecialistReview,
} from "@/lib/api/specialists";
import { apiRequest } from "@/lib/api/client";
import {
  specialistCertifications,
  specialistReviews,
  type SpecialistCertificationItem,
  type UserReview,
} from "../specialistData";
import { debugSpecialistResult, getDatasetSource, normalizeBackendList, type DatasetSource } from "./specialistBackendHelpers";

type ReputationKpis = {
  averageRating: string;
  totalReviews: string;
  jobsCompleted: string;
};

type BackendProfileStats = {
  calificacionPromedio?: number | string;
  totalResenas?: number | string;
  trabajosCompletados?: number | string;
};

type BackendReview = SpecialistReview & {
  respuestaTecnico?: string;
  respuesta?: string;
};

type UiReview = UserReview & {
  response?: string;
};

const emptyKpis: ReputationKpis = {
  averageRating: "No disponible",
  totalReviews: "No disponible",
  jobsCompleted: "No disponible",
};

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function rating(value: unknown) {
  if (typeof value === "number") {
    return Math.min(Math.max(Math.round(value), 0), 5);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), 0), 5) : 0;
  }

  return 0;
}

function metric(value: unknown) {
  if (typeof value === "number") {
    return String(value);
  }

  return text(value, "No disponible");
}

function mapBackendStatsToKpis(stats: BackendProfileStats): ReputationKpis {
  return {
    averageRating: metric(stats.calificacionPromedio),
    totalReviews: metric(stats.totalResenas),
    jobsCompleted: metric(stats.trabajosCompletados),
  };
}

export function mapBackendReviewToUiReview(review: BackendReview, index: number): UiReview {
  const response = text(review.respuestaTecnico ?? review.respuesta, "");

  return {
    id: text(review.id ?? review.reviewId, `review-${index}`),
    user: text(review.usuario ?? review.user ?? review.cliente ?? review.customer, "Cliente no especificado"),
    comment: text(review.comentario ?? review.comment, "Resena sin comentario."),
    stars: rating(review.rating ?? review.stars ?? review.estrellas),
    date: text(review.fecha ?? review.date ?? review.createdAt, "Fecha no disponible"),
    service: text(review.servicio ?? review.service, "Servicio no especificado"),
    response: response || undefined,
  };
}

export function mapBackendCertificationToUiCertification(
  certification: SpecialistCertification,
  index: number,
): SpecialistCertificationItem {
  const credentialUrl = typeof (certification.archivoUrl ?? certification.credentialUrl ?? certification.url) === "string"
    ? certification.archivoUrl ?? certification.credentialUrl ?? certification.url
    : undefined;

  return {
    id: text(certification.id ?? certification.certificationId, `certification-${index}`),
    title: text(certification.titulo ?? certification.title ?? certification.nombre ?? certification.name, "Certificacion tecnica"),
    issuer: text(certification.institucion ?? certification.entidad ?? certification.issuer ?? certification.emisor, "Entidad no especificada"),
    status: credentialUrl ? "Con respaldo" : "Sin respaldo",
    date: text(certification.fechaObtencion ?? certification.fecha ?? certification.date ?? certification.issuedAt, "Fecha no disponible"),
    credentialUrl,
  };
}

export function useSpecialistReviewsCertificationsData() {
  const [reviews, setReviews] = useState<UiReview[]>([]);
  const [certifications, setCertifications] = useState<SpecialistCertificationItem[]>([]);
  const [kpis, setKpis] = useState<ReputationKpis>(emptyKpis);
  const [auth, setAuth] = useState<{ token: string; userId: string } | null>(null);
  const [reviewsSource, setReviewsSource] = useState<DatasetSource>("empty");
  const [certificationsSource, setCertificationsSource] = useState<DatasetSource>("empty");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const refreshReviewsCertificationsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentAuth = auth ?? (await loginTechMarket().then((login) => ({ token: login.accessToken, userId: login.userId })));
      const [reviewsResult, certificationsResult, statsResult] = await Promise.allSettled([
        getSpecialistReviews(currentAuth.token, currentAuth.userId),
        getSpecialistCertifications(currentAuth.token, currentAuth.userId),
        apiRequest<BackendProfileStats>("/api/specialists/profile/stats", {
          token: currentAuth.token,
          userId: currentAuth.userId,
        }),
      ]);

      debugSpecialistResult("[specialist reviews]", reviewsResult);
      debugSpecialistResult("[specialist certifications]", certificationsResult);
      debugSpecialistResult("[specialist profile stats]", statsResult);

      setAuth(currentAuth);

      if (reviewsResult.status === "fulfilled") {
        const backendReviews = normalizeBackendList<BackendReview>(reviewsResult.value);
        const uiReviews = backendReviews.map(mapBackendReviewToUiReview);
        setReviews(uiReviews);
        setReviewsSource(getDatasetSource(backendReviews));
      } else {
        setReviews(specialistReviews);
        setReviewsSource("fallback");
      }

      if (statsResult.status === "fulfilled") {
        setKpis(mapBackendStatsToKpis(statsResult.value));
      } else {
        setKpis(emptyKpis);
      }

      if (certificationsResult.status === "fulfilled") {
        const backendCertifications = normalizeBackendList<SpecialistCertification>(certificationsResult.value);
        setCertifications(backendCertifications.map(mapBackendCertificationToUiCertification));
        setCertificationsSource(getDatasetSource(backendCertifications));
      } else {
        setCertifications(specialistCertifications);
        setCertificationsSource("fallback");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar resenas y certificaciones");
      setReviews(specialistReviews);
      setKpis(emptyKpis);
      setCertifications(specialistCertifications);
      setReviewsSource("fallback");
      setCertificationsSource("fallback");
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    let isMounted = true;

    async function loadReviewsCertificationsData() {
      if (isMounted) {
        await refreshReviewsCertificationsData();
      }
    }

    loadReviewsCertificationsData();

    return () => {
      isMounted = false;
    };
  }, [refreshReviewsCertificationsData]);

  const respondReview = useCallback(
    async (reviewId: string, responseText: string) => {
      const currentAuth = auth;

      if (!currentAuth?.token || !currentAuth.userId) {
        setActionError("No hay sesion activa para responder la resena.");
        return;
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        await respondSpecialistReview(currentAuth.token, currentAuth.userId, reviewId, { respuesta: responseText });
        await refreshReviewsCertificationsData();
        setReviews((currentReviews) =>
          currentReviews.map((review) =>
            review.id === reviewId && !review.response
              ? { ...review, response: responseText }
              : review,
          ),
        );
        setActionSuccess("Resena respondida correctamente.");
        return true;
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo responder la resena.");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [auth, refreshReviewsCertificationsData],
  );

  const createCertification = useCallback(
    async (input: CreateSpecialistCertificationInput) => {
      const currentAuth = auth;

      if (!currentAuth?.token || !currentAuth.userId) {
        setActionError("No hay sesion activa para registrar la certificacion.");
        return;
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        await createSpecialistCertification(currentAuth.token, currentAuth.userId, input);
        await refreshReviewsCertificationsData();
        setActionSuccess("Certificacion registrada correctamente.");
        return true;
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo registrar la certificacion.");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [auth, refreshReviewsCertificationsData],
  );

  const deleteCertification = useCallback(
    async (certificationId: string) => {
      const currentAuth = auth;

      if (!currentAuth?.token || !currentAuth.userId) {
        setActionError("No hay sesion activa para eliminar la certificacion.");
        return;
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        await deleteSpecialistCertification(currentAuth.token, currentAuth.userId, certificationId);
        await refreshReviewsCertificationsData();
        setActionSuccess("Certificacion eliminada correctamente.");
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo eliminar la certificacion.");
      } finally {
        setActionLoading(false);
      }
    },
    [auth, refreshReviewsCertificationsData],
  );

  const requestCertificationVerification = useCallback(
    async (certificationId: string) => {
      const currentAuth = auth;

      if (!currentAuth?.token || !currentAuth.userId) {
        setActionError("No hay sesion activa para solicitar la verificacion.");
        return false;
      }

      try {
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        await apiRequest(`/api/specialists/certifications/${encodeURIComponent(certificationId)}/verify`, {
          method: "PATCH",
          token: currentAuth.token,
          userId: currentAuth.userId,
        });
        await refreshReviewsCertificationsData();
        setActionSuccess("Solicitud de verificacion enviada correctamente.");
        return true;
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo solicitar la verificacion.");
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [auth, refreshReviewsCertificationsData],
  );

  return useMemo(
    () => ({
      reviews,
      certifications,
      kpis,
      reviewsSource,
      certificationsSource,
      loading,
      actionLoading,
      error,
      actionError,
      actionSuccess,
      respondReview,
      createCertification,
      deleteCertification,
      requestCertificationVerification,
      refreshReviewsCertificationsData,
    }),
    [
      reviews,
      certifications,
      kpis,
      reviewsSource,
      certificationsSource,
      loading,
      actionLoading,
      error,
      actionError,
      actionSuccess,
      respondReview,
      createCertification,
      deleteCertification,
      requestCertificationVerification,
      refreshReviewsCertificationsData,
    ],
  );
}
