// Memoria temporal (se reinicia al reiniciar el server)
const sessions = {};

// Configuración
const MAX_HISTORY = 50;        // máximo número de mensajes por sesión
const SESSION_TTL = 1000 * 60 * 60 * 24; // 24 horas en ms

/**
 * Cargar o crear sesión nueva para un número de teléfono
 */
export function loadSession(phone) {
    if (!phone) throw new Error("Se requiere un número de teléfono para cargar la sesión");

    let session = sessions[phone];

    if (!session) {
        session = {
            history: [],
            state: "saludo",
            cart: {},
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        sessions[phone] = session;
    } else {
        // Revisar expiración
        if (SESSION_TTL && Date.now() - session.updatedAt > SESSION_TTL) {
            session = resetSession(phone);
        }
    }

    return structuredClone(session); // evitar referencias externas
}

/**
 * Guardar o actualizar sesión completa
 */
export function saveSession(phone, sessionData) {
    if (!phone || !sessionData) return;

    // Limitar historial
    if (Array.isArray(sessionData.history) && sessionData.history.length > MAX_HISTORY) {
        sessionData.history = sessionData.history.slice(-MAX_HISTORY);
    }

    sessionData.updatedAt = Date.now();

    sessions[phone] = structuredClone(sessionData); // copia segura
}

/**
 * Resetear sesión (reinicia todo)
 */
export function resetSession(phone) {
    if (!phone) return;
    delete sessions[phone];

    const newSession = {
        history: [],
        state: "saludo",
        cart: {},
        createdAt: Date.now(),
        updatedAt: Date.now()
    };
    sessions[phone] = newSession;
    return structuredClone(newSession);
}

/**
 * Reiniciar solo carrito
 */
export function resetCart(phone) {
    if (!sessions[phone]) return;
    sessions[phone].cart = {};
    sessions[phone].updatedAt = Date.now();
}

/**
 * (Opcional) Obtener todas las sesiones
 */
export function getAllSessions() {
    return structuredClone(sessions);
}
