const { ObjetMoteurCDT } = require("ObjetMoteurCahierDeTextes.js");
const { BlocCard } = require("BlocCard.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
class ObjetBlocSaisieContenu extends BlocCard {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.moteurCDT = new ObjetMoteurCDT();
	}
	construireAffichage() {
		return this.afficher();
	}
	setParametres(aElement, aOptions) {
		this._options = $.extend(this._options, aOptions);
		this.setParam({ avecEtendre: false });
		this.setDonnees(
			$.extend(
				{ data: aElement },
				this.composeDataCard({
					contenu: aElement,
					editable: this._options.editable,
				}),
			),
		);
	}
	composeDataCard(aParam) {
		const lContenuPrincipal = this.composeHtmlPrincipal(aParam);
		const lContenuSecondaire = this.composeHtmlSecondaire(aParam);
		return {
			editable: aParam.editable,
			htmlInfoPrincipale: lContenuPrincipal,
			htmlInfoSecondaire: lContenuSecondaire,
		};
	}
	composeHtmlPrincipal(aParam) {
		const lContenu = aParam.contenu;
		const H = [];
		if (
			lContenu !== null &&
			lContenu !== undefined &&
			!this.moteurCDT.estContenuVide(lContenu)
		) {
			const lAvecTitre = !this.moteurCDT.estContenuSansTitre(lContenu);
			const lAvecCategorie = this.moteurCDT.estContenuAvecCategorie(lContenu);
			const lAvecThemes = this.moteurCDT.estContenuAvecThemes(lContenu);
			if (lAvecTitre || lAvecCategorie || lAvecThemes) {
				H.push("<div>");
				if (lAvecTitre) {
					H.push(
						this.composeHtmlInfoPrincipale({
							html: this.moteurCDT.strTitreContenu(lContenu),
						}),
					);
				}
				if (lAvecCategorie) {
					H.push(
						this.composeHtmlInfoSecondaire({
							htmlIconInfo: this.moteurCDT.estCategorieContenuAvecImg(lContenu)
								? this.moteurCDT.htmlIconCategorieContenu(lContenu)
								: null,
							libelleInfo: this.moteurCDT.strCategorieContenu(lContenu),
						}),
					);
				}
				if (lAvecThemes) {
					H.push(
						this.composeHtmlInfoSecondaire({
							htmlIconInfo: null,
							libelleInfo: this.moteurCDT.strThemesContenu(lContenu),
						}),
					);
				}
				H.push("</div>");
			}
		}
		return H.join("");
	}
	composeHtmlSecondaire(aParam) {
		const lContenu = aParam.contenu;
		const H = [];
		if (
			lContenu !== null &&
			lContenu !== undefined &&
			!this.moteurCDT.estContenuVide(lContenu)
		) {
			const lAvecPJ = this.moteurCDT.estContenuAvecPJ(lContenu);
			const lAvecDescriptif = this.moteurCDT.estContenuAvecDescriptif(lContenu);
			const lAvecQCM = this.moteurCDT.estContenuAvecExecQCM(lContenu);
			if (lAvecDescriptif) {
				H.push(
					this.composeHtmlZoneInfo({
						html: this.moteurCDT.strDescriptifContenu(lContenu),
						avecSeparateur: false,
						estDernier: !lAvecPJ && !lAvecQCM,
					}),
				);
			}
			if (lAvecPJ) {
				const lListePJ = this.moteurCDT.getListePJDeContenu(lContenu);
				H.push(
					this.composeHtmlZoneInfo({
						html: this.composeHtmlPJ(lListePJ),
						avecSeparateur: lAvecDescriptif,
						estDernier: !lAvecQCM,
					}),
				);
			}
			if (lAvecQCM) {
				const lListeExecQCM = this.moteurCDT.getListeExecQCMDeContenu(lContenu);
				H.push(
					this.composeHtmlZoneInfo({
						html: this.composeHtmlListeQCM(lListeExecQCM),
						avecSeparateur: lAvecPJ || lAvecDescriptif,
						estDernier: true,
					}),
				);
			}
		}
		return H.join("");
	}
	composeHtmlListeQCM(aListe) {
		const lHtml = [];
		aListe.parcourir((aExecQCM) => {
			lHtml.push(
				this.moteurCDT.composeHtmlLigneQCM({
					libelle:
						aExecQCM.QCM.getLibelle() +
						" " +
						UtilitaireQCM.getStrResumeModalites(aExecQCM),
				}),
			);
		});
		return lHtml.join("");
	}
}
module.exports = { ObjetBlocSaisieContenu };
