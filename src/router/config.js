const routes = [
    {
        path: ["/", "/landing", "/login", "/signup"],
        exact: true,
        component: "Home",
    },
    {
        path: ["/dashboard"],
        exact: true,
        component: "Dashboard",
    },
    {
        path: ["/agentdashboard"],
        exact: true,
        component: "AgentDashboard",
    },
];

export default routes;
