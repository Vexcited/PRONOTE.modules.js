exports.PageBulletinMobile = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeNote_1 = require("TypeNote");
const UtilitaireBulletinEtReleve_Mobile_1 = require("UtilitaireBulletinEtReleve_Mobile");
const Enumere_Evolution_1 = require("Enumere_Evolution");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const EGenreDirectionSlide_1 = require("EGenreDirectionSlide");
const PiedDeBulletinMobile_1 = require("PiedDeBulletinMobile");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const OptionsPDFSco_1 = require("OptionsPDFSco");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const TypePositionnement_1 = require("TypePositionnement");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const AccessApp_1 = require("AccessApp");
class PageBulletinMobile extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.appScoMobile = (0, AccessApp_1.getApp)();
		this.etatUtilScoMobile = this.appScoMobile.getEtatUtilisateur();
		this.estCtxBulletinClasse =
			this.etatUtilScoMobile.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse;
		this.donneesRecues = false;
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.instancePiedDeBulletin = ObjetIdentite_1.Identite.creerInstance(
			PiedDeBulletinMobile_1.PiedDeBulletinMobile,
			{ pere: this, evenement: null },
		);
		this.instancePiedDeBulletin.setDonneesContexte({
			typeContexteBulletin: this.estCtxBulletinClasse
				? TypeContexteBulletin_1.TypeContexteBulletin.CB_Classe
				: TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
			avecSaisie: false,
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentiteBouton: function () {
				return {
					class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
					pere: this,
					init(aBtn) {
						aInstance.identBtnFlottant = aBtn;
						const lParam = {
							listeBoutons: [
								{
									primaire: true,
									icone: "icon_uniF1C1",
									ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
										"GenerationPDF.TitreCommande",
									),
									callback:
										aInstance.afficherModalitesGenerationPDF.bind(aInstance),
								},
							],
						};
						aBtn.setOptionsBouton(lParam);
					},
				};
			},
		});
	}
	afficherModalitesGenerationPDF() {
		let lParams = {
			callbaskEvenement: this.surEvenementFenetre.bind(this),
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.PDFEtCloud,
			avecDepot: true,
			avecTitreSelonOnglet: true,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	surEvenementFenetre(aLigne) {
		const lService = this.etatUtilScoMobile.listeCloudDepotServeur.get(aLigne);
		this._genererPdf(!!lService ? lService.getGenre() : null);
	}
	construireAffichage() {
		this.listeRegroupements = new ObjetListeElements_1.ObjetListeElements();
		this.listeServices = new ObjetListeElements_1.ObjetListeElements();
		const lHtml = [];
		if (!!this.Message) {
			lHtml.push(this.composeAucuneDonnee(this.Message));
			if (!!this.identBtnFlottant) {
				this.identBtnFlottant.setVisible(false);
			}
		} else if (this.donneesRecues) {
			if (!!this.identBtnFlottant) {
				this.identBtnFlottant.setVisible(true);
			}
			lHtml.push('<div id="', this.Nom, '_Bulletin">');
			if (this.ListeElements.count()) {
				lHtml.push(this.composeCorpsDeBulletin());
			}
			lHtml.push(
				'<div id="',
				this.instancePiedDeBulletin.getNom(),
				'" class="m-bottom-xl"></div>',
			);
			lHtml.push("</div>");
			if (
				this.appScoMobile.droits.get(
					ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
				) &&
				!this.identBtnFlottant
			) {
				$(
					"#" + this.appScoMobile.getInterfaceMobile().idZonePrincipale,
				).ieHtmlAppend(
					'<div class="is-sticky" ie-identite="getIdentiteBouton"></div>',
					{ controleur: this.controleur, avecCommentaireConstructeur: false },
				);
			}
		}
		return lHtml.join("");
	}
	composeCorpsDeBulletin() {
		const lHtml = [];
		let lNumeroRegroupement;
		lHtml.push('<ul class="collection with-header bg-white bulletin">');
		lNumeroRegroupement = this.ListeElements.get(0).SurMatiere.getNumero();
		for (let I = 0; this.ListeElements && I < this.ListeElements.count(); I++) {
			const lService = this.ListeElements.get(I);
			if (lService.estService) {
				lHtml.push(
					this.composeService(
						lService,
						lNumeroRegroupement !== null &&
							lService.SurMatiere.getNumero() !== lNumeroRegroupement &&
							lService.SurMatiere.getLibelle() === "",
					),
				);
				lNumeroRegroupement = lService.SurMatiere.getNumero();
			}
		}
		lHtml.push(this.composeMoyenneGenerale());
		lHtml.push("</ul>");
		return lHtml.join("");
	}
	composeService(aService, aDoitSortirDeRegroupement) {
		const lHtml = [];
		const lDebutRegroupement = this.composeRegroupement({ service: aService });
		lHtml.push(lDebutRegroupement);
		lHtml.push(
			'<li class="collection-item with-action ',
			aDoitSortirDeRegroupement ? "break-group" : "",
			'" onclick="',
			this.Nom,
			".ouvrirPanel('",
			aService.getNumero(),
			"')\">",
		);
		const lLibelleService = aService.getLibelle();
		this.listeServices.addElement(aService);
		const lInfosMoyComplet =
			this.Affichage.AvecNivMaitriseEleve && this.Affichage.AvecMoyenneEleve;
		lHtml.push(
			'<div class="matiere-conteneur ',
			lInfosMoyComplet ? "infos-moy-complet" : "",
			'" style="border-color: ' +
				(!!aService.couleur && aService.couleur !== ""
					? aService.couleur
					: "D4D4D4") +
				';">',
		);
		lHtml.push('<div class="libelle">', lLibelleService, "</div>");
		if (!this.estCtxBulletinClasse) {
			lHtml.push(
				'<div class="moyenne-classe">',
				this.getMoyenneClasse(aService),
				"</div>",
			);
			lHtml.push('<div class="infos-moy-eleve">');
			lHtml.push(
				'<div class="moyenne-eleve">' +
					this.getNoteService(aService, { estMoyNR: aService.estMoyNR }) +
					"</div>",
			);
			lHtml.push(
				'<div class="nivMaitrise-eleve">' +
					this.getNivMaitriseService(aService) +
					"</div>",
			);
			lHtml.push("</div>");
		} else {
			lHtml.push("<div></div>");
			lHtml.push(
				'<div class="infos-moy-classe">',
				this.getNoteClasse(aService),
				"</div>",
			);
		}
		if (aService.estService && aService.nbSousServicesTotal > 0) {
			lHtml.push('<ul class="collection">');
			for (let J = 0; J < aService.nbSousServicesTotal; J++) {
				const lSousService = aService.ListeElements.get(J);
				lHtml.push('<li class="collection-item with-action">');
				const libelleSousService =
					!!lSousService.Matiere && lSousService.Matiere.getLibelle() !== ""
						? lSousService.Matiere.getLibelle()
						: "";
				lHtml.push('<div class="sous-service-conteneur">');
				lHtml.push('<div class="libelle">');
				if (!!libelleSousService && libelleSousService !== "") {
					lHtml.push("<div>", libelleSousService, "</div>");
				}
				if (
					!!lSousService.ListeProfesseurs &&
					!!lSousService.ListeProfesseurs.count()
				) {
					lHtml.push(
						"<div>",
						ObjetChaine_1.GChaine.replaceRCToHTML(
							lSousService.ListeProfesseurs.getTableauLibelles().join("<br />"),
						),
						"</div>",
					);
				}
				lHtml.push("</div>");
				if (!this.estCtxBulletinClasse) {
					lHtml.push(
						'<div class="moyenne-classe">',
						this.getMoyenneClasse(lSousService),
						"</div>",
					);
					lHtml.push(
						'<div class="moyenne-eleve">' +
							this.getNoteService(lSousService, {}) +
							"</div>",
					);
				} else {
					lHtml.push("<div></div>");
					lHtml.push(
						'<div class="infos-moy-classe">' +
							this.getNoteClasse(lSousService) +
							"</div>",
					);
				}
				lHtml.push("</div>");
				lHtml.push("</li>");
			}
			lHtml.push("</ul>");
		}
		lHtml.push("</div>");
		lHtml.push("</li>");
		return lHtml.join("");
	}
	composeRegroupement(aParam) {
		const lService = aParam.service.estService
			? aParam.service
			: aParam.service.pere;
		const lHtml = [];
		if (lService.SurMatiere.existeNumero() && lService.estDebutRegroupement) {
			this.listeRegroupements.addElement(lService);
			lHtml.push(
				'<li class="collection-header collection-group with-action" onclick="',
				this.Nom,
				".ouvrirPanel('",
				lService.getNumero(),
				"',",
				true,
				')">',
			);
			lHtml.push("<span>" + lService.SurMatiere.getLibelle() + "</span>");
			let lMoyenneRegroupement = "";
			const lServiceDansRegroupement =
				this.tableauSurMatieres[lService.regroupement];
			if (lService.AvecMoyenneRegroupement) {
				lMoyenneRegroupement = this.getNoteService(
					lServiceDansRegroupement,
					{},
				);
			}
			lHtml.push("<span>", lMoyenneRegroupement, "</span>");
			lHtml.push("</li>");
		}
		return lHtml.join("");
	}
	setDonnees(
		aListeElements,
		aPositionPeriode,
		aPositionMax,
		aTableauSurMatieres,
		aMoyenneGenerale,
		aDonneesAbsences,
		aPiedDePage,
		aAffichage,
		aPeriodeCourante,
	) {
		if (aListeElements) {
			this.ListeElements = this.getListeDonneesLineaire(aListeElements);
			this.Affichage = aAffichage;
			this.donneesRecues = true;
			this.Message = "";
		}
		if (aTableauSurMatieres) {
			this.tableauSurMatieres = aTableauSurMatieres;
		}
		if (aMoyenneGenerale) {
			this.MoyenneGenerale = aMoyenneGenerale;
		}
		if (aDonneesAbsences) {
			this.donneesAbsences = aDonneesAbsences;
		}
		if (aPiedDePage) {
			this.PiedDePage = aPiedDePage;
		}
		this.periodeCourante = aPeriodeCourante;
		let lSensSlide;
		if (this.precedentePosition === aPositionMax && aPositionPeriode === 0) {
			lSensSlide = EGenreDirectionSlide_1.EGenreDirectionSlide.Droite;
		} else if (this.precedentePosition === 0 && aPositionPeriode > 1) {
			lSensSlide = EGenreDirectionSlide_1.EGenreDirectionSlide.Gauche;
		} else {
			lSensSlide =
				aPositionPeriode === this.precedentePosition
					? EGenreDirectionSlide_1.EGenreDirectionSlide.Aucune
					: aPositionPeriode < this.precedentePosition
						? EGenreDirectionSlide_1.EGenreDirectionSlide.Gauche
						: EGenreDirectionSlide_1.EGenreDirectionSlide.Droite;
		}
		this.precedentePosition = aPositionPeriode;
		this.afficher(null, lSensSlide);
		this.instancePiedDeBulletin.setDonneesPiedDeBulletin(
			aPiedDePage,
			aDonneesAbsences,
		);
		this.instancePiedDeBulletin.afficher();
	}
	setMessage(aMessage) {
		this.Message = aMessage;
		this.afficher();
	}
	getListeDonneesLineaire(aListeElements) {
		let lService, lSousService, lCmpActifs, lIndiceDernier, lIndiceDernierActif;
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (let I = 0, lNbr = aListeElements.count(); I < lNbr; I++) {
			lService = aListeElements.get(I);
			lService.estService = true;
			lService.nbSousServicesTotal = !!lService.ListeElements
				? lService.ListeElements.count()
				: 0;
			lService.regroupement = lService.SurMatiere.getNumero();
			lService.avecAppreciationParSousService =
				lService.AvecAppreciationParSousService;
			lCmpActifs = 0;
			lIndiceDernier = 0;
			lIndiceDernierActif = 0;
			for (let J = 0; J < lService.nbSousServicesTotal; J++) {
				if (lService.ListeElements.get(J).Actif) {
					lCmpActifs++;
					lIndiceDernierActif = J;
				}
				lIndiceDernier = J;
			}
			lService.nbSousServicesActifs = lCmpActifs;
			lListe.addElement(lService);
			for (let J = 0; J < lService.nbSousServicesTotal; J++) {
				lSousService = lService.ListeElements.get(J);
				lSousService.estService = false;
				lSousService.estDernier = J === lIndiceDernier;
				lSousService.estDernierActif = J === lIndiceDernierActif;
				lSousService.regroupement = lService.regroupement;
				lSousService.avecAppreciationParSousService =
					lService.avecAppreciationParSousService;
				lListe.addElement(lSousService);
			}
		}
		return lListe;
	}
	calculerTotalECTS() {
		let lTotalECTS = 0;
		if (this.Affichage.avecECTS) {
			let lService;
			const lNombreServices = this.ListeElements.count();
			for (let I = 0; I < lNombreServices; I++) {
				lService = this.ListeElements.get(I);
				if (lService.ECTS !== false) {
					lTotalECTS += lService.ECTS;
				}
			}
		}
		return lTotalECTS.toFixed(3);
	}
	calculerNombrePointsEleve() {
		let lTotal = 0;
		if (this.Affichage.AvecNombrePointsEleve) {
			let lService;
			const lNombreService = this.ListeElements.count();
			for (let I = 0; I < lNombreService; I++) {
				lService = this.ListeElements.get(I);
				if (lService.NombrePointsEleve) {
					lTotal += lService.NombrePointsEleve.getValeur();
				}
			}
		}
		return new TypeNote_1.TypeNote(lTotal, 2);
	}
	composeMoyenneGenerale() {
		const lHtml = [];
		if (this.Affichage && this.Affichage.AvecMoyenneGenerale) {
			lHtml.push(
				'<li class="collection-item raised with-action break-group" onclick="',
				this.Nom,
				'.ouvrirPanel()">',
			);
			lHtml.push(
				"<span>",
				ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyGen"),
				"</span>",
			);
			let lMoyenneGenerale = "";
			if (this.MoyenneGenerale) {
				if (this.estCtxBulletinClasse) {
					lMoyenneGenerale = this.MoyenneGenerale.MoyenneClasse.getNote();
				} else {
					if (
						this.MoyenneGenerale.moyenneDeliberee &&
						this.MoyenneGenerale.moyenneDeliberee.getNote() !== ""
					) {
						lMoyenneGenerale = this.MoyenneGenerale.moyenneDeliberee.getNote();
					} else if (
						this.MoyenneGenerale.MoyenneEleve &&
						this.MoyenneGenerale.MoyenneEleve.getNote() !== ""
					) {
						lMoyenneGenerale = this.MoyenneGenerale.MoyenneEleve.getNote();
					}
				}
				lHtml.push("<span>", lMoyenneGenerale, "</span>");
			}
			lHtml.push("</li>");
		}
		return lHtml.join("");
	}
	ouvrirPanel(aNumeroService, aOuvrirePanelRegroupement) {
		const lService = this.ListeElements.getElementParNumero(aNumeroService);
		if (!!lService) {
			if (!!aOuvrirePanelRegroupement) {
				const lRegr = this.composePanelRegroupement(lService);
				this.appScoMobile.getInterfaceMobile().openPanel(lRegr.html, {
					optionsFenetre: {
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.DetailsRegroupement",
						),
						avecNavigation: true,
						titreNavigation: lRegr.titreNavigation,
						callbackNavigation: (aSuivant) => {
							this.surClickProchainElement(
								lService.getNumero(),
								aSuivant,
								true,
							);
						},
					},
				});
			} else {
				this.appScoMobile
					.getInterfaceMobile()
					.openPanel(this.composePanelService(lService), {
						optionsFenetre: {
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"BulletinEtReleve.DetailsMatiere",
							),
							avecNavigation: true,
							titreNavigation: () => {
								return this.composeBandeauService(lService);
							},
							callbackNavigation: (aSuivant) => {
								this.surClickProchainElement(lService.getNumero(), aSuivant);
							},
						},
					});
			}
		} else {
			this.appScoMobile
				.getInterfaceMobile()
				.openPanel(this.composePanelMoyenneGenerale(this.MoyenneGenerale), {
					optionsFenetre: {
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.DetailsMoyenneGenerale",
						),
					},
				});
		}
	}
	composePanelRegroupement(aService) {
		const lHtml = [];
		let lMoyenneRegroupement = "";
		const lServiceDansRegroupement =
			this.tableauSurMatieres[aService.regroupement];
		if (aService.AvecMoyenneRegroupement) {
			lMoyenneRegroupement = this.getNoteService(lServiceDansRegroupement, {});
		}
		let lTitreNavigation = "";
		if (aService) {
			lTitreNavigation = `<span>${aService.SurMatiere.getLibelle()}</span><div>${lMoyenneRegroupement}</div>`;
			if (!!this.composeDetails(lServiceDansRegroupement, false)) {
				lHtml.push('<div class="details-conteneur">');
				lHtml.push(this.composeDetails(lServiceDansRegroupement, false));
				lHtml.push("</div>");
			}
			lHtml.push("</div>");
		}
		return { html: lHtml.join(""), titreNavigation: lTitreNavigation };
	}
	composePanelMoyenneGenerale(aMoyenneGenerale) {
		const lHtml = [];
		if (aMoyenneGenerale) {
			lHtml.push(
				'<div class="flex-contain cols flex-center ie-texte"><span>' +
					ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyGen") +
					"</span>",
				this.Affichage.AvecMoyenneEleve &&
					aMoyenneGenerale.MoyenneEleve &&
					aMoyenneGenerale.MoyenneEleve.getNote() !== ""
					? '<div class="get-note">' +
							aMoyenneGenerale.MoyenneEleve.getNote() +
							"</div>"
					: "",
				"</div>",
			);
			if (!!this.composeDetails(aMoyenneGenerale, true)) {
				lHtml.push('<div class="details-conteneur">');
				lHtml.push(this.composeDetails(aMoyenneGenerale, true));
				lHtml.push("</div>");
			}
		}
		return lHtml.join("");
	}
	composePanelService(aService) {
		const lHtml = [];
		if (aService) {
			if (!!this.composeDetails(aService, false)) {
				lHtml.push('<div class="details-conteneur">');
				lHtml.push(this.composeDetails(aService, false));
				lHtml.push("</div>");
			}
			lHtml.push(this.composeElementProgrammeBulletin(aService));
			lHtml.push(this.composeAppreciationsService(aService));
			if (aService.estService && aService.nbSousServicesTotal > 0) {
				lHtml.push('<ul class="collapsible popout bulletin">');
				for (let J = 0; J < aService.nbSousServicesTotal; J++) {
					const lSousService = aService.ListeElements.get(J);
					lHtml.push(this.composeSousService(lSousService));
				}
				lHtml.push("</ul>");
			}
			lHtml.push(this.composeLegende(aService));
		}
		return lHtml.join("");
	}
	composeBandeauService(aService) {
		const lHtml = [];
		lHtml.push("<span>" + aService.getLibelle());
		const libelleProfesseur = this.getProfesseur(aService);
		if (libelleProfesseur !== "") {
			lHtml.push(" - ", libelleProfesseur);
		}
		lHtml.push("</span>");
		lHtml.push('<span class="infos-moy-eleve-bandeau">');
		lHtml.push(
			"<span>" +
				this.getNoteService(aService, {
					estMoyNR: aService.estMoyNR,
					surMemeLigne: true,
				}) +
				"</span>",
		);
		lHtml.push(
			'<span class="nivMaitrise-eleve-bandeau">' +
				this.getNivMaitriseService(aService) +
				"</span>",
		);
		lHtml.push("</span>");
		if (
			this.Affichage.avecECTS &&
			aService.ECTS &&
			aService.ECTS &&
			aService.ECTS !== ""
		) {
			lHtml.push("<span>");
			lHtml.push(
				ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.ECTS"),
				"&nbsp;",
				aService.ECTS,
			);
			lHtml.push("</span>");
		}
		return lHtml.join("");
	}
	composeSousService(aSousService) {
		const lHtml = [],
			lDetailSousService = this.composeDetails(aSousService, false),
			libelleSousService =
				!!aSousService.Matiere && aSousService.Matiere.getLibelle() !== ""
					? aSousService.Matiere.getLibelle()
					: "";
		lHtml.push("<li>");
		lHtml.push(
			'<div class="collapsible-header',
			!!lDetailSousService ? " active" : " empty-body",
			'">',
		);
		lHtml.push('<div class="libelle">');
		lHtml.push('<div class="truncate fluid-bloc">');
		if (!!libelleSousService && libelleSousService !== "") {
			lHtml.push("<div>", libelleSousService, "</div>");
		}
		if (
			!!aSousService.ListeProfesseurs &&
			!!aSousService.ListeProfesseurs.count()
		) {
			lHtml.push(
				"<div>",
				ObjetChaine_1.GChaine.replaceRCToHTML(
					aSousService.ListeProfesseurs.getTableauLibelles().join("<br>"),
				),
				"</div>",
			);
		}
		lHtml.push("</div>");
		lHtml.push('<div class="fix-bloc">');
		lHtml.push(
			'<div class="right-align Italique InlineBlock" style="width:100%;">',
			this.getNoteService(aSousService, {}),
			"</div>",
		);
		lHtml.push("</div>");
		lHtml.push("</div>");
		lHtml.push("</div>");
		lHtml.push('<div class="collapsible-body details-conteneur">');
		lHtml.push(lDetailSousService || "");
		lHtml.push(this.composeAppreciationsService(aSousService));
		lHtml.push("</div>");
		lHtml.push("</li>");
		return lHtml.join("");
	}
	composeDetails(aParam, aEstMoyenneGenerale) {
		const lHtml = [];
		let lMoyNR;
		if (this.Affichage && !!aParam) {
			let lEstMultiLignes = false;
			if (this.Affichage.avecMoyNRUniquement === false) {
				lEstMultiLignes =
					this.Affichage.AvecMoyenneAnnuelle &&
					aParam.estMoyAnnuelleNR === true;
				if (lEstMultiLignes === false && this.Affichage.AvecMoyennePeriode) {
					for (
						let lIndice = 0;
						lIndice < this.Affichage.NombreMoyennesPeriodes;
						lIndice++
					) {
						if (lEstMultiLignes === false) {
							lMoyNR =
								aParam.ListeMoyNRPeriodes !== null &&
								aParam.ListeMoyNRPeriodes !== undefined
									? aParam.ListeMoyNRPeriodes[lIndice]
									: false;
							if (lMoyNR === true) {
								lEstMultiLignes = true;
							}
						}
					}
				}
			}
			if (
				this.Affichage.AvecVolumeHoraire &&
				!!aParam.VolumeHoraire &&
				aParam.VolumeHoraire !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.VolH"),
						aParam.VolumeHoraire,
						lEstMultiLignes,
					),
				);
			}
			if (
				this.Affichage.AvecCoefficient &&
				!!aParam.Coefficient &&
				aParam.Coefficient.getNote() !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Coeff"),
						aParam.Coefficient.getNote(),
						lEstMultiLignes,
					),
				);
			}
			if (
				this.Affichage.AvecNombreDevoirs &&
				!!aParam.NombreDevoirs &&
				aParam.NombreDevoirs !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.NbrNotes",
						),
						aParam.NombreDevoirs,
						lEstMultiLignes,
					),
				);
			}
			if (
				this.Affichage.AvecClassementEleve &&
				!!aParam.ClassementEleve &&
				aParam.ClassementEleve !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Rang"),
						aParam.ClassementEleve,
						lEstMultiLignes,
					),
				);
			}
			if (
				this.Affichage.AvecEvolution &&
				!!aParam.Evolution &&
				aParam.Evolution.getGenre() !== null &&
				aParam.Evolution.getGenre() !==
					Enumere_Evolution_1.EGenreEvolution.Aucune
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Evol"),
						"<div>" +
							Enumere_Evolution_1.EGenreEvolutionUtil.getImage(
								aParam.Evolution.getGenre(),
							) +
							"</div>",
						lEstMultiLignes,
					),
				);
			}
			if (
				this.Affichage.AvecMoyenneAnnuelle &&
				((!!aParam.MoyenneAnnuelle &&
					aParam.MoyenneAnnuelle.getNote() !== "") ||
					aParam.estMoyAnnuelleNR === true)
			) {
				const H = [];
				if (aParam.estMoyAnnuelleNR === true) {
					H.push(this.moteur.composeHtmlMoyNR());
				}
				if (
					!(
						aParam.estMoyAnnuelleNR === true &&
						this.Affichage.avecMoyNRUniquement === true
					)
				) {
					H.push(aParam.MoyenneAnnuelle.getNote());
				}
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.MoyAnnee",
						),
						H.join(""),
						lEstMultiLignes,
					),
				);
			}
			if (this.Affichage.AvecMoyennePeriode) {
				for (let I = 0; I < this.Affichage.NombreMoyennesPeriodes; I++) {
					if (
						aParam.ListeNiveauDAcquisitionPeriodes &&
						aParam.ListeNiveauDAcquisitionPeriodes.count() &&
						aParam.ListeNiveauDAcquisitionPeriodes.existeNumero(I)
					) {
						const lNiveauDacquisition = this.appScoMobile
							.getObjetParametres()
							.listeNiveauxDAcquisitions.getElementParNumero(
								aParam.ListeNiveauDAcquisitionPeriodes.getNumero(I),
							);
						lHtml.push(
							UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
								this.Affichage.listePeriodes.getLibelle(I),
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
									{ niveauDAcquisition: lNiveauDacquisition },
								),
								lEstMultiLignes,
							),
						);
					} else if (
						(aParam.ListeMoyennesPeriodes &&
							aParam.ListeMoyennesPeriodes[I] &&
							aParam.ListeMoyennesPeriodes[I].getNote() !== "") ||
						(aParam.ListeMoyNRPeriodes && aParam.ListeMoyNRPeriodes[I] === true)
					) {
						const H = [];
						lMoyNR =
							aParam.ListeMoyNRPeriodes !== null &&
							aParam.ListeMoyNRPeriodes !== undefined
								? aParam.ListeMoyNRPeriodes[I]
								: false;
						if (lMoyNR === true) {
							H.push(this.moteur.composeHtmlMoyNR());
						}
						if (
							!(lMoyNR === true && this.Affichage.avecMoyNRUniquement === true)
						) {
							H.push(aParam.ListeMoyennesPeriodes[I].getNote());
						}
						lHtml.push(
							UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
								this.Affichage.listePeriodes.getLibelle(I),
								H.join(""),
								lEstMultiLignes,
							),
						);
					}
				}
			}
			if (aEstMoyenneGenerale) {
				aParam.NombrePointsEleve = this.calculerNombrePointsEleve();
				if (
					!!this.Affichage.AvecNombrePointsEleve &&
					aParam.NombrePointsEleve.getValeur() !== 0
				) {
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Pts"),
							aParam.NombrePointsEleve.getNote(),
							lEstMultiLignes,
						),
					);
				}
				const lTotalECTS = this.calculerTotalECTS();
				if (!!this.Affichage.avecECTS && lTotalECTS > 0) {
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.ECTS"),
							lTotalECTS,
							lEstMultiLignes,
						),
					);
				}
			} else if (
				this.Affichage.AvecNombrePointsEleve &&
				!!aParam.NombrePointsEleve &&
				aParam.NombrePointsEleve.getNote() !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Pts"),
						aParam.NombrePointsEleve.getNote(),
						lEstMultiLignes,
					),
				);
			}
			if (
				this.Affichage.AvecMoyenneClasse &&
				!!aParam.MoyenneClasse &&
				aParam.MoyenneClasse.getNote() !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Classe"),
						aParam.MoyenneClasse.getNote(),
						lEstMultiLignes,
					),
				);
			}
			if (
				!!this.Affichage.AvecMoyenneInfSup &&
				!!aParam.MoyenneInf &&
				aParam.MoyenneInf.getNote() !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyInf"),
						aParam.MoyenneInf.getNote(),
						lEstMultiLignes,
					),
				);
			}
			if (
				!!this.Affichage.AvecMoyenneInfSup &&
				!!aParam.MoyenneSup &&
				aParam.MoyenneSup.getNote() !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoySup"),
						aParam.MoyenneSup.getNote(),
						lEstMultiLignes,
					),
				);
			}
			if (
				!!this.Affichage.AvecMoyenneMediane &&
				!!aParam.MoyenneMediane &&
				aParam.MoyenneMediane.getNote() !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.Mediane",
						),
						aParam.MoyenneMediane.getNote(),
						lEstMultiLignes,
					),
				);
			}
			if (!!this.Affichage.AvecNombrePointsEntre && !!aParam.NombreNotesEntre) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.MoyInf8",
						),
						aParam.NombreNotesEntre[0] || "0",
						lEstMultiLignes,
					),
				);
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.MoyEntre",
						),
						aParam.NombreNotesEntre[1] || "0",
						lEstMultiLignes,
					),
				);
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.MoySup12",
						),
						aParam.NombreNotesEntre[2] || "0",
						lEstMultiLignes,
					),
				);
			}
			if (
				this.Affichage.AvecDureeDesAbsenses &&
				!!aParam.DureeDesAbsences &&
				aParam.DureeDesAbsences !== ""
			) {
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.HAbs"),
						aParam.DureeDesAbsences,
						lEstMultiLignes,
					),
				);
			}
		}
		if (lHtml.length === 0) {
			return false;
		} else {
			return lHtml.join("");
		}
	}
	composeLegende(aService) {
		const lAvecInfoNR = this._existeInfoNRPourService(aService);
		const lAvecNiveauAcqu = aService.NiveauDAcquisition;
		const lExisteLegende = lAvecInfoNR || lAvecNiveauAcqu;
		const lHtml = [];
		if (lExisteLegende) {
			lHtml.push('<div class="', this.Nom, '_legende legende-conteneur">');
			lHtml.push(
				'<div class="libelle">',
				ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Legende"),
				"</div>",
			);
			lHtml.push('<ul class="descriptif">');
			if (lAvecNiveauAcqu) {
				let lNiveauDAcquisition, lLibelle;
				const lGenrePositionnement =
					TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
						aService.TypePositionnementClasse,
					);
				for (
					let i = 0;
					i <
					this.appScoMobile
						.getObjetParametres()
						.listeNiveauxDAcquisitions.count();
					i++
				) {
					lNiveauDAcquisition = this.appScoMobile
						.getObjetParametres()
						.listeNiveauxDAcquisitions.get(i);
					lLibelle =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibellePositionnement(
							{
								niveauDAcquisition: lNiveauDAcquisition,
								avecPositionnementVide: true,
								genrePositionnement: lGenrePositionnement,
							},
						);
					if (
						lLibelle &&
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getNombrePointsBrevet(
							lNiveauDAcquisition,
						).getValeur() > 0
					) {
						lHtml.push(
							"<li>",
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
								{
									niveauDAcquisition: lNiveauDAcquisition,
									genrePositionnement: lGenrePositionnement,
								},
							),
							'<span class="libelle">',
							lLibelle,
							"</span>",
							"</li>",
						);
					}
				}
			}
			if (lAvecInfoNR) {
				lHtml.push(
					'<li style="display:flex; align-items:flex-start; margin-top:1rem;">',
					this.moteur.composeHtmlMoyNR(),
					'<span class="libelle EspaceGauche">',
					ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.HintMoyenneNR",
					),
					"</span>",
					"</li>",
				);
			}
			lHtml.push("</ul>");
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	composeAppreciationsService(aService) {
		const lHtml = [];
		const lNombreAppreciationsSurService = aService.ListeAppreciations.count();
		for (let I = 0; I < lNombreAppreciationsSurService; I++) {
			const lAppreciationSurService =
				aService.ListeAppreciations.get(I).getLibelle();
			if (lAppreciationSurService !== "") {
				const lIntituleAppreciation =
					this.Affichage.ListeIntitulesAppreciations.get(I).getLibelle();
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
						{
							intituleDAppreciation: lIntituleAppreciation,
							contenuDAppreciation: lAppreciationSurService,
						},
					),
				);
			}
		}
		return lHtml.join("");
	}
	getNivMaitriseService(aService) {
		if (this.Affichage.AvecNivMaitriseEleve) {
			if (
				aService.NiveauDAcquisition &&
				aService.NiveauDAcquisition.existeNumero()
			) {
				const lNiveauDAcquisition = this.appScoMobile
					.getObjetParametres()
					.listeNiveauxDAcquisitions.getElementParNumero(
						aService.NiveauDAcquisition.getNumero(),
					);
				return (
					"<div>" +
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
						{
							niveauDAcquisition: lNiveauDAcquisition,
							genrePositionnement:
								TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
									aService.TypePositionnementClasse,
								),
						},
					) +
					"</div>"
				);
			}
		}
		return "";
	}
	getNoteService(aService, aInfosMoyNR) {
		if (
			this.Affichage.AvecMoyenneDeliberee ||
			this.Affichage.AvecMoyenneEleve
		) {
			if (
				"avisReligionPropose" in aService &&
				aService.avisReligionPropose &&
				aService.avisReligionPropose.getLibelle() !== ""
			) {
				return aService.avisReligionPropose.getLibelle();
			} else if (
				"avisReligionDelibere" in aService &&
				aService.avisReligionDelibere &&
				aService.avisReligionDelibere.getLibelle() !== ""
			) {
				return aService.avisReligionDelibere.getLibelle();
			} else if (
				"moyenneDeliberee" in aService &&
				aService.moyenneDeliberee &&
				aService.moyenneDeliberee.getNote() !== ""
			) {
				return aService.moyenneDeliberee.getNote();
			} else if (
				"NiveauDAcquisition" in aService &&
				aService.NiveauDAcquisition &&
				aService.NiveauDAcquisition.existeNumero() &&
				!this.Affichage.AvecNivMaitriseEleve
			) {
				const lNiveauDAcquisition = this.appScoMobile
					.getObjetParametres()
					.listeNiveauxDAcquisitions.getElementParNumero(
						aService.NiveauDAcquisition.getNumero(),
					);
				return (
					'<div style="position: relative; float: right; top: 3px;">' +
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
						{
							niveauDAcquisition: lNiveauDAcquisition,
							genrePositionnement:
								TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
									aService.TypePositionnementClasse,
								),
						},
					) +
					"</div>"
				);
			} else if (
				aService.MoyenneEleve &&
				aService.MoyenneEleve.getNote() !== ""
			) {
				return aService.MoyenneEleve.getNote();
			} else {
				const H = [];
				if (aInfosMoyNR && aInfosMoyNR.estMoyNR === true) {
					H.push(this.moteur.composeHtmlMoyNR());
				}
				if (aService.MoyenneEleve && aService.MoyenneEleve.getNote() !== "") {
					if (
						!(
							"estMoyNR" in aService &&
							aService.estMoyNR === true &&
							this.Affichage.avecMoyNRUniquement === true
						)
					) {
						H.push(aService.MoyenneEleve.getNote());
					}
				}
				return H.join(
					aInfosMoyNR && aInfosMoyNR.surMemeLigne === true ? " " : "<br />",
				);
			}
		} else {
			return "";
		}
	}
	getMoyenneClasse(aService) {
		if (
			this.Affichage.AvecMoyenneClasse &&
			aService.MoyenneClasse &&
			aService.MoyenneClasse.getNote() !== ""
		) {
			return (
				ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.ClasseAbr") +
				"&nbsp;" +
				aService.MoyenneClasse.getNote()
			);
		} else {
			return "&nbsp;";
		}
	}
	getNoteClasse(aService) {
		if (aService.MoyenneClasse && aService.MoyenneClasse.getNote() !== "") {
			return aService.MoyenneClasse.getNote();
		} else {
			return "&nbsp;";
		}
	}
	getProfesseur(aService) {
		return !!aService.ListeProfesseurs && aService.ListeProfesseurs.count() > 0
			? aService.ListeProfesseurs.getLibelle(0)
			: "";
	}
	getCoefficient(aService) {
		if (
			this.Affichage.AvecCoefficient &&
			aService.Coefficient &&
			aService.Coefficient.getNote() !== ""
		) {
			return (
				ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Coeff") +
				aService.Coefficient.getNote()
			);
		} else {
			return " ";
		}
	}
	composeElementProgrammeBulletin(aService) {
		const lHtml = [];
		if (
			this.Affichage.avecElementProgramme &&
			aService.ElementsProgrammeBulletin.count() > 0
		) {
			aService.ElementsProgrammeBulletin.setTri([
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			aService.ElementsProgrammeBulletin.trier();
			lHtml.push('<ul class="browser-default">');
			for (let I = 0; I < aService.ElementsProgrammeBulletin.count(); I++) {
				if (aService.ElementsProgrammeBulletin.get(I).getLibelle() !== "") {
					lHtml.push(
						"<li>",
						aService.ElementsProgrammeBulletin.get(I).getLibelle(),
						"</li>",
					);
				}
			}
			lHtml.push("</ul>");
			return UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
				{
					intituleDAppreciation: this.Affichage.intituleElementProgramme,
					contenuDAppreciation: lHtml,
				},
			);
		}
		return "";
	}
	surClickProchainElement(aNumeroElement, aEstSuivant, aRegroupementSuivant) {
		let lIndiceElementActuel, lIndiceProchainElement, lProchainElement;
		if (!!aRegroupementSuivant) {
			lIndiceElementActuel =
				this.listeRegroupements.getIndiceParNumeroEtGenre(aNumeroElement);
			if (!!aEstSuivant) {
				lIndiceProchainElement =
					lIndiceElementActuel + 1 < this.listeRegroupements.count()
						? lIndiceElementActuel + 1
						: 0;
			} else {
				lIndiceProchainElement =
					lIndiceElementActuel === 0
						? this.listeRegroupements.count() - 1
						: lIndiceElementActuel - 1;
			}
			lProchainElement = this.listeRegroupements.get(lIndiceProchainElement);
			this.ouvrirPanel(lProchainElement.getNumero(), aRegroupementSuivant);
		} else {
			lIndiceElementActuel =
				this.listeServices.getIndiceParNumeroEtGenre(aNumeroElement);
			if (!!aEstSuivant) {
				lIndiceProchainElement =
					lIndiceElementActuel + 1 < this.listeServices.count()
						? lIndiceElementActuel + 1
						: 0;
			} else {
				lIndiceProchainElement =
					lIndiceElementActuel === 0
						? this.listeServices.count() - 1
						: lIndiceElementActuel - 1;
			}
			lProchainElement = this.listeServices.get(lIndiceProchainElement);
			this.ouvrirPanel(lProchainElement.getNumero(), aRegroupementSuivant);
		}
	}
	free() {
		super.free();
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
	_genererPdf(aService) {
		const lParametrageAffichage = {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.Bulletin,
			periode: this.periodeCourante,
			avecCodeCompetences: this.etatUtilScoMobile.estAvecCodeCompetences(),
		};
		UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
			paramPDF: lParametrageAffichage,
			optionsPDF: OptionsPDFSco_1.OptionsPDFSco.Bulletin,
			cloudCible: aService,
		});
	}
	_existeInfoNRPourService(aService) {
		let lAvecInfoNR =
			aService &&
			(aService.estMoyNR === true || aService.estMoyAnnuelleNR === true);
		if (
			lAvecInfoNR !== true &&
			this.Affichage.AvecMoyennePeriode &&
			aService.ListeMoyNRPeriodes !== null &&
			aService.ListeMoyNRPeriodes !== undefined
		) {
			for (
				let lIndice = 0;
				lIndice < this.Affichage.NombreMoyennesPeriodes;
				lIndice++
			) {
				if (lAvecInfoNR === false && aService.ListeMoyNRPeriodes[lIndice]) {
					lAvecInfoNR = true;
				}
			}
		}
		return lAvecInfoNR;
	}
}
exports.PageBulletinMobile = PageBulletinMobile;
