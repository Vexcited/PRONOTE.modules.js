const {
	DonneesListe_RessourcesPedagogiques,
} = require("DonneesListe_RessourcesPedagogiques.js");
const {
	ObjetRequeteRessourcePedagogique,
} = require("ObjetRequeteRessourcePedagogique.js");
const {
	_InterfaceRessourcePedagogique,
} = require("_InterfaceRessourcePedagogique.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EEvent } = require("Enumere_Event.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const { ObjetCelluleBouton } = require("ObjetCelluleBouton.js");
const { GDate } = require("ObjetDate.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const {
	ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { EGenreMessage } = require("Enumere_Message.js");
const {
	EGenreRessource,
	EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const {
	EGenreRessourcePedagogique,
} = require("Enumere_RessourcePedagogique.js");
const { EGenreBoutonCellule } = require("ObjetCelluleBouton.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const {
	ObjetFenetre_ManuelsNumeriques,
} = require("ObjetFenetre_ManuelsNumeriques.js");
const { UtilitaireQCMPN } = require("UtilitaireQCMPN.js");
const { TypeCallbackVisuEleveQCM } = require("ObjetVisuEleveQCM.js");
class InterfaceRessourcePedagogique extends _InterfaceRessourcePedagogique {
	constructor(...aParams) {
		super(...aParams);
		this.avecDocumentCloud = false;
		const lParametres = {
			listePeriodes: MethodesObjet.dupliquer(
				GEtatUtilisateur.getOngletListePeriodes(),
			),
			listeMatieres: new ObjetListeElements(),
			ressourceSelectionnee: null,
			listeManuelsNumeriques: new ObjetListeElements(),
			avecLienKiosque: true,
		};
		Object.assign(this.parametres, lParametres);
		this.largeurs = { listeMatieres: 300 };
		const lGUId = GUID.getId();
		this.idDetail = lGUId + "_detail";
		this.idPiedDeListeManuels = lGUId + "_piedDeListeManuels";
		this.idManuelsNumeriques = lGUId + "_manuelsNumeriques";
		this.ressourcesNumeriques;
	}
	construireInstances() {
		this.identPeriodes = this.add(
			ObjetCelluleBouton,
			evenementSurPeriodes.bind(this),
			_initialiserPeriodes,
		);
		this.identFenetrePeriodes = this.addFenetre(
			ObjetFenetre_SelectionRessource,
			_evenementFenetrePeriodes.bind(this),
			_initialiserFenetrePeriodes,
		);
		this.identListeMatieres = this.add(
			ObjetListe,
			_evenementListeMatieres.bind(this),
			_initialiserListeMatieres.bind(this),
		);
		this.identListeRessources = this.add(
			ObjetListe,
			null,
			_initialiserListeRessources,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM,
			_evenementSurVisuEleve.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [this.identPeriodes];
		this.AddSurZone.push(
			{ separateur: true },
			{
				html:
					'<div class="GrandEspaceGauche"><ie-bouton  class="small-bt ' +
					TypeThemeBouton.primaire +
					'" ie-model="btnManuels" ie-display="btnManuels.visible">' +
					GTraductions.getValeur("CahierDeTexte.Manuels") +
					"</ie-bouton></div>",
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
			GStyle.composeWidth(this.largeurs.listeMatieres),
			'"></div>',
		);
		H.push('<div class="p-y" id="', this.idDetail, '"></div>');
		H.push("</div>");
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnManuels: {
				event: function () {
					if (!!aInstance.ressourcesNumeriques) {
						ObjetFenetre_ManuelsNumeriques.ouvrir({
							listeManuels: aInstance.ressourcesNumeriques.listeRessources,
							instance: aInstance,
						});
					}
				},
				visible: function () {
					return (
						!!aInstance.ressourcesNumeriques &&
						!!aInstance.ressourcesNumeriques.listeRessources &&
						aInstance.ressourcesNumeriques.listeRessources.count() > 0
					);
				},
			},
		});
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
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.documentJoint);
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.site);
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.QCM);
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.sujet);
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.corrige);
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.travailRendu);
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.kiosque);
		this.parametres.avecGenres.add(EGenreRessourcePedagogique.documentCloud);
		const lColonnesCachees = [];
		if (
			!this.parametres.ressourceSelectionnee ||
			this.parametres.ressourceSelectionnee.getGenre() ===
				EGenreRessource.Matiere
		) {
			lColonnesCachees.push(
				DonneesListe_RessourcesPedagogiques.colonnes.matiere,
			);
		}
		this.getInstance(this.identListeRessources).setOptionsListe({
			colonnesCachees: lColonnesCachees,
		});
		GHtml.setHtml(this.idDetail, this._composeDetailRessourcesPedagogiques(), {
			instance: this,
		});
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
					GTraductions.getValeur(
						"RessourcePedagogique.Manuels.ManuelsNumeriques",
					),
					"</div>",
				);
				T.push("  <div>");
				this.parametres.listeManuelsNumeriques.parcourir((D) => {
					T.push(
						GChaine.composerUrlLienExterne({
							documentJoint: D,
							title: D.description,
							libelleEcran: D.titre,
						}),
					);
				});
				T.push("  </div>");
				T.push("</div>");
			} else if (
				[EGenreRessource.Matiere, -1].includes(
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
					GTraductions.getValeur(
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
					GTraductions.getValeur("Message")[EGenreMessage.SelectionMatiere];
			} else {
				lMessageDetail = GTraductions.getValeur(
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
			new DonneesListe_RessourcesPedagogiques(
				this.parametres.ressourceSelectionnee,
				this.parametres.avecGenres,
				_callbackExecutionQCM.bind(this),
			),
		);
	}
	recupererDonnees() {
		_actualiserBoutonPeriodes.bind(this)();
		_envoieRequete.bind(this)();
	}
}
function _actualiserBoutonPeriodes() {
	const lLibelles = [];
	const lListePeriodes = GEtatUtilisateur.getOngletListePeriodes();
	if (
		lListePeriodes &&
		this.parametres.listePeriodes &&
		lListePeriodes.count() === this.parametres.listePeriodes.count()
	) {
		lLibelles.push(GTraductions.getValeur("RessourcePedagogique.Toutes"));
	} else if (this.parametres.listePeriodes) {
		this.parametres.listePeriodes.parcourir((D) => {
			lLibelles.push(D.getLibelle());
		});
	}
	this.getInstance(this.identPeriodes).setLibelle(lLibelles.join(", "));
}
function _initialiserPeriodes(aInstance) {
	aInstance.setOptionsObjetCelluleBouton({
		estSaisissable: false,
		avecZoneSaisie: false,
		genreBouton: EGenreBoutonCellule.Points,
		largeur: 150,
		hauteur: 15,
		largeurBouton: 16,
	});
}
function evenementSurPeriodes(aGenreEvent) {
	if (
		(aGenreEvent === EEvent.SurKeyUp && GNavigateur.isToucheSelection()) ||
		aGenreEvent === EEvent.SurMouseDown
	) {
		this.getInstance(this.identFenetrePeriodes).setDonnees({
			listeRessources: GEtatUtilisateur.getOngletListePeriodes(),
			listeRessourcesSelectionnees: this.parametres.listePeriodes,
			genreRessource: EGenreRessource.Periode,
			titre: EGenreRessourceUtil.getTitreFenetreSelectionRessource(
				EGenreRessource.Periode,
			),
			estGenreRessourceDUtilisateurConnecte:
				EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
					EGenreRessource.Periode,
				),
		});
	}
}
function _initialiserFenetrePeriodes(aInstance) {
	aInstance.setOptionsFenetreSelectionRessource({
		selectionObligatoire: true,
		triListe: [ObjetTri.init("Genre"), ObjetTri.init("Libelle")],
	});
}
function _evenementFenetrePeriodes(
	aGenreRessource,
	alisteRessourcesSelectionnees,
	aNumeroBouton,
) {
	if (aNumeroBouton === EGenreAction.Valider) {
		this.parametres.listePeriodes = alisteRessourcesSelectionnees;
		_actualiserBoutonPeriodes.bind(this)();
		this.parametres.ressourceSelectionnee = null;
		_mettreAJourListesPJ.bind(this)();
		this.getInstance(this.identListeMatieres).actualiser();
		this._actualiserDetail();
	}
}
function _initialiserListeMatieres(aInstance) {
	aInstance.setOptionsListe({
		colonnes: [{ taille: "100%" }],
		skin: ObjetListe.skin.flatDesign,
		avecOmbreDroite: true,
	});
}
function _evenementListeMatieres(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection:
			this.parametres.ressourceSelectionnee = aParametres.article;
			$("#" + this.idManuelsNumeriques).css("background-color", GCouleur.blanc);
			this._actualiserDetail();
			this.surResizeInterface();
			this._actualiserAffichage();
			break;
	}
}
function _composePiedDeListeManuels() {
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
			GStyle.composeCouleurBordure(lCouleurBordure),
			'">',
		);
		if (lNombreManuelsNumeriques > 0) {
			T.push(
				'<div id="',
				this.idManuelsNumeriques,
				'" style="padding: 2px;',
				GStyle.composeCouleurFond(GCouleur.blanc),
				'" class="AvecMain Gras" onclick="',
				this.Nom,
				'.surClickManuelsNumeriques()">',
				'<div style="padding: 8px 0px 8px 8px;',
				GStyle.composeCouleurFond(GCouleur.blanc),
				'">',
				'<div style="float:right; margin-right: 5px;">' +
					lNombreManuelsNumeriques +
					"</div>",
				GTraductions.getValeur(
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
function _initialiserListeRessources(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_RessourcesPedagogiques.colonnes.types,
		taille: 25,
		titre: "",
	});
	lColonnes.push({
		id: DonneesListe_RessourcesPedagogiques.colonnes.libelle,
		taille: 400,
		titre: GTraductions.getValeur("RessourcePedagogique.colonne.document"),
	});
	lColonnes.push({
		id: DonneesListe_RessourcesPedagogiques.colonnes.matiere,
		taille: 300,
		titre: GTraductions.getValeur("RessourcePedagogique.colonne.matiere"),
	});
	lColonnes.push({
		id: DonneesListe_RessourcesPedagogiques.colonnes.date,
		taille: 80,
		titre: GTraductions.getValeur("RessourcePedagogique.colonne.deposeLe"),
	});
	const lBoutons = [{ genre: ObjetListe.typeBouton.rechercher }];
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		colonnesCachees: [DonneesListe_RessourcesPedagogiques.colonnes.matiere],
		hauteurAdapteContenu: true,
		boutons: lBoutons,
	});
	GEtatUtilisateur.setTriListe({
		liste: aInstance,
		tri: DonneesListe_RessourcesPedagogiques.colonnes.date,
	});
}
function _evenementSurVisuEleve(aParam) {
	if (aParam.action === TypeCallbackVisuEleveQCM.close) {
		_envoieRequete.bind(this)();
	}
}
function _callbackExecutionQCM(aQCM) {
	UtilitaireQCMPN.executerQCM(this.getInstance(this.identFenetreVisuQCM), aQCM);
}
function _ressourceDansListePeriodes(aRessource) {
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
			lPeriode = GParametres.listePeriodes.getElementParNumero(
				aPeriode.getNumero(),
			);
			if (lPeriode) {
				aPeriode.dates = lPeriode.dates;
			} else {
			}
		}
		if (
			(aRessource.date > aPeriode.dates.debut &&
				aRessource.date < aPeriode.dates.fin) ||
			GDate.estJourEgal(aRessource.date, aPeriode.dates.debut) ||
			GDate.estJourEgal(aRessource.date, aPeriode.dates.fin)
		) {
			lResult = true;
			return false;
		}
	});
	return lResult;
}
function _ajouterElementDansMatiere(aElement, aMatiere) {
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
function _ajouterGenreDansMatiere(aGenre, aElement, aMatiere) {
	aElement.genres.add(aGenre);
	aMatiere.nombres[aGenre] += 1;
	this.elmToutesMatieres.nombres[aGenre] += 1;
}
function _mettreAJourListesPJ() {
	let lMatiere;
	const lSelf = this;
	function _parcoursDocuments(D) {
		D.dates = null;
		if (!D.genres) {
			D.genres = new TypeEnsembleNombre();
		}
		if (_ressourceDansListePeriodes.bind(lSelf)(D)) {
			if (D.getGenre() === EGenreRessourcePedagogique.QCM) {
				if (UtilitaireQCM.estJouable(D.ressource)) {
					_ajouterGenreDansMatiere.call(
						this,
						EGenreRessourcePedagogique.QCM,
						D,
						lMatiere,
					);
				}
				if (UtilitaireQCM.estCorrige(D.ressource)) {
					_ajouterGenreDansMatiere.call(
						this,
						EGenreRessourcePedagogique.corrige,
						D,
						lMatiere,
					);
				}
			} else {
				let lGenre = D.getGenre();
				if (
					!this.avecDocumentCloud &&
					lGenre === EGenreRessourcePedagogique.documentCloud
				) {
					lGenre = EGenreRessourcePedagogique.documentJoint;
				}
				_ajouterGenreDansMatiere.call(this, lGenre, D, lMatiere);
			}
			if (
				D.matiere &&
				!D.matiere.getLibelle() &&
				D.matiere.egalParNumeroEtGenre(lMatiere.getNumero())
			) {
				D.matiere.setLibelle(lMatiere.getLibelle());
			}
			_ajouterElementDansMatiere.call(this, D, lMatiere);
		}
	}
	for (let i = 0, lNb = this.parametres.listeMatieres.count(); i < lNb; i++) {
		lMatiere = this.parametres.listeMatieres.get(i);
		lMatiere.ensembleDocuments = new ObjetListeElements();
		lMatiere.nombres = {};
		for (const lKey of MethodesObjet.enumKeys(EGenreRessourcePedagogique)) {
			const lGenre = EGenreRessourcePedagogique[lKey];
			lMatiere.nombres[lGenre] = 0;
		}
		if (!!lMatiere && lMatiere.getGenre() !== -1) {
			lMatiere.listeRessources.parcourir(_parcoursDocuments.bind(this));
		}
	}
}
function _surReponseEnvoiRequete(
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
		this.parametres.ressourceSelectionnee.getGenre() === EGenreRessource.Matiere
	) {
		this.parametres.ressourceSelectionnee =
			this.parametres.listeMatieres.getElementParNumero(
				this.parametres.ressourceSelectionnee.getNumero(),
			);
	} else {
		this.parametres.ressourceSelectionnee = null;
	}
	if (
		GEtatUtilisateur.avecFenetreKiosque() &&
		GEtatUtilisateur.kiosque &&
		GEtatUtilisateur.kiosque.listeRessources
	) {
		this.parametres.listeManuelsNumeriques =
			GEtatUtilisateur.kiosque.listeRessources;
	}
	if (!!aJSON && !!aJSON.ressourcesNumeriques) {
		this.ressourcesNumeriques = aJSON.ressourcesNumeriques;
	}
	if (
		(this.parametres.listeMatieres &&
			this.parametres.listeMatieres.count() > 0) ||
		!!this.parametres.listeManuelsNumeriques
	) {
		this.elmToutesMatieres = new ObjetElement(
			GTraductions.getValeur("TAFEtContenu.toutesLesMatieres"),
			null,
			-1,
		);
		this.parametres.listeMatieres.insererElement(this.elmToutesMatieres, 0);
		if (!this.parametres.ressourceSelectionnee) {
			this.parametres.ressourceSelectionnee = this.elmToutesMatieres;
		}
		GHtml.setDisplay(this.identListeMatieres, true);
		_mettreAJourListesPJ.bind(this)();
		const lListeMatieres = this.getInstance(this.identListeMatieres);
		this.getInstance(this.identListeMatieres).setOptionsListe({
			piedDeListe: {
				getContenu: _composePiedDeListeManuels.bind(this),
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
		GHtml.setDisplay(this.identListeMatieres, false);
		this._actualiserDetail();
	}
}
function _envoieRequete() {
	new ObjetRequeteRessourcePedagogique(
		this,
		_surReponseEnvoiRequete.bind(this),
	).lancerRequete({
		avecRessourcesPronote: true,
		avecRessourcesEditeur: false,
	});
}
class DonneesListe_RessourcePedaMatiere extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
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
				'<div class="Toutes-Matieres"><i class="icon_th_large"></i>',
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
module.exports = { InterfaceRessourcePedagogique };
