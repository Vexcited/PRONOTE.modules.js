exports.InterfaceSuiviElevesTutores =
	exports.ObjetRequeteListeAvisProfesseurs =
	exports.ObjetRequeteSuiviElevesTutores =
		void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetListe_1 = require("ObjetListe");
const InterfacePage_1 = require("InterfacePage");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const DonneesListe_SuiviElevesTutores_1 = require("DonneesListe_SuiviElevesTutores");
const DonneesListe_ListeAvisProfesseur_1 = require("DonneesListe_ListeAvisProfesseur");
const ObjetRequeteListeRegimesEleve_1 = require("ObjetRequeteListeRegimesEleve");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_EditionAbsencesNonReglees_1 = require("ObjetFenetre_EditionAbsencesNonReglees");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetRequeteDetailAbsences_1 = require("ObjetRequeteDetailAbsences");
const ObjetFenetre_DetailAbsences_1 = require("ObjetFenetre_DetailAbsences");
class ObjetRequeteSuiviElevesTutores extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteSuiviElevesTutores = ObjetRequeteSuiviElevesTutores;
CollectionRequetes_1.Requetes.inscrire(
	"SuiviElevesTutores",
	ObjetRequeteSuiviElevesTutores,
);
class ObjetRequeteListeAvisProfesseurs extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
exports.ObjetRequeteListeAvisProfesseurs = ObjetRequeteListeAvisProfesseurs;
CollectionRequetes_1.Requetes.inscrire(
	"ListeAvisProfesseurs",
	ObjetRequeteListeAvisProfesseurs,
);
class InterfaceSuiviElevesTutores extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.interfaceEspace = lApplicationSco.getInterfaceEspace();
		this.ids = {
			zoneDetailSuiviEleve: "ZoneDetailSuiviEleve",
			contenuDetailEleve: "ContenuDetailEleve",
			messageInformatif: "MessageInformatif",
		};
		this.cacheDonneesEleve = {};
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant.bind(this),
			this._initialiserTripleCombo,
		);
		this.identListeEleves = this.add(
			ObjetListe_1.ObjetListe,
			this.surEvenementListeEleves.bind(this),
			this.initListeEleves,
		);
		this.identListeAvisProf = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeAvisProfesseur,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identListeEleves;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnNaviguerReleveNotes: {
				event() {
					aInstance.naviguerVersPage(Enumere_Onglet_1.EGenreOnglet.Releve);
				},
				getHint() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"SuiviElevesTutores.Navigation.NaviguerVersReleveDeNotes",
					);
				},
			},
			btnNaviguerBulletinNotes: {
				event() {
					aInstance.naviguerVersPage(Enumere_Onglet_1.EGenreOnglet.Bulletins);
				},
				getHint() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"SuiviElevesTutores.Navigation.NaviguerVersBulletinDeNotes",
					);
				},
			},
		});
	}
	naviguerVersPage(aOngletDestination) {
		this.etatUtilisateurSco.setPage({ Onglet: aOngletDestination });
		if (this.etatUtilisateurSco.getGenreOnglet()) {
			this.interfaceEspace.changementManuelOnglet(
				this.etatUtilisateurSco.getGenreOnglet(),
			);
		}
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div id="InterfaceSuiviElevesTutores">',
			'<div id="ZoneListeEleves">',
			'<div id="',
			this.getNomInstance(this.identListeEleves),
			'"></div>',
			"</div>",
			'<div id="',
			this.ids.zoneDetailSuiviEleve,
			'" style="display: none;">',
			'<div id="',
			this.ids.contenuDetailEleve,
			'" style="height: 100%; display: none;">',
			this.composeDetailSuiviEleve(),
			"</div>",
			'<div id="',
			this.ids.messageInformatif,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("Message")[
				Enumere_Message_1.EGenreMessage.SelectionEleve
			],
			"</div>",
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	_effacerCacheDonnees() {
		this.cacheDonneesEleve = {};
	}
	_initialiserTripleCombo(aInstance) {
		aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Periode]);
	}
	evenementSurDernierMenuDeroulant() {
		this._effacerCacheDonnees();
		new ObjetRequeteSuiviElevesTutores(
			this,
			this.actionSurRecupererDonnees.bind(this),
		).lancerRequete({
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
		});
	}
	actionSurRecupererDonnees(aJSON) {
		$("#" + this.ids.messageInformatif).show();
		$("#" + this.ids.contenuDetailEleve).hide();
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		const lListeElevesTutores = aJSON.listeLignes;
		if (!!lListeElevesTutores && lListeElevesTutores.count() > 0) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				this._getParametresPDF.bind(this),
			);
			$("#" + this.ids.zoneDetailSuiviEleve).show();
			const lListeEleves = this.getInstance(this.identListeEleves);
			this._updateColonnesDeListeEleves(
				lListeEleves,
				aJSON.listeColonnesMatieres,
			);
			let lLigneASelectionnee;
			const lEleveNavigation = this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			);
			if (!!lEleveNavigation && lEleveNavigation.existeNumero()) {
				lLigneASelectionnee =
					lListeElevesTutores.getIndiceParElement(lEleveNavigation);
			}
			const lDernierPereDUnNiveau = {};
			lListeElevesTutores.parcourir((D) => {
				if (!!D.estUnCumul) {
					D.estUnDeploiement = true;
					D.estDeploye = true;
					lDernierPereDUnNiveau[D.niveauProfondeur] = D;
				}
				if (D.niveauProfondeur > 1) {
					D.pere = lDernierPereDUnNiveau[D.niveauProfondeur - 1];
				}
			});
			lListeEleves.setDonnees(
				new DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores(
					lListeElevesTutores,
				),
				lLigneASelectionnee,
			);
		} else {
			$("#" + this.ids.zoneDetailSuiviEleve).hide();
			this.evenementAfficherMessage(
				Enumere_Message_1.EGenreMessage.AucunElevePourClasse,
			);
		}
	}
	_updateColonnesDeListeEleves(aInstanceListe, aListeColonnesMatiere) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.nom,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.Nom",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.prenom,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.Prenom",
			),
			taille: 90,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.classe,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.Classe",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.dateNaissance,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.DateNaissance",
			),
			taille: 65,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.moyenneG,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.MoyGen",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.HintMoyGen",
			),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.moyenneTroncCommun,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.MoyTroncCommun",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.HintMoyTroncCommun",
			),
			taille: 60,
		});
		if (!!aListeColonnesMatiere) {
			aListeColonnesMatiere.parcourir((D, aIndex) => {
				lColonnes.push({
					id:
						DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
							.colonnes.prefixeMatieres + aIndex,
					titre: D.getLibelle(),
					hint: D.hintColonne || "",
					taille: 60,
					matiereConcernee: !!D.matiere ? D.matiere : D.matiereGEP,
				});
			});
		}
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.absences,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.Absences",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.HintAbsences",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.retards,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.Retards",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.HintRetards",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.punitions,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.Punitions",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.HintPunitions",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
				.colonnes.sanctions,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.Sanctions",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.ListeEleves.HintSanctions",
			),
			taille: 50,
		});
		aInstanceListe.setOptionsListe({
			colonnes: lColonnes,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
	surEvenementListeEleves(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (
					aParametres.article.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Eleve
				) {
					this.etatUtilisateurSco.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
						aParametres.article,
					);
					if (!!aParametres.article.classe) {
						this.etatUtilisateurSco.Navigation.setRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
							aParametres.article.classe,
						);
					}
					if (!!this.cacheDonneesEleve[aParametres.article.getNumero()]) {
						this.surRecuperationListeAvisProfesseurDEleve(
							this.cacheDonneesEleve[aParametres.article.getNumero()],
						);
					} else {
						new ObjetRequeteListeAvisProfesseurs(
							this,
							this.surRecuperationListeAvisProfesseurDEleve.bind(this),
						).lancerRequete({
							periode: this.etatUtilisateurSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Periode,
							),
							eleve: aParametres.article,
						});
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick: {
				let lGenreRessourceVS;
				let lListeElementsVS;
				switch (aParametres.idColonne) {
					case DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
						.colonnes.absences:
						lGenreRessourceVS = Enumere_Ressource_1.EGenreRessource.Absence;
						lListeElementsVS = aParametres.article.listeAbsences;
						break;
					case DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
						.colonnes.retards:
						lGenreRessourceVS = Enumere_Ressource_1.EGenreRessource.Retard;
						lListeElementsVS = aParametres.article.listeRetards;
						break;
					case DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
						.colonnes.punitions:
						lGenreRessourceVS = Enumere_Ressource_1.EGenreRessource.Punition;
						lListeElementsVS = aParametres.article.listePunitions;
						break;
					case DonneesListe_SuiviElevesTutores_1.DonneesListe_SuiviElevesTutores
						.colonnes.sanctions:
						lGenreRessourceVS = Enumere_Ressource_1.EGenreRessource.Sanction;
						lListeElementsVS = aParametres.article.listeSanctions;
						break;
				}
				if (
					!!lGenreRessourceVS &&
					!!lListeElementsVS &&
					lListeElementsVS.count() > 0
				) {
					this._recupererDetailEvenementVS(lGenreRessourceVS, lListeElementsVS);
				}
				break;
			}
		}
	}
	surRecuperationListeAvisProfesseurDEleve(aJSON) {
		const lEleve = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		this.cacheDonneesEleve[lEleve.getNumero()] = aJSON;
		$("#" + this.ids.messageInformatif).hide();
		$("#" + this.ids.contenuDetailEleve).show();
		const lListeAvis = aJSON.listeServices;
		this.getInstance(this.identListeAvisProf).setDonnees(
			new DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur(
				lListeAvis,
			),
		);
	}
	_recupererDetailEvenementVS(aGenreRessourceVS, aListeElementsVS) {
		if (!!aListeElementsVS) {
			aListeElementsVS.setSerialisateurJSON({ ignorerEtatsElements: true });
			if (
				[
					Enumere_Ressource_1.EGenreRessource.Absence,
					Enumere_Ressource_1.EGenreRessource.Retard,
				].includes(aGenreRessourceVS)
			) {
				new ObjetRequeteListeRegimesEleve_1.ObjetRequeteListeRegimesEleve(
					this,
					this._afficherDetailEvenementVSAbsenceRetard.bind(
						this,
						aGenreRessourceVS,
					),
				).lancerRequete({
					avecDetailElts: true,
					genreRessource: aGenreRessourceVS,
					listeElts: aListeElementsVS,
				});
			} else {
				const lEleve = this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				);
				const lClasse = !!lEleve ? lEleve.classe : null;
				if (!!lClasse) {
					const lParam = {
						eleve: lEleve,
						dateDebut: lClasse.dateDebutVS,
						dateFin: lClasse.dateFinVS,
						genreAbsence: aGenreRessourceVS,
					};
					if (
						[
							Enumere_Ressource_1.EGenreRessource.Exclusion,
							Enumere_Ressource_1.EGenreRessource.Punition,
							Enumere_Ressource_1.EGenreRessource.Sanction,
						].includes(aGenreRessourceVS)
					) {
						$.extend(lParam, { listeAbsences: aListeElementsVS });
					}
					new ObjetRequeteDetailAbsences_1.ObjetRequeteDetailAbsences(
						this,
						this._afficherDetailEvenementVSPunitionSanction.bind(
							this,
							aGenreRessourceVS,
						),
					).lancerRequete(lParam);
				}
			}
		}
	}
	_afficherDetailEvenementVSAbsenceRetard(aGenreRessourceVS, aJSON) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionAbsencesNonReglees_1.ObjetFenetre_EditionAbsencesNonReglees,
			{
				pere: this,
				initialiser: function (aInstance) {
					const lEleve = this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					);
					aInstance.setOptionsFenetre({
						modale: false,
						titre: !!lEleve ? lEleve.getLibelle() : "",
					});
					aInstance.setAvecEdition(false);
				},
			},
		);
		lFenetre.setParametres({
			avecDureeAbsence:
				aGenreRessourceVS === Enumere_Ressource_1.EGenreRessource.Absence,
			avecDuree:
				aGenreRessourceVS === Enumere_Ressource_1.EGenreRessource.Retard,
			avecLibelleDateSurPremiereColonne: false,
		});
		let lListe;
		if (aGenreRessourceVS === Enumere_Ressource_1.EGenreRessource.Absence) {
			lListe = aJSON.listeAbsences;
		} else {
			lListe = aJSON.listeRetards;
		}
		if (!!lListe) {
			lListe.setTri([ObjetTri_1.ObjetTri.init("Position")]);
			lListe.trier(Enumere_TriElement_1.EGenreTriElement.Decroissant);
			lFenetre.setDonnees(lListe);
		}
	}
	_afficherDetailEvenementVSPunitionSanction(aGenreRessourceVS, aJSON) {
		const lEleve = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		const lTitre = [];
		if (!!lEleve) {
			lTitre.push(lEleve.getLibelle());
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailAbsences_1.ObjetFenetre_DetailAbsences,
			{
				pere: this,
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						modale: false,
						largeur: 600,
						hauteur: 350,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
						],
						titre: lTitre.join(""),
					});
				},
			},
		);
		lFenetre.setDonnees(
			null,
			null,
			true,
			lEleve,
			aJSON,
			aGenreRessourceVS,
			false,
		);
		lFenetre.afficher();
	}
	_initialiserListeAvisProfesseur(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur
				.colonnes.matiere,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.Matiere",
			),
			taille: 200,
		});
		lColonnes.push({
			id: DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur
				.colonnes.moyenneEleve,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.MoyEleve",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.HintMoyEleve",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur
				.colonnes.moyenneClasseGroupe,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.MoyRef",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.HintMoyRef",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur
				.colonnes.avis,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SuiviElevesTutores.AvisProf",
			),
			taille: "100%",
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			colonnesTriables: [
				DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur
					.colonnes.matiere,
				DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur
					.colonnes.moyenneEleve,
				DonneesListe_ListeAvisProfesseur_1.DonneesListe_ListeAvisProfesseur
					.colonnes.moyenneClasseGroupe,
			],
			paddingCelluleLR: 5,
			paddingCelluleTB: 5,
		});
	}
	initListeEleves(aInstance) {
		aInstance.setOptionsListe({ scrollHorizontal: true });
	}
	composeDetailSuiviEleve() {
		const H = [];
		H.push(
			'<div id="ListeBoutonsNavigation" style="height: 7rem; display:flex;">',
		);
		const lListeBoutonsNav = this.getListeBoutonsNavigation();
		for (let i = 0; i < lListeBoutonsNav.length; i++) {
			if (i > 0) {
				H.push("&nbsp;");
			}
			H.push(lListeBoutonsNav[i]);
		}
		H.push("</div>");
		H.push(
			'<div style="height: calc(100% - 7.5rem);" id="',
			this.getNomInstance(this.identListeAvisProf),
			'"></div>',
		);
		return H.join("");
	}
	getListeBoutonsNavigation() {
		const lListeBoutons = [];
		lListeBoutons.push(
			this.getBoutonNavigation({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"SuiviElevesTutores.Navigation.ReleveDeNotes",
				),
				ieModel: "btnNaviguerReleveNotes",
				classeIcone: "icon_releve_notes",
			}),
		);
		lListeBoutons.push(
			this.getBoutonNavigation({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"SuiviElevesTutores.Navigation.BulletinDeNotes",
				),
				ieModel: "btnNaviguerBulletinNotes",
				classeIcone: "icon_bulletin",
			}),
		);
		return lListeBoutons;
	}
	getBoutonNavigation(aParams) {
		const lBouton = [];
		lBouton.push(
			'<ie-bouton class="bouton-carre" ie-model="',
			aParams.ieModel,
			'" ie-icon="',
			aParams.classeIcone,
			'" ie-iconsize="2.4rem" ie-hint="getHint">',
			aParams.libelle,
			"</ie-bouton>",
		);
		return lBouton.join("");
	}
	_getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.SuiviElevesTutores,
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
		};
	}
}
exports.InterfaceSuiviElevesTutores = InterfaceSuiviElevesTutores;
