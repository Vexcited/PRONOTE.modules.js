exports.DonneesListe_Messagerie = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const TypeOrigineCreationEtiquetteMessage_1 = require("TypeOrigineCreationEtiquetteMessage");
const jsx_1 = require("jsx");
const AccessApp_1 = require("AccessApp");
class DonneesListe_Messagerie extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.setOptions({
			avecSelection: true,
			avecEvnt_Selection: true,
			avecEvnt_ModificationSelection: true,
			avecEventDeploiementSurCellule: false,
			indentationCelluleEnfant: 25,
			tailleEtiquettes: 60,
			tailleTrombone: 10,
			tailleDateMessage: 130,
			avecCategories: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
			),
			avecImagePurge: false,
			getEtiquette: null,
			avecToutesIconesGauche: false,
			addCommandesMenuContextuel: null,
		});
	}
	jsxModeleBoutonParticipants(aNumeroMessage, aPourParticipants) {
		return {
			event: () => {
				UtilitaireMessagerie_1.UtilitaireMessagerie.afficherFenetreDestinatairesDeMessage(
					aNumeroMessage,
					aPourParticipants,
				);
			},
		};
	}
	getControleur(aInstance, aInstanceListe) {
		return $.extend(true, super.getControleur(aInstance, aInstanceListe), {
			hintBtnParticipantsPublic: function (aNumeroMessage, aPourParticipants) {
				return UtilitaireMessagerie_1.UtilitaireMessagerie.getStrHintPublicMessagePromise(
					aInstanceListe,
					aNumeroMessage,
					aPourParticipants,
					false,
					this.node,
				);
			},
		});
	}
	getIconeGaucheContenuFormate(aParams) {
		if (this._avecEtiquetteGauche(aParams.article)) {
			return UtilitaireMessagerie_1.UtilitaireMessagerie.getIconeMessage(
				aParams.article,
			);
		}
		return aParams.article.profondeur > 0 ? "icon_sous_discussion" : "";
	}
	getHintIconeGaucheContenuFormate(aParams) {
		return aParams.article.profondeur > 0
			? ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.HintSousDiscussion",
				)
			: "";
	}
	getTitreZonePrincipale(aParams) {
		return this._getLibelleDiscussion(aParams);
	}
	getInfosSuppZonePrincipale(aParams) {
		let lLibelle =
			aParams.article.initiateur ||
			ObjetTraduction_1.GTraductions.getValeur("Messagerie.Moi");
		if (!(aParams.article.nbPublic > 1)) {
			const lDest =
				aParams.article.public ||
				ObjetTraduction_1.GTraductions.getValeur("Messagerie.Moi");
			if (lDest !== lLibelle) {
				lLibelle = ObjetChaine_1.GChaine.format("%s %s %s", [
					lLibelle,
					ObjetTraduction_1.GTraductions.getValeur("A"),
					lDest,
				]);
			}
		}
		return lLibelle;
	}
	getZoneComplementaire(aParams) {
		const lHIcones = [];
		if (
			aParams.article.nbPublic > 1 &&
			aParams.article.messagePourParticipants
		) {
			lHIcones.push(
				IE.jsx.str("ie-btnicon", {
					class: "icon icon_intervenants",
					"ie-model": this.jsxModeleBoutonParticipants.bind(
						this,
						aParams.article.messagePourParticipants.getNumero(),
						true,
					),
					"ie-hint": !IE.estMobile
						? (0, jsx_1.jsxFuncAttr)("hintBtnParticipantsPublic", [
								aParams.article.messagePourParticipants.getNumero(),
								true,
							])
						: false,
					"aria-haspopup": "dialog",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.WAI_AfficherPart",
					),
				}),
			);
		}
		if (aParams.article.documentsJoints) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_piece_jointe",
					role: "img",
					"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintPJMessage",
					),
				}),
			);
		}
		if (aParams.article.avecReponse) {
			lHIcones.push(
				IE.jsx.str("i", {
					class: "icon icon_discussion_repondu",
					role: "img",
					"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintRepondu",
					),
				}),
			);
		}
		const H = [];
		H.push(IE.jsx.str("span", { class: "time" }, aParams.article.libelleDate));
		if (lHIcones.length > 0) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "icones-conteneur tiny" },
					lHIcones.join(""),
				),
			);
		}
		return H.join("");
	}
	getZoneMessage(aParams) {
		const H = [];
		if (aParams.article.ferme) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintDiscussionTerminee",
					),
				),
			);
		}
		if (aParams.article.estSorti) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintDiscussionSorti",
					),
				),
			);
		}
		if (this.options.avecImagePurge && aParams.article.messagePurge) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintPeutEtreRaccourcie",
					),
				),
			);
		}
		if (aParams.article.estSignalantContenu) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintSignalementContenu",
					),
				),
			);
		}
		if (aParams.article.estSignalantPourSuppr) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintSignalementPourSuppr",
					),
				),
			);
		}
		if (
			aParams.article.archive &&
			this.options.getEtiquette &&
			this.options.getEtiquette() &&
			this.options.getEtiquette().getGenre() !==
				TypeOrigineCreationEtiquetteMessage_1
					.TypeOrigineCreationEtiquetteMessage.OCEM_Pre_Archive
		) {
			H.push(
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.HintDiscussionArchive",
					),
				),
			);
		}
		if (
			this.options.avecCategories &&
			aParams.article.listeEtiquettes &&
			aParams.article.listeEtiquettes.count() > 0
		) {
			H.push(
				IE.jsx.str(
					"div",
					null,
					UtilitaireMessagerie_1.UtilitaireMessagerie.dessinListeEtiquettes(
						aParams.article.listeEtiquettes,
					),
				),
			);
		}
		return H.join("");
	}
	estUnDeploiement(aParams) {
		return (
			this.options.avecDeploiement &&
			aParams &&
			aParams.article &&
			aParams.article.estUneDiscussion &&
			aParams.article.estUnDeploiement
		);
	}
	getClass(aParams) {
		const lClasses = [];
		if (aParams.article.profondeur > 0 || aParams.article.estNonPossede) {
			lClasses.push("dl_m_sous_discussion");
		}
		return lClasses.join(" ");
	}
	estLigneOff(aParams) {
		return aParams.article.lu;
	}
	getVisible(D) {
		if (!D || D.visible === false || !D.estUneDiscussion) {
			return false;
		}
		if (
			D.estUneDiscussion &&
			D.profondeur === 0 &&
			this.options.getEtiquette &&
			!UtilitaireMessagerie_1.UtilitaireMessagerie.estDiscussionVisibleSelonEtiquette(
				D,
				this.options.getEtiquette(),
			)
		) {
			return false;
		}
		return true;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			)
		) {
			return;
		}
		this.options.addCommandesMenuContextuel(aParametres);
		aParametres.menuContextuel.setDonnees(aParametres.id);
	}
	avecBoutonActionLigne(aParams) {
		return (
			!this.options.nonEditable &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			) &&
			!this.estInterTitre(aParams.article) &&
			aParams.article &&
			!aParams.article.estNonPossede
		);
	}
	_getLibelleDiscussion(aParams) {
		if (!aParams.article.estUneDiscussion) {
			return "";
		}
		if (aParams.article) {
			return IE.jsx.str(
				"div",
				{ class: "dl_m_titre" },
				aParams.article.nbBrouillons > 0
					? IE.jsx.str(
							"div",
							{ class: "dl_m_brouillon" },
							`[${this._getTitreBrouillon(aParams)}]`,
						)
					: "",
				IE.jsx.str(
					"div",
					{ "ie-ellipsis": true },
					this._getObjetMessage(aParams),
				),
				IE.jsx.str(
					"div",
					{ class: "ie-sous-titre" },
					aParams.article.nombreMessages,
				),
			);
		}
		return "";
	}
	getAriaLabelZoneCellule(aParams, aZone) {
		if (
			aZone ===
			ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign
				.ZoneCelluleFlatDesign.titre
		) {
			const lStrCompteur =
				aParams.article.nombreMessages === 1
					? ObjetTraduction_1.GTraductions.getValeur("Messagerie.1Message")
					: ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.XMessages_D",
							aParams.article.nombreMessages,
						);
			return [
				this._getTitreBrouillon(aParams),
				this._getObjetMessage(aParams),
				`(${lStrCompteur})`,
			]
				.join(" ")
				.trim();
		}
		return "";
	}
	_getTitreBrouillon(aParams) {
		if (aParams.article.nbBrouillons > 0) {
			return aParams.article.nbBrouillons === 1
				? ObjetTraduction_1.GTraductions.getValeur("Messagerie.UnBrouillon")
				: ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur("Messagerie.NBrouillons"),
						[aParams.article.nbBrouillons],
					);
		}
	}
	_getObjetMessage(aParams) {
		return (
			aParams.article.objet ||
			ObjetTraduction_1.GTraductions.getValeur("Messagerie.ObjetVideDiscussion")
		);
	}
	_avecEtiquetteGauche(aArticle) {
		if (
			this.options.avecToutesIconesGauche &&
			aArticle &&
			aArticle.profondeur === 0 &&
			this.options.getEtiquette
		) {
			const lEtiquette = this.options.getEtiquette();
			if (lEtiquette) {
				if (this.applicationSco.estPrimaire) {
					return lEtiquette.toutes || lEtiquette.enCours;
				}
				return lEtiquette.toutes;
			}
		}
		return false;
	}
}
exports.DonneesListe_Messagerie = DonneesListe_Messagerie;
