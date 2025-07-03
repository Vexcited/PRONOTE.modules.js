exports.ObjetDossiersRecapitulatif = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_ElementDossier_1 = require("Enumere_ElementDossier");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
const GlossaireDossierVieScolaire_1 = require("GlossaireDossierVieScolaire");
class ObjetDossiersRecapitulatif extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.donnees = {
			listeGenresEvenements: null,
			afficherAnneesPrecedentes: false,
		};
	}
	setDonnees(aListeGenres, aAfficherAnneesPrecedentes) {
		this.donnees.listeGenresEvenements = aListeGenres;
		this.donnees.afficherAnneesPrecedentes = aAfficherAnneesPrecedentes;
		this.afficher(
			this._construireAffichage(this.donnees.listeGenresEvenements),
		);
	}
	jsxDisplayAvecCheckboxAnneesPrecedentes() {
		const lPeriodeSelectionnee =
			this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			);
		return !!lPeriodeSelectionnee && !lPeriodeSelectionnee.existeNumero();
	}
	jsxModeleCheckboxAnneesPrecedentes() {
		return {
			getValue: () => {
				return this.donnees.afficherAnneesPrecedentes;
			},
			setValue: (aValue) => {
				this.donnees.afficherAnneesPrecedentes = aValue;
				this.callback.appel(aValue);
			},
		};
	}
	_construireAffichage(aListeGenreEvenements) {
		const lHTML = [];
		lHTML.push('<div class="DossiersRecapitulatif">');
		if (!!aListeGenreEvenements && aListeGenreEvenements.count() > 0) {
			lHTML.push(this.composeRecapitulatifEvenements(aListeGenreEvenements));
			lHTML.push(
				IE.jsx.str(
					"div",
					{
						class: "GrandEspaceHaut",
						style: "display: flex; justify-content: space-between;",
					},
					IE.jsx.str(
						"span",
						{ class: "Gras" },
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
							.TitreDossiers,
					),
					IE.jsx.str(
						"span",
						{
							"ie-display":
								this.jsxDisplayAvecCheckboxAnneesPrecedentes.bind(this),
						},
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModeleCheckboxAnneesPrecedentes.bind(this),
							},
							GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
								.AfficherAnneesPrecedentes,
						),
					),
				),
			);
		}
		lHTML.push("</div>");
		return lHTML.join("");
	}
	composeRecapitulatifEvenements(aListeGenreEvenements) {
		const lGenreEvenements = [];
		if (!!aListeGenreEvenements) {
			for (const lGenreEvt of aListeGenreEvenements) {
				if (
					lGenreEvt.getGenre() !==
						Enumere_ElementDossier_1.EGenreElementDossier.Punition ||
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPunitions,
					)
				) {
					lGenreEvenements.push(
						IE.jsx.str(
							"div",
							{
								style: "display: flex;align-items: center;",
								title: lGenreEvt.libelleDetail,
							},
							IE.jsx.str("span", {
								class: [
									"InlineBlock",
									"iconic",
									Enumere_ElementDossier_1.EGenreElementDossierUtil.getIconePolice(
										lGenreEvt.getGenre(),
									),
								],
							}),
							IE.jsx.str(
								"span",
								{ class: "EspaceGauche10", style: "width: 30px;" },
								lGenreEvt.nombre,
							),
						),
					);
				}
			}
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "Gras" },
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.TitreRecapitulatifAnnuel,
				),
				IE.jsx.str(
					"div",
					{
						class: "EspaceHaut liste-icons",
						style: "display:flex; align-items: center;",
					},
					lGenreEvenements.join(""),
				),
			),
		);
		return H.join("");
	}
}
exports.ObjetDossiersRecapitulatif = ObjetDossiersRecapitulatif;
