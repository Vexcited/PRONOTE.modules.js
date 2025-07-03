exports.ObjetRequetePageStageGeneral = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequetePageStageGeneral extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aNumeroEleve, aAvecUniquementStagiaire) {
		this.JSON.Eleve = new ObjetElement_1.ObjetElement("", aNumeroEleve);
		if (aAvecUniquementStagiaire) {
			this.JSON.avecUniquementStagiaire = aAvecUniquementStagiaire;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lListeStages = this.JSONReponse.Stages;
		const lListeEvenements = this.JSONReponse.Evenements;
		lListeEvenements.parcourir((D) => {
			if (!D.couleur) {
				D.couleur = GCouleur.blanc;
			}
			D.libelleHtml = IE.jsx.str(
				"span",
				{
					class: "colored-square-libelle",
					style: { "--colour-square": D.couleur },
				},
				D.getLibelle(),
			);
		});
		const lListeLieux = this.JSONReponse.Lieux;
		lListeLieux.addElement(new ObjetElement_1.ObjetElement("", 0));
		lListeLieux.trier();
		const lListeSujets = this.JSONReponse.Sujets;
		if (lListeSujets) {
			lListeSujets.trier();
			lListeSujets.insererElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("Aucun"),
					0,
				),
				0,
			);
		}
		this.callbackReussite.appel(
			lListeStages,
			lListeEvenements,
			lListeLieux,
			lListeSujets,
			this.JSONReponse.dateFinSaisieSuivi,
		);
	}
}
exports.ObjetRequetePageStageGeneral = ObjetRequetePageStageGeneral;
CollectionRequetes_1.Requetes.inscrire(
	"PageStage.General",
	ObjetRequetePageStageGeneral,
);
