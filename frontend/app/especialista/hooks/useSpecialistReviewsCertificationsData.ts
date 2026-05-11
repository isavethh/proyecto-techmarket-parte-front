"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSpecialistCertifications,
  getSpecialistReviews,
  loginTechMarket,
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
    issuer: text(certification.entidad ?? certification.issuer ?? certification.emisor, "Entidad no especificada"),
    status: text(certification.estado ?? certification.status, "Pendiente"),
    date: text(certification.fecha ?? certification.date ?? certification.issuedAt, "Fecha no disponible"),
    credentialUrl: typeof (certification.credentialUrl ?? certification.url) === "string" ? certification.credentialUrl ?? certification.url : undefined,
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
  const [reviewsSource, setReviewsSource] = useState<DatasetSource>("empty");
  const [certificationsSource, setCertificationsSource] = useState<DatasetSource>("empty");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadReviewsCertificationsData() {
      try {
        setLoading(true);
        setError(null);

        const login = await loginTechMarket();
        const [reviewsResult, certificationsResult] = await Promise.allSettled([
          getSpecialistReviews(login.accessToken, login.userId),
          getSpecialistCertifications(login.accessToken, login.userId),
        ]);

        if (!isMounted) {
          return;
        }

        debugSpecialistResult("[specialist reviews]", reviewsResult);
        debugSpecialistResult("[specialist certifications]", certificationsResult);

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
        if (!isMounted) {
          return;
        }

        setError(err instanceof Error ? err.message : "Error desconocido al cargar resenas y certificaciones");
        setReviews(specialistReviews);
        setKpis(specialistKpis);
        setCertifications(specialistCertifications);
        setReviewsSource("fallback");
        setCertificationsSource("fallback");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadReviewsCertificationsData();

    return () => {
      isMounted = false;
    };
  }, []);

  return useMemo(
    () => ({ reviews, certifications, kpis, reviewsSource, certificationsSource, loading, error }),
    [reviews, certifications, kpis, reviewsSource, certificationsSource, loading, error],
  );
}
