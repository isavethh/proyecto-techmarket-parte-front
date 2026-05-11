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
import {
  specialistCertifications,
  specialistKpis,
  specialistReviews,
  type SpecialistCertificationItem,
  type UserReview,
} from "../specialistData";
import { debugSpecialistResult, getDatasetSource, normalizeBackendList, type DatasetSource } from "./specialistBackendHelpers";

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

export function mapBackendReviewToUiReview(review: SpecialistReview, index: number): UserReview {
  return {
    id: text(review.id ?? review.reviewId, `review-${index}`),
    user: text(review.usuario ?? review.user ?? review.cliente ?? review.customer, "Cliente no especificado"),
    comment: text(review.comentario ?? review.comment, "Resena sin comentario."),
    stars: rating(review.rating ?? review.stars ?? review.estrellas),
    date: text(review.fecha ?? review.date ?? review.createdAt, "Fecha no disponible"),
    service: text(review.servicio ?? review.service, "Servicio no especificado"),
  };
}

export function mapBackendCertificationToUiCertification(
  certification: SpecialistCertification,
  index: number,
): SpecialistCertificationItem {
  return {
    id: text(certification.id ?? certification.certificationId, `certification-${index}`),
    title: text(certification.titulo ?? certification.title ?? certification.nombre ?? certification.name, "Certificacion tecnica"),
    issuer: text(certification.institucion ?? certification.entidad ?? certification.issuer ?? certification.emisor, "Entidad no especificada"),
    status: text(certification.estado ?? certification.status, "Pendiente"),
    date: text(certification.fechaObtencion ?? certification.fecha ?? certification.date ?? certification.issuedAt, "Fecha no disponible"),
    credentialUrl: typeof (certification.archivoUrl ?? certification.credentialUrl ?? certification.url) === "string"
      ? certification.archivoUrl ?? certification.credentialUrl ?? certification.url
      : undefined,
  };
}

function calculateKpis(reviews: UserReview[]) {
  if (reviews.length === 0) {
      return { ...specialistKpis, averageRating: 0, totalReviews: 0 };
  }

  const totalStars = reviews.reduce((total, review) => total + review.stars, 0);

  return {
    ...specialistKpis,
    averageRating: Number((totalStars / reviews.length).toFixed(1)),
    totalReviews: reviews.length,
  };
}

export function useSpecialistReviewsCertificationsData() {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [certifications, setCertifications] = useState<SpecialistCertificationItem[]>([]);
  const [kpis, setKpis] = useState({ ...specialistKpis, averageRating: 0, totalReviews: 0 });
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
      const [reviewsResult, certificationsResult] = await Promise.allSettled([
        getSpecialistReviews(currentAuth.token, currentAuth.userId),
        getSpecialistCertifications(currentAuth.token, currentAuth.userId),
      ]);

      debugSpecialistResult("[specialist reviews]", reviewsResult);
      debugSpecialistResult("[specialist certifications]", certificationsResult);

      setAuth(currentAuth);

      if (reviewsResult.status === "fulfilled") {
        const backendReviews = normalizeBackendList<SpecialistReview>(reviewsResult.value);
        const uiReviews = backendReviews.map(mapBackendReviewToUiReview);
        setReviews(uiReviews);
        setKpis(calculateKpis(uiReviews));
        setReviewsSource(getDatasetSource(backendReviews));
      } else {
        setReviews(specialistReviews);
        setKpis(specialistKpis);
        setReviewsSource("fallback");
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
      setKpis(specialistKpis);
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
        setActionSuccess("Resena respondida correctamente.");
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo responder la resena.");
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
      } catch (err) {
        setActionError(err instanceof Error ? err.message : "No se pudo registrar la certificacion.");
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
      refreshReviewsCertificationsData,
    ],
  );
}
