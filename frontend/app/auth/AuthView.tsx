"use client";

import { login, register } from "@/lib/api/authApi";
import { getUser } from "@/lib/auth/tokenStore";
import { getRedirectPathByUserType } from "@/lib/auth/redirectHelper";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type Mode = "login" | "register";
type AccountType = "cliente" | "empresa" | "especialista";

type AuthViewProps = {
  initialMode: Mode;
  initialType: AccountType;
};

export default function AuthView({
  initialMode,
  initialType,
}: AuthViewProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [accountType, setAccountType] = useState<AccountType>(initialType);
  const [feedback, setFeedback] = useState<string>("");

  // Login fields
  const [identifier, setIdentifier] = useState(""); // correo o usuario
  const [password, setPassword] = useState("");

  // Register fields
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const title = useMemo(() => {
    if (mode === "login") return "Accede a tu espacio TechMarket";

    switch (accountType) {
      case "empresa":
        return "Crea tu cuenta de negocio";
      case "especialista":
        return "Crea tu cuenta de técnico";
      default:
        return "Crea tu cuenta de cliente";
    }
  }, [accountType, mode]);

  const subtitle = useMemo(() => {
    return mode === "login" ? "Accede con tu cuenta y retoma tu espacio personalizado." : "Completa los datos para crear tu cuenta.";
  }, [mode]);

  const handleLogin = async () => {
    const email = identifier.trim();

    if (!email || !password) {
      setFeedback("Completa correo y contraseña.");
      return;
    }

    try {
      setFeedback("Iniciando sesión...");
      await login({ email, password });
      setFeedback("Sesión iniciada correctamente.");
      
      // Obtener tipo de usuario desde sesión y redirigir
      const user = getUser() as Partial<{ tipo?: string }> | null;
      const redirectPath = getRedirectPathByUserType(user?.tipo);
      router.push(redirectPath);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
    }
  };

  const handleRegister = async () => {
    const trimmedNombre = nombre.trim();
    const trimmedApellido = apellido.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedPais = "";
    const trimmedCiudad = "";

    if (!trimmedNombre || !trimmedApellido || !trimmedEmail || !password) {
      setFeedback("Completa nombre, apellido, correo y contraseña.");
      return;
    }

    if (password !== confirmPassword) {
      setFeedback("Las contraseñas no coinciden.");
      return;
    }

    try {
      setFeedback("Registrando...");
      await register({
        email: trimmedEmail,
        password,
        confirmPassword,
        tipo: accountType,
        nombre: trimmedNombre,
        apellido: trimmedApellido,
        telefono: trimmedPhone,
        pais: trimmedPais || "Bolivia",
        ciudad: trimmedCiudad || "Santa Cruz",
        terminos: true,
      });
      setFeedback("Registro completado correctamente.");
      
      // Obtener tipo de usuario desde sesión y redirigir
      const user = getUser() as Partial<{ tipo?: string }> | null;
      const redirectPath = getRedirectPathByUserType(user?.tipo);
      router.push(redirectPath);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "No se pudo completar el registro.");
    }
  };

  const handleSelectAccountType = (type: AccountType) => {
    setAccountType(type);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    if (mode === "login") {
      handleLogin();
      return;
    }

    handleRegister();
  };

  return (
    <div className="flex-1 pb-12">
      <header className="tech-top-nav sticky top-0 z-20">
        <div className="tech-shell flex items-center justify-between py-4">
          <Link href="/" className="font-semibold text-cyan-100/90">
            TechMarket
          </Link>
          <span className="tech-chip">Acceso seguro</span>
        </div>
      </header>

      <main className="mt-8 md:mt-10 flex items-center justify-center w-full">
        <div className="flex items-center justify-center min-h-[calc(100vh-9rem)] w-full">
          <section className="auth-layout w-full max-w-3xl mx-auto" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <article className="auth-panel auth-panel-main mx-auto">
            <div className="auth-orb" aria-hidden="true" />
            <p className="tech-mono text-xs text-cyan-300/80">AUTH GATE</p>
            <h1 className="auth-title mt-2 text-cyan-50">{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>

            <div className="mt-6 flex flex-col gap-4">
              {mode === "register" && (
                  <div>
                    <p className="auth-label">Tipo de cuenta</p>
                    <div className="auth-pill-group">
                      <button
                        type="button"
                        className={`auth-pill ${accountType === "cliente" ? "active" : ""}`}
                        onClick={() => handleSelectAccountType("cliente")}
                      >
                        Cliente
                      </button>
                      <button
                        type="button"
                        className={`auth-pill ${accountType === "empresa" ? "active" : ""}`}
                        onClick={() => handleSelectAccountType("empresa")}
                      >
                        Negocio
                      </button>
                      <button
                        type="button"
                        className={`auth-pill ${accountType === "especialista" ? "active" : ""}`}
                        onClick={() => handleSelectAccountType("especialista")}
                      >
                        Técnico
                      </button>
                    </div>
                  </div>
              )}
            </div>

            <form className="mt-6 auth-row" onSubmit={onSubmit} noValidate={mode === "login"}>
              {mode === "register" && (
                <div className="auth-row two">
                  <div>
                    <label className="auth-label" htmlFor="nombre">
                      Nombre
                    </label>
                    <input
                      className="auth-input"
                      id="nombre"
                      name="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Juan"
                      required
                    />
                  </div>
                  <div>
                    <label className="auth-label" htmlFor="apellido">
                      Apellido
                    </label>
                    <input
                      className="auth-input"
                      id="apellido"
                      name="apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Perez"
                      required
                    />
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div>
                  <label className="auth-label" htmlFor="phone">
                    Teléfono
                  </label>
                  <input
                    className="auth-input"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+57 300 000 0000"
                  />
                </div>
              )}

              <div>
                <label className="auth-label" htmlFor="identifier">
                  {mode === "login" ? "Correo o usuario" : "Correo"}
                </label>
                <input
                  className="auth-input"
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={mode === "login" ? identifier : email}
                  onChange={(e) => (mode === "login" ? setIdentifier(e.target.value) : setEmail(e.target.value))}
                  placeholder={mode === "login" ? "correo@o_usuario" : "correo@ejemplo.com"}
                  required
                />
              </div>

              <div>
                <label className="auth-label" htmlFor="password">
                  Contraseña
                </label>
                <input
                  className="auth-input"
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>

              {mode === "register" && (
                <div>
                  <label className="auth-label" htmlFor="confirmPassword">
                    Confirmar contraseña
                  </label>
                  <input
                    className="auth-input"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    required
                  />
                </div>
              )}

              {mode === "login" && (
                <div className="auth-inline">
                  <label className="auth-checkbox">
                    <input type="checkbox" name="remember" />
                    Recordarme en este dispositivo
                  </label>
                  <button type="button" className="auth-link">
                    Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <button type="submit" className="tech-button tech-button-primary mt-2">
                {mode === "login" ? "Ingresar" : "Crear cuenta"}
              </button>
            </form>

            <div className="mt-4 text-sm text-cyan-100/80">
              {mode === "login" ? (
                <p>
                  ¿No tienes cuenta?{' '}
                  <button className="auth-link" onClick={() => { setMode('register'); setFeedback(''); }}>
                    Crear cuenta
                  </button>
                </p>
              ) : (
                <p>
                  ¿Ya tienes cuenta?{' '}
                  <button className="auth-link" onClick={() => { setMode('login'); setFeedback(''); }}>
                    Iniciar sesión
                  </button>
                </p>
              )}
            </div>

            {feedback && <p className="auth-message mt-4">{feedback}</p>}
          </article>

          </section>
        </div>
      </main>
    </div>
  );
}
