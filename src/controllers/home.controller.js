export const showHome = (req, res) => {
    const counters = {
        conversations: 42,
        users: 15,
        orders: 8
    };

    res.render('home', {
        title: 'Panel | Dashboard',
        pageTitle: 'Dashboard',
        counters,
        user: req.user,
        breadcrumbs: [{ href: '/', text: 'Home' }] // <--- Asegúrate de enviarlo
    });
};
