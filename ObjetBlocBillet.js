exports.ObjetBlocBillet = void 0;
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeEtatCommentaireBillet_1 = require("TypeEtatCommentaireBillet");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_EditionCommentairesBlog_1 = require("ObjetFenetre_EditionCommentairesBlog");
const ObjetFenetre_ListeRedacteursBillet_1 = require("ObjetFenetre_ListeRedacteursBillet");
const ObjetGalerieCarrousel_1 = require("ObjetGalerieCarrousel");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetChaine_1 = require("ObjetChaine");
const AccessApp_1 = require("AccessApp");
class ObjetBlocBillet extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.appSco = (0, AccessApp_1.getApp)();
		this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
		this._saisieCommentaireEnCours = false;
		this.identGalerie = ObjetIdentite_1.Identite.creerInstance(
			ObjetGalerieCarrousel_1.ObjetGalerieCarrousel,
			{ pere: this },
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCommenterBillet: {
				event() {
					aInstance._afficherFenetreCommentaires({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"blog.ajouterCommentaire",
						),
					});
				},
				getDisabled() {
					let lSaisieCommentairePossible = false;
					if (
						aInstance.donnee &&
						aInstance.moteur.estBilletCommentable(aInstance.donnee) &&
						aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
							aInstance.donnee,
						)
					) {
						lSaisieCommentairePossible = true;
					}
					return !lSaisieCommentairePossible;
				},
			},
			getTitleBtnCommenterBillet() {
				if (
					aInstance.donnee &&
					aInstance.moteur.estBilletCommentable(aInstance.donnee)
				) {
					if (
						!aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
							aInstance.donnee,
						)
					) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"blog.SaisieCommentaireEnFinDeSaisie",
						);
					}
				}
				return "";
			},
			btnVoirCommentaires: {
				event() {
					const lTitre = aInstance.getTitreCommentaires(aInstance.donnee);
					aInstance._afficherFenetreCommentaires({ titre: lTitre });
				},
				getDisabled() {
					return false;
				},
			},
			avecBoutonVoirRedacteurs() {
				let lNbCoRedacteurs = 0;
				if (aInstance.donnee && aInstance.donnee.listeCoRedacteurs) {
					lNbCoRedacteurs = aInstance.donnee.listeCoRedacteurs.count();
				}
				return lNbCoRedacteurs > 0;
			},
			btnVoirRedacteurs: {
				event() {
					aInstance._afficherFenetreRedacteurs();
				},
				getDisabled() {
					return false;
				},
			},
			nodePhoto: function () {
				$(this.node).on("error", function () {
					$(this).parent().find(".ibe_util_photo_i").show();
					$(this).remove();
				});
			},
			btnEditerBillet: {
				event() {
					aInstance.callback.appel(
						aInstance.donnee,
						ObjetMoteurBlog_1.EGenreEvntBillet.SurEdition,
					);
				},
			},
			btnPublierBillet: {
				event() {
					aInstance.callback.appel(
						aInstance.donnee,
						ObjetMoteurBlog_1.EGenreEvntBillet.SurModifPublication,
					);
				},
			},
			btnActionsBillet: {
				event() {
					const lBillet = aInstance.donnee;
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: aInstance,
						initCommandes: function (aMenu) {
							if (aInstance.moteur.estBilletEditable(lBillet)) {
								if (lBillet.estPublie) {
									aMenu.add(
										ObjetTraduction_1.GTraductions.getValeur(
											"blog.EditerBillet",
										),
										true,
										() => {
											aInstance.callback.appel(
												lBillet,
												ObjetMoteurBlog_1.EGenreEvntBillet.SurEdition,
											);
										},
									);
									aMenu.add(
										ObjetTraduction_1.GTraductions.getValeur("blog.Depublier"),
										true,
										() => {
											aInstance.callback.appel(
												lBillet,
												ObjetMoteurBlog_1.EGenreEvntBillet.SurModifPublication,
											);
										},
									);
								}
								aMenu.add(
									ObjetTraduction_1.GTraductions.getValeur(
										"blog.SupprimerBillet",
									),
									true,
									() => {
										aInstance.moteur.afficherMessageConfirmationSuppressionBillet(
											lBillet,
											() => {
												aInstance.callback.appel(
													lBillet,
													ObjetMoteurBlog_1.EGenreEvntBillet.surSuppression,
												);
											},
										);
									},
								);
							}
							if (aInstance.moteur.estBilletCommentable(lBillet)) {
								aMenu.addSeparateur();
								aMenu.add(
									ObjetTraduction_1.GTraductions.getValeur(
										"blog.VoirLesCommentaires",
									),
									true,
									() => {
										const lTitre = aInstance.getTitreCommentaires(lBillet);
										aInstance._afficherFenetreCommentaires({ titre: lTitre });
									},
								);
								const lCommenterEstPossible =
									aInstance.moteur.avecSaisieCommentairePossibleALaDateCourante(
										lBillet,
									);
								aMenu.add(
									ObjetTraduction_1.GTraductions.getValeur("blog.commenter"),
									lCommenterEstPossible,
									() => {
										aInstance._afficherFenetreCommentaires({
											titre: ObjetTraduction_1.GTraductions.getValeur(
												"blog.ajouterCommentaire",
											),
										});
									},
								);
							}
						},
					});
				},
			},
			btnSupprCommentaire: {
				event(aNumeroCommentaire) {
					let lCommentaire = null;
					if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
						lCommentaire =
							aInstance.donnee.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
					}
					if (lCommentaire && lCommentaire.estSupprimable) {
						aInstance.moteur.afficherMessageConfirmationSuppressionCommentaire(
							lCommentaire,
							() => {
								aInstance.donnee.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
								aInstance.editerCommentaire(aInstance.donnee);
							},
						);
					}
				},
				getDisabled() {
					return aInstance.appSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
				},
			},
			btnAcceptCommentaire: {
				event(aNumeroCommentaire) {
					let lCommentaire = null;
					if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
						lCommentaire =
							aInstance.donnee.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
					}
					if (lCommentaire) {
						aInstance.moteur.accepterCommentaire(lCommentaire, () => {
							aInstance.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							aInstance.editerCommentaire(aInstance.donnee);
						});
					}
				},
				getDisabled(aNumeroCommentaire) {
					let lEstDisabled = true;
					if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
						const lCommentaire =
							aInstance.donnee.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
						if (lCommentaire) {
							lEstDisabled =
								lCommentaire.etatCommentaire ===
									TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet
										.ECB_Publie ||
								aInstance.appSco.droits.get(
									ObjetDroitsPN_1.TypeDroits.estEnConsultation,
								);
						}
					}
					return lEstDisabled;
				},
			},
			btnRejetCommentaire: {
				event(aNumeroCommentaire) {
					let lCommentaire = null;
					if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
						lCommentaire =
							aInstance.donnee.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
					}
					if (lCommentaire) {
						aInstance.moteur.refuserCommentaire(lCommentaire, () => {
							aInstance.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							aInstance.editerCommentaire(aInstance.donnee);
						});
					}
				},
				getDisabled(aNumeroCommentaire) {
					let lEstDisabled = true;
					if (aInstance.donnee && aInstance.donnee.listeCommentaires) {
						const lCommentaire =
							aInstance.donnee.listeCommentaires.getElementParNumero(
								aNumeroCommentaire,
							);
						if (lCommentaire) {
							lEstDisabled =
								lCommentaire.etatCommentaire ===
									TypeEtatCommentaireBillet_1.TypeEtatCommentaireBillet
										.ECB_Refuse ||
								aInstance.appSco.droits.get(
									ObjetDroitsPN_1.TypeDroits.estEnConsultation,
								);
						}
					}
					return lEstDisabled;
				},
			},
		});
	}
	editerCommentaire(aBillet, aEditionIssueDeFenetre = false) {
		this.donnee = aBillet;
		this.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.callback.appel(
			this.donnee,
			ObjetMoteurBlog_1.EGenreEvntBillet.SurEditionCommentaire,
			aEditionIssueDeFenetre,
		);
	}
	construireAffichage() {
		return this.afficher();
	}
	afficher() {
		return this.moteur.composeCardBillet(this.donnee, {
			idGalerieCarrousel: this.identGalerie.getNom(),
			avecAffichageNomBlog: this.options.avecAffichageNomBlog,
		});
	}
	recupererDonnees() {
		this.identGalerie.setOptions({
			dimensionPhoto: 200,
			nbMaxDiaposEnZoneVisible: 4,
			avecSuppression: false,
			avecEditionLegende: false,
			altImage: ObjetTraduction_1.GTraductions.getValeur("blog.altImage"),
		});
		const lListeDocs = this.donnee.listeDocuments;
		const lListeImages = new ObjetListeElements_1.ObjetListeElements();
		if (!!lListeDocs && lListeDocs.getNbrElementsExistes()) {
			lListeDocs.parcourir((aDoc) => {
				if (aDoc.existe()) {
					if (
						ObjetChaine_1.GChaine.estFichierImageAvecMiniaturePossible(
							aDoc.documentCasier.getLibelle(),
						)
					) {
						lListeImages.add(aDoc);
					}
				}
			});
		}
		this.identGalerie.initialiser();
		this.identGalerie.setDonnees({
			listeDiapos: lListeImages,
			ressourceDocJoint: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
		});
	}
	setParametres(aElement, aOptions) {
		this.donneesRecues = true;
		this.donnee = aElement;
		this.setOptions(aOptions);
	}
	getBilletConcerne() {
		return this.donnee;
	}
	setOptions(aOptions) {
		this.options.tailleMaxCommentaires = aOptions.tailleMaxCommentaires;
		this.options.avecAffichageNomBlog = aOptions.avecAffichageNomBlog;
		return this;
	}
	ouvrirFenetreCommentairesDeBillet(aBillet) {
		this.donnee = aBillet;
		this._afficherFenetreCommentaires();
	}
	getTitreCommentaires(aBillet) {
		let lNbCommentaires = 0;
		if (aBillet && aBillet.listeCommentaires) {
			lNbCommentaires = aBillet.listeCommentaires.count();
		}
		return ObjetTraduction_1.GTraductions.getValeur(
			lNbCommentaires > 1 ? "blog.commentaireN" : "blog.commentaire1",
			[lNbCommentaires],
		);
	}
	_afficherFenetreRedacteurs() {
		let lNbRedacteurs = 1;
		if (this.donnee && this.donnee.listeCoRedacteurs) {
			lNbRedacteurs += this.donnee.listeCoRedacteurs.count();
		}
		const lFenetreListeRedacteurs =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ListeRedacteursBillet_1.ObjetFenetre_ListeRedacteursBillet,
				{
					pere: this,
					evenement: null,
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"blog.tousLesRedacteursN",
								[lNbRedacteurs],
							),
							largeur: 350,
							hauteur: 500,
							avecScroll: true,
						});
					},
				},
			);
		lFenetreListeRedacteurs.setDonnees(this.donnee);
	}
	_afficherFenetreCommentaires(aParam = {}) {
		const lTitreFenetre =
			aParam.titre || this.getTitreCommentaires(this.donnee);
		const lFenetreEditionCommentaires =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_EditionCommentairesBlog_1.ObjetFenetre_EditionCommentairesBlog,
				{
					pere: this,
					evenement: (aNumeroBouton, aDonneesFenetre) => {
						if (aNumeroBouton === 1 && aDonneesFenetre) {
							this.editerCommentaire(
								aDonneesFenetre.billet,
								aDonneesFenetre.avecReouvertureFenetreApresSaisie,
							);
						}
					},
					initialiser: (aInstance) => {
						aInstance.setOptionsFenetre({
							titre: lTitreFenetre,
							largeur: 500,
							hauteurMaxContenu: 600,
							avecScroll: true,
							listeBoutons: [],
							callbackFermer: () => {
								if (this._saisieCommentaireEnCours !== true) {
									this.donnee.listeCommentaires.removeFilter((aElt) => {
										return (
											aElt.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
										);
									});
								}
								this._saisieCommentaireEnCours = false;
							},
							bloquerFocus: true,
							avecComposeBasInFooter: true,
						});
						aInstance.setParametres({
							tailleMaxCommentaires: this.options.tailleMaxCommentaires,
						});
					},
				},
			);
		lFenetreEditionCommentaires.setDonnees(this.donnee);
	}
}
exports.ObjetBlocBillet = ObjetBlocBillet;
