exports.InterfaceFicheBrevet_Saisie = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteSaisieFicheBrevet_1 = require("ObjetRequeteSaisieFicheBrevet");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
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
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Type3Etats_1 = require("Type3Etats");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const TypeMentionBrevet_1 = require("TypeMentionBrevet");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const AccessApp_1 = require("AccessApp");
const _InterfaceFicheBrevet_1 = require("_InterfaceFicheBrevet");
const DonneesListe_FicheBrevetCC_1 = require("DonneesListe_FicheBrevetCC");
const TypeColonneFicheBrevet_1 = require("TypeColonneFicheBrevet");
class InterfaceFicheBrevet_Saisie extends _InterfaceFicheBrevet_1._InterfaceFicheBrevet {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
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
		this.idPage = GUID_1.GUID.getId();
		this._initDonneesSaisie();
	}
	_initDonneesSaisie() {
		this.donneesSaisie = {
			listeMentions: TypeMentionBrevet_1.TypeMentionBrevetUtil.toListe(),
			listeAvis: new ObjetListeElements_1.ObjetListeElements(),
		};
	}
	jsxGetHtmlInformationDatePublication() {
		let lStr = "";
		if (this.strInfoDatePublication) {
			lStr = ` ${this.estCFG ? ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.certificatDeFormationGenerale") : ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.ficheBrevet")} - ${this.strInfoDatePublication}`;
		}
		return lStr;
	}
	jsxModelTextarea() {
		return {
			getValue: () => {
				return this.appGenerale && this.appGenerale.appreciationAnnuelle
					? this.appGenerale.appreciationAnnuelle.getLibelle()
					: "";
			},
			setValue: (aValue) => {
				this.appGenerale.appreciationAnnuelle.setLibelle(aValue);
				this.appGenerale.appreciationAnnuelle.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.setEtatSaisie(true);
			},
			getDisabled: () => {
				return !this._autorisations.saisieAppreciationsGenerales;
			},
		};
	}
	jsxModelCheckboxRecu() {
		return {
			getValue: () => {
				if (this.donneesRecu) {
					return this.appGenerale
						? this.appGenerale.recu.getGenre() ===
								Type3Etats_1.Type3Etats.TE_Oui
						: false;
				}
				return false;
			},
			setValue: (aValue) => {
				if (aValue) {
					this.appGenerale.recu.Genre = Type3Etats_1.Type3Etats.TE_Oui;
				} else {
					this.appGenerale.recu.Genre = Type3Etats_1.Type3Etats.TE_Inconnu;
				}
				this.appGenerale.recu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.getInstance(this.identRecuAjourne).setDonnees(
					this.donneesSaisie.listeMentions,
					0,
				);
				this.getInstance(this.identRecuAjourne).setActif(
					this._autorisations.saisieAppreciationsGenerales &&
						this.appGenerale.recu.getGenre() === Type3Etats_1.Type3Etats.TE_Oui,
				);
				this.setEtatSaisie(true);
			},
			getDisabled: () => {
				return !this._autorisations.saisieAppreciationsGenerales;
			},
		};
	}
	jsxModelCheckboxAjourne() {
		return {
			getValue: () => {
				if (this.donneesRecu) {
					return this.appGenerale
						? this.appGenerale.recu.getGenre() ===
								Type3Etats_1.Type3Etats.TE_Non
						: false;
				}
				return false;
			},
			setValue: (aValue) => {
				if (aValue) {
					this.appGenerale.recu.Genre = Type3Etats_1.Type3Etats.TE_Non;
				} else {
					this.appGenerale.recu.Genre = Type3Etats_1.Type3Etats.TE_Inconnu;
				}
				this.appGenerale.recu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				if (!this.estCFG) {
					this.getInstance(this.identRecuAjourne).setDonnees(
						this.donneesSaisie.listeMentions,
						0,
					);
					this.getInstance(this.identRecuAjourne).setActif(
						this._autorisations.saisieAppreciationsGenerales &&
							this.appGenerale.recu.getGenre() ===
								Type3Etats_1.Type3Etats.TE_Oui,
					);
				}
				this.setEtatSaisie(true);
			},
			getDisabled: () => {
				return !this._autorisations.saisieAppreciationsGenerales;
			},
		};
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.IdentZoneAlClient = this.IdentPage;
		this.AddSurZone = [];
		this.AddSurZone.push(this.IdentTripleCombo);
		this.AddSurZone.push({
			html: IE.jsx.str("span", {
				"ie-html": this.jsxGetHtmlInformationDatePublication.bind(this),
			}),
		});
		if (this.avecFicheEleve()) {
			this.AddSurZone.push({ separateur: true });
		}
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
	}
	construireInstances() {
		super.construireInstances();
		this.IdentTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
		this.identListeCompetence = this.add(
			ObjetListe_1.ObjetListe,
			this._evntListe.bind(this),
			this._initialiserCompetence.bind(this),
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
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
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
		var _a, _b;
		const lColonnes = [];
		(_b =
			(_a = this.controlFinal) === null || _a === void 0
				? void 0
				: _a.colonnees) === null || _b === void 0
			? void 0
			: _b.parcourir((aColonne) => {
					const lTaille = this.getTailleColonneControleFinal(
						aColonne.genreColonne,
					);
					if (lTaille > 0) {
						lColonnes.push({
							id: TypeColonneFicheBrevet_1.TypeColonneFicheBrevet[
								aColonne.genreColonne
							],
							genreColonne: aColonne.genreColonne,
							taille: this.getTailleColonneControleFinal(aColonne.genreColonne),
							titre: aColonne.titre,
						});
					}
				});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			avecLigneTotal: this.estCFG,
			ariaLabel: () =>
				this.getAriaLabelListe(
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheBrevet.titre.ControleFinal",
					),
				),
		});
	}
	getTailleColonneControleFinal(aGenre) {
		switch (aGenre) {
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Libelle:
				return 650;
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Points:
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Bareme:
			case TypeColonneFicheBrevet_1.TypeColonneFicheBrevet.tCFB_Coeff:
				return 100;
			default:
				return 0;
		}
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ id: this.idPage, class: "p-all-l", style: { display: "none" } },
				IE.jsx.str("div", {
					class: "m-bottom-xl",
					id: this.getNomInstance(this.identListeCompetence),
					"ie-display": this.jsxDisplayCFG.bind(this),
				}),
				this.getHtmlListeCC(),
				IE.jsx.str(
					"div",
					{
						class: "m-bottom-xl",
						"ie-display": this.jsxDisplayBrevet.bind(this),
					},
					IE.jsx.str(
						"div",
						{ style: { width: 870 } },
						IE.jsx.str(
							"fieldset",
							{ class: "Bordure" },
							IE.jsx.str(
								"legend",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"FicheBrevet.AppreciationGenerale",
								),
							),
							IE.jsx.str("div", {
								id: this.getNomInstance(this.identEnseignementComplAvis),
							}),
							IE.jsx.str("ie-textareamax", {
								"ie-model": this.jsxModelTextarea.bind(this),
								rows: "5",
								style: { width: 850, height: 66 },
								maxlength: this._autorisations.tailleMaxAppreciation,
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"FicheBrevet.AppreciationGenerale",
								),
							}),
						),
					),
				),
				IE.jsx.str("div", {
					class: "m-bottom-xl",
					id: this.getNomInstance(this.identListeControle),
				}),
				IE.jsx.str("div", {
					class: "m-bottom-xl",
					"ie-display": this.jsxDisplayCFG.bind(this),
					id: this.getNomInstance(this.identListeBrevet),
				}),
				IE.jsx.str(
					"div",
					{ class: ["noWrap", Divers_css_1.StylesDivers.mTopXl] },
					IE.jsx.str(
						"div",
						{
							class: ["InlineBlock", "AlignementMilieuVertical"],
							style: { marginRight: 20 },
						},
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModelCheckboxRecu.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.Recu"),
						),
					),
					IE.jsx.str("div", {
						class: ["InlineBlock", "AlignementMilieuVertical"],
						"ie-display": this.jsxDisplayBrevet.bind(this),
						id: this.getNomInstance(this.identRecuAjourne),
					}),
					IE.jsx.str(
						"div",
						{
							class: ["InlineBlock", "AlignementMilieuVertical"],
							style: { marginLeft: 20 },
						},
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModelCheckboxAjourne.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur("FicheBrevet.Ajourne"),
						),
					),
				),
			),
			IE.jsx.str("div", { id: this.idMessage }),
		);
	}
	afficherPage() {
		this.setEtatSaisie(false);
		this.requeteConsultation();
	}
	actionSurRecupererDonnees(aJSON) {
		if (aJSON.message) {
			this.evenementAfficherMessage(aJSON.message);
			return;
		}
		this.estCFG = aJSON.estCFG;
		this.appGenerale = aJSON.appGenerale;
		this.competences = aJSON.competences;
		this.controlFinal = aJSON.controlFinal;
		this.donneesRecu = true;
		this.strInfoDatePublication = aJSON.strInfoDatePublication;
		this._autorisations.saisieAppreciationsGenerales =
			aJSON.saisieAppreciationsGenerales;
		if (this.estCFG) {
			this.initCFG(aJSON);
			return;
		}
		this.initBrevet(aJSON);
	}
	initBrevet(aJSON) {
		super.initBrevet(aJSON);
		ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, false);
		this.donneesSaisie.listeAvis = aJSON.listeAvis;
		this.donneesSaisie.listeAvis.insererElement(
			new ObjetElement_1.ObjetElement("", 0, -1),
			0,
		);
		const lIndiceListeAvis = this.donneesSaisie.listeAvis.getIndiceParElement(
			this.appGenerale.avisChefDEtablissement,
		);
		const lIndiceMentionBrevet =
			this.donneesSaisie.listeMentions.getIndiceParElement(
				this.appGenerale.mention,
			);
		const lIndices = {
			mentionBrevet: lIndiceMentionBrevet,
			avis: lIndiceListeAvis,
		};
		this._initSetDonnees(lIndices);
		this.activerImpression();
	}
	getEleve() {
		return this.eleve;
	}
	activerImpression() {
		if (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
			)
		) {
			super.activerImpression();
		}
	}
	initCFG(aJSON) {
		ObjetHtml_1.GHtml.setDisplay(this.idPage, true);
		ObjetHtml_1.GHtml.setDisplay(this.idMessage, false);
		this.recu = aJSON.recu;
		this._initialisationDonnees();
		this._initSetDonnees();
		this.activerImpression();
	}
	valider() {
		var _a, _b;
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
			palier:
				(_a = this.competences) === null || _a === void 0 ? void 0 : _a.palier,
			listePiliers:
				(_b = this.competences) === null || _b === void 0
					? void 0
					: _b.listePiliers,
			appGenerale: this.appGenerale,
			listeControleContinu: this.listeControleContinu,
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
			ariaLabel: () =>
				this.getAriaLabelListe(
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheBrevet.certificatDeFormationGenerale",
					),
				),
		});
	}
	_initialisationDonnees() {
		var _a;
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
		const lTotalP =
			((
				(_a = this.competences) === null || _a === void 0
					? void 0
					: _a.totalPoints.estUneValeur()
			)
				? this.competences.totalPoints.getValeur()
				: 0) +
			(this.controlFinal.totalPoints.estUneValeur()
				? this.controlFinal.totalPoints.getValeur()
				: 0);
		const lTotalB =
			(this.competences &&
			this.competences.totalBareme &&
			this.competences.totalBareme.estUneValeur()
				? this.competences.totalBareme.getValeur()
				: 0) +
			(this.controlFinal.totalBareme.estUneValeur()
				? this.controlFinal.totalBareme.getValeur()
				: 0);
		this.brevet = {
			listeBrevet: new ObjetListeElements_1.ObjetListeElements(),
			totalPoints: new TypeNote_1.TypeNote(lTotalP ? lTotalP : ""),
			totalBareme: new TypeNote_1.TypeNote(lTotalB ? lTotalB : ""),
		};
		if (this.competences) {
			this.brevet.listeBrevet.addElement(lLigneCompetence);
		}
		this.brevet.listeBrevet.addElement(lLigneControle);
	}
	_initSetDonnees(aIndices) {
		if (this.competences) {
			this.getInstance(this.identListeCompetence).setDonnees(
				new DonneesListe_FicheBrevetCompetence_1.DonneesListe_FicheBrevetCompetence(
					this.competences,
					{ callBackMenuContextuel: this._evntMenuContextuel.bind(this) },
				),
			);
		}
		if (this.controlFinal) {
			this.initialiserControle(this.getInstance(this.identListeControle));
			this.getInstance(this.identListeControle).setDonnees(
				new DonneesListe_FicheBrevetControle_1.DonneesListe_FicheBrevetControle(
					this.controlFinal,
				),
			);
		}
		if (this.listeControleContinu) {
			this.getInstance(this.identListeControleContinu).setDonnees(
				new DonneesListe_FicheBrevetCC_1.DonneesListe_FicheBrevetCC(
					this.listeControleContinu,
				),
			);
		}
		if (this.estCFG) {
			this._initialiserBrevet(this.getInstance(this.identListeBrevet));
			this.getInstance(this.identListeBrevet).setDonnees(
				new DonneesListe_FicheBrevetBilan_1.DonneesListe_FicheBrevetBilan(
					this.brevet,
				),
			);
		}
		if (!this.estCFG && aIndices) {
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
