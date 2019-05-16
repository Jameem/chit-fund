const routes = require("next-routes")();

routes.add("/fund/new", "/fund/new");
routes.add("/fund/:address", "/fund/show");
routes.add("/fund/:address/participants", "/fund/participants");
routes.add("/fund/:address/requests/new", "/fund/requests/new");

module.exports = routes;
