exports.InterfaceListeRessources_Eleves = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_ListeMemosEleves_1 = require("ObjetFenetre_ListeMemosEleves");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeDomaine_1 = require("TypeDomaine");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteListeRessources_1 = require("ObjetRequeteListeRessources");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const TUtilitaireAffectationElevesGroupe = require("UtilitaireAffectationElevesGroupe");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const MultipleObjetFenetre_GenerationPdfSco = require("ObjetFenetre_GenerationPdfSco");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const InterfaceFicheEleve_1 = require("InterfaceFicheEleve");
const ObjetFenetre_EditionScolarite_1 = require("ObjetFenetre_EditionScolarite");
class InterfaceListeRessources_Eleves extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresInterface = this.applicationSco.getObjetParametres();
		this.estPrimaire = this.etatUtilisateurSco.pourPrimaire();
		this.idListeRattachee = this.Nom + "_listeRattache";
		if (
			GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.moduleAffectationElevesGroupe =
				new TUtilitaireAffectationElevesGroupe(this);
		}
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementMenuDeroulant,
			(aInstance) => {
				if (
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPeriodeNotation,
					)
				) {
					aInstance.setParametres([
						Enumere_Ressource_1.EGenreRessource.Classe,
						Enumere_Ressource_1.EGenreRessource.Periode,
					]);
				} else {
					aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Classe]);
				}
			},
		);
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this._evenementSurCalendrier,
			(aInstance) => {
				UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance, {
					avecMultiSemainesContinues: true,
				});
				aInstance.setFrequences(this.parametresInterface.frequences, true);
			},
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe.bind(this, false),
			this._initListe.bind(this, false),
		);
		this.identListeElevesRattaches = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe.bind(this, true),
			this._initListe.bind(this, true),
		);
		this.identFenetreEditionScolarite = this.add(
			ObjetFenetre_EditionScolarite_1.ObjetFenetre_EditionScolarite,
			null,
			this.initialiserFenetreEditionScolarite,
		);
	}
	initialiserFenetreEditionScolarite(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 800,
			hauteur: 600,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		aInstance.setOngletParDefaut(
			InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet
				.projetsAccompagnement,
		);
	}
	actionSurValidation() {
		this.setEtatSaisie(false);
		this._envoieRequete({
			eleve: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
			ouvrirFenetreApresSaisie: false,
		});
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.AddSurZone.push(this.identTripleCombo);
	}
	recupererDonnees() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.identCalendrier).getNom(),
			false,
		);
		if (this.avecFicheEleve()) {
			this.activerFichesEleve(false);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleBandeauRattache() {
				const lClasse = aInstance.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
				return lClasse
					? ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"ListeRessources.ClasseElevesRattaches",
							),
							[lClasse.getLibelle()],
						)
					: "";
			},
			btnExportCsv: {
				event() {
					aInstance.getInstance(aInstance.identListe).construireCopieCSV();
				},
			},
			btnImpressionEtiquettes: {
				event: function () {
					const ObjetFenetre_GenerationPdfSco =
						MultipleObjetFenetre_GenerationPdfSco
							? MultipleObjetFenetre_GenerationPdfSco.ObjetFenetre_GenerationPdfSco
							: null;
					if (ObjetFenetre_GenerationPdfSco) {
						const lInstanceFenetre =
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_GenerationPdfSco,
								{
									pere: aInstance,
									evenement: function (
										aNumeroBouton,
										aParametresAffichage,
										aOptionsPDF,
									) {
										if (aNumeroBouton === 1) {
											UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
												paramPDF: aParametresAffichage,
												optionsPDF: aOptionsPDF,
											});
										}
									},
								},
							);
						lInstanceFenetre.afficher({
							genreGenerationPDF:
								TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.Etiquettes,
							classeGroupe:
								aInstance.etatUtilisateurSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Classe,
								),
							periode: aInstance.etatUtilisateurSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Periode,
							),
						});
					}
				},
				getDisabled: function () {
					let lDisabledBouton = true;
					const lPeriode = aInstance.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					);
					if (!!lPeriode && lPeriode.existeNumero()) {
						lDisabledBouton = false;
					}
					return lDisabledBouton;
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		const T = [];
		T.push(
			'<div class="interfaceRessourcesElevesSuperConteneurVertical Espace" style="height: calc(100% - 10px);">',
		);
		T.push(
			'<div id="',
			this.getInstance(this.identCalendrier).getNom(),
			'" class="EspaceBas interfaceRessourcesElevesSuperItemVertical" style="display:none;"></div>',
		);
		T.push('<div class="interfaceRessourcesElevesSuperItemVertical">');
		if (this._avecBoutonImpressionEtiquettes()) {
			const lImpressionEtiquettes = ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.Etiquettes.ImpressionDEtiquettes",
			);
			T.push(
				'<ie-bouton class="MargeGauche EspaceBas bouton-carre" ie-model="btnImpressionEtiquettes" ie-icon="icon_etiquette" ie-iconsize="2.4rem">',
				lImpressionEtiquettes,
				"</ie-bouton>",
			);
		}
		const lExportCSV = ObjetTraduction_1.GTraductions.getValeur(
			"ListeRessources.ExportCSV",
		);
		if (this.estPrimaire) {
			T.push(
				'<ie-bouton class="MargeGauche EspaceBas bouton-carre" ie-model="btnExportCsv" ie-icon="icon_doc_telech" ie-iconsize="2.4rem">',
				lExportCSV,
				"</ie-bouton>",
			);
		}
		T.push("</div>");
		T.push(
			'<div class="interfaceRessourcesElevesFlex-container Espace interfaceRessourcesElevesSuperItemVertical" style="height:100%;">',
		);
		T.push(
			'<div class="interfaceRessourcesElevesFlex-item interfaceRessourcesElevesConteneurVertical">',
		);
		T.push(
			'<div id="',
			this.getInstance(this.identListe).getNom(),
			'" class="interfaceRessourcesElevesItemVertical" style="width:100%;height:auto;"></div>',
		);
		T.push(
			'<div id="',
			this.idListeRattachee +
				'" class="EspaceHaut interfaceRessourcesElevesItemVertical" style="display:none;width:100%;">',
			'<div class="EspaceBas">',
			'<div style="',
			ObjetStyle_1.GStyle.composeHeight(this.applicationSco.hauteurBandeau),
			ObjetStyle_1.GStyle.composeCouleur(
				GCouleur.bandeau.fond,
				GCouleur.bandeau.texte,
			),
			'">',
			'<div class="Gras PetitEspaceGauche" style="line-height:',
			this.applicationSco.hauteurBandeau,
			'px;" ie-html="getLibelleBandeauRattache"></div>',
			"</div>",
			"</div>",
			'<div id="',
			this.getInstance(this.identListeElevesRattaches).getNom(),
			'" style="min-height:100px;"></div>',
			"</div>",
		);
		T.push("</div>");
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	surBoutonScolarite(AvecSelectionProjet, aOnglet) {
		if (aOnglet === undefined) {
			aOnglet = InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet.Scolarite;
		}
		this.getInstance(this.identFenetreEditionScolarite).setDonnees(
			AvecSelectionProjet ? aOnglet : null,
		);
	}
	getParametresPDF() {
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ListeRessources,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Eleve,
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			domaine: this._getDomaineCourant(),
		};
	}
	_initListe(aElevesRattaches, aInstance) {
		let lColonnes = null;
		let strTitreEleves = function (aInstanceListe) {
			let lTitre = ObjetTraduction_1.GTraductions.getValeur("Eleve");
			let lNbrEleves = aInstanceListe.getListeArticles().count();
			if (lNbrEleves !== null && lNbrEleves !== undefined) {
				lTitre =
					lNbrEleves +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						lNbrEleves > 1 ? "Etudiants" : "Etudiant",
					).toLowerCase();
			}
			return lTitre;
		};
		if (this.estPrimaire) {
			lColonnes = [
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.prenom,
					titre: {
						libelleHtml: '<div ie-html="getLibelleTitreEleves"></div>',
						controleur: {
							getLibelleTitreEleves: function () {
								return strTitreEleves(aInstance);
							},
						},
					},
					taille: 90,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.nom,
					titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
					taille: 60,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.neLe,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.NeLe",
					),
					taille: 70,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.sexe,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.Sexe",
					),
					taille: 40,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.attestations,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.attestations",
					),
					taille: 150,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.projetDAccompagnement,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.ProjetDAccompagnement",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.hintProjetDAccompagnement",
					),
					taille: 250,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexion,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.DerniereConnexion",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.hintDerniereConnexion",
					),
					taille: 70,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexionResp,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.DerniereConnexionResp",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.hintDerniereConnexionResp",
					),
					taille: 70,
				},
			];
		} else {
			lColonnes = [
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.eleve,
					titre: {
						libelleHtml: '<div ie-html="getLibelleTitreEleves"></div>',
						controleur: {
							getLibelleTitreEleves: function () {
								return strTitreEleves(aInstance);
							},
						},
					},
					taille: "130",
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.valorisation,
					taille: 18,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.neLe,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.NeLe",
					),
					taille: 70,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.sexe,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.Sexe",
					),
					taille: 40,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.classe,
					titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
					taille: 75,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.entree,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.Entree",
					),
					taille: 70,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.sortie,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.Sortie",
					),
					taille: 70,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.projetDAccompagnement,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.ProjetDAccompagnement",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.hintProjetDAccompagnement",
					),
					taille: ObjetListe_1.ObjetListe.initColonne(50, 160),
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.rattacheA,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.RattacheA",
					),
					taille: 150,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.tuteur,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.Tuteur",
					),
					taille: 150,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexion,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.DerniereConnexion",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.hintDerniereConnexion",
					),
					taille: 70,
				},
				{
					id: DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexionResp,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.DerniereConnexionResp",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"ListeRessources.hintDerniereConnexionResp",
					),
					taille: 70,
				},
			];
			for (let i = 1; i <= 3; i++) {
				lColonnes.push({
					id: DonneesListe_ListeRessourcesEleves.colonnes.options + i,
					titre: ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"ListeRessources.OptionsNumero",
						),
						[i],
					),
					taille: ObjetListe_1.ObjetListe.initColonne(10, 100),
				});
			}
			lColonnes.push({
				id: DonneesListe_ListeRessourcesEleves.colonnes.autresOptions,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"ListeRessources.AutresOptions",
				),
				taille: ObjetListe_1.ObjetListe.initColonne(50, 140),
			});
			lColonnes.push({
				id: DonneesListe_ListeRessourcesEleves.colonnes.regime,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"ListeRessources.Regime",
				),
				taille: ObjetListe_1.ObjetListe.initColonne(50, 140),
			});
		}
		const lBoutons = [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }];
		if (!this.estPrimaire) {
			lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.exportCSV });
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			nonEditable: true,
			scrollHorizontal: true,
			hauteurAdapteContenu: true,
			boutons: lBoutons,
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			tri: [
				DonneesListe_ListeRessourcesEleves.colonnes.eleve,
				DonneesListe_ListeRessourcesEleves.colonnes.neLe,
			],
			identifiant: aElevesRattaches ? "elevesRattaches" : "elevesClasse",
		});
	}
	_surReponseRequeteSaisie(aParametresCallbackSaisie) {
		this._envoieRequete(aParametresCallbackSaisie);
	}
	avecDroitConsulterFicheEleveSurRessourceCourante() {
		let lAvecDroit = false;
		const lRessource = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (lRessource) {
			lAvecDroit =
				this.avecFicheEleve() &&
				(lRessource.enseigne ||
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.eleves
							.consulterDonneesAdministrativesAutresEleves,
					));
		}
		return lAvecDroit;
	}
	_evenementListe(aSurListeRattache, aParametres) {
		const lEleve = aParametres.article;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				this.etatUtilisateurSco.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
					aParametres.article,
				);
				this.surSelectionEleve();
				let lFenetreFicheEleve = this.getInstance(
					this.identFenetreEditionScolarite,
				);
				if (lFenetreFicheEleve && lFenetreFicheEleve.estAffiche()) {
					this.getInstance(this.identFenetreEditionScolarite).setDonnees();
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick: {
				if (aSurListeRattache) {
					this.getInstance(this.identListe).setListeElementsSelection(
						new ObjetListeElements_1.ObjetListeElements(),
					);
				} else {
					this.getInstance(
						this.identListeElevesRattaches,
					).setListeElementsSelection(
						new ObjetListeElements_1.ObjetListeElements(),
					);
				}
				if (
					aParametres.idColonne ===
						DonneesListe_ListeRessourcesEleves.colonnes.valorisation &&
					aParametres.article.avecValorisation
				) {
					this.ouvrirFenetreMemo(true);
				}
				if (this.avecDroitConsulterFicheEleveSurRessourceCourante()) {
					switch (aParametres.idColonne) {
						case DonneesListe_ListeRessourcesEleves.colonnes
							.projetDAccompagnement:
							if (
								this.applicationSco.droits.get(
									ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieProjetIndividuel,
								)
							) {
								this.surBoutonScolarite(
									true,
									InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet
										.Scolarite,
								);
							}
							break;
						case DonneesListe_ListeRessourcesEleves.colonnes.attestations:
							this.surBoutonScolarite(
								true,
								InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet.Scolarite,
							);
							break;
						case DonneesListe_ListeRessourcesEleves.colonnes.entree:
						case DonneesListe_ListeRessourcesEleves.colonnes.sortie:
							break;
						default:
							this.surBoutonScolarite(
								true,
								InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet.Identite,
							);
					}
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (this.moduleAffectationElevesGroupe) {
					this.moduleAffectationElevesGroupe.ajoutEleveAuGroupe({
						instance: this,
						groupe: this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
						domaine: this._getDomaineCourant(),
						callbackSaisie: function () {
							this._envoieRequete();
						},
					});
					return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				if (this.moduleAffectationElevesGroupe) {
					this.moduleAffectationElevesGroupe.surSuppressionEleve({
						instance: this,
						groupe: this.etatUtilisateurSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						),
						domaine: this._getDomaineCourant(),
						eleve: aParametres.article,
						callbackSaisie: function () {
							this._envoieRequete();
						},
					});
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (!this.estPrimaire) {
					if (
						aParametres.idColonne ===
							DonneesListe_ListeRessourcesEleves.colonnes
								.projetDAccompagnement &&
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieProjetIndividuel,
						)
					) {
						this.surBoutonScolarite(
							true,
							InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet.Scolarite,
						);
						break;
					}
					if (
						aParametres.idColonne ===
						DonneesListe_ListeRessourcesEleves.colonnes.attestations
					) {
						this.surBoutonScolarite(
							true,
							InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet.Scolarite,
						);
						break;
					}
				}
				if (
					this.moduleAffectationElevesGroupe &&
					(aParametres.idColonne ===
						DonneesListe_ListeRessourcesEleves.colonnes.entree ||
						aParametres.idColonne ===
							DonneesListe_ListeRessourcesEleves.colonnes.sortie)
				) {
					this.moduleAffectationElevesGroupe.ouvrirFenetreHistoriqueChangementsDEleve(
						this,
						lEleve,
						this._surReponseRequeteSaisie.bind(this, {
							eleve: lEleve,
							ouvrirFenetreApresSaisie: true,
						}),
					);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				switch (aParametres.idColonne) {
					case DonneesListe_ListeRessourcesEleves.colonnes.entree:
						if (
							this.moduleAffectationElevesGroupe &&
							lEleve._saisieEntree &&
							!ObjetDate_1.GDate.estJourEgal(
								lEleve._saisieEntree,
								lEleve.entree,
							)
						) {
							this.moduleAffectationElevesGroupe.saisieDateEleve(
								this._surReponseRequeteSaisie.bind(this, { eleve: lEleve }),
								lEleve,
								true,
							);
						}
						break;
					case DonneesListe_ListeRessourcesEleves.colonnes.sortie:
						if (
							this.moduleAffectationElevesGroupe &&
							lEleve._saisieSortie &&
							!ObjetDate_1.GDate.estJourEgal(
								lEleve._saisieSortie,
								lEleve.sortie,
							)
						) {
							this.moduleAffectationElevesGroupe.saisieDateEleve(
								this._surReponseRequeteSaisie.bind(this, { eleve: lEleve }),
								lEleve,
								false,
							);
						}
						break;
					default:
				}
				break;
			default:
				break;
		}
	}
	_evenementSurCalendrier(
		ASelection,
		aDomaine,
		AGenreDomaineInformation,
		aEstDansPeriodeConsultation,
		AIsToucheSelection,
	) {
		if (AIsToucheSelection) {
			this.setFocusIdCourant();
		} else {
			this.setEtatIdCourant(false);
			this.etatUtilisateurSco.setDomaineSelectionne(aDomaine);
			this._envoieRequete();
		}
	}
	_estSelectionGroupeGAEV() {
		const lRessource = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		return (
			lRessource &&
			lRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe &&
			lRessource.estGAEV
		);
	}
	_avecBoutonImpressionEtiquettes() {
		return [
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
		].includes(this.etatUtilisateurSco.GenreEspace);
	}
	_getDomaineCourant() {
		const lRessource = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (
			!lRessource ||
			lRessource.getGenre() !== Enumere_Ressource_1.EGenreRessource.Groupe
		) {
			return undefined;
		}
		if (lRessource.estGAEV) {
			return this.etatUtilisateurSco.getDomaineSelectionne();
		} else {
			return new TypeDomaine_1.TypeDomaine().setValeur(
				true,
				IE.Cycles.nombreCyclesAnneeScolaire(),
			);
		}
	}
	_evenementMenuDeroulant() {
		const lCalendrier = this.getInstance(this.identCalendrier);
		if (this._estSelectionGroupeGAEV()) {
			ObjetHtml_1.GHtml.setDisplay(lCalendrier.getNom(), true);
			lCalendrier.setDomaine(this.etatUtilisateurSco.getDomaineSelectionne());
		} else {
			ObjetHtml_1.GHtml.setDisplay(lCalendrier.getNom(), false);
			this._envoieRequete();
		}
	}
	_envoieRequete(aParametresCallbackSaisie) {
		new ObjetRequeteListeRessources_1.ObjetRequeteListeRessources(
			this,
			this._surReponseRequete.bind(this, aParametresCallbackSaisie),
		).lancerRequete({
			classe: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			domaine: this._getDomaineCourant(),
		});
	}
	_gererColonnesProjets(aListeEleves, aColonnesCachees) {
		let lExisteProjetDAccompagnementConsultable = false;
		for (let I = 0; I < aListeEleves.count(); I++) {
			let lEleve = aListeEleves.get(I);
			if (lEleve.listeProjets.count() > 0) {
				for (let j = 0; j < lEleve.listeProjets.count(); j++) {
					if (
						lEleve.listeProjets.get(j).consultableEquipePeda ||
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieProjetIndividuel,
						)
					) {
						lExisteProjetDAccompagnementConsultable = true;
						break;
					}
				}
				if (lExisteProjetDAccompagnementConsultable) {
					break;
				}
			}
		}
		if (!lExisteProjetDAccompagnementConsultable) {
			aColonnesCachees.push(
				DonneesListe_ListeRessourcesEleves.colonnes.projetDAccompagnement,
			);
		}
	}
	_surReponseRequete(aParametresCallbackSaisie, aJSON) {
		let lColonnesCaches;
		const lInstanceListe = this.getInstance(this.identListe);
		let lAvecElevesRattaches;
		const lListeElevesRattaches = this.getInstance(
			this.identListeElevesRattaches,
		);
		const lRessource = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		const lEstRessourceGroupe =
			lRessource &&
			lRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe;
		if (!lEstRessourceGroupe) {
			lColonnesCaches = [DonneesListe_ListeRessourcesEleves.colonnes.classe];
		} else {
			lColonnesCaches = [DonneesListe_ListeRessourcesEleves.colonnes.rattacheA];
		}
		let lAvecEdition = false;
		if (lEstRessourceGroupe && this.moduleAffectationElevesGroupe) {
			lAvecEdition =
				(this.moduleAffectationElevesGroupe.autorisationEditionGroupeGAEV(
					lRessource,
				) ||
					this.moduleAffectationElevesGroupe.autorisationEditionGroupeNonGAEV(
						lRessource,
					)) &&
				aJSON.ajoutEleveGroupe;
			lInstanceListe.setOptionsListe(
				$.extend(
					{ nonEditable: !lAvecEdition },
					this.moduleAffectationElevesGroupe.getOptionsListe(lRessource),
				),
			);
		} else {
			lInstanceListe.setOptionsListe({
				listeCreations: null,
				avecLigneCreation: false,
				nonEditable: false,
			});
		}
		let auMoins4Options = false;
		for (let i = 0; i < aJSON.listeRessources.count(); i++) {
			const elt = aJSON.listeRessources.get(i);
			for (let j = 4; j <= 12; j++) {
				const lOption = "option" + j;
				if (elt[lOption]) {
					auMoins4Options = true;
					break;
				}
			}
			if (auMoins4Options) {
				break;
			}
		}
		if (!auMoins4Options) {
			lColonnesCaches.push(
				DonneesListe_ListeRessourcesEleves.colonnes.autresOptions,
			);
		}
		if (!this.estPrimaire) {
			this._gererColonnesProjets(aJSON.listeRessources, lColonnesCaches);
		}
		lAvecElevesRattaches =
			!!aJSON.listeElevesRattaches && aJSON.listeElevesRattaches.count() > 0;
		if (lAvecElevesRattaches) {
			const lColonnesCachesRattaches = [
				DonneesListe_ListeRessourcesEleves.colonnes.rattacheA,
			];
			this._gererColonnesProjets(
				aJSON.listeElevesRattaches,
				lColonnesCachesRattaches,
			);
			lListeElevesRattaches.setOptionsListe({
				colonnesCachees: lColonnesCachesRattaches,
			});
		}
		lInstanceListe.setOptionsListe(
			$.extend({ colonnesCachees: lColonnesCaches }),
		);
		lInstanceListe.setDonnees(
			new DonneesListe_ListeRessourcesEleves(aJSON.listeRessources, {
				ressource: lRessource,
				callbackOuvrirFenetreMemo: this.ouvrirFenetreMemo.bind(this),
			}),
		);
		if (lListeElevesRattaches) {
			ObjetHtml_1.GHtml.setDisplay(this.idListeRattachee, lAvecElevesRattaches);
		}
		lListeElevesRattaches.setDonnees(
			new DonneesListe_ListeRessourcesEleves(aJSON.listeElevesRattaches, {
				callbackOuvrirFenetreMemo: this.ouvrirFenetreMemo.bind(this),
			}),
		);
		if (aParametresCallbackSaisie && aParametresCallbackSaisie.eleve) {
			const lEleve = aJSON.listeRessources.getElementParNumero(
				aParametresCallbackSaisie.eleve.getNumero(),
			);
			if (lEleve) {
				lInstanceListe.setListeElementsSelection(
					new ObjetListeElements_1.ObjetListeElements().addElement(lEleve),
				);
				if (aParametresCallbackSaisie.ouvrirFenetreApresSaisie) {
					if (this.moduleAffectationElevesGroupe) {
						this.moduleAffectationElevesGroupe.ouvrirFenetreHistoriqueChangementsDEleve(
							this,
							lEleve,
							this._surReponseRequeteSaisie.bind(this, {
								eleve: lEleve,
								ouvrirFenetreApresSaisie: true,
							}),
						);
					}
				}
			}
		}
		this.afficherBandeau(true);
		this.activerFichesEleve(false);
		if (aJSON.listeRessources.count() > 0) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				this.getParametresPDF.bind(this),
			);
		} else {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
		}
	}
	ouvrirFenetreMemo(aEstValorisation) {
		const lFenetreListeMemosEleves =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ListeMemosEleves_1.ObjetFenetre_ListeMemosEleves,
				{
					pere: this,
					evenement: function (aNumeroBouton, aEstValorisation) {
						if (aNumeroBouton === 0 && !aEstValorisation) {
							const lAvecSaisie = this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
							);
							if (lAvecSaisie) {
								let lFenetreFicheEleve = this.getInstance(
									this.identFenetreEditionScolarite,
								);
								if (lFenetreFicheEleve && lFenetreFicheEleve.estAffiche()) {
									this.getInstance(
										this.identFenetreEditionScolarite,
									).setDonnees(
										InterfaceFicheEleve_1.InterfaceFicheEleve.genreOnglet.Memos,
									);
								}
							}
						}
					},
				},
				{
					donneesListe: { avecEtatSaisie: false },
					callback: this._actualiserApresValorisation.bind(
						this,
						aEstValorisation,
					),
				},
			);
		lFenetreListeMemosEleves.setOptionsListeMemosEleve({
			filtreMemoDate: true,
		});
		lFenetreListeMemosEleves.setDonnees(
			aEstValorisation,
			this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			),
		);
	}
	_actualiserApresValorisation(aEstValorisation) {
		if (aEstValorisation) {
			this._envoieRequete();
		}
	}
}
exports.InterfaceListeRessources_Eleves = InterfaceListeRessources_Eleves;
class DonneesListe_ListeRessourcesEleves extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this._avecEdition = true;
		this._ressource = aParametres.ressource;
		this.callbackOuvrirFenetreMemo = aParametres.callbackOuvrirFenetreMemo;
		this.setOptions({ avecEvnt_Selection: true, avecEtatSaisie: false });
	}
	avecMenuContextuel(aParams) {
		if (this.etatUtilisateurSco.pourPrimaire()) {
			return false;
		}
		return !!aParams.article;
	}
	avecEdition(aParams) {
		if (!this._avecEdition) {
			return false;
		}
		if (
			aParams.article &&
			aParams.article.historiqueGroupes &&
			(aParams.idColonne ===
				DonneesListe_ListeRessourcesEleves.colonnes.entree ||
				aParams.idColonne ===
					DonneesListe_ListeRessourcesEleves.colonnes.sortie)
		) {
			return true;
		}
		return (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieProjetIndividuel,
			) &&
			(aParams.idColonne ===
				DonneesListe_ListeRessourcesEleves.colonnes.projetDAccompagnement ||
				aParams.idColonne ===
					DonneesListe_ListeRessourcesEleves.colonnes.attestations)
		);
	}
	avecSuppression(aParams) {
		return (
			this._avecEdition &&
			!!(aParams.article && aParams.article.historiqueGroupes)
		);
	}
	avecEvenementCreation() {
		return this._avecEdition;
	}
	avecEvenementSuppression() {
		return this._avecEdition;
	}
	avecEvenementSelectionClick() {
		return true;
	}
	avecEvenementEdition(aParams) {
		return (
			(this._avecEdition &&
				aParams.article &&
					aParams.article.historiqueGroupes &&
					this._avecChoixHistoriqueChangement(aParams.article) &&
				(aParams.idColonne ===
					DonneesListe_ListeRessourcesEleves.colonnes.entree ||
					aParams.idColonne ===
						DonneesListe_ListeRessourcesEleves.colonnes.sortie)) ||
			aParams.idColonne ===
				DonneesListe_ListeRessourcesEleves.colonnes.attestations ||
			(aParams.idColonne ===
				DonneesListe_ListeRessourcesEleves.colonnes.projetDAccompagnement &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieProjetIndividuel,
				))
		);
	}
	avecEvenementApresEdition() {
		return this._avecEdition;
	}
	suppressionConfirmation() {
		return false;
	}
	avecInterruptionSuppression() {
		return true;
	}
	getChaineDeDate(aDate, aParams) {
		return aDate
			? ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA") +
					(aDate && aParams.article && aParams.article.multiple ? " *" : "")
			: "";
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		return (
			!aParams.article.avecValorisation &&
			aParams.idColonne ===
				DonneesListe_ListeRessourcesEleves.colonnes.valorisation
		);
	}
	avecBordureDroite(aParams) {
		return !(
			aParams.article.avecValorisation &&
			aParams.idColonne === DonneesListe_ListeRessourcesEleves.colonnes.eleve
		);
	}
	getHintForce(aParams) {
		return aParams.article.avecValorisation &&
			aParams.idColonne ===
				DonneesListe_ListeRessourcesEleves.colonnes.valorisation
			? aParams.article.infoValorisation
			: "";
	}
	getValeur(aParams) {
		const lSurExportCSV = aParams && aParams.surExportCSV;
		switch (aParams.idColonne) {
			case DonneesListe_ListeRessourcesEleves.colonnes.eleve:
				return aParams.article.getLibelle();
			case DonneesListe_ListeRessourcesEleves.colonnes.nom:
				return aParams.article.nom;
			case DonneesListe_ListeRessourcesEleves.colonnes.prenom:
				return aParams.article.prenoms;
			case DonneesListe_ListeRessourcesEleves.colonnes.valorisation:
				return lSurExportCSV
					? aParams.article.infoValorisation
					: aParams.article.avecValorisation
						? "icon_valorisation"
						: "";
			case DonneesListe_ListeRessourcesEleves.colonnes.neLe:
				return aParams.article.neLe
					? ObjetDate_1.GDate.formatDate(aParams.article.neLe, "%JJ/%MM/%AAAA")
					: "";
			case DonneesListe_ListeRessourcesEleves.colonnes.sexe:
				return aParams.article.sexe;
			case DonneesListe_ListeRessourcesEleves.colonnes.classe:
				return aParams.article.classe
					? aParams.article.classe.getLibelle()
					: "";
			case DonneesListe_ListeRessourcesEleves.colonnes.entree:
				return aParams.article.entree;
			case DonneesListe_ListeRessourcesEleves.colonnes.sortie:
				return ObjetDate_1.GDate.estJourEgal(
					aParams.article.sortie,
					GParametres.DerniereDate,
				)
					? null
					: aParams.article.sortie;
			case DonneesListe_ListeRessourcesEleves.colonnes.projetDAccompagnement: {
				const lStrTypeAmenagement = [];
				for (
					let i = 0;
					aParams.article.listeProjets &&
					i < aParams.article.listeProjets.count();
					i++
				) {
					const lProjet = aParams.article.listeProjets.get(i);
					if (
						lProjet.consultableEquipePeda ||
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieProjetIndividuel,
						)
					) {
						const lTypeAmenagement =
							lProjet.projetIndividuel.strProjetIndividuel;
						lStrTypeAmenagement.push(
							lTypeAmenagement +
								(!!lProjet.handicap ? " (" + lProjet.handicap + ")" : "") +
								(!!lProjet.commentaire ? " (" + lProjet.commentaire + ")" : ""),
						);
						if (!lSurExportCSV) {
							for (
								let j = 0;
								lProjet.documents && j < lProjet.documents.count();
								j++
							) {
								const lDocument = lProjet.documents.get(j);
								const lURL = ObjetChaine_1.GChaine.composerUrlLienExterne({
									documentJoint: lDocument,
									libelleEcran: lDocument.getLibelle(),
									genreRessource:
										Enumere_Ressource_1.EGenreRessource.DocJointEleve,
								});
								lStrTypeAmenagement.push(lURL);
							}
						}
					}
				}
				return lStrTypeAmenagement.join(lSurExportCSV ? ", " : "<br/>");
			}
			case DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexion:
				return aParams.article.derniereConnexion
					? ObjetDate_1.GDate.formatDate(
							aParams.article.derniereConnexion,
							"%JJ/%MM/%AAAA",
						)
					: "";
			case DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexionResp:
				return aParams.article.derniereConnexionResp
					? ObjetDate_1.GDate.formatDate(
							aParams.article.derniereConnexionResp,
							"%JJ/%MM/%AAAA",
						)
					: "";
			case DonneesListe_ListeRessourcesEleves.colonnes.rattacheA:
				return aParams.article.rattacheA || "";
			case DonneesListe_ListeRessourcesEleves.colonnes.tuteur:
				return aParams.article.tuteur || "";
			case DonneesListe_ListeRessourcesEleves.colonnes.attestations: {
				const lStrAttestations = [];
				for (
					let i = 0;
					aParams.article.listeAttestations &&
					i < aParams.article.listeAttestations.count();
					i++
				) {
					const lAttestation = aParams.article.listeAttestations.get(i);
					lStrAttestations.push(lAttestation.abbreviation);
				}
				return lStrAttestations.join(", ");
			}
			case DonneesListe_ListeRessourcesEleves.colonnes.autresOptions: {
				let autres = "";
				for (let k = 4; k <= 12; k++) {
					let lOption = "option" + k;
					const str = aParams.article[lOption] ? aParams.article[lOption] : "";
					const ponctuation =
						autres !== "" && aParams.article[lOption] ? ", " : "";
					autres = autres + ponctuation + str;
				}
				return autres;
			}
			case DonneesListe_ListeRessourcesEleves.colonnes.regime:
				return aParams.article.regime;
			default: {
				const lTab = aParams.idColonne.split(
					DonneesListe_ListeRessourcesEleves.colonnes.options,
				);
				if (lTab.length <= 1) {
					return "";
				}
				let lOption = "option" + lTab[1];
				return aParams.article[lOption] ? aParams.article[lOption] : "";
			}
		}
	}
	surEdition(aParams, V) {
		let lElement = aParams.article;
		if (aParams.article && aParams.article.historiqueGroupes) {
			aParams.article.historiqueGroupes.parcourir((aGroupe) => {
				if (aGroupe.getNumero() === this._ressource.getNumero()) {
					lElement = aGroupe;
					return false;
				}
			}, this);
		}
		switch (aParams.idColonne) {
			case DonneesListe_ListeRessourcesEleves.colonnes.entree:
			case DonneesListe_ListeRessourcesEleves.colonnes.sortie: {
				const lResult = TUtilitaireAffectationElevesGroupe.surEditionDateListe(
					aParams.idColonne ===
						DonneesListe_ListeRessourcesEleves.colonnes.entree,
					V,
					lElement,
					aParams.article,
				);
				if (lResult) {
					return lResult;
				}
				break;
			}
			default:
		}
	}
	getMessageEditionImpossible(aParams, aErreur) {
		if (MethodesObjet_1.MethodesObjet.isString(aErreur)) {
			return aErreur;
		}
		return super.getMessageEditionImpossible(aParams, aErreur);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeRessourcesEleves.colonnes.projetDAccompagnement:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ListeRessourcesEleves.colonnes.entree:
			case DonneesListe_ListeRessourcesEleves.colonnes.sortie:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
					.DateCalendrier;
			case DonneesListe_ListeRessourcesEleves.colonnes.valorisation:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Image;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			aParams.article.avecValorisation &&
			aParams.idColonne ===
				DonneesListe_ListeRessourcesEleves.colonnes.valorisation
		) {
			lClasses.push("AvecMain");
		}
		if (aParams.article && aParams.article.horsPeriode) {
			lClasses.push("Italique");
		}
		return lClasses.join(" ");
	}
	getTri(aColonne, aGenreTri) {
		const lTris = [];
		for (let i = 0; i < aColonne.length; i++) {
			switch (this.getId(aColonne[i])) {
				case DonneesListe_ListeRessourcesEleves.colonnes.eleve:
					lTris.push(ObjetTri_1.ObjetTri.init("Position", aGenreTri[i]));
					break;
				case DonneesListe_ListeRessourcesEleves.colonnes.neLe:
					lTris.push(ObjetTri_1.ObjetTri.init("neLe", aGenreTri[i]));
					break;
				case DonneesListe_ListeRessourcesEleves.colonnes.entree:
					lTris.push(ObjetTri_1.ObjetTri.init("entree", aGenreTri[i]));
					break;
				case DonneesListe_ListeRessourcesEleves.colonnes.sortie:
					lTris.push(ObjetTri_1.ObjetTri.init("sortie", aGenreTri[i]));
					break;
				case DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexion:
					lTris.push(
						ObjetTri_1.ObjetTri.init("derniereConnexion", aGenreTri[i]),
					);
					break;
				case DonneesListe_ListeRessourcesEleves.colonnes.derniereConnexionResp:
					lTris.push(
						ObjetTri_1.ObjetTri.init("derniereConnexionResp", aGenreTri[i]),
					);
					break;
				default:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonne[i]),
							aGenreTri[i],
						),
					);
					break;
			}
		}
		lTris.push(ObjetTri_1.ObjetTri.init("Libelle"));
		return lTris;
	}
	initialiserObjetGraphique(aParams, aInstance) {
		TUtilitaireAffectationElevesGroupe.initialiserDateListe(
			aInstance,
			aParams.idColonne === DonneesListe_ListeRessourcesEleves.colonnes.entree,
			aParams.article,
		);
	}
	setDonneesObjetGraphique(aParams, aInstance) {
		TUtilitaireAffectationElevesGroupe.setDonneesDateListe(
			aInstance,
			aParams.idColonne === DonneesListe_ListeRessourcesEleves.colonnes.entree,
			aParams.article,
		);
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.dossierVS.consulterMemosEleve,
			)
		) {
			return;
		}
		const lAvecSaisie = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
		);
		const lMenuMemo = lAvecSaisie
			? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.CreerUnMemo")
			: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.VoirLesMemos");
		const lMenuValorisation = lAvecSaisie
			? ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.CreerUnValorisation",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.VoirLesValorisations",
				);
		aParametres.menuContextuel.add(
			lMenuMemo,
			true,
			this.callbackOuvrirFenetreMemo.bind(this, false),
		);
		aParametres.menuContextuel.add(
			lMenuValorisation,
			true,
			this.callbackOuvrirFenetreMemo.bind(this, true),
		);
		aParametres.menuContextuel.addSeparateur();
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			!aParametres.nonEditable && this._avecSuppression(aParametres),
		);
	}
	_avecChoixHistoriqueChangement(D) {
		if (this._ressource && this._ressource.estGAEV) {
			return true;
		}
		let lNbOccurenceGroupeDansChangement = 0;
		if (D.historiqueGroupes) {
			for (const lGroupe of D.historiqueGroupes) {
				if (lGroupe.getNumero() === this._ressource.getNumero()) {
					lNbOccurenceGroupeDansChangement += 1;
				}
			}
		}
		return lNbOccurenceGroupeDansChangement > 1;
	}
}
DonneesListe_ListeRessourcesEleves.colonnes = {
	eleve: "eleve",
	nom: "nom",
	prenom: "prenoms",
	valorisation: "valorisation",
	neLe: "neLe",
	sexe: "sexe",
	classe: "classe",
	entree: "entree",
	sortie: "sortie",
	projetDAccompagnement: "projetDAccompagnement",
	derniereConnexion: "derniereConnexion",
	derniereConnexionResp: "derniereConnexionResp",
	options: "options_",
	rattacheA: "rattacheA",
	tuteur: "tuteur",
	autresOptions: "autresOptions",
	attestations: "attestations",
	regime: "regime",
};
