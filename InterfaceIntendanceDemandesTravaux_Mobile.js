const { MethodesObjet } = require("MethodesObjet.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFicheDocumentsJoints } = require("ObjetFicheDocumentsJoints.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	DonneesListe_DemandesTravaux,
} = require("DonneesListe_DemandesTravaux.js");
const {
	ObjetFenetre_DemandesMissions,
} = require("ObjetFenetre_DemandesMissions.js");
const ObjetRequeteSaisieTravauxIntendance = require("ObjetRequeteSaisieTravauxIntendance.js");
const MultipleObjetRequeteTravauxIntendance = require("ObjetRequeteTravauxIntendance.js");
const { TypeHttpNotificationDonnes } = require("TypeHttpNotificationDonnes.js");
const { ObjetMoteurTravaux } = require("ObjetMoteurTravaux.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GDate } = require("ObjetDate.js");
const { InterfacePageCP } = require("ObjetInterfacePageCP.js");
const { GUID } = require("GUID.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
class InterfaceIntendanceDemandesTravaux extends InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.listeTravaux = new ObjetListeElements();
		this.instanceBtnFlottant = null;
		this.idZoneAucuneDonnee = GUID.getId();
		this.filtreCourant = null;
		this.elementSelectionnee = null;
	}
	getDroits() {
		let lResult = ObjetMoteurTravaux.getDroits(this.params.genre);
		return lResult;
	}
	construireInstances() {
		this.initAffichage();
		this.identListe = this.add(
			ObjetListe,
			this.evenementListe,
			this._initialiserListe,
		);
		this.identFenetreTravaux = this.addFenetre(
			ObjetFenetre_DemandesMissions,
			_evenementFenetreTravaux.bind(this),
			_initialiserFenetreTravaux,
		);
		this.identTabs = this.add(ObjetTabOnglets, "", this.initTabs);
		this.identFicheConsultationPJ = null;
		if (ObjetFicheDocumentsJoints) {
			this.identFicheConsultationPJ = this.addFenetre(
				ObjetFicheDocumentsJoints,
				null,
				null,
			);
		}
	}
	initAffichage() {
		this.params = { genre: ObjetMoteurTravaux.getGenreTraveauxIntendance() };
		this.moteur = new ObjetMoteurTravaux({
			droits: {
				avecDemandeTravaux: this.getDroits().avecDemandeTravaux,
				avecExecutionTravaux: this.getDroits().avecExecutionTravaux,
				avecGestionTravaux: this.getDroits().avecGestionTravaux,
			},
		});
	}
	setFiltre(aParams) {
		this.filtreCourant = aParams;
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe.skin.flatDesign,
			avecModeAccessible: true,
			avecLigneCreation: this.getDroits().avecExecutionTravaux,
			avecEvnt_Creation: true,
			avecEvnt_SelectionClick: true,
			messageContenuVide:
				GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_PrimMairie ||
				GEtatUtilisateur.GenreEspace === EGenreEspace.PrimMairie ||
				GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_PrimDirection ||
				GEtatUtilisateur.GenreEspace === EGenreEspace.PrimDirection
					? GTraductions.getValeur("TvxIntendance.AucuneDemande")
					: GTraductions.getValeur("TvxIntendance.AucuneMission"),
			boutons: [
				{ genre: ObjetListe.typeBouton.rechercher },
				{ genre: ObjetListe.typeBouton.filtrer },
				{ genre: ObjetListe.typeBouton.deployer },
			],
		});
	}
	evenementListe(aParams) {
		switch (aParams.genreEvenement) {
			case EGenreEvenementListe.SelectionClick:
			case EGenreEvenementListe.Edition:
				this.elementSelectionnee = aParams.article;
				_ouvrirFenetreTravaux.call(this, false);
				break;
			case EGenreEvenementListe.Creation:
				if (aParams.estDuplication) {
					this.evntDupliquerElementMission(aParams.article);
					return;
				}
				_ouvrirFenetreTravaux.call(this, true);
				break;
			case EGenreEvenementListe.Suppression:
				aParams.article.setEtat(EGenreEtat.Suppression);
				_saisie.call(this);
				break;
		}
	}
	evntDupliquerElementMission(lArticle) {
		let lTitre = "";
		const lDateCourante = GDate.getDateCourante();
		const lDateCouranteFormat = GDate.formatDate(
			lDateCourante,
			"%JJ/%MM/%AAAA",
		);
		lTitre = GTraductions.getValeur("TvxIntendance.DupliquerLe", [
			lDateCouranteFormat,
		]);
		this.getInstance(this.identFenetreTravaux).setOptionsFenetre({
			titre: lTitre,
		});
		this.getInstance(this.identFenetreTravaux).setDonnees({
			demandeCourante: lArticle,
			droits: {
				avecDemandeTravaux: this.getDroits().avecDemandeTravaux,
				avecExecutionTravaux: this.getDroits().avecExecutionTravaux,
				avecGestionTravaux: this.getDroits().avecGestionTravaux,
				avecTransfert: this.getDroits().avecTransfert,
			},
			listeEtatsAvancement: this.listeEtatsAvancement,
			listeNatureTvx: this.listeNatureTvx,
			listeSallesLieu: this.listeSallesLieu,
			listeLieux: this.listeLieux,
			listePJ: this.listePiecesJointes,
			genreTravaux: this.params.genre,
			estEnCreation: true,
			estEnDuplication: true,
		});
	}
	_actionSurRequeteTravauxIntendance(aJSON) {
		this.listeTravaux = aJSON;
		this.listeDemandesTvx = aJSON.listeLignes;
		this.listeSallesLieu = aJSON.listeSallesLieu;
		this.listeNatureTvx = aJSON.listeNatureTvx;
		this.listeEtatsAvancement = aJSON.listeEtatAvcmt;
		if (
			GEtatUtilisateur.listeDonnees &&
			GEtatUtilisateur.listeDonnees[
				TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
			]
		) {
			this.listePiecesJointes = MethodesObjet.dupliquer(
				GEtatUtilisateur.listeDonnees[
					TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
				],
			);
		}
		this.listeNatureTvx.setTri([
			ObjetTri.init("Genre", true),
			ObjetTri.init("Libelle", true),
		]);
		this.listeNatureTvx.trier();
		this.donneesListe = new DonneesListe_DemandesTravaux({
			donnees: ObjetMoteurTravaux.formaterListe(this.listeDemandesTvx),
			droits: {
				avecDemandeTravaux: this.getDroits().avecDemandeTravaux,
				avecExecutionTravaux: this.getDroits().avecExecutionTravaux,
				avecGestionTravaux: this.getDroits().avecGestionTravaux,
				avecTransfert: this.getDroits().avecTransfert,
				uniquementMesDemandesTravaux:
					this.getDroits().uniquementMesDemandesTravaux,
			},
			borneDescription: aJSON.borneDescription,
			genre: this.params.genre,
			callbackTransfererMission: this.surTransfertMission.bind(this),
			listeEtatsAvancements: this.listeEtatsAvancement,
			listeNatureTvx: this.listeNatureTvx,
			setFiltre: this.setFiltre.bind(this),
			filtreCourant: this.filtreCourant,
		});
		const lInstanceListe = this.getInstance(this.identListe);
		lInstanceListe.setDonnees(this.donneesListe);
		if (this.elementSelectionnee) {
			const lIndice = lInstanceListe
				.getListeArticles()
				.getIndiceParNumeroEtGenre(
					this.elementSelectionnee.getNumero(),
					this.elementSelectionnee.getGenre(),
				);
			if (MethodesObjet.isNumeric(lIndice)) {
				lInstanceListe.selectionnerLigne({ ligne: lIndice, avecScroll: true });
			}
		}
	}
	recupererDonnees() {
		_envoieRequete.call(this);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return this.composePageDemandesTravaux();
	}
	surTransfertMission(aArticle) {
		const lNouvelOnglet = ObjetMoteurTravaux.surTransfertMission(aArticle);
		_saisie.call(this);
		Invocateur.evenement(
			ObjetInvocateur.events.navigationOnglet,
			lNouvelOnglet,
		);
	}
	composePageDemandesTravaux() {
		const H = [];
		H.push('<div class="EspaceGauche full-height">');
		H.push(
			'<div id="',
			this.getInstance(this.identListe).getNom(),
			'" class="p-top full-height" style="height:100%; max-width:130rem;"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	_afficherTravaux() {
		let lTravaux;
		if (!!lTravaux) {
			ObjetFenetre_DemandesMissions.ouvrir({
				instance: this,
				avecRequeteDonnees: true,
				donnees: { travaux: lTravaux, listeTravaux: this.listeTravaux },
			});
		}
		ObjetFenetre_DemandesMissions.ouvrir({
			instance: this,
			avecRequeteDonnees: true,
		});
	}
	getDemandeSelectionnee() {
		const lListe = this.getInstance(this.identListe);
		return lListe.getElementSelection();
	}
}
function _envoieRequete() {
	new MultipleObjetRequeteTravauxIntendance.ObjetRequeteTravauxIntendance(
		this,
		this._actionSurRequeteTravauxIntendance,
	).lancerRequete();
}
function _ouvrirFenetreTravaux(aEnCreation) {
	let lTitre = "";
	let lDateModificationFormat = "";
	let lAvecDroitGestion =
		this.moteur &&
		this.moteur.param &&
		this.moteur.param.droits &&
		this.moteur.param.droits.avecGestionTravaux;
	const lDemandeSelectionnee = this.getDemandeSelectionnee();
	const lSeulementConsult =
		lDemandeSelectionnee &&
		lDemandeSelectionnee.seulementConsult &&
		!lAvecDroitGestion;
	if (!!lDemandeSelectionnee && !!lDemandeSelectionnee.dateCreation) {
		lDateModificationFormat = lDemandeSelectionnee.dateCreation;
	}
	lTitre = ObjetMoteurTravaux.getTitreFenetre(
		aEnCreation ? EGenreEtat.Creation : EGenreEtat.Modification,
		this.params.genre,
		lDateModificationFormat,
		lSeulementConsult,
	);
	this.getInstance(this.identFenetreTravaux).setOptionsFenetre({
		titre: lTitre,
		listeBoutons: lSeulementConsult
			? [GTraductions.getValeur("Fermer")]
			: [GTraductions.getValeur("Annuler"), GTraductions.getValeur("Valider")],
	});
	this.getInstance(this.identFenetreTravaux).setDonnees({
		demandeCourante: aEnCreation ? null : lDemandeSelectionnee,
		droits: {
			avecDemandeTravaux: this.getDroits().avecDemandeTravaux,
			avecExecutionTravaux: this.getDroits().avecExecutionTravaux,
			avecGestionTravaux: this.getDroits().avecGestionTravaux,
			avecTransfert: this.getDroits().avecTransfert,
		},
		listeEtatsAvancement: this.listeEtatsAvancement,
		listeNatureTvx: this.listeNatureTvx,
		listeSallesLieu: this.listeSallesLieu,
		listeLieux: this.listeLieux,
		listePJ: this.listePiecesJointes,
		genreTravaux: this.params.genre,
		estEnCreation: aEnCreation,
		callbackSupprimer: aEnCreation
			? null
			: (aElement) => {
					const lElement = this.listeDemandesTvx.getElementParElement(aElement);
					if (lElement) {
						lElement.setEtat(EGenreEtat.Suppression);
						_saisie.call(this);
					}
				},
	});
}
function _initialiserFenetreTravaux(aInstance) {
	aInstance.setOptionsFenetre({
		titre: "",
		largeur: 450,
		hauteur: null,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
		avecTailleSelonContenu: true,
	});
}
function _evenementFenetreTravaux(aGenreBouton, aDemande, aListeFichiers) {
	if (aGenreBouton === 1) {
		this.listeDemandesTvx = new ObjetListeElements();
		this.listeDemandesTvx.addElement(aDemande);
		this.listePiecesJointes = aListeFichiers;
		_saisie.call(this);
	}
	if (aGenreBouton === "Supprimer") {
		_saisie.call(this);
	}
}
function _saisie() {
	let lListeFichiers;
	if (this.listePiecesJointes) {
		lListeFichiers = this.listePiecesJointes.getListeElements((aElement) => {
			return aElement.getEtat() !== EGenreEtat.Aucun;
		});
	}
	new ObjetRequeteSaisieTravauxIntendance(this, _envoieRequete.bind(this))
		.addUpload({ listeFichiers: this.listePiecesJointes })
		.lancerRequete({
			listeTvx: this.listeDemandesTvx,
			ListeFichiers: lListeFichiers,
		});
}
module.exports = { InterfaceIntendanceDemandesTravaux };
