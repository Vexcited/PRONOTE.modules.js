const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	UtilitaireBulletinEtReleve_Mobile,
} = require("UtilitaireBulletinEtReleve_Mobile.js");
const { EGenreDirectionSlide } = require("EGenreDirectionSlide.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { ObjetElement } = require("ObjetElement.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetBoutonFlottant } = require("ObjetBoutonFlottant.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { GenerationPDF } = require("UtilitaireGenerationPDF.js");
const { OptionsPDFSco } = require("OptionsPDFSco.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
const {
	UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
class ObjetReleveDeNotes extends ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.tableauVisible = [];
		this.donneesRecues = false;
		this.donneesRecues = false;
		this.moteur = new ObjetMoteurReleveBulletin();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getIdentiteBouton: function () {
				return {
					class: ObjetBoutonFlottant,
					pere: this,
					init: function (aBtn) {
						aInstance.identBtnFlottant = aBtn;
						const lParam = {
							listeBoutons: [
								{
									primaire: true,
									icone: "icon_pdf",
									callback: aInstance.afficherModalitesGenerationPDF.bind(
										this,
										aInstance,
										_genererPdf,
									),
								},
							],
						};
						aBtn.setOptionsBouton(lParam);
					},
				};
			},
		});
	}
	afficherModalitesGenerationPDF(aInstance) {
		let lParams = {
			callbaskEvenement: aInstance.surEvenementFenetre.bind(aInstance),
			modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.PDFEtCloud,
			avecDepot: true,
			avecTitreSelonOnglet: true,
		};
		UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
	}
	surEvenementFenetre(aLigne) {
		const lService = GEtatUtilisateur.listeCloudDepotServeur.get(aLigne);
		_genererPdf.call(this, !!lService ? lService.getGenre() : null);
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
			if (
				GApplication.droits.get(
					TypeDroits.autoriserImpressionBulletinReleveBrevet,
				) &&
				!this.identBtnFlottant
			) {
				$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
					'<div class="is-sticky" ie-identite="getIdentiteBouton" ></div>',
					{ controleur: this.controleur, avecCommentaireConstructeur: false },
				);
			}
		}
		return lHtml.join("");
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
			lSensSlide = EGenreDirectionSlide.Droite;
		} else if (this.precedentePosition === 0 && aPositionPeriode > 1) {
			lSensSlide = EGenreDirectionSlide.Gauche;
		} else {
			lSensSlide =
				aPositionPeriode === this.precedentePosition
					? EGenreDirectionSlide.Aucune
					: aPositionPeriode < this.precedentePosition
						? EGenreDirectionSlide.Gauche
						: EGenreDirectionSlide.Droite;
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
			if (
				(lAvecMoyGenEleve && (lAvecMoyGenClasse || lAvecMoyGenMediane)) ||
				(lAvecMoyGenClasse && lAvecMoyGenMediane) ||
				lAvecMoyGenInfSup
			) {
				lHtml.push('<li class="collection-item raised">');
				lHtml.push(
					'<div class="Espace title">',
					GTraductions.getValeur("BulletinEtReleve.MoyGen"),
					"</div>",
				);
				lHtml.push('<div class="Espace">');
				if (lAvecMoyGenEleve) {
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							GTraductions.getValeur("ReleveDeNotes.MoyEleve"),
							this.moyenneGenerale.MoyenneEleve.getNote(),
						),
					);
				}
				if (lAvecMoyGenClasse) {
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							GTraductions.getValeur("BulletinEtReleve.Classe"),
							this.moyenneGenerale.MoyenneClasse.getNote(),
						),
					);
				}
				if (lAvecMoyGenMediane) {
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							GTraductions.getValeur("BulletinEtReleve.Mediane"),
							this.moyenneGenerale.MoyenneMediane.getNote(),
						),
					);
				}
				if (lAvecMoyGenInfSup) {
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							GTraductions.getValeur("BulletinEtReleve.MoyInf"),
							this.moyenneGenerale.MoyenneInf.getNote(),
						),
					);
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
							GTraductions.getValeur("BulletinEtReleve.MoySup"),
							this.moyenneGenerale.MoyenneSup.getNote(),
						),
					);
				}
				lHtml.push("</div>");
				lHtml.push("</li>");
			} else {
				if (lAvecMoyGenEleve) {
					lHtml.push('<li class="collection-item raised">');
					lHtml.push(
						'<div class="left title">',
						GTraductions.getValeur("BulletinEtReleve.MoyGenEleve"),
						"</div>",
					);
					lHtml.push('<div class="right title">');
					lHtml.push(this.moyenneGenerale.MoyenneEleve.getNote());
					lHtml.push("</div>");
					lHtml.push('<div class="clear"></div>');
					lHtml.push("</li>");
				} else if (lAvecMoyGenClasse) {
					lHtml.push('<li class="collection-item raised">');
					lHtml.push(
						'<div class="left title">',
						GTraductions.getValeur("BulletinEtReleve.MoyGenClasse"),
						"</div>",
					);
					lHtml.push('<div class="right title">');
					lHtml.push(this.moyenneGenerale.MoyenneClasse.getNote());
					lHtml.push("</div>");
					lHtml.push('<div class="clear"></div>');
					lHtml.push("</li>");
				} else if (lAvecMoyGenMediane) {
					lHtml.push('<li class="collection-item raised">');
					lHtml.push(
						'<div class="left title">',
						GTraductions.getValeur("BulletinEtReleve.MoyGenMediane"),
						"</div>",
					);
					lHtml.push('<div class="right title">');
					lHtml.push(this.moyenneGenerale.MoyenneMediane.getNote());
					lHtml.push("</div>");
					lHtml.push('<div class="clear"></div>');
					lHtml.push("</li>");
				}
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
				UtilitaireBulletinEtReleve_Mobile.composeVieScolaire(
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
				UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
					intituleDAppreciation: lIntitule,
					contenuDAppreciation: lContenu,
					styleBlockIntitule: "color : #616161;",
					styleBlockContenu:
						"border:1px solid #616161; background-color: #F1F1F1;",
				}),
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
						TypePositionnementUtil.getGenrePositionnementParDefaut(
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
				UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					GTraductions.getValeur("BulletinEtReleve.Pos"),
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
				UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					GTraductions.getValeur("ReleveDeNotes.MoyEleve"),
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
				UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					GTraductions.getValeur("BulletinEtReleve.Classe"),
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
				UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
					GTraductions.getValeur("BulletinEtReleve.Mediane"),
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
					UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						GTraductions.getValeur("BulletinEtReleve.MoyInf"),
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
					UtilitaireBulletinEtReleve_Mobile.composePetitBlocDonnees(
						GTraductions.getValeur("BulletinEtReleve.MoySup"),
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
				UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
					intituleDAppreciation: GTraductions.getValeur("Appreciation"),
					contenuDAppreciation: aService.ListeAppreciations.getLibelle(0),
					styleBlockIntitule: "color : #616161;",
					styleBlockContenu:
						"border:1px solid #616161; background-color: #F1F1F1;",
				}),
			);
		}
		if (
			!aEstSousService &&
			this.Affichage.NombreAppreciations !== 0 &&
			aService.ListeAppreciations &&
			aService.ListeAppreciations.getLibelle(0) !== ""
		) {
			lHtml.push(
				UtilitaireBulletinEtReleve_Mobile.composeAppreciation({
					intituleDAppreciation: GTraductions.getValeur("Appreciation"),
					contenuDAppreciation: aService.ListeAppreciations.getLibelle(0),
					styleBlockIntitule: "color : #616161;",
					styleBlockContenu:
						"border:1px solid #616161; background-color: #F1F1F1;",
				}),
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
			? '<i class="icon icon_star m-right"  aria-label="' +
				GTraductions.getValeur("accueil.noteAuDessusBareme") +
				'" title="' +
				GTraductions.getValeur("accueil.noteAuDessusBareme") +
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
						GDate.formatDate(aDevoir.Date, "%JJ/%MM/%AA") +
						"</span>"
				: "",
		);
		lHtml.push('<div class="note-contain">');
		const lNoteAffichee = aDevoir.estFacultatif
			? "(" + aDevoir.Note.getNote() + ")"
			: aDevoir.Note.getNote();
		if (aDevoir.libelleCorrige) {
			const lDocumentJoint = new ObjetElement(
				aDevoir.libelleCorrige,
				aDevoir.getNumero(),
				EGenreDocumentJoint.Fichier,
			);
			lHtml.push(
				GChaine.composerUrlLienExterne({
					libelle: aDevoir.libelleCorrige,
					libelleEcran: lNoteAffichee,
					genreRessource: TypeFichierExterneHttpSco.DevoirCorrige,
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
			let lLibelle = GTraductions.getValeur("PiedDeBulletin.AucunEngagement");
			if (aDonneesPiedDeBulletin.listeEngagements.count()) {
				lLibelle = aDonneesPiedDeBulletin.listeEngagements
					.getTableauLibelles()
					.join(", ");
			}
			H.push(
				`<div class="m-left m-top-xl"><p><span class="Gras"> ${GTraductions.getValeur("PiedDeBulletin.Engagements")}</span> : ${lLibelle}</p></div>`,
			);
		}
		return H.join("");
	}
	free(...aParams) {
		super.free(...aParams);
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
}
function _genererPdf(aService) {
	const lParametrageAffichage = {
		genreGenerationPDF: TypeHttpGenerationPDFSco.ReleveDeNotes,
		periode: this.periode,
		avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
	};
	GenerationPDF.genererPDF({
		paramPDF: lParametrageAffichage,
		optionsPDF: OptionsPDFSco.ReleveDeNotes,
		cloudCible: aService,
	});
}
module.exports = { ObjetReleveDeNotes };
