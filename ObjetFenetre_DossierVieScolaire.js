exports.ObjetFenetre_DossierVieScolaire = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const DonneesListe_EditionMotifs_1 = require("DonneesListe_EditionMotifs");
const DonneesListe_EditionCategoriesDossiers_1 = require("DonneesListe_EditionCategoriesDossiers");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Cache_1 = require("Cache");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetCelluleMultiSelectionMotif_1 = require("ObjetCelluleMultiSelectionMotif");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const DonneesListe_SelectionMotifs_1 = require("DonneesListe_SelectionMotifs");
const TypeOrigineCreationCategorieDossier_1 = require("TypeOrigineCreationCategorieDossier");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetElement_1 = require("ObjetElement");
const GlossaireDossierVieScolaire_1 = require("GlossaireDossierVieScolaire");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_DossierVieScolaire extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.ids = {
			conteneurPrincipal: "ObjetFenetre_DossierVieScolaire",
			zoneProprietesGenerales: "ZoneProprietesGenerales",
			zoneContexte: "ZoneContexte",
			conteneurMotifUnique: "ConteneurMotifUnique",
			conteneurCategorieUnique: "ConteneurCategorieUnique",
			conteneurMotifsMultiples: "ConteneurMotifsMultiples",
			conteneurBoutonEditerMotif: "ConteneurBoutonEditerMotif",
			conteneurBoutonEditerCategorie: "ConteneurBoutonEditerCategorie",
			textareaCommentaire: "textareaCommentaire",
			contexte: this.Nom + "_ContexteDossierVieScolaire",
			victime: this.Nom + "_victime",
			restriction: GUID_1.GUID.getId() + "_restriction",
			listeDocuments: this.Nom + "_ListeDocuments",
		};
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.surEvenementSelecteurDate.bind(this),
			this._initialiserSelecteurDate,
		);
		this.identCategorie = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.surEvenementComboCategories.bind(this),
			this._initialiserComboCategories,
		);
		this.identCMS_Motifs = this.add(
			ObjetCelluleMultiSelectionMotif_1.ObjetCelluleMultiSelectionMotif,
			this.surEvenementSelecteurMultipleMotifs.bind(this),
			this._initialiserSelecteurMultipleMotifs,
		);
		this.identMotif = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.surEvenementComboMotif.bind(this),
			this._initialiserComboMotif,
		);
		this.identRespAdm = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.surEvenementComboRespAdm.bind(this),
			this._initialiserCombosContexte.bind(
				this,
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.RespAdmin,
			),
		);
		this.identLieu = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.surEvenementComboLieu.bind(this),
			this._initialiserCombosContexte.bind(
				this,
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Lieu,
			),
		);
		this.identVictime = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.surEvenementComboVictime.bind(this),
			this._initialiserCombosContexte.bind(
				this,
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Victime,
			),
		);
		this.identTemoin = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.surEvenementComboTemoin.bind(this),
			this._initialiserCombosContexte.bind(
				this,
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Temoin,
			),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnUpload: {
				getOptionsSelecFile: function () {
					return {
						genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
						interdireDoublonsLibelle: false,
						maxFiles: 0,
						maxSize: aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
						),
					};
				},
				addFiles: function (aElt) {
					aInstance.listePJEleve.addElement(aElt.eltFichier);
					aInstance.dossier.listePJ.addElement(aElt.eltFichier);
					aInstance._redessinerDocumentsFournis(aInstance.dossier.listePJ);
				},
				getDisabled: function () {
					return false;
				},
				getLibelle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AjouterDesPiecesJointes",
					);
				},
				getIcone() {
					return "icon_piece_jointe";
				},
			},
			chipsDocJoint: {
				eventBtn: function (aIndice) {
					let lElement = aInstance.dossier.listePJ
						? aInstance.dossier.listePJ.get(aIndice)
						: null;
					if (lElement) {
						const message =
							"<div ie-ellipsis-fixe>" +
							ObjetTraduction_1.GTraductions.getValeur(
								"selecteurPJ.msgConfirmPJ",
								[lElement.getLibelle()],
							) +
							"</div>";
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: message,
							callback: function (aAccepte) {
								if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
									lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
									aInstance._redessinerDocumentsFournis(
										aInstance.dossier.listePJ,
									);
								}
							},
						});
					}
				},
			},
		});
	}
	jsxDisplayBoutonEditerCategorie() {
		return this.autorisations ? this.autorisations.creerMotif : false;
	}
	jsxModeleBoutonEditerCategorie() {
		return {
			event: () => {
				this.surEvenementBoutonEditerCategorie();
			},
			getDisabled: () => {
				return !this.autorisations || !this.autorisations.creerMotif;
			},
		};
	}
	jsxDisplayBoutonEditerMotif() {
		return this.autorisations ? this.autorisations.creerMotif : false;
	}
	jsxModeleBoutonEditerMotif() {
		return {
			event: () => {
				this.surEvenementBoutonEditerMotif();
			},
			getDisabled: () => {
				return !this.autorisations || !this.autorisations.creerMotif;
			},
		};
	}
	setCommentaire() {
		this.dossier.commentaire = ObjetHtml_1.GHtml.getValue(
			this.ids.textareaCommentaire,
		);
	}
	resetDonneesAffichage() {
		this.getInstance(this.identCategorie).reset();
		this.getInstance(this.identMotif).reset();
		this.getInstance(this.identRespAdm).reset();
		this.getInstance(this.identLieu).reset();
		this.getInstance(this.identVictime).reset();
		this.getInstance(this.identTemoin).reset();
		ObjetHtml_1.GHtml.setValue(this.ids.textareaCommentaire, "");
		ObjetHtml_1.GHtml.setValue(this.ids.restriction, "");
	}
	setDonnees(aParam) {
		this.resetDonneesAffichage();
		this.listePJEleve = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.listePJEleve,
		);
		this.dossier = MethodesObjet_1.MethodesObjet.dupliquer(aParam.dossier);
		this.donneesSaisie = aParam.donneesSaisieDossier;
		if (
			this.dossier &&
			this.dossier.respAdmin &&
			[
				Enumere_Ressource_1.EGenreRessource.PersonnelHistorique,
				Enumere_Ressource_1.EGenreRessource.EnseignantHistorique,
			].includes(this.dossier.respAdmin.getGenre())
		) {
			const lTraduction =
				this.dossier.respAdmin.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.PersonnelHistorique
					? ObjetTraduction_1.GTraductions.getValeur("PersonnelsHistorique")
					: ObjetTraduction_1.GTraductions.getValeur("ProfesseursHistorique");
			const lElement = ObjetElement_1.ObjetElement.create({
				Libelle: lTraduction,
				Numero: 0,
				Genre: this.dossier.respAdmin.getGenre(),
				estCumul: true,
				AvecSelection: false,
				Position: 0,
				ClassAffichage: "Gras",
			});
			const lFils = ObjetElement_1.ObjetElement.create({
				Libelle: this.dossier.respAdmin.getLibelle(),
				pere: lElement,
				Position: 1,
				ClassAffichage: "p-left",
			});
			this.donneesSaisie.listeRespAdmin.add(lElement);
			this.donneesSaisie.listeRespAdmin.add(lFils);
		}
		this.donneesSaisie.listeRespAdmin.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				switch (D.getGenre()) {
					case Enumere_Ressource_1.EGenreRessource.Aucune:
						return 0;
					case Enumere_Ressource_1.EGenreRessource.Personnel:
						return 1;
					case Enumere_Ressource_1.EGenreRessource.Enseignant:
						return 2;
					default:
						return 3;
				}
			}),
			ObjetTri_1.ObjetTri.init("Position"),
		]);
		this.donneesSaisie.listeRespAdmin.trier();
		this.autorisations = aParam.autorisations;
		this.numeroEleve = aParam.numEleve;
		this.restriction = aParam.restriction;
		const lPeriode = aParam.periode;
		if (!!this.restriction && !!this.restriction.estRestreint) {
			ObjetHtml_1.GHtml.setHtml(
				this.ids.restriction,
				this._composeRestriction(this.restriction),
			);
		}
		let i = 0;
		if (aParam.donneesSaisieDossier) {
			aParam.donneesSaisieDossier.listeCategories.setTri([
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			aParam.donneesSaisieDossier.listeCategories.trier();
			this.getInstance(this.identCategorie).setDonnees(
				aParam.donneesSaisieDossier.listeCategories,
			);
			if (!!aParam.dossier) {
				i =
					aParam.donneesSaisieDossier.listeCategories.getIndiceParNumeroEtGenre(
						aParam.dossier.getNumero(),
					);
			}
			this.getInstance(this.identCategorie).setSelection(i >= 0 ? i : 0);
		}
		if (!aParam.dossier) {
			this.getInstance(this.identDate).setDonnees(
				this.parametresSco.getDateDansPeriodeDeNotation(
					null,
					!!lPeriode ? lPeriode.getNumero() : 0,
				),
			);
		} else {
			this.getInstance(this.identDate).setDonnees(aParam.dossier.date);
			if (
				aParam.dossier.getGenre() ===
				TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur
			) {
				i = this.donneesSaisie.listeCategories.getIndiceParLibelle(
					aParam.dossier.getLibelle(),
				);
			} else {
				i = this.donneesSaisie.listeCategories.getIndiceParNumeroEtGenre(
					null,
					aParam.dossier.Genre,
				);
			}
			this.getInstance(this.identCategorie).setSelection(i);
			this._redessinerDocumentsFournis(this.dossier.listePJ);
		}
		if (aParam.dossier.listeMotifs.count() > 0) {
			i = this.elementCategorieCourant.listeMotifs.getIndiceParNumeroEtGenre(
				aParam.dossier.listeMotifs.get(0).Numero,
			);
			this.getInstance(this.identMotif).setSelection(i);
		}
		if (this.dossier && this.estAvecMotifsMultiples(this.dossier.getGenre())) {
			this.getInstance(this.identCMS_Motifs).setDonnees(
				aParam.dossier.listeMotifs,
			);
			if (
				this.dossier &&
				this.dossier.listeMotifs &&
				aParam.dossier.listeMotifs
			) {
				const lListeMotifs = this.dossier.listeMotifs;
				aParam.dossier.listeMotifs.parcourir((D) => {
					lListeMotifs.addElement(D);
				});
			}
		}
		this.afficher();
	}
	setDonneesAffichage(aDonnees) {
		let i, j, k, l, m;
		this.dossier.listeMotifs = new ObjetListeElements_1.ObjetListeElements();
		if (this.estAvecMotifsMultiples(this.dossier.getGenre())) {
			this.getInstance(this.identCMS_Motifs).setDonnees(
				this.dossier.listeMotifs,
			);
		} else {
			this.getInstance(this.identMotif).setDonnees(
				aDonnees.listeMotifs,
				i ? i : 0,
			);
		}
		j = this.donneesSaisie.listeRespAdmin.getIndiceParNumeroEtGenre(
			this.dossier.respAdmin.getNumero(),
			this.dossier.respAdmin.getGenre(),
		);
		this.getInstance(this.identRespAdm).setDonnees(
			this.donneesSaisie.listeRespAdmin,
			j,
		);
		this.getInstance(this.identRespAdm).setActif(
			!this.restriction.estRestreint,
		);
		k = this.donneesSaisie.listeLieux.getIndiceParNumeroEtGenre(
			this.dossier.lieu.Numero,
		);
		this.getInstance(this.identLieu).setDonnees(
			this.donneesSaisie.listeLieux,
			k,
		);
		l = this.donneesSaisie.listeActeurs.getIndiceParNumeroEtGenre(
			this.dossier.victime.Numero,
		);
		this.getInstance(this.identVictime).setDonnees(
			this.donneesSaisie.listeActeurs,
			l,
		);
		m = this.donneesSaisie.listeActeurs.getIndiceParNumeroEtGenre(
			this.dossier.temoin.Numero,
		);
		this.getInstance(this.identTemoin).setDonnees(
			this.donneesSaisie.listeActeurs,
			m,
		);
		ObjetHtml_1.GHtml.setValue(
			this.ids.textareaCommentaire,
			this.dossier.commentaire,
		);
		if (!this.dossier.existeNumero()) {
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		} else {
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ id: this.ids.conteneurPrincipal },
				IE.jsx.str(
					"div",
					{ id: this.ids.zoneProprietesGenerales },
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"div",
							{ class: "m-bottom" },
							GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
								.Date,
						),
						IE.jsx.str("div", { id: this.getNomInstance(this.identDate) }),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"div",
							{ class: "m-bottom" },
							GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
								.Categorie,
						),
						IE.jsx.str(
							"div",
							{ id: this.ids.conteneurCategorieUnique },
							IE.jsx.str("div", {
								id: this.getNomInstance(this.identCategorie),
							}),
							IE.jsx.str(
								"div",
								{
									id: this.ids.conteneurBoutonEditerCategorie,
									"ie-display": this.jsxDisplayBoutonEditerCategorie.bind(this),
								},
								IE.jsx.str(
									"ie-bouton",
									{
										"ie-model": this.jsxModeleBoutonEditerCategorie.bind(this),
										"ie-tooltiplabel":
											GlossaireDossierVieScolaire_1
												.TradGlossaireDossierVieScolaire.InfoEditionCategorie,
									},
									"...",
								),
							),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"div",
							{ class: "m-bottom" },
							GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
								.Motif,
						),
						IE.jsx.str(
							"div",
							{ id: this.ids.conteneurMotifUnique },
							IE.jsx.str("div", { id: this.getNomInstance(this.identMotif) }),
							IE.jsx.str(
								"div",
								{
									id: this.ids.conteneurBoutonEditerMotif,
									"ie-display": this.jsxDisplayBoutonEditerMotif.bind(this),
								},
								IE.jsx.str(
									"ie-bouton",
									{
										"ie-model": this.jsxModeleBoutonEditerMotif.bind(this),
										"ie-tooltiplabel":
											GlossaireDossierVieScolaire_1
												.TradGlossaireDossierVieScolaire.InfoEditionMotif,
									},
									"...",
								),
							),
						),
						IE.jsx.str(
							"div",
							{ id: this.ids.conteneurMotifsMultiples },
							IE.jsx.str("div", {
								id: this.getNomInstance(this.identCMS_Motifs),
							}),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"div",
							{ class: "m-bottom" },
							GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
								.RespAdmin,
						),
						IE.jsx.str("div", { id: this.getNomInstance(this.identRespAdm) }),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("div", { id: this.ids.restriction }),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain", id: this.ids.zoneContexte },
					IE.jsx.str("div", { id: this.ids.contexte }, this.composeContexte()),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"label",
							{ class: "ie-titre-petit m-bottom" },
							GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
								.Commentaires,
						),
						IE.jsx.str("textarea", {
							id: this.ids.textareaCommentaire,
							onkeyup: this.Nom + ".setCommentaire ()",
							"aria-label":
								GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
									.Commentaires,
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "pj-global-conteneur m-y-l" },
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": "btnUpload",
						"ie-selecfile": true,
						class: "pj",
						role: "button",
					}),
					IE.jsx.str("div", {
						class: "pj-liste-conteneur",
						id: this.ids.listeDocuments,
					}),
				),
			),
		);
		return H.join("");
	}
	composeContexte() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit m-bottom" },
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.Contexte,
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain m-bottom-s" },
					IE.jsx.str(
						"div",
						{ class: "fix-bloc", style: ObjetStyle_1.GStyle.composeWidth(84) },
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Lieu,
					),
					IE.jsx.str("div", {
						class: "fluid-bloc",
						id: this.getNomInstance(this.identLieu),
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain p-top m-bottom-s", id: this.ids.victime },
					IE.jsx.str(
						"div",
						{ class: "fix-bloc", style: ObjetStyle_1.GStyle.composeWidth(84) },
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
							.Victime,
					),
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identVictime),
						class: "fluid-bloc full-width",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain p-top" },
					IE.jsx.str(
						"div",
						{ class: "fix-bloc", style: ObjetStyle_1.GStyle.composeWidth(84) },
						GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
							.Temoin,
					),
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identTemoin),
						class: "fluid-bloc full-width",
					}),
				),
			),
		);
		return lHtml.join("");
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1 && this.dossier.listeMotifs.count() === 0) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message:
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
						.MsgMotifDossierObligatoire,
			});
		} else {
			this.fermer();
			let lIndiceElement =
				this.donneesSaisie.listeCategories.getIndiceParLibelle(
					this.dossier.getLibelle(),
				);
			this.donneesSaisie.listeCategories.get(lIndiceElement).estUtilise = true;
			this.callback.appel(
				aNumeroBouton,
				this.dossier,
				this.listePJEleve,
				this.donneesSaisie.listeCategories,
			);
		}
	}
	_redessinerDocumentsFournis(aListe) {
		let lIdent = this.ids.listeDocuments;
		ObjetHtml_1.GHtml.setHtml(
			lIdent,
			UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(aListe, {
				separateur: " ",
				IEModelChips: "chipsDocJoint",
				genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
				argsIEModelChips: [],
				maxWidth: 300,
			}),
			{ controleur: this.controleur },
		);
	}
	estAvecMotifsMultiples(aTypeCategorie) {
		return (
			[
				TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Comportement,
				TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Victime,
			].indexOf(aTypeCategorie) !== -1
		);
	}
	_initialiserSelecteurDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			ariaLabel:
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Date,
		});
	}
	surEvenementSelecteurDate(aDate) {
		if (!ObjetDate_1.GDate.estJourEgal(this.dossier.date, aDate)) {
			this.dossier.date = aDate;
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	_initialiserComboCategories(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 160,
			labelWAICellule:
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Categorie,
		});
	}
	surEvenementComboCategories(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.dossier.Genre = aParams.element.Genre;
			this.dossier.Libelle = aParams.element.Libelle;
			this.dossier.couleur = aParams.element.couleur;
			let i;
			if (
				aParams.element.getGenre() ===
				TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur
			) {
				i = this.donneesSaisie.listeCategories.getIndiceParLibelle(
					aParams.element.getLibelle(),
				);
			} else {
				i = this.donneesSaisie.listeCategories.getIndiceParNumeroEtGenre(
					null,
					aParams.element.Genre,
				);
			}
			this.elementCategorieCourant = this.donneesSaisie.listeCategories.get(i);
			if (this.getInstance(this.identCategorie).InteractionUtilisateur) {
				this.elementCategorieCourant.estUtilise = true;
			}
			if (
				aParams.element.getGenre() ===
					TypeOrigineCreationCategorieDossier_1
						.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur &&
				!this.elementCategorieCourant.listeMotifs
			) {
				this.elementCategorieCourant.listeMotifs =
					new ObjetListeElements_1.ObjetListeElements();
			}
			const lEstAvecMotifsMultiples = this.estAvecMotifsMultiples(
				aParams.element.getGenre(),
			);
			ObjetHtml_1.GHtml.setDisplay(
				this.ids.conteneurMotifUnique,
				!lEstAvecMotifsMultiples,
			);
			ObjetHtml_1.GHtml.setDisplay(this.ids.conteneurCategorieUnique, true);
			ObjetHtml_1.GHtml.setDisplay(
				this.ids.conteneurMotifsMultiples,
				lEstAvecMotifsMultiples,
			);
			switch (aParams.element.getGenre()) {
				case TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Sante:
				case TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Victime:
					ObjetHtml_1.GHtml.setDisplay(this.ids.contexte, true);
					ObjetHtml_1.GHtml.setDisplay(this.ids.victime, false);
					this.setDonneesAffichage(this.elementCategorieCourant);
					break;
				case TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Social:
					ObjetHtml_1.GHtml.setDisplay(this.ids.contexte, false);
					ObjetHtml_1.GHtml.setDisplay(this.ids.victime, false);
					this.setDonneesAffichage(this.elementCategorieCourant);
					break;
				case TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Comportement:
				case TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur:
					ObjetHtml_1.GHtml.setDisplay(this.ids.contexte, true);
					ObjetHtml_1.GHtml.setDisplay(this.ids.victime, true);
					this.setDonneesAffichage(this.elementCategorieCourant);
					break;
				case TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Divers:
					ObjetHtml_1.GHtml.setDisplay(this.ids.contexte, true);
					ObjetHtml_1.GHtml.setDisplay(this.ids.victime, true);
					this.setDonneesAffichage(this.elementCategorieCourant);
					break;
				case TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Orientation:
					ObjetHtml_1.GHtml.setDisplay(this.ids.contexte, false);
					ObjetHtml_1.GHtml.setDisplay(this.ids.victime, false);
					this.setDonneesAffichage(this.elementCategorieCourant);
					break;
				default:
					break;
			}
		}
	}
	_initialiserSelecteurMultipleMotifs(aInstance) {
		const lAvecCreationMotifs = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.dossierVS.saisieMotifsDossiersVS,
		);
		aInstance.setOptions({
			largeurBouton: 180,
			gestionnaireMotifs: {
				paramListe: {
					avecCreation: lAvecCreationMotifs,
					avecEdition: lAvecCreationMotifs,
					avecSuppression: lAvecCreationMotifs,
				},
				avecLigneCreation: !!lAvecCreationMotifs,
				creations: lAvecCreationMotifs
					? [
							DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs
								.colonnes.motif,
							DonneesListe_SelectionMotifs_1.DonneesListe_SelectionMotifs
								.colonnes.incident,
						]
					: null,
				droits: { avecCreationMotifs: lAvecCreationMotifs },
			},
		});
	}
	surEvenementSelecteurMultipleMotifs(aNumeroBouton, aListeDonnees, aListeTot) {
		if (aNumeroBouton === 1) {
			this.dossier.listeMotifs = aListeDonnees;
			if (aListeTot !== null) {
				this.elementCategorieCourant.listeMotifs = aListeTot;
				this.elementCategorieCourant.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				Cache_1.GCache.dossierVS.setDonnee(
					this.numeroEleve.toString(),
					this.donneesSaisie,
				);
			}
		}
	}
	_initialiserComboMotif(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 160,
			labelWAICellule:
				GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.Motif,
		});
	}
	surEvenementComboMotif(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.dossier.listeMotifs = new ObjetListeElements_1.ObjetListeElements();
			this.dossier.listeMotifs.addElement(aParams.element);
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	_initialiserCombosContexte(aLabelWAIZone, aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 160,
			labelWAICellule: aLabelWAIZone,
		});
	}
	surEvenementComboRespAdm(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (
				aParams.element.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Aucune
			) {
				this.dossier.respAdmin = new ObjetElement_1.ObjetElement(
					"",
					aParams.element.getNumero(),
					aParams.element.getGenre(),
				);
			} else {
				this.dossier.respAdmin = aParams.element;
			}
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	surEvenementComboLieu(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.dossier.lieu = aParams.element;
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	surEvenementComboVictime(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.dossier.victime = aParams.element;
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	surEvenementComboTemoin(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.dossier.temoin = aParams.element;
			this.dossier.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	surEvenementBoutonEditerMotif() {
		if (this.autorisations.creerMotif) {
			const lFenetreMotif = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_Liste_1.ObjetFenetre_Liste,
				{
					pere: this,
					evenement: function (aGenreBouton, aSelection, aAvecChangementListe) {
						if (aGenreBouton === 1) {
							if (
								aAvecChangementListe ||
								this.elementCategorieCourant.listeMotifs.existeElementPourValidation()
							) {
								Cache_1.GCache.dossierVS.setDonnee(
									this.numeroEleve.toString(),
									this.donneesSaisie,
								);
								this.elementCategorieCourant.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								this.getInstance(this.identMotif).setDonnees(
									this.elementCategorieCourant.listeMotifs,
								);
							}
							if (aSelection !== null && aSelection !== undefined) {
								this.getInstance(this.identMotif).setSelectionParIndice(
									aSelection,
								);
							}
						}
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							modale: true,
							titre:
								GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
									.InfoEditionMotif,
							largeur: 300,
							hauteur: 400,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
						aInstance.paramsListe = {
							titres: [
								GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
									.Motif,
							],
							tailles: ["100%"],
							creations: 0,
							avecLigneCreation: true,
							editable: true,
						};
					},
				},
			);
			lFenetreMotif.setDonnees(
				new DonneesListe_EditionMotifs_1.DonneesListe_EditionMotifs(
					this.elementCategorieCourant.listeMotifs,
				),
			);
		}
	}
	surEvenementBoutonEditerCategorie() {
		if (this.autorisations.creerMotif) {
			const lFenetreMotif = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_Liste_1.ObjetFenetre_Liste,
				{
					pere: this,
					evenement: function (aGenreBouton, aSelection, aAvecChangementListe) {
						if (aGenreBouton === 1) {
							if (
								aAvecChangementListe ||
								this.donneesSaisie.listeCategories.existeElementPourValidation()
							) {
								Cache_1.GCache.dossierVS.setDonnee(
									this.numeroEleve.toString(),
									this.donneesSaisie,
								);
								if (
									this.elementCategorieCourant.Genre ===
									TypeOrigineCreationCategorieDossier_1
										.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur
								) {
									this.elementCategorieCourant.setEtat(
										Enumere_Etat_1.EGenreEtat.Modification,
									);
								}
								this.getInstance(this.identCategorie).setDonnees(
									this.donneesSaisie.listeCategories,
								);
							}
							if (aSelection !== null && aSelection !== undefined) {
								let lSelection =
									this.donneesSaisie.listeCategories.getIndiceParNumeroEtGenre(
										this.elementCategorieCourant.getNumero(),
									);
								if (
									lSelection >= 0 &&
									this.elementCategorieCourant.getEtat() !==
										Enumere_Etat_1.EGenreEtat.Suppression &&
									aSelection === -1
								) {
									this.getInstance(this.identCategorie).setSelectionParIndice(
										lSelection,
									);
								} else {
									this.getInstance(this.identCategorie).setSelectionParIndice(
										aSelection >= 0 ? aSelection : 0,
									);
								}
							}
						}
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							modale: true,
							titre:
								GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
									.InfoEditionCategorie,
							largeur: 300,
							hauteur: 400,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
						const lColonnes = [];
						lColonnes.push({
							id: DonneesListe_EditionCategoriesDossiers_1
								.DonneesListe_EditionCategoriesDossiers.colonnes.couleur,
							taille: 30,
							titre: "",
						});
						lColonnes.push({
							id: DonneesListe_EditionCategoriesDossiers_1
								.DonneesListe_EditionCategoriesDossiers.colonnes.libelle,
							taille: "100%",
							titre:
								GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire
									.Categorie,
						});
						aInstance.paramsListe = {
							optionsListe: {
								colonnes: lColonnes,
								listeCreations: 0,
								avecLigneCreation: true,
							},
						};
					},
				},
			);
			lFenetreMotif.setDonnees(
				new DonneesListe_EditionCategoriesDossiers_1.DonneesListe_EditionCategoriesDossiers(
					this.donneesSaisie.listeCategories,
					() => {
						lFenetreMotif.actualiserListe(true);
					},
				),
			);
		}
	}
	_composeRestriction(aRestriction) {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "NoWrap", title: aRestriction.hintRestriction },
				IE.jsx.str("div", {
					class: "Image_AccesRestreint InlineBlock AlignementMilieuVertical",
				}),
				IE.jsx.str(
					"div",
					{ class: "InlineBlock AlignementMilieuVertical EspaceGauche" },
					GlossaireDossierVieScolaire_1.TradGlossaireDossierVieScolaire.XPersonnesOntAccesDossier.format(
						aRestriction.nbRestreint,
					),
				),
			),
		);
		return H.join("");
	}
}
exports.ObjetFenetre_DossierVieScolaire = ObjetFenetre_DossierVieScolaire;
