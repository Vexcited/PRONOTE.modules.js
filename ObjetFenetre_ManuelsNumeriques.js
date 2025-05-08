const {
	ObjetRequeteConsultation,
	ObjetRequeteSaisie,
} = require("ObjetRequeteJSON.js");
const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { GImage } = require("ObjetImage.js");
const { Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { CommunicationProduit } = require("CommunicationProduit.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const ObjetRequetePanierRessourceKiosque = require("ObjetRequetePanierRessourceKiosque.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const ObjetFenetre_EditionRessourceNumerique = require("ObjetFenetre_EditionRessourceNumerique.js");
Requetes.inscrire("SaisiePanierRessourceKiosque", ObjetRequeteSaisie);
Requetes.inscrire(
	"listeManuelsRessourcesGranulaires",
	ObjetRequeteConsultation,
);
const cDureeTimerKiosque = 20000;
class ObjetFenetre_ManuelsNumeriques extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			avecMultiSelection: false,
			sansAjouterLien: false,
			avecRessourcesGranulaire: [
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Mobile_Professeur,
				EGenreEspace.Mobile_PrimProfesseur,
				EGenreEspace.PrimDirection,
				EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			avecNomEditeur: true,
		};
		this.listeSelectionnes = new ObjetListeElements();
		this.manuelSelectionne;
		const lOptionsFenetre = {
			titre: GTraductions.getValeur(
				"FenetrePanierKiosque.titreManuelsNumeriques",
			),
			largeur: 342,
			hauteurMin: 200,
			listeBoutons: [
				{
					libelle: GTraductions.getValeur("Fermer"),
					theme: TypeThemeBouton.secondaire,
					action: ObjetFenetre_ManuelsNumeriques.genreAction.fermer,
				},
			],
		};
		if (this.options.avecRessourcesGranulaire || this.options.modeTest) {
			lOptionsFenetre.largeur = 780;
			lOptionsFenetre.hauteur = 540;
			if (!this.options.sansAjouterLien) {
				lOptionsFenetre.listeBoutons.push({
					libelle: GTraductions.getValeur(
						"FenetrePanierKiosque.bouton.ajouterLien",
					),
					valider: true,
					theme: TypeThemeBouton.primaire,
					action: ObjetFenetre_ManuelsNumeriques.genreAction.ajouter,
				});
			}
			lOptionsFenetre.titre = GTraductions.getValeur(
				"FenetrePanierKiosque.titreRessourcesIssuesManuelsNumeriques",
			);
		}
		this.setOptionsFenetre(lOptionsFenetre);
	}
	setOptions(aOptions) {
		$.extend(this.options, aOptions);
	}
	construireInstances() {
		this.identListeManuels = this.add(
			ObjetListe,
			_evenementListeManuels.bind(this),
			_initialiserListeManuels.bind(this),
		);
		this.identListe = this.add(
			ObjetListe,
			_evenementListeRessources.bind(this),
			_initialiserListeRessources.bind(this),
		);
		if (this.options.avecRessourcesGranulaire) {
			Invocateur.abonner(
				"notification_Kiosque",
				this._notificationKiosque,
				this,
			);
		}
	}
	detruireInstances() {
		if (this.options.avecRessourcesGranulaire) {
			Invocateur.desabonner("notification_Kiosque", this);
			GApplication.getCommunication().setDureeTimerPresence(
				CommunicationProduit.cDureeTimerPresence,
			);
		}
	}
	_notificationKiosque() {
		this.actualiserRessourcesGranulaire();
		GApplication.getCommunication().setDureeTimerPresence(
			CommunicationProduit.cDureeTimerPresence,
		);
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
					_actionSelectionManuel.call(aInstance, lManuel);
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
							EGenreRessource.RessourceNumeriqueKiosque
					) {
						GApplication.getCommunication().setDureeTimerPresence(
							cDureeTimerKiosque,
						);
						window.open(
							GChaine.creerUrlBruteLienExterne(aInstance.manuelSelectionne),
						);
					}
				},
				getDisabled: function () {
					return (
						!aInstance.manuelSelectionne ||
						aInstance.manuelSelectionne.getGenre() !==
							EGenreRessource.RessourceNumeriqueKiosque
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
			aParams.genresApiKiosque || new TypeEnsembleNombre();
		this.pouriDevoir =
			this.genresApiKiosque.contains(TypeGenreApiKiosque.Api_EnvoiNote) &&
			GEtatUtilisateur.activerKiosqueEnvoiNote;
		this.pourExerciceNum =
			this.genresApiKiosque.contains(TypeGenreApiKiosque.Api_RenduPJTAF) &&
			GEtatUtilisateur.activerKiosqueRenduTAF;
		this.actualiserDonneesKiosque(true);
	}
	actualiserDonneesKiosque() {
		if (this.options.avecRessourcesGranulaire) {
			Requetes("listeManuelsRessourcesGranulaires", this)
				.lancerRequete({ genresApi: this.genresApiKiosque })
				.then((aJSON) => {
					this.listeManuels = aJSON.listeRessources;
					new ObjetRequetePanierRessourceKiosque(
						this,
						this.apresRequeteDonnees,
					).lancerRequete({ genresApi: new TypeEnsembleNombre() });
				});
		} else {
			this.apresRequeteDonnees();
		}
	}
	actualiserRessourcesGranulaire() {
		if (this.options.avecRessourcesGranulaire) {
			new ObjetRequetePanierRessourceKiosque(
				this,
				this.apresActualisationDonnees,
			).lancerRequete({ genresApi: new TypeEnsembleNombre() });
		}
	}
	apresActualisationDonnees(aJSON) {
		this.listeRessourcesGranulaire = new ObjetListeElements();
		if (aJSON) {
			this.listeRessourcesGranulaire = new ObjetListeElements();
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
							const lRessource = MethodesObjet.dupliquer(aElement.ressource);
							lRessource.pere = lRessourcePere;
							lRessource.estDeGenreApi = _estDeGenreApi.call(this, lRessource);
							this.listeRessourcesGranulaire.addElement(lRessource);
						}
					} else {
						aElement.estUnDeploiement = true;
						aElement.estDeploye = true;
					}
				},
			);
		}
		_actionSelectionManuel.call(this, this.manuelSelectionne);
	}
	apresRequeteDonnees(aJSON) {
		const lObj = {
			listeRessourceKiosque: null,
			message: "",
			listeRessourcesGranulaire: new ObjetListeElements(),
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
							const lRessource = MethodesObjet.dupliquer(aElement.ressource);
							lRessource.pere = lRessourcePere;
							lRessource.estDeGenreApi = _estDeGenreApi.call(this, lRessource);
							aObj.listeRessourcesGranulaire.addElement(lRessource);
							if (
								!aObj.ressourcesSansManuel &&
								lRessourcePere &&
								lRessourcePere.getGenre() === EGenreRessource.Aucune
							) {
								aObj.ressourcesSansManuel = MethodesObjet.dupliquer(
									lPere.ressource,
								);
								aObj.ressourcesSansManuel.titre = GTraductions.getValeur(
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
				type: EGenreBoiteMessage.Information,
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
					ObjetTri.init((D) => {
						return D.getGenre() === EGenreRessource.Aucune ? 2 : 1;
					}),
					ObjetTri.init("Genre"),
					ObjetTri.init("Libelle"),
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
			GChaine.replaceRCToHTML(
				GTraductions.getValeur(
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
			_createIEBoutonImage({
				libelle: GTraductions.getValeur(
					"FenetrePanierKiosque.ajouterUneRessource",
				),
				ieModel: "btnNouveau",
				ieIcon: "icon_nouveau_qcm",
			}),
		);
		T.push(
			_createIEBoutonImage({
				libelle: GTraductions.getValeur("FenetrePanierKiosque.actualiser"),
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
				T.push(_composeManuel.call(this, aElement));
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
			let lLibelle = GTraductions.getValeur(
				"FenetrePanierKiosque.bouton.ajouterLien",
			);
			if (this.listeSelectionnes.count() > 1) {
				lLibelle = GTraductions.getValeur(
					"FenetrePanierKiosque.bouton.ajouterLiens",
					[this.listeSelectionnes.count()],
				);
			}
			this.setBoutonLibelle(1, lLibelle);
		}
		return lActif;
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ManuelsNumeriques,
			{ pere: aParams.instance, evenement: aParams.callback },
		);
		if (aParams.sansAjouterLien) {
			lFenetre.setOptions({ sansAjouterLien: true });
			const lOptionsFenetre = {
				listeBoutons: [
					{
						libelle: GTraductions.getValeur("Fermer"),
						theme: TypeThemeBouton.secondaire,
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
						libelle: GTraductions.getValeur(
							"FenetrePanierKiosque.bouton.ajouterLien",
						),
						valider: true,
						theme: TypeThemeBouton.primaire,
						action: ObjetFenetre_ManuelsNumeriques.genreAction.ajouter,
					});
				}
			}
			lFenetre.setOptionsFenetre(lOptionsFenetre);
		}
		lFenetre.afficherFenetre(aParams);
	}
}
ObjetFenetre_ManuelsNumeriques.genreAction = { fermer: 0, ajouter: 1 };
function _initialiserListeManuels(aInstance) {
	const lColonnes = [{ id: "", taille: "100%" }];
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		skin: ObjetListe.skin.alternance,
		hauteurZoneContenuListeMin: 100,
		hauteurAdapteContenu: !(
			this.options.avecRessourcesGranulaire || this.options.modeTest
		),
		hauteurMaxAdapteContenu: 400,
		piedDeListe: {},
	});
}
function _evenementListeManuels(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection: {
			const lManuel = this.listeManuels.getElementParNumero(
				aParametres.article.getNumero(),
			);
			_actionSelectionManuel.call(this, lManuel);
			break;
		}
	}
}
function _actionSelectionManuel(aManuel) {
	this.manuelSelectionne = aManuel;
	if (this.options.avecRessourcesGranulaire || this.options.modeTest) {
		this.listeAffRessourcesGranulaire =
			this.listeRessourcesGranulaire.getListeElements(
				function (aElement) {
					return (
						aElement.pere.getGenre() === this.getGenre() &&
						aElement.pere.getNumero() === this.getNumero()
					);
				}.bind(this.manuelSelectionne),
			);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Ressources(this.listeAffRessourcesGranulaire, {
				instance: this,
				avecMultiSelection: this.options.avecMultiSelection,
			}),
		);
	} else {
		window.open(GChaine.creerUrlBruteLienExterne(aManuel));
	}
}
function _initialiserListeRessources(aInstance) {
	const lColonnes = [
		{ id: DonneesListe_Ressources.colonnes.description, taille: "100%" },
		{ id: DonneesListe_Ressources.colonnes.icon, taille: 26 },
		{ id: DonneesListe_Ressources.colonnes.date, taille: 80 },
	];
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		skin: ObjetListe.skin.alternance,
		hauteurAdapteContenu: false,
		nonEditable: false,
	});
}
function _evenementFenetreEdition(aParams) {
	switch (aParams.genreBouton) {
		case ObjetFenetre_EditionRessourceNumerique.genreAction.valider:
			if (!!aParams.ressource) {
				const lListeATraiter = new ObjetListeElements();
				const lRessource = this.listeRessourcesGranulaire.getElementParNumero(
					aParams.ressource.getNumero(),
				);
				if (!!lRessource) {
					lRessource.setLibelle(aParams.ressource.getLibelle());
					lRessource.commentaire = aParams.ressource.commentaire;
					lRessource.setEtat(EGenreEtat.Modification);
					lListeATraiter.addElement(lRessource);
					lListeATraiter.setSerialisateurJSON({
						methodeSerialisation: _serialiserRessource.bind(this),
					});
					Requetes(
						"SaisiePanierRessourceKiosque",
						this,
						this.apresRequeteSaisie,
					).lancerRequete({ ressources: lListeATraiter });
				}
			}
			break;
		case ObjetFenetre_EditionRessourceNumerique.genreAction.supprimer:
			if (!!aParams.ressource) {
				const lListeASupprimer = new ObjetListeElements();
				aParams.ressource.setEtat(EGenreEtat.Suppression);
				lListeASupprimer.addElement(aParams.ressource);
				_suppressionRessources.call(this, lListeASupprimer);
			}
			break;
		default:
			break;
	}
}
function _suppressionRessources(aListeASupprimer) {
	Requetes(
		"SaisiePanierRessourceKiosque",
		this,
		this.apresRequeteSaisie,
	).lancerRequete({ ressources: aListeASupprimer });
}
function _evenementListeRessources(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection:
			this.listeSelectionnes = this.getInstance(
				this.identListe,
			).getListeElementsSelection();
			this._mettreAJourBoutonAjouter();
			break;
		case EGenreEvenementListe.Edition:
			if (!!aParametres.article) {
				const lRessource = MethodesObjet.dupliquer(aParametres.article);
				ObjetFenetre_EditionRessourceNumerique.ouvrir({
					ressource: lRessource,
					instance: this,
					callback: _evenementFenetreEdition.bind(this),
				});
			}
			break;
		case EGenreEvenementListe.Suppression: {
			const lListeASupprimer = new ObjetListeElements();
			aParametres.listeSuppressions.parcourir(
				function (aElement) {
					if (
						!!aElement &&
						aElement.getGenre() === EGenreRessource.PanierRessourceKiosque
					) {
						aElement.setEtat(EGenreEtat.Suppression);
						this.addElement(aElement);
					}
				}.bind(lListeASupprimer),
			);
			_suppressionRessources.call(this, lListeASupprimer);
			return EGenreEvenementListe.Suppression;
		}
	}
}
function _estDeGenreApi(aRessource) {
	let lResult = false;
	if (this.pouriDevoir) {
		lResult = aRessource.apiSupport.contains(TypeGenreApiKiosque.Api_EnvoiNote);
	}
	if (!lResult && this.pourExerciceNum) {
		lResult = aRessource.apiSupport.contains(
			TypeGenreApiKiosque.Api_RenduPJTAF,
		);
	}
	if (
		!lResult &&
		this.genresApiKiosque.contains(TypeGenreApiKiosque.Api_AjoutPanier) &&
		aRessource.apiSupport.contains(TypeGenreApiKiosque.Api_AjoutPanier)
	) {
		if (!this.pouriDevoir && !this.pourExerciceNum) {
			lResult =
				!aRessource.apiSupport.contains(TypeGenreApiKiosque.Api_EnvoiNote) &&
				!aRessource.apiSupport.contains(TypeGenreApiKiosque.Api_RenduPJTAF);
		} else {
			lResult = true;
		}
	}
	return lResult;
}
function _createIEBoutonImage(aParam) {
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
function _composeManuel(aManuel) {
	const T = [];
	if (aManuel.getGenre() === EGenreRessource.Aucune) {
		T.push(
			'<div class="OFMN_Manuel SansManuel" ie-hint="',
			GChaine.toTitle(
				GTraductions.getValeur("FenetrePanierKiosque.infoAnciensManuels"),
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
							GTraductions.getValeur("CahierDeTexte.avecLien") +
							'"',
					);
				}
				T.push(' class="logo-contain">', GImage.composeImage(aManuel.logo));
			} else {
				T.push(' class="libelle-contain">', GChaine.insecable(aManuel.editeur));
			}
			T.push("</div>");
		}
		T.push(
			'<div class="contain-wrapper" title="',
			GChaine.toTitle(aManuel.description),
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
function _serialiserRessource(aElement, aJSON) {
	aJSON.commentaire = aElement.commentaire;
}
class DonneesListe_ManuelsNumeriques extends ObjetDonneesListe {
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
		return _composeManuel.call(this.instance, aParams.article);
	}
}
class DonneesListe_Ressources extends ObjetDonneesListe {
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
		return ObjetDonneesListe.ETypeCellule.Html;
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
						GChaine.replaceRCToHTML(aParams.article.commentaire),
						"</div>",
					);
					lHtmlText.push("</div>");
				}
				return lHtmlText.join("");
			}
			case DonneesListe_Ressources.colonnes.icon: {
				const lHtmlIcon = [];
				lHtmlIcon.push('<div class="OFMN_Icon">');
				if (
					GEtatUtilisateur.activerKiosqueRenduTAF &&
					aParams.article.apiSupport.contains(
						TypeGenreApiKiosque.Api_RenduPJTAF,
					)
				) {
					const lIcon = GEtatUtilisateur.pourPrimaire()
						? "icon_work"
						: "icon_home";
					lHtmlIcon.push('<i class="material-icons ', lIcon, '"></i>');
				}
				if (
					GEtatUtilisateur.activerKiosqueEnvoiNote &&
					aParams.article.apiSupport.contains(TypeGenreApiKiosque.Api_EnvoiNote)
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
						GDate.formatDate(aParams.article.dateAjout, "[%JJ/%MM/%AAAA]") +
						"</div>";
				}
				return lStrDate;
			}
		}
		return "";
	}
}
DonneesListe_Ressources.colonnes = {
	description: "ofmn_Description",
	icon: "ofmn_icon",
	date: "ofmn_date",
};
module.exports = { ObjetFenetre_ManuelsNumeriques };
