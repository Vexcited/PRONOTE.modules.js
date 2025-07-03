exports.PageCahierDeTexte = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Direction_1 = require("Enumere_Direction");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetWAI_1 = require("ObjetWAI");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const EGenreTriCDT_1 = require("EGenreTriCDT");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetElement_1 = require("ObjetElement");
const AccessApp_1 = require("AccessApp");
class PageCahierDeTexte extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.afficheTitre = true;
		this.afficheTitresContenuEtTAF = false;
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte();
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPreResize,
			this.surPreResize,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this.surPostResize,
		);
		this.options = { callbackContextMenuCDT: null };
		this.IdPremierElement = this.Nom + "_Contenu_cdt";
	}
	surPreResize() {
		this.afficher("&nbsp;");
	}
	surPostResize() {
		this.afficher();
		this.recupererDonnees();
	}
	setDonnees(aListeTravailAFaire, aListeCahierDeTextes) {
		this.ListeTravailAFaire = aListeTravailAFaire;
		this.ListeCahierDeTextes = aListeCahierDeTextes;
		this.DonneesRecues = true;
	}
	setParametres(aAfficheTitre, aAfficheTitreContenuEtTAF) {
		this.afficheTitre =
			aAfficheTitre === null || aAfficheTitre === undefined
				? true
				: aAfficheTitre;
		this.afficheTitresContenuEtTAF =
			aAfficheTitreContenuEtTAF === null ||
			aAfficheTitreContenuEtTAF === undefined
				? false
				: aAfficheTitreContenuEtTAF;
	}
	setOptionsCDT(aOptions) {
		$.extend(this.options, aOptions);
	}
	actualiser(aModeAffichage, aGenreTri, aNumeroMatiere) {
		this.DonneesActualisees = true;
		this.ModeAffichage = aModeAffichage;
		this.TypeTri = aGenreTri;
		this.NumeroMatiereSelectionne = aNumeroMatiere;
		if (this.TypeTri !== null && this.TypeTri !== undefined) {
			const LListe =
				this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire
					? this.ListeTravailAFaire
					: this.ListeCahierDeTextes;
			if (
				this.ModeAffichage !==
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire
			) {
				LListe.parcourir((D) => {
					if (D.ListeTravailAFaire) {
						D.ListeTravailAFaire.setTri([
							ObjetTri_1.ObjetTri.init("PourLe"),
							ObjetTri_1.ObjetTri.init("Genre"),
							ObjetTri_1.ObjetTri.init("Numero"),
						]);
						D.ListeTravailAFaire.trier();
					}
				});
			}
			if (
				this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire
			) {
				LListe.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						return this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
							? D.PourLe
							: D.Matiere.Numero === this.NumeroMatiereSelectionne;
					}),
					ObjetTri_1.ObjetTri.init("Matiere.Libelle"),
					ObjetTri_1.ObjetTri.init((D) => {
						return this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
							? null
							: D.PourLe;
					}),
					ObjetTri_1.ObjetTri.init("DonneLe"),
					ObjetTri_1.ObjetTri.init("Genre"),
					ObjetTri_1.ObjetTri.init("Numero"),
				]);
			} else {
				LListe.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						return this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParMatiere
							? D.Matiere.Numero === this.NumeroMatiereSelectionne
							: false;
					}),
					ObjetTri_1.ObjetTri.init("Date"),
					ObjetTri_1.ObjetTri.init("Numero"),
				]);
			}
			LListe.trier();
		}
		this.afficher();
		this.recupererDonnees();
	}
	construireAffichage() {
		if (this.DonneesRecues && this.DonneesActualisees) {
			return this.composePage();
		} else {
			return "";
		}
	}
	recupererDonnees() {
		if (this.options.callbackContextMenuCDT) {
			$('[id^="' + (this.Nom + "_ind_").escapeJQ() + '"]').on(
				"contextmenu",
				{ instance: this },
				function (event) {
					const lIndice = ObjetHtml_1.GHtml.extraireNombreDId(this.id),
						lInstance = event.data.instance,
						lElement = lInstance.ListeCahierDeTextes.get(lIndice);
					lInstance.options.callbackContextMenuCDT(event, lElement);
				},
			);
		}
	}
	composePage(aPourImpression) {
		const lHtml = [];
		this.DonneePrincipaleCourante = "";
		this.DonneeSecondaireCourante = "";
		this.DonneLeCourant = "";
		this.PourImpression = aPourImpression ? aPourImpression : false;
		this.PremierID = [];
		this.PremierPrincipaleElement = "";
		this.IDSecondairPrecedent = "";
		this.IDPrincipalPrecedent = "";
		this.NumeroPrincipal = 0;
		const lTabIndex = aPourImpression ? 'tabindex="-1"' : 'tabindex="0"';
		this.tableauPiecesJointes = [];
		lHtml.push(
			'<div id="',
			this.IdPremierElement,
			'"',
			lTabIndex,
			' onkeyup="',
			this.Nom,
			'.surPremierPrincipaleElement ()" class="overflow-auto" >',
		);
		if (this.afficheTitre) {
			lHtml.push(
				ObjetWAI_1.GObjetWAI.composeSpan(
					this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
						? ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.wai.SelectJour",
							) + ", "
						: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.wai.SelectMatiere",
							) + ", ",
				),
				ObjetWAI_1.GObjetWAI.composeSpan(
					ObjetWAI_1.EGenreObjet.NavigationVertical,
				),
				ObjetWAI_1.GObjetWAI.composeSpan(
					this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
						? ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.wai.DetailsMatiereDuJour",
							) + " "
						: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.wai.DetailsJourDeLaMatiere",
							) + " ",
				),
			);
		}
		lHtml.push(
			ObjetWAI_1.GObjetWAI.composeSpan(
				this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
					? ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.wai.NavigationMatiere",
						) + ", "
					: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.wai.NavigationJour",
						) + ", ",
			),
			ObjetWAI_1.GObjetWAI.composeSpan(
				ObjetWAI_1.EGenreObjet.NavigationVertical,
			),
		);
		if (this.afficheTitre) {
			lHtml.push(
				ObjetWAI_1.GObjetWAI.composeSpan(
					this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
						? ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.wai.NavigationMatiereRetour",
							) + " "
						: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.wai.NavigationJourRetour",
							) + " ",
				),
			);
		}
		lHtml.push(
			'<div class="p-all full-size flex-contain cols ',
			aPourImpression ? " AvecSelectionTexte" : "",
			'">',
		);
		const lListe =
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
				? this.ListeTravailAFaire
				: this.ListeCahierDeTextes;
		const lNbrElements = lListe.count();
		for (let I = 0; I < lNbrElements; I++) {
			const lTravailAFaire = lListe.get(I);
			if (this.verifieConditionAffichageElement(lTravailAFaire)) {
				this.ValeurPrincipaleElementCourant =
					this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
						? this.ModeAffichage ===
							Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
								.TravailAFaire
							? lTravailAFaire.PourLe
							: new Date(
									lTravailAFaire.Date.getFullYear(),
									lTravailAFaire.Date.getMonth(),
									lTravailAFaire.Date.getDate(),
								)
						: lTravailAFaire.Matiere.Libelle;
				this.TitrePrincipaleElementCourant =
					this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
						? " "
						: ObjetTraduction_1.GTraductions.getValeur("Matiere") + " : ";
				this.ValeurSecondaireElementCourant =
					this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
						? this.ModeAffichage ===
							Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
								.TravailAFaire
							? lTravailAFaire.Matiere.Libelle
							: lTravailAFaire.Date
						: this.ModeAffichage ===
								Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
									.TravailAFaire
							? lTravailAFaire.PourLe
							: lTravailAFaire.Date;
				this.TitreSecondaireElementCourant =
					this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
						? ObjetTraduction_1.GTraductions.getValeur("Matiere") + " : "
						: " ";
				if (
					this.verifieConditionNouvelleDonneePrincipale(
						this.DonneePrincipaleCourante,
						this.ValeurPrincipaleElementCourant,
					)
				) {
					lHtml.push(
						this.composeNouvelleDonneePrincipale(lTravailAFaire, lListe),
					);
				}
				if (
					this.verifieConditionNouvelleDonneeSecondaire(
						this.DonneeSecondaireCourante,
						this.ValeurSecondaireElementCourant,
					)
				) {
					if (
						this.ModeAffichage ===
							Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
								.TravailAFaire &&
						this.DonneLeCourant !== ""
					) {
						lHtml.push(this.composeFermetureGenre());
					}
					lHtml.push(this.composeNouvelleDonneeSecondaire(lTravailAFaire, I));
					lHtml.push(
						this.ModeAffichage ===
							Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
								.TravailAFaire
							? this.composeDevoirsDonneLe(lTravailAFaire)
							: this.composeContenu(lTravailAFaire),
					);
				} else {
					lHtml.push(
						this.ModeAffichage ===
							Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
								.TravailAFaire
							? this.composeDevoirSelonDonneLe(lTravailAFaire)
							: this.composeContenu(lTravailAFaire),
					);
				}
			}
		}
		lHtml.push(this.composeFermeture());
		lHtml.push("</div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	verifieConditionNouvelleDonneePrincipale(
		aDonneePrincipaleCourante,
		aValeurPrincipaleElementCourant,
	) {
		if (this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe) {
			if (
				!ObjetDate_1.GDate.estDateEgale(
					aDonneePrincipaleCourante,
					aValeurPrincipaleElementCourant,
				)
			) {
				return true;
			} else {
				return false;
			}
		} else {
			if (aDonneePrincipaleCourante !== aValeurPrincipaleElementCourant) {
				return true;
			} else {
				return false;
			}
		}
	}
	verifieConditionNouvelleDonneeSecondaire(
		aDonneeSecondaireCourante,
		aValeurSecondaireElementCourant,
	) {
		if (this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe) {
			if (aDonneeSecondaireCourante !== aValeurSecondaireElementCourant) {
				return true;
			} else {
				return false;
			}
		} else {
			if (
				!ObjetDate_1.GDate.estDateEgale(
					aDonneeSecondaireCourante,
					aValeurSecondaireElementCourant,
				)
			) {
				return true;
			} else {
				return false;
			}
		}
	}
	verifieConditionAffichageElement(aObjetTravailAFaire) {
		if (this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe) {
			return true;
		} else {
			if (
				aObjetTravailAFaire.Matiere.Numero === this.NumeroMatiereSelectionne
			) {
				return true;
			} else {
				return false;
			}
		}
	}
	composeNouvelleDonneePrincipale(aObjetTravailAFaire, aListeDonnees) {
		const lHtml = [];
		if (
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
		) {
			if (this.DonneLeCourant !== "") {
				lHtml.push(this.composeFermetureGenre());
				lHtml.push(this.composeFermetureTitreSecondaire());
			}
		} else if (this.DonneePrincipaleCourante !== "") {
			lHtml.push(this.composeFermetureTitreSecondaire());
		}
		lHtml.push(this.composeTitrePrincipal(aObjetTravailAFaire, aListeDonnees));
		this.DonneeSecondaireCourante = "";
		this.DonneLeCourant = "";
		return lHtml.join("");
	}
	composeNouvelleDonneeSecondaire(aObjetTravailAFaire, aIndice) {
		const lHtml = [];
		if (this.DonneeSecondaireCourante !== "") {
			lHtml.push(this.composeFermetureTitreSecondaire());
		}
		lHtml.push(this.composeTitreSecondaire(aObjetTravailAFaire, aIndice));
		return lHtml.join("");
	}
	composeTitrePrincipal(aObjetTravailAFaire, aListeDonnees) {
		const lHtml = [];
		this.DonneePrincipaleCourante =
			this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
				? this.ValeurPrincipaleElementCourant
				: aObjetTravailAFaire.Matiere.Libelle;
		const lLibelle =
			this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
				? ObjetDate_1.GDate.formatDate(
						this.DonneePrincipaleCourante,
						(this.ModeAffichage ===
						Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
							.TravailAFaire
							? ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.pourLe",
								) + " "
							: "") + "%JJJJ %JJ %MMMM %AAAA",
					)
				: ObjetChaine_1.GChaine.insecable(this.DonneePrincipaleCourante);
		this.IdPrincipaleElement = this.Nom + "_Nav_" + this.NumeroPrincipal;
		if (this.PremierPrincipaleElement === "") {
			this.PremierPrincipaleElement = this.IdPrincipaleElement;
		}
		if (this.IDSecondairPrecedent !== "") {
			this.ajouterAuTableaux(
				this.IDSecondairPrecedent,
				this.IdPrincipaleElement,
				null,
				Enumere_Direction_1.EGenreDirection.SensNormal,
			);
		}
		if (this.IDPrincipalPrecedent !== "") {
			this.ajouterAuTableaux(
				this.IDPrincipalPrecedent,
				this.IdPrincipaleElement,
				null,
				Enumere_Direction_1.EGenreDirection.DeuxSenses,
			);
		}
		this.IDPrincipalPrecedent = this.IdPrincipaleElement;
		this.NumeroPrincipal++;
		this.NumeroSecondair = 0;
		this.IDSecondairPrecedent = "";
		if (this.afficheTitre) {
			lHtml.push(
				'<div id="',
				this.IdPrincipaleElement,
				'" tabindex="0" ',
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Document),
				' class="Bandeau theme-neutre_bg_moyen1" onkeyup="',
				this.Nom,
				'.surPremierSecondaire (id); if (GNavigateur.isToucheFleche () || GNavigateur.isToucheSelection ()) GNavigateur.stopperEvenement (event);">',
				ObjetWAI_1.GObjetWAI.composeSpan(this.TitrePrincipaleElementCourant),
				this.composeLibelleTitrePrincipal(aListeDonnees, lLibelle),
				"</div>",
			);
		}
		return lHtml.join("");
	}
	composeLibelleTitrePrincipal(aListeDonnees, aLibelle) {
		return aLibelle;
	}
	composeTitreSecondaire(aObjetTravailAFaire, aIndice) {
		const lHtml = [];
		this.DonneeSecondaireCourante =
			this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
				? this.ModeAffichage ===
					Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.TravailAFaire
					? aObjetTravailAFaire.Matiere.Libelle
					: ObjetDate_1.GDate.formatDate(
							aObjetTravailAFaire.Date,
							"%hh%sh%mm - ",
						) + aObjetTravailAFaire.Matiere.Libelle
				: this.ModeAffichage ===
						Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
							.TravailAFaire
					? aObjetTravailAFaire.PourLe
					: ObjetDate_1.GDate.formatDate(
							aObjetTravailAFaire.Date,
							"%JJJJ %JJ %MMMM - %hh%sh%mm ",
						);
		const lID = this.IdPrincipaleElement + "_" + this.NumeroSecondair;
		if (this.NumeroSecondair === 0) {
			this.PremierID[this.IdPrincipaleElement] = lID;
			this.ajouterAuTableaux(
				this.IdPrincipaleElement,
				lID,
				Enumere_Direction_1.EGenreDirection.SensNormal,
			);
			this.ajouterAuTableaux(
				this.IdPrincipaleElement,
				lID,
				null,
				Enumere_Direction_1.EGenreDirection.SensInverse,
			);
		}
		if (this.IDSecondairPrecedent !== "") {
			this.ajouterAuTableaux(
				this.IDSecondairPrecedent,
				lID,
				null,
				Enumere_Direction_1.EGenreDirection.DeuxSenses,
			);
		}
		this.ajouterAuTableaux(
			this.IdPrincipaleElement,
			lID,
			Enumere_Direction_1.EGenreDirection.SensInverse,
		);
		this.IDSecondairPrecedent = lID;
		this.NumeroSecondair++;
		let lLibelle = ObjetChaine_1.GChaine.insecable(
			this.TypeTri === EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
				? this.DonneeSecondaireCourante
				: this.ModeAffichage ===
						Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
							.TravailAFaire
					? ObjetDate_1.GDate.formatDate(
							this.DonneeSecondaireCourante,
							ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.pourLe") +
								" %JJJJ %JJ %MMMM %AAAA",
						)
					: this.DonneeSecondaireCourante,
		);
		let lClasseSelectionnee = this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (!lClasseSelectionnee && this.etatUtilSco.getMembre()) {
			lClasseSelectionnee = this.etatUtilSco.getMembre().Classe;
		}
		if (
			aObjetTravailAFaire.listeGroupes &&
			aObjetTravailAFaire.listeGroupes.count() > 0 &&
			!!aObjetTravailAFaire.listeGroupes.get(0) &&
			lClasseSelectionnee.getNumero() !==
				aObjetTravailAFaire.listeGroupes.get(0).getNumero()
		) {
			lLibelle +=
				" (" +
				aObjetTravailAFaire.listeGroupes.getTableauLibelles().join(", ") +
				")";
		}
		lHtml.push(
			'<div id="',
			lID,
			'" tabindex="0" ',
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Document),
			' class="fluid-bloc p-x p-top flex-contain cols" onkeyup="',
			this.Nom,
			'.navigationClavier (id); if (GNavigateur.isToucheFleche () || GNavigateur.isToucheSelection ()) GNavigateur.stopperEvenement (event);">',
			ObjetWAI_1.GObjetWAI.composeSpan(this.TitreSecondaireElementCourant),
			'<div class="full-width flex-contain flex-center justify-between semi-bold p-all" id="' +
				(this.Nom + "_ind_" + aIndice) +
				'" style="border-bottom:1px solid black;">',
			"<span>",
			lLibelle,
			"</span>",
			'<div class="flex-contain flex-center justify-end flex-gap">',
			this.composeVisas(aObjetTravailAFaire),
			"</div>",
			"</div>",
		);
		lHtml.push(ObjetWAI_1.GObjetWAI.composeSpan(". "));
		return lHtml.join("");
	}
	composeVisas(aObjetTravailAFaire) {
		const lHtml = [];
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.etatUtilSco.GenreEspace)
		) {
			if (aObjetTravailAFaire.dateVisaI) {
				lHtml.push(
					'<div class="Image_VisaInspecteur" ie-hint="',
					aObjetTravailAFaire.individuVisaI
						? ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.HintVisa",
								),
								[
									ObjetDate_1.GDate.formatDate(
										aObjetTravailAFaire.dateVisaI,
										"%JJ/%MM/%AAAA",
									),
									aObjetTravailAFaire.individuVisaI,
								],
							)
						: ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.HintVisaSansI",
								),
								[
									ObjetDate_1.GDate.formatDate(
										aObjetTravailAFaire.dateVisaI,
										"%JJ/%MM/%AAAA",
									),
								],
							),
					'"></div>',
				);
			}
			if (aObjetTravailAFaire.dateVisa) {
				lHtml.push(
					'<div class="Image_VisaEtablissement" ie-hint="',
					aObjetTravailAFaire.individuVisa
						? ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.HintVisa",
								),
								[
									ObjetDate_1.GDate.formatDate(
										aObjetTravailAFaire.dateVisa,
										"%JJ/%MM/%AAAA",
									),
									aObjetTravailAFaire.individuVisa,
								],
							)
						: ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.HintVisaSansI",
								),
								[
									ObjetDate_1.GDate.formatDate(
										aObjetTravailAFaire.dateVisa,
										"%JJ/%MM/%AAAA",
									),
								],
							),
					'"></div>',
				);
			}
		}
		return lHtml.join("");
	}
	composeDevoir(aObjetTravailAFaire) {
		const lHtml = [];
		lHtml.push(
			'<div class="flex-contain flex-start justify-between">',
			'<div class="fluid-bloc">',
			aObjetTravailAFaire.descriptif,
			"</div>",
		);
		if (aObjetTravailAFaire.ListePieceJointe.count() > 0) {
			lHtml.push(
				'<div class="p-left-l">',
				this.composePiecesJointes(aObjetTravailAFaire),
				"</div>",
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeDevoirSelonDonneLe(aObjetTravailAFaire) {
		const lDate = aObjetTravailAFaire.DonneLe
			? aObjetTravailAFaire.DonneLe
			: aObjetTravailAFaire.PourLe;
		if (!ObjetDate_1.GDate.estDateEgale(this.DonneLeCourant, lDate)) {
			const lHtml = [];
			if (this.DonneLeCourant !== "") {
				lHtml.push(this.composeFermetureGenre());
			}
			this.DonneLeCourant = lDate;
			lHtml.push(this.composeDevoirsDonneLe(aObjetTravailAFaire));
			return lHtml.join("");
		} else {
			return this.composeDevoir(aObjetTravailAFaire);
		}
	}
	composeDevoirsDonneLe(aObjetTravailAFaire) {
		this.DonneLeCourant = aObjetTravailAFaire.DonneLe
			? aObjetTravailAFaire.DonneLe
			: aObjetTravailAFaire.PourLe;
		const lNbJours = aObjetTravailAFaire.DonneLe
			? ObjetDate_1.GDate.getDifferenceJours(
					aObjetTravailAFaire.PourLe,
					aObjetTravailAFaire.DonneLe,
				)
			: 0;
		const lStrJours = (
			lNbJours > 1
				? ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jours")
				: ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.jour")
		).toLowerCase();
		const lLibelleDonneLe = aObjetTravailAFaire.DonneLe
			? ObjetDate_1.GDate.formatDate(
					aObjetTravailAFaire.DonneLe,
					ObjetTraduction_1.GTraductions.getValeur("TAFEtContenu.donneLe") +
						" %JJ/%MM",
				) +
				" [" +
				lNbJours +
				" " +
				lStrJours +
				"] : "
			: ObjetDate_1.GDate.formatDate(
					aObjetTravailAFaire.PourLe,
					ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.pourLe") +
						" %JJ/%MM",
				) + " : ";
		const lHtml = [];
		lHtml.push(
			'<div class="flex-contain flex-start">',
			'<div style="width:10rem;" class="fix-bloc semi-bold">',
			ObjetChaine_1.GChaine.insecable(lLibelleDonneLe),
			"</div>",
			this.composeDevoir(aObjetTravailAFaire),
		);
		return lHtml.join("");
	}
	composeContenu(aCDT) {
		const lHtml = [];
		for (let i = 0; i < aCDT.listeContenus.count(); i++) {
			const lContenu = aCDT.listeContenus.get(i);
			lHtml.push(
				'<div class="p-all semi-bold">',
				lContenu.categorie.Libelle,
				lContenu.categorie.Libelle && lContenu.Libelle ? " - " : "",
				lContenu.Libelle,
				"</div>",
				'<div class="p-all tiny-view">',
				lContenu.descriptif,
				"</div>",
			);
			if (lContenu.ListePieceJointe.count() > 0) {
				lHtml.push(
					'<div class="p-all">',
					this.composePiecesJointes(lContenu),
					"</div>",
				);
			}
			if (lContenu.listeExecutionQCM.count() > 0) {
				lHtml.push(
					'<div class="p-all">',
					this.composeExecutionQCMContenu(aCDT, lContenu),
					"</div>",
				);
			}
		}
		let lElementProgrammeCDT;
		if (
			!aCDT.listeElementsProgrammeCDT &&
			aCDT.listeElementsProgrammeCDT.count()
		) {
			lHtml.push(
				'<div class="p-all semi-bold">',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.ElementsProgramme",
				),
				" :",
				"</div>",
			);
			for (let i = 0; i < aCDT.listeElementsProgrammeCDT.count(); i++) {
				lElementProgrammeCDT = aCDT.listeElementsProgrammeCDT.get(i);
				lHtml.push(
					'<div class="p-all">',
					"-&nbsp;" + lElementProgrammeCDT.getLibelle(),
					"</div>",
				);
			}
		}
		if (aCDT.ListeTravailAFaire.count() > 0) {
			aCDT.ListeTravailAFaire.setTri([
				ObjetTri_1.ObjetTri.init("Genre"),
				ObjetTri_1.ObjetTri.init("PourLe"),
			]);
			aCDT.ListeTravailAFaire.trier();
			lHtml.push('<div class="p-all">');
			for (let j = 0; j < aCDT.ListeTravailAFaire.count(); j++) {
				const lEltTAF = aCDT.ListeTravailAFaire.get(j);
				const lEstQCM =
					lEltTAF.executionQCM && lEltTAF.executionQCM.existeNumero();
				if (lEstQCM) {
					lHtml.push(
						this.utilitaireCDT.getTitreExecutionQCM(
							aCDT.getNumero() + "_" + j,
							lEltTAF.executionQCM,
							this.Nom,
						),
					);
				} else {
					lHtml.push(this.composeDevoirPourLe(lEltTAF));
				}
			}
			this.DonneLeCourant = "";
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	surExecutionQCM(aEvent, I) {
		const lPos = I.match(
			new RegExp(
				`^${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)$`,
			),
		);
		const lExecutionQCM = this.ListeCahierDeTextes.getElementParNumero(
			lPos[1],
		).ListeTravailAFaire.get(lPos[2]).executionQCM;
		this.callback.appel({ executionQCM: lExecutionQCM });
	}
	composeDevoirPourLe(aObjetTravailAFaire) {
		const lHtml = [];
		const lLibelle = ObjetChaine_1.GChaine.insecable(
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.PourLe") +
				" " +
				ObjetDate_1.GDate.formatDate(aObjetTravailAFaire.PourLe, "%JJ/%MM") +
				" : ",
		);
		lHtml.push(
			'<div class="p-y semi-bold">',
			lLibelle,
			"</div>",
			'<div class="p-bottom tiny-view">',
			aObjetTravailAFaire.descriptif,
			"</div>",
		);
		if (aObjetTravailAFaire.ListePieceJointe.count() > 0) {
			lHtml.push(this.composePiecesJointes(aObjetTravailAFaire));
		}
		return lHtml.join("");
	}
	composePiecesJointes(aElement) {
		const lHtml = [];
		const nbPiecesJointes = aElement.ListePieceJointe.count();
		for (let I = 0; I < nbPiecesJointes; I++) {
			const lPieceJointe = aElement.ListePieceJointe.get(I);
			this.tableauPiecesJointes[lPieceJointe.getNumero()] = lPieceJointe;
			lHtml.push(
				'<div class="p-y">',
				this.PourImpression
					? lPieceJointe.getLibelle()
					: ObjetChaine_1.GChaine.composerUrlLienExterne({
							documentJoint: lPieceJointe,
						}),
				"</div>",
			);
		}
		return lHtml.join("");
	}
	composeExecutionQCMContenu(aObjetTravailAFaire, aObjetContenu) {
		const lHtml = [];
		const nbExecutionQCM = aObjetContenu.listeExecutionQCM.count();
		for (let I = 0; I < nbExecutionQCM; I++) {
			const lExecutionQCM = aObjetContenu.listeExecutionQCM.get(I);
			lHtml.push(
				this.utilitaireCDT.getTitreExecutionQCMContenu(
					aObjetTravailAFaire.getNumero() +
						"_" +
						aObjetContenu.getNumero() +
						"_" +
						I,
					lExecutionQCM,
					this.Nom,
				),
			);
		}
		return lHtml.join("");
	}
	surExecutionQCMContenu(aEvent, I) {
		const lPos = I.match(
			new RegExp(
				`^${ObjetElement_1.ObjetElement.regexCaptureNumero}_${ObjetElement_1.ObjetElement.regexCaptureNumero}_([0-9]+)$`,
			),
		);
		const lExecutionQCM = this.ListeCahierDeTextes.getElementParNumero(lPos[1])
			.listeContenus.getElementParNumero(lPos[2])
			.listeExecutionQCM.get(lPos[3]);
		this.callback.appel({ executionQCM: lExecutionQCM });
	}
	composeFermetureTitreSecondaire() {
		const lHtml = [];
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeFermetureGenre() {
		const lHtml = [];
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeFermeture() {
		const lHtml = [];
		if (
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
		) {
			lHtml.push(this.composeFermetureGenre());
		}
		lHtml.push(this.composeFermetureTitreSecondaire());
		return lHtml.join("");
	}
	surPremierPrincipaleElement() {
		if (GNavigateur.isToucheFleche() || GNavigateur.isToucheSelection()) {
			ObjetHtml_1.GHtml.setFocus(this.PremierPrincipaleElement);
		}
	}
	surPremierSecondaire(aID) {
		if (GNavigateur.isToucheSelection()) {
			ObjetHtml_1.GHtml.setFocus(this.PremierID[aID]);
		}
		if (GNavigateur.isToucheFleche()) {
			this.navigationClavier(aID);
		}
	}
}
exports.PageCahierDeTexte = PageCahierDeTexte;
