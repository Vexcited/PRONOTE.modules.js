const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteListeDiffusion extends ObjetRequeteConsultation {}
Requetes.inscrire("ListeDiffusion", ObjetRequeteListeDiffusion);
module.exports = { ObjetRequeteListeDiffusion };
