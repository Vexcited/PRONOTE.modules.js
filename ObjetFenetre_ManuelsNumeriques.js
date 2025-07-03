exports.ObjetFenetre_ManuelsNumeriques = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetImage_1 = require("ObjetImage");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequetePanierRessourceKiosque_1 = require("ObjetRequetePanierRessourceKiosque");
const ObjetRequeteListeManuelsRessourcesGranulaires_1 = require("ObjetRequeteListeManuelsRessourcesGranulaires");
const ObjetRequeteSaisiePanierRessourceKiosque_1 = require("ObjetRequeteSaisiePanierRessourceKiosque");
const TypeGenreApiKiosque_1 = require("TypeGenreApiKiosque");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_EditionRessourceNumerique_1 = require("ObjetFenetre_EditionRessourceNumerique");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ManuelsNumeriques extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.options = {
			avecMultiSelection: false,
			sansAjouterLien: false,
			avecRessourcesGranulaire: [
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.etatUtilSco.GenreEspace),
			avecNomEditeur: true,
		};
		this.listeSelectionnes = new ObjetListeElements_1.ObjetListeElements();
		this.manuelSelectionne;
		const lOptionsFenetre = {
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePanierKiosque.titreManuelsNumeriques",
			),
			largeur: 342,
			hauteurMin: 200,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					action: ObjetFenetre_ManuelsNumeriques.genreAction.fermer,
				},
			],
		};
		if (this.options.avecRessourcesGranulaire || this.options.modeTest) {
			lOptionsFenetre.largeur = 780;
			lOptionsFenetre.hauteur = 540;
			if (!this.options.sansAjouterLien) {
				lOptionsFenetre.listeBoutons.push({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"FenetrePanierKiosque.bouton.ajouterLien",
					),
					valider: true,
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					action: ObjetFenetre_ManuelsNumeriques.genreAction.ajouter,
				});
			}
			lOptionsFenetre.titre = ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePanierKiosque.titreRessourcesIssuesManuelsNumeriques",
			);
		}
		this.setOptionsFenetre(lOptionsFenetre);
	}
	setOptions(aOptions) {
		$.extend(this.options, aOptions);
		return this;
	}
	construireInstances() {
		this.identListeManuels = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeManuels.bind(this),
			this._initialiserListeManuels.bind(this),
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeRessources.bind(this),
			this._initialiserListeRessources.bind(this),
		);
		if (this.options.avecRessourcesGranulaire) {
			Invocateur_1.Invocateur.abonner(
				"notification_Kiosque",
				this._notificationKiosque,
				this,
			);
		}
	}
	detruireInstances() {
		if (this.options.avecRessourcesGranulaire) {
			Invocateur_1.Invocateur.desabonner("notification_Kiosque", this);
		}
	}
	_notificationKiosque() {
		this.actualiserRessourcesGranulaire();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (
						aBoutonRepeat.element.action ===
						ObjetFenetre_ManuelsNumeriques.genreAction.ajouter
					) {
						return !aInstance._mettreAJourBoutonAjouter();
					}
					return false;
				},
			},
			execManuel: function (aNumero) {
				$(this.node).eventValidation(function () {
					const lManuel = aInstance.listeManuels.getElementParNumero(aNumero);
					aInstance._actionSelectionManuel(lManuel);
					$(this).siblings().removeClass("mn-selected");
					$(this).addClass("mn-selected");
				});
			},
			getClass: function () {
				const lClass = ["OFManuelsNumeriques"];
				if (
					aInstance.options.avecRessourcesGranulaire ||
					aInstance.options.modeTest
				) {
					lClass.push("avecRessources");
				} else {
					lClass.push("sansRessources");
				}
				return lClass.join(" ");
			},
			btnNouveau: {
				event: function () {
					if (
						aInstance.manuelSelectionne &&
						aInstance.manuelSelectionne.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.RessourceNumeriqueKiosque
					) {
						window.open(
							ObjetChaine_1.GChaine.creerUrlBruteLienExterne(
								aInstance.manuelSelectionne,
							),
						);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.manuelSelectionne ||
						aInstance.manuelSelectionne.getGenre() !==
							Enumere_Ressource_1.EGenreRessource.RessourceNumeriqueKiosque
					);
				},
			},
			btnActualiser: {
				event: function () {
					if (aInstance.manuelSelectionne) {
						aInstance.actualiserRessourcesGranulaire();
					}
				},
				getDisabled: function () {
					return !aInstance.manuelSelectionne;
				},
			},
		});
	}
	afficherFenetre(aParams) {
		this.listeManuels = aParams.listeManuels;
		if (!!aParams.manuel) {
			this.manuelSelectionne = aParams.manuel;
		}
		this.genresApiKiosque =
			aParams.genresApiKiosque || new TypeEnsembleNombre_1.TypeEnsembleNombre();
		this.pouriDevoir =
			this.genresApiKiosque.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
			) && this.etatUtilSco.activerKiosqueEnvoiNote;
		this.pourExerciceNum =
			this.genresApiKiosque.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
			) && this.etatUtilSco.activerKiosqueRenduTAF;
		this.actualiserDonneesKiosque();
	}
	actualiserDonneesKiosque() {
		if (this.options.avecRessourcesGranulaire) {
			new ObjetRequeteListeManuelsRessourcesGranulaires_1.ObjetRequeteListeManuelsRessourcesGranulaires(
				this,
			)
				.lancerRequete({ genresApi: this.genresApiKiosque })
				.then((aJSON) => {
					this.listeManuels = aJSON.listeRessources;
					new ObjetRequetePanierRessourceKiosque_1.ObjetRequetePanierRessourceKiosque(
						this,
						this.apresRequeteDonnees,
					).lancerRequete({
						genresApi: new TypeEnsembleNombre_1.TypeEnsembleNombre(),
					});
				});
		} else {
			this.apresRequeteDonnees();
		}
	}
	actualiserRessourcesGranulaire() {
		if (this.options.avecRessourcesGranulaire) {
			new ObjetRequetePanierRessourceKiosque_1.ObjetRequetePanierRessourceKiosque(
				this,
				this.apresActualisationDonnees,
			).lancerRequete({
				genresApi: new TypeEnsembleNombre_1.TypeEnsembleNombre(),
			});
		}
	}
	apresActualisationDonnees(aJSON) {
		this.listeRessourcesGranulaire =
			new ObjetListeElements_1.ObjetListeElements();
		if (aJSON) {
			this.listeRessourcesGranulaire =
				new ObjetListeElements_1.ObjetListeElements();
			this.listeRessourceKiosque = aJSON.listeRessourceKiosque;
			this.listeRessourceKiosque.parcourir(
				(aElement, aIndice, alisteRessourceKiosque) => {
					aElement.estSelectionne = false;
					if (!!aElement.pere) {
						const lPere = alisteRessourceKiosque.getElementParGenre(
							aElement.pere.getGenre(),
						);
						aElement.pere = lPere;
						if (aElement.ressource) {
							const lRessourcePere =
								lPere && lPere.ressource ? lPere.ressource : null;
							const lRessource = MethodesObjet_1.MethodesObjet.dupliquer(
								aElement.ressource,
							);
							lRessource.pere = lRessourcePere;
							lRessource.estDeGenreApi = this._estDeGenreApi(lRessource);
							this.listeRessourcesGranulaire.addElement(lRessource);
						}
					} else {
						aElement.estUnDeploiement = true;
						aElement.estDeploye = true;
					}
				},
			);
		}
		this._actionSelectionManuel(this.manuelSelectionne);
	}
	apresRequeteDonnees(aJSON) {
		const lObj = {
			listeRessourceKiosque: null,
			message: "",
			listeRessourcesGranulaire: new ObjetListeElements_1.ObjetListeElements(),
			ressourcesSansManuel: null,
		};
		if (aJSON) {
			lObj.message = aJSON.message;
			lObj.listeRessourceKiosque = aJSON.listeRessourceKiosque;
			lObj.listeRessourceKiosque.parcourir(
				function (aObj, aElement, aIndice, alisteRessourceKiosque) {
					aElement.estSelectionne = false;
					if (!!aElement.pere) {
						const lPere = alisteRessourceKiosque.getElementParGenre(
							aElement.pere.getGenre(),
						);
						aElement.pere = lPere;
						if (aElement.ressource) {
							const lRessourcePere =
								lPere && lPere.ressource ? lPere.ressource : null;
							const lRessource = MethodesObjet_1.MethodesObjet.dupliquer(
								aElement.ressource,
							);
							lRessource.pere = lRessourcePere;
							lRessource.estDeGenreApi = this._estDeGenreApi(lRessource);
							aObj.listeRessourcesGranulaire.addElement(lRessource);
							if (
								!aObj.ressourcesSansManuel &&
								lRessourcePere &&
								lRessourcePere.getGenre() ===
									Enumere_Ressource_1.EGenreRessource.Aucune
							) {
								aObj.ressourcesSansManuel =
									MethodesObjet_1.MethodesObjet.dupliquer(lPere.ressource);
								aObj.ressourcesSansManuel.titre =
									ObjetTraduction_1.GTraductions.getValeur(
										"FenetrePanierKiosque.anciensManuels",
									);
							}
						}
					} else {
						aElement.estUnDeploiement = true;
						aElement.estDeploye = true;
					}
				}.bind(this, lObj),
			);
		}
		this.setDonnees(lObj);
	}
	setDonnees(aParam) {
		if (aParam.message) {
			const lThis = this;
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: aParam.message,
				callback: function () {
					lThis.callback.appel(0);
				},
			});
		} else {
			this.listeRessourceKiosque = aParam.listeRessourceKiosque;
			this.listeRessourcesGranulaire = aParam.listeRessourcesGranulaire;
			if (aParam.ressourcesSansManuel) {
				this.listeManuels.add(aParam.ressourcesSansManuel);
			}
			if (!this._actualisationDesDonnees) {
				this.actualiser();
				this.afficher();
				this.listeManuels.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						return D.getGenre() === Enumere_Ressource_1.EGenreRessource.Aucune
							? 2
							: 1;
					}),
					ObjetTri_1.ObjetTri.init("Genre"),
					ObjetTri_1.ObjetTri.init("Libelle"),
				]);
				this.listeManuels.trier();
				this.getInstance(this.identListeManuels).setDonnees(
					new DonneesListe_ManuelsNumeriques(this.listeManuels, this),
				);
				if (
					!this.manuelSelectionne &&
					this.options.avecRessourcesGranulaire &&
					this.listeManuels.count() > 0
				) {
					this.manuelSelectionne = this.listeManuels.get(0);
				}
				if (!!this.manuelSelectionne) {
					const lIndice = this.listeManuels.getIndiceParElement(
						this.manuelSelectionne,
					);
					if (lIndice > -1 && lIndice !== null && lIndice !== undefined) {
						this.getInstance(this.identListeManuels).selectionnerLigne({
							ligne: lIndice,
							avecScroll: true,
							avecEvenement: true,
						});
					}
				}
			} else {
				this._actualisationDesDonnees = undefined;
			}
			this.setBoutonActif(1, false);
		}
	}
	composeContenu() {
		const T = [];
		T.push('<div ie-class="getClass">');
		T.push(
			'<div class="OFMN_InfoAjout">',
			ObjetChaine_1.GChaine.replaceRCToHTML(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.infoAjoutRessourcesGranulaires",
					['<i class="icon_exercice_numerique"></i>'],
				),
			),
			"</div>",
		);
		T.push('<div class="OFMN_SectionListes">');
		T.push(
			'  <div class="OFMN_SectionManuels" id="',
			this.getInstance(this.identListeManuels).getNom(),
			'">',
			"</div>",
		);
		T.push('  <div class="OFMN_SectionRessourcesGranulaires">');
		T.push('    <div class="OFMN_SectionBoutons">');
		T.push(
			this._createIEBoutonImage({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.ajouterUneRessource",
				),
				ieModel: "btnNouveau",
				ieIcon: "icon_nouveau_qcm",
			}),
		);
		T.push(
			this._createIEBoutonImage({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.actualiser",
				),
				ieModel: "btnActualiser",
				ieIcon: "icon_refresh",
			}),
		);
		T.push("    </div>");
		T.push(
			'    <div class="OFMN_SectionListe" id="',
			this.getInstance(this.identListe).getNom(),
			'"></div>',
		);
		T.push("  </div>");
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	composeManuels() {
		const T = [];
		if (this.listeManuels) {
			T.push('<ul class="liste-clickable grouped-like">');
			this.listeManuels.parcourir((aElement) => {
				T.push(this._composeManuel(aElement));
			});
			T.push("</ul>");
		}
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		const lResult = {
			genreBouton: aNumeroBouton,
			liste: this.listeRessourcesGranulaire,
			selection: this.listeSelectionnes,
		};
		this.callback.appel(lResult);
		this.fermer();
	}
	apresRequeteSaisie() {
		this._actualisationDesDonnees = true;
		this.actualiserRessourcesGranulaire();
	}
	_mettreAJourBoutonAjouter() {
		const lActif = this.options.avecMultiSelection
			? this.listeSelectionnes.count() > 0
			: this.listeSelectionnes.count() === 1;
		if (this.options.avecMultiSelection) {
			let lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePanierKiosque.bouton.ajouterLien",
			);
			if (this.listeSelectionnes.count() > 1) {
				lLibelle = ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePanierKiosque.bouton.ajouterLiens",
					[this.listeSelectionnes.count()],
				);
			}
			this.setBoutonLibelle(1, lLibelle);
		}
		return lActif;
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ManuelsNumeriques,
			{ pere: aParams.instance, evenement: aParams.callback },
		);
		if (aParams.sansAjouterLien) {
			lFenetre.setOptions({ sansAjouterLien: true });
			const lOptionsFenetre = {
				listeBoutons: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
						theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
						action: ObjetFenetre_ManuelsNumeriques.genreAction.fermer,
					},
				],
			};
			if (
				lFenetre.options.avecRessourcesGranulaire ||
				lFenetre.options.modeTest
			) {
				if (!lFenetre.options.sansAjouterLien) {
					lOptionsFenetre.listeBoutons.push({
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"FenetrePanierKiosque.bouton.ajouterLien",
						),
						valider: true,
						theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
						action: ObjetFenetre_ManuelsNumeriques.genreAction.ajouter,
					});
				}
			}
			lFenetre.setOptionsFenetre(lOptionsFenetre);
		}
		lFenetre.afficherFenetre(aParams);
	}
	_initialiserListeManuels(aInstance) {
		const lColonnes = [{ id: "", taille: "100%" }];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			skin: ObjetListe_1.ObjetListe.skin.alternance,
			hauteurZoneContenuListeMin: 100,
			hauteurAdapteContenu: !(
				this.options.avecRessourcesGranulaire || this.options.modeTest
			),
			hauteurMaxAdapteContenu: 400,
			piedDeListe: {},
		});
	}
	_evenementListeManuels(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lManuel = this.listeManuels.getElementParNumero(
					aParametres.article.getNumero(),
				);
				this._actionSelectionManuel(lManuel);
				break;
			}
		}
	}
	_actionSelectionManuel(aManuel) {
		this.manuelSelectionne = aManuel;
		if (this.options.avecRessourcesGranulaire || this.options.modeTest) {
			this.listeAffRessourcesGranulaire =
				this.listeRessourcesGranulaire.getListeElements((aElement) => {
					return (
						aElement.pere.getGenre() === this.manuelSelectionne.getGenre() &&
						aElement.pere.getNumero() === this.manuelSelectionne.getNumero()
					);
				});
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_Ressources(this.listeAffRessourcesGranulaire, {
					instance: this,
					avecMultiSelection: this.options.avecMultiSelection,
				}),
			);
		} else {
			window.open(ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aManuel));
		}
	}
	_initialiserListeRessources(aInstance) {
		const lColonnes = [
			{ id: DonneesListe_Ressources.colonnes.description, taille: "100%" },
			{ id: DonneesListe_Ressources.colonnes.icon, taille: 26 },
			{ id: DonneesListe_Ressources.colonnes.date, taille: 80 },
		];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			skin: ObjetListe_1.ObjetListe.skin.alternance,
			hauteurAdapteContenu: false,
			nonEditable: false,
		});
	}
	_evenementFenetreEdition(aParams) {
		switch (aParams.genreBouton) {
			case ObjetFenetre_EditionRessourceNumerique_1
				.ObjetFenetre_EditionRessourceNumerique.genreAction.valider:
				if (!!aParams.ressource) {
					const lListeATraiter = new ObjetListeElements_1.ObjetListeElements();
					const lRessource = this.listeRessourcesGranulaire.getElementParNumero(
						aParams.ressource.getNumero(),
					);
					if (!!lRessource) {
						lRessource.setLibelle(aParams.ressource.getLibelle());
						lRessource.commentaire = aParams.ressource.commentaire;
						lRessource.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						lListeATraiter.addElement(lRessource);
						lListeATraiter.setSerialisateurJSON({
							methodeSerialisation: this._serialiserRessource.bind(this),
						});
						new ObjetRequeteSaisiePanierRessourceKiosque_1.ObjetRequeteSaisiePanierRessourceKiosque(
							this,
							this.apresRequeteSaisie,
						).lancerRequete({ ressources: lListeATraiter });
					}
				}
				break;
			case ObjetFenetre_EditionRessourceNumerique_1
				.ObjetFenetre_EditionRessourceNumerique.genreAction.supprimer:
				if (!!aParams.ressource) {
					const lListeASupprimer =
						new ObjetListeElements_1.ObjetListeElements();
					aParams.ressource.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					lListeASupprimer.addElement(aParams.ressource);
					this._suppressionRessources(lListeASupprimer);
				}
				break;
			default:
				break;
		}
	}
	_suppressionRessources(aListeASupprimer) {
		new ObjetRequeteSaisiePanierRessourceKiosque_1.ObjetRequeteSaisiePanierRessourceKiosque(
			this,
			this.apresRequeteSaisie,
		).lancerRequete({ ressources: aListeASupprimer });
	}
	_evenementListeRessources(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.listeSelectionnes = this.getInstance(
					this.identListe,
				).getListeElementsSelection();
				this._mettreAJourBoutonAjouter();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (!!aParametres.article) {
					const lRessource = MethodesObjet_1.MethodesObjet.dupliquer(
						aParametres.article,
					);
					ObjetFenetre_EditionRessourceNumerique_1.ObjetFenetre_EditionRessourceNumerique.ouvrir(
						{
							ressource: lRessource,
							instance: this,
							callback: this._evenementFenetreEdition.bind(this),
						},
					);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				const lListeASupprimer = new ObjetListeElements_1.ObjetListeElements();
				aParametres.listeSuppressions.parcourir(function (aElement) {
					if (
						!!aElement &&
						aElement.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.PanierRessourceKiosque
					) {
						aElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						lListeASupprimer.addElement(aElement);
					}
				});
				this._suppressionRessources(lListeASupprimer);
				return Enumere_EvenementListe_1.EGenreEvenementListe.Suppression;
			}
		}
	}
	_estDeGenreApi(aRessource) {
		let lResult = false;
		if (this.pouriDevoir) {
			lResult = aRessource.apiSupport.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
			);
		}
		if (!lResult && this.pourExerciceNum) {
			lResult = aRessource.apiSupport.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
			);
		}
		if (
			!lResult &&
			this.genresApiKiosque.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_AjoutPanier,
			) &&
			aRessource.apiSupport.contains(
				TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_AjoutPanier,
			)
		) {
			if (!this.pouriDevoir && !this.pourExerciceNum) {
				lResult =
					!aRessource.apiSupport.contains(
						TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
					) &&
					!aRessource.apiSupport.contains(
						TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
					);
			} else {
				lResult = true;
			}
		}
		return lResult;
	}
	_createIEBoutonImage(aParam) {
		let lPosition = "";
		if (aParam.estADroit) {
			lPosition = ' style="margin-left: auto;"';
		}
		const H = [
			'<ie-bouton class="MargeDroit AlignementMilieuVertical bouton-carre" ie-model="',
			aParam.ieModel,
			'" ie-icon="',
			aParam.ieIcon,
			'" ie-iconsize="2.4rem"',
			aParam.ieSelecFile ? " ie-selecfile" : "",
			lPosition,
			">",
			aParam.libelle,
			"</ie-bouton>",
		];
		return H.join("");
	}
	_composeManuel(aManuel) {
		const T = [];
		if (aManuel.getGenre() === Enumere_Ressource_1.EGenreRessource.Aucune) {
			T.push(
				'<div class="OFMN_Manuel SansManuel" ie-hint="',
				ObjetChaine_1.GChaine.toTitle(
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetrePanierKiosque.infoAnciensManuels",
					),
				),
				'">',
			);
			T.push(aManuel.titre);
			T.push("</div>");
		} else {
			T.push('<div class="OFMN_Manuel">');
			if (this.options.avecNomEditeur) {
				T.push("<div");
				if (aManuel.logo) {
					if (aManuel.avecLien) {
						T.push(
							' ie-hint="' +
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.avecLien",
								) +
								'"',
						);
					}
					T.push(
						' class="logo-contain">',
						ObjetImage_1.GImage.composeImage(aManuel.logo),
					);
				} else {
					T.push(
						' class="libelle-contain">',
						ObjetChaine_1.GChaine.insecable(aManuel.editeur),
					);
				}
				T.push("</div>");
			}
			T.push(
				'<div class="contain-wrapper" title="',
				ObjetChaine_1.GChaine.toTitle(aManuel.description),
				'" >',
				"<span>",
				aManuel.titre,
				"</span>",
			);
			T.push("</div>");
			T.push("</div>");
		}
		return T.join("");
	}
	_serialiserRessource(aElement, aJSON) {
		aJSON.commentaire = aElement.commentaire;
	}
}
exports.ObjetFenetre_ManuelsNumeriques = ObjetFenetre_ManuelsNumeriques;
(function (ObjetFenetre_ManuelsNumeriques) {
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["fermer"] = 0)] = "fermer";
		genreAction[(genreAction["ajouter"] = 1)] = "ajouter";
	})(
		(genreAction =
			ObjetFenetre_ManuelsNumeriques.genreAction ||
			(ObjetFenetre_ManuelsNumeriques.genreAction = {})),
	);
})(
	ObjetFenetre_ManuelsNumeriques ||
		(exports.ObjetFenetre_ManuelsNumeriques = ObjetFenetre_ManuelsNumeriques =
			{}),
);
class DonneesListe_ManuelsNumeriques extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aInstance) {
		super(aDonnees);
		this.instance = aInstance;
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
		});
	}
	getValeur(aParams) {
		return this.instance._composeManuel(aParams.article);
	}
}
class DonneesListe_Ressources extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.instance = aParam.instance;
		this.setOptions({
			avecEdition: true,
			avecSuppression: true,
			avecEvnt_Suppression: true,
			avecEvnt_Selection: true,
			avecEvnt_Edition: true,
			alignVCenter: true,
			editionApresSelection: true,
		});
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	avecBordureDroite() {
		return false;
	}
	avecBordureBas() {
		return false;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Ressources.colonnes.description: {
				const lHtmlText = [];
				if (!!aParams.article) {
					lHtmlText.push('<div class="OFMN_Ressource">');
					lHtmlText.push(
						'<div class="OFMN_Ressource_Titre">',
						aParams.article.getLibelle(),
						"</div>",
					);
					lHtmlText.push(
						'<div class="OFMN_Ressource_Commentaire">',
						ObjetChaine_1.GChaine.replaceRCToHTML(aParams.article.commentaire),
						"</div>",
					);
					lHtmlText.push("</div>");
				}
				return lHtmlText.join("");
			}
			case DonneesListe_Ressources.colonnes.icon: {
				const lEtatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
				const lHtmlIcon = [];
				lHtmlIcon.push('<div class="OFMN_Icon">');
				if (
					lEtatUtilSco.activerKiosqueRenduTAF &&
					aParams.article.apiSupport.contains(
						TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
					)
				) {
					const lIcon = lEtatUtilSco.pourPrimaire() ? "icon_work" : "icon_home";
					lHtmlIcon.push('<i class="material-icons ', lIcon, '"></i>');
				}
				if (
					lEtatUtilSco.activerKiosqueEnvoiNote &&
					aParams.article.apiSupport.contains(
						TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote,
					)
				) {
					lHtmlIcon.push('<i class="material-icons icon_saisie_note"></i>');
				}
				lHtmlIcon.push("</div>");
				return lHtmlIcon.join("");
			}
			case DonneesListe_Ressources.colonnes.date: {
				let lStrDate = "";
				if (!!aParams.article && !!aParams.article.dateAjout) {
					lStrDate =
						'<div class="OFMN_Date">' +
						ObjetDate_1.GDate.formatDate(
							aParams.article.dateAjout,
							"[%JJ/%MM/%AAAA]",
						) +
						"</div>";
				}
				return lStrDate;
			}
		}
		return "";
	}
}
(function (DonneesListe_Ressources) {
	let colonnes;
	(function (colonnes) {
		colonnes["description"] = "ofmn_Description";
		colonnes["icon"] = "ofmn_icon";
		colonnes["date"] = "ofmn_date";
	})(
		(colonnes =
			DonneesListe_Ressources.colonnes ||
			(DonneesListe_Ressources.colonnes = {})),
	);
})(DonneesListe_Ressources || (DonneesListe_Ressources = {}));
