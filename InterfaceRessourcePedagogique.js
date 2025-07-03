exports.InterfaceRessourcePedagogique = void 0;
const ObjetRequeteRessourcePedagogique_1 = require("ObjetRequeteRessourcePedagogique");
const DonneesListe_RessourcesPedagogiques_1 = require("DonneesListe_RessourcesPedagogiques");
const _InterfaceRessourcePedagogique_1 = require("_InterfaceRessourcePedagogique");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetCelluleBouton_1 = require("ObjetCelluleBouton");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const ObjetCelluleBouton_2 = require("ObjetCelluleBouton");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetFenetre_ManuelsNumeriques_1 = require("ObjetFenetre_ManuelsNumeriques");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const ObjetVisuEleveQCM_1 = require("ObjetVisuEleveQCM");
class InterfaceRessourcePedagogique extends _InterfaceRessourcePedagogique_1._InterfaceRessourcePedagogique {
	constructor(...aParams) {
		super(...aParams);
		this.idDetail = this.Nom + "_detail";
		this.idPiedDeListeManuels = this.Nom + "_piedDeListeManuels";
		this.idManuelsNumeriques = this.Nom + "_manuelsNumeriques";
		this.largeurs = { listeMatieres: 300 };
		this.avecDocumentCloud = false;
		const lParametres = {
			listePeriodes: MethodesObjet_1.MethodesObjet.dupliquer(
				this.etatUtilScoEspace.getOngletListePeriodes(),
			),
			listeMatieres: new ObjetListeElements_1.ObjetListeElements(),
			ressourceSelectionnee: null,
			listeManuelsNumeriques: new ObjetListeElements_1.ObjetListeElements(),
			avecLienKiosque: true,
		};
		Object.assign(this.parametres, lParametres);
	}
	construireInstances() {
		this.identPeriodes = this.add(
			ObjetCelluleBouton_1.ObjetCelluleBouton,
			this.evenementSurPeriodes.bind(this),
			this._initialiserPeriodes,
		);
		this.identFenetrePeriodes = this.addFenetre(
			ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
			this._evenementFenetrePeriodes.bind(this),
			this._initialiserFenetrePeriodes,
		);
		this.identListeMatieres = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeMatieres.bind(this),
			this._initialiserListeMatieres.bind(this),
		);
		this.identListeRessources = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeRessources,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
			this._evenementSurVisuEleve.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.identPeriodes];
		const lModelbtnManuels = () => {
			return {
				event: () => {
					if (!!this.ressourcesNumeriques) {
						ObjetFenetre_ManuelsNumeriques_1.ObjetFenetre_ManuelsNumeriques.ouvrir(
							{
								listeManuels: this.ressourcesNumeriques.listeRessources,
								instance: this,
							},
						);
					}
				},
			};
		};
		const lvisible = () => {
			return (
				!!this.ressourcesNumeriques &&
				!!this.ressourcesNumeriques.listeRessources &&
				this.ressourcesNumeriques.listeRessources.count() > 0
			);
		};
		this.AddSurZone.push(
			{ separateur: true },
			{
				html: IE.jsx.str(
					"div",
					{ class: "GrandEspaceGauche" },
					IE.jsx.str(
						"ie-bouton",
						{
							class: "small-bt {TypeThemeBouton.primaire}",
							"ie-model": lModelbtnManuels,
							"ie-display": lvisible,
						},
						ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.Manuels"),
					),
				),
			},
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="full-height m-x flex-contain flex-gap">');
		H.push(
			'<div  class="p-y-l" id="',
			this.getInstance(this.identListeMatieres).getNom(),
			'" style="',
			ObjetStyle_1.GStyle.composeWidth(this.largeurs.listeMatieres),
			'"></div>',
		);
		H.push('<div class="p-y" id="', this.idDetail, '"></div>');
		H.push("</div>");
		return H.join("");
	}
	surClickManuelsNumeriques() {
		this.getInstance(this.identListeMatieres).selectionnerLigne({
			deselectionnerTout: true,
		});
		$("#" + this.idManuelsNumeriques).css(
			"background-color",
			GCouleur.selection.fond,
		);
		this.parametres.ressourceSelectionnee =
			this.parametres.listeManuelsNumeriques;
		this._actualiserDetail();
	}
	_actualiserDetail() {
		this.parametres.avecGenres.clear();
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.documentJoint,
		);
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.site,
		);
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM,
		);
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.sujet,
		);
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige,
		);
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.travailRendu,
		);
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque,
		);
		this.parametres.avecGenres.add(
			Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.documentCloud,
		);
		const lColonnesCachees = [];
		if (
			!this.parametres.ressourceSelectionnee ||
			(this.parametres.ressourceSelectionnee instanceof
				ObjetElement_1.ObjetElement &&
				this.parametres.ressourceSelectionnee.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Matiere)
		) {
			lColonnesCachees.push(
				DonneesListe_RessourcesPedagogiques_1
					.DonneesListe_RessourcesPedagogiques.colonnes.matiere,
			);
		}
		this.getInstance(this.identListeRessources).setOptionsListe({
			colonnesCachees: lColonnesCachees,
		});
		ObjetHtml_1.GHtml.setHtml(
			this.idDetail,
			this._composeDetailRessourcesPedagogiques(),
			{ instance: this },
		);
	}
	_composeDetailRessourcesPedagogiques() {
		const T = [];
		if (!!this.parametres.ressourceSelectionnee) {
			if (
				this.parametres.ressourceSelectionnee ===
				this.parametres.listeManuelsNumeriques
			) {
				T.push('<div class="Texte11 EspaceHaut10 GrandEspaceGauche">');
				T.push(
					'  <div class="GrandEspaceBas Gras">',
					ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.Manuels.ManuelsNumeriques",
					),
					"</div>",
				);
				T.push("  <div>");
				this.parametres.listeManuelsNumeriques.parcourir((D) => {
					T.push(
						ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: D,
							title: D.description,
							libelleEcran: D.titre,
						}),
					);
				});
				T.push("  </div>");
				T.push("</div>");
			} else if (
				this.parametres.ressourceSelectionnee instanceof
					ObjetElement_1.ObjetElement &&
				[Enumere_Ressource_1.EGenreRessource.Matiere, -1].includes(
					this.parametres.ressourceSelectionnee.getGenre(),
				) &&
				this.parametres.ressourceSelectionnee.ensembleDocuments &&
				this.parametres.ressourceSelectionnee.ensembleDocuments.count() > 0
			) {
				T.push(
					'<div class="full-height p-all flex-contain cols">',
					this.composerCBs(true, false, true, true),
					'<div id="',
					this.getInstance(this.identListeRessources).getNom(),
					'" class="p-top fluid-bloc"></div>',
					"</div>",
				);
			} else {
				T.push(
					'<div class="Texte10 AlignementMilieu Gras GrandEspaceHaut">',
					ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.AucuneRessourcePedaPourPeriode",
					),
					"</div>",
				);
			}
		} else {
			let lMessageDetail = "";
			if (
				this.parametres.listeMatieres &&
				this.parametres.listeMatieres.count() > 0
			) {
				lMessageDetail =
					ObjetTraduction_1.GTraductions.getValeur("Message")[
						Enumere_Message_1.EGenreMessage.SelectionMatiere
					];
			} else {
				lMessageDetail = ObjetTraduction_1.GTraductions.getValeur(
					"RessourcePedagogique.AucuneRessourcePeda",
				);
			}
			T.push(
				'<div class="Texte10 AlignementMilieu Gras GrandEspaceHaut">',
				lMessageDetail,
				"</div>",
			);
		}
		return T.join("");
	}
	_actualiserAffichage() {
		this.getInstance(this.identListeRessources).setDonnees(
			new DonneesListe_RessourcesPedagogiques_1.DonneesListe_RessourcesPedagogiques(
				this.parametres.ressourceSelectionnee,
				this.parametres.avecGenres,
				this._callbackExecutionQCM.bind(this),
			),
		);
	}
	recupererDonnees() {
		this._actualiserBoutonPeriodes();
		this._envoieRequete();
	}
	_actualiserBoutonPeriodes() {
		const lLibelles = [];
		const lListePeriodes = this.etatUtilScoEspace.getOngletListePeriodes();
		if (
			lListePeriodes &&
			this.parametres.listePeriodes &&
			lListePeriodes.count() === this.parametres.listePeriodes.count()
		) {
			lLibelles.push(
				ObjetTraduction_1.GTraductions.getValeur("RessourcePedagogique.Toutes"),
			);
		} else if (this.parametres.listePeriodes) {
			this.parametres.listePeriodes.parcourir((D) => {
				lLibelles.push(D.getLibelle());
			});
		}
		this.getInstance(this.identPeriodes).setLibelle(lLibelles.join(", "));
	}
	_initialiserPeriodes(aInstance) {
		aInstance.setOptionsObjetCelluleBouton({
			estSaisissable: false,
			avecZoneSaisie: false,
			genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Points,
			largeur: 150,
			hauteur: 15,
		});
	}
	evenementSurPeriodes(aGenreEvent) {
		if (
			(aGenreEvent === Enumere_Event_1.EEvent.SurKeyUp &&
				GNavigateur.isToucheSelection()) ||
			aGenreEvent === Enumere_Event_1.EEvent.SurMouseDown
		) {
			this.getInstance(this.identFenetrePeriodes).setDonnees({
				listeRessources: this.etatUtilScoEspace.getOngletListePeriodes(),
				listeRessourcesSelectionnees: this.parametres.listePeriodes,
				genreRessource: Enumere_Ressource_1.EGenreRessource.Periode,
				titre:
					Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
				estGenreRessourceDUtilisateurConnecte:
					Enumere_Ressource_1.EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
			});
		}
	}
	_initialiserFenetrePeriodes(aInstance) {
		aInstance.setOptionsFenetreSelectionRessource({
			selectionObligatoire: true,
			triListe: [
				ObjetTri_1.ObjetTri.init("Genre"),
				ObjetTri_1.ObjetTri.init("Libelle"),
			],
		});
	}
	_evenementFenetrePeriodes(
		aGenreRessource,
		alisteRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === Enumere_Action_1.EGenreAction.Valider) {
			this.parametres.listePeriodes = alisteRessourcesSelectionnees;
			this._actualiserBoutonPeriodes();
			this.parametres.ressourceSelectionnee = null;
			this._mettreAJourListesPJ();
			this.getInstance(this.identListeMatieres).actualiser();
			this._actualiserDetail();
		}
	}
	_initialiserListeMatieres(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
		});
	}
	_evenementListeMatieres(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.parametres.ressourceSelectionnee = aParametres.article;
				$("#" + this.idManuelsNumeriques).css(
					"background-color",
					GCouleur.blanc,
				);
				this._actualiserDetail();
				this.surResizeInterface();
				this._actualiserAffichage();
				break;
		}
	}
	_composePiedDeListeManuels() {
		const T = [];
		const lNombreManuelsNumeriques = this.parametres.listeManuelsNumeriques
			? this.parametres.listeManuelsNumeriques.count()
			: 0;
		if (lNombreManuelsNumeriques > 0) {
			const lCouleurBordure = GCouleur.liste.getBordure(false);
			T.push(
				'<div id="',
				this.idPiedDeListeManuels,
				'" style="',
				ObjetStyle_1.GStyle.composeCouleurBordure(lCouleurBordure),
				'">',
			);
			if (lNombreManuelsNumeriques > 0) {
				T.push(
					'<div id="',
					this.idManuelsNumeriques,
					'" style="padding: 2px;',
					ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.blanc),
					'" class="AvecMain Gras" onclick="',
					this.Nom,
					'.surClickManuelsNumeriques()">',
					'<div style="padding: 8px 0px 8px 8px;',
					ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.blanc),
					'">',
					'<div style="float:right; margin-right: 5px;">' +
						lNombreManuelsNumeriques +
						"</div>",
					ObjetTraduction_1.GTraductions.getValeur(
						"RessourcePedagogique.Manuels.ManuelsNumeriques",
					),
					"</div>",
					"</div>",
				);
			}
			T.push("</div>");
		}
		return T.join("");
	}
	_initialiserListeRessources(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_RessourcesPedagogiques_1
				.DonneesListe_RessourcesPedagogiques.colonnes.types,
			taille: 25,
			titre: "",
		});
		lColonnes.push({
			id: DonneesListe_RessourcesPedagogiques_1
				.DonneesListe_RessourcesPedagogiques.colonnes.libelle,
			taille: 400,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"RessourcePedagogique.colonne.document",
			),
		});
		lColonnes.push({
			id: DonneesListe_RessourcesPedagogiques_1
				.DonneesListe_RessourcesPedagogiques.colonnes.matiere,
			taille: 300,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"RessourcePedagogique.colonne.matiere",
			),
		});
		lColonnes.push({
			id: DonneesListe_RessourcesPedagogiques_1
				.DonneesListe_RessourcesPedagogiques.colonnes.date,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"RessourcePedagogique.colonne.deposeLe",
			),
		});
		const lBoutons = [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }];
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: [
				DonneesListe_RessourcesPedagogiques_1
					.DonneesListe_RessourcesPedagogiques.colonnes.matiere,
			],
			hauteurAdapteContenu: true,
			boutons: lBoutons,
		});
		this.etatUtilScoEspace.setTriListe({
			liste: aInstance,
			tri: DonneesListe_RessourcesPedagogiques_1
				.DonneesListe_RessourcesPedagogiques.colonnes.date,
		});
	}
	_evenementSurVisuEleve(aParam) {
		if (aParam.action === ObjetVisuEleveQCM_1.TypeCallbackVisuEleveQCM.close) {
			this._envoieRequete();
		}
	}
	_callbackExecutionQCM(aQCM) {
		UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
			this.getInstance(this.identFenetreVisuQCM),
			aQCM,
		);
	}
	_ressourceDansListePeriodes(aRessource) {
		let lResult = false;
		let lPeriode;
		if (!aRessource.date) {
			return true;
		}
		if (aRessource.listePeriodesNotation) {
			for (
				let i = 0, lNb = aRessource.listePeriodesNotation.count();
				i < lNb;
				i++
			) {
				if (
					this.parametres.listePeriodes.getElementParNumeroEtGenre(
						aRessource.listePeriodesNotation.get(i).getNumero(),
					)
				) {
					return true;
				}
			}
			return false;
		}
		this.parametres.listePeriodes.parcourir((aPeriode) => {
			if (!aPeriode.dates) {
				lPeriode = this.appScoEspace
					.getObjetParametres()
					.listePeriodes.getElementParNumero(aPeriode.getNumero());
				if (lPeriode) {
					aPeriode.dates = lPeriode.dates;
				} else {
				}
			}
			if (
				(aRessource.date > aPeriode.dates.debut &&
					aRessource.date < aPeriode.dates.fin) ||
				ObjetDate_1.GDate.estJourEgal(aRessource.date, aPeriode.dates.debut) ||
				ObjetDate_1.GDate.estJourEgal(aRessource.date, aPeriode.dates.fin)
			) {
				lResult = true;
				return false;
			}
		});
		return lResult;
	}
	_ajouterElementDansMatiere(aElement, aMatiere) {
		const lElementTrouve = aMatiere.ensembleDocuments.getElementParElement(
			aElement.ressource,
		);
		const lElementTrouveTM =
			this.elmToutesMatieres.ensembleDocuments.getElementParElement(
				aElement.ressource,
			);
		if (lElementTrouve) {
			if (!lElementTrouve.dates) {
				lElementTrouve.dates = [];
				lElementTrouve.dates.push(lElementTrouve.date);
			}
			lElementTrouve.dates.push(aElement.ressource.date);
		} else {
			aMatiere.ensembleDocuments.addElement(aElement);
		}
		if (lElementTrouveTM) {
			if (!lElementTrouveTM.dates) {
				lElementTrouveTM.dates = [];
				lElementTrouveTM.dates.push(lElementTrouve.date);
			}
			lElementTrouveTM.dates.push(aElement.ressource.date);
		} else {
			this.elmToutesMatieres.ensembleDocuments.addElement(aElement);
		}
	}
	_ajouterGenreDansMatiere(aGenre, aElement, aMatiere) {
		aElement.genres.add(aGenre);
		aMatiere.nombres[aGenre] += 1;
		this.elmToutesMatieres.nombres[aGenre] += 1;
	}
	_mettreAJourListesPJ() {
		let lMatiere;
		const _parcoursDocuments = (D) => {
			D.dates = null;
			if (!D.genres) {
				D.genres = new TypeEnsembleNombre_1.TypeEnsembleNombre();
			}
			if (this._ressourceDansListePeriodes(D)) {
				if (
					D.getGenre() ===
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM
				) {
					if (UtilitaireQCM_1.UtilitaireQCM.estJouable(D.ressource)) {
						this._ajouterGenreDansMatiere(
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM,
							D,
							lMatiere,
						);
					}
					if (UtilitaireQCM_1.UtilitaireQCM.estCorrige(D.ressource)) {
						this._ajouterGenreDansMatiere(
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige,
							D,
							lMatiere,
						);
					}
				} else {
					let lGenre = D.getGenre();
					if (
						!this.avecDocumentCloud &&
						lGenre ===
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
								.documentCloud
					) {
						lGenre =
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
								.documentJoint;
					}
					this._ajouterGenreDansMatiere(lGenre, D, lMatiere);
				}
				if (
					D.matiere &&
					!D.matiere.getLibelle() &&
					D.matiere.egalParNumeroEtGenre(lMatiere.getNumero())
				) {
					D.matiere.setLibelle(lMatiere.getLibelle());
				}
				this._ajouterElementDansMatiere(D, lMatiere);
			}
		};
		for (let i = 0, lNb = this.parametres.listeMatieres.count(); i < lNb; i++) {
			lMatiere = this.parametres.listeMatieres.get(i);
			lMatiere.ensembleDocuments =
				new ObjetListeElements_1.ObjetListeElements();
			lMatiere.nombres = {};
			for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique,
			)) {
				const lGenre =
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique[lKey];
				lMatiere.nombres[lGenre] = 0;
			}
			if (!!lMatiere && lMatiere.getGenre() !== -1) {
				lMatiere.listeRessources.parcourir(_parcoursDocuments);
			}
		}
	}
	_surReponseEnvoiRequete(
		aDonnees,
		aListeRessources,
		aListeMatieresParRessource,
		aAfficherCumul,
		aJSON,
	) {
		this.parametres.listeMatieres = aDonnees;
		this.parametres.listeManuelsNumeriques = null;
		if (
			!!this.parametres.listeMatieres &&
			!!this.parametres.ressourceSelectionnee &&
			this.parametres.ressourceSelectionnee.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Matiere
		) {
			this.parametres.ressourceSelectionnee =
				this.parametres.listeMatieres.getElementParNumero(
					this.parametres.ressourceSelectionnee.getNumero(),
				);
		} else {
			this.parametres.ressourceSelectionnee = null;
		}
		if (
			this.etatUtilScoEspace.avecFenetreKiosque() &&
			this.etatUtilScoEspace.kiosque &&
			this.etatUtilScoEspace.kiosque.listeRessources
		) {
			this.parametres.listeManuelsNumeriques =
				this.etatUtilScoEspace.kiosque.listeRessources;
		}
		if (!!aJSON && !!aJSON.ressourcesNumeriques) {
			this.ressourcesNumeriques = aJSON.ressourcesNumeriques;
		}
		if (
			(this.parametres.listeMatieres &&
				this.parametres.listeMatieres.count() > 0) ||
			!!this.parametres.listeManuelsNumeriques
		) {
			this.elmToutesMatieres = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"TAFEtContenu.toutesLesMatieres",
				),
				null,
				-1,
			);
			this.parametres.listeMatieres.insererElement(this.elmToutesMatieres, 0);
			if (!this.parametres.ressourceSelectionnee) {
				this.parametres.ressourceSelectionnee = this.elmToutesMatieres;
			}
			ObjetHtml_1.GHtml.setDisplay(this.identListeMatieres, true);
			this._mettreAJourListesPJ();
			const lListeMatieres = this.getInstance(this.identListeMatieres);
			this.getInstance(this.identListeMatieres).setOptionsListe({
				piedDeListe: {
					getContenu: this._composePiedDeListeManuels.bind(this),
					height: 75,
				},
			});
			lListeMatieres.setDonnees(
				new DonneesListe_RessourcePedaMatiere(this.parametres.listeMatieres),
			);
			this._actualiserDetail();
			let lIndexLigneASelectionner = -1;
			if (
				!!this.parametres.listeMatieres &&
				this.parametres.ressourceSelectionnee
			) {
				lIndexLigneASelectionner =
					this.parametres.listeMatieres.getIndiceParElement(
						this.parametres.ressourceSelectionnee,
					);
			}
			lListeMatieres.selectionnerLigne({
				ligne: lIndexLigneASelectionner,
				avecEvenement: true,
			});
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.identListeMatieres, false);
			this._actualiserDetail();
		}
	}
	_envoieRequete() {
		new ObjetRequeteRessourcePedagogique_1.ObjetRequeteRessourcePedagogique(
			this,
			this._surReponseEnvoiRequete.bind(this),
		).lancerRequete({
			avecRessourcesPronote: true,
			avecRessourcesEditeur: false,
		});
	}
}
exports.InterfaceRessourcePedagogique = InterfaceRessourcePedagogique;
class DonneesListe_RessourcePedaMatiere extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEvnt_Selection: true,
			avecTri: false,
			flatDesignMinimal: true,
			avecBoutonActionLigne: false,
		});
	}
	getTitreZonePrincipale(aParams) {
		const H = [];
		if (aParams.article.getGenre() === -1) {
			H.push(
				'<div class="Toutes-Matieres"><i class="icon_th_large" role="presentation"></i>',
				aParams.article.getLibelle(),
				"</div>",
			);
		} else {
			const lCouleurMatiere = aParams.article.couleur || "transparent";
			H.push(
				'<div style="padding-left: 0.8rem; border-left:0.2rem solid ',
				lCouleurMatiere,
				';">',
				aParams.article.getLibelle(),
				"</div>",
			);
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		const H = [];
		const lNbDocuments = aParams.article.ensembleDocuments
			? aParams.article.ensembleDocuments.count()
			: 0;
		if (lNbDocuments > 0) {
			H.push(`<span>${lNbDocuments}</span>`);
		}
		return H.join("");
	}
}
