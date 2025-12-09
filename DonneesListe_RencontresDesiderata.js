exports.DonneesListe_RencontresDesiderata = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetChaine_1 = require("ObjetChaine");
const UtilitaireRencontres_1 = require("UtilitaireRencontres");
const Enumere_VoeuRencontre_1 = require("Enumere_VoeuRencontre");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const IEHtml_1 = require("IEHtml");
class DonneesListe_RencontresDesiderata extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.avecEleve = aParams.avecEleve;
		this.autorisations = aParams.autorisations;
		this.callbackDuree = aParams.callbackDuree;
		this.callbackEditionDesiderata = aParams.callbackEditionDesiderata;
		this.avecSaisie = aParams.avecSaisie;
		this.duree = { min: 3, max: 30 };
		this.setOptions({
			avecEvnt_Selection: false,
			avecSelection: false,
			avecDeselectionSurNonSelectionnable: false,
			avecEvnt_SelectionDblClick: false,
			avecBoutonActionLigne: false,
			avecTri: false,
			flatDesignMinimal: true,
		});
		this.avecSaisieDuree = [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
		].includes(GEtatUtilisateur.GenreEspace);
	}
	_getNombreVoeuxSaisies(aGenreVoeux) {
		if (this.autorisations.listeVoeux) {
			const lListeVoeuxSaisieDuGenre = this.Donnees.getListeElements(
				(aElement) => {
					return aElement.validationvoeu && aElement.voeu === aGenreVoeux;
				},
			);
			return lListeVoeuxSaisieDuGenre.count();
		}
		return 0;
	}
	estUnVoeuSaisissable(aNumero, aGenreVoeux) {
		const lElement = this.Donnees.getElementParNumero(aNumero);
		const lNombreSaisie = this._getNombreVoeuxSaisies(aGenreVoeux);
		const lLimiteVoeux =
			UtilitaireRencontres_1.TUtilitaireRencontre.getLimiteNbSaisissable(
				this.autorisations.listeVoeux,
				aGenreVoeux,
			);
		let lSaisiePossible = false;
		let lAvecMessage = false;
		if (lElement) {
			if (lLimiteVoeux === 0) {
				lSaisiePossible =
					!lElement.validationvoeu || aGenreVoeux !== lElement.voeu;
			} else {
				if (lNombreSaisie < lLimiteVoeux) {
					lSaisiePossible =
						!lElement.validationvoeu || aGenreVoeux !== lElement.voeu;
				} else {
					if (lElement.validationvoeu && lElement.voeu === aGenreVoeux) {
						lSaisiePossible = true;
					} else {
						lAvecMessage = true;
					}
				}
			}
		}
		return { saisiePossible: lSaisiePossible, avecMessage: lAvecMessage };
	}
	getResponsables(aArticle) {
		return aArticle.responsables
			? aArticle.responsables.getTableauLibelles().join(", ")
			: "";
	}
	getZoneGauche(aParams) {
		const lCouleurFond = aParams.article.couleurMatiere
			? `style="${ObjetStyle_1.GStyle.composeCouleurFond(aParams.article.couleurMatiere)}"`
			: "";
		return !this.avecSaisieDuree && !aParams.article.estUnDeploiement
			? `<div class="trait-couleur" ${lCouleurFond}></div>`
			: "";
	}
	getInfosSuppZonePrincipale(aParams) {
		return [
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
		].includes(GEtatUtilisateur.GenreEspace)
			? aParams.article.strMatiereFonction || "&nbsp;"
			: this.getResponsables(aParams.article);
	}
	getTitreZonePrincipale(aParams) {
		let lTitre = "";
		if (aParams.article.estUnDeploiement) {
			lTitre = aParams.article.classe
				? aParams.article.classe.getLibelle()
				: aParams.article.getLibelle();
		} else if (
			[
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			const lLibelles = [];
			aParams.article.listeInterlocuteursTriees.parcourir((aInterlocuteur) => {
				let lLibelle = [aInterlocuteur.getLibelle()];
				if (aInterlocuteur.estPP) {
					lLibelle.push(
						`(${ObjetTraduction_1.GTraductions.getValeur("ProfPrincipal")})`,
					);
				}
				if (aInterlocuteur.estTuteur) {
					lLibelle.push(
						`(${ObjetTraduction_1.GTraductions.getValeur("Tuteur")})`,
					);
				}
				lLibelles.push(lLibelle.join(" "));
			});
			lTitre = aParams.article.listeInterlocuteursTriees
				? lLibelles.join(", ")
				: "";
		} else {
			lTitre = aParams.article.titre ? aParams.article.titre : "";
		}
		return lTitre;
	}
	jsxModeleRbDesiderata(aArticle, aVoeu) {
		return {
			getValue: () => {
				return aArticle.validationvoeu && aArticle.voeu === aVoeu.getGenre();
			},
			setValue: (aValue) => {
				const lVerif = this.estUnVoeuSaisissable(
					aArticle.getNumero(),
					aVoeu.getGenre(),
				);
				if (lVerif.saisiePossible) {
					aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aArticle.validationvoeu = aArticle.validationvoeu
						? aArticle.voeu !== aVoeu.getGenre()
						: true;
					aArticle.voeu = aVoeu.getGenre();
					this.callbackEditionDesiderata(aArticle);
				} else {
					if (lVerif.avecMessage) {
						const lLimite =
							UtilitaireRencontres_1.TUtilitaireRencontre.getLimiteNbSaisissable(
								this.autorisations.listeVoeux,
								aVoeu.getGenre(),
							);
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"Rencontres.saisieImpossible",
							),
							message:
								ObjetTraduction_1.GTraductions.getValeur(
									lLimite === 1
										? "Rencontres.desiderataAutorise"
										: "Rencontres.desiderataAutorisesPluriel",
									[lLimite],
								) +
								"<br>" +
								ObjetTraduction_1.GTraductions.getValeur(
									[
										Enumere_Espace_1.EGenreEspace.Parent,
										Enumere_Espace_1.EGenreEspace.Mobile_Parent,
									].includes(GEtatUtilisateur.GenreEspace)
										? "Rencontres.msgDesactiveResponsable"
										: "Rencontres.msgDesactiveEnseignant",
								),
						});
					}
					IEHtml_1.default.refresh();
				}
			},
			getName: () => {
				return `RbDesiderata_${aArticle.getNumero()}`;
			},
			getDisabled: () => {
				return !(this.autorisations.saisieDesiderata && this.avecSaisie);
			},
		};
	}
	getZoneMessage(aParams) {
		if (aParams.article.estUnDeploiement || aParams.article.estUnEleve) {
			return;
		}
		const lClasse = IE.estMobile ? "m-left-nega-xl" : "justify-end";
		return IE.jsx.str(
			"fieldset",
			{ class: ["flex-contain m-top-l f-wrap no-border", lClasse] },
			IE.jsx.str(
				"legend",
				{ class: "sr-only" },
				this.getTitreZonePrincipale(aParams),
			),
			(aTab) => {
				if (this.autorisations && this.autorisations.listeVoeux) {
					this.autorisations.listeVoeux.parcourir((aVoeu) => {
						aTab.push(
							IE.jsx.str(
								"div",
								{ class: ["voeux"] },
								IE.jsx.str(
									"ie-radio",
									{
										"ie-model": this.jsxModeleRbDesiderata.bind(
											this,
											aParams.article,
											aVoeu,
										),
										class: [
											"as-chips",
											"m-right",
											"m-bottom-l",
											Enumere_VoeuRencontre_1.TypeVoeuRencontreUtil.getClass(
												aVoeu.getGenre(),
											),
										],
									},
									Enumere_VoeuRencontre_1.TypeVoeuRencontreUtil.getLibelle(
										aVoeu.getGenre(),
									),
								),
								!!aVoeu.limiteNbSaisies
									? IE.jsx.str(
											"span",
											{ class: "ie-titre-petit" },
											ObjetTraduction_1.GTraductions.getValeur(
												"Rencontres.max",
												[aVoeu.limiteNbSaisies],
											),
										)
									: "",
							),
						);
					});
				}
			},
		);
	}
	getZoneComplementaire(aParams) {
		if (aParams.article.duree) {
			const lDuree =
				aParams.article.duree.toString() +
				" " +
				ObjetTraduction_1.GTraductions.getValeur("Rencontres.abbrMin");
			let lAttr = {};
			if (this.autorisations.saisieDuree) {
				const lFuncEvenVal = () => {
					this._ouvrirFenetreModifierDuree(aParams.article);
				};
				lAttr = {
					tabindex: "0",
					role: "button",
					"aria-haspopup": "dialog",
					"ie-eventvalidation": lFuncEvenVal,
				};
			}
			return IE.jsx.str(
				"div",
				Object.assign(
					{
						class:
							"flex-contain" +
							(this.autorisations.saisieDuree ? " AvecMain" : ""),
					},
					lAttr,
				),
				IE.jsx.str("i", {
					role: "img",
					class: "icon_edt_permanence i-as-deco",
					title: ObjetTraduction_1.GTraductions.getValeur("Duree"),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur("Duree"),
				}),
				lDuree,
			);
		}
		return "";
	}
	getTri() {
		const lTris = [];
		if (this.avecEleve) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return D.classe ? D.classe.getLibelle() : "";
				}),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return D.eleve ? D.eleve.getLibelle() : "";
				}),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return D.strMatiereFonction || "";
				}),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return D.strResponsables || "";
				}),
			);
		} else {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return !!D.pere
						? D.pere.getNumero() !== Enumere_Espace_1.EGenreEspace.Professeur
						: D.getNumero() !== Enumere_Espace_1.EGenreEspace.Professeur;
				}),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.estUnDeploiement;
				}),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					if (
						!!D.pere &&
						!!D.listeInterlocuteursTriees &&
						D.listeInterlocuteursTriees.count() > 0
					) {
						return D.listeInterlocuteursTriees
							.getPremierElement()
							.getPosition();
					} else {
						return 0;
					}
				}),
			);
		}
		return lTris;
	}
	_ouvrirFenetreModifierDuree(aRencontre) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: function (aGenreBouton) {
					if (aGenreBouton) {
						aRencontre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.callbackDuree(aRencontre);
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur("Duree"),
						largeur: 300,
						hauteur: 200,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		const lAncienneDuree = aRencontre.duree;
		const lModel = () => {
			return {
				getValue() {
					return aRencontre.duree;
				},
				setValue(aValue) {
					const lDuree = ObjetChaine_1.GChaine.strToInteger(aValue || "0");
					aRencontre.duree = lDuree;
				},
				exitChange: () => {
					if (
						aRencontre.duree < this.duree.min ||
						aRencontre.duree > this.duree.max
					) {
						aRencontre.duree = lAncienneDuree;
						GApplication.getMessage().afficher({
							message: ObjetTraduction_1.GTraductions.getValeur(
								"ErreurMinMaxEntier",
								[this.duree.min, this.duree.max],
							),
						});
					}
				},
			};
		};
		const lHtml = IE.jsx.str("input", {
			type: "number",
			"ie-model": lModel,
			class: "EspaceInput",
			style: "width:100%;",
			title: ObjetTraduction_1.GTraductions.getValeur("Duree"),
		});
		lFenetre.afficher(lHtml);
	}
}
exports.DonneesListe_RencontresDesiderata = DonneesListe_RencontresDesiderata;
