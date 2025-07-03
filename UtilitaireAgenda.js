exports.UtilitaireAgenda = void 0;
const EGenreEvtAgenda_1 = require("EGenreEvtAgenda");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetListe_1 = require("ObjetListe");
const AccessApp_1 = require("AccessApp");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const lApplication = (0, AccessApp_1.getApp)();
const lEtatUtilisateur = lApplication.getEtatUtilisateur();
exports.UtilitaireAgenda = {
	_composeMessage(aEstModif) {
		const H = [];
		H.push(
			'<div class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Agenda.AgendaAttentionEvtPeriodique",
			),
			"</div>",
		);
		H.push(
			'<div class="GrandEspaceHaut">',
			aEstModif
				? ObjetTraduction_1.GTraductions.getValeur(
						"Agenda.AgendaEvtPeriodiqueConfirmerModif",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Agenda.AgendaEvtPeriodiqueConfirmerSupp",
					),
			"</div>",
		);
		H.push('<div class="EspaceHaut EspaceGauche">');
		H.push(
			'<div><ie-radio ie-model="RDEvenement(',
			EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement,
			')" class="EspaceHaut">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Agenda.AgendaSupprimerEvtUniquementOpt1",
			),
			"</ie-radio></div>",
		);
		H.push(
			'<div><ie-radio ie-model="RDEvenement(',
			EGenreEvtAgenda_1.EGenreEvtAgenda.surTouteLaSerie,
			')" class="EspaceHaut">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Agenda.AgendaSupprimerTousEvtsDeLaSerieOpt2",
			),
			"</ie-radio></div>",
		);
		H.push("</div>");
		return H.join("");
	},
	_getEvenementParDefaut(aJourDeSemaine, aDate, aFamille, aPourPrimaire) {
		const lEvenement = ObjetElement_1.ObjetElement.create({
			Libelle: "",
			DateDebut: new Date(aDate),
			DateFin: new Date(aDate),
			sansHoraire: true,
			publie: true,
			proprietaire: true,
			Commentaire: "",
			famille: aFamille,
			CouleurCellule: aFamille ? aFamille.couleur : "#FFFF00",
			genresPublicEntite: new TypeEnsembleNombre_1.TypeEnsembleNombre(),
			avecElevesRattaches: false,
			listePublicEntite: new ObjetListeElements_1.ObjetListeElements(),
			listePublicIndividu: new ObjetListeElements_1.ObjetListeElements(),
			avecDirecteur: aPourPrimaire ? true : undefined,
			Public: {
				listeClassesGroupes: new ObjetListeElements_1.ObjetListeElements(),
				listeProfs: new ObjetListeElements_1.ObjetListeElements(),
			},
			listeDocJoints: new ObjetListeElements_1.ObjetListeElements(),
		});
		lEvenement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lEvenement.DateDebut.setHours(9);
		lEvenement.DateFin.setHours(17);
		lEvenement.DateDebut.setMinutes(0);
		lEvenement.DateFin.setMinutes(0);
		return lEvenement;
	},
	trierListeEvenements(aListeElements) {
		aListeElements.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				if (!D.DateDebut) {
					return false;
				}
				return new Date(
					D.DateDebut.getFullYear(),
					D.DateDebut.getMonth(),
					D.DateDebut.getDate(),
				);
			}, Enumere_TriElement_1.EGenreTriElement.Croissant),
			ObjetTri_1.ObjetTri.init((D) => {
				if (!D.DateDebut) {
					return false;
				}
				return !D.sansHoraire && D.DateDebut.getTime();
			}, Enumere_TriElement_1.EGenreTriElement.Croissant),
		]);
		aListeElements.trier();
	},
	initListeAgenda(aInstance) {
		const lApplication = (0, AccessApp_1.getApp)();
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer }],
			avecLigneCreation: lApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.agenda.avecSaisieAgenda,
			),
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"Agenda.CreerEvenement",
			),
			messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
				"Agenda.AucunEvenementPublie",
			),
		});
	},
	_getJourLePlusProche(aListeElements, aDateCible) {
		let lElementLePlusProche = null;
		let lIndiceElementLePlusProche = null;
		let lEcrartEntreElementEtDateCiblelePlusProche = Infinity;
		const lDateCibleSansHeure = new Date(
			aDateCible.getFullYear(),
			aDateCible.getMonth(),
			aDateCible.getDate(),
		);
		if (aListeElements && aListeElements.parcourir) {
			aListeElements.parcourir((aElement, aIndex) => {
				if (!aElement.DateDebut) {
					return;
				}
				const lDateSansHeure = new Date(
					aElement.DateDebut.getFullYear(),
					aElement.DateDebut.getMonth(),
					aElement.DateDebut.getDate(),
				);
				const lEcrartEntreElementEtDateCible =
					lDateSansHeure.getTime() - lDateCibleSansHeure.getTime();
				if (
					lEcrartEntreElementEtDateCible >= 0 &&
					lEcrartEntreElementEtDateCible <
						lEcrartEntreElementEtDateCiblelePlusProche
				) {
					lEcrartEntreElementEtDateCiblelePlusProche =
						lEcrartEntreElementEtDateCible;
					lElementLePlusProche = aElement;
					lIndiceElementLePlusProche = aIndex;
				}
			});
		}
		return {
			element: lElementLePlusProche,
			indice: lIndiceElementLePlusProche,
		};
	},
	getIndiceParElement(aArticle, aObjetListe) {
		if (!aArticle || !aArticle.getNumero || !aArticle.getGenre) {
			return null;
		}
		const lListe = aObjetListe.getDonneesListe().Donnees;
		const lIndice = lListe.getIndiceParNumeroEtGenre(
			aArticle.getNumero(),
			aArticle.getGenre(),
			true,
		);
		return lIndice;
	},
	getLibelleInfosSupp() {
		var _a, _b, _c;
		return (_c =
			(_b =
				(_a = lEtatUtilisateur.listeOnglets.getElementParGenre(
					lEtatUtilisateur.getGenreOnglet(),
				)) === null || _a === void 0
					? void 0
					: _a.getLibelle) === null || _b === void 0
				? void 0
				: _b.call(_a)) !== null && _c !== void 0
			? _c
			: "agenda";
	},
	getInfosOnglet() {
		const lInfosSupp = lEtatUtilisateur.getInfosSupp(
			exports.UtilitaireAgenda.getLibelleInfosSupp(),
		);
		if (!("avecEventsPasses" in lInfosSupp)) {
			lInfosSupp.avecEventsPasses = false;
		}
		return lInfosSupp;
	},
	updateInfosOnglet(aProps, aVal) {
		lEtatUtilisateur.getInfosSupp(
			exports.UtilitaireAgenda.getLibelleInfosSupp(),
		)[aProps] = aVal;
	},
	setAvecEventsPasses(aVal) {
		exports.UtilitaireAgenda.updateInfosOnglet("avecEventsPasses", aVal);
	},
};
