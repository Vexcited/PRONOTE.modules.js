exports.InterfaceDestMessageInstantane = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const TypeStatutConnexion_1 = require("TypeStatutConnexion");
const ObjetElement_1 = require("ObjetElement");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetConversationEnCours_1 = require("ObjetConversationEnCours");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
CollectionRequetes_1.Requetes.inscrire(
	"SaisieStatutConnexion",
	ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
class InterfaceDestMessageInstantane extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.params = {};
		this.listeStatuts = new ObjetListeElements_1.ObjetListeElements();
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.idInputRecherche = GUID_1.GUID.getId();
		this.listeStatuts.add([
			new ObjetElement_1.ObjetElement(
				"",
				TypeStatutConnexion_1.TypeGenreStatutConnexionBase.SCB_Connecte,
			),
			new ObjetElement_1.ObjetElement(
				"",
				TypeStatutConnexion_1.TypeGenreStatutConnexionBase.SCB_NePasDeranger,
			),
			new ObjetElement_1.ObjetElement(
				"",
				TypeStatutConnexion_1.TypeGenreStatutConnexionBase.SCB_Invisible,
			),
		]);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			compteur: {
				afficher: function () {
					return aInstance.options.getListeConversations().count() > 0;
				},
				texte: function () {
					return aInstance.options.getListeConversations().count();
				},
			},
			afficherAucuneConvers: function () {
				return aInstance.options.getListeConversations().count() === 0;
			},
			getRepeatMessages: function () {
				return [
					...aInstance.options.getListeConversations().getTabListeElements(),
				];
			},
			identiteConvers: function (aRepeatMessage) {
				const lMessage = aRepeatMessage.element;
				return {
					class: ObjetConversationEnCours_1.ObjetConversationEnCours,
					pere: aInstance,
					init: function (aInstanceConvers) {
						aInstanceConvers.setOptions({
							message: lMessage,
							surFermer: function () {
								aInstance._suppressionMessage(lMessage);
							},
							surMessage: function () {
								if (aInstance.options.surMessage) {
									aInstance.options.surMessage(lMessage);
								}
								aInstance._suppressionMessage(lMessage);
								if (aInstance.options.fermerFenetre) {
									aInstance.options.fermerFenetre();
								}
							},
							surQuitter: function () {
								aInstance._suppressionMessage(lMessage);
							},
						});
					},
				};
			},
			btnContact: {
				event: function () {
					if (aInstance.params.fermer) {
						aInstance.params.fermer();
					}
					aInstance.params.creerDiscussionContactVS();
				},
			},
			getHtmlZoneStatut: function () {
				if (!aInstance.params.statutConnexion) {
					return "";
				}
				if (aInstance.params.statutConnexion.desactive) {
					return (
						aInstance._getHtmlStatut(
							TypeStatutConnexion_1.TypeGenreStatutConnexionBase.SCB_Invisible,
						) +
						" - " +
						ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.MessagerieDesactivee",
						)
					);
				} else {
					return IE.jsx.str("ie-combo", {
						class: "m-x m-top m-bottom-xl",
						"ie-model": "comboStatut",
					});
				}
			},
			comboStatut: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: 190,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.SelectionStatut",
						),
						getContenuCellule: function (aElement) {
							return {
								libelleHtml: aInstance._getHtmlStatut(aElement.getNumero()),
							};
						},
						getContenuElement: function (aParams) {
							return aInstance._getHtmlStatut(aParams.element.getNumero());
						},
					});
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					return aInstance.listeStatuts;
				},
				getIndiceSelection: function () {
					if (!aInstance.params.statutConnexion) {
						return -1;
					}
					const lIndice = aInstance.listeStatuts.getIndiceParNumeroEtGenre(
						aInstance.params.statutConnexion.statut,
					);
					return lIndice || 0;
				},
				event: function (aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aCombo.estUneInteractionUtilisateur()
					) {
						let lStatut = aParametres.element.getNumero();
						if (lStatut !== aInstance.params.statutConnexion.statut) {
							aInstance.params.statutConnexion.statut = lStatut;
							(0, CollectionRequetes_1.Requetes)(
								"SaisieStatutConnexion",
								aInstance,
							).lancerRequete({ statut: lStatut });
						}
					}
				},
				getDisabled: function () {
					return aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			rechercheTexte: {
				getValue: function () {
					const lListe = aInstance._getListe();
					return lListe ? lListe.getRechercheTexte() : "";
				},
				setValue: function (aValue) {
					aInstance._getListe().setRechercheTexte(aValue);
				},
			},
			btnRechercheTexte: {
				event: function () {
					aInstance._getListe().setRechercheTexte("");
					ObjetHtml_1.GHtml.setFocus(aInstance.idInputRecherche);
				},
				avecBtn: function () {
					return aInstance._getListe().getRechercheTexte() !== "";
				},
			},
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe_1.ObjetListe, null, (aListe) => {
			aListe.setOptionsListe({
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				hauteurAdapteContenu: true,
				hauteurMaxAdapteContenu: 400,
				messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.AucunDestinataire",
				),
				labelWAI: ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.WAI_SelecDests_S",
					[
						ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.LancerConversation",
						),
					],
				),
			});
		});
	}
	setDonnees(aParams) {
		this.params = Object.assign(
			{
				fermer: null,
				creerDiscussionContactVS: null,
				creerMessageInstantane: null,
			},
			aParams,
		);
		this.listeContacts = aParams.listeContacts;
		this.listeContacts.parcourir((aDest) => {
			const lResult = aParams.listeDestinataires.getElementParElement(aDest);
			if (lResult) {
				aDest.statutConnexion = lResult.statutConnexion;
			} else {
				aDest.statutConnexion =
					TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_Deconnecte;
			}
		});
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_DestMessageInstantane(this.listeContacts),
		);
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"div",
			{ class: "InterfaceDestMessageInstantane" },
			this.options.getListeConversations
				? IE.jsx.str(
						"div",
						{ class: "wdmi-entete-mobile" },
						IE.jsx.str(
							"div",
							{ class: "wdmi_titre_conversations" },
							IE.jsx.str(
								"div",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"Messagerie.ConversationInstantaneesEnCours",
								),
							),
							IE.jsx.str("div", {
								class: "wdmi_compteur",
								"ie-texte": "compteur.texte",
								"ie-if": "compteur.afficher",
							}),
						),
						IE.jsx.str(
							"div",
							{
								class: "wdmi_titre_aucuneConvers",
								"ie-if": "afficherAucuneConvers",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"Messagerie.AucuneConversation",
							),
						),
						IE.jsx.str(
							"ul",
							{ class: "wdmi_conversations" },
							IE.jsx.str("li", {
								"ie-repeat": "messageConvers in getRepeatMessages",
								"ie-identite": "identiteConvers(messageConvers)",
							}),
						),
					)
				: "",
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecContactVS,
			)
				? IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnContact",
							class: "dmi_btnContact",
							"ie-icon": "icon_contact_vs",
						},
						ObjetTraduction_1.GTraductions.getValeur("Messagerie.ContacterVS"),
					)
				: "",
			IE.jsx.str("div", {
				"ie-html": "getHtmlZoneStatut",
				class: "dmi_statut",
			}),
			IE.jsx.str(
				"div",
				{ class: "dmi_zone_input" },
				IE.jsx.str(
					"div",
					{ class: "as-input dmi_recherche" },
					IE.jsx.str("input", {
						type: "text",
						id: this.idInputRecherche,
						"ie-trim": true,
						"ie-textbrut": true,
						"ie-model": "rechercheTexte",
						class: "browser-default",
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.RechercherProfPerso",
						),
					}),
					IE.jsx.str("ie-btnimage", {
						class: "icon_remove btnImageIcon",
						"ie-model": "btnRechercheTexte",
						"ie-if": "avecBtn",
						title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					}),
				),
				IE.jsx.str("i", { class: "icon_search" }),
			),
			IE.jsx.str("div", {
				class: "dest-contain",
				id: this.getNomInstance(this.identListe),
			}),
		);
	}
	getListeSelectionsUtils() {
		return this._getListeSelections();
	}
	lancerConversation() {
		const lSelections = this.getListeSelectionsUtils();
		if (lSelections.count() > 0) {
			let lListeConnecte = lSelections.getListeElements((D) => {
				return (
					D.statutConnexion !==
					TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_Deconnecte
				);
			});
			let lListeNonConnecte = lSelections.getListeElements((D) => {
				return (
					D.statutConnexion ===
					TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_Deconnecte
				);
			});
			this.params.creerMessageInstantane(lListeConnecte, lListeNonConnecte);
		}
	}
	_getHtmlStatut(aStatut) {
		const lDonneesStatut = this.params.statutConnexion;
		if (!lDonneesStatut) {
			return "";
		}
		let lStatutConnexion =
			TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_Disponible;
		switch (aStatut) {
			case TypeStatutConnexion_1.TypeGenreStatutConnexionBase.SCB_Connecte:
				if (lDonneesStatut.profEnCours) {
					lStatutConnexion =
						TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_EnCours;
				} else {
					lStatutConnexion =
						TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_Disponible;
				}
				break;
			case TypeStatutConnexion_1.TypeGenreStatutConnexionBase.SCB_NePasDeranger:
				lStatutConnexion =
					TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_NePasDeranger;
				break;
			case TypeStatutConnexion_1.TypeGenreStatutConnexionBase.SCB_Invisible:
				lStatutConnexion =
					TypeStatutConnexion_1.TypeGenreStatutConnexion.GSC_Deconnecte;
				break;
			default:
		}
		return IE.jsx.str(
			"span",
			{
				class: [
					"dmi_texte_combo",
					TypeStatutConnexion_1.TypeGenreStatutConnexionUtil.getClassIcon(
						lStatutConnexion,
					),
				],
			},
			TypeStatutConnexion_1.TypeGenreStatutConnexionUtil.toLibelle(
				lStatutConnexion,
				true,
			),
		);
	}
	_getListe() {
		return this.getInstance(this.identListe);
	}
	_getListeSelections() {
		if (!this || !this.listeContacts) {
			return new ObjetListeElements_1.ObjetListeElements();
		}
		return this.listeContacts.getListeElements((aElement) => {
			return aElement.estCoche;
		});
	}
	_suppressionMessage(aMessage) {
		this.options.surSuppressionConversationEnCours(aMessage);
		this.$refreshSelf();
	}
}
exports.InterfaceDestMessageInstantane = InterfaceDestMessageInstantane;
class DonneesListe_DestMessageInstantane extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecBoutonActionLigne: false,
			avecCB: true,
			avecEvnt_CB: false,
			avecCocheCBSurLigne: true,
			avecSelection: false,
			avecEllipsis: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		return UtilitaireMessagerie_1.UtilitaireMessagerie.contruirePublicConnecte(
			aParams.article,
			"",
			false,
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		return UtilitaireMessagerie_1.UtilitaireMessagerie.contruirePublicConnecteStatutConnexion(
			aParams.article,
		);
	}
	getDisabledCB(aParams) {
		return !!aParams.article.refusMess;
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init((D) => !!D.refusMess),
			ObjetTri_1.ObjetTri.init((D) => D.statutConnexion),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
	}
}
