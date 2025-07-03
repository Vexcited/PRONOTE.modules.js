exports.ObjetFenetre_ServicesPeriscolairePourAbsence = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetTri_1 = require("ObjetTri");
class ObjetFenetre_ServicesPeriscolairePourAbsence extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({ avecTailleSelonContenu: true });
	}
	jsxGetHtmlDatesAbsence() {
		if (this.donnees && this.donnees.absence) {
			const lResult = [];
			if (
				ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
					this.donnees.absence.debut.date,
					this.donnees.absence.fin.date,
				) >= 1
			) {
				lResult.push(
					ObjetDate_1.GDate.formatDate(
						this.donnees.absence.debut.date,
						`${ObjetTraduction_1.GTraductions.getValeur("Du")} %JJJ %JJ/%MM/%AAAA ${this.donnees.absence.debut.estMatin ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin") : ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.apresMidi")}`,
					),
				);
				lResult.push(
					ObjetDate_1.GDate.formatDate(
						this.donnees.absence.fin.date,
						`${ObjetTraduction_1.GTraductions.getValeur("Au")} %JJJ %JJ/%MM/%AAAA ${this.donnees.absence.fin.estMatin ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin") : ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.apresMidi")}`,
					),
				);
			} else {
				let lSuff = "";
				if (
					this.donnees.absence.debut.estMatin ===
					this.donnees.absence.fin.estMatin
				) {
					lSuff = this.donnees.absence.debut.estMatin
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.matin")
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.apresMidi");
				}
				lResult.push(
					ObjetDate_1.GDate.formatDate(
						this.donnees.absence.debut.date,
						`[${ObjetTraduction_1.GTraductions.getValeur("Le")} %JJJ %JJ/%MM/%AAAA] ${lSuff}`,
					),
				);
			}
			return lResult.join(" ") + ". ";
		}
		return "";
	}
	jsxGetHtmlListeServices() {
		if (this.donnees && this.donnees.liste) {
			const lResult = [];
			this.donnees.liste.parcourir((aElement) => {
				lResult.push(
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "fsp_cb_service",
							"ie-model": this.jsxModeleCheckboxService.bind(this, aElement),
						},
						aElement.getLibelle(),
					),
				);
			});
			return lResult.join("");
		}
		return "";
	}
	jsxModeleCheckboxService(aService) {
		return {
			getValue: () => {
				if (!!aService) {
					return !aService.estPartiel;
				}
				return false;
			},
			setValue: (aValue) => {
				if (!!aService) {
					aService.estPartiel = !aValue;
				}
			},
		};
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		if (this.donnees.liste) {
			this.donnees.liste.setTri([
				ObjetTri_1.ObjetTri.initRecursif("pere", [
					ObjetTri_1.ObjetTri.init("heureOuverture"),
					ObjetTri_1.ObjetTri.init("heureFermeture"),
					ObjetTri_1.ObjetTri.init("Libelle"),
				]),
			]);
			this.donnees.liste.trier();
		}
		this.afficher();
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				"span",
				{ class: "fsp_absence" },
				IE.jsx.str(
					"span",
					{ class: "fsp_absence_info" },
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreServicesPeriscolairePourAbsence.info",
					),
					" ",
				),
				IE.jsx.str("span", {
					class: "fsp_absence_date",
					"ie-html": this.jsxGetHtmlDatesAbsence.bind(this),
				}),
				IE.jsx.str(
					"span",
					{ class: "fsp_absence_suppl" },
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreServicesPeriscolairePourAbsence.suppl",
					),
				),
				IE.jsx.str("span", {
					class: "fsp_liste_services",
					"ie-html": this.jsxGetHtmlListeServices.bind(this),
				}),
			),
		);
		return lHtml.join("");
	}
	getParametresValidation(aNumeroBouton) {
		const lParametres = super.getParametresValidation(aNumeroBouton);
		const lListe = this.donnees.liste.getListeElements((aElement) => {
			return !aElement.estPartiel;
		});
		$.extend(lParametres, { liste: lListe });
		return lParametres;
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ServicesPeriscolairePourAbsence,
			{ pere: aParams.pere, evenement: aParams.evenement },
			{
				modale: true,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"fenetreServicesPeriscolairePourAbsence.titre",
				),
				listeBoutons: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					},
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
						valider: true,
						theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					},
				],
				largeur: 540,
				avecTailleSelonContenu: true,
			},
		);
		lFenetre.setDonnees(aParams.donnees);
	}
}
exports.ObjetFenetre_ServicesPeriscolairePourAbsence =
	ObjetFenetre_ServicesPeriscolairePourAbsence;
