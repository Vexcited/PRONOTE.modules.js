exports.InterfaceFicheBrevet_Saisie = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequetePageFicheBrevet_1 = require("ObjetRequetePageFicheBrevet");
const ObjetRequeteSaisieFicheBrevet_1 = require("ObjetRequeteSaisieFicheBrevet");
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
const DonneesListe_FicheBrevetBilan_1 = require("DonneesListe_FicheBrevetBilan");
const DonneesListe_FicheBrevetCompetence_1 = require("DonneesListe_FicheBrevetCompetence");
const DonneesListe_FicheBrevetControle_1 = require("DonneesListe_FicheBrevetControle");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Type3Etats_1 = require("Type3Etats");
const TypeEnseignementComplement_1 = require("TypeEnseignementComplement");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const TypeMentionBrevet_1 = require("TypeMentionBrevet");
const TypePointsEnseignementComplement_1 = require("TypePointsEnseignementComplement");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const AccessApp_1 = require("AccessApp");
class InterfaceFicheBrevet_Saisie extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.idMessage = GUID_1.GUID.getId();
		this._autorisations = {
			saisieAppreciationsGenerales: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.avecSaisieAppreciationsGenerales,
			),
			tailleMaxAppreciation: this.appScoEspace
				.getObjetParametres()
				.getTailleMaxAppreciationParEnumere(
					TypeGenreAppreciation_1.TypeGenreAppreciation.GA_BilanAnnuel_Generale,
				),
		};
		this.donneesRecu = false;
		this.idPage = GUID_1.GUID.getId();
		this._initDonneesSaisie();
	}
	_initDonneesSaisie() {
		this.donneesSaisie = {
			listeEnseignementComplements:
				TypeEnseignementComplement_1.TypeEnseignementComplementUtil.toListe(),
			listePointsEnseignementComplement:
				TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.toListe(
					true,
				),
			listeMentions: TypeMentionBrevet_1.TypeMentionBrevetUtil.toListe(),
			listeAvis: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getInformationDatePublication: function () {
				let lStr = "";
				if (aInstance.strInfoDatePublication) {
					lStr = ` ${aInstance.estCFG ? ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.certificatDeFormationGenerale") : ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.ficheBrevet")} - ${aInstance.strInfoDatePublication}`;
				}
				return lStr;
			},
			textarea: {
				getValue: function () {
					return aInstance.appGenerale &&
						aInstance.appGenerale.appreciationAnnuelle
						? aInstance.appGenerale.appreciationAnnuelle.getLibelle()
						: "";
				},
				setValue: function (aValue) {
					aInstance.appGenerale.appreciationAnnuelle.setLibelle(aValue);
					aInstance.appGenerale.appreciationAnnuelle.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					aInstance.setEtatSaisie(true);
				},
				getDisabled: function () {
					return !aInstance._autorisations.saisieAppreciationsGenerales;
				},
			},
			cbRecu: {
				getValue: function () {
					if (aInstance.donneesRecu) {
						return aInstance.appGenerale
							? aInstance.appGenerale.recu.getGenre() ===
									Type3Etats_1.Type3Etats.TE_Oui
							: false;
					}
				},
				setValue: function (aValue) {
					if (aValue) {
						aInstance.appGenerale.recu.Genre = Type3Etats_1.Type3Etats.TE_Oui;
					} else {
						aInstance.appGenerale.recu.Genre =
							Type3Etats_1.Type3Etats.TE_Inconnu;
					}
					aInstance.appGenerale.recu.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					aInstance
						.getInstance(aInstance.identRecuAjourne)
						.setDonnees(aInstance.donneesSaisie.listeMentions, 0);
					aInstance
						.getInstance(aInstance.identRecuAjourne)
						.setActif(
							aInstance._autorisations.saisieAppreciationsGenerales &&
								aInstance.appGenerale.recu.getGenre() ===
									Type3Etats_1.Type3Etats.TE_Oui,
						);
					aInstance.setEtatSaisie(true);
				},
				getDisabled: function () {
					return !aInstance._autorisations.saisieAppreciationsGenerales;
				},
			},
			cbAjourne: {
				getValue: function () {
					if (aInstance.donneesRecu) {
						return aInstance.appGenerale
							? aInstance.appGenerale.recu.getGenre() ===
									Type3Etats_1.Type3Etats.TE_Non
							: false;
					}
				},
				setValue: function (aValue) {
					if (aValue) {
						aInstance.appGenerale.recu.Genre = Type3Etats_1.Type3Etats.TE_Non;
					} else {
						aInstance.appGenerale.recu.Genre =
							Type3Etats_1.Type3Etats.TE_Inconnu;
					}
					aInstance.appGenerale.recu.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					if (!aInstance.estCFG) {
						aInstance
							.getInstance(aInstance.identRecuAjourne)
							.setDonnees(aInstance.donneesSaisie.listeMentions, 0);
						aInstance
							.getInstance(aInstance.identRecuAjourne)
							.setActif(
								aInstance._autorisations.saisieAppreciationsGenerales &&
									aInstance.appGenerale.recu.getGenre() ===
										Type3Etats_1.Type3Etats.TE_Oui,
							);
					}
					aInstance.setEtatSaisie(true);
				},
				getDisabled: function () {
					return !aInstance._autorisations.saisieAppreciationsGenerales;
				},
			},
			estPasCFG() {
				return !aInstance.estCFG;
			},
			estCFG() {
				return !!aInstance.estCFG;
			},
		});
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.IdentPage;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.IdentTripleCombo);
		this.AddSurZone.push({
			html: '<span ie-html="getInformationDatePublication"></span>',
		});
		if (this.avecFicheEleve()) {
			this.AddSurZone.push({ separateur: true });
		}
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
	}
	construireInstances() {
		this.IdentTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
		this.identListeCompetence = this.add(
			ObjetListe_1.ObjetListe,
			this._evntListe.bind(this),
			this._initialiserCompetence,
		);
		this.identEnseignementCompl = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._enseignementCompl,
			this.initialiserEnseignementCompl,
		);
		this.identEnseignementComplPoints = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._enseignementComplPoints,
			this.initialiserEnseignementComplPoints,
		);
		this.identEnseignementComplAvis = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._enseignementComplAvis,
			this.initialiserEnseignementComplAvis,
		);
		this.identListeControle = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserControle,
		);
		this.identListeBrevet = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserBrevet,
		);
		this.identRecuAjourne = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._eventMention.bind(this),
			this.initialiserRecuAjourne,
		);
		this.construireFicheEleveEtFichePhoto();
		this.IdPremierElement = this.getInstance(
			this.IdentTripleCombo,
		).getPremierElement();
	}
	evenementSurDernierMenuDeroulant(aLigneClasse, aLignePeriode, aLigneEleve) {
		this.NumeroClasse = aLigneClasse.getNumero();
		this.NumeroEleve = aLigneEleve.getNumero();
		this.eleve = aLigneEleve;
		this.NumeroPeriode = aLignePeriode.getNumero();
		this.GenrePeriode = aLignePeriode.getGenre();
		this.surSelectionEleve();
		this.afficherPage();
	}
	_enseignementCompl(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				if (
					this.complements.enseignementComplement.getGenre() !==
					aParams.element.getGenre()
				) {
					this.complements.enseignementComplement =
						new ObjetElement_1.ObjetElement(
							"",
							undefined,
							aParams.element.getGenre(),
						);
					this.complements.enseignementComplement.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.setEtatSaisie(true);
					this.getInstance(this.identEnseignementComplPoints).setActif(
						aParams.element.getGenre() !==
							TypeEnseignementComplement_1.TypeEnseignementComplement.tecAucun,
					);
					this.getInstance(this.identEnseignementComplPoints).setSelection(0);
				}
				break;
			default:
				break;
		}
	}
	_enseignementComplAvis(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			aParams.element.getNumero() !==
				this.appGenerale.avisChefDEtablissement.getNumero()
		) {
			this.appGenerale.avisChefDEtablissement = aParams.element;
			this.appGenerale.avisChefDEtablissement.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			this.setEtatSaisie(true);
		}
	}
	_enseignementComplPoints(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				if (
					this.complements.nombreDePoints.getGenre() !==
					aParams.element.getGenre()
				) {
					this.complements.nombreDePoints = new ObjetElement_1.ObjetElement(
						"",
						undefined,
						aParams.element.getGenre(),
					);
					this.complements.nombreDePoints.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.setEtatSaisie(true);
					const lPoints =
						TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getPoints(
							aParams.element.getGenre(),
						);
					this._mettreAJourLigneEnseignementComplement(lPoints);
				}
				break;
			default:
				break;
		}
	}
	evenementAfficherMessage(aGenreMessage) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		ObjetHtml_1.GHtml.setDisplay(this.idPage, false);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, true);
		this.afficherBandeau(true);
		const lMessage =
			typeof aGenreMessage === "number"
				? ObjetTraduction_1.GTraductions.getValeur("Message")[aGenreMessage]
				: aGenreMessage;
		ObjetHtml_1.GHtml.setHtml(this.idMessage, this.composeMessage(lMessage));
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	initialiserEnseignementCompl(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 200,
			classTexte: "Gras",
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.EnseignementsComplements",
			),
		});
	}
	initialiserEnseignementComplPoints(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 150,
			classTexte: "Gras",
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.EnseignementsComplements",
			),
		});
	}
	initialiserEnseignementComplAvis(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 200,
			texteEdit: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.AvisChefEtablissement",
			),
			styleTexteEdit: "margin:15px;font-weight: normal;",
			classTexte: "Gras",
		});
	}
	initialiserRecuAjourne(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 150,
			classTexte: "Gras",
			labelWAICellule:
				ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.Recu"),
		});
	}
	initialiserControle(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_FicheBrevetControle_1.DonneesListe_FicheBrevetControle
				.colonnes.controle,
			taille: 650,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.ControleFinal",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetControle_1.DonneesListe_FicheBrevetControle
				.colonnes.points,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Points",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetControle_1.DonneesListe_FicheBrevetControle
				.colonnes.bareme,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Bareme",
			),
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			avecLigneTotal: true,
		});
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div id="',
			this.idPage,
			'" class="p-all-l" style="display: none;">',
		);
		H.push(
			'<div class="m-bottom-xl" id="',
			this.getNomInstance(this.identListeCompetence),
			'"></div>',
		);
		H.push('<div class="m-bottom-xl" ie-display="estPasCFG">');
		H.push(
			'<h4 class="m-left-xl semi-bold">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.EnseignementsComplements",
			),
			"</h4>",
		);
		H.push(
			'<div class="flex-contain flex-center flex-gap-xl p-bottom-xl m-top">',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identEnseignementCompl),
			'"></div>',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identEnseignementComplPoints),
			'"></div>',
		);
		H.push("</div>");
		H.push('<div style="width:870px;">');
		H.push(
			'<fieldset class="Bordure">',
			"<legend>",
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.AppreciationGenerale",
			),
			"</legend>",
			'<div id="',
			this.getNomInstance(this.identEnseignementComplAvis),
			'"></div>',
			'<ie-textareamax ie-model="textarea" rows="5" style="width: 850px; height:66px;" maxlength="',
			this._autorisations.tailleMaxAppreciation,
			'" aria-label="' +
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.AppreciationGenerale",
				) +
				'"></ie-textareamax>',
			"</fieldset>",
		);
		H.push("</div>");
		H.push("</div>");
		H.push(
			'<div id="',
			this.getNomInstance(this.identListeControle),
			'"></div><br><br>',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identListeBrevet),
			'"></div><br><br>',
		);
		H.push('<div class="noWrap">');
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical" style="margin-right: 20px;"><ie-checkbox ie-model="cbRecu">',
			ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.Recu"),
			"</ie-checkbox></div>",
		);
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical" ie-display="estPasCFG" id="',
			this.getNomInstance(this.identRecuAjourne),
			'"></div>',
		);
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical" style="margin-left: 20px;"><ie-checkbox ie-model="cbAjourne">',
			ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.Ajourne"),
			"</ie-checkbox></div>",
		);
		H.push("</div>");
		H.push("</div>");
		H.push('<div id="', this.idMessage, '"></div>');
		return H.join("");
	}
	afficherPage() {
		this.setEtatSaisie(false);
		new ObjetRequetePageFicheBrevet_1.ObjetRequetePageFicheBrevet(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete({ eleve: this.eleve });
	}
	actionSurRecupererDonnees(aJSON) {
		if (aJSON.message) {
			this.evenementAfficherMessage(aJSON.message);
		} else {
			this.estCFG = aJSON.estCFG;
			this.appGenerale = aJSON.appGenerale;
			this.competences = aJSON.competences;
			this.controlFinal = aJSON.controlFinal;
			if (this.estCFG) {
				this.initCFG(aJSON);
				return;
			}
			this.donneesRecu = true;
			this._autorisations.saisieAppreciationsGenerales =
				aJSON.saisieAppreciationsGenerales;
			this._autorisations.saisieEnseignementDeComplement =
				aJSON.saisieEnseignementDeComplement;
			this.strInfoDatePublication = aJSON.strInfoDatePublication;
			ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
			ObjetHtml_1.GHtml.setDisplay(this.idMessage, false);
			this.complements = aJSON.Complements;
			this.donneesSaisie.listeAvis = aJSON.listeAvis;
			const lIndiceEnseignCompl =
				this.donneesSaisie.listeEnseignementComplements.getIndiceParElement(
					this.complements.enseignementComplement,
				);
			const lIndiceEnseignPoint =
				this.donneesSaisie.listePointsEnseignementComplement.getIndiceParElement(
					this.complements.nombreDePoints,
				);
			this.donneesSaisie.listeAvis.insererElement(
				new ObjetElement_1.ObjetElement("", 0, -1),
				0,
			);
			const lIndiceListeAvis = this.donneesSaisie.listeAvis.getIndiceParElement(
				this.appGenerale.avisChefDEtablissement,
			);
			this._initialisationDonnees();
			const lIndiceMentionBrevet =
				this.donneesSaisie.listeMentions.getIndiceParElement(
					this.appGenerale.mention,
				);
			const lIndices = {
				enseignementComplement: lIndiceEnseignCompl,
				pointsEnseignementComplement: lIndiceEnseignPoint,
				mentionBrevet: lIndiceMentionBrevet,
				avis: lIndiceListeAvis,
			};
			this._initSetDonnees(lIndices);
			this.activerImpression();
		}
	}
	activerImpression() {
		if (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
			)
		) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				() => {
					return {
						genreGenerationPDF:
							TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.FicheBrevet,
						eleve: this.eleve,
					};
				},
			);
		}
	}
	initCFG(aJSON) {
		this.donneesRecu = true;
		this.strInfoDatePublication = aJSON.strInfoDatePublication;
		ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, false);
		this.recu = aJSON.recu;
		this._initialisationDonnees();
		this._initSetDonnees();
		this.activerImpression();
	}
	valider() {
		new ObjetRequeteSaisieFicheBrevet_1.ObjetRequeteSaisieFicheBrevet(
			this,
			this.actionSurValidation,
		).lancerRequete({
			classe: this.appScoEspace
				.getEtatUtilisateur()
				.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Classe),
			eleve: this.appScoEspace
				.getEtatUtilisateur()
				.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Eleve),
			palier: this.competences.palier,
			listePiliers: this.competences.listePiliers,
			complements: this.complements,
			appGenerale: this.appGenerale,
		});
	}
	_evntListe(aParametres) {
		this.competenceSelectionnee = this.competences.listePiliers.get(
			aParametres.ligne,
		);
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				aParametres.ouvrirMenuContextuel();
				break;
			default:
				break;
		}
	}
	_evntMenuContextuel(aElement, aLigne) {
		this.competenceSelectionnee = this.competences.listePiliers.get(aLigne);
		this._mettreAJourNiveauDAcquisitionDeCompetenceSelectionnee(aElement);
	}
	_calculTotal() {
		let lReCalculTotal = 0;
		let lAvecBonus = false;
		this.competences.listePiliers.parcourir((aPilier) => {
			if (
				aPilier.estPilierLVE &&
				aPilier.niveauDAcquisition &&
				aPilier.niveauDAcquisition.getGenre() ===
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Dispense
			) {
				lAvecBonus = true;
			}
			const lValeur = aPilier.points.getValeur();
			lReCalculTotal += isNaN(lValeur) ? 0 : lValeur;
		});
		if (lAvecBonus) {
			lReCalculTotal = Math.ceil((lReCalculTotal * 8) / 7);
		}
		return new TypeNote_1.TypeNote(lReCalculTotal > 0 ? lReCalculTotal : "");
	}
	_mettreAJourNiveauDAcquisitionDeCompetenceSelectionnee(aNiveauAcquisition) {
		this.competenceSelectionnee.niveauDAcquisition =
			MethodesObjet_1.MethodesObjet.dupliquer(aNiveauAcquisition);
		if (this.competenceSelectionnee.niveauDAcquisition.getGenre() === 0) {
			this.competenceSelectionnee.niveauDAcquisition.setLibelle("");
		}
		this.competenceSelectionnee.points =
			UtilitaireCompetences_1.TUtilitaireCompetences.getNombrePointsBrevet(
				aNiveauAcquisition,
			);
		this.competences.totalPoints = this._calculTotal();
		this.competenceSelectionnee.niveauDAcquisition.setEtat(
			Enumere_Etat_1.EGenreEtat.Modification,
		);
		this.competenceSelectionnee.setEtat(
			Enumere_Etat_1.EGenreEtat.FilsModification,
		);
		this.setEtatSaisie(true);
		this.getInstance(this.identListeCompetence).actualiser(true);
		const lLigneCompetence = this.brevet.listeBrevet.getElementParGenre(0);
		lLigneCompetence.points = this.competences.totalPoints;
		lLigneCompetence.bareme = this.competences.totalBareme;
		this._mettreAJourLigneEnseignementComplement();
	}
	_mettreAJourLigneEnseignementComplement(aPoints) {
		if (this.estCFG) {
			return;
		}
		const lLigneEnseignCompl = this.brevet.listeBrevet.getElementParGenre(2);
		if (aPoints !== undefined) {
			lLigneEnseignCompl.points = aPoints;
		}
		const lComp = isNaN(this.competences.totalPoints.getValeur())
			? 0
			: this.competences.totalPoints.getValeur();
		const lTotalPoints = isNaN(lLigneEnseignCompl.points)
			? this.controlFinal.totalPoints.getValeur() +
				lComp +
				lLigneEnseignCompl.points.getValeur()
			: this.controlFinal.totalPoints.getValeur() + lComp;
		this.brevet.totalPoints = new TypeNote_1.TypeNote(lTotalPoints);
		this.getInstance(this.identListeBrevet).actualiser(true);
	}
	_eventMention(aParams) {
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			this.appGenerale.mention.getGenre() !== aParams.element.getGenre()
		) {
			this.appGenerale.mention = new ObjetElement_1.ObjetElement(
				"",
				undefined,
				aParams.element.getGenre(),
			);
			this.appGenerale.mention.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	_initialiserCompetence(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.competences,
			taille: 400,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.DomainesSocle",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.maitrise,
			taille: 250,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Maitrise",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.points,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Points",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetCompetence_1
				.DonneesListe_FicheBrevetCompetence.colonnes.bareme,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Bareme",
			),
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			avecLigneTotal: true,
		});
	}
	_initialiserBrevet(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_FicheBrevetBilan_1.DonneesListe_FicheBrevetBilan.colonnes
				.bilan,
			taille: 650,
			titre: this.estCFG
				? ObjetTraduction_1.GTraductions.getValeur(
						"FicheBrevet.certificatDeFormationGenerale",
					)
				: ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.titre.Brevet"),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetBilan_1.DonneesListe_FicheBrevetBilan.colonnes
				.points,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Points",
			),
		});
		lColonnes.push({
			id: DonneesListe_FicheBrevetBilan_1.DonneesListe_FicheBrevetBilan.colonnes
				.bareme,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.Bareme",
			),
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			avecLigneTotal: true,
		});
	}
	_initialisationDonnees() {
		const lLigneCompetence = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.ControleContinu"),
			undefined,
			0,
		);
		if (this.competences) {
			lLigneCompetence.points = this.competences.totalPoints;
			lLigneCompetence.bareme = this.competences.totalBareme;
		}
		const lLigneControle = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.titre.ControleFinal",
			),
			undefined,
			1,
		);
		lLigneControle.points = this.controlFinal.totalPoints;
		lLigneControle.bareme = this.controlFinal.totalBareme;
		const lLigneEnseignCompl = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheBrevet.EnseignementsComplements",
			),
			undefined,
			2,
		);
		if (this.complements) {
			lLigneEnseignCompl.points =
				TypePointsEnseignementComplement_1.TypePointsEnseignementComplementUtil.getPoints(
					this.complements.nombreDePoints.getGenre(),
				);
			lLigneEnseignCompl.bareme = new TypeNote_1.TypeNote("");
		}
		const lTotalP =
			(this.competences.totalPoints.estUneValeur()
				? this.competences.totalPoints.getValeur()
				: 0) +
			(this.controlFinal.totalPoints.estUneValeur()
				? this.controlFinal.totalPoints.getValeur()
				: 0) +
			(lLigneEnseignCompl.points && lLigneEnseignCompl.points.estUneValeur()
				? lLigneEnseignCompl.points.getValeur()
				: 0);
		const lTotalB =
			(this.competences &&
			this.competences.totalBareme &&
			this.competences.totalBareme.estUneValeur()
				? this.competences.totalBareme.getValeur()
				: 0) +
			(this.controlFinal.totalBareme.estUneValeur()
				? this.controlFinal.totalBareme.getValeur()
				: 0) +
			(lLigneEnseignCompl.bareme && lLigneEnseignCompl.bareme.estUneValeur()
				? lLigneEnseignCompl.bareme.getValeur()
				: 0);
		this.brevet = {
			listeBrevet: new ObjetListeElements_1.ObjetListeElements(),
			totalPoints: new TypeNote_1.TypeNote(lTotalP ? lTotalP : ""),
			totalBareme: new TypeNote_1.TypeNote(lTotalB ? lTotalB : ""),
		};
		this.brevet.listeBrevet.addElement(lLigneCompetence);
		this.brevet.listeBrevet.addElement(lLigneControle);
		if (!this.estCFG) {
			this.brevet.listeBrevet.addElement(lLigneEnseignCompl);
		}
	}
	_initSetDonnees(aIndices) {
		this.getInstance(this.identListeCompetence).setDonnees(
			new DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence(
				this.competences,
				{ callBackMenuContextuel: this._evntMenuContextuel.bind(this) },
			),
		);
		this.getInstance(this.identListeControle).setDonnees(
			new DonneesListe_FicheBrevetControle_1.DonneesListe_FicheBrevetControle(
				this.controlFinal,
			),
		);
		this._initialiserBrevet(this.getInstance(this.identListeBrevet));
		this.getInstance(this.identListeBrevet).setDonnees(
			new DonneesListe_FicheBrevetBilan_1.DonneesListe_FicheBrevetBilan(
				this.brevet,
			),
		);
		if (!this.estCFG && aIndices) {
			this.getInstance(this.identEnseignementCompl).setDonnees(
				this.donneesSaisie.listeEnseignementComplements,
			);
			this.getInstance(this.identEnseignementCompl).setActif(
				this._autorisations.saisieEnseignementDeComplement,
			);
			this.getInstance(this.identEnseignementCompl).initSelection(
				aIndices.enseignementComplement || 0,
			);
			this.getInstance(this.identEnseignementComplPoints).setDonnees(
				this.donneesSaisie.listePointsEnseignementComplement,
			);
			this.getInstance(this.identEnseignementComplPoints).setActif(
				this._autorisations.saisieEnseignementDeComplement &&
					this.complements.enseignementComplement.getGenre() !==
						TypeEnseignementComplement_1.TypeEnseignementComplement.tecAucun,
			);
			this.getInstance(this.identEnseignementComplPoints).initSelection(
				aIndices.pointsEnseignementComplement || 0,
			);
			this.getInstance(this.identEnseignementComplAvis).setDonnees(
				this.donneesSaisie.listeAvis,
			);
			this.getInstance(this.identEnseignementComplAvis).setActif(
				this._autorisations.saisieAppreciationsGenerales,
			);
			this.getInstance(this.identEnseignementComplAvis).initSelection(
				aIndices.avis || 0,
			);
			this.getInstance(this.identRecuAjourne).setDonnees(
				this.donneesSaisie.listeMentions,
			);
			this.getInstance(this.identRecuAjourne).setActif(
				this._autorisations.saisieAppreciationsGenerales &&
					this.appGenerale.recu.getGenre() === Type3Etats_1.Type3Etats.TE_Oui,
			);
			this.getInstance(this.identRecuAjourne).initSelection(
				aIndices.mentionBrevet || 0,
			);
		}
	}
}
exports.InterfaceFicheBrevet_Saisie = InterfaceFicheBrevet_Saisie;
