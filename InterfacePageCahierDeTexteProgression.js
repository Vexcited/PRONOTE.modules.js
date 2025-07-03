exports.InterfacePageCahierDeTexteProgression = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const _InterfacePageSaisieCahierDeTextes_1 = require("_InterfacePageSaisieCahierDeTextes");
const Enumere_ElementCDT_1 = require("Enumere_ElementCDT");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfaceTAFProgression_1 = require("InterfaceTAFProgression");
const ObjetFenetre_Categorie_1 = require("ObjetFenetre_Categorie");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const ObjetFenetre_PieceJointe_1 = require("ObjetFenetre_PieceJointe");
const ObjetRequeteListeCDTProgressions_1 = require("ObjetRequeteListeCDTProgressions");
const ObjetRequeteListeContenuTAFsEtContenus_1 = require("ObjetRequeteListeContenuTAFsEtContenus");
const ObjetRequeteSaisieCDTProgressions_1 = require("ObjetRequeteSaisieCDTProgressions");
const UtilitaireVisuProgression_1 = require("UtilitaireVisuProgression");
const InterfaceContenuCahierDeTextes_1 = require("InterfaceContenuCahierDeTextes");
const EGenreEvenementContenuCahierDeTextes_1 = require("EGenreEvenementContenuCahierDeTextes");
const EGenreFenetreDocumentJoint_1 = require("EGenreFenetreDocumentJoint");
const InterfaceSelectionPlanProgression_1 = require("InterfaceSelectionPlanProgression");
const Enumere_Event_1 = require("Enumere_Event");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
class InterfacePageCahierDeTexteProgression extends _InterfacePageSaisieCahierDeTextes_1._InterfacePageSaisieCahierDeTextes {
	constructor(...aParams) {
		super(...aParams);
		this.idZonePage = this.Nom + "_zonePage";
		this.idZoneMessage = this.Nom + "_zoneMessage";
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPreResize,
			this._surPreResize,
		);
		this.avecDocumentJoint = [];
		this.avecDocumentJoint[
			Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
		] = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
		);
		this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud] =
			GEtatUtilisateur.listeCloud.count() > 0;
		this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Url] =
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
			);
	}
	construireInstances() {
		this.identSelectionProgression = this.add(
			InterfaceSelectionPlanProgression_1.InterfaceSelectionPlanProgression,
			null,
			this._initSelectionProgression,
		);
		this.identEditionPieceJointe = this.add(
			ObjetFenetre_PieceJointe_1.ObjetFenetre_PieceJointe,
			this.evenementEditionDocumentJoint,
		);
		this.identFenetreEditionCategorie = this.add(
			ObjetFenetre_Categorie_1.ObjetFenetre_Categorie,
			this.evenementEditionCategorie,
		);
		if (GEtatUtilisateur.listeCloud.count() > 0) {
			this.identFenetreFichiersCloud = this.addFenetre(
				ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
				this.eventFenetreFichiersCloud,
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnRemplirProgression: {
				event: function () {
					aInstance
						.getInstance(aInstance.identSelectionProgression)
						.remplirProgressionCourante(this.node);
				},
				getDisplay: function () {
					const lProgression = aInstance
						.getInstance(aInstance.identSelectionProgression)
						.getProgressionSelection();
					return !!(
						lProgression &&
						lProgression.listeDossiers &&
						lProgression.listeDossiers.count() === 0
					);
				},
				getDisabled: function () {
					return aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			getTitreContenu: function () {
				const lProgression = aInstance
					.getInstance(aInstance.identSelectionProgression)
					.getProgressionSelection();
				if (!lProgression) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"progression.SelectionnezProgression",
					);
				}
				if (
					!lProgression.listeDossiers ||
					lProgression.listeDossiers.count() === 0
				) {
					return "";
				}
				if (!aInstance.itemTreeView) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"progression.SelectionnezElement",
					);
				}
				switch (aInstance.itemTreeView.getGenre()) {
					case Enumere_Ressource_1.EGenreRessource.DossierProgression:
						return ObjetTraduction_1.GTraductions.getValeur(
							"progression.VisualisationElementsDuDossier",
						);
					default:
						return ObjetTraduction_1.GTraductions.getValeur(
							"progression.EditionDeLElementSelectionne",
						);
				}
			},
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="InterfacePageCahierDeTexteProgression">',
			'<div id="',
			this.getNomInstance(this.identSelectionProgression),
			'"></div>',
			"<div>",
			'<div style="flex: none; padding-bottom: 5px;">',
			'<div class="bandeauProg">',
			'<ie-bouton ie-model="btnRemplirProgression" ie-display="getDisplay">',
			ObjetTraduction_1.GTraductions.getValeur(
				"progression.RemplirLaProgression",
			),
			"</ie-bouton>",
			'<div ie-html="getTitreContenu"></div>',
			"</div>",
			"</div>",
			'<div id="',
			this.Nom,
			'_Contenus" oncontextmenu="GNavigateur.stopperEvenement (event); return false;" style="flex: 2 1 0;"></div>',
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	recupererDonnees() {
		this._requeteListeCDT();
	}
	valider() {
		this.setEtatSaisie(false);
		const lInstance = this.getInstance(this.identEditionPieceJointe);
		new ObjetRequeteSaisieCDTProgressions_1.ObjetRequeteSaisieCDTProgressions(
			this,
		)
			.addUpload({
				listeFichiers: lInstance.ListeFichiers,
				listeDJCloud: this.listeDocumentsJoints,
				callback: function () {
					lInstance.reset();
				},
			})
			.lancerRequete(
				this.listeProgressions,
				this.listeDocumentsJoints,
				this.listeCategories,
			)
			.then((aParams) => {
				this._progressionsASelectionner = aParams.JSONRapportSaisie
					? aParams.JSONRapportSaisie.listeProgressionsCrees
					: null;
				this.actionSurValidation();
			});
	}
	_afficherPage(aSelection) {
		const lAfficherMessage =
			aSelection === null ||
			aSelection === undefined ||
			this.listeProgressions.getNbrElementsExistes() === 0;
		ObjetHtml_1.GHtml.setDisplay(this.idZoneMessage, lAfficherMessage);
		ObjetHtml_1.GHtml.setDisplay(this.idZonePage, !lAfficherMessage);
		this.surResizeInterface();
	}
	afficherPage() {
		this.getInstance(this.identSelectionProgression).recupererDonnees();
		this._requeteListeCDT();
	}
	eventFenetreFichiersCloud(aParam) {
		if (aParam.listeNouveauxDocs && aParam.listeNouveauxDocs.count() > 0) {
			const lElementCourant = this.contenuCourant || this.tafCourant;
			lElementCourant.estVide = false;
			lElementCourant.ListePieceJointe.add(aParam.listeNouveauxDocs);
			this.listeDocumentsJoints.add(aParam.listeNouveauxDocs);
			this._actualiserAffSaisie();
			lElementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	_bloquerInterfaceDroite(aBloquer) {
		if (aBloquer !== false) {
			const lElementACouvrir = ObjetHtml_1.GHtml.getElement(
				this.Nom + "_Contenus",
			);
			const lRectACouvrir =
				ObjetPosition_1.GPosition.getClientRect(lElementACouvrir);
			this._divBloquant = ObjetHtml_1.GHtml.htmlToDOM(
				'<div style="position:fixed; z-index:1000;' +
					"top:" +
					lRectACouvrir.top +
					"px;" +
					"left:" +
					lRectACouvrir.left +
					"px;" +
					ObjetStyle_1.GStyle.composeHeight(lRectACouvrir.height + 2) +
					ObjetStyle_1.GStyle.composeWidth(lRectACouvrir.width + 2) +
					ObjetStyle_1.GStyle.composeOpacite(0.01) +
					ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.blanc) +
					'"></div>',
			);
			ObjetHtml_1.GHtml.insererElementDOM(
				lElementACouvrir,
				this._divBloquant,
				true,
			);
		} else if (this._divBloquant) {
			$(this._divBloquant).remove();
			delete this._divBloquant;
		}
	}
	getListeDocumentsJointsSelonContexte(aGenreElementSelectionne) {
		return aGenreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu
			? this.contenuCourant.ListePieceJointe
			: this.tafCourant.ListePieceJointe;
	}
	evenementSurBoutonDocumentJoint(aGenre, aLigneContextMenu) {
		const lListeDocumentsJointsActive =
			this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
		const lGenreFentrePJ =
			this.genreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu
				? EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.CahierDeTextes
				: EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.TravailAFaire;
		if (aGenre !== Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud) {
			this.getInstance(this.identEditionPieceJointe).afficherFenetrePJ({
				listePJTot: this.listeDocumentsJoints,
				listePJContexte: lListeDocumentsJointsActive,
				genreFenetrePJ: lGenreFentrePJ,
				genrePJ: aGenre,
				genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
				optionsSelecFile: {
					maxSize: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
					),
					avecTransformationFlux_versCloud: true,
				},
			});
		} else {
			this.getInstance(this.identFenetreFichiersCloud).setDonnees({
				service: aLigneContextMenu.getGenre(),
			});
		}
	}
	_getProgressionSelectionne() {
		return this.listeProgressions.get(
			this.etatUtilisateur.getIndiceProgressionSelection(),
		);
	}
	evenementEditionDocumentJoint() {
		const lListeDocumentsJointsActive =
			this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
		for (let I = 0; I < this.listeDocumentsJoints.count(); I++) {
			let lDocumentJoint = lListeDocumentsJointsActive.getElementParNumero(
				this.listeDocumentsJoints.getNumero(I),
			);
			const lActif =
				this.listeDocumentsJoints.get(I).Actif &&
				this.listeDocumentsJoints.existe(I);
			if (lDocumentJoint) {
				if (!lActif) {
					lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					if (
						this.genreElementSelectionne ===
						Enumere_ElementCDT_1.EGenreElementCDT.Contenu
					) {
						if (
							this.contenuCourant.Numero === null ||
							this.contenuCourant.Numero === undefined
						) {
							this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							this.contenuCourant.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					} else {
						if (
							this.tafCourant.Numero === null ||
							this.tafCourant.Numero === undefined
						) {
							this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				}
			} else {
				if (lActif) {
					lDocumentJoint = new ObjetElement_1.ObjetElement(
						this.listeDocumentsJoints.getLibelle(I),
						this.listeDocumentsJoints.getNumero(I),
						this.listeDocumentsJoints.getGenre(I),
						this.listeDocumentsJoints.getPosition(I),
						this.listeDocumentsJoints.getActif(I),
					);
					lDocumentJoint.url = this.listeDocumentsJoints.get(I).url;
					lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					if (
						this.genreElementSelectionne ===
						Enumere_ElementCDT_1.EGenreElementCDT.Contenu
					) {
						if (
							this.contenuCourant.Numero === null ||
							this.contenuCourant.Numero === undefined
						) {
							this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							this.contenuCourant.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					} else {
						if (
							this.tafCourant.Numero === null ||
							this.tafCourant.Numero === undefined
						) {
							this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
					lListeDocumentsJointsActive.addElement(lDocumentJoint);
				}
			}
		}
		lListeDocumentsJointsActive.trier();
		if (
			this.genreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu
		) {
			this.getInstance(
				this.identContenus[this.indiceElementSelectionne],
			).actualiserContenu(
				this.contenuCourant,
				false,
				this.avecDocumentJoint,
				false,
			);
		} else {
			this.getInstance(
				this.identContenus[this.indiceElementSelectionne],
			).actualiserTAF(this.tafCourant, false, this.avecDocumentJoint, false);
		}
	}
	_initCahierDeTextes(aNumeroCDT) {
		const lCahierDeTextes = new ObjetElement_1.ObjetElement(
			"",
			aNumeroCDT ? aNumeroCDT : null,
		);
		lCahierDeTextes.listeContenus =
			new ObjetListeElements_1.ObjetListeElements();
		lCahierDeTextes.ListeTravailAFaire =
			new ObjetListeElements_1.ObjetListeElements();
		if (!aNumeroCDT) {
			lCahierDeTextes.publie = false;
		}
		lCahierDeTextes.setEtat(
			aNumeroCDT
				? Enumere_Etat_1.EGenreEtat.Modification
				: Enumere_Etat_1.EGenreEtat.Creation,
		);
		return lCahierDeTextes;
	}
	_remplirDetailsListeContenuTAFsEtContenus(
		aListeContenusOrigine,
		aMatiere,
		aListeTAFs,
		aListeContenus,
	) {
		for (let i = 0; i < aListeTAFs.count(); i++) {
			let lElement = aListeTAFs.get(i);
			let lElementAff = aListeContenusOrigine.getElementParNumeroEtGenre(
				lElement.Numero,
				Enumere_Ressource_1.EGenreRessource.TravailAFaire,
			);
			lElementAff.descriptif = lElement.descriptif;
			lElementAff.date = lElement.PourLe;
			lElementAff.ListePieceJointe = lElement.ListePieceJointe
				? lElement.ListePieceJointe
				: new ObjetListeElements_1.ObjetListeElements();
			lElementAff.contenu = true;
			lElementAff.ListeThemes =
				lElement.ListeThemes || new ObjetListeElements_1.ObjetListeElements();
			lElementAff.matiere = aMatiere;
			lElementAff.libelleCBTheme = lElement.libelleCBTheme;
		}
		for (let i = 0; i < aListeContenus.count(); i++) {
			let lElement = aListeContenus.get(i);
			let lElementAff = aListeContenusOrigine.getElementParNumeroEtGenre(
				lElement.Numero,
				Enumere_Ressource_1.EGenreRessource.ContenuDeCours,
			);
			lElementAff.descriptif = lElement.descriptif;
			lElementAff.categorie = lElement.categorie;
			lElementAff.ListePieceJointe = lElement.ListePieceJointe
				? lElement.ListePieceJointe
				: new ObjetListeElements_1.ObjetListeElements();
			lElementAff.listeExecutionQCM = lElement.listeExecutionQCM
				? lElement.listeExecutionQCM
				: new ObjetListeElements_1.ObjetListeElements();
			lElementAff.contenu = true;
			lElementAff.ListeThemes =
				lElement.ListeThemes || new ObjetListeElements_1.ObjetListeElements();
			lElementAff.matiere = aMatiere;
			lElementAff.libelleCBTheme = lElement.libelleCBTheme;
		}
	}
	_surReponseListeContenuTAFsEtContenus(
		aListeContenusOrigine,
		aMatiere,
		aListeTAFs,
		aListeContenus,
	) {
		this._remplirDetailsListeContenuTAFsEtContenus(
			aListeContenusOrigine,
			aMatiere,
			aListeTAFs,
			aListeContenus,
		);
		this._actualiserAffSaisie();
	}
	_detruireContenus() {
		if (this.identContenus && this.identContenus.length > 0) {
			for (let i = this.identContenus.length; i > 0; i--) {
				this.getInstance(this.identContenus[i - 1]).free();
				this.Instances[this.identContenus[i - 1]] = null;
			}
		}
		this.identContenus = [];
		ObjetHtml_1.GHtml.setHtml(this.Nom + "_Contenus", "");
	}
	_actualiserAffSaisie() {
		const lReconstruire = true;
		if (lReconstruire) {
			this._detruireContenus();
		}
		if (this.itemTreeView) {
			switch (this.itemTreeView.getGenre()) {
				case Enumere_Ressource_1.EGenreRessource.DossierProgression:
					ObjetHtml_1.GHtml.setHtml(
						this.Nom + "_Contenus",
						UtilitaireVisuProgression_1.UtilitaireVisuProgression.composeDossierProgression(
							this.itemTreeView.listeContenus,
						),
						{ controleur: this.controleur },
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
					this.identContenus[0] = this.add(
						InterfaceContenuCahierDeTextes_1.InterfaceContenuCahierDeTextes,
						this.evenementSurContenu,
						this._initContenuEtTAF,
					);
					ObjetHtml_1.GHtml.addHtml(
						this.Nom + "_Contenus",
						'<div id="' +
							this.getNomInstance(this.identContenus[0]) +
							'"></div>',
					);
					this.getInstance(this.identContenus[0]).cahierDeTexteVerrouille =
						false;
					this.getInstance(this.identContenus[0]).initialiser();
					this.getInstance(this.identContenus[0]).actualiserContenu(
						this.itemTreeView,
						false,
						this.avecDocumentJoint,
						false,
					);
					break;
				case Enumere_Ressource_1.EGenreRessource.TravailAFaire:
					this.identContenus[0] = this.add(
						InterfaceTAFProgression_1.InterfaceTAFProgression,
						this.evenementTAF,
						this._initContenuEtTAF,
					);
					ObjetHtml_1.GHtml.addHtml(
						this.Nom + "_Contenus",
						'<div id="' +
							this.getNomInstance(this.identContenus[0]) +
							'"></div>',
					);
					this.getInstance(this.identContenus[0]).cahierDeTexteVerrouille =
						false;
					this.getInstance(this.identContenus[0]).initialiser();
					this.getInstance(this.identContenus[0]).actualiserTAF(
						this.itemTreeView,
						false,
						this.avecDocumentJoint,
						false,
					);
					break;
				default:
			}
		}
	}
	correctionHauteur() {
		return this.itemTreeView.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.ContenuDeCours
			? 130
			: 90;
	}
	evenementSurContenu(
		aGenreEvenement,
		aElement,
		aGenreDocJoint,
		aDonneesSupplementaires,
	) {
		this.genreElementSelectionne =
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
		this.contenuCourant = aElement;
		if (
			this.itemTreeView.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.DossierProgression
		) {
			this.indiceElementSelectionne =
				this.itemTreeView.listeContenus.getIndiceParElement(
					this.contenuCourant,
				);
		} else {
			this.indiceElementSelectionne = 0;
		}
		switch (aGenreEvenement) {
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.fenetreEditeurHTML:
				this.evenementSurBoutonHTML(this.contenuCourant.descriptif);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.fenetreCategorie:
				this.evenementSurBoutonCategorie();
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionTitre:
				this.setEtatSaisie(true);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionCategorie:
				this.setEtatSaisie(true);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.ajouterDocumentJoint: {
				let lListeFichiers;
				if (
					aGenreDocJoint === Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
				) {
					const lNouvelleUrl = aDonneesSupplementaires;
					lListeFichiers =
						new ObjetListeElements_1.ObjetListeElements().addElement(
							lNouvelleUrl,
						);
				} else {
					const lElementFichierUploade = aDonneesSupplementaires;
					lListeFichiers = lElementFichierUploade
						? lElementFichierUploade.listeFichiers
						: null;
				}
				if (lListeFichiers && lListeFichiers.count() > 0) {
					this.ajouterDocumentsJoints(
						this.genreElementSelectionne,
						lListeFichiers,
						aGenreDocJoint,
					);
				}
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionDocumentJoint: {
				const lTypeServiceCloud = aDonneesSupplementaires;
				this.evenementSurBoutonDocumentJoint(aGenreDocJoint, lTypeServiceCloud);
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionDescriptif:
				this.setEtatSaisie(true);
				if (this.indiceElementSelectionne >= 0) {
					this.getInstance(
						this.identContenus[this.indiceElementSelectionne],
					).actualiserContenu(
						this.contenuCourant,
						false,
						this.avecDocumentJoint,
						false,
					);
				}
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.suppressionDocument:
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionTheme:
				this.setEtatSaisie(true);
				break;
		}
	}
	evenementTAF(
		aGenreEvenement,
		aElement,
		aGenreDocJoint,
		aDonneesSupplementaires,
	) {
		this.genreElementSelectionne =
			Enumere_ElementCDT_1.EGenreElementCDT.TravailAFaire;
		this.tafCourant = aElement;
		if (
			this.itemTreeView.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.DossierProgression
		) {
			this.indiceElementSelectionne =
				this.itemTreeView.listeTAFs.getIndiceParElement(this.contenuCourant);
		} else {
			this.indiceElementSelectionne = 0;
		}
		switch (aGenreEvenement) {
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionDescriptif:
				this.setEtatSaisie(true);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.ajouterDocumentJoint: {
				let lListeFichiers;
				if (
					aGenreDocJoint === Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
				) {
					const lNouvelleUrl = aDonneesSupplementaires;
					lListeFichiers =
						new ObjetListeElements_1.ObjetListeElements().addElement(
							lNouvelleUrl,
						);
				} else {
					const lElementFichierUploade = aDonneesSupplementaires;
					lListeFichiers = lElementFichierUploade
						? lElementFichierUploade.listeFichiers
						: null;
				}
				if (lListeFichiers && lListeFichiers.count() > 0) {
					this.ajouterDocumentsJoints(
						this.genreElementSelectionne,
						lListeFichiers,
						aGenreDocJoint,
					);
				}
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionDocumentJoint: {
				const lTypeServiceCloud = aDonneesSupplementaires;
				this.evenementSurBoutonDocumentJoint(aGenreDocJoint, lTypeServiceCloud);
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.suppressionDocument:
				this.setEtatSaisie(true);
				break;
			default:
		}
	}
	ajouterDocumentsJoints(aGenreElement, aListeFichiers, aGenreDocumentJoint) {
		const lPJsCloud =
			UtilitaireSelecFile_1.UtilitaireSelecFile.extraireListeFichiersCloudsPartage(
				aListeFichiers,
			);
		if (aListeFichiers.count() > 0) {
			const lListeDocJointsSelonContexte =
				this.getListeDocumentsJointsSelonContexte(aGenreElement);
			this.getInstance(
				this.identEditionPieceJointe,
			).ajouterPiecesJointesAvecAppelCallback(
				aListeFichiers,
				aGenreDocumentJoint,
				this.listeDocumentsJoints,
				lListeDocJointsSelonContexte,
				true,
			);
		}
		if (lPJsCloud.count() > 0) {
			const lElementCourant = this.contenuCourant || this.tafCourant;
			lPJsCloud.parcourir((aFichier) => {
				lElementCourant.ListePieceJointe.addElement(aFichier);
				lElementCourant.estVide = false;
				this.listeDocumentsJoints.addElement(aFichier);
			});
			lElementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this._actualiserAffSaisie();
		}
		this.setEtatSaisie(true);
	}
	surResizeInterface() {
		super.surResizeInterface();
		if (
			this.identContenus &&
			this.identContenus.length > 0 &&
			this.identContenus[0] !== null &&
			this.identContenus[0] !== undefined
		) {
			this.getInstance(this.identContenus[0]).editorResize(
				ObjetPosition_1.GPosition.getHeight(this.Nom + "_Contenus") -
					this.correctionHauteur(),
			);
		}
	}
	_estVerrouille() {
		return false;
	}
	_getContenu() {
		return this.itemTreeView;
	}
	_getTAF() {
		return this.itemTreeView;
	}
	_ajouterElementATraiterTV(aListe, aElement) {
		if (
			aElement &&
			!aElement.contenu &&
			aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation &&
			aElement.existe()
		) {
			aListe.addElement(aElement);
			return true;
		}
	}
	_initSelectionProgression(aInstance) {
		aInstance.setOptionsSelectionProgression({
			surEdition: () => {
				this.valider();
			},
			selectionListe: () => {
				this._actualiserAffSaisie();
			},
			selectionTreeView: (aItem, aNode, aMatiere) => {
				this.itemTreeView = aItem;
				if (this.getEtatSaisie()) {
					this.valider();
					return;
				}
				if (!aItem) {
					this._actualiserAffSaisie();
					return;
				}
				const lListeElementsAff = new ObjetListeElements_1.ObjetListeElements();
				switch (this.itemTreeView.getGenre()) {
					case Enumere_Ressource_1.EGenreRessource.DossierProgression: {
						ObjetHtml_1.GHtml.addClass(
							this.Nom + "_Contenus",
							"AvecScrollVertical",
						);
						const lDossier = this.itemTreeView;
						if (lDossier.listeContenus) {
							for (let i = 0; i < lDossier.listeContenus.count(); i++) {
								this._ajouterElementATraiterTV(
									lListeElementsAff,
									lDossier.listeContenus.get(i),
								);
							}
						}
						break;
					}
					default:
						ObjetHtml_1.GHtml.delClass(
							this.Nom + "_Contenus",
							"AvecScrollVertical",
						);
						this._ajouterElementATraiterTV(
							lListeElementsAff,
							this.itemTreeView,
						);
				}
				if (lListeElementsAff.count() > 0) {
					new ObjetRequeteListeContenuTAFsEtContenus_1.ObjetRequeteListeContenuTAFsEtContenus(
						this,
						this._surReponseListeContenuTAFsEtContenus.bind(
							this,
							lListeElementsAff,
							aMatiere,
						),
					).lancerRequete(lListeElementsAff);
				} else {
					this._actualiserAffSaisie();
				}
			},
			bloquerInterface: (aBloquer) => {
				this._bloquerInterfaceDroite(aBloquer);
			},
		});
	}
	_requeteListeCDT() {
		new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
			this,
			this._surReponseRequeteListeCDTProgression,
		).lancerRequete({ AvecMatiereNiveau: true });
	}
	_surReponseRequeteListeCDTProgression(
		aListeProgressions,
		aListeNiveaux,
		aListeCategories,
		aListeDocumentsJoints,
		aListeProgressionsPublicPourCopie,
	) {
		this.listeProgressions = aListeProgressions;
		this.listeProgressionsPublicPourCopie = aListeProgressionsPublicPourCopie;
		this.listeNiveaux = aListeNiveaux;
		this.listeCategories = aListeCategories;
		this.listeCategories.addElement(new ObjetElement_1.ObjetElement("", 0));
		this.listeCategories.trier();
		this.listeDocumentsJoints = aListeDocumentsJoints;
		this.getInstance(this.identSelectionProgression).actualiser({
			progressionsASelectionner: this._progressionsASelectionner,
			listeProgressions: aListeProgressions,
			listeProgressionsPublicPourCopie: aListeProgressionsPublicPourCopie,
			listeNiveaux: aListeNiveaux,
		});
		this._progressionsASelectionner = null;
	}
	_initContenuEtTAF(aInstance) {
		const lHeight =
			ObjetPosition_1.GPosition.getHeight(this.Nom + "_Contenus") -
			this.correctionHauteur();
		const lParamsAffichage = {
			pourProgression: true,
			autoresize: false,
			height: [lHeight.toString(), lHeight.toString()],
			position: [undefined, undefined],
			min_height: [400, 400],
			max_height: [1000, 1000],
		};
		aInstance.setParametresAffichage(lParamsAffichage);
	}
	_surPreResize() {
		if (
			this.identContenus &&
			this.identContenus.length > 0 &&
			this.identContenus[0] !== null &&
			this.identContenus[0] !== undefined
		) {
			this.getInstance(this.identContenus[0]).editorResize(200);
		}
	}
}
exports.InterfacePageCahierDeTexteProgression =
	InterfacePageCahierDeTexteProgression;
