const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const {
	EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GChaine } = require("ObjetChaine.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
class ObjetFenetre_EditionAppreciationAnnuelleMS extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.indexBtnValider = 1;
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("ficheScolaire.appreciations"),
			largeur: 500,
			hauteur: 380,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				{ libelle: GTraductions.getValeur("Valider"), valider: true },
			],
			bloquerFocus: false,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getTitreService: function (aIndice) {
				if (aInstance.donnees && aInstance.services) {
					const lElement = aInstance.services.get(aIndice);
					if (lElement && lElement.getLibelle()) {
						return "<ul><li>" + lElement.getLibelle() + "</li></ul>";
					}
				}
				return "";
			},
			appreciation: {
				getClass: function (aIndice) {
					if (aInstance.donnees && aInstance.services) {
						const lElement = aInstance.services.get(aIndice);
						if (
							lElement &&
							!lElement.assistantDesactive &&
							lElement.appreciationAnnuelle &&
							lElement.appreciationAnnuelle.editable &&
							GApplication.droits.get(
								TypeDroits.assistantSaisieAppreciations,
							) &&
							GEtatUtilisateur.assistantSaisieActif
						) {
							return "Curseur_AssistantSaisieActif";
						}
					}
					return "";
				},
				getValue: function (aIndice) {
					if (aInstance.donnees && aInstance.services) {
						const lElement = aInstance.services.get(aIndice);
						if (lElement && lElement.appreciationAnnuelle) {
							return lElement.appreciationAnnuelle.getLibelle();
						}
					}
					return "";
				},
				setValue: function (aIndice, aValue) {
					if (aInstance.donnees && aInstance.services) {
						const lElement = aInstance.services.get(aIndice);
						if (
							!!lElement &&
							!!lElement.appreciationAnnuelle &&
							lElement.appreciationAnnuelle.editable
						) {
							lElement.appreciationAnnuelle.setLibelle(aValue);
							lElement.appreciationAnnuelle.setEtat(EGenreEtat.Modification);
							lElement.setEtat(EGenreEtat.Modification);
						}
					}
				},
				getDisabled: function (aIndice) {
					if (aInstance.donnees && aInstance.services) {
						const lElement = aInstance.services.get(aIndice);
						if (
							!!lElement &&
							!!lElement.appreciationAnnuelle &&
							lElement.appreciationAnnuelle.editable
						) {
							return false;
						}
					}
					return true;
				},
				node: function (aIndice) {
					$(this.node).eventValidation(
						function (aIndice, aEvent) {
							if (this.fenetreAssistantSaisie) {
								return;
							}
							const lElement = this.services.get(aIndice);
							this.jqTextAreaCourant = aEvent.target;
							if (
								!lElement.assistantDesactive &&
								GEtatUtilisateur.assistantSaisieActif
							) {
								this.evenementOuvrirAssistantSaisie(aIndice);
							} else {
								lElement.assistantDesactive = false;
							}
						}.bind(aInstance, aIndice),
					);
				},
			},
		});
	}
	construireInstances() {}
	composeContenu() {
		const T = [];
		if (this.donnees && this.services) {
			for (let index = 0; index < this.services.count(); index++) {
				const lElement = this.services.get(index);
				T.push(_composeService.call(this, lElement, index));
			}
		}
		return T.join("");
	}
	setEtatSaisie() {}
	evenementOuvrirAssistantSaisie(aIndice) {
		this.fenetreAssistantSaisie = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_AssistantSaisie,
			{
				pere: this,
				evenement: this.evenementAssistantSaisie,
				initialiser: false,
			},
		);
		this.fenetreAssistantSaisie.setOptionsFenetre({
			largeur: 700,
			hauteur: 250,
			modale: true,
			avecScroll: false,
		});
		this.fenetreAssistantSaisie.initialiser();
		this.fenetreAssistantSaisie.setParametres({
			tailleMaxAppreciation: this.donnees.tailleMaxSaisie,
		});
		this.elementCourant = this.services.get(aIndice);
		const lTabTypeAppreciation = ETypeAppreciationUtil.getTypeAppreciation(
			GEtatUtilisateur.getGenreOnglet(),
			this.elementCourant.appreciationAnnuelle,
			false,
		);
		const lListeElementsTypeAppreciation = new ObjetListeElements();
		for (let I = 0; I < lTabTypeAppreciation.length; I++) {
			const lElementTypeAppreciation =
				this.donnees.listeTypesAppreciations.getElementParGenre(
					lTabTypeAppreciation[I],
				);
			lListeElementsTypeAppreciation.addElement(lElementTypeAppreciation);
		}
		this.fenetreAssistantSaisie.setDonnees(lListeElementsTypeAppreciation);
	}
	evenementAssistantSaisie(aNumeroBouton, aParams) {
		switch (aNumeroBouton) {
			case EBoutonFenetreAssistantSaisie.Valider: {
				const lElmtSelectionne = aParams.appreciationSelectionnee;
				if (!!lElmtSelectionne) {
					const lTailleMax = this.donnees.tailleMaxSaisie;
					const lControle = GChaine.controleTailleTexte({
						chaine: lElmtSelectionne.getLibelle(),
						tailleTexteMax: lTailleMax,
					});
					if (lControle.controleOK) {
						this.traiterValidationAppreciationSelectionnee(lElmtSelectionne);
					} else {
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Information,
							titre: GTraductions.getValeur(
								"Appreciations.titreMsgDepasseTailleMax",
							),
							message: GTraductions.getValeur(
								"Appreciations.msgDepasseTailleMax",
								[lTailleMax],
							),
						});
					}
				}
				break;
			}
			case EBoutonFenetreAssistantSaisie.PasserEnSaisie:
				this.elementCourant.assistantDesactive = true;
				if (this.jqTextAreaCourant) {
					this.jqTextAreaCourant.focus();
					this.jqTextAreaCourant = undefined;
				}
				break;
			case EBoutonFenetreAssistantSaisie.Fermer: {
				const lNePasUtiliserAssistantActif =
					this.fenetreAssistantSaisie.getEtatCbNePasUtiliserAssistant();
				const lUtiliserAssistantActif = !lNePasUtiliserAssistantActif;
				if (GEtatUtilisateur.assistantSaisieActif !== lUtiliserAssistantActif) {
					this.callback.appel({
						assistantSaisieActif: !!lUtiliserAssistantActif,
					});
				}
				break;
			}
		}
		this.fenetreAssistantSaisie.free();
		this.fenetreAssistantSaisie = null;
	}
	traiterValidationAppreciationSelectionnee(aElmtAppreciationSelectionne) {
		if (
			!!this.elementCourant &&
			!!this.elementCourant.appreciationAnnuelle &&
			this.elementCourant.appreciationAnnuelle.editable
		) {
			this.elementCourant.appreciationAnnuelle.setLibelle(
				aElmtAppreciationSelectionne.getLibelle(),
			);
			this.elementCourant.appreciationAnnuelle.setEtat(EGenreEtat.Modification);
			this.elementCourant.setEtat(EGenreEtat.Modification);
		}
	}
	setDonnees(aDonnees) {
		this.donnees = { tailleMaxSaisie: 255 };
		$.extend(this.donnees, aDonnees);
		if (this.donnees.services) {
			this.services = MethodesObjet.dupliquer(this.donnees.services);
		}
		this.afficher(this.composeContenu());
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel({
			numeroBouton: aNumeroBouton,
			services: this.services,
		});
	}
}
function _composeService(aElement, aIndice) {
	const T = [];
	T.push(
		'<div class="cntrService">',
		'<div id="FEAA_TitreService_',
		aIndice,
		'" class="cntrServiceTitre" ',
		GHtml.composeAttr("ie-html", "getTitreService", [aIndice]),
		"></div>",
		'<div class="cntrServiceText"><ie-textareamax aria-labelledby="FEAA_TitreService_',
		aIndice,
		'" ',
		GHtml.composeAttr("ie-class", "getClass", aIndice),
		GHtml.composeAttr("ie-model", "appreciation", aIndice),
		'style="height : 6rem;',
		'" maxlength="',
		this.donnees.tailleMaxSaisie || 255,
		'"></ie-textareamax></div>',
		"</div>",
	);
	return T.join("");
}
module.exports = { ObjetFenetre_EditionAppreciationAnnuelleMS };
