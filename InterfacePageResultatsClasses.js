exports.InterfacePageResultatsClasses = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequetePageResultatsClasses_1 = require("ObjetRequetePageResultatsClasses");
const Invocateur_1 = require("Invocateur");
const Invocateur_2 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetFenetre_ParamResultats_1 = require("ObjetFenetre_ParamResultats");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_ResultatsClasse_1 = require("DonneesListe_ResultatsClasse");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetElement_1 = require("ObjetElement");
const Enumere_ResultatsClasse_1 = require("Enumere_ResultatsClasse");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetFenetre_MoyenneTableauResultats_1 = require("ObjetFenetre_MoyenneTableauResultats");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
class InterfacePageResultatsClasses extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		if (this.etatUtilisateurSco.infosSupp) {
			let lInfosSupp = this.getInfosSupp();
			if (!lInfosSupp || !lInfosSupp.resultatsClasse_referentiel) {
				lInfosSupp = {
					resultatsClasse_referentiel: {
						avecMediane: false,
						avecHaute: false,
						avecBasse: false,
						avecAbsences: false,
						avecCompetences: true,
						avecSousServices: true,
						uniquementSousServices: false,
						matieresEquivalence: false,
						parametresBulletin: true,
						masquerSansNotes: false,
						avecCouleurMoyenne: false,
					},
				};
				this.etatUtilisateurSco.infosSupp["InterfacePageResultatsClasses"] =
					lInfosSupp;
			}
		}
		this.titreNom = ObjetTraduction_1.GTraductions.getValeur(
			"resultatsClasses.titres.nom",
		);
		this.avecGestionNotation = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
		);
		this.typeMoyenneSelectionnee =
			ObjetRequetePageResultatsClasses_1.ObjetRequetePageResultatsClasses.TypeMoyenneAffichee.Calculee;
	}
	getInfosSupp() {
		return this.etatUtilisateurSco.getInfosSupp(
			"InterfacePageResultatsClasses",
		);
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
		this.identComboTypeMoyenne = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementCombo,
			this.initialiserCombo,
		);
		this.identPage = this.add(ObjetListe_1.ObjetListe, this.eventListe);
		this.identFenetreParamResultats = this.addFenetre(
			ObjetFenetre_ParamResultats_1.ObjetFenetre_ParamResultats,
			this._evntFenetreParamResultats,
			this._initFenetreParamResultats,
		);
		this.identFenetreMethodeCalculMoyenne = this.add(
			ObjetFenetre_MoyenneTableauResultats_1.ObjetFenetre_MoyenneTableauResultats,
			null,
			this.initialiserMethodeCalculMoyenne,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identPage;
		this.avecBandeau = true;
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({
			html:
				'<span style="display:none;" id="' +
				this.Nom +
				'_LabelMoyenne">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.moyenne",
				) +
				" : </span>",
		});
		this.AddSurZone.push(this.identComboTypeMoyenne);
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				this.jsxModeleBoutonOptionsAffichage.bind(this),
			),
		});
	}
	jsxModeleBoutonOptionsAffichage() {
		return {
			event: () => {
				const lFenetreParam = this.getInstance(this.identFenetreParamResultats);
				const lResultatReferentiel =
					this.getInfosSupp().resultatsClasse_referentiel;
				lFenetreParam.setDonnees({
					avecDonneesItalie: this.avecDonneesItalie,
					avecMediane: lResultatReferentiel.avecMediane,
					avecHaute: lResultatReferentiel.avecHaute,
					avecBasse: lResultatReferentiel.avecBasse,
					avecAbsences: lResultatReferentiel.avecAbsences,
					avecCompetences: lResultatReferentiel.avecCompetences,
					avecSousServices: lResultatReferentiel.avecSousServices,
					uniquementSousServices: lResultatReferentiel.uniquementSousServices,
					matieresEquivalence: lResultatReferentiel.matieresEquivalence,
					parametresBulletin: lResultatReferentiel.parametresBulletin,
					masquerSansNotes: lResultatReferentiel.masquerSansNotes,
					avecCouleurMoyenne: lResultatReferentiel.avecCouleurMoyenne,
				});
				lFenetreParam.afficher();
			},
			getSelection: () => {
				return this.getInstance(this.identFenetreParamResultats).estAffiche();
			},
		};
	}
	initialiserMethodeCalculMoyenne(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.TitreFenetreCalculMoyenne",
			),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
			largeurMin: 600,
			hauteurMin: 150,
		});
	}
	eventListe(aParametres) {
		if (
			aParametres.idColonne ===
				DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.moyenneGenerale ||
			aParametres.declarationColonne.estMoyenneRegroupement
		) {
			const lSource = aParametres.declarationColonne.estMoyenneRegroupement
				? aParametres.article.notesEleve.get(
						aParametres.declarationColonne.rangColonne,
					)
				: aParametres.article;
			const lParametresCalcul = {
				libelleEleve: aParametres.article.nom,
				html: lSource.FormuleHTML,
				legende: lSource.FormuleLegende,
				wai: lSource.FormuleWAI,
				titreFenetre: lSource.chaineTitre,
				moyenneNette: true,
			};
			if (!!lSource.resultatAffiche) {
				this.getInstance(this.identFenetreMethodeCalculMoyenne).setDonnees(
					lParametresCalcul,
				);
			}
		}
	}
	initialiserCombo(aInstance) {
		aInstance.setOptionsObjetSaisie({ longueur: 160 });
		const listeTypesMoyennes = new ObjetListeElements_1.ObjetListeElements();
		listeTypesMoyennes.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.options.calculee",
				),
				ObjetRequetePageResultatsClasses_1.ObjetRequetePageResultatsClasses
					.TypeMoyenneAffichee.Calculee,
			),
		);
		listeTypesMoyennes.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.options.proposee",
				),
				ObjetRequetePageResultatsClasses_1.ObjetRequetePageResultatsClasses
					.TypeMoyenneAffichee.Proposee,
			),
		);
		listeTypesMoyennes.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.options.deliberee",
				),
				ObjetRequetePageResultatsClasses_1.ObjetRequetePageResultatsClasses
					.TypeMoyenneAffichee.Deliberee,
			),
		);
		aInstance.setDonnees(listeTypesMoyennes);
		aInstance.setVisible(false);
	}
	evenementCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (aParams.element.getNumero() !== this.typeMoyenneSelectionnee) {
				this.typeMoyenneSelectionnee = aParams.element.getNumero();
				const lResultatReferentiel =
					this.getInfosSupp().resultatsClasse_referentiel;
				const lParams = {
					classe: this.ressource,
					periode: this.periode,
					absences: lResultatReferentiel.avecAbsences,
					competences: lResultatReferentiel.avecCompetences,
					afficherSousServices: lResultatReferentiel.avecSousServices,
					afficherSeulementSousServices:
						lResultatReferentiel.uniquementSousServices,
					masquerSansNotes: lResultatReferentiel.masquerSansNotes,
					avecCouleurMoyenne: lResultatReferentiel.avecCouleurMoyenne,
					typeCalculMoyenne: aParams.element.Numero,
				};
				new ObjetRequetePageResultatsClasses_1.ObjetRequetePageResultatsClasses(
					this,
					this.actionSurRecupererDonnees,
				).lancerRequete(lParams);
			}
		}
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
		]);
	}
	evenementSurDernierMenuDeroulant() {
		Invocateur_2.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		this.ressource = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		this.periode = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		const lResultatReferentiel =
			this.getInfosSupp().resultatsClasse_referentiel;
		const lParams = {
			classe: this.ressource,
			periode: this.periode,
			absences: lResultatReferentiel.avecAbsences,
			competences: lResultatReferentiel.avecCompetences,
			afficherSousServices: lResultatReferentiel.avecSousServices,
			afficherSeulementSousServices:
				lResultatReferentiel.uniquementSousServices,
			masquerSansNotes: lResultatReferentiel.masquerSansNotes,
			avecCouleurMoyenne: lResultatReferentiel.avecCouleurMoyenne,
			typeCalculMoyenne: this.typeMoyenneSelectionnee,
		};
		new ObjetRequetePageResultatsClasses_1.ObjetRequetePageResultatsClasses(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(lParams);
	}
	actionSurRecupererDonnees(aDonneesAffichage) {
		if (aDonneesAffichage) {
			this.donneesAffichage =
				MethodesObjet_1.MethodesObjet.dupliquer(aDonneesAffichage);
			this.afficherBandeau(true);
			this.avecDonneesItalie = !!aDonneesAffichage.avecDonneesItalie;
			Invocateur_2.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				this.getParametresPDF.bind(this),
			);
		}
		this.initialiserListe(aDonneesAffichage);
		const lListeMiseEnForme = new ObjetListeElements_1.ObjetListeElements();
		aDonneesAffichage.resultats.setTri([
			ObjetTri_1.ObjetTri.init("ressource"),
			ObjetTri_1.ObjetTri.init("periode"),
		]);
		aDonneesAffichage.resultats.trier();
		let eltCourant;
		aDonneesAffichage.resultats.parcourir((aElement) => {
			if (aElement.lignePere === 0) {
				aElement.estUnDeploiement = true;
				aElement.estDeploye = false;
				eltCourant = aElement;
			} else {
				aElement.pere = eltCourant;
			}
			lListeMiseEnForme.addElement(aElement);
		});
		this.listeMiseEnForme = lListeMiseEnForme;
		this.genrePositonnementClasse = aDonneesAffichage.genrePositonnementClasse;
		this.moyenneGeneraleClasse = {
			generale: aDonneesAffichage.moyenneGeneraleClasse,
			haute: aDonneesAffichage.moyenneHauteClasse,
			basse: aDonneesAffichage.moyenneBasseClasse,
			mediane: aDonneesAffichage.moyenneMedianeClasse,
		};
		this.moyennes = aDonneesAffichage.moyennes;
		this.anneeComplete = aDonneesAffichage.anneeComplete;
		this.getInstance(this.identComboTypeMoyenne).setSelection(
			this.typeMoyenneSelectionnee,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_LabelMoyenne",
			this.avecDonneesItalie,
		);
		if (this.avecDonneesItalie) {
			this.afficherBandeau(true);
			this.getInstance(this.identComboTypeMoyenne).setVisible(true);
		}
		const lListeColonneTotal = [
			Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse,
			Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneGroupe,
		];
		const lResultatReferentiel =
			this.getInfosSupp().resultatsClasse_referentiel;
		if (lResultatReferentiel) {
			if (lResultatReferentiel.avecMediane) {
				lListeColonneTotal.push(
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteMediane,
				);
			}
			if (lResultatReferentiel.avecHaute) {
				lListeColonneTotal.push(
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteHaute,
				);
			}
			if (lResultatReferentiel.avecBasse) {
				lListeColonneTotal.push(
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteBasse,
				);
			}
		}
		this.getInstance(this.identPage).setDonnees(
			new DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse(
				lListeMiseEnForme,
				{
					moyennes: aDonneesAffichage.moyennes,
					moyenneClasse: this.moyenneGeneraleClasse,
					anneeComplete: aDonneesAffichage.anneeComplete,
					listeTotaux: lListeColonneTotal,
					avecGestionNotation: this.avecGestionNotation,
					avecDonneesItalie: this.avecDonneesItalie,
					genrePositonnementClasse: this.genrePositonnementClasse,
				},
			),
		);
		this.getInstance(this.identPage)
			.getDonneesListe()
			.setTypeMoyenne(this.typeMoyenneSelectionnee);
		GEtatUtilisateur.setTriListe({
			liste: this.getInstance(this.identPage),
			tri: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.nom,
		});
	}
	initialiserListe(aList) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.ressource,
			taille: 1,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.lignePere,
			taille: 1,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.deploye,
			taille: 1,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.nom,
			titre: {
				getLibelleHtml: () => {
					const lJsxNodeColonneNom = () => {
						return {
							event: (aEvent) => {
								const lListe = this.getInstance(this.identPage);
								aEvent.stopPropagation();
								ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
									pere: this,
									initCommandes: (aMenu) => {
										aMenu.add(
											ObjetTraduction_1.GTraductions.getValeur(
												"resultatsClasses.titres.nom",
											),
											true,
											() => {
												lListe.getDonneesListe().afficherNom(true);
												this.titreNom =
													ObjetTraduction_1.GTraductions.getValeur(
														"resultatsClasses.titres.nom",
													);
												this.initialiserListe(this.donneesAffichage);
												lListe.setDonnees(lListe.getDonneesListe());
											},
										);
										aMenu.add(
											ObjetTraduction_1.GTraductions.getValeur(
												"resultatsClasses.titres.numeroNational",
											),
											true,
											() => {
												lListe.getDonneesListe().afficherNom(false);
												this.titreNom =
													ObjetTraduction_1.GTraductions.getValeur(
														"resultatsClasses.titres.numeroNational",
													);
												this.initialiserListe(this.donneesAffichage);
												lListe.setDonnees(lListe.getDonneesListe());
											},
										);
									},
								});
							},
						};
					};
					return IE.jsx.str(
						"ie-bouton",
						{ "ie-model": lJsxNodeColonneNom, "aria-haspopup": "menu" },
						this.titreNom,
					);
				},
				title: this.titreNom,
			},
			taille: 170,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.neLe,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"resultatsClasses.titres.neLe",
			),
			taille: 65,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.sexe,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.sexe",
				),
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.sexeCourt",
				),
				titleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.sexe",
				),
			},
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.redoublant,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.redoublantLong",
				),
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.redoublantCourt",
				),
				titleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.redoublantLong",
				),
			},
			taille: 40,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.projetsAccompagnement,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.projetAccLong",
				),
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.projetAccCourt",
				),
				titleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.projetAccLong",
				),
			},
			taille: 80,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.dernierEtablissement,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.dernierEtabLong",
				),
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.dernierEtabCourt",
				),
				titleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.dernierEtabLong",
				),
			},
			taille: 120,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.absences,
			titre: this.avecDonneesItalie
				? {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.volumeHoraire",
						),
					}
				: {
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.absenceCourt",
						),
						titleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.absenceLong",
						),
					},
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.nombreRetards,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.nbRetards",
				),
				libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.nbRetards",
				),
			},
			taille: 45,
		});
		lColonnes.push({
			id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
				.rang,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"resultatsClasses.titres.rang",
			),
			taille: 40,
		});
		if (this.avecDonneesItalie) {
			lColonnes.push({
				id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.mention,
				titre: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.mention",
						),
					},
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.moyenneCourt",
						),
					},
				],
				taille: 100,
			});
			lColonnes.push({
				id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.mentionV,
				titre: [
					{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.um",
						),
					},
				],
				taille: 30,
			});
			lColonnes.push({
				id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.credits,
				titre: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.credits",
						),
					},
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.moyenneCourt",
						),
					},
				],
				taille: 70,
			});
			lColonnes.push({
				id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.creditsV,
				titre: [
					{ libelle: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche },
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"resultatsClasses.titres.um",
						),
					},
				],
				taille: 30,
			});
			lColonnes.push({
				id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.validite,
				titre: {
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"resultatsClasses.titres.validite",
					),
				},
				taille: 60,
			});
			lColonnes.push({
				id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.creditsTotaux,
				titre: {
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"resultatsClasses.titres.creditsTotaux",
					),
				},
				taille: 60,
			});
		}
		if (this.avecGestionNotation) {
			lColonnes.push({
				id: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.moyenneGenerale,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"resultatsClasses.titres.moyenne",
				),
				taille: 60,
			});
		}
		const lAvecSousServices =
			this.getInfosSupp().resultatsClasse_referentiel.uniquementSousServices;
		const lAvecParamsBulletin = true;
		let lAvecTitre1 = false;
		for (let i = 0; i < aList.titresColonnes.count(); i++) {
			lAvecTitre1 =
				lAvecTitre1 ||
				(aList.titresColonnes.get(i).ColMoy &&
					aList.titresColonnes.get(i).ColMoy.titre1 !== " ");
		}
		for (let i = 0; i < aList.titresColonnes.count(); i++) {
			const lColonneCourante = aList.titresColonnes.get(i);
			for (let j = 0; j <= 2; j++) {
				const titre = [];
				let lColonneTitre;
				let lTypeColonne;
				switch (j) {
					case 0: {
						lColonneTitre = lColonneCourante.ColMoy;
						lTypeColonne =
							DonneesListe_ResultatsClasse_1.TypeColonneDyn.Moyenne;
						break;
					}
					case 1:
						lColonneTitre = lColonneCourante.ColPos;
						lTypeColonne =
							DonneesListe_ResultatsClasse_1.TypeColonneDyn.Positionnement;
						break;
					case 2:
						lColonneTitre = lColonneCourante.ColAbs;
						lTypeColonne =
							DonneesListe_ResultatsClasse_1.TypeColonneDyn.Absence;
						break;
					default:
				}
				if (!!lColonneTitre && lColonneTitre.visible) {
					const lTitreLigne1 = lColonneTitre.titre1;
					const lTitreLigne2 = lColonneTitre.titre2;
					const lTitreLigne3 = lColonneTitre.titre3;
					const couleurFond = lColonneTitre.couleur;
					const lItalique = !lColonneTitre.estPere ? "Italique " : "";
					const libelleHtml =
						lTitreLigne2 !== ""
							? '<div class="NoWrap ' +
								lItalique +
								'" style="' +
								ObjetStyle_1.GStyle.composeCouleurBordure(couleurFond) +
								'">' +
								lTitreLigne2 +
								"</div>"
							: "";
					let { hint } = lColonneTitre;
					hint = hint.replace(/&gt;/g, ">");
					hint = hint.replace(/&lt;/g, "<");
					hint = hint.replace(/&quot;/g, '"');
					const lHintLigne2 =
						lTypeColonne ===
						DonneesListe_ResultatsClasse_1.TypeColonneDyn.Absence
							? ObjetTraduction_1.GTraductions.getValeur(
									"resultatsClasses.titres.absenceParServiceLong",
								)
							: lTypeColonne ===
									DonneesListe_ResultatsClasse_1.TypeColonneDyn.Positionnement
								? ObjetTraduction_1.GTraductions.getValeur(
										"resultatsClasses.titres.positionnement",
									)
								: hint;
					if (lColonneTitre.estMoyenneRegroupement) {
						if (lAvecTitre1 && lTitreLigne1 !== "") {
							titre.push({ libelleHtml: lTitreLigne1, titleHtml: hint });
						}
						titre.push({ libelle: lTitreLigne3, titleHtml: hint });
					} else if (lAvecSousServices || lAvecParamsBulletin) {
						if (lAvecTitre1) {
							titre.push({ libelle: lTitreLigne1, avecFusionColonne: true });
						}
						titre.push({
							libelleCSV: lTitreLigne2,
							libelleHtml: libelleHtml,
							avecFusionColonne: lColonneTitre.estPere,
							titleHtml: hint,
						});
						if (!lAvecSousServices) {
							titre.push({
								libelleCSV: lTitreLigne3,
								libelle: lTitreLigne3,
								titleHtml: lHintLigne2,
							});
						}
					} else {
						titre.push({
							libelleHtml: libelleHtml,
							avecFusionColonne: lColonneTitre.estPere,
							titleHtml: hint,
						});
						titre.push({ libelle: lTitreLigne3, titleHtml: hint });
					}
					lColonnes.push({
						id:
							DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse
								.colonnes.prefixeColDyn +
							"_" +
							i +
							"_" +
							j,
						estPere: lColonneTitre.estPere,
						rangColonne: i,
						typeColonne: lTypeColonne,
						titre: titre,
						estMoyenneRegroupement: lColonneTitre.estMoyenneRegroupement,
						taille: 50,
					});
				}
			}
		}
		const lBoutonsListe = [];
		if (
			this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			).getGenre() === 1
		) {
			lBoutonsListe.push({
				genre: ObjetListe_1.ObjetListe.typeBouton.deployer,
			});
		}
		lBoutonsListe.push(
			{ genre: ObjetListe_1.ObjetListe.typeBouton.exportCSV },
			{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
		);
		this.getInstance(this.identPage).setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: [
				DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.ressource,
				DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.lignePere,
				DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse.colonnes
					.deploye,
			],
			colonnesTriables: true,
			avecLigneCreation: false,
			scrollHorizontal: this.avecDonneesItalie ? 17 : 11,
			avecLigneTotal: this.avecGestionNotation,
			hauteurAdapteContenu: true,
			boutons: lBoutonsListe,
			ariaLabel: () => {
				var _a, _b;
				return `${this.etatUtilisateurSco.getLibelleLongOnglet()} ${((_a = this.etatUtilisateurSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Classe)) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${((_b = this.etatUtilisateurSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Periode)) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ""}`.trim();
			},
		});
	}
	getParametresPDF() {
		const lResultatReferentiel =
			this.getInfosSupp().resultatsClasse_referentiel;
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ResultatsClasse,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			typeMoyenne: this.typeMoyenneSelectionnee,
			matieresEquivalence: lResultatReferentiel.matieresEquivalence,
			parametresBulletin: lResultatReferentiel.parametresBulletin,
			avecAbsences: lResultatReferentiel.avecAbsences,
			avecSansNotes: lResultatReferentiel.avecCompetences,
			afficherSousServices: lResultatReferentiel.avecSousServices,
			afficherServices: lResultatReferentiel.uniquementSousServices,
			avecMediane: lResultatReferentiel.avecMediane,
			avecBasse: lResultatReferentiel.avecBasse,
			avecHaute: lResultatReferentiel.avecHaute,
			masquerSansNotes: lResultatReferentiel.masquerSansNotes,
			avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
		};
	}
	_initFenetreParamResultats(aInstance) {
		aInstance.setContexte(this.avecDonneesItalie);
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.FenetreParametrage.Titre",
			),
			largeur: 600,
			avecTailleSelonContenu: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_evntFenetreParamResultats(aNumeroBouton, aParametresGrille) {
		const lResultatReferentiel =
			this.getInfosSupp().resultatsClasse_referentiel;
		if (aNumeroBouton === 1) {
			const lListeColonneTotal = [
				Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneClasse,
			];
			if (!!aParametresGrille.avecMediane) {
				lListeColonneTotal.push(
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteMediane,
				);
			}
			if (!!aParametresGrille.avecHaute) {
				lListeColonneTotal.push(
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteHaute,
				);
			}
			if (!!aParametresGrille.avecBasse) {
				lListeColonneTotal.push(
					Enumere_ResultatsClasse_1.EGenreTotalAffiche.noteBasse,
				);
			}
			lListeColonneTotal.push(
				Enumere_ResultatsClasse_1.EGenreTotalAffiche.moyenneGroupe,
			);
			const changerAbsences =
				lResultatReferentiel.avecAbsences !== aParametresGrille.avecAbsences;
			const changerCompetences =
				lResultatReferentiel.avecCompetences !==
				aParametresGrille.avecCompetences;
			const uniquementSousServices =
				lResultatReferentiel.uniquementSousServices !==
				aParametresGrille.uniquementSousServices;
			const avecSousServices =
				lResultatReferentiel.avecSousServices !==
				aParametresGrille.avecSousServices;
			const matieresEquivalence =
				lResultatReferentiel.matieresEquivalence !==
				aParametresGrille.matieresEquivalence;
			const parametresBulletin =
				lResultatReferentiel.parametresBulletin !==
				aParametresGrille.parametresBulletin;
			const masquerSansNotes =
				lResultatReferentiel.masquerSansNotes !==
				aParametresGrille.masquerSansNotes;
			const avecCouleurMoyenne =
				lResultatReferentiel.avecCouleurMoyenne !==
				aParametresGrille.avecCouleurMoyenne;
			if (
				changerAbsences ||
				changerCompetences ||
				uniquementSousServices ||
				avecSousServices ||
				matieresEquivalence ||
				parametresBulletin ||
				masquerSansNotes ||
				avecCouleurMoyenne
			) {
				const lParams = {
					classe: this.ressource,
					periode: this.periode,
					absences: aParametresGrille.avecAbsences,
					competences: aParametresGrille.avecCompetences,
					afficherSousServices: aParametresGrille.avecSousServices,
					afficherSeulementSousServices:
						aParametresGrille.uniquementSousServices,
					masquerSansNotes: aParametresGrille.masquerSansNotes,
					avecCouleurMoyenne: aParametresGrille.avecCouleurMoyenne,
					typeCalculMoyenne: this.typeMoyenneSelectionnee,
				};
				new ObjetRequetePageResultatsClasses_1.ObjetRequetePageResultatsClasses(
					this,
					this.actionSurRecupererDonnees,
				).lancerRequete(lParams);
			} else {
				this.getInstance(this.identPage).setDonnees(
					new DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse(
						this.listeMiseEnForme,
						{
							moyennes: this.moyennes,
							moyenneClasse: this.moyenneGeneraleClasse,
							anneeComplete: this.anneeComplete,
							listeTotaux: lListeColonneTotal,
							avecGestionNotation: this.avecGestionNotation,
							avecDonneesItalie: this.avecDonneesItalie,
							genrePositonnementClasse: this.genrePositonnementClasse,
						},
					),
				);
			}
			GEtatUtilisateur.setTriListe({
				liste: this.getInstance(this.identPage),
				tri: DonneesListe_ResultatsClasse_1.DonneesListe_ResultatsClasse
					.colonnes.nom,
			});
		}
		(lResultatReferentiel.avecMediane = aParametresGrille.avecMediane),
			(lResultatReferentiel.avecHaute = aParametresGrille.avecHaute),
			(lResultatReferentiel.avecBasse = aParametresGrille.avecBasse),
			(lResultatReferentiel.avecAbsences = aParametresGrille.avecAbsences),
			(lResultatReferentiel.avecCompetences =
				aParametresGrille.avecCompetences),
			(lResultatReferentiel.avecSousServices =
				aParametresGrille.avecSousServices),
			(lResultatReferentiel.uniquementSousServices =
				aParametresGrille.uniquementSousServices),
			(lResultatReferentiel.matieresEquivalence =
				aParametresGrille.matieresEquivalence),
			(lResultatReferentiel.parametresBulletin =
				aParametresGrille.parametresBulletin),
			(lResultatReferentiel.masquerSansNotes =
				aParametresGrille.masquerSansNotes),
			(lResultatReferentiel.avecCouleurMoyenne =
				aParametresGrille.avecCouleurMoyenne);
	}
}
exports.InterfacePageResultatsClasses = InterfacePageResultatsClasses;
