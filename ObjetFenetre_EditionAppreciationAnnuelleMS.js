exports.ObjetFenetre_EditionAppreciationAnnuelleMS = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_EditionAppreciationAnnuelleMS extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.indexBtnValider = 1;
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ficheScolaire.appreciations",
			),
			largeur: 500,
			hauteur: 380,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					valider: true,
				},
			],
			bloquerFocus: false,
		});
	}
	jsxGetHtmlTitreService(aIndice) {
		if (this.donnees && this.services) {
			const lElement = this.services.get(aIndice);
			if (lElement && lElement.getLibelle()) {
				return "<ul><li>" + lElement.getLibelle() + "</li></ul>";
			}
		}
		return "";
	}
	jsxGetClassTextareaAppreciation(aIndice) {
		if (this.donnees && this.services) {
			const lElement = this.services.get(aIndice);
			if (
				lElement &&
				!lElement.assistantDesactive &&
				lElement.appreciationAnnuelle &&
				lElement.appreciationAnnuelle.editable &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.assistantSaisieAppreciations,
				) &&
				this.etatUtilisateurSco.assistantSaisieActif
			) {
				return "Curseur_AssistantSaisieActif";
			}
		}
		return "";
	}
	jsxModelTextareaAppreciation(aIndice) {
		return {
			getValue: () => {
				if (this.donnees && this.services) {
					const lElement = this.services.get(aIndice);
					if (lElement && lElement.appreciationAnnuelle) {
						return lElement.appreciationAnnuelle.getLibelle();
					}
				}
				return "";
			},
			setValue: (aValue) => {
				if (this.donnees && this.services) {
					const lElement = this.services.get(aIndice);
					if (
						!!lElement &&
						!!lElement.appreciationAnnuelle &&
						lElement.appreciationAnnuelle.editable
					) {
						lElement.appreciationAnnuelle.setLibelle(aValue);
						lElement.appreciationAnnuelle.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				}
			},
			getDisabled: () => {
				if (this.donnees && this.services) {
					const lElement = this.services.get(aIndice);
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
			node: (aNode) => {
				$(aNode).eventValidation((aEvent) => {
					if (this.fenetreAssistantSaisie) {
						return;
					}
					const lElement = this.services.get(aIndice);
					this.jqTextAreaCourant = aEvent.target;
					if (
						!lElement.assistantDesactive &&
						this.etatUtilisateurSco.assistantSaisieActif
					) {
						this.evenementOuvrirAssistantSaisie(aIndice);
					} else {
						lElement.assistantDesactive = false;
					}
				});
			},
		};
	}
	composeContenu() {
		const T = [];
		if (this.donnees && this.services) {
			for (let index = 0; index < this.services.count(); index++) {
				T.push(this._composeService(index));
			}
		}
		return T.join("");
	}
	setEtatSaisie() {}
	evenementOuvrirAssistantSaisie(aIndice) {
		this.fenetreAssistantSaisie =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_AssistantSaisie_1.ObjetFenetre_AssistantSaisie,
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
		const lTabTypeAppreciation =
			Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
				this.etatUtilisateurSco.getGenreOnglet(),
				this.elementCourant.appreciationAnnuelle,
				false,
			);
		const lListeElementsTypeAppreciation =
			new ObjetListeElements_1.ObjetListeElements();
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
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.Valider: {
				const lElmtSelectionne = aParams.appreciationSelectionnee;
				if (!!lElmtSelectionne) {
					const lTailleMax = this.donnees.tailleMaxSaisie;
					const lControle = ObjetChaine_1.GChaine.controleTailleTexte({
						chaine: lElmtSelectionne.getLibelle(),
						tailleTexteMax: lTailleMax,
					});
					if (lControle.controleOK) {
						this.traiterValidationAppreciationSelectionnee(lElmtSelectionne);
					} else {
						this.applicationSco
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"Appreciations.titreMsgDepasseTailleMax",
								),
								message: ObjetTraduction_1.GTraductions.getValeur(
									"Appreciations.msgDepasseTailleMax",
									[lTailleMax],
								),
							});
					}
				}
				break;
			}
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.PasserEnSaisie:
				this.elementCourant.assistantDesactive = true;
				if (this.jqTextAreaCourant) {
					this.jqTextAreaCourant.focus();
					this.jqTextAreaCourant = undefined;
				}
				break;
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.Fermer: {
				const lNePasUtiliserAssistantActif =
					this.fenetreAssistantSaisie.getEtatCbNePasUtiliserAssistant();
				const lUtiliserAssistantActif = !lNePasUtiliserAssistantActif;
				if (
					this.etatUtilisateurSco.assistantSaisieActif !==
					lUtiliserAssistantActif
				) {
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
			this.elementCourant.appreciationAnnuelle.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			this.elementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	setDonnees(aDonnees) {
		this.donnees = { tailleMaxSaisie: 255 };
		$.extend(this.donnees, aDonnees);
		if (this.donnees.services) {
			this.services = MethodesObjet_1.MethodesObjet.dupliquer(
				this.donnees.services,
			);
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
	_composeService(aIndice) {
		const lId = "FEAA_TitreService_" + aIndice;
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "cntrService" },
				IE.jsx.str("div", {
					id: lId,
					class: "cntrServiceTitre",
					"ie-html": this.jsxGetHtmlTitreService.bind(this, aIndice),
				}),
				IE.jsx.str(
					"div",
					{ class: "cntrServiceText" },
					IE.jsx.str("ie-textareamax", {
						"aria-labelledby": lId,
						"ie-class": this.jsxGetClassTextareaAppreciation.bind(
							this,
							aIndice,
						),
						"ie-model": this.jsxModelTextareaAppreciation.bind(this, aIndice),
						style: "height : 6rem;",
						maxlength: this.donnees.tailleMaxSaisie || 255,
					}),
				),
			),
		);
		return T.join("");
	}
}
exports.ObjetFenetre_EditionAppreciationAnnuelleMS =
	ObjetFenetre_EditionAppreciationAnnuelleMS;
