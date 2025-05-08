const { TypeDroits } = require("ObjetDroitsPN.js");
const { DonneesListe_EditionMotifs } = require("DonneesListe_EditionMotifs.js");
const {
	DonneesListe_EditionCategoriesDossiers,
} = require("DonneesListe_EditionCategoriesDossiers.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const { GCache } = require("Cache.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetCelluleMultiSelectionMotif,
} = require("ObjetCelluleMultiSelectionMotif.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const {
	DonneesListe_SelectionMotifs,
} = require("DonneesListe_SelectionMotifs.js");
const {
	TypeOrigineCreationCategorieDossier,
} = require("TypeOrigineCreationCategorieDossier.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetElement } = require("ObjetElement.js");
class ObjetFenetre_DossierVieScolaire extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
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
		};
		this.idContexte = this.Nom + "_ContexteDossierVieScolaire";
		this.idVictime = this.Nom + "_victime";
		this.idRestriction = GUID.getId() + "_restriction";
		this.idTrombone = this.Nom + "_Trombone";
		this.idListeDocuments = this.Nom + "_ListeDocuments";
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate,
			surEvenementSelecteurDate.bind(this),
			_initialiserSelecteurDate,
		);
		this.identCategorie = this.add(
			ObjetSaisiePN,
			surEvenementComboCategories.bind(this),
			_initialiserComboCategories,
		);
		this.identCMS_Motifs = this.add(
			ObjetCelluleMultiSelectionMotif,
			surEvenementSelecteurMultipleMotifs.bind(this),
			_initialiserSelecteurMultipleMotifs,
		);
		this.identMotif = this.add(
			ObjetSaisiePN,
			surEvenementComboMotif.bind(this),
			_initialiserComboMotif,
		);
		this.identRespAdm = this.add(
			ObjetSaisiePN,
			surEvenementComboRespAdm.bind(this),
			_initialiserCombosContexte.bind(
				this,
				GTraductions.getValeur("dossierVieScolaire.fenetre.respAdmin"),
			),
		);
		this.identLieu = this.add(
			ObjetSaisiePN,
			surEvenementComboLieu.bind(this),
			_initialiserCombosContexte.bind(
				this,
				GTraductions.getValeur("dossierVieScolaire.fenetre.lieu"),
			),
		);
		this.identVictime = this.add(
			ObjetSaisiePN,
			surEvenementComboVictime.bind(this),
			_initialiserCombosContexte.bind(
				this,
				GTraductions.getValeur("dossierVieScolaire.fenetre.victime"),
			),
		);
		this.identTemoin = this.add(
			ObjetSaisiePN,
			surEvenementComboTemoin.bind(this),
			_initialiserCombosContexte.bind(
				this,
				GTraductions.getValeur("dossierVieScolaire.fenetre.temoin"),
			),
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnUpload: {
				getOptionsSelecFile: function () {
					return {
						genrePJ: EGenreDocumentJoint.Fichier,
						genreRessourcePJ: EGenreRessource.DocJointEleve,
						interdireDoublonsLibelle: false,
						maxFiles: 0,
						maxSize: GApplication.droits.get(
							TypeDroits.tailleMaxDocJointEtablissement,
						),
					};
				},
				addFiles: function (aElt) {
					aInstance.listePJEleve.addElement(aElt.eltFichier);
					aInstance.dossier.listePJ.addElement(aElt.eltFichier);
					_redessinerDocumentsFournis.call(
						aInstance,
						aInstance.dossier.listePJ,
					);
				},
				getDisabled: function () {
					return false;
				},
				getLibelle() {
					return GTraductions.getValeur("AjouterDesPiecesJointes");
				},
				getIcone() {
					return '<i class="icon_piece_jointe"></i>';
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
							GTraductions.getValeur("selecteurPJ.msgConfirmPJ", [
								lElement.getLibelle(),
							]) +
							"</div>";
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Confirmation,
							message: message,
							callback: function (aAccepte) {
								if (aAccepte === EGenreAction.Valider) {
									lElement.setEtat(EGenreEtat.Suppression);
									_redessinerDocumentsFournis.call(
										aInstance,
										aInstance.dossier.listePJ,
									);
								}
							},
						});
					}
				},
			},
			avecBoutonEditerCategorie() {
				return aInstance.autorisations
					? aInstance.autorisations.creerMotif
					: false;
			},
			btnEditionCategorie: {
				event() {
					surEvenementBoutonEditerCategorie.call(aInstance);
				},
				getDisabled() {
					return (
						!aInstance.autorisations || !aInstance.autorisations.creerMotif
					);
				},
			},
			avecBoutonEditerMotif() {
				return aInstance.autorisations
					? aInstance.autorisations.creerMotif
					: false;
			},
			btnEditionMotif: {
				event() {
					surEvenementBoutonEditerMotif.call(aInstance);
				},
				getDisabled() {
					return (
						!aInstance.autorisations || !aInstance.autorisations.creerMotif
					);
				},
			},
		});
	}
	setCommentaire() {
		this.dossier.commentaire = GHtml.getValue(this.ids.textareaCommentaire);
	}
	resetDonneesAffichage() {
		this.getInstance(this.identCategorie).reset();
		this.getInstance(this.identMotif).reset();
		this.getInstance(this.identRespAdm).reset();
		this.getInstance(this.identLieu).reset();
		this.getInstance(this.identVictime).reset();
		this.getInstance(this.identTemoin).reset();
		GHtml.setValue(this.ids.textareaCommentaire, "");
		GHtml.setValue(this.idRestriction, "");
	}
	setDonnees(aParam) {
		this.resetDonneesAffichage();
		this.listePJEleve = MethodesObjet.dupliquer(aParam.listePJEleve);
		this.dossier = MethodesObjet.dupliquer(aParam.dossier);
		this.donneesSaisie = aParam.donneesSaisieDossier;
		if (
			this.dossier &&
			this.dossier.respAdmin &&
			[
				EGenreRessource.PersonnelHistorique,
				EGenreRessource.EnseignantHistorique,
			].includes(this.dossier.respAdmin.getGenre())
		) {
			const lTraduction =
				this.dossier.respAdmin.getGenre() ===
				EGenreRessource.PersonnelHistorique
					? GTraductions.getValeur("PersonnelsHistorique")
					: GTraductions.getValeur("ProfesseursHistorique");
			const lElement = new ObjetElement(
				lTraduction,
				0,
				this.dossier.respAdmin.getGenre(),
			);
			lElement.estCumul = true;
			lElement.AvecSelection = false;
			lElement.Position = 0;
			lElement.ClassAffichage = "Gras";
			const lFils = new ObjetElement(this.dossier.respAdmin);
			lFils.pere = lElement;
			lFils.Position = 1;
			lFils.ClassAffichage = "p-left";
			this.donneesSaisie.listeRespAdmin.add(lElement);
			this.donneesSaisie.listeRespAdmin.add(lFils);
		}
		this.donneesSaisie.listeRespAdmin.setTri([
			ObjetTri.init((D) => {
				switch (D.getGenre()) {
					case EGenreRessource.Aucune:
						return 0;
					case EGenreRessource.Personnel:
						return 1;
					case EGenreRessource.Enseignant:
						return 2;
					default:
						return 3;
				}
			}),
			ObjetTri.init("Position"),
		]);
		this.donneesSaisie.listeRespAdmin.trier();
		this.autorisations = aParam.autorisations;
		this.numeroEleve = aParam.numEleve;
		this.restriction = aParam.restriction;
		const lPeriode = aParam.periode;
		if (!!this.restriction && !!this.restriction.estRestreint) {
			GHtml.setHtml(
				this.idRestriction,
				_composeRestriction.call(this, this.restriction),
			);
		}
		let i = 0;
		if (aParam.donneesSaisieDossier) {
			aParam.donneesSaisieDossier.listeCategories.setTri([
				ObjetTri.init("Libelle"),
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
				GParametres.getDateDansPeriodeDeNotation(
					null,
					!!lPeriode ? lPeriode.getNumero() : 0,
				),
			);
		} else {
			this.getInstance(this.identDate).setDonnees(aParam.dossier.date);
			if (
				aParam.dossier.getGenre() ===
				TypeOrigineCreationCategorieDossier.OCCD_Utilisateur
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
			_redessinerDocumentsFournis.call(this, this.dossier.listePJ);
		}
		if (aParam.dossier.listeMotifs.count() > 0) {
			i = this.elementCategorieCourant.listeMotifs.getIndiceParNumeroEtGenre(
				aParam.dossier.listeMotifs.get(0).Numero,
			);
			this.getInstance(this.identMotif).setSelection(i);
		}
		if (this.dossier && estAvecMotifsMultiples(this.dossier.getGenre())) {
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
		this.dossier.listeMotifs = new ObjetListeElements();
		if (estAvecMotifsMultiples(this.dossier.getGenre())) {
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
		GHtml.setValue(this.ids.textareaCommentaire, this.dossier.commentaire);
		if (!this.dossier.existeNumero()) {
			this.dossier.setEtat(EGenreEtat.Creation);
		} else {
			this.dossier.setEtat(EGenreEtat.Modification);
		}
	}
	composeContenu() {
		const H = [];
		H.push('<div id="', this.ids.conteneurPrincipal, '">');
		H.push('<div id="', this.ids.zoneProprietesGenerales, '">');
		H.push(
			"<div>",
			'<div class="m-bottom">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.date"),
			"</div>",
			'<div id="',
			this.getNomInstance(this.identDate),
			'"></div>',
			"</div>",
		);
		H.push(
			"<div>",
			'<div class="m-bottom">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.categorie"),
			"</div>",
			'<div id="',
			this.ids.conteneurCategorieUnique,
			'">',
			'<div id="',
			this.getNomInstance(this.identCategorie),
			'"></div>',
			'<div id="',
			this.ids.conteneurBoutonEditerCategorie,
			'" ie-display="avecBoutonEditerCategorie"><ie-bouton ie-model="btnEditionCategorie" title="',
			GTraductions.getValeur("dossierVieScolaire.fenetre.infoEditionCategorie"),
			'">...</ie-bouton></div>',
			"</div>",
			"</div>",
		);
		H.push(
			"<div>",
			'<div class="m-bottom">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.motif"),
			"</div>",
			'<div id="',
			this.ids.conteneurMotifUnique,
			'">',
			'<div id="',
			this.getNomInstance(this.identMotif),
			'"></div>',
			'<div id="',
			this.ids.conteneurBoutonEditerMotif,
			'" ie-display="avecBoutonEditerMotif"><ie-bouton ie-model="btnEditionMotif" title="',
			GTraductions.getValeur("dossierVieScolaire.fenetre.infoEditionMotif"),
			'">...</ie-bouton></div>',
			"</div>",
			'<div id="',
			this.ids.conteneurMotifsMultiples,
			'">',
			'<div id="',
			this.getInstance(this.identCMS_Motifs).getNom(),
			'"></div>',
			"</div>",
			"</div>",
		);
		H.push(
			"<div>",
			'<div class="m-bottom">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.respAdmin"),
			"</div>",
			'<div id="',
			this.getNomInstance(this.identRespAdm),
			'"></div>',
			"</div>",
		);
		H.push("<div>", '<div id="', this.idRestriction, '"></div>', "</div>");
		H.push("</div>");
		H.push('<div class="flex-contain" id="', this.ids.zoneContexte, '">');
		H.push(
			'<div id="',
			this.idContexte,
			'">',
			this.composeContexte(),
			"</div>",
		);
		H.push(
			"<div>",
			'  <label class="ie-titre-petit m-bottom">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.commentaires"),
			"</label>",
			'  <textarea class="round-style" id="',
			this.ids.textareaCommentaire,
			'"',
			' onkeyup="',
			this.Nom,
			'.setCommentaire ()" ',
			GObjetWAI.composeAttribut({
				genre: EGenreAttribut.label,
				valeur: GTraductions.getValeur(
					"dossierVieScolaire.fenetre.commentaires",
				),
			}),
			">",
			"   </textarea>",
			"</div>",
		);
		H.push("</div>");
		H.push('<div class="pj-global-conteneur m-y-l">');
		H.push(
			'  <ie-btnselecteur ie-model="btnUpload" ie-selecfile class="pj" role="button"></ie-btnselecteur>',
		);
		H.push(
			'  <div class="pj-liste-conteneur" id="',
			this.idListeDocuments,
			'"></div>',
		);
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	composeContexte() {
		const lHtml = [];
		lHtml.push(
			'<label class="ie-titre-petit m-bottom">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.contexte"),
			"</label>",
			'<div class="flex-contain m-bottom-s">',
			'<div class="fix-bloc" style="',
			GStyle.composeWidth(84),
			'">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.lieu"),
			"</div>",
			'<div class="fluid-bloc" id="',
			this.getNomInstance(this.identLieu),
			'"></div>',
			"</div>",
			'<div class="flex-contain p-top m-bottom-s" id="',
			this.idVictime,
			'">',
			'<div class="fix-bloc" style="',
			GStyle.composeWidth(84),
			'">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.victime"),
			"</div>",
			'<div id="',
			this.getNomInstance(this.identVictime),
			'" class="fluid-bloc full-width"></div>',
			"</div>",
			'<div class="flex-contain p-top">',
			'<div class="fix-bloc" style="',
			GStyle.composeWidth(84),
			'">',
			GTraductions.getValeur("dossierVieScolaire.fenetre.temoin"),
			"</div>",
			'<div id="',
			this.getNomInstance(this.identTemoin),
			'" class="fluid-bloc full-width"></div>',
			"</div>",
		);
		return lHtml.join("");
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1 && this.dossier.listeMotifs.count() === 0) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur("dossierVS.msgMotifDossierObligatoire"),
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
}
function _redessinerDocumentsFournis(aListe) {
	let lIdent = this.idListeDocuments;
	GHtml.setHtml(
		lIdent,
		UtilitaireUrl.construireListeUrls(aListe, {
			separateur: " ",
			IEModelChips: "chipsDocJoint",
			genreRessource: TypeFichierExterneHttpSco.DocJointEleve,
			argsIEModelChips: [],
			maxWidth: 300,
		}),
		{ controleur: this.controleur },
	);
}
function estAvecMotifsMultiples(aTypeCategorie) {
	return (
		[
			TypeOrigineCreationCategorieDossier.OCCD_Comportement,
			TypeOrigineCreationCategorieDossier.OCCD_Victime,
		].indexOf(aTypeCategorie) !== -1
	);
}
function _initialiserSelecteurDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({
		labelWAICellule: GTraductions.getValeur("dossierVieScolaire.fenetre.date"),
	});
}
function surEvenementSelecteurDate(aDate) {
	if (!GDate.estJourEgal(this.dossier.date, aDate)) {
		this.dossier.date = aDate;
		this.dossier.setEtat(EGenreEtat.Modification);
	}
}
function _initialiserComboCategories(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 160,
		labelWAICellule: GTraductions.getValeur(
			"dossierVieScolaire.fenetre.categorie",
		),
	});
}
function surEvenementComboCategories(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.dossier.Genre = aParams.element.Genre;
		this.dossier.Libelle = aParams.element.Libelle;
		this.dossier.couleur = aParams.element.couleur;
		let i;
		if (
			aParams.element.getGenre() ===
			TypeOrigineCreationCategorieDossier.OCCD_Utilisateur
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
				TypeOrigineCreationCategorieDossier.OCCD_Utilisateur &&
			!this.elementCategorieCourant.listeMotifs
		) {
			this.elementCategorieCourant.listeMotifs = new ObjetListeElements();
		}
		const lEstAvecMotifsMultiples = estAvecMotifsMultiples(
			aParams.element.getGenre(),
		);
		GHtml.setDisplay(this.ids.conteneurMotifUnique, !lEstAvecMotifsMultiples);
		GHtml.setDisplay(this.ids.conteneurCategorieUnique, true);
		GHtml.setDisplay(
			this.ids.conteneurMotifsMultiples,
			lEstAvecMotifsMultiples,
		);
		switch (aParams.element.getGenre()) {
			case TypeOrigineCreationCategorieDossier.OCCD_Sante:
			case TypeOrigineCreationCategorieDossier.OCCD_Victime:
				GHtml.setDisplay(this.idContexte, true);
				GHtml.setDisplay(this.idVictime, false);
				this.setDonneesAffichage(this.elementCategorieCourant);
				break;
			case TypeOrigineCreationCategorieDossier.OCCD_Social:
				GHtml.setDisplay(this.idContexte, false);
				GHtml.setDisplay(this.idVictime, false);
				this.setDonneesAffichage(this.elementCategorieCourant);
				break;
			case TypeOrigineCreationCategorieDossier.OCCD_Comportement:
			case TypeOrigineCreationCategorieDossier.OCCD_Utilisateur:
				GHtml.setDisplay(this.idContexte, true);
				GHtml.setDisplay(this.idVictime, true);
				this.setDonneesAffichage(this.elementCategorieCourant);
				break;
			case TypeOrigineCreationCategorieDossier.OCCD_Divers:
				GHtml.setDisplay(this.idContexte, true);
				GHtml.setDisplay(this.idVictime, true);
				this.setDonneesAffichage(this.elementCategorieCourant);
				break;
			case TypeOrigineCreationCategorieDossier.OCCD_Orientation:
				GHtml.setDisplay(this.idContexte, false);
				GHtml.setDisplay(this.idVictime, false);
				this.setDonneesAffichage(this.elementCategorieCourant);
				break;
			default:
				break;
		}
	}
}
function _initialiserSelecteurMultipleMotifs(aInstance) {
	const lAvecCreationMotifs = GApplication.droits.get(
		TypeDroits.dossierVS.saisieMotifsDossiersVS,
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
						DonneesListe_SelectionMotifs.colonnes.motif,
						DonneesListe_SelectionMotifs.colonnes.incident,
					]
				: null,
			droits: { avecCreationMotifs: lAvecCreationMotifs },
		},
	});
}
function surEvenementSelecteurMultipleMotifs(
	aNumeroBouton,
	aListeDonnees,
	aListeTot,
) {
	if (aNumeroBouton === 1) {
		this.dossier.listeMotifs = aListeDonnees;
		if (aListeTot !== null) {
			this.elementCategorieCourant.listeMotifs = aListeTot;
			this.elementCategorieCourant.setEtat(EGenreEtat.Modification);
			GCache.dossierVS.setDonnee(this.numeroEleve, this.donneesSaisie);
		}
	}
}
function _initialiserComboMotif(aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 160,
		labelWAICellule: GTraductions.getValeur("dossierVieScolaire.fenetre.motif"),
	});
}
function surEvenementComboMotif(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.dossier.listeMotifs = new ObjetListeElements();
		this.dossier.listeMotifs.addElement(aParams.element);
		this.dossier.setEtat(EGenreEtat.Modification);
	}
}
function _initialiserCombosContexte(aLabelWAIZone, aInstance) {
	aInstance.setOptionsObjetSaisie({
		longueur: 160,
		labelWAICellule: aLabelWAIZone,
	});
}
function surEvenementComboRespAdm(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		if (aParams.element.getGenre() === EGenreRessource.Aucune) {
			this.dossier.respAdmin = new ObjetElement(
				"",
				aParams.element.getNumero(),
				aParams.element.getGenre(),
			);
		} else {
			this.dossier.respAdmin = aParams.element;
		}
		this.dossier.setEtat(EGenreEtat.Modification);
	}
}
function surEvenementComboLieu(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.dossier.lieu = aParams.element;
		this.dossier.setEtat(EGenreEtat.Modification);
	}
}
function surEvenementComboVictime(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.dossier.victime = aParams.element;
		this.dossier.setEtat(EGenreEtat.Modification);
	}
}
function surEvenementComboTemoin(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		this.dossier.temoin = aParams.element;
		this.dossier.setEtat(EGenreEtat.Modification);
	}
}
function surEvenementBoutonEditerMotif() {
	if (this.autorisations.creerMotif) {
		const lFenetreMotif = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aGenreBouton, aSelection, aAvecChangementListe) {
					if (aGenreBouton === 1) {
						if (
							aAvecChangementListe ||
							this.elementCategorieCourant.listeMotifs.existeElementPourValidation()
						) {
							GCache.dossierVS.setDonnee(this.numeroEleve, this.donneesSaisie);
							this.elementCategorieCourant.setEtat(EGenreEtat.Modification);
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
						titre: GTraductions.getValeur(
							"dossierVieScolaire.fenetre.infoEditionMotif",
						),
						largeur: 300,
						hauteur: 400,
						listeBoutons: [
							GTraductions.getValeur("Annuler"),
							GTraductions.getValeur("Valider"),
						],
					});
					aInstance.paramsListe = {
						titres: [
							GTraductions.getValeur("dossierVieScolaire.fenetre.motif"),
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
			new DonneesListe_EditionMotifs(this.elementCategorieCourant.listeMotifs),
		);
	}
}
function surEvenementBoutonEditerCategorie() {
	if (this.autorisations.creerMotif) {
		const lFenetreMotif = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aGenreBouton, aSelection, aAvecChangementListe) {
					if (aGenreBouton === 1) {
						if (
							aAvecChangementListe ||
							this.donneesSaisie.listeCategories.existeElementPourValidation()
						) {
							GCache.dossierVS.setDonnee(this.numeroEleve, this.donneesSaisie);
							if (
								this.elementCategorieCourant.Genre ===
								TypeOrigineCreationCategorieDossier.OCCD_Utilisateur
							) {
								this.elementCategorieCourant.setEtat(EGenreEtat.Modification);
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
									EGenreEtat.Suppression &&
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
						titre: GTraductions.getValeur(
							"dossierVieScolaire.fenetre.infoEditionCategorie",
						),
						largeur: 300,
						hauteur: 400,
						listeBoutons: [
							GTraductions.getValeur("Annuler"),
							GTraductions.getValeur("Valider"),
						],
					});
					const lColonnes = [];
					lColonnes.push({
						id: DonneesListe_EditionCategoriesDossiers.colonnes.couleur,
						taille: 30,
						titre: "",
					});
					lColonnes.push({
						id: DonneesListe_EditionCategoriesDossiers.colonnes.libelle,
						taille: "100%",
						titre: GTraductions.getValeur(
							"dossierVieScolaire.fenetre.categorie",
						),
					});
					aInstance.paramsListe = {
						optionsListe: {
							colonnes: lColonnes,
							listeCreations: 0,
							avecLigneCreation: true,
							editable: true,
						},
					};
				},
			},
		);
		lFenetreMotif.setDonnees(
			new DonneesListe_EditionCategoriesDossiers(
				this.donneesSaisie.listeCategories,
				() => {
					lFenetreMotif.actualiserListe(true);
				},
			),
		);
	}
}
function _composeRestriction(aRestriction) {
	const H = [];
	H.push('<div class="NoWrap" title="', aRestriction.hintRestriction, '">');
	H.push(
		'<div class="Image_AccesRestreint InlineBlock AlignementMilieuVertical"></div>',
	);
	H.push(
		'<div class="InlineBlock AlignementMilieuVertical EspaceGauche" >',
		GTraductions.getValeur("dossierVS.nbPersonnesAcces", [
			aRestriction.nbRestreint,
		]),
		"</div>",
	);
	H.push("</div>");
	return H.join("");
}
module.exports = { ObjetFenetre_DossierVieScolaire };
