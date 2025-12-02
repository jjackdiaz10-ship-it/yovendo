// Memoria temporal (se reinicia al reiniciar el server)
const sessions = {};

/**
 * Cargar o crear sesión nueva para un número de teléfono
 */
export function loadSession(phone) {
    if (!sessions[phone]) {
        sessions[phone] = {
            history: [],    // historial de conversación IA
            state: "saludo", // estado del flujo/macrogía
            cart: {}         // carrito si estás vendiendo
        };
    }
    return sessions[phone];
}

/**
 * Guardar o actualizar sesión completa
 */
export function saveSession(phone, sessionData) {
    sessions[phone] = sessionData;
}

/**
 * Resetear sesión (por si quieres comando: "reiniciar")
 */
export function resetSession(phone) {
    delete sessions[phone];
}

/**
 * (Opcional) Obtener todas las sesiones
 */
export function getAllSessions() {
    return sessions;
}
