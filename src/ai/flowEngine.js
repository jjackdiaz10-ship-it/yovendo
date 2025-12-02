// src/ai/flowEngine.js

export function flowEngine(session, message) {
    const text = message.toLowerCase();
    const state = session.state || "saludo";

    // === INTENCIONES ===
    const intents = {
        greeting: /(hola|buenas|qué tal|como estas|hey)/i.test(text),
        wantsCatalog: /(catalogo|catálogo|ver productos|productos)/i.test(text),
        wantsPrice: /(precio|cuánto vale|cuanto cuesta)/i.test(text),
        wantsBuy: /(comprar|quiero uno|lo llevo|me interesa|lo quiero)/i.test(text),
        wantsPay: /(pagar|link de pago|cómo pago|pago)/i.test(text),
        compare: /(comparar|diferencia|vs|cual es mejor)/i.test(text)
    };

    // === PRODUCTOS (Placeholder hasta que uses BD) ===
    const productos = {
        celulares: ["iPhone 13", "Samsung S22", "Xiaomi Redmi Note 12"],
        audifonos: ["Sony WH-1000XM4", "AirPods Pro", "JBL 760NC"],
        notebooks: ["Macbook Air M1", "Lenovo Thinkpad X1", "Asus VivoBook"]
    };

    function mostrarProductos() {
        return `
Perfecto 😎 Mira lo que tengo disponible:

📱 *Celulares*
- ${productos.celulares.join("\n- ")}

🎧 *Audífonos*
- ${productos.audifonos.join("\n- ")}

💻 *Notebooks*
- ${productos.notebooks.join("\n- ")}

¿De qué categoría quieres saber más?
        `;
    }

    // ==========================================
    //                ESTADOS
    // ==========================================
    switch (state) {

        // -------------------------------------------------------
        case "saludo":
            session.state = "identificar_necesidad";
            return "¡Hola! 👋 Soy tu asesor virtual. ¿Qué estás buscando hoy? (celulares, audífonos, notebooks…)";

        // -------------------------------------------------------
        case "identificar_necesidad":
            if (intents.wantsCatalog) {
                session.state = "mostrar_catalogo";
                return mostrarProductos();
            }

            // Detectar categoría directa
            for (let categoria in productos) {
                if (text.includes(categoria)) {
                    session.state = "recomendar_productos";
                    session.category = categoria;

                    return `Genial 😄 En *${categoria}* te recomiendo estos modelos:  
- ${productos[categoria].join("\n- ")}  
¿Cuál te interesa más?`;
                }
            }

            return "Entiendo 👍 ¿Estás buscando celulares, audífonos, notebooks o algo más?";

        // -------------------------------------------------------
        case "mostrar_catalogo":
            session.state = "recomendar_productos";
            return mostrarProductos();

        // -------------------------------------------------------
        case "recomendar_productos":
            // Selección directa de producto
            const productoEncontrado = Object.values(productos).flat()
                .find(p => text.includes(p.toLowerCase()));

            if (productoEncontrado) {
                session.cart.producto = productoEncontrado;
                session.state = "confirmar_detalles";
                return `Excelente elección 😍 El *${productoEncontrado}* es uno de los favoritos.\n\n¿Lo quieres en algún color o variante en particular?`;
            }

            // Si escribió algo que parece producto
            if (message.length < 40) {
                session.cart.producto = message;
                session.state = "confirmar_detalles";
                return `Perfecto, hablemos de *${message}* 😎\n¿Lo quieres en algún color o variante?`;
            }

            return "Perfecto ¿qué modelo te interesa ver más en detalle?";

        // -------------------------------------------------------
        case "confirmar_detalles":
            session.cart.detalles = message;
            session.state = "cierre_venta";
            return `
Perfecto 🙌 Ya tengo todo lo necesario:

🛒 Producto: ${session.cart.producto}
✨ Detalles: ${session.cart.detalles}

¿Deseas confirmar la compra?
            `;

        // -------------------------------------------------------
        case "cierre_venta":
            if (intents.wantsPay || intents.wantsBuy) {

                session.state = "post_venta";

                const paymentUrl =
                    `https://tusitio.com/pagar?producto=${encodeURIComponent(session.cart.producto)}&detalles=${encodeURIComponent(session.cart.detalles)}`;

                return `
¡Excelente decisión! 🎉

Aquí tienes tu link de pago seguro:
👉 ${paymentUrl}

Apenas completes el pago te confirmo por aquí 😊
                `;
            }

            return "¿Deseas proceder al pago y asegurar tu producto? 😄";

        // -------------------------------------------------------
        case "post_venta":
            return "¡Gracias por tu compra! 🥳 Si necesitas algo más aquí estoy.";

        // -------------------------------------------------------
        default:
            session.state = "saludo";
            return "¡Hola! ¿En qué te puedo ayudar hoy?";
    }
}
