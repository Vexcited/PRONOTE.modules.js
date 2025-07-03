exports.DonneesListe_RessourcesPedagogiquesProfesseur = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class DonneesListe_RessourcesPedagogiquesProfesseur extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aParam) {
		const lParams = $.extend(
			{
				donnees: null,
				pourPartage: false,
				afficherCumul: false,
				publics: null,
				genreAffiches: null,
				listeMatieresParRessource: null,
				evenementMenuContextuel: null,
				getParamMenuContextuelSelecFile: null,
				callbackSurAjout: null,
			},
			aParam,
		);
		if (!lParams._ressourceAcceptee) {
			lParams._ressourceAcceptee =
				DonneesListe_RessourcesPedagogiquesProfesseur._ressourceAcceptee;
		}
		super(
			DonneesListe_RessourcesPedagogiquesProfesseur._construireListe(lParams),
		);
		this.param = lParams;
		const lIndexs = [
			function (D) {
				return D.donnee && D.donnee.ressource
					? D.donnee.ressource.getLibelle()
					: null;
			},
			function (D) {
				return D.donnee ? D.donnee.getGenre() : null;
			},
			function (D) {
				return D.donnee && D.donnee.proprietaire
					? D.donnee.proprietaire.getGenre()
					: null;
			},
			function (D) {
				return D.donnee && D.donnee.proprietaire
					? D.donnee.proprietaire.getNumero()
					: null;
			},
			function (D) {
				return D.donnee && D.donnee.editable ? D.donnee.editable : false;
			},
			function (D) {
				return D.index;
			},
		];
		if (this.param.pourPartage) {
			lIndexs.push((D) => {
				return D.donnee && D.donnee.matiere
					? D.donnee.matiere.getNumero()
					: null;
			});
		}
		this.creerIndexUnique(lIndexs);
	}
	avecEvenementEdition(aParams) {
		return (
			this.options.avecEvnt_Edition ||
			(aParams.idColonne ===
				DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes &&
				!!aParams &&
				!!aParams.article &&
				!!aParams.article.donnee &&
				!!aParams.article.donnee.estThemable) ||
			(!!aParams &&
				!!aParams.article &&
				!!aParams.article.donnee &&
				(!!aParams.article.donnee.editable ||
					!!aParams.article.donnee.estModifiableParAutrui) &&
				aParams.article.donnee.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.site &&
				[
					DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle,
					DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire,
				].includes(aParams.idColonne))
		);
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
				return (
					!!aParams.article.donnee.editable ||
					!!aParams.article.donnee.estModifiableParAutrui
				);
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes:
				return !!aParams.article.donnee.estThemable;
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
				return !!aParams.article.donnee.editable;
		}
		return false;
	}
	avecTrimSurEdition() {
		return true;
	}
	avecSelection(aParams) {
		return (
			super.avecSelection(aParams) &&
			!!aParams.article &&
			!aParams.article.estUnDeploiement
		);
	}
	avecMultiSelection() {
		return true;
	}
	avecDeploiement() {
		return true;
	}
	avecSuppression(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			(!!aParams.article.donnee.editable ||
				aParams.article.donnee.estSupprimableCdT)
		);
	}
	avecEvenementSelection(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle
		) {
			return (
				aParams.article.donnee.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque ||
				aParams.article.donnee.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.travailRendu
			);
		}
		return false;
	}
	avecEvenementCreation() {
		return true;
	}
	avecEvenementApresCreation() {
		return true;
	}
	avecEvenementApresSuppression() {
		return true;
	}
	autoriserChaineVideSurEdition(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire
		);
	}
	getCouleurCellule(aParams) {
		if (aParams.article.estUnDeploiement) {
			return $.extend(
				MethodesObjet_1.MethodesObjet.dupliquer(GCouleur.liste.editable),
				{
					fond: aParams.article.pere
						? GCouleur.themeCouleur.claire
						: GCouleur.themeCouleur.moyen1,
					texte: aParams.article.pere ? "#000000" : "#ffffff",
				},
			);
		}
		return this.avecEdition(aParams)
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc
			: ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		return aParams.article.estUnDeploiement;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
				return aParams.article.donnee.estCommentaireHTML
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			aParams.article &&
			!aParams.article.estUnDeploiement &&
			DonneesListe_RessourcesPedagogiquesProfesseur._getIntersectionListePublics(
				this.param,
				aParams.article.donnee,
			).count() > 1
		) {
			lClasses.push("Gras");
		}
		return lClasses.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
				if (
					aParams.article &&
					aParams.article.donnee &&
					!aParams.article.donnee.estUnDeploiement
				) {
					lClasses.push("AlignementMilieu");
				}
				break;
		}
		return lClasses.join(" ");
	}
	getLibelleDraggable(aParams) {
		return aParams.article.donnee && aParams.article.donnee.ressource
			? aParams.article.donnee.ressource.getLibelle()
			: "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date:
				return aParams.article.donnee.dateHint
					? aParams.article.donnee.dateHint
					: "";
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
				return aParams.article.donnee
					? aParams.article.donnee.estModifiableParAutrui
						? ObjetTraduction_1.GTraductions.getValeur(
								"RessourcePedagogique.hint.modifiable",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"RessourcePedagogique.hint.nonModifiable",
							)
					: "";
		}
		return "";
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.article.estUnDeploiement &&
			aParams.idColonne ===
				DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
				if (aParams.article.estUnDeploiement) {
					return (
						(aParams.article.pere ? "&nbsp;&nbsp;" : "") +
						'<div class="InlineBlock Gras">' +
						aParams.article.getLibelle() +
						" " +
						"(" +
						aParams.article.nbrRessources +
						")" +
						"</div>"
					);
				}
				return IE.jsx.str("i", {
					class:
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.getIcone(
							aParams.article.donnee.getGenre(),
						),
					style: "font-size:1.4rem;",
					role: "presentation",
				});
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
				if (aParams && aParams.surEdition) {
					if (
						aParams.article.donnee.getGenre() ===
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
							.documentJoint
					) {
						return ObjetChaine_1.GChaine.extraireNomFichier(
							aParams.article.donnee.ressource.getLibelle(),
						);
					}
					return aParams.article.donnee.ressource.getLibelle();
				}
				switch (aParams.article.donnee.getGenre()) {
					case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM:
						return aParams.article.donnee.ressource.getLibelle();
					case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.travailRendu:
						return aParams.article.donnee.ressource.getLibelle();
					default: {
						if (
							(!!aParams.article.donnee.fichier &&
								aParams.article.donnee.fichier.getEtat() ===
									Enumere_Etat_1.EGenreEtat.Creation) ||
							(!!aParams.article.donnee.ressource &&
								aParams.article.donnee.ressource.getEtat() ===
									Enumere_Etat_1.EGenreEtat.Creation)
						) {
							return (
								"<div>" +
								(!!aParams.article.donnee.ressource.getLibelle()
									? aParams.article.donnee.ressource.getLibelle()
									: aParams.article.donnee.url) +
								"</div>"
							);
						}
						const lUrlBrute =
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.composerURL(
								aParams.article.donnee.getGenre(),
								aParams.article.donnee.ressource,
								!!aParams.article.donnee.ressource.getLibelle()
									? aParams.article.donnee.ressource.getLibelle()
									: aParams.article.donnee.url,
								true,
							);
						return (
							'<a href="' +
							lUrlBrute +
							'" target="_blank" onclick="event.stopPropagation();">' +
							(!!aParams.article.donnee.ressource.getLibelle()
								? aParams.article.donnee.ressource.getLibelle()
								: aParams.article.donnee.url) +
							"</a>"
						);
					}
				}
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes:
				return aParams.article.donnee.ListeThemes &&
					aParams.article.donnee.ListeThemes.count()
					? aParams.article.donnee.ListeThemes.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire: {
				const lStrCommentaire = [];
				let lCommentaire = aParams.article.donnee.commentaire;
				if (lCommentaire && !aParams.surEdition) {
					if (aParams.article.donnee.estCommentaireHTML) {
						lStrCommentaire.push(lCommentaire);
					} else {
						lStrCommentaire.push(
							lCommentaire.replace(/\r\n/gi, " ").replace(/\n/gi, " "),
						);
					}
				} else if (aParams.surEdition) {
					lStrCommentaire.push(lCommentaire);
				}
				return lStrCommentaire.join("");
			}
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public:
				return DonneesListe_RessourcesPedagogiquesProfesseur._getIntersectionListePublics(
					this.param,
					aParams.article.donnee,
				)
					.getTableauLibelles(null, true, true)
					.join(", ");
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date:
				return aParams.article.donnee.date
					? ObjetDate_1.GDate.formatDate(
							aParams.article.donnee.date,
							"%JJ/%MM/%AAAA",
						)
					: "";
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.proprietaire:
				return aParams.article.donnee.proprietaire
					? aParams.article.donnee.proprietaire.getLibelle()
					: "";
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
				return aParams.article.donnee.estModifiableParAutrui;
			default:
		}
		return "";
	}
	avecContenuTronque(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire
		);
	}
	static creerElement(aDonnees) {
		const lDonnees = $.extend(
			{
				libelle: "",
				fichier: null,
				matiere: null,
				genreCreation: null,
				listePublics: null,
			},
			aDonnees,
		);
		const lResult = new ObjetElement_1.ObjetElement();
		lResult.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		lResult.ressource = new ObjetElement_1.ObjetElement({
			Genre: Enumere_Ressource_1.EGenreRessource.DocumentCasier,
		});
		lResult.ressource.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lResult.ressource.setLibelle(lDonnees.libelle);
		if (lDonnees.fichier) {
			lResult.fichier = lDonnees.fichier;
		}
		if (lDonnees.url) {
			lResult.url = lDonnees.url;
		}
		lResult.Genre = lDonnees.genreCreation;
		lResult.matiere = lDonnees.matiere;
		lResult.listeNiveaux = lDonnees.listeNiveaux;
		lResult.listePublics = new ObjetListeElements_1.ObjetListeElements();
		lDonnees.listePublics.parcourir((aElement) => {
			const lElement = new ObjetElement_1.ObjetElement(
				aElement.getLibelle(),
				aElement.getNumero(),
				aElement.getGenre(),
			);
			lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			lResult.listePublics.addElement(lElement);
		});
		lResult.ListeThemes = new ObjetListeElements_1.ObjetListeElements();
		lResult.estThemable = true;
		lResult.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
			"Theme.libelleCB.ressource",
		);
		lResult.commentaire = lDonnees.commentaire || "";
		lResult.date = ObjetDate_1.GDate.getDateHeureCourante();
		lResult.editable = true;
		lResult.estModifiableParAutrui = false;
		lResult.proprietaire = MethodesObjet_1.MethodesObjet.dupliquer(
			GEtatUtilisateur.getUtilisateur(),
		);
		return lResult;
	}
	getMessageDoublon() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"RessourcePedagogique.CeNomExisteDeja",
		);
	}
	getMessageSuppressionConfirmation(aArticle) {
		const lMsg = [];
		if (aArticle.donnee && aArticle.donnee.estSupprimableCdT) {
			lMsg.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.ConfirmSuppr_RessourcesCDT",
				),
				"<br>",
			);
		}
		lMsg.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"RessourcePedagogique.ConfirmSuppr_Ressources",
			),
		);
		return lMsg.join("");
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
				if (
					aParams.article.donnee.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.documentJoint
				) {
					const lExtension = ObjetChaine_1.GChaine.extraireExtensionFichier(
						aParams.article.donnee.ressource.getLibelle(),
					);
					aParams.article.donnee.ressource.setLibelle(
						V + (lExtension ? "." + lExtension : ""),
					);
				} else {
					aParams.article.donnee.ressource.setLibelle(V);
				}
				aParams.article.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
				aParams.article.donnee.commentaire = V;
				aParams.article.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
			case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
				aParams.article.donnee.estModifiableParAutrui =
					!aParams.article.donnee.estModifiableParAutrui;
				aParams.article.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
		}
	}
	_surSuppression(J, aListeSuppressions) {
		aListeSuppressions.parcourir((aArticle) => {
			this.surSuppression(aArticle);
			if (aArticle.donnee.estSupprimableCdT) {
				aArticle.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				return;
			}
			aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aArticle.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			if (this.param.pourPartage) {
				aArticle.donnee.listeNiveaux.parcourir((D) => {
					if (aArticle.niveau.getNumero() === D.getNumero()) {
						D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
				});
			} else {
				const lPublicsSelectionne = this.param.publics;
				aArticle.donnee.listePublics.parcourir((D) => {
					const lElement = lPublicsSelectionne.getElementParElement(D);
					if (lElement) {
						D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
				});
			}
		}, this);
		this.trier();
		return -1;
	}
	getVisible(D) {
		return D.visible;
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.visible;
			}),
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Libelle"),
				ObjetTri_1.ObjetTri.init("Numero"),
			]),
		];
		const lFuncTriGenre = function (D) {
				return D.pere && D.donnee ? D.donnee.getGenre() : 0;
			},
			lFuncTriLibelle = function (D) {
				return D.donnee && D.donnee.ressource
					? D.donnee.ressource.getLibelle()
					: "";
			};
		if (MethodesObjet_1.MethodesObjet.isNumber(aColonneDeTri)) {
			switch (this.getId(aColonneDeTri)) {
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.type:
					lTris.push(ObjetTri_1.ObjetTri.init(lFuncTriGenre, aGenreTri));
					break;
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.libelle:
					lTris.push(ObjetTri_1.ObjetTri.init(lFuncTriLibelle, aGenreTri));
					break;
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.themes:
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.commentaire:
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes
					.proprietaire:
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.public:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							aGenreTri,
						),
					);
					break;
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.date:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.donnee ? D.donnee.date : 0;
						}, aGenreTri),
					);
					break;
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.modif:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.donnee ? !D.donnee.estModifiableParAutrui : false;
						}, aGenreTri),
					);
					break;
				case DonneesListe_RessourcesPedagogiquesProfesseur.colonnes.coche:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							return D.donnee ? !D.donnee.selectionne : false;
						}, aGenreTri),
					);
					break;
				default:
			}
		}
		lTris.push(
			ObjetTri_1.ObjetTri.init(lFuncTriGenre),
			ObjetTri_1.ObjetTri.init(lFuncTriLibelle),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.donnees ? !!D.donnee.editable : false;
			}),
		);
		return lTris;
	}
	avecMenuContextuel() {
		return true;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.surFondListe) {
			return;
		}
		if (aParametres.ligne > -1) {
			const lNbSelections = aParametres.listeSelection.count();
			aParametres.menuContextuel.addCommande(
				DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu.consulter,
				ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.Consulter",
				),
				lNbSelections === 1 &&
					aParametres.article.donnee &&
					aParametres.article.donnee.getGenre() !==
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM &&
					(!aParametres.article.donnee.fichier ||
						aParametres.article.donnee.fichier.getEtat() !==
							Enumere_Etat_1.EGenreEtat.Creation),
			);
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
				ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
				lNbSelections === 1 &&
					this.avecEdition(aParametres) &&
					!aParametres.nonEditable,
			);
			const lAvecRemplacement =
				lNbSelections === 1 &&
				aParametres.article &&
				aParametres.article.donnee &&
				aParametres.article.donnee.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.documentJoint &&
				this.avecEdition(aParametres) &&
				!aParametres.nonEditable;
			aParametres.menuContextuel.addSelecFile(
				ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.RemplacerDocExistant",
				),
				this.param.getParamMenuContextuelSelecFile({
					element: aParametres.article.donnee,
					type: DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
						.remplacerDoc,
				}),
				lAvecRemplacement,
			);
			if (this.param.pourPartage) {
				const lListeEditables = aParametres.listeSelection.getListeElements(
					(D) => {
						return !!D.donnee.editable;
					},
				);
				if (lListeEditables.count() > 0) {
					aParametres.menuContextuel.addSousMenu(
						ObjetTraduction_1.GTraductions.getValeur(
							"RessourcePedagogique.AutoriserModif",
						),
						(aInstanceSousMenu) => {
							aInstanceSousMenu.addCommande(
								DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
									.deverrouiller,
								ObjetTraduction_1.GTraductions.getValeur("principal.oui"),
								aParametres.article &&
									aParametres.article.donnee &&
									!aParametres.article.donnee.estModifiableParAutrui,
								{ listeEditables: lListeEditables },
							);
							aInstanceSousMenu.addCommande(
								DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu
									.verrouiller,
								ObjetTraduction_1.GTraductions.getValeur("principal.non"),
								aParametres.article &&
									aParametres.article.donnee &&
									!!aParametres.article.donnee.estModifiableParAutrui,
								{ listeEditables: lListeEditables },
							);
						},
					);
				}
			}
			aParametres.menuContextuel.addCommande(
				Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
				this._avecSuppression(aParametres) &&
					((aParametres.article.donnee &&
						aParametres.article.donnee.estSupprimableCdT) ||
						!aParametres.nonEditable),
			);
			if (this.param.callbackSurAjout) {
				aParametres.menuContextuel.add(
					ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.Ajouter"),
					this._avecCreation(),
					() => {
						this.param.callbackSurAjout();
					},
				);
			}
			aParametres.menuContextuel.setDonnees(aParametres.id);
		}
	}
	evenementMenuContextuel(aParametres) {
		if (
			this.param.evenementMenuContextuel(
				aParametres.ligneMenu,
				null,
				aParametres.article,
			)
		) {
			aParametres.avecActualisation = false;
		}
	}
	static _construireListe(aParams) {
		const lHashMatiere = {};
		const lHashNiveau = {};
		let lMatiere = null;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		aParams.donnees.parcourir((aElement) => {
			aElement.visible = false;
			let LLigne = new ObjetElement_1.ObjetElement();
			LLigne.donnee = aElement;
			LLigne.visible = false;
			LLigne.index = 0;
			lListe.addElement(LLigne);
			if (
				aParams.genreAffiches &&
				!aParams.genreAffiches.contains(aElement.getGenre())
			) {
				return;
			}
			if (!aParams._ressourceAcceptee(aParams, aElement)) {
				return;
			}
			LLigne.deploye = true;
			if (aElement.listeNiveaux) {
				const lListeNiveaux = aElement.listeNiveaux.getListeElements((D) => {
					return D.existe();
				});
				LLigne.visible = lListeNiveaux.count() > 0;
				lListeNiveaux.parcourir((aNiveau, aIndex) => {
					let lNiveau = lHashNiveau[aNiveau.getNumero()];
					if (!lNiveau) {
						lNiveau = lHashNiveau[aNiveau.getNumero()] =
							MethodesObjet_1.MethodesObjet.dupliquer(aNiveau);
						lNiveau.nbrRessources = 1;
						lNiveau.estUnDeploiement = true;
						lNiveau.estDeploye = true;
						lNiveau.visible = true;
					} else {
						lNiveau.nbrRessources += 1;
					}
					let lLigneNiveau;
					if (aIndex > 0) {
						lLigneNiveau = new ObjetElement_1.ObjetElement();
						lLigneNiveau.donnee = aElement;
						lLigneNiveau.index = aIndex;
						lLigneNiveau.visible = true;
						lListe.addElement(lLigneNiveau);
					} else {
						lLigneNiveau = LLigne;
					}
					if (!aParams.publics || aParams.publics.count() > 1) {
						lMatiere =
							DonneesListe_RessourcesPedagogiquesProfesseur._getCumulMatiere(
								aElement.matiere,
								lHashMatiere,
								lNiveau,
							);
						lLigneNiveau.pere = lMatiere;
					} else {
						lLigneNiveau.pere = lNiveau;
					}
					lLigneNiveau.niveau = lNiveau;
				});
			} else {
				if (aElement.existe()) {
					LLigne.visible = true;
					const lMatiereElement = aElement.matiere
						? aElement.matiere
						: aElement.listePublics.get(0);
					lMatiere =
						DonneesListe_RessourcesPedagogiquesProfesseur._getCumulMatiere(
							lMatiereElement,
							lHashMatiere,
						);
					LLigne.pere = lMatiere;
				}
			}
		});
		if (aParams.afficherCumul) {
			for (let i in lHashMatiere) {
				lListe.addElement(lHashMatiere[i]);
			}
			for (let i in lHashNiveau) {
				lListe.addElement(lHashNiveau[i]);
			}
		}
		return lListe;
	}
	static _ressourceAcceptee(aParametres, aRessource) {
		if (
			aParametres.publics &&
			DonneesListe_RessourcesPedagogiquesProfesseur._getIntersectionListePublics(
				aParametres,
				aRessource,
			).count() === 0
		) {
			return false;
		}
		return true;
	}
	static _getIntersectionListePublics(aParametres, aRessource) {
		if (!aRessource) {
			return new ObjetListeElements_1.ObjetListeElements();
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements(),
			lListeMatieresParRessource = aParametres.listeMatieresParRessource;
		if (aParametres.pourPartage) {
			if (aParametres.publics.getElementParElement(aRessource.matiere)) {
				lListe.addElement(aRessource.matiere);
			}
		} else {
			aRessource.listePublics.parcourir((aPublic) => {
				if (!aPublic.existe()) {
					return;
				}
				if (aParametres.publics.getElementParElement(aPublic)) {
					lListe.addElement(aPublic);
				} else if (
					aPublic.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
				) {
					const lModeleGroupe =
						lListeMatieresParRessource.getElementParElement(aPublic);
					if (lModeleGroupe && lModeleGroupe.composantes) {
						lModeleGroupe.composantes.parcourir((aClasse) => {
							if (
								aParametres.publics.getElementParElement(aClasse) &&
								!lListe.getElementParElement(aPublic)
							) {
								lListe.addElement(aPublic);
								return false;
							}
						});
					}
				}
			});
		}
		return lListe;
	}
	_avecCreation() {
		return (
			(!this.param.pourPartage || this.param.publics.count() === 1) &&
			(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisiePieceJointe,
			)
		);
	}
	static _getCumulMatiere(aMatiere, aHash, aNiveau) {
		const lCle =
			aMatiere.getNumero() + (aNiveau ? "-" + aNiveau.getNumero() : "");
		let lMatiere = aHash[lCle];
		if (!lMatiere) {
			lMatiere = aHash[lCle] =
				MethodesObjet_1.MethodesObjet.dupliquer(aMatiere);
			lMatiere.nbrRessources = 1;
			lMatiere.estUnDeploiement = true;
			lMatiere.estDeploye = true;
			lMatiere.visible = true;
			if (aNiveau) {
				lMatiere.pere = aNiveau;
			}
		} else {
			lMatiere.nbrRessources += 1;
		}
		return lMatiere;
	}
}
exports.DonneesListe_RessourcesPedagogiquesProfesseur =
	DonneesListe_RessourcesPedagogiquesProfesseur;
(function (DonneesListe_RessourcesPedagogiquesProfesseur) {
	let colonnes;
	(function (colonnes) {
		colonnes["type"] = "type";
		colonnes["libelle"] = "libelle";
		colonnes["themes"] = "themes";
		colonnes["commentaire"] = "commentaire";
		colonnes["public"] = "public";
		colonnes["date"] = "date";
		colonnes["proprietaire"] = "proprietaire";
		colonnes["modif"] = "modif";
		colonnes["coche"] = "coche";
	})(
		(colonnes =
			DonneesListe_RessourcesPedagogiquesProfesseur.colonnes ||
			(DonneesListe_RessourcesPedagogiquesProfesseur.colonnes = {})),
	);
	let genreMenu;
	(function (genreMenu) {
		genreMenu[(genreMenu["ajoutDoc"] = 1)] = "ajoutDoc";
		genreMenu[(genreMenu["ajoutAutreClasse"] = 2)] = "ajoutAutreClasse";
		genreMenu[(genreMenu["consulter"] = 3)] = "consulter";
		genreMenu[(genreMenu["remplacerDoc"] = 4)] = "remplacerDoc";
		genreMenu[(genreMenu["ajoutSauvegarde"] = 5)] = "ajoutSauvegarde";
		genreMenu[(genreMenu["verrouiller"] = 6)] = "verrouiller";
		genreMenu[(genreMenu["deverrouiller"] = 7)] = "deverrouiller";
		genreMenu[(genreMenu["ajoutSite"] = 8)] = "ajoutSite";
	})(
		(genreMenu =
			DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu ||
			(DonneesListe_RessourcesPedagogiquesProfesseur.genreMenu = {})),
	);
})(
	DonneesListe_RessourcesPedagogiquesProfesseur ||
		(exports.DonneesListe_RessourcesPedagogiquesProfesseur =
			DonneesListe_RessourcesPedagogiquesProfesseur =
				{}),
);
