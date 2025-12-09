exports.ObjetFenetre_PartageModeleActualite = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
const TypeGenrePublicPartageModeleActualite_1 = require("TypeGenrePublicPartageModeleActualite");
const MoteurDestinatairesPN_1 = require("MoteurDestinatairesPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Cache_1 = require("Cache");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
var EGenreAffichage;
(function (EGenreAffichage) {
	EGenreAffichage[(EGenreAffichage["Information"] = 0)] = "Information";
	EGenreAffichage[(EGenreAffichage["Edition"] = 1)] = "Edition";
})(EGenreAffichage || (EGenreAffichage = {}));
class ObjetFenetre_PartageModeleActualite extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecRequetePersonnelDejaLancee = false;
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.parametreSco = this.applicationSco.getObjetParametres();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.moteurDestinataires =
			new MoteurDestinatairesPN_1.MoteurDestinatairesPN();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("actualites.partageAvec"),
			largeur: 350,
		});
	}
	static getLibelleDeGenrePublic(aGenre) {
		switch (aGenre) {
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_Professeur:
				return ObjetTraduction_1.GTraductions.getValeur("Professeurs");
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_Personnel:
				return ObjetTraduction_1.GTraductions.getValeur("Personnels");
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_ResponsableDelegue:
				return ObjetTraduction_1.GTraductions.getValeur("ResponsablesDelegues");
			default:
				return "";
		}
	}
	static getLibelleInfosTousDeGenrePublic(aGenre) {
		switch (aGenre) {
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_Professeur:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.modalites.modelePartageTousProf",
				);
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_Personnel:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.modalites.modelePartageTousPerso",
				);
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_ResponsableDelegue:
				return ObjetTraduction_1.GTraductions.getValeur(
					"actualites.modalites.modelePartageTousResp",
				);
			default:
				return "";
		}
	}
	static getIndentation(aLvl = 1) {
		return " ".repeat(aLvl * 2);
	}
	static getInfosModalite(aModalite, aParams = {}) {
		var _a, _b, _c;
		if (!aModalite) {
			return "";
		}
		const lParams = Object.assign(
			{ pourTitle: true, avecLibelleDuGenre: true, indentation: 1 },
			aParams,
		);
		const lEstTous =
			(aModalite === null || aModalite === void 0
				? void 0
				: aModalite.typeModalite) ===
			TypeGenrePublicPartageModeleActualite_1.TypeModalitePartageModeleActualite
				.tmpma_Tous;
		const lEstPerso =
			(aModalite === null || aModalite === void 0
				? void 0
				: aModalite.typeModalite) ===
				TypeGenrePublicPartageModeleActualite_1
					.TypeModalitePartageModeleActualite.tmpma_Personnalise &&
			((_a = aModalite.listeIndividuPersonnalises) === null || _a === void 0
				? void 0
				: _a.count()) > 0;
		const lGenre = aModalite.getGenre();
		if (lParams.pourTitle) {
			if (lEstTous) {
				return ObjetFenetre_PartageModeleActualite.getLibelleInfosTousDeGenrePublic(
					lGenre,
				).toTitle();
			}
			if (lEstPerso) {
				const lLibelle = [];
				if (lParams.avecLibelleDuGenre) {
					lLibelle.push(
						ObjetFenetre_PartageModeleActualite.getLibelleDeGenrePublic(lGenre),
					);
				}
				(_b =
					aModalite === null || aModalite === void 0
						? void 0
						: aModalite.listeIndividuPersonnalises) === null || _b === void 0
					? void 0
					: _b.parcourir((aIndividu) => {
							lLibelle.push(
								(MethodesObjet_1.MethodesObjet.isNumeric(lParams.indentation)
									? ObjetFenetre_PartageModeleActualite.getIndentation(
											lParams.indentation,
										)
									: "") + aIndividu.getLibelle(),
							);
						});
				return lLibelle.join("\n").toTitle();
			}
		} else {
			return IE.jsx.str(
				"div",
				null,
				lEstTous &&
					IE.jsx.str("p", null, this.getLibelleInfosTousDeGenrePublic(lGenre)),
				lEstPerso &&
					IE.jsx.str(
						"div",
						{
							class:
								ObjetFenetre_PartageModeleActualite_module_css_1
									.StylesObjetFenetre_PartageModeleActualite.ctn,
						},
						lParams.avecLibelleDuGenre &&
							IE.jsx.str(
								"p",
								null,
								ObjetFenetre_PartageModeleActualite.getLibelleDeGenrePublic(
									lGenre,
								),
								" :",
							),
						IE.jsx.str(
							"ul",
							null,
							(_c =
								aModalite === null || aModalite === void 0
									? void 0
									: aModalite.listeIndividuPersonnalises) === null ||
								_c === void 0
								? void 0
								: _c.getTableau((aIndividu) =>
										IE.jsx.str("li", null, aIndividu.getLibelle()),
									),
						),
					),
			);
		}
		return "";
	}
	static getTitleListeModalites(aListeModalites) {
		if (!aListeModalites) {
			return "";
		}
		const lResult = [
			ObjetTraduction_1.GTraductions.getValeur("actualites.partageAvec"),
		];
		aListeModalites.parcourir((aModalite) => {
			lResult.push(
				ObjetFenetre_PartageModeleActualite.getIndentation(1) +
					ObjetFenetre_PartageModeleActualite.getInfosModalite(aModalite, {
						indentation: 2,
					}),
			);
		});
		return lResult.join("\n").toTitle();
	}
	getValeurinitInfosModalites() {
		const lInfosModalites = new Map();
		for (const lCle of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeGenrePublicPartageModeleActualite_1.TypeGenrePublicPartageModeleActualite,
		)) {
			const lGenrePublic =
				TypeGenrePublicPartageModeleActualite_1
					.TypeGenrePublicPartageModeleActualite[lCle];
			if (
				lGenrePublic ===
					TypeGenrePublicPartageModeleActualite_1
						.TypeGenrePublicPartageModeleActualite.tgppma_ResponsableDelegue &&
				!this.parametreSco.ActivationMessagerieEntreParents
			) {
				continue;
			}
			const lModalite = this.getModalite(lGenrePublic);
			this.ajouterUtilisateurDansListeIndividuPerso(lModalite, lGenrePublic);
			if (this.genreAffichage === EGenreAffichage.Information && !lModalite) {
				continue;
			}
			const lValue =
				lModalite &&
				(lModalite.typeModalite ===
					TypeGenrePublicPartageModeleActualite_1
						.TypeModalitePartageModeleActualite.tmpma_Tous ||
					(lModalite.typeModalite ===
						TypeGenrePublicPartageModeleActualite_1
							.TypeModalitePartageModeleActualite.tmpma_Personnalise &&
						!!lModalite.listeIndividuPersonnalises));
			lInfosModalites.set(lGenrePublic, lValue);
		}
		return lInfosModalites;
	}
	setDonnees(aActualite) {
		this.modele = MethodesObjet_1.MethodesObjet.dupliquer(aActualite);
		this.modeleOriginal = aActualite;
		this.initAff();
		this.infosModalites = this.getValeurinitInfosModalites();
		this.afficher(this.composeContenu());
		this.actualiserCompteur();
	}
	initAff() {
		var _a;
		this.genreAffichage = (
			(_a = this.modele) === null || _a === void 0
				? void 0
				: _a.estAuteur
		)
			? EGenreAffichage.Edition
			: EGenreAffichage.Information;
		switch (this.genreAffichage) {
			case EGenreAffichage.Edition:
				this.setOptionsFenetre({
					listeBoutons: [
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						ObjetTraduction_1.GTraductions.getValeur("Valider"),
					],
					addParametresValidation: this.addParametresValidation.bind(this),
				});
				break;
			case EGenreAffichage.Information:
				this.setOptionsFenetre({
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
				});
				break;
		}
	}
	getValeurCBModalite(aGenre) {
		var _a;
		return !!((_a = this.infosModalites) === null || _a === void 0
			? void 0
			: _a.get(aGenre));
	}
	setValeurCBModalite(aGenre, aValue) {
		var _a;
		(_a = this.infosModalites) === null || _a === void 0
			? void 0
			: _a.set(aGenre, aValue);
	}
	getModalite(aGenre) {
		var _a, _b;
		return (_b =
			(_a = this.modele) === null || _a === void 0
				? void 0
				: _a.listeModalitesParPublic) === null || _b === void 0
			? void 0
			: _b.getElementParGenre(aGenre);
	}
	addModalite(aModalite) {
		var _a;
		if (
			!((_a = this.modele) === null || _a === void 0
				? void 0
				: _a.listeModalitesParPublic)
		) {
			this.modele.listeModalitesParPublic =
				new ObjetListeElements_1.ObjetListeElements();
		}
		this.modele.listeModalitesParPublic.add(aModalite);
		this.actualiserCompteur();
	}
	initModalite(aGenre) {
		const lModalite = ObjetElement_1.ObjetElement.create({
			Numero: -1,
			Libelle: "",
			Etat: Enumere_Etat_1.EGenreEtat.Creation,
			Genre: aGenre,
			typeModalite:
				TypeGenrePublicPartageModeleActualite_1
					.TypeModalitePartageModeleActualite.tmpma_Tous,
			listeIndividuPersonnalises: new ObjetListeElements_1.ObjetListeElements(),
		});
		this.ajouterUtilisateurDansListeIndividuPerso(lModalite, aGenre);
		return lModalite;
	}
	ajouterUtilisateurDansListeIndividuPerso(aModalite, aGenre) {
		if (!aModalite) {
			return;
		}
		const lUtilisateur = this.etatUtilisateurSco.getUtilisateur();
		const lGenreUtilisateur = lUtilisateur.getGenre();
		const lEstProfOuPerso =
			(aGenre ===
				TypeGenrePublicPartageModeleActualite_1
					.TypeGenrePublicPartageModeleActualite.tgppma_Professeur &&
				lGenreUtilisateur === Enumere_Ressource_1.EGenreRessource.Enseignant) ||
			(aGenre ===
				TypeGenrePublicPartageModeleActualite_1
					.TypeGenrePublicPartageModeleActualite.tgppma_Personnel &&
				lGenreUtilisateur === Enumere_Ressource_1.EGenreRessource.Personnel);
		if (
			this.genreAffichage === EGenreAffichage.Edition &&
			this.modele.estAuteur &&
			lEstProfOuPerso
		) {
			if (!aModalite.listeIndividuPersonnalises) {
				aModalite.listeIndividuPersonnalises =
					new ObjetListeElements_1.ObjetListeElements();
			}
			if (
				!aModalite.listeIndividuPersonnalises.getElementParNumero(
					lUtilisateur.getNumero(),
				)
			) {
				aModalite.listeIndividuPersonnalises.add(
					new ObjetElement_1.ObjetElement(
						lUtilisateur.getLibelle(),
						lUtilisateur.getNumero(),
						lUtilisateur.getGenre(),
					),
				);
			}
		}
	}
	jsxModelRadioTypePartage(aGenre, aTypePartage) {
		return {
			getValue: () => {
				var _a;
				return (
					((_a = this.getModalite(aGenre)) === null || _a === void 0
						? void 0
						: _a.typeModalite) === aTypePartage
				);
			},
			setValue: () => {
				var _a;
				const lModalite = this.getModalite(aGenre);
				if (!lModalite) {
				}
				lModalite.typeModalite = aTypePartage;
				lModalite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				(_a = this.modele) === null || _a === void 0
					? void 0
					: _a.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			},
			getDisabled: () => {
				return !this.getValeurCBModalite(aGenre);
			},
			getName: () => {
				return `${this.Nom}_TypePartage`;
			},
		};
	}
	jsxModelCheckboxModalite(aGenre) {
		return {
			getValue: () => {
				var _a;
				return (_a = this.getValeurCBModalite(aGenre)) !== null && _a !== void 0
					? _a
					: false;
			},
			setValue: (aValue) => {
				var _a, _b;
				this.setValeurCBModalite(aGenre, aValue);
				(_a = this.modele) === null || _a === void 0
					? void 0
					: _a.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				if (aValue && !this.getModalite(aGenre)) {
					this.addModalite(this.initModalite(aGenre));
					return;
				}
				(_b = this.getModalite(aGenre)) === null || _b === void 0
					? void 0
					: _b.setEtat(
							aValue
								? Enumere_Etat_1.EGenreEtat.Modification
								: Enumere_Etat_1.EGenreEtat.Suppression,
						);
			},
			getDisabled: () => {
				return false;
			},
		};
	}
	jsxModelBtnSelecModalite(aGenre) {
		return {
			event: () => {
				this.ouvrirFenetreSelectionPublic(aGenre);
			},
			getDisabled: () => this.getDisabledSelecteur(aGenre),
		};
	}
	jsxGetClassCompteur(aGenre) {
		return this.getDisabledSelecteur(aGenre)
			? ObjetFenetre_PartageModeleActualite_module_css_1
					.StylesObjetFenetre_PartageModeleActualite.couleurDisabled
			: "";
	}
	getDisabledSelecteur(aGenre) {
		var _a;
		const lEstCoche = this.getValeurCBModalite(aGenre);
		const lEstPersonnalise =
			((_a = this.getModalite(aGenre)) === null || _a === void 0
				? void 0
				: _a.typeModalite) ===
			TypeGenrePublicPartageModeleActualite_1.TypeModalitePartageModeleActualite
				.tmpma_Personnalise;
		return !(lEstCoche && lEstPersonnalise);
	}
	getAriaLabelDeGenrePublic(aGenre) {
		switch (aGenre) {
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_Professeur:
				return ObjetTraduction_1.GTraductions.getValeur(
					"WAI.SelectionProfesseur",
				);
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_Personnel:
				return ObjetTraduction_1.GTraductions.getValeur(
					"WAI.SelectionPersonnel",
				);
			case TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_ResponsableDelegue:
				return ObjetTraduction_1.GTraductions.getValeur(
					"WAI.SelectionResponsable",
				);
			default:
				return "";
		}
	}
	actualiserCompteur() {
		this.infosModalites.forEach((aVal, aGenre) => {
			var _a, _b;
			const lModalite = this.getModalite(aGenre);
			const lCompteur =
				(_b =
					(_a =
						lModalite === null || lModalite === void 0
							? void 0
							: lModalite.listeIndividuPersonnalises) === null || _a === void 0
						? void 0
						: _a.count()) !== null && _b !== void 0
					? _b
					: 0;
			const lTotal = this.getTotalIndividuParGenrePublic(aGenre);
			const lHtml = IE.jsx.str(
				"span",
				{
					title: ObjetFenetre_PartageModeleActualite.getInfosModalite(
						lModalite,
						{ avecLibelleDuGenre: false },
					),
				},
				lCompteur,
				lTotal && IE.jsx.str(IE.jsx.fragment, null, "/", lTotal),
			);
			ObjetHtml_1.GHtml.setHtml(this.getIdDeGenre(aGenre), lHtml);
		});
	}
	getTotalIndividuParGenrePublic(aGenre) {
		var _a, _b, _c;
		if (!MethodesObjet_1.MethodesObjet.isNumber(aGenre)) {
			return null;
		}
		const lGenreRessource = (0,
		TypeGenrePublicPartageModeleActualite_1.TypeGenrePublicPartageModeleActualiteToGenreRessource)(
			aGenre,
		);
		if (!lGenreRessource) {
			return null;
		}
		const lTotal =
			(_c =
				(_b =
					(_a = this.modele) === null || _a === void 0
						? void 0
						: _a.nombresTotalIndividuParGenrePublic) === null || _b === void 0
					? void 0
					: _b.find((aTotal) => aTotal.genre === lGenreRessource)) === null ||
			_c === void 0
				? void 0
				: _c.total;
		return lTotal || null;
	}
	getIdDeGenre(aGenre) {
		return `${this.Nom}_${aGenre}`;
	}
	composeContenu() {
		if (!this.modele) {
			return "";
		}
		if (this.genreAffichage === EGenreAffichage.Information) {
			return this.composeContenueInformation();
		}
		return IE.jsx.str(
			"div",
			{
				class: [
					Divers_css_1.StylesDivers.flexContain,
					Divers_css_1.StylesDivers.flexGapXl,
					Divers_css_1.StylesDivers.cols,
				],
			},
			Array.from(this.infosModalites).map(([aGenre]) => {
				return IE.jsx.str(
					"div",
					{
						class: [
							Divers_css_1.StylesDivers.flexContain,
							Divers_css_1.StylesDivers.cols,
							Divers_css_1.StylesDivers.flexGap,
						],
					},
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModelCheckboxModalite.bind(this, aGenre) },
						ObjetFenetre_PartageModeleActualite.getLibelleDeGenrePublic(aGenre),
					),
					IE.jsx.str(
						"div",
						{
							class: [
								Divers_css_1.StylesDivers.flexContain,
								Divers_css_1.StylesDivers.cols,
								Divers_css_1.StylesDivers.flexGap,
								ObjetFenetre_PartageModeleActualite_module_css_1
									.StylesObjetFenetre_PartageModeleActualite.marginLeft,
							],
						},
						IE.jsx.str(
							"ie-radio",
							{
								"ie-model": this.jsxModelRadioTypePartage.bind(
									this,
									aGenre,
									TypeGenrePublicPartageModeleActualite_1
										.TypeModalitePartageModeleActualite.tmpma_Tous,
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("tous"),
						),
						IE.jsx.str(
							"div",
							{
								class: [
									Divers_css_1.StylesDivers.flexContain,
									Divers_css_1.StylesDivers.flexGap,
								],
							},
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModelRadioTypePartage.bind(
										this,
										aGenre,
										TypeGenrePublicPartageModeleActualite_1
											.TypeModalitePartageModeleActualite.tmpma_Personnalise,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"actualites.modalites.personalisees",
								),
							),
							IE.jsx.str(
								"div",
								{
									class: [
										Divers_css_1.StylesDivers.flexContain,
										Divers_css_1.StylesDivers.flexGap,
										Divers_css_1.StylesDivers.flexCenter,
									],
								},
								IE.jsx.str("ie-bouton", {
									"ie-model": this.jsxModelBtnSelecModalite.bind(this, aGenre),
									"aria-label": this.getAriaLabelDeGenrePublic(aGenre),
									"aria-haspopup": "dialog",
								}),
								IE.jsx.str("p", {
									id: this.getIdDeGenre(aGenre),
									"ie-class": this.jsxGetClassCompteur.bind(this, aGenre),
								}),
							),
						),
					),
				);
			}),
		);
	}
	composeContenueInformation() {
		return IE.jsx.str(
			"div",
			{
				class: [
					Divers_css_1.StylesDivers.flexContain,
					Divers_css_1.StylesDivers.cols,
					Divers_css_1.StylesDivers.flexGapL,
				],
			},
			Array.from(this.infosModalites).map(([aGenre]) => {
				const lModalite = this.getModalite(aGenre);
				return ObjetFenetre_PartageModeleActualite.getInfosModalite(lModalite, {
					pourTitle: false,
				});
			}),
		);
	}
	async ouvrirFenetreSelectionPublic(aGenre) {
		var _a, _b;
		if (
			aGenre ===
			TypeGenrePublicPartageModeleActualite_1
				.TypeGenrePublicPartageModeleActualite.tgppma_Personnel
		) {
			if (!this.avecRequetePersonnelDejaLancee) {
				Cache_1.GCache.general._jetonViderCacheListePublics = true;
			}
			this.avecRequetePersonnelDejaLancee = true;
		}
		const lModalite = this.getModalite(aGenre);
		const lGenreRessource = (0,
		TypeGenrePublicPartageModeleActualite_1.TypeGenrePublicPartageModeleActualiteToGenreRessource)(
			aGenre,
		);
		const lListeRessourceDesactiver =
			new ObjetListeElements_1.ObjetListeElements();
		const lUtilisateur = this.etatUtilisateurSco.getUtilisateur();
		const lElementUtilisateurDansListe =
			(_a =
				lModalite === null || lModalite === void 0
					? void 0
					: lModalite.listeIndividuPersonnalises) === null || _a === void 0
				? void 0
				: _a.getElementParNumero(lUtilisateur.getNumero());
		if (
			lUtilisateur.getGenre() === lGenreRessource &&
			lElementUtilisateurDansListe
		) {
			lListeRessourceDesactiver.add(lElementUtilisateurDansListe);
		}
		this.moteurDestinataires.ouvrirModaleSelectionPublic({
			genreRessource: lGenreRessource,
			listePublicDonnee:
				(_b =
					lModalite === null || lModalite === void 0
						? void 0
						: lModalite.listeIndividuPersonnalises) !== null && _b !== void 0
					? _b
					: new ObjetListeElements_1.ObjetListeElements(),
			avecUniquementResponsableDelegue:
				aGenre ===
				TypeGenrePublicPartageModeleActualite_1
					.TypeGenrePublicPartageModeleActualite.tgppma_ResponsableDelegue,
			estCtxModeleActualite: true,
			listeRessourceDesactiver: lListeRessourceDesactiver,
			clbck: (aParams) => {
				var _a;
				lModalite.listeIndividuPersonnalises =
					new ObjetListeElements_1.ObjetListeElements(
						aParams.listePublicDonnee,
					);
				lModalite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				(_a = this.modele) === null || _a === void 0
					? void 0
					: _a.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.actualiserCompteur();
			},
		});
	}
	addParametresValidation(aParams) {
		let lActu = this.modeleOriginal;
		if (aParams.numeroBouton === 1) {
			lActu = this.modele;
			if (
				this.modeleOriginal.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
			) {
				lActu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			}
			this.infosModalites.forEach((aValue, aGenre) => {
				if (!aValue) {
					lActu.listeModalitesParPublic.remove(
						lActu.listeModalitesParPublic.getIndiceElementParFiltre(
							(aElement) => aElement.getGenre() === aGenre,
						),
					);
				}
			});
		}
		return { actualite: lActu };
	}
	surFermer() {
		super.surFermer();
		if (this.avecRequetePersonnelDejaLancee) {
			Cache_1.GCache.general._jetonViderCacheListePublics = true;
		}
	}
}
exports.ObjetFenetre_PartageModeleActualite =
	ObjetFenetre_PartageModeleActualite;
