exports.InterfaceCreneauxLibres = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const DonneesListe_Simple_1 = require("DonneesListe_Simple");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetClass_1 = require("ObjetClass");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const Cache_1 = require("Cache");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfaceSelectionRessourceCours_1 = require("InterfaceSelectionRessourceCours");
const ObjetFenetre_SelectionMateriel_1 = require("ObjetFenetre_SelectionMateriel");
const ObjetGrille_CreneauxLibres_1 = require("ObjetGrille_CreneauxLibres");
const ObjetRequeteCreneauxLibres_1 = require("ObjetRequeteCreneauxLibres");
const ObjetRequeteSaisieCreneauxLibres_1 = require("ObjetRequeteSaisieCreneauxLibres");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const TypeResultatRechercheCreneauxLibres_1 = require("TypeResultatRechercheCreneauxLibres");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const DonneesListe_SelectionRessource_1 = require("DonneesListe_SelectionRessource");
class InterfaceCreneauxLibres extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this._tailles = {
			colonneChoix: 270,
			colonneListeSalles: 250,
			largeurMinGrille: 380,
			hauteurZoneReservation: 30,
		};
		this.applicationScoEspace = this.applicationSco;
		this.etatUtilisateurScoEspace =
			this.applicationScoEspace.getEtatUtilisateur();
		this.objetParametresScoEspace =
			this.applicationScoEspace.getObjetParametres();
		this.interfaceEspace = this.applicationScoEspace.getInterfaceEspace();
		this.couleur = this.applicationScoEspace.getCouleur();
		const lId = GUID_1.GUID.getId();
		this.idConteneurDroite = lId + "_cont_D";
		this.idDureeCours = lId + "_dureeC";
		this._parametresRecherche =
			this.etatUtilisateurScoEspace.getOnglet().parametresRecherche;
		if (!this._parametresRecherche) {
			this.etatUtilisateurScoEspace.getOnglet().parametresRecherche =
				this._parametresRecherche = {
					duree: this.objetParametresScoEspace.PlacesParHeure,
					capaciteSalle: 0,
					site: undefined,
					selectionSalles: false,
					uniquementMesClasses: true,
					uniquementMesGroupes: true,
					uniquementLesSallesReservables: true,
					uniquementLesMaterielsReservables: true,
				};
		}
		this._initialiserSelectionRessources();
		this._donneesRecherche = {
			listeSalles: Cache_1.GCache.creneauxLibres.existeDonnee("listeSalles")
				? Cache_1.GCache.creneauxLibres.getDonnee("listeSalles")
				: null,
			listeProfesseurs: Cache_1.GCache.creneauxLibres.existeDonnee(
				"listeProfesseurs",
			)
				? Cache_1.GCache.creneauxLibres.getDonnee("listeProfesseurs")
				: null,
			listeClasses:
				this.etatUtilisateurScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Etablissement
					? MethodesObjet_1.MethodesObjet.dupliquer(
							this.etatUtilisateurScoEspace.getListeClasses({
								avecClasse: true,
							}),
						)
					: Cache_1.GCache.creneauxLibres.existeDonnee("listeClasses")
						? Cache_1.GCache.creneauxLibres.getDonnee("listeClasses")
						: null,
			listeGroupes:
				this.etatUtilisateurScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Etablissement
					? MethodesObjet_1.MethodesObjet.dupliquer(
							this.etatUtilisateurScoEspace.getListeClasses({
								avecGroupe: true,
							}),
						)
					: Cache_1.GCache.creneauxLibres.existeDonnee("listeGroupes")
						? Cache_1.GCache.creneauxLibres.getDonnee("listeGroupes")
						: null,
			listePersonnels: Cache_1.GCache.creneauxLibres.existeDonnee(
				"listePersonnels",
			)
				? Cache_1.GCache.creneauxLibres.getDonnee("listePersonnels")
				: null,
			listeEleves: Cache_1.GCache.creneauxLibres.existeDonnee("listeEleves")
				? Cache_1.GCache.creneauxLibres.getDonnee("listeEleves")
				: null,
			listeMateriels: Cache_1.GCache.creneauxLibres.existeDonnee(
				"listeMateriels",
			)
				? Cache_1.GCache.creneauxLibres.getDonnee("listeMateriels")
				: null,
			listeSites: Cache_1.GCache.creneauxLibres.existeDonnee("listeSites")
				? Cache_1.GCache.creneauxLibres.getDonnee("listeSites")
				: null,
			listeMatieres: Cache_1.GCache.creneauxLibres.existeDonnee("listeMatieres")
				? Cache_1.GCache.creneauxLibres.getDonnee("listeMatieres")
				: null,
		};
	}
	construireInstances() {
		this.IdentCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this._evenementSurCalendrier.bind(this),
			this._initialiserCalendrier,
		);
		this.identGrille = this.add(
			ObjetGrille_CreneauxLibres_1.ObjetGrille_CreneauxLibres,
			() => {},
			this._initialiserGrille.bind(this),
		);
		this.identListeSalles = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this._initialiserListeSalles,
		);
		this.identComboDuree = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementSurComboDuree.bind(this),
			this._initialiserComboDuree.bind(this),
		);
		this.IdPremierElement = this.getInstance(
			this.identComboDuree,
		).getPremierElement();
		this.identSelection = this.add(
			InterfaceSelectionRessourceCours_1.InterfaceSelectionRessourceCours,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecSaisie: function () {
				return aInstance._avecSaisie();
			},
			boutonRecherche: {
				event: function () {
					aInstance._requeteCreneauxLibres(null);
				},
				getDisabled: function () {
					return !aInstance._avecUneRessourceSelectionnee();
				},
			},
			boutonReservation: {
				event: function () {
					aInstance._surReservationCours();
				},
				getDisabled: function () {
					return (
						!aInstance.getInstance(aInstance.identGrille).getGabarit() ||
						!aInstance.getInstance(aInstance.identGrille).getGabarit().visible
					);
				},
				getLibelle: function () {
					return aInstance._getLibelleBouton();
				},
			},
		});
	}
	_initialiserSelectionRessources() {
		this._selectionRessources = {
			matiere: null,
			salles: new ObjetListeElements_1.ObjetListeElements(),
			classes: new ObjetListeElements_1.ObjetListeElements(),
			groupes: new ObjetListeElements_1.ObjetListeElements(),
			parties: new ObjetListeElements_1.ObjetListeElements(),
			professeurs: new ObjetListeElements_1.ObjetListeElements(),
			personnels: new ObjetListeElements_1.ObjetListeElements(),
			materiels: new ObjetListeElements_1.ObjetListeElements(),
			eleves: new ObjetListeElements_1.ObjetListeElements(),
			place: -1,
			salleLibre: null,
			avecCoursAnnule: !!this.etatUtilisateurScoEspace._rechercheCreneauLibre,
			coursAnnule: this.etatUtilisateurScoEspace._rechercheCreneauLibre
				? this.etatUtilisateurScoEspace._rechercheCreneauLibre.coursAnnule
				: null,
			semaineCoursAnnule: this.etatUtilisateurScoEspace._rechercheCreneauLibre
				? this.etatUtilisateurScoEspace._rechercheCreneauLibre.numeroSemaine
				: 0,
			sallesIgnoreesCoursAnnules: this.etatUtilisateurScoEspace
				._rechercheCreneauLibre
				? !!this.etatUtilisateurScoEspace._rechercheCreneauLibre.sallesIgnorees
				: false,
		};
		if (this.etatUtilisateurScoEspace._rechercheCreneauLibre) {
			this._parametresRecherche.selectionSalles =
				!this.etatUtilisateurScoEspace._rechercheCreneauLibre.sallesIgnorees;
		}
		delete this.etatUtilisateurScoEspace._rechercheCreneauLibre;
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="Espace BorderBox" style="height:100%; display:flex; align-items: stretch;">',
		);
		H.push(
			'<div class="EspaceDroit" style="',
			ObjetStyle_1.GStyle.composeWidth(this._tailles.colonneChoix),
			'">',
		);
		H.push(this._construireZoneRecherche());
		H.push("</div>");
		H.push('<div class="flex-contain fluid-bloc">');
		H.push(
			'<div class="flex-contain cols fluid-bloc" style="min-width:',
			this._tailles.largeurMinGrille,
			'px;">',
		);
		H.push(
			'<div id="' +
				this.getInstance(this.IdentCalendrier).getNom() +
				'" style="width: 100%">',
			ObjetHtml_1.GHtml.composeBlanc(),
			"</div>",
		);
		H.push(
			'<div id="' +
				this.getInstance(this.identGrille).getNom() +
				'" style="flex: 1 1 100%">',
			"</div>",
		);
		H.push("</div>");
		H.push(
			'<div id="',
			this.idConteneurDroite,
			'" class="p-left-l flex-contain cols fix-bloc" style="',
			this._avecChoixSallesListeSalles() ? "display:none;" : "",
			'">',
		);
		H.push(
			'<div id="' +
				this.getInstance(this.identListeSalles).getNom() +
				'" class="fluid-bloc" style="',
			ObjetStyle_1.GStyle.composeWidth(this._tailles.colonneListeSalles),
			'">',
			"</div>",
		);
		if (this._avecSaisie()) {
			H.push(
				'<div ie-if="avecSaisie" class="fix-bloc p-y" style="width:100%; padding-right:15px;">',
				'<ie-bouton ie-model="boutonReservation" style="width:100%"></ie-bouton>',
				"</div>",
			);
		}
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	recupererDonnees() {
		const lCalendrier = this.getInstance(this.IdentCalendrier);
		lCalendrier.setFrequences(this.objetParametresScoEspace.frequences, true);
		lCalendrier.setSelection(
			this.etatUtilisateurScoEspace.getSemaineSelectionnee(),
		);
		lCalendrier.setDomaineInformation(
			this.objetParametresScoEspace.domaineVerrou,
			Enumere_DomaineInformation_1.EGenreDomaineInformation.Cloturee,
		);
		lCalendrier.setPeriodeDeConsultation(
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
		this._initComboDuree();
		if (
			this._donneesRecherche.listeSalles &&
			!this._selectionRessources.avecCoursAnnule
		) {
			this._initListesRessources();
		} else {
			new ObjetRequeteCreneauxLibres_1.ObjetRequeteCreneauxLibres(
				this,
				this._reponseRequeteCreneauxLibresDemandeRessources,
			).lancerRequete({
				demandeRessources: !this._donneesRecherche.listeSalles,
				demandeCoursAnnule: this._selectionRessources.avecCoursAnnule,
				coursAnnule: this._selectionRessources.coursAnnule,
				semaineCoursAnnule: this._selectionRessources.semaineCoursAnnule,
			});
		}
	}
	_avecSaisie() {
		if (this._selectionRessources.avecCoursAnnule) {
			return this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.deplacerCours,
			);
		} else {
			return this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.avecReservationCreneauxLibres,
			);
		}
	}
	_reservationEstConforme(aParametres) {
		const lSemaine = this.etatUtilisateurScoEspace.getSemaineSelectionnee();
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
				"ModeExclusif.SaisieImpossibleConsultation",
			);
			return false;
		}
		if (!this._avecSaisie()) {
			aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
				"SaisieCours.DroitsInsuffisants",
			);
			return false;
		}
		if (this.objetParametresScoEspace.domaineVerrou.getValeur(lSemaine)) {
			aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.PlacementSemaineVerrouillee",
			);
			return false;
		}
		if (
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
				lSemaine,
			)
		) {
			aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.PlacementSemaineNonModifiable",
			);
			return false;
		}
		if (this._selectionRessources.avecCoursAnnule) {
			if (
				this.objetParametresScoEspace.domaineVerrou.getValeur(
					this._selectionRessources.semaineCoursAnnule,
				) ||
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
					this._selectionRessources.semaineCoursAnnule,
				)
			) {
				aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.SemaineCoursADeplacerNonModifiable",
				);
				return false;
			}
		}
		if (
			this._selectionRessources.avecCoursAnnule &&
			this._selectionRessources.coursAnnule &&
			this._selectionRessources.coursAnnule.verrouDeplacement &&
			this._selectionRessources.semaineCoursAnnule *
				this._selectionRessources.coursAnnule.Debut !==
				this._selectionRessources.place * lSemaine
		) {
			aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
				"EDT.CoursVerrouille",
			);
			return false;
		}
		if (!this._avecChoixSallesListeSalles()) {
			if (
				!this._selectionRessources.salleLibre ||
				!this._selectionRessources.salleLibre.reservable
			) {
				aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.PlacementImpossibleSalle",
				);
				return false;
			}
		}
		if (!this._donnees.listeInfosPlaces) {
			return false;
		}
		const lInfosPlace = this._donnees.listeInfosPlaces.get(
			this._selectionRessources.place,
		);
		if (
			!lInfosPlace ||
			lInfosPlace.resultatRecherche ===
				TypeResultatRechercheCreneauxLibres_1
					.TypeResultatRechercheCreneauxLibres.rrIndefini
		) {
			return false;
		}
		if (!this._estInfosPlaceLibre(lInfosPlace)) {
			if (
				lInfosPlace.resultatRecherche ===
				TypeResultatRechercheCreneauxLibres_1
					.TypeResultatRechercheCreneauxLibres.rrAucune
			) {
				aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.PlacementToutesRessourcesNonLibres",
				);
			} else if (
				lInfosPlace.resultatRecherche ===
				TypeResultatRechercheCreneauxLibres_1
					.TypeResultatRechercheCreneauxLibres.rrPartiel
			) {
				aParametres.message = ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.PlacementRessourcesNonLibres",
				);
			}
			return false;
		}
		return true;
	}
	async _surReservationCours(aForcerSaisie) {
		if (
			!this.getInstance(this.identGrille).getGabarit() ||
			!this.getInstance(this.identGrille).getGabarit().visible
		) {
			return;
		}
		const lParametres = {};
		if (!this._reservationEstConforme(lParametres)) {
			this.applicationSco
				.getMessage()
				.afficher({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"diagnostic.PlacementImpossible",
					),
					message: lParametres.message || "",
				});
			return;
		}
		const lReponse =
			await new ObjetRequeteSaisieCreneauxLibres_1.ObjetRequeteSaisieCreneauxLibres(
				this,
			).lancerRequete({
				numeroSemaine: this.etatUtilisateurScoEspace.getSemaineSelectionnee(),
				dureeEnPlaces: this._parametresRecherche.duree,
				place: this._selectionRessources.place,
				matiere: this._selectionRessources.matiere,
				coursAnnule: this._selectionRessources.coursAnnule,
				semaineCoursAnnule: this._selectionRessources.semaineCoursAnnule,
				salleImposee: this._avecChoixSallesListeSalles()
					? null
					: this._selectionRessources.salleLibre,
				salles: this._avecChoixSallesListeSalles()
					? this._selectionRessources.salles
					: null,
				classes: this._selectionRessources.classes,
				groupes: this._selectionRessources.groupes,
				professeurs: this._selectionRessources.professeurs,
				personnels: this._selectionRessources.personnels,
				materiels: this._selectionRessources.materiels,
				eleves: this._selectionRessources.eleves,
				forcerSaisie: aForcerSaisie,
			});
		this._surReponseRequeteSaisie(
			lReponse.JSONRapportSaisie,
			lReponse.genreReponse,
		);
	}
	_getLibelleBouton() {
		return this._selectionRessources.avecCoursAnnule
			? ObjetTraduction_1.GTraductions.getValeur("CreneauxLibres.DeplacerCours")
			: ObjetTraduction_1.GTraductions.getValeur("CreneauxLibres.BtnCreation");
	}
	_avecUneRessourceSelectionnee() {
		if (!this._avecChoixSallesListeSalles()) {
			return true;
		}
		if (
			this._selectionRessources.salles &&
			this._selectionRessources.salles.count() > 0
		) {
			return true;
		}
		if (
			this._selectionRessources.classes &&
			this._selectionRessources.classes.count() > 0
		) {
			return true;
		}
		if (
			this._selectionRessources.groupes &&
			this._selectionRessources.groupes.count() > 0
		) {
			return true;
		}
		if (
			this._selectionRessources.parties &&
			this._selectionRessources.parties.count() > 0
		) {
			return true;
		}
		if (
			this._selectionRessources.professeurs &&
			this._selectionRessources.professeurs.count() > 0
		) {
			return true;
		}
		if (
			this._selectionRessources.personnels &&
			this._selectionRessources.personnels.count() > 0
		) {
			return true;
		}
		if (
			this._selectionRessources.materiels &&
			this._selectionRessources.materiels.count() > 0
		) {
			return true;
		}
		return false;
	}
	_initialiserCalendrier(aInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance);
	}
	_callbackContextMenuGabarit() {
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			evenement: () => {
				this._surReservationCours();
			},
			initCommandes: (aInstance) => {
				aInstance.addCommande(0, this._getLibelleBouton());
			},
		});
	}
	_initialiserGrille(AInstance) {
		AInstance.setOptions({
			callbackPlaceGabarit: this._callbackPlaceSurGrille.bind(this),
			callbackDblClickGabarit: this._surReservationCours.bind(this),
			callbackContextMenuGabarit: this._callbackContextMenuGabarit.bind(this),
		});
	}
	_initialiserListeSalles(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_SallesCreneauxLibres.colonnes.libelle,
			titre: {
				libelleHtml: '<span ie-html="getLibelleTitreColonneSalle"></span>',
				controleur: {
					getLibelleTitreColonneSalle: function () {
						const lDonneesListe = aInstance.getDonneesListe();
						const lNbSalles = lDonneesListe.getNbrLignes();
						let lTitreColonne;
						if (lNbSalles > 1) {
							lTitreColonne = ObjetTraduction_1.GTraductions.getValeur(
								"CreneauxLibres.TitreListeSallesP",
								[lNbSalles],
							);
						} else {
							lTitreColonne = ObjetTraduction_1.GTraductions.getValeur(
								"CreneauxLibres.TitreListeSallesS",
								[lNbSalles],
							);
						}
						return lTitreColonne;
					},
				},
			},
			taille: "100%",
		});
		aInstance.setOptionsListe({ colonnes: lColonnes, nonEditable: true });
	}
	_initialiserComboDuree(aInstance) {
		aInstance.setOptionsObjetSaisie({ longueur: 75 });
	}
	_avecChoixSallesListeSalles() {
		return this._parametresRecherche.selectionSalles;
	}
	_construireZoneRecherche() {
		const H = [];
		let lTitre = ObjetTraduction_1.GTraductions.getValeur(
			"CreneauxLibres.TitreRecherche",
		);
		if (this._selectionRessources.avecCoursAnnule) {
			lTitre = ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"CreneauxLibres.TitreRecherche_Cours",
				),
				[
					ObjetDate_1.GDate.formatDate(
						this._selectionRessources.coursAnnule.DateDuCours,
						"%JJ/%MM",
					),
					ObjetDate_1.GDate.formatDate(
						this._selectionRessources.coursAnnule.DateDuCours,
						"%hh%sh%mm",
					),
				],
			);
		}
		H.push(
			'<fieldset class="Bordure Table" style="margin:0; padding:0;">',
			'<legend class="',
			ObjetClass_1.GClass.getLegende(),
			'">',
			lTitre,
			"</legend>",
		);
		H.push('<div class="EspaceGauche EspaceHaut Texte10">');
		H.push('<div class="NoWrap EspaceBas">');
		H.push(
			'<label class="InlineBlock EspaceDroit AlignementMilieuVertical">',
			ObjetTraduction_1.GTraductions.getValeur("CreneauxLibres.dureeCreneau"),
			"</label>",
		);
		H.push(
			'<div id="' +
				this.getInstance(this.identComboDuree).getNom() +
				'" class="InlineBlock AlignementMilieuVertical WhiteSpaceNormal">',
			"</div>",
		);
		H.push("</div>");
		H.push(
			'<div id="',
			this.getInstance(this.identSelection).getNom(),
			'" class="EspaceBas"></div>',
		);
		H.push(
			'<div class="EspaceBas EspaceDroit BorderBox" style="width:100%">',
			'<ie-bouton ie-model="boutonRecherche" class="full-width themeBoutonPrimaire">',
			ObjetTraduction_1.GTraductions.getValeur("CreneauxLibres.Recherche"),
			"</ie-bouton>",
			"</div>",
		);
		H.push("</div>");
		H.push("</fieldset>");
		return H.join("");
	}
	_initComboDuree() {
		const lListeDurees = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 1; i <= this.objetParametresScoEspace.PlacesParJour; i++) {
			const lElement = new ObjetElement_1.ObjetElement(
				ObjetDate_1.GDate.formatDureeEnMillisecondes(
					ObjetDate_1.GDate.nombrePlacesEnMillisecondes(i),
				),
			);
			lElement.duree = i;
			lListeDurees.addElement(lElement);
		}
		this.getInstance(this.identComboDuree).setDonnees(
			lListeDurees,
			this._parametresRecherche.duree - 1,
		);
		this.getInstance(this.identComboDuree).setActif(
			!this._selectionRessources.avecCoursAnnule,
		);
	}
	_getFiltreSalle() {
		const lThis = this;
		let lInputValue = lThis._parametresRecherche.capaciteSalle;
		const lControleur = {
			cbSalleAuMoins1: {
				getValue: function () {
					return !lThis._avecChoixSallesListeSalles();
				},
				setValue: function (aValue) {
					lThis._surCallbackCBSalle(aValue);
				},
			},
			avecAuMoins1Salle: function () {
				return !lThis._avecChoixSallesListeSalles();
			},
			capaciteSalle: {
				getValue: function () {
					return lInputValue;
				},
				setValue: function (aValue) {
					lInputValue = aValue;
					const lCapacite = parseInt(lInputValue, 10);
					if (MethodesObjet_1.MethodesObjet.isNumber(lCapacite)) {
						lThis._parametresRecherche.capaciteSalle = lCapacite;
						lThis._surCallbackModificationCapacite(lCapacite, false);
					}
				},
				exitChange: function () {
					lThis._surCallbackModificationCapacite(
						lThis._parametresRecherche.capaciteSalle,
						true,
					);
				},
			},
			comboSite: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie({ longueur: 90 });
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					if (
						!lThis._parametresRecherche.site &&
						lThis._donneesRecherche.listeSites
					) {
						lThis._parametresRecherche.site =
							lThis._donneesRecherche.listeSites.get(0);
					}
					return lThis._donneesRecherche.listeSites;
				},
				getIndiceSelection: function () {
					const lListe = lThis._donneesRecherche.listeSites,
						lSite = lThis._parametresRecherche.site,
						lIndice = lThis._parametresRecherche.site
							? lListe.getIndiceParElement(lSite)
							: 0;
					return lIndice;
				},
				event: function (aParametres, aInstance) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstance.estUneInteractionUtilisateur()
					) {
						lThis._parametresRecherche.site = aParametres.element;
						lThis._resetGrilleEtListe();
					}
				},
			},
		};
		const H = [];
		H.push('<div class="NoWrap Texte10 EspaceBas">');
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical">',
			'<ie-checkbox ie-model="cbSalleAuMoins1">' +
				ObjetTraduction_1.GTraductions.getValeur("CreneauxLibres.AuMoinsUn") +
				"</ie-checkbox>",
			"</div>",
		);
		H.push("</div>");
		H.push('<table class="cellpadding-2" ie-display="avecAuMoins1Salle">');
		H.push(
			'<tr><td class="AlignementMilieuVertical">',
			ObjetTraduction_1.GTraductions.getValeur("CreneauxLibres.Capacite") +
				" :",
			"</td>",
		);
		H.push(
			'<td class="AlignementMilieuVertical">',
			'<input ie-model="capaciteSalle" ie-mask="/[^0-9]/i" class="Gras round-style" maxLength="3" ',
			'style="',
			ObjetStyle_1.GStyle.composeWidth(50),
			ObjetStyle_1.GStyle.composeHeight(17),
			'"/>',
			"</td></tr>",
		);
		if (Cache_1.GCache.creneauxLibres.existeDonnee("listeSites")) {
			H.push(
				'<tr><td class="AlignementMilieuVertical">',
				ObjetTraduction_1.GTraductions.getValeur("CreneauxLibres.Site") + " :",
				"</td>",
			);
			H.push(
				'<td class="AlignementMilieuVertical">',
				'<ie-combo ie-model="comboSite"></ie-combo>',
				"</td></tr>",
			);
		}
		H.push("</table>");
		return { controleur: lControleur, html: H.join("") };
	}
	_initInterfaceSelectionRessources(aDiagnostic) {
		const lParametres = {
			largeur: this._tailles.colonneChoix - 16,
			ordreRessources: [
				Enumere_Ressource_1.EGenreRessource.Matiere,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
				Enumere_Ressource_1.EGenreRessource.Personnel,
				Enumere_Ressource_1.EGenreRessource.Groupe,
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.PartieDeClasse,
				Enumere_Ressource_1.EGenreRessource.Eleve,
				Enumere_Ressource_1.EGenreRessource.Materiel,
				Enumere_Ressource_1.EGenreRessource.Salle,
			],
			ressources: {},
			diagnostic: aDiagnostic ? aDiagnostic : null,
			libelleMenuAjouterRessource: ObjetTraduction_1.GTraductions.getValeur(
				"diagnostic.AjouterRessource",
			),
			callbackAjoutRessource:
				this._ouvrirFenetreSelectionRessourceDeGenre.bind(this),
			callbackSuppressionRessource: this._surSuppressionRessource.bind(this),
		};
		if (
			!this._selectionRessources.matiere &&
			this._donneesRecherche.listeMatieres
		) {
			this._donneesRecherche.listeMatieres.parcourir((aMatiere) => {
				if (
					aMatiere.genreReservation ===
					Enumere_Ressource_1.EGenreRessource.Salle
				) {
					this._selectionRessources.matiere = aMatiere;
					return false;
				}
			});
		}
		if (
			!this._selectionRessources.matiere &&
			this._donneesRecherche.listeMatieres
		) {
			this._selectionRessources.matiere =
				this._donneesRecherche.listeMatieres.get(0);
		}
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Matiere] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
			liste: this._selectionRessources.matiere
				? new ObjetListeElements_1.ObjetListeElements().addElement(
						this._selectionRessources.matiere,
					)
				: new ObjetListeElements_1.ObjetListeElements(),
			avecAjout: false,
			avecEdition: true,
		};
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Salle] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Salles"),
			liste: this._selectionRessources.salles,
			filtre: this._getFiltreSalle(),
		};
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Classe] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Classes"),
			liste: this._selectionRessources.classes,
			avecAjout: !this._selectionRessources.avecCoursAnnule,
			avecEdition: !this._selectionRessources.avecCoursAnnule,
		};
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Groupe] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Groupes"),
			liste: this._selectionRessources.groupes,
			avecAjout: !this._selectionRessources.avecCoursAnnule,
			avecEdition: !this._selectionRessources.avecCoursAnnule,
		};
		if (
			this._selectionRessources.avecCoursAnnule &&
			this._selectionRessources.parties &&
			this._selectionRessources.parties.count() > 0
		) {
			lParametres.ressources[
				Enumere_Ressource_1.EGenreRessource.PartieDeClasse
			] = {
				libelle: ObjetTraduction_1.GTraductions.getValeur("Parties"),
				liste: this._selectionRessources.parties,
				avecAjout: false,
				avecEdition: false,
			};
		}
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Enseignant] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Professeurs"),
			liste: this._selectionRessources.professeurs,
		};
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Personnel] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Personnels"),
			liste: this._selectionRessources.personnels,
			avecAjout: !this._selectionRessources.avecCoursAnnule,
			avecEdition: !this._selectionRessources.avecCoursAnnule,
		};
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.afficherElevesDetachesDansCours,
			)
		) {
			const lAvecModif =
				!this._selectionRessources.avecCoursAnnule ||
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours
						.modifierElevesDetachesSurCoursDeplaceCreneauLibre,
				);
			lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Eleve] = {
				libelle: ObjetTraduction_1.GTraductions.getValeur("EDT.ElevesDetaches"),
				liste: this._selectionRessources.eleves,
				avecAjout: lAvecModif,
				avecEdition: lAvecModif,
			};
		}
		lParametres.ressources[Enumere_Ressource_1.EGenreRessource.Materiel] = {
			libelle: ObjetTraduction_1.GTraductions.getValeur("Materiels"),
			liste: this._selectionRessources.materiels,
		};
		this.getInstance(this.identSelection).setDonneesSelectionRessourceCours(
			lParametres,
		);
	}
	_professeurConnecteObligatoireDansCours() {
		return (
			this.etatUtilisateurScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			!!this._selectionRessources.coursAnnule
		);
	}
	_initListesRessources() {
		if (this._professeurConnecteObligatoireDansCours()) {
			const lProfesseur =
				this._selectionRessources.professeurs.getElementParNumero(
					this.etatUtilisateurScoEspace.getMembre().getNumero(),
				);
			if (lProfesseur) {
				lProfesseur.nonEditable = true;
			}
		}
		this._initInterfaceSelectionRessources();
	}
	_preparerAffichageFenetreListeSalles(aFenetre) {
		this._affecterSallesReservablesDansListe(this._selectionRessources.salles);
		const lIdCapacite = "capacite";
		const lIdInfos = "infos";
		const lIdSite = "site";
		aFenetre._initialiserListe = function (aInstance) {
			const lOptions = {
				colonnes: [
					{ id: "coche", titre: "", taille: 20 },
					{
						id: "nom",
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: ObjetListe_1.ObjetListe.initColonne(100, 150),
					},
					{
						id: lIdCapacite,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titre.CapaciteAbr",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titreHint.Capacite",
						),
						taille: 30,
					},
					{
						id: lIdInfos,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titre.Infos",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.titreHint.InformationsHint",
						),
						taille: 100,
					},
				],
			};
			if (Cache_1.GCache.creneauxLibres.existeDonnee("listeSites")) {
				lOptions.colonnes.push({
					id: lIdSite,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.titre.site",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.titreHint.siteHint",
					),
					taille: 100,
				});
			}
			if (this.getOptions().optionsListe) {
				$.extend(lOptions, this.getOptions().optionsListe);
			}
			aInstance.setOptionsListe(lOptions);
		};
		aFenetre._creerObjetDonneesListe = function () {
			const lDonneesListe =
				new DonneesListe_SelectionRessource_1.DonneesListe_SelectionRessource(
					this.listeRessources,
				);
			const lGetValeur = lDonneesListe.getValeur;
			lDonneesListe.getValeur = function (aParams) {
				switch (aParams.idColonne) {
					case lIdCapacite:
						return aParams.article.capacite || "-";
					case lIdInfos:
						return aParams.article.infos || "";
					case lIdSite:
						return aParams.article.strSite || "";
				}
				return lGetValeur(aParams);
			};
			const lGetStyle = lDonneesListe.getStyle;
			lDonneesListe.getStyle = function (aParams) {
				switch (aParams.idColonne) {
					case lIdCapacite:
						return aParams.article.capNonPropre
							? "color:grey; font-style:italic;"
							: "";
				}
				return lGetStyle(aParams);
			};
			return lDonneesListe;
		};
	}
	_preparerAffichageFenetreListeEleves(aFenetre) {
		aFenetre._initialiserListe = function (aInstance) {
			const lOptions = {
				colonnes: [
					{ id: "coche", titre: "", taille: 20 },
					{
						id: "nom",
						titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
						taille: ObjetListe_1.ObjetListe.initColonne(100, 200),
					},
					{
						id: "classe",
						titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
						taille: 75,
					},
				],
			};
			if (this.getOptions().optionsListe) {
				$.extend(lOptions, this.getOptions().optionsListe);
			}
			aInstance.setOptionsListe(lOptions);
		};
		aFenetre._creerObjetDonneesListe = function () {
			const lListe =
				new DonneesListe_SelectionRessource_1.DonneesListe_SelectionRessource(
					this.listeRessources,
				);
			const lGetValeur = lListe.getValeur;
			lListe.getValeur = function (aParams) {
				switch (aParams.idColonne) {
					case "classe":
						return aParams.article.strClasse || "-";
				}
				return lGetValeur(aParams);
			};
			return lListe;
		};
	}
	_surCallbackCBSalle(aChecked) {
		this._parametresRecherche.selectionSalles = !aChecked;
		if (!this._parametresRecherche.selectionSalles) {
			this._selectionRessources.salles =
				new ObjetListeElements_1.ObjetListeElements();
		}
		this._resetGrilleEtListe();
		this._mettreAJourSelonCBAuMoinsUneSalle();
	}
	_mettreAJourSelonCBAuMoinsUneSalle() {
		const lJConteneur = $("#" + this.idConteneurDroite.escapeJQ());
		if (this._parametresRecherche.selectionSalles) {
			lJConteneur.hide();
		} else {
			lJConteneur.show();
		}
		$(window).trigger("resize");
	}
	_ouvrirFenetreSelectionRessourceDeGenre(aGenre) {
		if (aGenre === Enumere_Ressource_1.EGenreRessource.Matiere) {
			const lListeMatieres = new ObjetListeElements_1.ObjetListeElements();
			this._donneesRecherche.listeMatieres.parcourir((aMatiere) => {
				if (
					this._selectionRessources.matiere &&
					this._selectionRessources.matiere.getNumero() !== aMatiere.getNumero()
				) {
					lListeMatieres.addElement(aMatiere);
				}
			}, this);
			lListeMatieres.setTri(this._donneesRecherche.listeMatieres.getTri());
			const lDonneesListe = new DonneesListe_Simple_1.DonneesListe_Simple(
				lListeMatieres,
			);
			lDonneesListe.getValeur = function (aParams) {
				if (aParams.colonne === 0) {
					return aParams.article.code;
				}
				return aParams.article.getLibelle();
			};
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_Liste_1.ObjetFenetre_Liste,
				{
					pere: this,
					evenement: (aGenreBouton, aSelection) => {
						if (aGenreBouton !== 1) {
							return;
						}
						this._selectionRessources.matiere = lListeMatieres.get(aSelection);
						this._initInterfaceSelectionRessources();
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
							largeur: 340,
							hauteur: null,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
						aInstance.paramsListe = {
							titres: [
								ObjetTraduction_1.GTraductions.getValeur("Code"),
								ObjetTraduction_1.GTraductions.getValeur("Libelle"),
							],
							tailles: [70, "100%"],
							editable: false,
							optionsListe: {
								hauteurAdapteContenu: true,
								hauteurMaxAdapteContenu: Math.min(
									GNavigateur.ecranH - 200,
									600,
								),
								parsingSurColonne: 1,
								boutons: [
									{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
								],
							},
						};
					},
				},
				{ identConservationCoordonnees: "fenetre_ressource_creneaulibre" },
			).setDonnees(lDonneesListe);
			return;
		}
		let lFenetre;
		const lParamsFenetre = {
			pere: this,
			evenement: this._evenementSurFenetreSelectionRessource,
			initialiser(aInstance) {
				aInstance.setOptionsFenetre({
					hauteur: null,
					avecTailleSelonContenu: true,
				});
			},
		};
		const lOptionsFenetre = {
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CreneauxLibres.ChoisirRessource",
			),
			largeur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			identConservationCoordonnees: "fenetre_ressource_creneaulibre",
		};
		if (aGenre === Enumere_Ressource_1.EGenreRessource.Materiel) {
			lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionMateriel_1.ObjetFenetre_SelectionMateriel,
				lParamsFenetre,
				lOptionsFenetre,
			);
		} else {
			lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
				lParamsFenetre,
				lOptionsFenetre,
			);
		}
		lFenetre.indexBtnValider = 1;
		lFenetre.setOptionsFenetreSelectionRessource({
			selectionObligatoire: false,
			avecCocheRessources: false,
			getClassRessource: function (D) {
				return D.reservable ? "Gras" : "";
			},
			optionsListe: {
				hauteurAdapteContenu: true,
				hauteurMaxAdapteContenu: Math.min(GNavigateur.ecranH - 200, 600),
				parsingSurColonne: 1,
			},
			optionsDonneesListe: { avecSelection: false },
		});
		const lParametres = this._parametresRecherche;
		const lDonnees = {
			genreRessource: aGenre,
			titre:
				Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
					aGenre,
				),
			estGenreRessourceDUtilisateurConnecte:
				Enumere_Ressource_1.EGenreRessourceUtil.correspondAuGenreUtilisateurEspaceCourant(
					aGenre,
				),
		};
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.Salle:
				this._preparerAffichageFenetreListeSalles(lFenetre);
				lFenetre.setOptionsFenetreSelectionRessource({
					filtres: [
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.UniqementLesSallesReservables",
							),
							filtre(aElement, aChecked) {
								return aChecked ? aElement.reservable : true;
							},
							checked: this._parametresRecherche.uniquementLesSallesReservables,
							callbackChecked(aChecked) {
								lParametres.uniquementLesSallesReservables = aChecked;
							},
						},
					],
				});
				$.extend(lDonnees, {
					listeRessources: this._donneesRecherche.listeSalles,
					listeRessourcesSelectionnees: this._selectionRessources.salles,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.Classe:
				lFenetre.setOptionsFenetreSelectionRessource({
					filtres: [
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"CreneauxLibres.UniquementMesClasses",
							),
							filtre(aElement, aChecked) {
								return aChecked ? aElement.appartient : true;
							},
							checked: this._parametresRecherche.uniquementMesClasses,
							callbackChecked(aChecked) {
								lParametres.uniquementMesClasses = aChecked;
							},
						},
					],
				});
				$.extend(lDonnees, {
					listeRessources: this._donneesRecherche.listeClasses,
					listeRessourcesSelectionnees: this._selectionRessources.classes,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.Groupe:
				lFenetre.setOptionsFenetreSelectionRessource({
					filtres: [
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"CreneauxLibres.UniquementMesGroupes",
							),
							filtre(aElement, aChecked) {
								return aChecked ? aElement.appartient : true;
							},
							checked: this._parametresRecherche.uniquementMesGroupes,
							callbackChecked(aChecked) {
								lParametres.uniquementMesGroupes = aChecked;
							},
						},
					],
				});
				$.extend(lDonnees, {
					listeRessources: this._donneesRecherche.listeGroupes,
					listeRessourcesSelectionnees: this._selectionRessources.groupes,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.Enseignant: {
				const lListeProfs = MethodesObjet_1.MethodesObjet.dupliquer(
					this._donneesRecherche.listeProfesseurs,
				);
				if (this._professeurConnecteObligatoireDansCours()) {
					const lProfesseurCourant = lListeProfs.getElementParNumeroEtGenre(
						this.etatUtilisateurScoEspace.getMembre().getNumero(),
					);
					if (lProfesseurCourant) {
						lProfesseurCourant.nonEditable = true;
					}
				}
				$.extend(lDonnees, {
					listeRessources: lListeProfs,
					listeRessourcesSelectionnees: this._selectionRessources.professeurs,
				});
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				$.extend(lDonnees, {
					listeRessources: this._donneesRecherche.listePersonnels,
					listeRessourcesSelectionnees: this._selectionRessources.personnels,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				this._preparerAffichageFenetreListeEleves(lFenetre);
				$.extend(lDonnees, {
					listeRessources: this._donneesRecherche.listeEleves,
					listeRessourcesSelectionnees: this._selectionRessources.eleves,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				lFenetre.setOptionsFenetreSelectionRessource({
					filtres: [
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.UniqementLesMaterielsReservables",
							),
							filtre(aElement, aChecked) {
								return aChecked ? aElement.reservable : true;
							},
							checked:
								this._parametresRecherche.uniquementLesMaterielsReservables,
							callbackChecked(aChecked) {
								lParametres.uniquementLesMaterielsReservables = aChecked;
							},
						},
					],
				});
				$.extend(lDonnees, {
					listeRessources: this._donneesRecherche.listeMateriels,
					listeRessourcesSelectionnees: this._selectionRessources.materiels,
				});
				break;
			default:
		}
		if (lDonnees.listeRessources) {
			lFenetre.setDonnees(lDonnees);
		}
	}
	_affecterSallesReservablesDansListe(aListeSalles) {
		if (!this._avecSaisie()) {
			return;
		}
		const lListeToutesLesSalles = this._donneesRecherche.listeSalles;
		aListeSalles.parcourir((D) => {
			const lSalle = lListeToutesLesSalles.getElementParNumero(D.getNumero());
			if (lSalle && lSalle.reservable) {
				D.reservable = true;
			}
		});
	}
	_surCallbackModificationCapacite(aCapacite, aSortie) {
		this._parametresRecherche.capaciteSalle = aCapacite;
		if (aSortie) {
			this._resetGrilleEtListe();
		}
	}
	_requeteCreneauxLibres(aDonneesGabarit) {
		new ObjetRequeteCreneauxLibres_1.ObjetRequeteCreneauxLibres(
			this,
			this._reponseRequeteCreneauxLibres.bind(this, aDonneesGabarit),
		).lancerRequete({
			numeroSemaine: this.etatUtilisateurScoEspace.getSemaineSelectionnee(),
			dureeEnPlaces: this._parametresRecherche.duree,
			capaciteSalle: this._parametresRecherche.capaciteSalle,
			site: this._parametresRecherche.site,
			coursAnnule: this._selectionRessources.coursAnnule,
			semaineCoursAnnule: this._selectionRessources.semaineCoursAnnule,
			salles: this._avecChoixSallesListeSalles()
				? this._selectionRessources.salles
				: null,
			classes: this._selectionRessources.classes,
			groupes: this._selectionRessources.groupes,
			parties: this._selectionRessources.parties,
			professeurs: this._selectionRessources.professeurs,
			personnels: this._selectionRessources.personnels,
			materiels: this._selectionRessources.materiels,
			eleves: this._selectionRessources.eleves,
			listeSallesModele: this._donneesRecherche.listeSalles,
		});
	}
	_avecBasculeOnglet(aOnglet, aRessource, aGenreRessource, aCours) {
		if (aRessource) {
			if (this.etatUtilisateurScoEspace.ongletEstVisible(aOnglet)) {
				this.etatUtilisateurScoEspace._coursASelectionner = aCours;
				this.etatUtilisateurScoEspace.Navigation.setRessource(
					aGenreRessource,
					MethodesObjet_1.MethodesObjet.dupliquer(aRessource),
				);
				this.interfaceEspace.changementManuelOnglet(aOnglet);
				return true;
			}
		}
		return false;
	}
	_surReponseRequeteSaisie(aJSON, aGenreReponse) {
		if (
			aGenreReponse === ObjetRequeteJSON_1.EGenreReponseSaisie.succes &&
			aJSON &&
			aJSON.demandeConfirmationSaisie
		) {
			this.applicationSco.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				titre: aJSON.demandeConfirmationSaisie.titre,
				message: aJSON.demandeConfirmationSaisie.message,
				callback: (aGenreAction) => {
					if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
						this._surReservationCours(true);
					}
				},
			});
			return;
		}
		if (
			aGenreReponse === ObjetRequeteJSON_1.EGenreReponseSaisie.succes &&
			aJSON &&
			aJSON.cours
		) {
			if (
				this.etatUtilisateurScoEspace.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur &&
				this._selectionRessources.professeurs.getElementParNumeroEtGenre(
					this.etatUtilisateurScoEspace.getMembre().getNumero(),
				)
			) {
				this.etatUtilisateurScoEspace._coursASelectionner = aJSON.cours;
				this.interfaceEspace.changementManuelOnglet(
					Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps,
				);
				return;
			}
			if (
				this.etatUtilisateurScoEspace.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement &&
				this._selectionRessources.personnels.getElementParNumeroEtGenre(
					this.etatUtilisateurScoEspace.getMembre().getNumero(),
				)
			) {
				this.etatUtilisateurScoEspace._coursASelectionner = aJSON.cours;
				this.interfaceEspace.changementManuelOnglet(
					Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps,
				);
				return;
			}
			const lSalle = this._avecChoixSallesListeSalles()
					? this._selectionRessources.salles.get(0)
					: this._selectionRessources.salleLibre,
				lMateriel = this._selectionRessources.materiels.get(0);
			if (
				this._avecBasculeOnglet(
					Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsSalle,
					lSalle,
					Enumere_Ressource_1.EGenreRessource.Salle,
					aJSON.cours,
				)
			) {
				return;
			}
			if (
				this._avecBasculeOnglet(
					Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsMateriel,
					lMateriel,
					Enumere_Ressource_1.EGenreRessource.Materiel,
					aJSON.cours,
				)
			) {
				return;
			}
			this.applicationSco
				.getMessage()
				.afficher({
					message: this._selectionRessources.avecCoursAnnule
						? ObjetTraduction_1.GTraductions.getValeur(
								"CreneauxLibres.CoursDeplace",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"CreneauxLibres.CoursCree",
							),
				});
		}
		this.setEtatSaisie(false);
		if (aGenreReponse === ObjetRequeteJSON_1.EGenreReponseSaisie.succes) {
			this._resetGrilleEtListe();
		}
	}
	_evenementSurCalendrier(
		ASelection,
		ABidon,
		AGenreDomaineInformation,
		aEstDansPeriodeConsultation,
		AIsToucheSelection,
	) {
		if (AIsToucheSelection) {
			this.setFocusIdCourant();
		} else {
			this.setIdCourant(
				this.getInstance(this.IdentCalendrier).IdPremierElement,
			);
			this.setEtatIdCourant(false);
			this.etatUtilisateurScoEspace.setSemaineSelectionnee(ASelection);
			if (
				this.getInstance(this.IdentCalendrier).InteractionUtilisateur &&
				this._donnees &&
				this._donnees.listeInfosPlaces
			) {
				this._donnees = {};
				let lDonneesGabarit = null;
				if (this._selectionRessources && this._selectionRessources.place >= 0) {
					lDonneesGabarit = { place: this._selectionRessources.place };
				}
				this._requeteCreneauxLibres(lDonneesGabarit);
			} else {
				this._donnees = {};
				this._resetGrilleEtListe();
			}
		}
	}
	_resetGrilleEtListe() {
		this._donnees.listeInfosPlaces = null;
		const lInstance = this.getInstance(this.identGrille);
		lInstance.setOptions({
			couleurFond: this.couleur.grille.fond,
			couleurBordures: this.couleur.grille.bordure,
		});
		lInstance.setDonnees({
			infosPlacesLibres: new ObjetListeElements_1.ObjetListeElements(),
			numeroSemaine: this.etatUtilisateurScoEspace.getSemaineSelectionnee(),
			duree: this._parametresRecherche.duree,
			selectionSalles: this._avecChoixSallesListeSalles(),
		});
		this._resetListeSalles();
		this._initInterfaceSelectionRessources();
	}
	_resetListeSalles() {
		if (!this._avecChoixSallesListeSalles()) {
			this.getInstance(this.identListeSalles).setDonnees(
				new DonneesListe_SallesCreneauxLibres(
					new ObjetListeElements_1.ObjetListeElements(),
				),
			);
		}
		this._resetListePlaceSelectionnee();
	}
	_resetListePlaceSelectionnee() {
		this._selectionRessources.salleLibre = null;
		this._selectionRessources.place = -1;
		this.$refreshSelf();
	}
	_actualiserSelonPlaceSurGrille(aPlace) {
		this._resetListePlaceSelectionnee();
		this._selectionRessources.place = aPlace;
		const lInfosPlace = this._donnees.listeInfosPlaces
			? this._donnees.listeInfosPlaces.get(aPlace)
			: null;
		if (!this._avecChoixSallesListeSalles()) {
			let lListeSalles = new ObjetListeElements_1.ObjetListeElements();
			if (lInfosPlace && lInfosPlace.listeSallesLibres) {
				lListeSalles = lInfosPlace.listeSallesLibres;
			}
			this._affecterSallesReservablesDansListe(lListeSalles);
			this.getInstance(this.identListeSalles).setDonnees(
				new DonneesListe_SallesCreneauxLibres(lListeSalles),
			);
		}
		if (lInfosPlace) {
			this._initInterfaceSelectionRessources(lInfosPlace.diagnostic);
		}
		this.$refreshSelf();
	}
	_callbackPlaceSurGrille(aPlace) {
		this._actualiserSelonPlaceSurGrille(aPlace);
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lInfosPlace = this._donnees.listeInfosPlaces
					? this._donnees.listeInfosPlaces.get(this._selectionRessources.place)
					: null;
				if (lInfosPlace && lInfosPlace.listeSallesLibres) {
					this._selectionRessources.salleLibre =
						lInfosPlace.listeSallesLibres.get(aParametres.ligne);
					if (
						!this._selectionRessources.salleLibre.reservable &&
						this._avecSaisie()
					) {
						this.applicationSco
							.getMessage()
							.afficher({
								message: ObjetChaine_1.GChaine.format(
									ObjetTraduction_1.GTraductions.getValeur(
										"SaisieCours.SalleNonReservable",
									),
									[this._selectionRessources.salleLibre.getLibelle()],
								),
							});
						return;
					}
				}
				break;
			}
		}
	}
	_evenementSurComboDuree(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this._parametresRecherche.duree = aParams.element.duree;
			this._resetGrilleEtListe();
		}
	}
	_evenementSurFenetreSelectionRessource(
		aGenreRessource,
		aListeSelection,
		aNumeroBouton,
	) {
		if (aNumeroBouton < 0) {
			return;
		}
		if (
			aGenreRessource === Enumere_Ressource_1.EGenreRessource.Salle &&
			!this._avecChoixSallesListeSalles() &&
			this._selectionRessources.salles.count() > 0
		) {
			this._parametresRecherche.selectionSalles = true;
			this._mettreAJourSelonCBAuMoinsUneSalle();
		}
		this._resetGrilleEtListe();
	}
	_surSuppressionRessource(aGenreRessource, aIndice) {
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Salle:
				this._selectionRessources.salles.remove(aIndice);
				break;
			case Enumere_Ressource_1.EGenreRessource.Classe:
				this._selectionRessources.classes.remove(aIndice);
				break;
			case Enumere_Ressource_1.EGenreRessource.Groupe:
				this._selectionRessources.groupes.remove(aIndice);
				break;
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
				this._selectionRessources.professeurs.remove(aIndice);
				break;
			case Enumere_Ressource_1.EGenreRessource.Personnel:
				this._selectionRessources.personnels.remove(aIndice);
				break;
			case Enumere_Ressource_1.EGenreRessource.Materiel:
				this._selectionRessources.materiels.remove(aIndice);
				break;
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				this._selectionRessources.eleves.remove(aIndice);
				break;
			default:
				break;
		}
		this._resetGrilleEtListe();
	}
	_gererRessourcesReservablesDeCours(aListeRecherche, aListeRessourcesDeCours) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		aListeRecherche.parcourir((D) => {
			const lTrouve = aListeRessourcesDeCours.getElementParElement(D);
			if (aListeRessourcesDeCours.getElementParElement(D)) {
				lTrouve.reservable = true;
				const lElement = MethodesObjet_1.MethodesObjet.dupliquer(D);
				lElement.reservable = true;
				lListe.addElement(lElement);
			} else {
				lListe.addElement(D);
			}
		});
		return lListe;
	}
	_getListeContenusDeGenre(aCours, aGenre) {
		return aCours.ListeContenus.getListeElements((D) => {
			return D.getGenre() === aGenre && !D.provenanceGroupe;
		});
	}
	_reponseRequeteCreneauxLibresDemandeRessources(aParametres) {
		if (aParametres.demandeRessources) {
			Cache_1.GCache.creneauxLibres.setDonnee(
				"listeSalles",
				aParametres.reponse.listeSalles,
			);
			this._donneesRecherche.listeSalles = aParametres.reponse.listeSalles;
			if (aParametres.reponse.listeClasses) {
				Cache_1.GCache.creneauxLibres.setDonnee(
					"listeClasses",
					aParametres.reponse.listeClasses,
				);
				this._donneesRecherche.listeClasses = aParametres.reponse.listeClasses;
			}
			const lListesSesClasses = this.etatUtilisateurScoEspace.getListeClasses({
				avecClasse: true,
				uniquementClasseEnseignee: true,
			});
			this._donneesRecherche.listeClasses.parcourir((D) => {
				D.appartient = !!lListesSesClasses.getElementParNumeroEtGenre(
					D.getNumero(),
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
			});
			if (aParametres.reponse.listeGroupes) {
				Cache_1.GCache.creneauxLibres.setDonnee(
					"listeGroupes",
					aParametres.reponse.listeGroupes,
				);
				this._donneesRecherche.listeGroupes = aParametres.reponse.listeGroupes;
			}
			const lListeSesGroupes = this.etatUtilisateurScoEspace.getListeClasses({
				avecGroupe: true,
				uniquementClasseEnseignee: true,
			});
			this._donneesRecherche.listeGroupes.parcourir((D) => {
				D.appartient = !!lListeSesGroupes.getElementParNumeroEtGenre(
					D.getNumero(),
					Enumere_Ressource_1.EGenreRessource.Groupe,
				);
			});
			Cache_1.GCache.creneauxLibres.setDonnee(
				"listeProfesseurs",
				aParametres.reponse.listeProfesseurs,
			);
			this._donneesRecherche.listeProfesseurs =
				aParametres.reponse.listeProfesseurs;
			Cache_1.GCache.creneauxLibres.setDonnee(
				"listeEleves",
				aParametres.reponse.listeEleves,
			);
			this._donneesRecherche.listeEleves = aParametres.reponse.listeEleves;
			if (aParametres.reponse.listeMatieres) {
				aParametres.reponse.listeMatieres.trier();
				Cache_1.GCache.creneauxLibres.setDonnee(
					"listeMatieres",
					aParametres.reponse.listeMatieres,
				);
				this._donneesRecherche.listeMatieres =
					aParametres.reponse.listeMatieres;
			}
			Cache_1.GCache.creneauxLibres.setDonnee(
				"listePersonnels",
				aParametres.reponse.listePersonnels,
			);
			this._donneesRecherche.listePersonnels =
				aParametres.reponse.listePersonnels;
			Cache_1.GCache.creneauxLibres.setDonnee(
				"listeMateriels",
				aParametres.reponse.listeMateriels,
			);
			this._donneesRecherche.listeMateriels =
				aParametres.reponse.listeMateriels;
			if (aParametres.reponse.listeSites) {
				aParametres.reponse.listeSites.trier();
				Cache_1.GCache.creneauxLibres.setDonnee(
					"listeSites",
					aParametres.reponse.listeSites,
				);
				this._donneesRecherche.listeSites = aParametres.reponse.listeSites;
			}
		}
		if (aParametres.reponse.coursAnnule) {
			const lCours = aParametres.reponse.coursAnnule;
			let lListe;
			if (!this._selectionRessources.sallesIgnoreesCoursAnnules) {
				lListe = this._getListeContenusDeGenre(
					lCours,
					Enumere_Ressource_1.EGenreRessource.Salle,
				);
				if (lListe.count() > 0) {
					this._donneesRecherche.listeSalles =
						this._gererRessourcesReservablesDeCours(
							this._donneesRecherche.listeSalles,
							lListe,
						);
					this._selectionRessources.salles.add(lListe);
				}
			}
			lListe = this._getListeContenusDeGenre(
				lCours,
				Enumere_Ressource_1.EGenreRessource.Materiel,
			);
			if (lListe.count() > 0) {
				this._donneesRecherche.listeMateriels =
					this._gererRessourcesReservablesDeCours(
						this._donneesRecherche.listeMateriels,
						lListe,
					);
				this._selectionRessources.materiels = lListe;
			}
			lListe = this._getListeContenusDeGenre(
				lCours,
				Enumere_Ressource_1.EGenreRessource.Groupe,
			);
			if (lListe.count() > 0) {
				this._selectionRessources.groupes = lListe;
			}
			lListe = this._getListeContenusDeGenre(
				lCours,
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
			if (lListe.count() > 0) {
				this._selectionRessources.classes = lListe;
			}
			lListe = this._getListeContenusDeGenre(
				lCours,
				Enumere_Ressource_1.EGenreRessource.PartieDeClasse,
			);
			if (lListe.count() > 0) {
				this._selectionRessources.parties = lListe;
			}
			lListe = this._getListeContenusDeGenre(
				lCours,
				Enumere_Ressource_1.EGenreRessource.Enseignant,
			);
			if (lListe.count() > 0) {
				this._selectionRessources.professeurs = lListe;
			}
			lListe = this._getListeContenusDeGenre(
				lCours,
				Enumere_Ressource_1.EGenreRessource.Personnel,
			);
			if (lListe.count() > 0) {
				this._selectionRessources.personnels = lListe;
			}
			lListe = this._getListeContenusDeGenre(
				lCours,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			);
			if (lListe.count() > 0) {
				this._selectionRessources.eleves = lListe;
			}
			this._selectionRessources.matiere = lCours.matiere;
			this._parametresRecherche.duree = lCours.duree;
			this._initComboDuree();
		}
		this._initListesRessources();
	}
	_reponseRequeteCreneauxLibres(aDonneesGabarit, aParametres) {
		this._donnees = aParametres;
		const lInstance = this.getInstance(this.identGrille);
		lInstance.setOptions({
			couleurFond: this.couleur.grilleOccupation.fond,
			couleurBordures: this.couleur.grilleOccupation.bordure,
		});
		lInstance.setDonnees({
			infosPlacesLibres: this._donnees.listeInfosPlaces,
			estInfosPlaceLibre: this._estInfosPlaceLibre.bind(this),
			numeroSemaine: this.etatUtilisateurScoEspace.getSemaineSelectionnee(),
			duree: this._parametresRecherche.duree,
			selectionSalles: this._avecChoixSallesListeSalles(),
			placeSelectionnee: aDonneesGabarit ? aDonneesGabarit.place : -1,
		});
		if (aDonneesGabarit) {
			this._actualiserSelonPlaceSurGrille(aDonneesGabarit.place);
		} else {
			this._resetListeSalles();
			this._initInterfaceSelectionRessources();
		}
		this._traiterRessourcesIncompatibles(this._donnees.ressourcesIncompatibles);
	}
	_estInfosPlaceLibre(aInfosPlace) {
		if (!aInfosPlace) {
			return false;
		}
		if (
			aInfosPlace.resultatRecherche ===
			TypeResultatRechercheCreneauxLibres_1.TypeResultatRechercheCreneauxLibres
				.rrToutes
		) {
			return true;
		}
		return false;
	}
	_traiterRessourcesIncompatibles(aListeRessourcesIncompatibles) {
		if (
			!aListeRessourcesIncompatibles ||
			aListeRessourcesIncompatibles.count() === 0
		) {
			return;
		}
		if (this._selectionRessources.classes.count() > 0) {
			this._selectionRessources.classes =
				this._selectionRessources.classes.getListeElements((D) => {
					return !aListeRessourcesIncompatibles.getElementParNumeroEtGenre(
						D.getNumero(),
						Enumere_Ressource_1.EGenreRessource.Classe,
					);
				});
		}
		if (this._selectionRessources.groupes.count() > 0) {
			this._selectionRessources.groupes =
				this._selectionRessources.groupes.getListeElements((D) => {
					return !aListeRessourcesIncompatibles.getElementParNumeroEtGenre(
						D.getNumero(),
						Enumere_Ressource_1.EGenreRessource.Groupe,
					);
				});
		}
		this._initInterfaceSelectionRessources();
		const lLibelles = [];
		aListeRessourcesIncompatibles.parcourir((D) => {
			lLibelles.push(D.getLibelle());
		});
		this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"CreneauxLibres.RessourcesIncompatibles",
					),
					[lLibelles.join(", ")],
				),
			});
	}
}
exports.InterfaceCreneauxLibres = InterfaceCreneauxLibres;
class DonneesListe_SallesCreneauxLibres extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEvnt_Selection: true });
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SallesCreneauxLibres.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getClass(aParams) {
		const lClasses = [];
		if (!!aParams.article && !!aParams.article.reservable) {
			lClasses.push("Gras");
		}
		return lClasses.join(" ");
	}
	getCouleurCellule(aParams) {
		let lCouleurCellule = null;
		if (!!aParams.article && !!aParams.article.reservable) {
			lCouleurCellule =
				ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		return lCouleurCellule;
	}
}
DonneesListe_SallesCreneauxLibres.colonnes = {
	libelle: "DLSallesCrenLibres_libelle",
};
