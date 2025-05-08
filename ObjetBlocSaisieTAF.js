const { ObjetMoteurCDT } = require("ObjetMoteurCahierDeTextes.js");
const { BlocCard } = require("BlocCard.js");
class ObjetBlocSaisieTAF extends BlocCard {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.moteurCDT = new ObjetMoteurCDT();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			renduTAF: function () {
				$(this.node).on("click", (aEvent) => {
					aInstance.declencherCallback({
						donnee: aInstance.data,
						genreEvnt: null,
						param: { event: aEvent },
					});
				});
			},
		});
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
					taf: aElement,
					editable: this._options.editable,
					avecDonneLe: this._options.avecDonneLe,
					avecPourLe: this._options.avecPourLe,
					avecSuiviRendu: this._options.avecSuiviRendu,
				}),
			),
		);
	}
	composeDataCard(aParam) {
		const lContenuPrincipal = this.composeHtmlTAFPrincipal(aParam);
		const lContenuSecondaire = this.composeHtmlTAFSecondaire(aParam);
		return {
			editable: aParam.editable,
			htmlInfoPrincipale: lContenuPrincipal,
			htmlInfoSecondaire: lContenuSecondaire,
		};
	}
	composeHtmlTAFPrincipal(aParam) {
		const lTAF = aParam.taf;
		const H = [];
		if (lTAF !== null && lTAF !== undefined) {
			const lDescription = this.moteurCDT.strDescriptifTAF(lTAF);
			H.push(
				this.composeHtmlInfoPrincipale({
					html: this.moteurCDT.estTAFQCM(lTAF)
						? this.moteurCDT.composeHtmlLigneQCM({ libelle: lDescription })
						: lDescription,
				}),
			);
			H.push(
				this.composeHtmlInfoSecondaire({
					icon: this.moteurCDT.iconPourLeDonneLeTAF(lTAF),
					libelleInfo:
						aParam.avecPourLe === true
							? this.moteurCDT.strPourLeTAF(lTAF, { avecTraduc: true })
							: aParam.avecDonneLe === true
								? this.moteurCDT.strDonneLeTAF(lTAF, { avecTraduc: true })
								: "",
				}),
			);
			if (this.moteurCDT.estContenuAvecThemes(lTAF)) {
				H.push(
					this.composeHtmlInfoSecondaire({
						htmlIconInfo: null,
						libelleInfo: this.moteurCDT.strThemesContenu(lTAF),
					}),
				);
			}
		}
		return H.join("");
	}
	composeHtmlTAFSecondaire(aParam) {
		const lTAF = aParam.taf;
		const H = [];
		if (lTAF !== null && lTAF !== undefined) {
			const lAvecPJ = this.moteurCDT.estTAFAvecPJ(lTAF);
			const lAvecPublic = this.moteurCDT.estTAFAvecPublic(lTAF);
			const lAvecRendu = this.moteurCDT.estTAFAvecRendu(lTAF);
			const lAvecDuree = this.moteurCDT.estTAFAvecDuree(lTAF);
			const lAvecDifficulte = this.moteurCDT.estTAFAvecDifficulte(lTAF);
			const lAvecInfosComplementaires =
				lAvecPublic || lAvecRendu || lAvecDuree || lAvecDifficulte;
			if (lAvecPJ) {
				const lListePJ = this.moteurCDT.getListePJDeTAF(lTAF);
				H.push(
					this.composeHtmlZoneInfo({
						html: this.composeHtmlPJ(lListePJ),
						avecSeparateur: true,
						estDernier: !lAvecInfosComplementaires,
					}),
				);
			}
			const lHtmlInfosCompl = [];
			if (lAvecPublic) {
				const lListeTousEleves = this.moteurCDT.getListeTousEleves({
					listeClassesEleves: this._options.listeClassesEleves,
				});
				lHtmlInfosCompl.push(
					this.composeHtmlInfoSecondaire({
						icon: this.moteurCDT.iconPublicTAF(lTAF),
						libelleInfo: this.moteurCDT.strPublicTAF(lTAF, {
							listeTousEleves: lListeTousEleves,
						}),
					}),
				);
			}
			if (lAvecRendu) {
				lHtmlInfosCompl.push(
					this.composeHtmlInfoSecondaire({
						icon: this.moteurCDT.iconModeRenduTAF(lTAF),
						libelleInfo: this.moteurCDT.strModeRenduTAF(lTAF, {
							avecNbRendu: false,
						}),
					}),
				);
			}
			if (aParam.avecSuiviRendu) {
				let lStr;
				if (lTAF.avecRendu) {
					lStr = this.moteurCDT.strSuiviRenduTAF(lTAF);
				} else {
					lStr = this.moteurCDT.strSuiviFaitSelonEleves(lTAF);
				}
				lHtmlInfosCompl.push(
					this.composeHtmlInfoSecondaire({
						icon: this.moteurCDT.iconSuiviRenduTAF(lTAF),
						libelleInfo: lStr,
					}),
				);
			}
			lHtmlInfosCompl.push('<div style="display:flex">');
			if (lAvecDuree) {
				lHtmlInfosCompl.push(
					this.composeHtmlInfoSecondaire({
						icon: this.moteurCDT.iconDureeTAF(lTAF),
						libelleInfo: this.moteurCDT.strDureeTAF(lTAF),
					}),
				);
			}
			if (lAvecDifficulte) {
				lHtmlInfosCompl.push(
					this.composeHtmlInfoSecondaire({
						htmlIconInfo: this.moteurCDT.htmlIconDifficulteTAF(lTAF, {
							color: GCouleur.themeNeutre.foncee,
							avecTitle: true,
						}),
						libelleInfo: this.moteurCDT.strDifficulteTAF(lTAF),
					}),
				);
			}
			lHtmlInfosCompl.push("</div>");
			H.push(
				this.composeHtmlZoneInfo({
					html: lHtmlInfosCompl.join(""),
					avecSeparateur: !lAvecPJ,
					estDernier: true,
				}),
			);
		}
		return H.join("");
	}
}
module.exports = { ObjetBlocSaisieTAF };
