// src/ai/flowEngine.js
import Product from "../models/Product.js";

export async function flowEngine(session, message) {
    const text = message.toLowerCase();

    if (!session.state) session.state = "saludo";
    if (!session.cart) session.cart = {};

    const wantsYes = /(si|sí|ok|vale|claro|ya|dale)/i.test(text);
    const wantsNo = /(no|nah|nop)/i.test(text);

    // ==============================================
    //   OBTENER CATEGORÍAS DESDE PRODUCTOS
    // ==============================================
    const allProducts = await Product.find().lean();

    // si no tienes campo category, lo inferimos por nombre temporalmente
    const productosPorCategoria = {};

    for (const p of allProducts) {
        const categoria = p.category ?? "general";
        if (!productosPorCategoria[categoria]) productosPorCategoria[categoria] = [];
        productosPorCategoria[categoria].push(p);
    }

    const categorias = Object.keys(productosPorCategoria);

    // ==============================================
    //                FLUJO
    // ==============================================
    switch (session.state) {

        case "saludo":
            session.state = "necesidad";
            return `Hola 😊 ¿Qué estás buscando hoy?\nCategorías disponibles: ${categorias.join(", ")}`;

        case "necesidad": {
            const categoria = categorias.find(c => text.includes(c.toLowerCase()));

            if (categoria) {
                session.category = categoria;
                session.state = "producto_lista";

                const lista = productosPorCategoria[categoria]
                    .map(p => `- ${p.name} (${p.price.toLocaleString("es-CL")} CLP)`)
                    .join("\n");

                return `Perfecto. Tengo disponibles:\n${lista}\n¿Cuál te interesa?`;
            }

            return `¿Qué categoría te interesa? (${categorias.join(", ")})`;
        }

        case "producto_lista": {
            const all = allProducts;

            // buscar coincidencia por nombre
            const productoObj = all.find(p =>
                text.includes(p.name.toLowerCase())
            );

            if (productoObj) {
                session.cart.producto = productoObj.name;
                session.cart.precio = productoObj.price;
                session.cart.id = productoObj._id;

                session.state = "confirmar_detalle";

                return `Perfecto. Ese modelo cuesta ${productoObj.price.toLocaleString("es-CL")} CLP.\n¿Deseas agregar color, modelo o alguna variante?`;
            }

            // fallback: texto libre
            if (message.length < 40) {
                session.cart.producto = message;
                session.cart.precio = 0;

                session.state = "confirmar_detalle";
                return `Anotado. ¿Quieres agregar algún detalle adicional?`;
            }

            return "Indícame el modelo que te interesa.";
        }

        case "confirmar_detalle":
            session.cart.detalles = message;

            session.state = "confirmar_compra";

            const precio = session.cart.precio
                ? `${session.cart.precio.toLocaleString("es-CL")} CLP`
                : "por confirmar";

            return `Listo 👍\nProducto: ${session.cart.producto}\nPrecio: ${precio}\n¿Confirmamos la compra?`;

        case "confirmar_compra":
            if (wantsYes) {
                session.state = "pago";

                const total = session.cart.precio || 0;
                const url = `https://tusitio.com/pagar?producto=${encodeURIComponent(session.cart.producto)}&monto=${total}`;

                return `¡Perfecto! 🎉\nTotal a pagar: ${total.toLocaleString("es-CL")} CLP.\nAquí tienes tu link de pago:\n${url}`;
            }

            if (wantsNo) {
                session.state = "necesidad";
                return "Sin problema. ¿Buscas otra cosa?";
            }

            return "¿Deseas confirmar la compra?";

        case "pago":
            session.state = "post_venta";
            return "Gracias por tu compra 😊 Si necesitas algo más, aquí estoy.";

        case "post_venta":
            return "¿Puedo ayudarte en algo más?";

        default:
            session.state = "saludo";
            return "Hola, ¿en qué te puedo ayudar?";
    }
}
