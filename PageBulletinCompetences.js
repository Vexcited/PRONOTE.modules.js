exports.PageBulletinCompetences = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireBulletinEtReleve_Mobile_1 = require("UtilitaireBulletinEtReleve_Mobile");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitaireDeserialiserPiedBulletin_1 = require("UtilitaireDeserialiserPiedBulletin");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const TypeGenreColonneBulletinCompetence_1 = require("TypeGenreColonneBulletinCompetence");
const TypeGenreElementBulletinCompetence_1 = require("TypeGenreElementBulletinCompetence");
const TypeJaugeEvaluationBulletinCompetence_1 = require("TypeJaugeEvaluationBulletinCompetence");
const TypePositionnement_1 = require("TypePositionnement");
const PiedDeBulletinMobile_1 = require("PiedDeBulletinMobile");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetFenetre_1 = require("ObjetFenetre");
const AccessApp_1 = require("AccessApp");
class PageBulletinCompetences extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtiliteurSco = lApplicationSco.getEtatUtilisateur();
		this.interfaceMobile = lApplicationSco.getInterfaceMobile();
		this.donneesRecues = false;
		this.estBilanParMatiere = false;
		this.ids = {
			corpsDePage: this.Nom + "_corpsDePage",
			listeEvaluations: this.Nom + "_listeEvaluations",
			eltProg: this.Nom + "_elementsDuProgramme",
		};
		this.instancePiedDeBulletin = ObjetIdentite_1.Identite.creerInstance(
			PiedDeBulletinMobile_1.PiedDeBulletinMobile,
			{ pere: this, evenement: null },
		);
		this.instancePiedDeBulletin.setDonneesContexte({
			typeContexteBulletin:
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
			avecSaisie: false,
			typeReleveBulletin:
				TypeReleveBulletin_1.TypeReleveBulletin.BulletinCompetences,
		});
	}
	setDonnees(aDonneesCorpsDePage, aEstBilanParMatiere) {
		if (!!aDonneesCorpsDePage.maquette) {
			this.donnees = aDonneesCorpsDePage;
			this.listeServices = new ObjetListeElements_1.ObjetListeElements();
			this.estBilanParMatiere = aEstBilanParMatiere;
			this.donneesRecues = true;
			this.message = "";
		} else {
			this.donnees = null;
			this.estBilanParMatiere = false;
			this.donneesRecues = false;
			this.message = "";
		}
		this.afficher();
		const lDonneesPiedDeBulletin =
			new UtilitaireDeserialiserPiedBulletin_1.UtilitaireDeserialiserPiedBulletin().creerPiedDePage(
				this.donnees,
			);
		const lDonneesAbsences =
			new UtilitaireDeserialiserPiedBulletin_1.UtilitaireDeserialiserPiedBulletin().creerAbsences(
				this.donnees,
			);
		this.instancePiedDeBulletin.setDonneesPiedDeBulletin(
			lDonneesPiedDeBulletin,
			lDonneesAbsences,
		);
		this.instancePiedDeBulletin.afficher();
	}
	afficher(aHtml, aDirectionSlide) {
		super.afficher(aHtml, aDirectionSlide);
	}
	setMessage(aMessage) {
		this.message = aMessage;
		this.afficher();
	}
	construireAffichage() {
		const lHtml = [];
		if (!!this.message) {
			lHtml.push(this.composeAucuneDonnee(this.message));
		} else if (this.donneesRecues) {
			this.formaterListes();
			if (!!this.estBilanParMatiere) {
				lHtml.push(this.composeCorpsDePage(this.estBilanParMatiere, "1"));
			} else {
				lHtml.push(this.composeCombo());
				lHtml.push(
					'<div id="',
					this.ids.corpsDePage,
					'">' +
						this.composeCorpsDePage(this.estBilanParMatiere, "2") +
						"</div>",
				);
			}
			lHtml.push('<div id="', this.instancePiedDeBulletin.getNom(), '"></div>');
		}
		return lHtml.join("");
	}
	formaterListes() {
		let lRegroupement = null;
		if (!!this.donnees && this.donnees.listeLignes.count()) {
			this.donnees.listeLignes.parcourir((D) => {
				if (
					D.getGenre() ===
					TypeGenreElementBulletinCompetence_1
						.TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
				) {
					D.estUnDeploiement = true;
					D.estDeploye = true;
					lRegroupement = D;
				} else {
					if (
						D.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_EltPilier ||
						(D.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Service &&
							D.estDansRegroupement)
					) {
						D.pere = lRegroupement;
					} else {
						lRegroupement = null;
					}
				}
			});
		}
	}
	composeCorpsDePage(aEstBilanParMatiere, aNumero) {
		const lHtml = [];
		let lGenrePositionnement,
			lElem = null,
			lExisteRegroupement = false;
		const lIdListeEvaluations =
			this.ids.listeEvaluations +
			(!!aEstBilanParMatiere
				? "_BilanParMatiere"
				: "_BilanTransversal_" + aNumero);
		if (
			!!this.donnees &&
			!!this.donnees.listeLignes &&
			this.donnees.listeLignes.count()
		) {
			if (!!aEstBilanParMatiere || (!aEstBilanParMatiere && aNumero === "1")) {
				lHtml.push(
					'<ul id="',
					lIdListeEvaluations,
					'" class="collection with-header bg-white bulletin">',
				);
				for (
					let i = 0, lNbrElem = this.donnees.listeLignes.count();
					i < lNbrElem;
					i++
				) {
					lElem = this.donnees.listeLignes.get(i);
					if (
						lElem.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
					) {
						lHtml.push(
							'<li class="collection-header collection-group with-action">',
						);
						lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
						lHtml.push("</li>");
						lExisteRegroupement = true;
					} else if (
						lElem.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_Service
					) {
						const lEstDansRegroupement = !!lElem.estDansRegroupement;
						lHtml.push(
							'<li class="collection-item with-action  ',
							lEstDansRegroupement
								? ""
								: !!lExisteRegroupement
									? " break-group"
									: "",
							'" onclick="',
							this.Nom,
							".ouvrirPanel('",
							lElem.getNumero(),
							"',",
							aEstBilanParMatiere,
							')" style="',
							lEstDansRegroupement
								? "padding:3px 0px 3px 12px;"
								: "padding: 3px 0px 3px 16px;",
							'">',
						);
						lHtml.push(
							'<div class="matiere-conteneur bullCompetences" style="border-color:' +
								(!!lElem.couleur && lElem.couleur !== ""
									? lElem.couleur
									: "D4D4D4") +
								';" >',
						);
						lHtml.push(
							'<div class="libelle">' + lElem.strServiceEtProf + "</div>",
						);
						lHtml.push('<div class="infos-moy-eleve">');
						if (lElem.posLSUNote) {
							lHtml.push('<div class="moyenne-eleve">');
							lHtml.push(lElem.posLSUNote.getNote());
							lHtml.push("</div>");
						}
						if (!!this.donnees.maquette.avecNiveauxPositionnements) {
							if (lElem.posLSUNiveau) {
								lGenrePositionnement =
									this.donnees.positionnementClasse ||
									TypePositionnement_1.TypePositionnement.POS_Echelle;
								lHtml.push('<div class="nivMaitrise-eleve">');
								lHtml.push(
									Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
										{
											niveauDAcquisition: lElem.posLSUNiveau,
											genrePositionnement: lGenrePositionnement,
										},
									),
								);
								lHtml.push("</div>");
							}
						}
						lHtml.push("</div>");
						lHtml.push("</div>");
						lHtml.push("</li>");
						this.listeServices.addElement(lElem);
					}
				}
				lHtml.push("</ul>");
			} else if (!aEstBilanParMatiere && aNumero === "2") {
				lHtml.push(
					'<ul id="',
					lIdListeEvaluations,
					'" class="collection with-header bg-white bulletin">',
				);
				for (
					let i = 0, lNbrElem = this.donnees.listeLignes.count();
					i < lNbrElem;
					i++
				) {
					lElem = this.donnees.listeLignes.get(i);
					if (
						lElem.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
					) {
						lHtml.push(
							'<li class="collection-header collection-group with-action">',
						);
						lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
						lHtml.push("</li>");
						lExisteRegroupement = true;
					} else if (
						lElem.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Service &&
						!!lElem.estDansRegroupement
					) {
						lHtml.push(
							'<li class="collection-item with-action" onclick="',
							this.Nom,
							".ouvrirPanel('",
							lElem.getNumero(),
							"',",
							aEstBilanParMatiere,
							')" style="padding:3px 12px;">',
						);
						lHtml.push(this.composeListeNiveauDAqcuisitions(lElem));
						lHtml.push("</li>");
						this.listeServices.addElement(lElem);
					} else if (
						lElem.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Service &&
						!lElem.estDansRegroupement
					) {
						lHtml.push(
							'<li class="collection-item with-action ',
							!!lExisteRegroupement ? " break-group" : "",
							'" onclick="',
							this.Nom,
							".ouvrirPanel('",
							lElem.getNumero(),
							"',",
							aEstBilanParMatiere,
							')" style="padding:3px 16px;">',
						);
						lHtml.push(this.composeListeNiveauDAqcuisitions(lElem));
						lHtml.push("</li>");
						this.listeServices.addElement(lElem);
					}
				}
				lHtml.push("</ul>");
			} else {
				lHtml.push(
					'<ul id="',
					lIdListeEvaluations,
					'" class="collection with-header bg-white bulletin">',
				);
				for (
					let i = 0, lNbrElem = this.donnees.listeLignes.count();
					i < lNbrElem;
					i++
				) {
					lElem = this.donnees.listeLignes.get(i);
					if (
						lElem.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_SurMatiere
					) {
						lHtml.push(
							'<li class="collection-header collection-group with-action">',
						);
						lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
						lHtml.push("</li>");
						lExisteRegroupement = true;
					} else if (
						lElem.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Service &&
						!!lElem.estDansRegroupement
					) {
						lHtml.push(
							'<li class="collection-item with-action" onclick="',
							this.Nom,
							".ouvrirPanel('",
							lElem.getNumero(),
							"',",
							aEstBilanParMatiere,
							')" style="padding:3px 12px;">',
						);
						lHtml.push(
							'<div style="border-left: 5px solid ' +
								(!!lElem.couleur && lElem.couleur !== ""
									? lElem.couleur
									: "D4D4D4") +
								'; padding: 10px 5px;">',
						);
						lHtml.push("<div>" + lElem.strServiceEtProf + "</div>");
						lHtml.push(this.getImagePastille(lElem, aNumero));
						lHtml.push("</div>");
						lHtml.push("</li>");
						this.listeServices.addElement(lElem);
					} else if (
						lElem.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_Service &&
						!lElem.estDansRegroupement
					) {
						lHtml.push(
							'<li class="collection-item with-action ',
							!!lExisteRegroupement ? " break-group" : "",
							'" onclick="',
							this.Nom,
							".ouvrirPanel('",
							lElem.getNumero(),
							"',",
							aEstBilanParMatiere,
							')" style="padding:3px 16px;">',
						);
						lHtml.push(
							'<div class="flex-contain" style="border-left: 5px solid ' +
								(!!lElem.couleur && lElem.couleur !== ""
									? lElem.couleur
									: "D4D4D4") +
								'; padding: 10px 5px;">',
						);
						lHtml.push(
							'<div class="fluid-bloc">' + lElem.strServiceEtProf + "</div>",
						);
						lHtml.push(this.getImagePastille(lElem, aNumero));
						lHtml.push("</div>");
						lHtml.push("</li>");
						this.listeServices.addElement(lElem);
					}
				}
				lHtml.push("</ul>");
			}
		}
		return lHtml.join("");
	}
	jsxComboModel() {
		return {
			init: (aCombo) => {
				const lListe = new ObjetListeElements_1.ObjetListeElements();
				lListe.add(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur(
							"competences.ToutesLesCompetences",
						),
						"2",
					),
				);
				if (this.donnees.maquette.avecNiveauxPositionnements) {
					lListe.add(
						new ObjetElement_1.ObjetElement(
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.PositionnementGeneral",
							),
							"1",
						),
					);
				}
				if (!!this.donnees.listeLignes && this.donnees.listeLignes.count()) {
					let lElement = null;
					const lNbrEleme = this.donnees.listeLignes.count();
					let i = 0;
					while (!lElement && i < lNbrEleme) {
						if (
							this.donnees.listeLignes.getGenre(i) ===
							TypeGenreColonneBulletinCompetence_1
								.TypeGenreColonneBulletinCompetence.tCBdC_EltPilier
						) {
							lElement = this.donnees.listeLignes.get(i);
						}
						i++;
					}
					if (
						!!lElement &&
						!!lElement.listeColonnesTransv &&
						lElement.listeColonnesTransv.count()
					) {
						lElement.listeColonnesTransv.parcourir((aElementCompetence) => {
							lListe.add(aElementCompetence);
						});
					}
				}
				aCombo.setDonneesObjetSaisie({ liste: lListe });
			},
			event: (aParams) => {
				if (aParams && aParams.estSelectionManuelle && aParams.element) {
					$("#" + this.ids.corpsDePage.escapeJQ()).html(
						this.composeCorpsDePage(
							this.estBilanParMatiere,
							aParams.element.getNumero(),
						),
					);
				}
			},
		};
	}
	composeCombo() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"div",
					{ class: "right" },
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModel.bind(this),
						class: "combo-mobile m-all large",
					}),
				),
				IE.jsx.str("div", { class: "clear" }),
			),
		);
		return H.join("");
	}
	ouvrirPanel(aNumeroService, aEstBilanParMatiere) {
		const lResult = this.composePanel(aNumeroService, aEstBilanParMatiere);
		this.interfaceMobile.openPanel(lResult.html, {
			optionsFenetre: {
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.DetailsMatiere",
				),
				avecNavigation: !!lResult.service,
				titreNavigation: () => {
					return this.composeBandeauService(lResult.service);
				},
				callbackNavigation: (aSuivant) => {
					this.surClickProchainElement(
						lResult.service.getNumero(),
						aSuivant,
						aEstBilanParMatiere,
					);
				},
			},
		});
		$("#" + this.ids.eltProg.escapeJQ())
			.children("ul")
			.addClass("browser-default");
	}
	composePanel(aNumeroElement, aEstBilanParMatiere) {
		const lResult = { service: null, html: "" };
		const lHtml = [];
		let lElemParent, lElem;
		if (!!aEstBilanParMatiere) {
			const lListeElement = new ObjetListeElements_1.ObjetListeElements();
			for (
				let i = 0, lNbrServices = this.donnees.listeLignes.count();
				i < lNbrServices;
				i++
			) {
				lElem = this.donnees.listeLignes.get(i);
				if (
					lElem.getNumero() === aNumeroElement &&
					(lElem.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_Competence ||
						lElem.getGenre() ===
							TypeGenreElementBulletinCompetence_1
								.TypeGenreElementBulletinCompetence.tEBPM_EltPilier)
				) {
					lListeElement.addElement(lElem);
				} else if (
					lElem.getNumero() === aNumeroElement &&
					lElem.getGenre() ===
						TypeGenreElementBulletinCompetence_1
							.TypeGenreElementBulletinCompetence.tEBPM_Service
				) {
					lResult.service = lElem;
					lElemParent = lElem;
				}
			}
			lHtml.push(
				this.composeListeCompetencesEvaluees(
					lListeElement,
					lElemParent,
					aEstBilanParMatiere,
				),
			);
			if (!!lElemParent) {
				if (
					(!!lElemParent.strEltProg && lElemParent.hintEltProg !== "") ||
					(!!lElemParent.strEltProg && lElemParent.strEltProg !== "")
				) {
					lHtml.push('<div style="padding:10px 5px 5px 5px;">');
					const lColonneEltProg = this.donnees.listeColonnes.getElementParGenre(
						TypeGenreColonneBulletinCompetence_1
							.TypeGenreColonneBulletinCompetence.tCBdC_EltProg,
					);
					const lLibellelColonneEltProg =
						!!lColonneEltProg && lColonneEltProg.getLibelle() !== ""
							? lColonneEltProg.getLibelle()
							: "";
					lHtml.push(
						'<div class="left-align color : #616161;">' +
							lLibellelColonneEltProg +
							"</div>",
					);
					lHtml.push('<div id="' + this.ids.eltProg + '" class="Espace">');
					if (!!lElemParent.strEltProg && lElemParent.strEltProg !== "") {
						lHtml.push(lElemParent.strEltProg);
					}
					if (!!lElemParent.hintEltProg && lElemParent.hintEltProg !== "") {
						lHtml.push(lElemParent.hintEltProg);
					}
					lHtml.push("</div>");
					lHtml.push("</div>");
				}
				if (!!lElemParent.appreciationA && lElemParent.appreciationA !== "") {
					const lColonneAppreciationsParMatiere =
						this.donnees.listeColonnes.getElementParGenre(
							TypeGenreColonneBulletinCompetence_1
								.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationA,
						);
					const lLibelleAppreciationsParMatiere =
						!!lColonneAppreciationsParMatiere &&
						lColonneAppreciationsParMatiere.getLibelle() !== ""
							? lColonneAppreciationsParMatiere.getLibelle()
							: "";
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
							{
								intituleDAppreciation: lLibelleAppreciationsParMatiere,
								contenuDAppreciation: lElemParent.appreciationA,
							},
						),
					);
				}
				if (!!lElemParent.appreciationB && lElemParent.appreciationB !== "") {
					const lColonneProgressionParMatiere =
						this.donnees.listeColonnes.getElementParGenre(
							TypeGenreColonneBulletinCompetence_1
								.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationB,
						);
					const lLibelleProgressionParMatiere =
						!!lColonneProgressionParMatiere &&
						lColonneProgressionParMatiere.getLibelle() !== ""
							? lColonneProgressionParMatiere.getLibelle()
							: "";
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
							{
								intituleDAppreciation: lLibelleProgressionParMatiere,
								contenuDAppreciation: lElemParent.appreciationB,
							},
						),
					);
				}
				if (!!lElemParent.appreciationC && lElemParent.appreciationC !== "") {
					const lColonneConseilParMatiere =
						this.donnees.listeColonnes.getElementParGenre(
							TypeGenreColonneBulletinCompetence_1
								.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationC,
						);
					const lLibelleConseilParMatiere =
						!!lColonneConseilParMatiere &&
						lColonneConseilParMatiere.getLibelle() !== ""
							? lColonneConseilParMatiere.getLibelle()
							: "";
					lHtml.push(
						UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
							{
								intituleDAppreciation: lLibelleConseilParMatiere,
								contenuDAppreciation: lElemParent.appreciationC,
							},
						),
					);
				}
			}
		} else {
			lElem = this.donnees.listeLignes.getElementParNumero(aNumeroElement);
			lResult.service = lElem;
			if (!!lElem.listeColonnesTransv && lElem.listeColonnesTransv.count()) {
				lHtml.push(
					this.composeListeCompetencesEvaluees(
						lElem.listeColonnesTransv,
						null,
						aEstBilanParMatiere,
					),
				);
			}
			if (!!lElem && !!lElem.appreciationA && lElem.appreciationA !== "") {
				const lColonneAppreciationsTabTransv =
					this.donnees.listeColonnes.getElementParGenre(
						TypeGenreColonneBulletinCompetence_1
							.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationA,
					);
				const lLibelleAppreciationsTabTransv =
					!!lColonneAppreciationsTabTransv &&
					lColonneAppreciationsTabTransv.getLibelle() !== ""
						? lColonneAppreciationsTabTransv.getLibelle()
						: "";
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
						{
							intituleDAppreciation: lLibelleAppreciationsTabTransv,
							contenuDAppreciation: lElem.appreciationA,
						},
					),
				);
			}
			if (!!lElem && !!lElem.appreciationB && lElem.appreciationB !== "") {
				const lColonneProgressionTabTransv =
					this.donnees.listeColonnes.getElementParGenre(
						TypeGenreColonneBulletinCompetence_1
							.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationB,
					);
				const lLibelleProgressionTabTransv =
					!!lColonneProgressionTabTransv &&
					lColonneProgressionTabTransv.getLibelle() !== ""
						? lColonneProgressionTabTransv.getLibelle()
						: "";
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
						{
							intituleDAppreciation: lLibelleProgressionTabTransv,
							contenuDAppreciation: lElem.appreciationB,
						},
					),
				);
			}
			if (!!lElem && !!lElem.appreciationC && lElem.appreciationC !== "") {
				const lColonneConseilTabTransv =
					this.donnees.listeColonnes.getElementParGenre(
						TypeGenreColonneBulletinCompetence_1
							.TypeGenreColonneBulletinCompetence.tCBdC_AppreciationC,
					);
				const lLibelleConseilTabTransv =
					!!lColonneConseilTabTransv &&
					lColonneConseilTabTransv.getLibelle() !== ""
						? lColonneConseilTabTransv.getLibelle()
						: "";
				lHtml.push(
					UtilitaireBulletinEtReleve_Mobile_1.UtilitaireBulletinEtReleve_Mobile.composeAppreciation(
						{
							intituleDAppreciation: lLibelleConseilTabTransv,
							contenuDAppreciation: lElem.appreciationC,
						},
					),
				);
			}
		}
		lResult.html = lHtml.join("");
		return lResult;
	}
	composeBandeauService(aService) {
		const lHtml = [];
		const lPourcentageReussite = this.donnees.listeColonnes.getElementParGenre(
			TypeGenreColonneBulletinCompetence_1.TypeGenreColonneBulletinCompetence
				.tCBdC_Pourcentage,
		);
		lHtml.push("<span>" + aService.strServiceEtProf + "</span>");
		lHtml.push('<div class="sub-titre-contain">');
		if (
			!!aService.pourcentage &&
			aService.pourcentage !== "" &&
			!!lPourcentageReussite &&
			lPourcentageReussite.getLibelle() !== ""
		) {
			lHtml.push(
				'<div class="per-cent">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.TauxDeReussite",
					) +
					" " +
					aService.pourcentage +
					"%" +
					"</div>",
			);
		}
		if (!!aService.posLSUNiveau) {
			lHtml.push(
				'<div class="pastille-conteneur">' +
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
						{
							niveauDAcquisition: aService.posLSUNiveau,
							genrePositionnement:
								this.donnees.positionnementClasse ||
								TypePositionnement_1.TypePositionnement.POS_Echelle,
						},
					) +
					"</div>",
			);
		}
		if (!!aService.posLSUNote) {
			lHtml.push("<div>" + aService.posLSUNote.getNote() + "</div>");
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeListeCompetencesEvaluees(
		aListeCompetencesEvaluees,
		aElementParent,
		aEstBilanParMatiere,
	) {
		const lHtml = [];
		if (
			(!!aListeCompetencesEvaluees && aListeCompetencesEvaluees.count()) ||
			!!aElementParent
		) {
			lHtml.push(
				'<ul class="collection with-header bg-white bulletin" style="overflow-Y:auto;">',
			);
			if (!!aEstBilanParMatiere) {
				if (!!aElementParent) {
					lHtml.push(this.composeBarreNiveauxDAcquisitions(aElementParent));
				}
				if (!!aListeCompetencesEvaluees && aListeCompetencesEvaluees.count()) {
					for (
						let i = 0,
							lNbrCompetencesEvaluees = aListeCompetencesEvaluees.count();
						i < lNbrCompetencesEvaluees;
						i++
					) {
						let lCompetence = aListeCompetencesEvaluees.get(i);
						const lPourChronologique = this._estJaugeChronologique();
						const listeNiveaux = lPourChronologique
							? lCompetence.listeNiveauxChronologique
							: lCompetence.listeNiveaux;
						lHtml.push(
							'<li class="collection-item ',
							!!listeNiveaux ? "with-action" : "",
							'" onclick="' +
								(!!listeNiveaux
									? this.Nom +
										".surClicJaugeEvaluations(" +
										lCompetence.Position +
										")"
									: ""),
							'">',
							'    <div class="evaluations-conteneur">',
							'      <div class="description">',
							lCompetence.strElmtCompetence,
							"</div>",
							'      <div class="pastilles">',
						);
						if (!!listeNiveaux && listeNiveaux.count()) {
							for (
								let j = 0, lNbrNiveau = listeNiveaux.count();
								j < lNbrNiveau;
								j++
							) {
								const lNiveau =
									GParametres.listeNiveauxDAcquisitions.getElementParElement(
										listeNiveaux.get(j),
									);
								const lNbr = listeNiveaux.get(j).nbr;
								if (lNbr !== null && lNbr !== undefined) {
									if (lNbr !== 0) {
										lHtml.push('<div class="pastille-nbr-conteneur">');
										lHtml.push('<div class="nbr">', lNbr, "</div>");
										lHtml.push(
											"<div >",
											Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
												lNiveau,
											),
											"</div>",
										);
										lHtml.push("</div>");
									}
								} else {
									lHtml.push(
										"<div >",
										Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
											lNiveau,
										),
										"</div>",
									);
								}
							}
						}
						lHtml.push("</div>");
						lHtml.push("</div>");
						lHtml.push("</li>");
					}
				}
			} else {
				for (
					let i = 0,
						lNbrCompetencesEvaluees = aListeCompetencesEvaluees.count();
					i < lNbrCompetencesEvaluees;
					i++
				) {
					let lCompetence = aListeCompetencesEvaluees.get(i);
					const lExisteUnNiveauAcqui = !!lCompetence.niveauAcqui,
						lAUnNiveauAcquiSaisi =
							lExisteUnNiveauAcqui && lCompetence.niveauAcqui.existeNumero(),
						lAUnNiveauAcquiCalcule =
							!!lCompetence.niveauAcquiCalc &&
							lCompetence.niveauAcquiCalc.existeNumero();
					lHtml.push(
						'<li class="collection-item" style="padding-left:4px; padding-right:4px;">',
					);
					lHtml.push("<div>", lCompetence.getLibelle(), "</div>");
					if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
						if (lAUnNiveauAcquiSaisi) {
							lHtml.push(
								'<div class="secondary-content">',
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
									lCompetence.niveauAcqui,
								),
								"</div>",
							);
						}
						lHtml.push(
							'<div class="secondary-content">',
							" (",
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lCompetence.niveauAcquiCalc,
							),
							")",
							"</div>",
						);
					} else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
						if (lAUnNiveauAcquiSaisi) {
							lHtml.push(
								'<div class="secondary-content">',
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
									lCompetence.niveauAcqui,
								),
								"</div>",
							);
						} else {
							lHtml.push(
								'<div class="secondary-content"',
								Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
									lCompetence.niveauAcquiCalc,
								),
								"</div>",
							);
						}
					}
					lHtml.push("</li>");
				}
			}
			lHtml.push("</ul>");
		}
		return lHtml.join("");
	}
	composeListeNiveauDAqcuisitions(aElem) {
		const lHtml = [];
		lHtml.push(
			'<div style="border-left: 5px solid ' +
				(!!aElem.couleur && aElem.couleur !== "" ? aElem.couleur : "D4D4D4") +
				'; padding: 10px 5px;">',
		);
		lHtml.push(
			'<div class="InlineBlock AlignementHaut" style="width:64%;">' +
				aElem.strServiceEtProf +
				"</div>",
		);
		if (!!aElem.listeColonnesTransv && aElem.listeColonnesTransv.count()) {
			lHtml.push(
				'<div class="InlineBlock AlignementHaut right-align" style="width:35%;">',
			);
			for (
				let j = 0, lNbrElement = aElem.listeColonnesTransv.count();
				j < lNbrElement;
				j++
			) {
				const lObjetElementColonneTransv = aElem.listeColonnesTransv.get(j),
					lExisteUnNiveauAcqui = !!lObjetElementColonneTransv.niveauAcqui,
					lAUnNiveauAcquiSaisi =
						lExisteUnNiveauAcqui &&
						lObjetElementColonneTransv.niveauAcqui.existeNumero(),
					lAUnNiveauAcquiCalcule =
						!!lObjetElementColonneTransv.niveauAcquiCalc &&
						lObjetElementColonneTransv.niveauAcquiCalc.existeNumero();
				if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
					if (lAUnNiveauAcquiSaisi) {
						lHtml.push(
							'<div class="InlineBlock" style="',
							!!GParametres.afficherAbbreviationNiveauDAcquisition
								? "padding:0rem 0.2rem;"
								: "",
							'">',
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lObjetElementColonneTransv.niveauAcqui,
							),
							"</div>",
						);
					} else {
						lHtml.push(
							'<div class="InlineBlock" style="width:16px;">&nbsp;</div>',
						);
					}
					lHtml.push(
						'<div class="InlineBlock" style="',
						!!GParametres.afficherAbbreviationNiveauDAcquisition
							? "padding:0rem 0.2rem;"
							: "",
						'">',
						" (",
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lObjetElementColonneTransv.niveauAcquiCalc,
						),
						")",
						"</div>",
					);
				} else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
					if (lAUnNiveauAcquiSaisi) {
						lHtml.push(
							'<div class="InlineBlock" style="',
							!!GParametres.afficherAbbreviationNiveauDAcquisition
								? "padding:0rem 0.2rem;"
								: "",
							'">',
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lObjetElementColonneTransv.niveauAcqui,
							),
							"</div>",
						);
					} else {
						lHtml.push(
							'<div class="InlineBlock" style="',
							!!GParametres.afficherAbbreviationNiveauDAcquisition
								? "padding:0rem 0.2rem;"
								: "",
							'">',
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lObjetElementColonneTransv.niveauAcquiCalc,
							),
							"</div>",
						);
					}
				}
			}
			lHtml.push("</div>");
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeBarreNiveauxDAcquisitions(aElem) {
		const lHtml = [];
		const lInfos = [];
		let lTotal = 0,
			lElt;
		const lListeNiveauxDAcquisitions = MethodesObjet_1.MethodesObjet.dupliquer(
			GParametres.listeNiveauxDAcquisitions,
		);
		let lNiveau,
			lGenre,
			lCouleur,
			lImage,
			lNombre,
			n = lListeNiveauxDAcquisitions.count();
		const lPourChronologique = this._estJaugeChronologique();
		const listeNiveaux = lPourChronologique
			? aElem.listeNiveauxChronologique
			: aElem.listeNiveaux;
		const avecAbsent =
			!lPourChronologique &&
			aElem.getGenre() ===
				TypeGenreElementBulletinCompetence_1.TypeGenreElementBulletinCompetence
					.tEBPM_EltPilier;
		const hint = aElem.hintNiveaux;
		const pourPastille =
			aElem.getGenre() ===
			TypeGenreElementBulletinCompetence_1.TypeGenreElementBulletinCompetence
				.tEBPM_EltPilier;
		if (!!lPourChronologique && listeNiveaux && listeNiveaux.count()) {
			lHtml.push(
				'<li class="collection-header white valign-wrapper',
				!!listeNiveaux ? " with-action" : "",
				'" style="padding: 0.6rem 0.0rem 0.6rem 0.3rem;" onclick="' +
					(!!listeNiveaux
						? this.Nom + ".surClicJaugeEvaluations(" + aElem.Position + ")"
						: ""),
				'">',
			);
			const lSeparateur = "";
			for (let i = 0; i < listeNiveaux.count(); i++) {
				lNiveau = lListeNiveauxDAcquisitions.getElementParGenre(
					listeNiveaux.getGenre(i),
				);
				lCouleur =
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getCouleur(
						lNiveau,
					);
				lHtml.push(
					'<div class="InlineBlock" style="width:2rem; height:2rem; border: 1px solid #343434; background-color:',
					lCouleur,
					'">&nbsp;</div>',
				);
			}
			lHtml.push("</li>");
			return lHtml.join(lSeparateur);
		}
		lListeNiveauxDAcquisitions.setTri([
			ObjetTri_1.ObjetTri.init("positionJauge"),
		]);
		lListeNiveauxDAcquisitions.trier();
		for (let i = 0; i < n; i++) {
			lNiveau = lListeNiveauxDAcquisitions.get(i);
			if (lNiveau.existeNumero()) {
				lGenre = lNiveau.getGenre();
				if (
					avecAbsent ||
					(lGenre !==
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Absent &&
						lGenre !==
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.NonEvalue)
				) {
					lCouleur =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getCouleur(
							lNiveau,
						);
					lImage =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveau,
							{ avecTitle: !hint },
						);
					lNombre =
						listeNiveaux && listeNiveaux.getElementParGenre(lGenre)
							? listeNiveaux.getElementParGenre(lGenre).nbr
							: 0;
					lTotal += lNombre;
					if (lNombre !== 0) {
						lInfos.push({ nombre: lNombre, couleur: lCouleur, image: lImage });
					}
				}
			}
		}
		if (lInfos.length) {
			lHtml.push(
				'<li class="collection-header with-action jauge-conteneur" onclick="' +
					this.Nom +
					".surClicJaugeEvaluations(",
				aElem.Position,
				')">',
			);
			for (let i = 0; i < lInfos.length; i++) {
				lElt = lInfos[i];
				if (pourPastille) {
					lHtml.push(
						'<div class="AlignementDroit EspaceDroit" style="width:',
						100 / (n - 2),
						'%;" >',
					);
					if (!!lElt.nombre) {
						lHtml.push(
							'<div class="InlineBlock" style="margin-right: 5px;">',
							lElt.nombre,
							'</div><div class="InlineBlock">',
							lElt.image,
							"</div></div>",
						);
					} else {
						lHtml.push("&nbsp;");
					}
					lHtml.push("</div>");
				} else {
					if (!!lElt.nombre) {
						lHtml.push(
							'<div class="InlineBlock" style="border:1px solid #343434; background-color:',
							lElt.couleur,
							"; width:",
							(lElt.nombre * 100) / lTotal,
							'%; height: 2rem">&nbsp;</div>',
						);
					}
				}
			}
			lHtml.push("</li>");
		}
		return lHtml.join("");
	}
	_estJaugeChronologique() {
		return (
			this.donnees.maquette.genreJauge ===
			TypeJaugeEvaluationBulletinCompetence_1
				.TypeJaugeEvaluationBulletinCompetence.tJBC_Chronologique
		);
	}
	surClickProchainElement(aNumeroElement, aEstSuivant, aEstBilanParMatiere) {
		let lIndiceElementActuel, lIndiceProchainElement, lNumeroProchainElement;
		for (let i = 0, lNbrElem = this.listeServices.count(); i < lNbrElem; i++) {
			if (aNumeroElement === this.listeServices.getNumero(i)) {
				lIndiceElementActuel = i;
				if (!!aEstSuivant) {
					lIndiceProchainElement =
						lIndiceElementActuel + 1 < this.listeServices.count()
							? lIndiceElementActuel + 1
							: 0;
					lNumeroProchainElement = this.listeServices.getNumero(
						lIndiceProchainElement,
					);
				} else {
					lIndiceProchainElement =
						lIndiceElementActuel === 0
							? this.listeServices.count() - 1
							: lIndiceElementActuel - 1;
					lNumeroProchainElement = this.listeServices.getNumero(
						lIndiceProchainElement,
					);
				}
			}
		}
		if (!!lNumeroProchainElement) {
			this.ouvrirPanel(lNumeroProchainElement, aEstBilanParMatiere);
		}
	}
	getImagePastille(aElement, aNumero) {
		const lHtml = [];
		if (
			!!aElement.listeColonnesTransv &&
			aElement.listeColonnesTransv.count()
		) {
			const lCompetence =
					aElement.listeColonnesTransv.getElementParNumero(aNumero),
				lExisteUnNiveauAcqui = !!lCompetence.niveauAcqui,
				lAUnNiveauAcquiSaisi =
					lExisteUnNiveauAcqui && lCompetence.niveauAcqui.existeNumero(),
				lAUnNiveauAcquiCalcule =
					!!lCompetence.niveauAcquiCalc &&
					lCompetence.niveauAcquiCalc.existeNumero();
			if (lExisteUnNiveauAcqui && lAUnNiveauAcquiCalcule) {
				if (lAUnNiveauAcquiSaisi) {
					lHtml.push(
						'<div class="fix-bloc">',
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lCompetence.niveauAcqui,
						),
						"</div>",
					);
				}
				lHtml.push(
					'<div class="fix-bloc">',
					" (",
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
						lCompetence.niveauAcquiCalc,
					),
					")",
					"</div>",
				);
			} else if (lAUnNiveauAcquiSaisi || lAUnNiveauAcquiCalcule) {
				if (lAUnNiveauAcquiSaisi) {
					lHtml.push(
						'<div class="fix-bloc">',
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lCompetence.niveauAcqui,
						),
						"</div>",
					);
				} else {
					lHtml.push(
						'<div class="fix-bloc"',
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lCompetence.niveauAcquiCalc,
						),
						"</div>",
					);
				}
			}
		}
		return lHtml.join("");
	}
	surClicJaugeEvaluations(aPositionElement) {
		let lElement;
		for (
			let i = 0, lNbrElem = this.donnees.listeLignes.count();
			i < lNbrElem;
			i++
		) {
			if (this.donnees.listeLignes.get(i).Position === aPositionElement) {
				lElement = this.donnees.listeLignes.get(i);
			}
		}
		if (
			!!lElement &&
			!!lElement.relationsESI &&
			!!lElement.relationsESI.length
		) {
			new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
				this,
				this._surReponseRequeteDetailEvaluations.bind(this, lElement),
			).lancerRequete({
				eleve: GEtatUtilisateur.getMembre(),
				periode: this.etatUtiliteurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
				numRelESI: lElement.relationsESI,
			});
		}
	}
	_surReponseRequeteDetailEvaluations(aLigne, aJSON) {
		if (!!aLigne && !!aJSON) {
			const lHtml = [];
			lHtml.push('<ul class="collection with-header  bg-white bulletin">');
			for (let i = 0, lNbrElem = aJSON.listeLignes.count(); i < lNbrElem; i++) {
				const lElement = aJSON.listeLignes.get(i);
				if (lElement.getGenre() === 0 || lElement.getGenre() === 1) {
					lHtml.push('<li class="collection-header browser-default">');
					lHtml.push(
						'<div class="InlineBlock left-align" style="width:80%; vertical-align:top;">',
						lElement.getLibelle(),
						"</div>",
					);
					if (!!lElement.strCoef) {
						lHtml.push(
							'<div class="InlineBlock right-align" style="width:19%; vertical-align:top; padding-right:2px;">' +
								ObjetTraduction_1.GTraductions.getValeur(
									"competences.colonne.coef",
								) +
								" " +
								lElement.strCoef,
							"</div>",
						);
					}
					lHtml.push("</li>");
				} else {
					const lNiveauAcqui = lElement.niveauAcqu;
					const lNiveauAcquiGlobal =
						GParametres.listeNiveauxDAcquisitions.getElementParGenre(
							lNiveauAcqui.getGenre(),
						);
					lHtml.push(
						'<li class="collection-item">',
						'<div style="padding-right: 2.5rem;">',
						lElement.getLibelle(),
						!!lNiveauAcqui && !!lNiveauAcqui.observation
							? '<br/><span style="font-style: italic;">' +
									lNiveauAcqui.observation +
									"</span>"
							: "",
						"</div>",
						'<div class="secondary-content" style="width: 2rem; text-align: center;',
						!!GParametres.afficherAbbreviationNiveauDAcquisition
							? "right:0.9rem"
							: "",
						'" >',
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauAcquiGlobal,
						),
						"</div>",
						"</li>",
					);
				}
			}
			lHtml.push("</ul>");
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_1.ObjetFenetre,
				{ pere: this },
				{ titre: aLigne.getLibelle(), fermerFenetreSurClicHorsFenetre: true },
			).afficher(lHtml.join(""));
		}
	}
}
exports.PageBulletinCompetences = PageBulletinCompetences;
