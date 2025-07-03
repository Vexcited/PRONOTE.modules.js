exports.InterfaceSuivisAbsenceRetard = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Media_1 = require("DonneesListe_Media");
const DonneesListe_SelectionPersonnel_1 = require("DonneesListe_SelectionPersonnel");
const DonneesListe_SuivisAbsenceRetard_1 = require("DonneesListe_SuivisAbsenceRetard");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_SaisieSuivisAbsenceRetard_1 = require("ObjetFenetre_SaisieSuivisAbsenceRetard");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_SelectionMotif_1 = require("ObjetFenetre_SelectionMotif");
const ObjetRequetePageSuivisAbsenceRetard_1 = require("ObjetRequetePageSuivisAbsenceRetard");
const ObjetRequeteSaisieSuivisAbsenceRetard_1 = require("ObjetRequeteSaisieSuivisAbsenceRetard");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class InterfaceSuivisAbsenceRetard extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.listeDocuments = new ObjetListeElements_1.ObjetListeElements();
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this._initialiserListe,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
	}
	effacer(aMessage) {
		if (this.getInstance(this.identListe)) {
			this.getInstance(this.identListe).effacer(aMessage);
		}
	}
	setDonnees(aEleve, aDateDebut, aDateFin, aAbsence) {
		this.setEtatSaisie(false);
		this.eleve = aEleve;
		this.dateDebut = aDateDebut;
		this.dateFin = aDateFin;
		this.absence = aAbsence;
		if (!this.eleve) {
			ObjetHtml_1.GHtml.setDisplay(this.getNomInstance(this.identListe), false);
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.getNomInstance(this.identListe), true);
			this._requetePage();
		}
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				this._saisieEnCours = {
					idColonne: aParametres.idColonne,
					ligne: aParametres.ligne,
					donnee: aParametres.article,
				};
				switch (aParametres.idColonne) {
					case DonneesListe_SuivisAbsenceRetard_1
						.DonneesListe_SuivisAbsenceRetard.colonnes.RA: {
						aParametres.article.regle = !aParametres.article.regle;
						this._actualiserApresSaisie(aParametres.article);
						break;
					}
					case DonneesListe_SuivisAbsenceRetard_1
						.DonneesListe_SuivisAbsenceRetard.colonnes.certificat: {
						this._actualiserApresSaisie(aParametres.article);
						break;
					}
					case DonneesListe_SuivisAbsenceRetard_1
						.DonneesListe_SuivisAbsenceRetard.colonnes.admin:
					case DonneesListe_SuivisAbsenceRetard_1
						.DonneesListe_SuivisAbsenceRetard.colonnes.RespEl: {
						const lEstColInterlocuteur =
							aParametres.idColonne ===
							DonneesListe_SuivisAbsenceRetard_1
								.DonneesListe_SuivisAbsenceRetard.colonnes.RespEl;
						const lListePersonnes = lEstColInterlocuteur
							? this.listeInterlocuteurs
							: this.listePersonnels;
						const lTitre = lEstColInterlocuteur
							? ObjetTraduction_1.GTraductions.getValeur(
									"SuivisAR.SelectionnerInterlocuteur",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"SuivisAR.SelectionnerRespAdmin",
								);
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_Liste_1.ObjetFenetre_Liste,
							{
								pere: this,
								evenement: this._evenementFenetreListe.bind(this, false),
								initialiser: function (aInstance) {
									const lParamsListe = {};
									lParamsListe.optionsListe = {
										skin: ObjetListe_1.ObjetListe.skin.flatDesign,
										ariaLabel: lTitre,
										hauteurAdapteContenu: true,
										hauteurMaxAdapteContenu: 500,
									};
									aInstance.setOptionsFenetre({
										titre: lTitre,
										largeur: 400,
										hauteur: null,
										listeBoutons: [
											ObjetTraduction_1.GTraductions.getValeur("Annuler"),
											ObjetTraduction_1.GTraductions.getValeur("Valider"),
										],
									});
									aInstance.paramsListe = lParamsListe;
								},
							},
						).setDonnees(
							new DonneesListe_SelectionPersonnel_1.DonneesListe_SelectionPersonnel(
								lListePersonnes,
							),
							true,
						);
						break;
					}
					case DonneesListe_SuivisAbsenceRetard_1
						.DonneesListe_SuivisAbsenceRetard.colonnes.nature: {
						const lObjFenetreListe =
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_Liste_1.ObjetFenetre_Liste,
								{
									pere: this,
									evenement: this._evenementFenetreListe.bind(this, false),
									initialiser: function (aInstance) {
										const lColonnes = [];
										lColonnes.push({
											id: DonneesListe_Media_1.DonneesListe_Media.colonnes.code,
											titre: ObjetTraduction_1.GTraductions.getValeur("Code"),
											taille: 40,
										});
										lColonnes.push({
											id: DonneesListe_Media_1.DonneesListe_Media.colonnes
												.libelle,
											titre:
												ObjetTraduction_1.GTraductions.getValeur(
													"SuivisAR.Intitule",
												),
											taille: "100%",
										});
										const lParamsListe = {};
										lParamsListe.optionsListe = {
											colonnes: lColonnes,
											hauteurAdapteContenu: true,
											hauteurMaxAdapteContenu: 500,
											listeCreations: [0, 1],
											avecLigneCreation: true,
										};
										const lTitreFenetre = aParametres.article.media.envoi
											? ObjetTraduction_1.GTraductions.getValeur(
													"SuivisAR.EditionEnvois",
												)
											: ObjetTraduction_1.GTraductions.getValeur(
													"SuivisAR.EditionReceptions",
												);
										aInstance.setOptionsFenetre({
											titre: lTitreFenetre,
											largeur: 300,
											hauteur: null,
											listeBoutons: [
												ObjetTraduction_1.GTraductions.getValeur("Annuler"),
												ObjetTraduction_1.GTraductions.getValeur("Valider"),
											],
										});
										aInstance.paramsListe = lParamsListe;
									},
								},
							);
						lObjFenetreListe.setDonnees(
							new DonneesListe_Media_1.DonneesListe_Media(
								this.listeMedias,
								!aParametres.article.media.envoi,
								this.listeSuivisAbsenceRetard,
							),
						);
						break;
					}
				}
			}
		}
	}
	_evenementSurMenuContextuelListe(aIdColonne, D, aLigne) {
		this._saisieEnCours = { idColonne: aIdColonne, ligne: aLigne, donnee: D };
		if (aLigne) {
			switch (aLigne.getNumero()) {
				case DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
					.GenreCommandeMenu.RemplacerCertificat:
					this._actualiserApresSaisie(D);
					break;
				case DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
					.GenreCommandeMenu.SupprimerCertificat: {
					D.avecCertificat = false;
					const lElement = D.certificat;
					if (lElement) {
						if (lElement.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
							this.listeDocuments.remove(
								this.listeDocuments.getIndiceParNumeroEtGenre(
									lElement.getNumero(),
								),
							);
						} else {
							lElement.suivi = new ObjetElement_1.ObjetElement(
								"",
								D.getNumero(),
							);
							this.listeDocuments.addElement(lElement);
						}
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
					this._actualiserApresSaisie(D);
					break;
				}
				case DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
					.GenreCommandeMenu.ConsulterCertificat:
					window.open(
						ObjetChaine_1.GChaine.creerUrlBruteLienExterne(D.certificat, {
							genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
						}),
					);
					break;
				case DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
					.GenreCommandeMenu.ReglerDossier:
					D.regle = !D.regle;
					this._actualiserApresSaisie(D);
					break;
				case DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
					.GenreCommandeMenu.CreerSuivi:
					this._ouvrirFenetreSaisie(D, true);
					return;
				case DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
					.GenreCommandeMenu.ModifierMotif:
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionMotif_1.ObjetFenetre_SelectionMotif,
						{
							pere: this,
							evenement: function (aGenreBouton, aMotif) {
								this._evenementFenetreListe(true, aGenreBouton, aMotif, true);
							},
						},
					).setDonnees(
						D.getGenre() !== Enumere_Ressource_1.EGenreRessource.Retard
							? this.listeMotifsAbsenceEleve
							: this.listeMotifsRetard,
						false,
					);
					break;
			}
		}
	}
	_evenementSurCreationSuivi(D) {
		this._ouvrirFenetreSaisie(D, true);
	}
	_actualiserApresSaisie(aDonnee) {
		aDonnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.getInstance(this.identListe).actualiser();
	}
	_ouvrirFenetreSaisie(aDonnee, aEnvoiParDefaut) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieSuivisAbsenceRetard_1.ObjetFenetre_SaisieSuivisAbsenceRetard,
			{
				pere: this,
				evenement: this._evenementSurFenetreSaisie.bind(this, aDonnee),
			},
		).setDonnees(
			aEnvoiParDefaut,
			this.listeMedias,
			this.listeSuivisAbsenceRetard,
		);
	}
	valider(aCallback) {
		this.setEtatSaisie(false);
		const lRequete =
			new ObjetRequeteSaisieSuivisAbsenceRetard_1.ObjetRequeteSaisieSuivisAbsenceRetard(
				this,
				aCallback ? aCallback : this._requetePage,
			);
		lRequete.addUpload({ listeFichiers: this.listeDocuments });
		lRequete.lancerRequete(
			this.eleve,
			this.listeSuivisAbsenceRetard,
			this.listeMedias,
			this.listeDocuments,
		);
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.date,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Date"),
			taille: 49,
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.nature,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Nature"),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.heure,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Heure"),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.lettre,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Lettre"),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.admin,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Admin"),
			hint: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.AdminLong"),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 100, 150),
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.RespEl,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuivisAR.ResponsableEleve",
			),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 100, 150),
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.commentaire,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.Commentaire"),
			taille: ObjetListe_1.ObjetListe.initColonne(100, 40),
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.certificat,
			titre: {
				getLibelleHtml: () =>
					IE.jsx.str("i", {
						class: "icon_piece_jointe",
						role: "img",
						"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
							"SuivisAR.Justificatif",
						),
					}),
			},
			taille: 25,
		});
		lColonnes.push({
			id: DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.colonnes.RA,
			titre: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.RA"),
			hint: ObjetTraduction_1.GTraductions.getValeur("SuivisAR.RALong"),
			taille: 25,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			scrollHorizontal: true,
			nonEditable: !(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSuiviAbsenceRetard,
			),
		});
	}
	_reponseRequetePageSuivisAbsenceRetard(
		aListeSuivisAbsenceRetard,
		aListePersonnels,
		aListeInterlocuteurs,
		aListeMedias,
		aListeMotifsAbsenceEleve,
		aListeMotifsRetard,
		aMessage,
	) {
		this.listeSuivisAbsenceRetard = aListeSuivisAbsenceRetard;
		this.listePersonnels = aListePersonnels;
		this.listeInterlocuteurs = aListeInterlocuteurs;
		this.listeMedias = aListeMedias;
		this.listeMotifsAbsenceEleve = aListeMotifsAbsenceEleve;
		this.listeMotifsRetard = aListeMotifsRetard;
		if (aMessage) {
			this.effacer(aMessage);
		} else {
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard(
					this.listeSuivisAbsenceRetard,
					this._evenementSurMenuContextuelListe.bind(this),
					this._evenementSurCreationSuivi.bind(this),
				).setOptions({ saisie: this.saisieDocument.bind(this) }),
			);
		}
	}
	saisieDocument(aDonnees, aListeFichiersUpload) {
		if (
			aDonnees.genreSaisie ===
			DonneesListe_SuivisAbsenceRetard_1.DonneesListe_SuivisAbsenceRetard
				.genreAction.ModifierDocument
		) {
			const lElement = aDonnees.article.certificat;
			lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			lElement.suivi = new ObjetElement_1.ObjetElement(
				"",
				aDonnees.article.getNumero(),
			);
			this.listeDocuments.addElement(aDonnees.article.certificat);
		}
		this.listeDocuments.add(aListeFichiersUpload);
		aDonnees.article.avecCertificat = true;
		aDonnees.article.certificat = aListeFichiersUpload.get(0);
		this._actualiserApresSaisie(aDonnees.article);
		this.setEtatSaisie(true);
	}
	_requetePage() {
		this.listeDocuments = new ObjetListeElements_1.ObjetListeElements();
		new ObjetRequetePageSuivisAbsenceRetard_1.ObjetRequetePageSuivisAbsenceRetard(
			this,
			this._reponseRequetePageSuivisAbsenceRetard,
		).lancerRequete(this.eleve, this.dateDebut, this.dateFin, this.absence);
	}
	_evenementFenetreListe(
		aSurSaisieMotif,
		aGenreBouton,
		aSelection,
		aAvecChangementListe,
	) {
		if (aGenreBouton === 1) {
			if (this._saisieEnCours) {
				const lDonnee = this._saisieEnCours.donnee;
				if (aSurSaisieMotif) {
					if (
						aSelection &&
						aSelection instanceof ObjetElement_1.ObjetElement &&
						aSelection.getNumero()
					) {
						lDonnee.motif = MethodesObjet_1.MethodesObjet.dupliquer(aSelection);
						lDonnee.regle = !!aSelection.reglementAuto;
					} else {
						delete lDonnee.motif;
					}
				} else {
					switch (this._saisieEnCours.idColonne) {
						case DonneesListe_SuivisAbsenceRetard_1
							.DonneesListe_SuivisAbsenceRetard.colonnes.admin: {
							const lAdmin = this.listePersonnels.get(aSelection);
							lDonnee.personnel = null;
							if (lAdmin.existeNumero()) {
								lDonnee.personnel = lAdmin;
							}
							break;
						}
						case DonneesListe_SuivisAbsenceRetard_1
							.DonneesListe_SuivisAbsenceRetard.colonnes.RespEl: {
							const lResponsable = this.listeInterlocuteurs.get(aSelection);
							if (!lResponsable.existeNumero()) {
								lDonnee.__surEditionAutre = true;
								const lInstanceListe = this.getInstance(this.identListe);
								const lNumeroColonne = lInstanceListe
									.getDonneesListe()
									.getNumeroColonneDId(this._saisieEnCours.idColonne);
								lInstanceListe.demarrerEditionSurCellule(
									this._saisieEnCours.ligne,
									lNumeroColonne,
								);
								delete this._saisieEnCours;
								return;
							}
							lDonnee.respEleve = lResponsable.getLibelle();
							break;
						}
						case DonneesListe_SuivisAbsenceRetard_1
							.DonneesListe_SuivisAbsenceRetard.colonnes.nature:
							lDonnee.media = this.listeMedias.get(aSelection);
							break;
					}
				}
				this._actualiserApresSaisie(lDonnee);
				delete this._saisieEnCours;
			}
		} else {
			if (aAvecChangementListe) {
				switch (this._saisieEnCours.idColonne) {
					case DonneesListe_SuivisAbsenceRetard_1
						.DonneesListe_SuivisAbsenceRetard.colonnes.nature:
						this.getInstance(this.identListe).actualiser();
						break;
				}
			}
		}
	}
	_evenementSurFenetreSaisie(aSuiviPere, aSurValidation, aMedia) {
		if (aSurValidation && aMedia) {
			const lSuivi = new ObjetElement_1.ObjetElement();
			lSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			const lDate = new Date();
			lSuivi.date = ObjetDate_1.GDate.getDateBornee(lDate);
			lSuivi.date.setHours(lDate.getHours(), lDate.getMinutes(), 0, 0);
			lSuivi.pere = aSuiviPere;
			lSuivi.media = aMedia;
			lSuivi.libelleLettre = "";
			lSuivi.commentaire = "";
			lSuivi.personnel = null;
			lSuivi.respEleve = "";
			this.listeInterlocuteurs.parcourir((aInterlocuteur) => {
				if (aInterlocuteur.responsableLegal) {
					lSuivi.respEleve = aInterlocuteur.getLibelle();
					return false;
				}
			});
			lSuivi.regle = false;
			this.listeSuivisAbsenceRetard.addElement(lSuivi);
			aSuiviPere.estDeploye = true;
			aSuiviPere.estUnDeploiement = true;
			this._actualiserApresSaisie(lSuivi);
		} else {
			this.getInstance(this.identListe).actualiser();
		}
	}
}
exports.InterfaceSuivisAbsenceRetard = InterfaceSuivisAbsenceRetard;
