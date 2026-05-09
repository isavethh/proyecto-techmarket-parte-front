"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Mode = "login" | "register";
type AccountType = "cliente" | "empresa" | "embajador";

type AuthViewProps = {
  initialMode: Mode;
  initialType: AccountType;
};

export default function AuthView({
  initialMode,
  initialType,
}: AuthViewProps) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [accountType, setAccountType] = useState<AccountType>(initialType);
  const [feedback, setFeedback] = useState<string>("");

  // Login fields
  const [identifier, setIdentifier] = useState(""); // correo o usuario
  const [password, setPassword] = useState("");

  // Register fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const title = useMemo(() => {
    return mode === "login" ? "Accede a tu espacio TechMarket" : accountType === "empresa" ? "Registra tu empresa en TechMarket" : "Crea tu cuenta de cliente";
  }, [accountType, mode]);

  const subtitle = useMemo(() => {
    return mode === "login" ? "Accede con tu cuenta y retoma tu espacio personalizado." : "Completa los datos para crear tu cuenta. (Interfaz, sin backend).";
  }, [mode]);

  const handleLogin = async () => {
    // placeholder: integrar API de autenticación aquí
    setFeedback("Iniciando sesión... (funcionalidad pendiente)");
    console.log("handleLogin", { identifier, password });
    // Simular resultado de placeholder
    setTimeout(() => setFeedback("Login procesado (interfaz). Conectar API para funcionamiento real."), 600);
  };

  const handleRegister = async () => {
    // placeholder: integrar API de registro aquí
    setFeedback("Registrando... (interfaz, sin backend)");
    console.log("handleRegister", { accountType, name, email, phone });
    setTimeout(() => setFeedback("Registro capturado (interfaz). Conectar API para persistencia."), 600);
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
                      Empresa
                    </button>
                  </div>
                </div>
              )}
            </div>

            <form className="mt-6 auth-row" onSubmit={onSubmit} noValidate={mode === "login"}>
              {mode === "register" && (
                <div className="auth-row two">
                  <div>
                    <label className="auth-label" htmlFor="name">
                      {accountType === "empresa" ? "Nombre comercial" : "Nombre completo"}
                    </label>
                    <input
                      className="auth-input"
                      id="name"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={accountType === "empresa" ? "TechMarket Solutions" : "Juan Perez"}
                      required
                    />
                  </div>
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
