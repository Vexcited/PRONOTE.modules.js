exports.ObjetReleveDeNotes = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireBulletinEtReleve_Mobile_1 = require("UtilitaireBulletinEtReleve_Mobile");
const EGenreDirectionSlide_1 = require("EGenreDirectionSlide");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetElement_1 = require("ObjetElement");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const OptionsPDFSco_1 = require("OptionsPDFSco");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const TypePositionnement_1 = require("TypePositionnement");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const AccessApp_1 = require("AccessApp");
class ObjetReleveDeNotes extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
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
		const lService = GEtatUtilisateur.listeCloudDepotServeur.get(aLigne);
		this._genererPdf(!!lService ? lService.getGenre() : null);
	}
	construireAffichage() {
		const lHtml = [];
		if (!!this.message) {
			lHtml.push(this.composeAucuneDonnee(this.message));
			if (!!this.identBtnFlottant) {
				this.identBtnFlottant.setVisible(false);
			}
		} else if (this.donneesRecues) {
			if (!!this.identBtnFlottant) {
				this.identBtnFlottant.setVisible(true);
			}
			lHtml.push("<div>");
			lHtml.push(this.composeServices());
			lHtml.push("</div>");
			const lApp = (0, AccessApp_1.getApp)();
			if (
				lApp.droits.get(
					ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
				) &&
				!this.identBtnFlottant
			) {
				$("#" + lApp.getInterfaceMobile().idZonePrincipale).ieHtmlAppend(
					IE.jsx.str("div", {
						class: "is-sticky",
						"ie-identite": this.jsxgetIdentiteBouton.bind(this),
					}),
					{ avecCommentaireConstructeur: false },
				);
			}
		}
		return lHtml.join("");
	}
	jsxgetIdentiteBouton() {
		return {
			class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
			pere: this,
			init: (aBtn) => {
				this.identBtnFlottant = aBtn;
				const lParam = {
					listeBoutons: [
						{
							primaire: true,
							icone: "icon_uniF1C1",
							ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
								"GenerationPDF.TitreCommande",
							),
							callback: this.afficherModalitesGenerationPDF.bind(this),
						},
					],
				};
				aBtn.setOptionsBouton(lParam);
			},
		};
	}
	setMessage(aMessage) {
		this.message = aMessage;
		this.afficher();
	}
	setDonnees(
		aListeServices,
		aMoyenneGenerale,
		aDonneesAbsences,
		aPiedDePage,
		aAffichage,
		aPositionPeriode,
		aPositionMax,
		aPeriode,
	) {
		this.listeServices = aListeServices;
		this.moyenneGenerale = aMoyenneGenerale;
		this.donneesAbsences = aDonneesAbsences;
		this.PiedDePage = aPiedDePage;
		this.Affichage = aAffichage;
		this.message = false;
		this.periode = aPeriode;
		let lSensSlide;
		this.donneesRecues = true;
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
		this.donneesRecues = true;
	}
	composeServices() {
		const lHtml = [];
		lHtml.push('<ul class="collection collection-thin with-header">');
		if (this.listeServices) {
			for (let I = 0, lNbr = this.listeServices.count(); I < lNbr; I++) {
				const lService = this.listeServices.get(I);
				let lDetailService,
					lDetailSousService,
					lDetailRegroupemement,
					lDetailServiceRegroupement;
				if (!lService.estSousService) {
					if (!lService.estServicePereAvecSousService) {
						if (!lService.SurMatiere || lService.SurMatiere.getNumero() === 0) {
							lDetailService = this.composeDetails(lService, false);
							lHtml.push('<li class="collection-item">');
							lHtml.push('<ul class="collapsible">');
							lHtml.push("<li", lDetailService ? ' class="active"' : "", ">");
							lHtml.push(
								'<div class="collapsible-header',
								lDetailService ? "" : " empty-body",
								'">',
								'<div style="padding:0.2rem 0">' +
									'<div style="border-left: 5px solid ' +
									(!!lService.couleur && lService.couleur !== ""
										? lService.couleur
										: "#D4D4D4") +
									'; padding-left: 0.4rem;">' +
									'<div class="title" style="' +
									(this.getLibelleProfesseur(lService) !== ""
										? "line-height:1.5rem;"
										: "") +
									'">' +
									this.getLibelleService(lService) +
									"</div>" +
									'<div style="line-height:1.5rem;">' +
									this.getLibelleProfesseur(lService) +
									"</div>" +
									"</div>" +
									"</div>" +
									"</div>",
							);
							lHtml.push(
								'<div class="collapsible-body">',
								lDetailService || "",
								"</div>",
							);
							lHtml.push("</li>");
							lHtml.push("</ul>");
							lHtml.push("</li>");
						} else {
							if (lService.estSurMatiere) {
								lDetailRegroupemement = this.composeDetails(lService, false);
								lHtml.push('<li class="collection-item">');
								lHtml.push('<ul class="collapsible">');
								lHtml.push('<li class="active">');
								lHtml.push(
									'<div class="collapsible-header">' +
										'<div style="padding:0.2rem 0rem">' +
										'<div style="padding-left: 0.4rem;">' +
										'<div class="title">' +
										lService.getLibelle() +
										"</div>" +
										"</div>" +
										"</div>" +
										"</div>",
								);
								lHtml.push(
									'<div class="collapsible-body" style="border: 1px solid #D1D1D1;">',
									lDetailRegroupemement || "",
								);
								lHtml.push(
									'<ul class="collection collection-thin with-header">',
								);
							} else {
								lDetailServiceRegroupement = this.composeDetails(
									lService,
									false,
								);
								lHtml.push('<li class="collection-item">');
								lHtml.push('<ul class="collapsible">');
								lHtml.push(
									"<li",
									lDetailServiceRegroupement ? ' class="active"' : "",
									">",
								);
								lHtml.push(
									'<div class="collapsible-header',
									lDetailServiceRegroupement ? "" : " empty-body",
									'"',
									'">',
									'<div style="padding:0.2rem 0">' +
										'<div style="border-left: 5px solid ' +
										(!!lService.couleur && lService.couleur !== ""
											? lService.couleur
											: "#D4D4D4") +
										'; padding-left: 0.4rem;">' +
										'<div class="title" style="' +
										(this.getLibelleProfesseur(lService) !== ""
											? "line-height:1.5rem;"
											: "") +
										'">' +
										this.getLibelleService(lService) +
										"</div>" +
										'<div style="line-height:1.5rem;">' +
										this.getLibelleProfesseur(lService) +
										"</div>" +
										"</div>" +
										"</div>" +
										"</div>",
								);
								lHtml.push(
									'<div class="collapsible-body">',
									lDetailServiceRegroupement || "",
									"</div>",
								);
								lHtml.push("</li>");
								lHtml.push("</ul>");
								lHtml.push("</li>");
								if (lService.estDernierDansSurMatiere) {
									lHtml.push("</ul>");
									lHtml.push("</div>");
									lHtml.push("</li>");
									lHtml.push("</ul>");
									lHtml.push("</li>");
								}
							}
						}
					} else {
						lDetailService = this.composeDetails(lService, false);
						lHtml.push('<li class="collection-item">');
						lHtml.push('<ul class="collapsible">');
						lHtml.push(
							"<li",
							lDetailService || lService.avecSousServiceAffiche
								? ' class="active"'
								: "",
							">",
						);
						lHtml.push(
							'<div class="collapsible-header">' +
								'<div style="padding:0.2rem 0">' +
								'<div style="border-left: 5px solid ' +
								(!!lService.couleur && lService.couleur !== ""
									? lService.couleur
									: "#D4D4D4") +
								'; padding-left: 0.4rem;">' +
								'<div class="title" style="' +
								(this.getLibelleProfesseur(lService) !== ""
									? "line-height:1.5rem;"
									: "") +
								'">' +
								this.getLibelleService(lService) +
								"</div>" +
								'<div style="line-height:1.5rem;">' +
								this.getLibelleProfesseur(lService) +
								"</div>" +
								"</div>" +
								"</div>" +
								"</div>",
						);
						lHtml.push(
							'<div class="collapsible-body" style="border: 1px solid #D1D1D1;">',
							lDetailService || "",
						);
						if (!lService.avecSousServiceAffiche) {
							lHtml.push("</div>");
							lHtml.push("</li>");
							lHtml.push("</ul>");
							lHtml.push("</li>");
							if (lService.estDernierDansSurMatiere) {
								lHtml.push("</ul>");
								lHtml.push("</div>");
								lHtml.push("</li>");
								lHtml.push("</ul>");
								lHtml.push("</li>");
							}
						} else {
							lHtml.push('<ul class="collection collection-thin with-header">');
						}
					}
				} else {
					lDetailSousService = this.composeDetails(lService, true);
					lHtml.push('<li class="collection-item">');
					lHtml.push('<ul class="collapsible" style="margin-left:19px;">');
					lHtml.push("<li", lDetailSousService ? ' class="active"' : "", ">");
					lHtml.push(
						'<div class="collapsible-header',
						lDetailSousService ? "" : " empty-body",
						'">' +
							'<div style="padding:0.2rem 0;">' +
							'<div style="border-left: 5px solid ' +
							(!!lService.couleur && lService.couleur !== ""
								? lService.couleur
								: "#D4D4D4") +
							'; padding-left: 0.4rem;">',
						this.composeLibelleServiceEtProfesseur(lService),
						"</div>" + "</div>" + "</div>",
					);
					lHtml.push(
						'<div class="collapsible-body" >',
						lDetailSousService || "",
						"</div>",
					);
					lHtml.push("</li>");
					lHtml.push("</ul>");
					lHtml.push("</li>");
					if (lService.estDernier) {
						lHtml.push("</ul>");
						lHtml.push("</div>");
						lHtml.push("</li>");
						lHtml.push("</ul>");
						lHtml.push("</li>");
						if (lService.estDernierDansSurMatiere) {
							lHtml.push("</ul>");
							lHtml.push("</div>");
							lHtml.push("</li>");
							lHtml.push("</ul>");
							lHtml.push("</li>");
						}
					}
				}
			}
		}
		if (!!this.Affichage.AvecMoyenneGenerale) {
			const lAvecMoyGenNbPts =
				!!this.Affichage.AvecNombrePointsEleve &&
				!!this.moyenneGenerale.NombrePointsEleve &&
				this.moyenneGenerale.NombrePointsEleve.getNote() !== "";
			const lAvecMoyGenEleve =
				!!this.Affichage.AvecMoyenneEleve &&
				!!this.moyenneGenerale.MoyenneEleve &&
				this.moyenneGenerale.MoyenneEleve.getNote() !== "";
			const lAvecMoyGenClasse =
				!!this.Affichage.AvecMoyenneClasse &&
				this.moyenneGenerale.MoyenneClasse &&
				this.moyenneGenerale.MoyenneClasse.getNote() !== "";
			const lAvecMoyGenMediane =
				!!this.Affichage.AvecMoyenneMediane &&
				this.moyenneGenerale.MoyenneMediane &&
				this.moyenneGenerale.MoyenneMediane.getNote() !== "";
			const lAvecMoyGenInfSup =
				!!this.Affichage.AvecMoyenneInfSup &&
				!!this.moyenneGenerale.MoyenneInf &&
				this.moyenneGenerale.MoyenneInf.getNote() !== "" &&
				!!this.moyenneGenerale.MoyenneSup &&
				this.moyenneGenerale.MoyenneSup.getNote() !== "";
			let lTabCategoriesMoyGen = [];
			if (lAvecMoyGenNbPts) {
				lTabCategoriesMoyGen.push({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.Pts",
					),
					titreLong: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.PtsHint",
					),
					val: this.moyenneGenerale.NombrePointsEleve.getNote(),
				});
			}
			if (lAvecMoyGenEleve) {
				lTabCategoriesMoyGen.push({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ReleveDeNotes.MoyEleve",
					),
					titreLong: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.MoyGenEleve",
					),
					val: this.moyenneGenerale.MoyenneEleve.getNote(),
				});
			}
			if (lAvecMoyGenClasse) {
				lTabCategoriesMoyGen.push({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.Classe",
					),
					titreLong: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.MoyGenClasse",
					),
					val: this.moyenneGenerale.MoyenneClasse.getNote(),
				});
			}
			if (lAvecMoyGenMediane) {
				lTabCategoriesMoyGen.push({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.Mediane",
					),
					titreLong: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.MoyGenMediane",
					),
					val: this.moyenneGenerale.MoyenneMediane.getNote(),
				});
			}
			if (lAvecMoyGenInfSup) {
				lTabCategoriesMoyGen.push({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.MoyInf",
					),
					val: this.moyenneGenerale.MoyenneInf.getNote(),
				});
				lTabCategoriesMoyGen.push({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.MoySup",
					),
					val: this.moyenneGenerale.MoyenneSup.getNote(),
				});
			}
			if (lTabCategoriesMoyGen.length > 1) {
				lHtml.push('<li class="collection-item raised">');
				lHtml.push(
					'<div class="Espace title">',
					ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyGen"),
					"</div>",
				);
				lHtml.push('<div class="Espace">');
				lTabCategoriesMoyGen.forEach((aCategorie) => {
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							aCategorie.titre,
							aCategorie.val,
						),
					);
				});
				lHtml.push("</div>");
				lHtml.push("</li>");
			} else if (lTabCategoriesMoyGen.length === 1) {
				let lCat = lTabCategoriesMoyGen[0];
				lHtml.push('<li class="collection-item raised">');
				lHtml.push(
					'<div class="left title">',
					lCat.titreLong ? lCat.titreLong : lCat.titre,
					"</div>",
				);
				lHtml.push('<div class="right title">');
				lHtml.push(lCat.val);
				lHtml.push("</div>");
				lHtml.push('<div class="clear"></div>');
				lHtml.push("</li>");
			}
		}
		lHtml.push("</ul>");
		if (this.existeDonneesEngagements()) {
			lHtml.push(this._construireEngagements(this.PiedDePage));
		}
		if (this.existeDonneesAbsence()) {
			lHtml.push('<div class="card" style="margin:0.5rem;">');
			lHtml.push('<div class="card-content">');
			lHtml.push('<div id="', this.Nom, '_vieScolaire" class="small">');
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeVieScolaire(
					this.donneesAbsences,
				),
			);
			lHtml.push("</div>");
		}
		if (this.existeDonneesAppreciations()) {
			if (!this.existeDonneesAbsence()) {
				lHtml.push('<div class="card" style="margin:0.5rem;">');
				lHtml.push('<div class="card-content">');
			}
			lHtml.push(
				'<div id="',
				this.Nom,
				'_appreciationGenerale" class="small">',
			);
			const lIntitule =
				this.PiedDePage.ListeAppreciations.general.get(0).Intitule;
			const lContenu = this.PiedDePage.ListeAppreciations.general
				.get(0)
				.ListeAppreciations.get(0)
				.getLibelle();
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
					{ intituleDAppreciation: lIntitule, contenuDAppreciation: lContenu },
				),
			);
			lHtml.push("</div>");
		}
		if (this.existeDonneesAbsence() || this.existeDonneesAppreciations()) {
			lHtml.push("</div>");
			lHtml.push("</div>");
		}
		return lHtml.join("");
	}
	composeDetails(aService, aEstSousService) {
		const lHtml = [];
		const lNbrDevoirs = aService.ListeDevoirs.count();
		if (lNbrDevoirs !== 0) {
			lHtml.push('<div class="content">');
			for (let J = 0; J < lNbrDevoirs; J++) {
				lHtml.push(
					'<div style="' +
						(J < lNbrDevoirs - 1 ? "border-bottom: 1px solid #C4C4C4;" : "") +
						' padding-left:2.1rem;">',
					this.composeDevoir(aService.ListeDevoirs.get(J)),
					"</div>",
				);
			}
			lHtml.push("</div>");
		}
		let lEstMultiLignes = false;
		if (this.Affichage.avecMoyNRUniquement === false) {
			lEstMultiLignes =
				this.Affichage.AvecMoyenneEleve &&
				aService.estMoyNR === true &&
				!!aService.MoyenneEleve &&
				aService.MoyenneEleve.getNote() !== "";
		}
		let lExisteDetaille = false;
		if (
			this.Affichage.AvecNombrePointsEleve &&
			!!aService.NombrePointsEleve &&
			aService.NombrePointsEleve.getValeur() > 0
		) {
			if (!lExisteDetaille) {
				lHtml.push('<div class="Espace">');
				lExisteDetaille = true;
			}
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Pts"),
					aService.NombrePointsEleve.getNote(),
					lEstMultiLignes,
				),
			);
		}
		if (
			this.Affichage.AvecNivMaitriseEleve &&
			!!aService.NiveauDAcquisition &&
			aService.NiveauDAcquisition.existeNumero()
		) {
			const H = [];
			H.push(
				this.moteur.composeHtmlNote({
					note: null,
					niveauDAcquisition: aService.NiveauDAcquisition,
					genrePositionnement:
						TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
							aService.TypePositionnementClasse,
						),
					avecPrefixe: false,
				}),
			);
			if (!lExisteDetaille) {
				lHtml.push('<div class="Espace">');
				lExisteDetaille = true;
			}
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Pos"),
					H.join(""),
					lEstMultiLignes,
				),
			);
		}
		if (
			this.Affichage.AvecMoyenneEleve &&
			((!!aService.MoyenneEleve && aService.MoyenneEleve.getNote() !== "") ||
				aService.estMoyNR === true)
		) {
			const H = [];
			if (aService.estMoyNR === true) {
				H.push(this.moteur.composeHtmlMoyNR());
			}
			if (
				!(
					aService.estMoyNR === true &&
					this.Affichage.avecMoyNRUniquement === true
				)
			) {
				H.push(aService.MoyenneEleve.getNote());
			}
			if (!lExisteDetaille) {
				lHtml.push('<div class="Espace">');
				lExisteDetaille = true;
			}
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					ObjetTraduction_1.GTraductions.getValeur("ReleveDeNotes.MoyEleve"),
					H.join(""),
					lEstMultiLignes,
				),
			);
		}
		if (
			this.Affichage.AvecMoyenneClasse &&
			!!aService.MoyenneClasse &&
			aService.MoyenneClasse.getNote() !== ""
		) {
			if (!lExisteDetaille) {
				lHtml.push('<div class="Espace">');
				lExisteDetaille = true;
			}
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Classe"),
					aService.MoyenneClasse.getNote(),
					lEstMultiLignes,
				),
			);
		}
		if (
			this.Affichage.AvecMoyenneMediane &&
			!!aService.MoyenneMediane &&
			aService.MoyenneMediane.getNote() !== ""
		) {
			if (!lExisteDetaille) {
				lHtml.push('<div class="Espace">');
				lExisteDetaille = true;
			}
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Mediane"),
					aService.MoyenneMediane.getNote(),
					lEstMultiLignes,
				),
			);
		}
		if (this.Affichage.AvecMoyenneInfSup) {
			if (!!aService.MoyenneInf && aService.MoyenneInf.getNote() !== "") {
				if (!lExisteDetaille) {
					lHtml.push('<div class="Espace">');
					lExisteDetaille = true;
				}
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyInf"),
						aService.MoyenneInf.getNote(),
						lEstMultiLignes,
					),
				);
			}
			if (!!aService.MoyenneSup && aService.MoyenneSup.getNote() !== "") {
				if (!lExisteDetaille) {
					lHtml.push('<div class="Espace">');
					lExisteDetaille = true;
				}
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoySup"),
						aService.MoyenneSup.getNote(),
						lEstMultiLignes,
					),
				);
			}
		}
		if (lExisteDetaille) {
			lHtml.push("</div>");
		}
		if (
			aEstSousService &&
			!!this.Affichage.AvecAppreciationParSousService &&
			this.Affichage.NombreAppreciations !== 0 &&
			aService.ListeAppreciations &&
			aService.ListeAppreciations.getLibelle(0) !== ""
		) {
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
					{
						intituleDAppreciation:
							ObjetTraduction_1.GTraductions.getValeur("Appreciation"),
						contenuDAppreciation: aService.ListeAppreciations.getLibelle(0),
					},
				),
			);
		}
		if (
			!aEstSousService &&
			this.Affichage.NombreAppreciations !== 0 &&
			aService.ListeAppreciations &&
			aService.ListeAppreciations.getLibelle(0) !== ""
		) {
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
					{
						intituleDAppreciation:
							ObjetTraduction_1.GTraductions.getValeur("Appreciation"),
						contenuDAppreciation: aService.ListeAppreciations.getLibelle(0),
					},
				),
			);
		}
		if (lHtml.length === 0) {
			return false;
		} else {
			return lHtml.join("");
		}
	}
	composeDevoir(aDevoir) {
		const lNoteAuDessusBareme =
			aDevoir.Note &&
			aDevoir.Bareme &&
			aDevoir.Note.getValeur() > aDevoir.Bareme.getValeur();
		const lStrEtoile = lNoteAuDessusBareme
			? '<i role="img" class="icon icon_star m-right" aria-label="' +
				ObjetTraduction_1.GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'" title="' +
				ObjetTraduction_1.GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'"></i>'
			: "";
		const lEstBaremeParDefaut =
			!aDevoir.Bareme ||
			!aDevoir.BaremeParDefaut ||
			aDevoir.Bareme.getValeur() === aDevoir.BaremeParDefaut.getValeur();
		const lHtml = [];
		lHtml.push('<div class="note-details-conteneur ">');
		lHtml.push(
			aDevoir.Date
				? '<span class="date">' +
						ObjetDate_1.GDate.formatDate(aDevoir.Date, "%JJ/%MM/%AA") +
						"</span>"
				: "",
		);
		lHtml.push('<div class="note-contain">');
		const lNoteAffichee = aDevoir.estFacultatif
			? "(" + aDevoir.Note.getNote() + ")"
			: aDevoir.Note.getNote();
		if (aDevoir.libelleCorrige) {
			const lDocumentJoint = new ObjetElement_1.ObjetElement(
				aDevoir.libelleCorrige,
				aDevoir.getNumero(),
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			);
			lHtml.push(
				ObjetChaine_1.GChaine.composerUrlLienExterne({
					libelle: aDevoir.libelleCorrige,
					libelleEcran: lNoteAffichee,
					genreRessource:
						TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige,
					documentJoint: lDocumentJoint,
				}),
			);
		} else {
			lHtml.push('<span class="note">', lStrEtoile, lNoteAffichee, "</span>");
		}
		lHtml.push(
			'<span class="bareme">',
			lEstBaremeParDefaut && !lNoteAuDessusBareme
				? ""
				: "&nbsp;/" + aDevoir.Bareme.getValeur(),
			"</span>",
		);
		lHtml.push("</div>");
		lHtml.push(
			'<span class="coefficient">',
			!aDevoir.Coefficient || aDevoir.Coefficient.getValeur() === 1
				? "&nbsp;"
				: "(x&nbsp;" + aDevoir.Coefficient + ")",
			"</span>",
		);
		if (aDevoir.Commentaire) {
			lHtml.push('<span class="commentaire">', aDevoir.Commentaire, "</span>");
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeLibelleServiceEtProfesseur(aService) {
		const lHtml = [];
		const lLibelleProfesseur = this.getLibelleProfesseur(aService);
		const lLibelleService = this.getLibelleService(aService);
		if (lLibelleService !== "") {
			lHtml.push("<div>" + lLibelleService + "</div>");
		}
		if (lLibelleProfesseur !== "") {
			lHtml.push("<div>" + lLibelleProfesseur + "</div>");
		}
		return lHtml.join("");
	}
	getLibelleProfesseur(aService) {
		const lTableauProfesseurs = [],
			lNbProfesseur = !!aService.ListeProfesseurs
				? aService.ListeProfesseurs.count()
				: 0;
		for (let J = 0; J < lNbProfesseur; J++) {
			lTableauProfesseurs.push(aService.ListeProfesseurs.getLibelle(J));
		}
		return this.avecLibelleProfesseur(aService)
			? lTableauProfesseurs.join(", ") + ""
			: "";
	}
	getLibelleService(aService) {
		return !!aService.Matiere && !!aService.Matiere.getLibelle()
			? aService.Matiere.getLibelle()
			: "";
	}
	avecLibelleProfesseur(aService) {
		return !!aService.ListeProfesseurs && !!aService.ListeProfesseurs.count();
	}
	existeDonneesAbsence() {
		if (
			(!!this.donneesAbsences.strAbsences &&
				this.donneesAbsences.strAbsences !== "") ||
			(!!this.donneesAbsences.strPunitions &&
				this.donneesAbsences.strPunitions !== "") ||
			(!!this.donneesAbsences.strRetards &&
				this.donneesAbsences.strRetards !== "") ||
			(!!this.donneesAbsences.strSanctions &&
				this.donneesAbsences.strSanctions !== "")
		) {
			return true;
		} else {
			return false;
		}
	}
	existeDonneesAppreciations() {
		if (
			this.PiedDePage &&
			this.PiedDePage.ListeAppreciations &&
			this.PiedDePage.ListeAppreciations.general.get(0).getLibelle() !== ""
		) {
			return true;
		} else {
			return false;
		}
	}
	existeDonneesEngagements() {
		return this.PiedDePage && this.PiedDePage.listeEngagements;
	}
	_construireEngagements(aDonneesPiedDeBulletin) {
		const H = [];
		if (aDonneesPiedDeBulletin.listeEngagements) {
			let lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"PiedDeBulletin.AucunEngagement",
			);
			if (aDonneesPiedDeBulletin.listeEngagements.count()) {
				lLibelle = aDonneesPiedDeBulletin.listeEngagements
					.getTableauLibelles()
					.join(", ");
			}
			H.push(
				`<div class="m-left m-top-xl"><p><span class="Gras"> ${ObjetTraduction_1.GTraductions.getValeur("PiedDeBulletin.Engagements")}</span> : ${lLibelle}</p></div>`,
			);
		}
		return H.join("");
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
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ReleveDeNotes,
			periode: this.periode,
			avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
		};
		UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
			paramPDF: lParametrageAffichage,
			optionsPDF: OptionsPDFSco_1.OptionsPDFSco.ReleveDeNotes,
			cloudCible: aService,
		});
	}
}
exports.ObjetReleveDeNotes = ObjetReleveDeNotes;
