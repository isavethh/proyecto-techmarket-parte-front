"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  createClientAddress,
  deleteClientAddress,
  getClientProfile,
  listClientAddresses,
  setDefaultClientAddress,
  updateClientProfile,
  type ClientAddress,
  type ClientIdentityHeaders,
} from "@/lib/api/iaApi";
import { getCurrentUserProfile } from "@/lib/api/authApi";
import {
  ClientInfoCard,
  ClientPageHeader,
  ClientQuickLinksCard,
} from "../../../components/ClientPageSections";
import {
  COMMUNITY_FEED_UPDATED_EVENT,
  CommunityFeedPost,
  mergeCommunityFeedPosts,
  readCommunityFeedPosts,
} from "../../../lib/communityFeed";
import {
  FOLLOW_UPDATED_EVENT,
  readFollowing,
  toggleFollow,
  type FollowedAccount,
} from "../../../lib/followStore";

const EMPTY_FEED_SNAPSHOT: CommunityFeedPost[] = [];
const EMPTY_FOLLOWING_SNAPSHOT: FollowedAccount[] = [];
type EditableClientProfile = {
  name: string;
  email: string;
  city: string;
  residenceArea: string;
  bio: string;
  phone: string;
  avatar: string;
};

type AddressDraft = {
  titulo: string;
  pais: string;
  ciudad: string;
  direccion: string;
  referencia: string;
  esPredeterminada: boolean;
};

const emptyAddressDraft: AddressDraft = {
  titulo: "",
  pais: "Bolivia",
  ciudad: "",
  direccion: "",
  referencia: "",
  esPredeterminada: false,
};

const subscribeCommunityFeed = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "techmarket.community.feed") {
      onStoreChange();
    }
  };

  const handleFeedUpdate = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(COMMUNITY_FEED_UPDATED_EVENT, handleFeedUpdate);
  };
};

const subscribeFollowing = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "techmarket.following") onStoreChange();
  };
  const handleUpdate = () => onStoreChange();
  window.addEventListener("storage", handleStorage);
  window.addEventListener(FOLLOW_UPDATED_EVENT, handleUpdate);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(FOLLOW_UPDATED_EVENT, handleUpdate);
  };
};

const formatPublishedAt = (isoDate: string): string => {
  const parsed = Date.parse(isoDate);

  if (Number.isNaN(parsed)) {
    return "Reciente";
  }

  const date = new Date(parsed);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes} UTC`;
};

const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((token) => token[0]?.toUpperCase() ?? "")
    .join("") || "US";

const toClientProfileSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "perfil";

function ClienteUsuarioPerfilContent() {
  const params = useParams<{ slug: string | string[] }>();
  const slugValue = Array.isArray(params.slug) ? (params.slug[0] ?? "") : params.slug;
  const normalizedSlug = toClientProfileSlug(slugValue);

  const profile = {
    slug: normalizedSlug,
    name: "",
    email: "",
    city: "",
    residenceArea: "",
    bio: "",
    account: "Cliente",
    generalInfo: [] as string[],
  };
  const [ownSlug, setOwnSlug] = useState<string | null>(null);
  const isOwnProfile = ownSlug === null || ownSlug === normalizedSlug;
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editableProfile, setEditableProfile] = useState<EditableClientProfile>({
    name: "",
    email: "",
    city: "",
    residenceArea: "",
    bio: "",
    phone: "",
    avatar: "",
  });
  const [addresses, setAddresses] = useState<ClientAddress[]>([]);
  const [addressDraft, setAddressDraft] = useState<AddressDraft>(emptyAddressDraft);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const followingAccounts = useSyncExternalStore(
    subscribeFollowing,
    readFollowing,
    () => EMPTY_FOLLOWING_SNAPSHOT,
  );
  const isFollowed = followingAccounts.some((a) => a.id === normalizedSlug);

  const dynamicFeedPosts = useSyncExternalStore(
    subscribeCommunityFeed,
    readCommunityFeedPosts,
    () => EMPTY_FEED_SNAPSHOT,
  );

  const authoredPosts = useMemo(() => {
    const dynamicPosts = dynamicFeedPosts.filter(
      (post) => toClientProfileSlug(post.author) === profile.slug,
    );

    return mergeCommunityFeedPosts(dynamicPosts);
  }, [dynamicFeedPosts, profile.slug]);

  useEffect(() => {
    const initialProfile: EditableClientProfile = {
      name: isOwnProfile ? "" : profile.name,
      email: isOwnProfile ? "" : profile.email,
      city: isOwnProfile ? "" : profile.city,
      residenceArea: isOwnProfile ? "" : profile.residenceArea,
      bio: isOwnProfile ? "" : profile.bio,
      phone: "",
      avatar: "",
    };

    if (!isOwnProfile || typeof window === "undefined") {
      setEditableProfile(initialProfile);
      setIsEditingProfile(false);
      return;
    }

    setEditableProfile(initialProfile);
  }, [
    isOwnProfile,
    profile.bio,
    profile.city,
    profile.email,
    profile.name,
    profile.residenceArea,
  ]);

  useEffect(() => {
    let active = true;

    const loadRemoteProfile = async () => {
      try {
        // IAM es la fuente de identidad (nombre/apellido/email reales del usuario
        // logueado). Es opcional: si falla, seguimos con lo que tenga TechMarket-IA.
        let identity: ClientIdentityHeaders | undefined;
        let iamName = "";
        let iamEmail = "";
        let iamPhone = "";
        let iamCity = "";
        try {
          const iam = await getCurrentUserProfile();
          identity = {
            email: iam.email,
            nombre: iam.nombre,
            apellido: iam.apellido,
            telefono: iam.telefono ?? "",
          };
          iamName = [iam.nombre, iam.apellido].filter(Boolean).join(" ").trim();
          iamEmail = iam.email ?? "";
          iamPhone = iam.telefono ?? "";
          iamCity = iam.ciudad ?? "";
        } catch {
          // IAM opcional; TechMarket-IA aprovisiona igual con lo que haya.
        }

        // Pasamos la identidad para que TechMarket-IA aprovisione (lazy) la fila.
        const [remoteProfile, remoteAddresses] = await Promise.all([
          getClientProfile(identity),
          listClientAddresses(),
        ]);

        if (!active) {
          return;
        }

        const remoteName = [remoteProfile.nombre, remoteProfile.apellido]
          .filter(Boolean)
          .join(" ")
          .trim();
        const fullName = iamName || remoteName;

        const computedOwnSlug = toClientProfileSlug(
          fullName || iamEmail || remoteProfile.email || "perfil",
        );
        setOwnSlug(computedOwnSlug);

        setEditableProfile((current) => ({
          ...current,
          name: fullName || current.name,
          email: iamEmail || remoteProfile.email || current.email,
          city: iamCity || current.city,
          phone: iamPhone || remoteProfile.telefono || "",
          avatar: remoteProfile.avatar ?? "",
        }));
        setAddresses(remoteAddresses);
        setProfileError(null);
      } catch (error) {
        if (active) {
          setOwnSlug("__unknown__");
          setProfileError(error instanceof Error ? error.message : "No se pudo cargar perfil");
        }
      }
    };

    loadRemoteProfile();

    return () => {
      active = false;
    };
  }, []);

  const profileView = isOwnProfile
    ? { ...profile, ...editableProfile, generalInfo: [] }
    : profile;

  const handleProfileSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOwnProfile || typeof window === "undefined") {
      return;
    }

    const normalizedProfile: EditableClientProfile = {
      name: editableProfile.name.trim(),
      email: editableProfile.email.trim(),
      city: editableProfile.city.trim(),
      residenceArea: editableProfile.residenceArea.trim(),
      bio: editableProfile.bio.trim(),
      phone: editableProfile.phone.trim(),
      avatar: editableProfile.avatar.trim(),
    };

    setIsSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);

    try {
      const [nombre, ...apellidoParts] = normalizedProfile.name.split(" ").filter(Boolean);
      const apellido = apellidoParts.join(" ");
      const updatedProfile = await updateClientProfile(
        {
          nombre: nombre || normalizedProfile.name,
          apellido,
          telefono: normalizedProfile.phone,
          avatar: normalizedProfile.avatar,
        },
        {
          email: normalizedProfile.email,
          nombre: nombre || normalizedProfile.name,
          apellido,
          telefono: normalizedProfile.phone,
        },
      );

      const remoteName = [updatedProfile.nombre, updatedProfile.apellido].filter(Boolean).join(" ");
      const nextProfile = {
        ...normalizedProfile,
        name: remoteName || normalizedProfile.name,
        email: updatedProfile.email || normalizedProfile.email,
        phone: updatedProfile.telefono ?? normalizedProfile.phone,
        avatar: updatedProfile.avatar ?? normalizedProfile.avatar,
      };

      setEditableProfile(nextProfile);
      setProfileMessage("Perfil actualizado correctamente");
      setIsEditingProfile(false);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "No se pudo actualizar perfil");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCreateAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileMessage(null);
    setProfileError(null);

    try {
      const createdAddress = await createClientAddress({
        titulo: addressDraft.titulo.trim(),
        pais: addressDraft.pais.trim(),
        ciudad: addressDraft.ciudad.trim(),
        direccion: addressDraft.direccion.trim(),
        referencia: addressDraft.referencia.trim(),
        esPredeterminada: addressDraft.esPredeterminada,
      });
      const nextAddresses = addressDraft.esPredeterminada
        ? addresses.map((address) => ({ ...address, esPredeterminada: false }))
        : addresses;
      setAddresses([createdAddress, ...nextAddresses]);
      setAddressDraft(emptyAddressDraft);
      setProfileMessage("Direccion creada correctamente");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "No se pudo crear direccion");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    setProfileMessage(null);
    setProfileError(null);

    try {
      await deleteClientAddress(addressId);
      setAddresses((current) => current.filter((address) => address.id !== addressId));
      setProfileMessage("Direccion eliminada correctamente");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "No se pudo eliminar direccion");
    }
  };

  const handleDefaultAddress = async (addressId: string) => {
    setProfileMessage(null);
    setProfileError(null);

    try {
      await setDefaultClientAddress(addressId);
      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          esPredeterminada: address.id === addressId,
        })),
      );
      setProfileMessage("Direccion establecida como predeterminada");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "No se pudo actualizar direccion");
    }
  };

  return (
    <div className="flex-1 pb-8">
      <ClientPageHeader sectionLabel="Perfil de usuario" />

      <main className="mx-auto mt-5 grid w-full max-w-[1500px] gap-6 px-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="chat-scrollbar space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
          <ClientInfoCard
            eyebrow="PERFIL CLIENTE"
            title={profileView.name}
            description="Perfil publico del usuario dentro de la comunidad cliente de TechMarket."
          >
            <div className="mt-4 rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-3 text-xs text-cyan-100/80">
              <div className="flex items-center justify-between gap-3">
                <span>Ciudad</span>
                <strong className="text-cyan-50">{profileView.city}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Area de residencia</span>
                <strong className="text-cyan-50">{profileView.residenceArea}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Estado</span>
                <strong className="text-cyan-50">{profile.account}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span>Publicaciones</span>
                <strong className="text-cyan-50">{authoredPosts.length}</strong>
              </div>
            </div>
            {isOwnProfile ? (
              <p className="mt-3 text-xs text-cyan-200/80">Este es tu perfil. Puedes editar tus datos visibles.</p>
            ) : null}
          </ClientInfoCard>

          <ClientQuickLinksCard
            links={[
              { href: "/cliente", label: "Volver al feed" },
              { href: "/cliente/chat", label: "Ir a mis chats" },
              { href: "/cliente/comunidades", label: "Explorar comunidades" },
            ]}
          />
        </aside>

        <section className="space-y-6">
          <section className="overflow-hidden rounded-3xl border border-cyan-100/10 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_32%),linear-gradient(180deg,_rgba(8,18,31,0.96),_rgba(5,12,22,0.98))] shadow-2xl shadow-slate-950/30">
            <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr] md:p-8">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100/10 bg-gradient-to-br from-cyan-300 to-blue-600 text-2xl font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                    {getInitials(profileView.name)}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">Perfil de usuario</p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{profileView.name}</h1>
                    <p className="mt-2 text-sm text-cyan-100/80">{profileView.email}</p>
                  </div>
                </div>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-cyan-100/85">{profileView.bio}</p>

                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-cyan-100/10 bg-cyan-400/10 px-4 py-2 text-cyan-100">
                    {profileView.city}
                  </span>
                  <span className="rounded-full border border-cyan-100/10 bg-white/5 px-4 py-2 text-cyan-100/85">
                    {profileView.residenceArea}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-cyan-100/10 bg-slate-950/40 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Informacion general</p>
                <div className="mt-4 space-y-2">
                  {profileView.generalInfo.map((item) => (
                    <div key={item} className="rounded-xl border border-cyan-100/10 bg-white/5 px-3 py-2 text-sm text-cyan-100/85">
                      {item}
                    </div>
                  ))}
                </div>
                {isOwnProfile ? (
                  <button
                    type="button"
                    disabled
                    className="mt-4 inline-flex cursor-not-allowed rounded-xl border border-cyan-100/15 bg-white/5 px-3 py-2 text-sm font-semibold text-cyan-100/65"
                  >
                    No puedes enviarte mensajes a ti mismo
                  </button>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        toggleFollow({ id: normalizedSlug, name: profileView.name || normalizedSlug, type: "usuario" })
                      }
                      className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                        isFollowed
                          ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-300 hover:bg-cyan-300/10"
                          : "border-cyan-100/20 bg-white/5 text-cyan-50 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
                      }`}
                    >
                      {isFollowed ? "✓ Siguiendo" : "+ Seguir"}
                    </button>
                    <Link
                      href="/cliente/chat"
                      className="inline-flex rounded-xl border border-cyan-100/20 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/20"
                    >
                      Enviar mensaje
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>

          {isOwnProfile ? (
            <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Perfil editable</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Gestiona tus datos visibles</h2>
                </div>
                {!isEditingProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="rounded-xl border border-cyan-100/20 bg-cyan-300/12 px-4 py-2 text-sm font-semibold text-cyan-50 transition hover:bg-cyan-300/18"
                  >
                    Editar perfil
                  </button>
                ) : null}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSave} className="mt-5 grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-name">Nombre</label>
                    <input
                      id="profile-name"
                      value={editableProfile.name}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, name: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-email">Correo</label>
                    <input
                      id="profile-email"
                      value={editableProfile.email}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, email: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-phone">Telefono</label>
                    <input
                      id="profile-phone"
                      value={editableProfile.phone}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, phone: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-avatar">Avatar URL</label>
                    <input
                      id="profile-avatar"
                      value={editableProfile.avatar}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, avatar: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-city">Ciudad</label>
                    <input
                      id="profile-city"
                      value={editableProfile.city}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, city: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-area">Area de residencia</label>
                    <input
                      id="profile-area"
                      value={editableProfile.residenceArea}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, residenceArea: event.target.value }))
                      }
                      className="auth-input mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-cyan-100/75" htmlFor="profile-bio">Bio</label>
                    <textarea
                      id="profile-bio"
                      value={editableProfile.bio}
                      onChange={(event) =>
                        setEditableProfile((current) => ({ ...current, bio: event.target.value }))
                      }
                      rows={4}
                      className="auth-input mt-1 min-h-[110px] resize-y"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditableProfile({
                          name: profileView.name,
                          email: profileView.email,
                          city: profileView.city,
                          residenceArea: profileView.residenceArea,
                          bio: profileView.bio,
                          phone: editableProfile.phone,
                          avatar: editableProfile.avatar,
                        });
                        setIsEditingProfile(false);
                      }}
                      className="rounded-xl border border-cyan-100/15 bg-white/5 px-4 py-2 text-sm font-semibold text-cyan-100/80"
                    >
                      Cancelar
                    </button>
                    <button type="submit" disabled={isSavingProfile} className="tech-button tech-button-primary">
                      {isSavingProfile ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-4 text-sm text-cyan-100/78">
                  Tus cambios se guardan usando la API de cliente autenticado.
                </p>
              )}
              {profileMessage ? <p className="mt-3 text-sm text-emerald-200">{profileMessage}</p> : null}
              {profileError ? <p className="mt-3 text-sm text-amber-200">{profileError}</p> : null}
            </section>
          ) : null}

          {isOwnProfile ? (
            <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Direcciones</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Gestiona tus direcciones</h2>
                </div>
                <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/90">
                  {addresses.length} guardadas
                </span>
              </div>

              <form onSubmit={handleCreateAddress} className="mt-5 grid gap-3 md:grid-cols-2">
                <input
                  value={addressDraft.titulo}
                  onChange={(event) =>
                    setAddressDraft((current) => ({ ...current, titulo: event.target.value }))
                  }
                  placeholder="Titulo, ej. Casa"
                  className="auth-input"
                  required
                />
                <input
                  value={addressDraft.ciudad}
                  onChange={(event) =>
                    setAddressDraft((current) => ({ ...current, ciudad: event.target.value }))
                  }
                  placeholder="Ciudad"
                  className="auth-input"
                  required
                />
                <input
                  value={addressDraft.pais}
                  onChange={(event) =>
                    setAddressDraft((current) => ({ ...current, pais: event.target.value }))
                  }
                  placeholder="Pais"
                  className="auth-input"
                  required
                />
                <input
                  value={addressDraft.referencia}
                  onChange={(event) =>
                    setAddressDraft((current) => ({ ...current, referencia: event.target.value }))
                  }
                  placeholder="Referencia"
                  className="auth-input"
                />
                <textarea
                  value={addressDraft.direccion}
                  onChange={(event) =>
                    setAddressDraft((current) => ({ ...current, direccion: event.target.value }))
                  }
                  placeholder="Direccion completa"
                  className="auth-input min-h-[90px] md:col-span-2"
                  required
                />
                <label className="flex items-center gap-2 text-sm text-cyan-100/80">
                  <input
                    type="checkbox"
                    checked={addressDraft.esPredeterminada}
                    onChange={(event) =>
                      setAddressDraft((current) => ({
                        ...current,
                        esPredeterminada: event.target.checked,
                      }))
                    }
                  />
                  Usar como predeterminada
                </label>
                <div className="flex justify-end md:col-span-2">
                  <button type="submit" className="tech-button tech-button-primary">
                    Crear direccion
                  </button>
                </div>
              </form>

              <div className="mt-5 grid gap-3">
                {addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-cyan-100/18 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                    Aun no tienes direcciones guardadas.
                  </div>
                ) : (
                  addresses.map((address) => (
                    <article key={address.id} className="rounded-2xl border border-cyan-100/12 bg-slate-950/35 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-cyan-50">{address.titulo}</p>
                          <p className="mt-1 text-sm text-cyan-100/80">
                            {address.direccion} · {address.ciudad}, {address.pais}
                          </p>
                          {address.referencia ? (
                            <p className="mt-1 text-xs text-cyan-200/70">{address.referencia}</p>
                          ) : null}
                        </div>
                        {address.esPredeterminada ? (
                          <span className="rounded-full border border-emerald-200/25 bg-emerald-300/12 px-3 py-1 text-xs text-emerald-100">
                            Predeterminada
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {!address.esPredeterminada ? (
                          <button
                            type="button"
                            onClick={() => handleDefaultAddress(address.id)}
                            className="rounded-xl border border-cyan-100/15 bg-cyan-300/12 px-3 py-2 text-xs font-semibold text-cyan-50"
                          >
                            Hacer predeterminada
                          </button>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="rounded-xl border border-rose-200/20 bg-rose-300/10 px-3 py-2 text-xs font-semibold text-rose-100"
                        >
                          Eliminar
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          ) : null}

          <section className="rounded-3xl border border-cyan-100/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/65">Publicaciones</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Todas las publicaciones de {profileView.name}</h2>
              </div>
              <span className="rounded-full border border-cyan-100/15 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/90">
                {authoredPosts.length} publicaciones
              </span>
            </div>

            {authoredPosts.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-cyan-100/18 bg-slate-950/35 p-4 text-sm text-cyan-100/75">
                Este usuario aun no tiene publicaciones visibles en la comunidad.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {authoredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-3xl border border-cyan-100/15 bg-[linear-gradient(165deg,rgba(16,41,72,0.92),rgba(7,24,44,0.96))] p-4 shadow-xl shadow-slate-950/25"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-cyan-50">{post.author}</p>
                        <p className="text-xs text-cyan-200/70">
                          {post.role} · {post.location} · {formatPublishedAt(post.createdAt)}
                        </p>
                      </div>
                      <span className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-100/85">
                        {post.tag}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-semibold text-cyan-50">{post.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-cyan-100/85">{post.body}</p>

                    {post.image ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-cyan-100/10">
                        <img src={post.image} alt={post.title} className="h-56 w-full object-cover" loading="lazy" />
                      </div>
                    ) : null}

                    <div className="mt-4 border-t border-cyan-100/10 pt-3 text-xs text-cyan-200/75">
                      {post.time || formatPublishedAt(post.createdAt)}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default function ClienteUsuarioPerfilPage() {
  return (
    <Suspense fallback={<div className="flex-1 pb-8" />}>
      <ClienteUsuarioPerfilContent />
    </Suspense>
  );
}
