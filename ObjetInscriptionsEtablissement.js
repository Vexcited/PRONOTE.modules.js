exports.ObjetInscriptionsEtablissement = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireInscriptions_1 = require("UtilitaireInscriptions");
const Enumere_Inscriptions_1 = require("Enumere_Inscriptions");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const GUID_1 = require("GUID");
const ObjetDate_1 = require("ObjetDate");
const ObjetTri_1 = require("ObjetTri");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_GenerationPdfSco_1 = require("ObjetFenetre_GenerationPdfSco");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Etat_1 = require("Enumere_Etat");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetRequeteRechercheListeDonnees_1 = require("ObjetRequeteRechercheListeDonnees");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetChaine_1 = require("ObjetChaine");
const tag_1 = require("tag");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const TypeOrigineCreationEtatDemandeInscription_1 = require("TypeOrigineCreationEtatDemandeInscription");
const TypeDecisionDemandeInscription_1 = require("TypeDecisionDemandeInscription");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetRequetePageOrientations_1 = require("ObjetRequetePageOrientations");
class ObjetInscriptionsEtablissement extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.champs = new ObjetListeElements_1.ObjetListeElements();
		this.listeCombo = {
			identite: { ville: null, pays: null },
			responsables: [],
		};
		this.idConteneurOptions = GUID_1.GUID.getId();
		this.idListeDocuments = GUID_1.GUID.getId();
		this.idDivResponsable = GUID_1.GUID.getId();
		this.responsableSelectionne = null;
	}
	setListesSaisie(aListes) {
		this.listes = aListes;
	}
	_getDonneesSauvegardeRecherche(aGroupe, aIndice) {
		if (
			[Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables].includes(
				aGroupe,
			)
		) {
			if (!this.sauvegardeRecherches[aGroupe]) {
				this.sauvegardeRecherches[aGroupe] =
					new ObjetListeElements_1.ObjetListeElements();
			}
			if (
				!ObjetListeElements_1.ObjetListeElements.prototype.isPrototypeOf(
					this.sauvegardeRecherches[aGroupe],
				)
			) {
				return;
			}
			let lResult;
			if (this.sauvegardeRecherches[aGroupe].count() > 0) {
				lResult = this.sauvegardeRecherches[aGroupe].get(aIndice);
			}
			if (aIndice >= 1 && !lResult) {
				this.sauvegardeRecherches[aGroupe].addElement(
					new ObjetElement_1.ObjetElement(),
				);
				lResult = this.sauvegardeRecherches[aGroupe].get(aIndice);
			}
			return lResult;
		} else {
			return this.sauvegardeRecherches[aGroupe];
		}
	}
	_surEditionRechercheListe(aObjetChamp, aValue, aCallbackRecherche) {
		const lDonnee = this._getDonneesSauvegardeRecherche(
			aObjetChamp.groupe,
			aObjetChamp.indiceResponsable,
		);
		if (!!lDonnee) {
			lDonnee[aObjetChamp.type] = aValue;
		} else {
		}
		const lParamsRequete = {
			typeRecherche: aObjetChamp.typeRecherche,
			stringRecherche: aValue,
		};
		new ObjetRequeteRechercheListeDonnees_1.ObjetRequeteRechercheListeDonnees(
			this,
		)
			.setOptions({ sansBlocageInterface: true })
			.lancerRequete(lParamsRequete)
			.then((aJSON) => {
				let lListe = aJSON.listeDonnees;
				const lElement = new ObjetElement_1.ObjetElement(
					"&lt;&nbsp;" + aObjetChamp.messageNonTrouve + "&nbsp;&gt;",
				);
				lElement.nonSelectionnable = true;
				lListe.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
				lListe.trier();
				if (!aObjetChamp.avecSaisieAlt && lListe.count() === 0) {
					lListe.addElement(lElement);
				} else if (lListe.count() === 0) {
					this.saisieAlternative(aObjetChamp, aValue);
				}
				aCallbackRecherche({ liste: lListe });
			});
	}
	saisieAlternative(aObjetChamp, aValue) {
		let lFamille = aObjetChamp.groupe;
		let lType = aObjetChamp.type;
		let lDonnee = this.donnees[lFamille];
		if (
			[Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables].includes(
				lFamille,
			)
		) {
			lDonnee = this.getResponsable(aObjetChamp.indiceResponsable);
		}
		if (!!lDonnee && !!lDonnee[lType]) {
			let lElement = lDonnee[lType];
			lElement.setLibelle(aValue);
			lElement.Numero = 0;
		} else {
			let lElement = new ObjetElement_1.ObjetElement(aValue);
			lDonnee[lType] = lElement;
		}
	}
	construireAffichage() {
		if (this.DonneesRecues) {
			return this.composePage();
		} else {
			return "&nbsp;";
		}
	}
	composePage() {
		this.champs = new ObjetListeElements_1.ObjetListeElements();
		if (this.estResume) {
			return this.construireResume();
		} else {
			return this.composeEtape();
		}
	}
	composeEtape() {
		const H = [];
		H.push(
			'<div class="contenu-inscription flex-contain cols justify-between m-top-l">',
		);
		if (this.etape.getGenre() !== Enumere_Inscriptions_1.EEtape.consigne) {
			H.push(
				IE.jsx.str(
					"h3",
					{ class: "m-bottom-xl" },
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.titreEtape",
						[
							this.etape.Position,
							this.listeEtapes.count() - 1,
							this.etape.getLibelle(),
						],
					),
				),
			);
		}
		switch (this.etape.getGenre()) {
			case Enumere_Inscriptions_1.EEtape.consigne:
				H.push(this.composeConsigne());
				break;
			case Enumere_Inscriptions_1.EEtape.identite:
				H.push(this.composeBlocIdentiteEnfant());
				H.push(this.ajouterChampObligatoire());
				break;
			case Enumere_Inscriptions_1.EEtape.scolarite:
				H.push(this.composeBlocScolariteSouhaitee());
				H.push(this.ajouterChampObligatoire());
				break;
			case Enumere_Inscriptions_1.EEtape.responsables: {
				H.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str("div", { "ie-identite": "getOngletResponsables" }),
						IE.jsx.str("div", { id: this.idDivResponsable, class: "m-top-xl" }),
					),
				);
				H.push(this.ajouterChampObligatoire());
				break;
			}
			case Enumere_Inscriptions_1.EEtape.fratrie:
				H.push(this.composeBlocFratrie());
				break;
			case Enumere_Inscriptions_1.EEtape.champsLibre:
				H.push(this.composeBlocChampLibre());
				break;
			case Enumere_Inscriptions_1.EEtape.documents:
				if (
					!!this.session &&
					this.session.listeDocumentsAFournir &&
					this.session.listeDocumentsAFournir.count() > 0
				) {
					H.push(
						this.composeBlocDocumentsAFournir(
							this.session.listeDocumentsAFournir,
						),
					);
					if (
						this.donnees.scolariteActuelle &&
						this.donnees.scolariteActuelle.documentsFournis
					) {
						this.donnees.scolariteActuelle.documentsFournis.parcourir(
							(aDoc) => {
								let lDocumentJoint = new ObjetElement_1.ObjetElement(
									aDoc.getLibelle(),
									aDoc.getNumero(),
									TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
										.DocJointInscription,
								);
								let lIndice =
									this.session.listeDocumentsAFournir.getIndiceParLibelle(
										aDoc.natureDocument,
									);
								this.listeDocumentsFournis[lIndice].addElement(lDocumentJoint);
							},
						);
					}
				}
				break;
			default:
				break;
		}
		if (this.etape.getGenre() === Enumere_Inscriptions_1.EEtape.consigne) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "m-top-l flex-contain justify-center" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnSuivant",
							class: [Type_ThemeBouton_1.TypeThemeBouton.primaire],
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.afficherFormulaire",
						),
					),
				),
			);
		} else {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "m-top-l flex-contain justify-end" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnPrecedent",
							class: [Type_ThemeBouton_1.TypeThemeBouton.neutre, "m-x-l"],
						},
						ObjetTraduction_1.GTraductions.getValeur("Precedent"),
					),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnSuivant",
							class: [Type_ThemeBouton_1.TypeThemeBouton.primaire],
						},
						ObjetTraduction_1.GTraductions.getValeur("Suivant"),
					),
				),
			);
		}
		if (this.etape.estDerniereEtape) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "m-top-xl flex-contain justify-end" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnAnnuler",
							class: [Type_ThemeBouton_1.TypeThemeBouton.secondaire, "m-x-l"],
						},
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "btnValider",
							class: [Type_ThemeBouton_1.TypeThemeBouton.primaire],
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.envoyerDemande",
						),
					),
				),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	ajouterChampObligatoire() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"span",
				{ class: "oie-champsobligatoire m-top" },
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.champsObligatoires",
				),
			),
		);
	}
	setEtape(aEtape) {
		this.etape = aEtape;
		this.estResume = false;
		this.afficher();
		if (this.etape.getGenre() === Enumere_Inscriptions_1.EEtape.documents) {
			this._redessinnerDocumentsFournis();
		}
	}
	surValider() {
		if (this.verifierChamps()) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.msgValidation",
				),
				callback: (aGenreAction) => {
					if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
						const lData = {
							donnees: this.donnees,
							listeDocuments: this.listeDocuments,
						};
						this.callback.appel(
							ObjetInscriptionsEtablissement.GenreEvenement.valider,
							lData,
						);
					}
				},
			});
		}
	}
	surSupprimer() {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.msgConfirmationSuppression",
			),
			callback: (aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					const lData = {
						donnees: this.donnees,
						listeDocuments: this.listeDocuments,
					};
					this.callback.appel(
						ObjetInscriptionsEtablissement.GenreEvenement.supprimer,
						lData,
					);
				}
			},
		});
	}
	surAnnuler() {
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.msgConfirmationAnnulation",
			),
			callback: (aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					this.callback.appel(
						ObjetInscriptionsEtablissement.GenreEvenement.annuler,
					);
				}
			},
		});
	}
	verifierChamps(aAvecMessage = true) {
		let lToutOK = true;
		if (this.etape.getGenre() === Enumere_Inscriptions_1.EEtape.responsables) {
			this._validerAdresse();
		}
		if (this.champs && this.champs.count()) {
			this.champs.parcourir((aChamp) => {
				const lObj = $(`#${aChamp.id}`);
				if (lObj) {
					lObj.attr("aria-invalid", (!aChamp.valide).toString());
				}
				if (!aChamp.valide && !aChamp.optionnel) {
					lToutOK = false;
				}
			});
		}
		if (this.etape.getGenre() === Enumere_Inscriptions_1.EEtape.scolarite) {
			this._validerOptionsFormation();
			if (lToutOK && this.optionsFormation && this.optionsFormation.count()) {
				this.optionsFormation.parcourir((aChamp) => {
					const lObj = $(`#${aChamp.id}`);
					if (lObj) {
						lObj.attr("aria-invalid", (!aChamp.valide).toString());
					}
					if (!aChamp.valide && !aChamp.optionnel) {
						lToutOK = false;
					}
				});
			}
		}
		if (!lToutOK && aAvecMessage) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.msgFormulaireInvalide",
				),
			});
		}
		return lToutOK;
	}
	construireResume() {
		const H = [];
		const lEtatDemande = this.donnees.resumeInscription.etatDemande;
		const lDecision = this.donnees.resumeInscription.decision;
		H.push(
			IE.jsx.str("h3", { class: "p-left m-top-xl" }, this.session.getLibelle()),
		);
		H.push(
			IE.jsx.str(
				"p",
				{ class: "p-left m-bottom-xl" },
				this.donnees.resumeInscription.nomElevePostulant,
			),
		);
		H.push('<div class="resume-inscription">');
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain m-all" },
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.formationDemandee",
					),
				),
				IE.jsx.str(
					"p",
					{ class: "Gras" },
					this.donnees.scolariteActuelle.formation.getLibelle(),
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain m-all" },
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.numeroDossier",
					),
				),
				IE.jsx.str(
					"p",
					{ class: "Gras" },
					this.donnees.resumeInscription.numeroDossier,
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain m-all" },
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.dateEnvoiDossier",
					),
				),
				IE.jsx.str(
					"p",
					{ class: "Gras" },
					ObjetDate_1.GDate.formatDate(
						this.donnees.resumeInscription.dateDemande,
						"%JJ/%MM/%AAAA",
					),
				),
			),
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain m-all" },
				IE.jsx.str(
					"p",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.etatDemande",
					),
				),
				IE.jsx.str(
					"p",
					{ class: "Gras" },
					TypeOrigineCreationEtatDemandeInscription_1.TypeOrigineCreationEtatDemandeInscriptionUtil.getLibelle(
						lEtatDemande,
					),
				),
			),
		);
		if (
			lDecision !==
			TypeDecisionDemandeInscription_1.TypeDecisionDemandeInscription
				.ddi_EnCours
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain m-all" },
					IE.jsx.str(
						"p",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.decision",
						),
					),
					IE.jsx.str(
						"p",
						{ class: "Gras" },
						TypeDecisionDemandeInscription_1.TypeDecisionDemandeInscriptionUtil.getLibelle(
							lDecision,
						),
						IE.jsx.str("i", {
							class: [
								TypeDecisionDemandeInscription_1.TypeDecisionDemandeInscriptionUtil.getClass(
									lDecision,
								),
								"m-left-l",
							],
							role: "presentation",
						}),
					),
				),
			);
		}
		H.push(
			IE.jsx.str(
				"ie-bouton",
				{
					class: [
						Type_ThemeBouton_1.TypeThemeBouton.neutre,
						"m-top-xl m-bottom-big",
					],
					"ie-model": "btnImpressionInscription",
				},
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.telechargerDemande",
				),
			),
		);
		if (this.donnees.resumeInscription.annotationEtat) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-center m-bottom-l" },
						IE.jsx.str("i", {
							class: [
								TypeOrigineCreationEtatDemandeInscription_1.TypeOrigineCreationEtatDemandeInscriptionUtil.getIcone(
									lEtatDemande,
								),
								"m-right-l icon",
							],
							role: "presentation",
						}),
						IE.jsx.str(
							"h2",
							{ class: "ie-titre" },
							ObjetTraduction_1.GTraductions.getValeur(
								"inscriptionsEtablissement.annotation",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "m-top p-all-xl annotation-etat" },
						this.donnees.resumeInscription.annotationEtat,
					),
				),
			);
		}
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-top-l flex-contain justify-end" },
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": "btnSupprimer",
						class: [Type_ThemeBouton_1.TypeThemeBouton.secondaire, "m-x-l"],
					},
					ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				),
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": "btnModifier",
						class: [Type_ThemeBouton_1.TypeThemeBouton.primaire],
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.modifierDemande",
					),
				),
			),
		);
		H.push("</div>");
		return H.join("");
	}
	composeConsigne() {
		return (0, tag_1.tag)(
			"div",
			{ class: ["oie_consigne", "flex-contain", "flex-cols"] },
			(aTabs) => {
				let lAvecEspace = false;
				if (!!this.session.libelleConsigne) {
					aTabs.push(
						IE.jsx.str(
							"span",
							null,
							this.session.libelleConsigne.replaceRCToHTML(),
						),
					);
					lAvecEspace = true;
				}
				if (!!this.session.documentsConsigne) {
					aTabs.push(
						IE.jsx.str(
							"div",
							null,
							ObjetChaine_1.GChaine.composerUrlLienExterne({
								documentJoint: this.session.documentsConsigne.get(0),
							}),
						),
					);
					lAvecEspace = true;
				}
				aTabs.push(
					IE.jsx.str(
						"div",
						{ class: [lAvecEspace ? "m-top-big" : "", "Gras"] },
						IE.jsx.str(
							"p",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"inscriptionsEtablissement.msgAvertissementConsigne",
							),
						),
					),
				);
			},
		);
	}
	composeBlocResponsable(aIndice) {
		this.champs = new ObjetListeElements_1.ObjetListeElements();
		const lEstSupplementaire = aIndice > 0;
		const lDonnees = this.getResponsable(aIndice);
		const lDisabled =
			!lEstSupplementaire &&
			GEtatUtilisateur.GenreEspace !==
				Enumere_Espace_1.EGenreEspace.Inscription;
		const H = [];
		H.push(`<div class="zone-formulaire">`);
		H.push("<div>");
		let lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.civilite",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.civilite,
			optionnel: true,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
			disabled: lDisabled,
		});
		lChamp.multiSelection = false;
		lChamp.selection =
			!!lDonnees && !!lDonnees.civilite
				? this.listes.listeCivilites.getIndiceParLibelle(
						lDonnees.civilite.getLibelle(),
					)
				: -1;
		H.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.nom",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.nom,
			optionnel: lDisabled,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
			autocomplete: "family-name",
			disabled: lDisabled,
		});
		H.push(this.ajouterInput(lChamp));
		this._validerChamp(lChamp.getNumero(), !!lDonnees && !!lDonnees.nom);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.nomNaissance",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.nomNaissance,
			optionnel: true,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
			disabled: lDisabled,
		});
		H.push(this.ajouterInput(lChamp));
		this._validerChamp(lChamp.getNumero(), !!lDonnees && !!lDonnees.nom);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.prenom",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.prenom,
			optionnel: lDisabled,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
			autocomplete: "given-name",
			disabled: lDisabled,
		});
		H.push(this.ajouterInput(lChamp));
		this._validerChamp(lChamp.getNumero(), !!lDonnees && !!lDonnees.prenoms);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.responsabilites",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.responsabilite,
			optionnel: false,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
			disabled: false,
		});
		lChamp.indiceResponsable = aIndice;
		lChamp.multiSelection = false;
		lChamp.selection =
			!!lDonnees && lDonnees.niveauResponsabilite
				? this.listes.listeResponsabilites.getIndiceParNumeroEtGenre(
						lDonnees.niveauResponsabilite.getNumero(),
					)
				: -1;
		H.push(this.ajouterRecherche(lChamp));
		this._validerChamp(
			lChamp.getNumero(),
			!!lDonnees && !!lDonnees.niveauResponsabilite,
		);
		if (this.listes.listeLienParente && this.listes.listeLienParente.count()) {
			lChamp = new ObjetChampInscription({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.lien",
				),
				groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription.parente,
				optionnel: true,
				suffixe: aIndice.toString(),
				modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
				size: 40,
				disabled: false,
			});
			lChamp.multiSelection = false;
			lChamp.selection =
				!!lDonnees && lDonnees.parente
					? this.listes.listeLienParente.getIndiceParLibelle(
							lDonnees.parente.getLibelle(),
						)
					: -1;
			H.push(this.ajouterRecherche(lChamp));
		}
		if (this.session && this.session.avecResponsabilites) {
			H.push('<div class="oie-container-check p-top-l">');
			lChamp = new ObjetChampInscription({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.hebergeEnfant",
				),
				groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription.hebergeEnfant,
				optionnel: true,
				suffixe: aIndice.toString(),
				modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
				size: 40,
				disabled: false,
			});
			H.push(this.ajouterCheckBox(lChamp));
			lChamp = new ObjetChampInscription({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.responsableFinancier",
				),
				groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription
					.responsableFinancier,
				optionnel: true,
				suffixe: aIndice.toString(),
				modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
				size: 40,
				disabled: false,
			});
			H.push(this.ajouterCheckBox(lChamp));
			lChamp = new ObjetChampInscription({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.percoitAides",
				),
				groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription.percoitAides,
				optionnel: true,
				suffixe: aIndice.toString(),
				modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
				size: 40,
				disabled: false,
			});
			H.push(this.ajouterCheckBox(lChamp));
			H.push("</div>");
		}
		const lObligatoire =
			GEtatUtilisateur.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Inscription;
		H.push(
			this.ajouterChampAdresse(
				Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
				aIndice,
				lDisabled,
				lObligatoire,
			),
		);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.telephoneMobile",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.numeroTelMobile,
			optionnel: lDisabled || !!lEstSupplementaire,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
			disabled: lDisabled,
		});
		lChamp.typeSup =
			Enumere_Inscriptions_1.ETypeDonneeInscription.indicatifTelMobile;
		H.push(this.ajouterInputTelephone(lChamp));
		this._validerChamp(
			lChamp.getNumero(),
			!!lDonnees && !!lDonnees.numeroTelMobile,
		);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.telephone",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.numeroTelFixe,
			optionnel: true,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Telephone,
			size: 40,
			disabled: lDisabled,
		});
		lChamp.typeSup =
			Enumere_Inscriptions_1.ETypeDonneeInscription.indicatifTelFixe;
		H.push(this.ajouterInputTelephone(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.email",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.email,
			optionnel: true,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
			disabled: !lEstSupplementaire,
		});
		lChamp.typeSup =
			Enumere_Inscriptions_1.ETypeDonneeInscription.indicatifTelFixe;
		H.push(this.ajouterInput(lChamp));
		H.push("</div>");
		H.push(
			this.composeBlocInformationsAdministratives(aIndice, lDonnees, lDisabled),
		);
		H.push("</div>");
		return H.join("");
	}
	composeBlocInformationsAdministratives(aIndice, aDonnees, aDisabled) {
		const H = [];
		H.push('<div class="oie-info-admin">');
		H.push(
			(0, tag_1.tag)(
				"h3",
				{ class: "ie-titre-couleur m-y-xl" },
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.infosAdministrativesCourt",
				),
			),
		);
		let lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.situation",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.situation,
			optionnel: true,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
			disabled: aDisabled,
		});
		lChamp.indiceResponsable = aIndice;
		lChamp.multiSelection = false;
		lChamp.selection =
			!!aDonnees && !!aDonnees.situation
				? this.listes.listeSituations.getIndiceParLibelle(
						aDonnees.situation.getLibelle(),
					)
				: -1;
		H.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.profession",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.profession,
			optionnel: true,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
			disabled: aDisabled,
		});
		lChamp.indiceResponsable = aIndice;
		lChamp.typeRecherche =
			ObjetRequeteRechercheListeDonnees_1.TypeRechercheListe.trl_profession;
		lChamp.messageNonTrouve = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.professionNonTrouvee",
		);
		lChamp.avecSaisieAlt = false;
		H.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.telephone",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.numeroTelBureau,
			optionnel: true,
			suffixe: aIndice.toString(),
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Telephone,
			size: 40,
			disabled: aDisabled,
		});
		lChamp.indiceResponsable = aIndice;
		lChamp.typeSup =
			Enumere_Inscriptions_1.ETypeDonneeInscription.indicatifTelBureau;
		H.push(this.ajouterInputTelephone(lChamp));
		H.push("</div>");
		return H.join("");
	}
	composeBlocFratrie() {
		const H = [];
		H.push('<div class="zone-formulaire">');
		let lIndexElement = this.donnees.fratrie.count();
		this.donnees.fratrie.parcourir((aElement) => {
			H.push(
				this.ajouterInputLectureSeule(
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.nom",
					),
					aElement.Nom,
				),
			);
			H.push(
				this.ajouterInputLectureSeule(
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.prenom",
					),
					aElement.Prenom,
				),
			);
			H.push(
				this.ajouterInputLectureSeule(
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.classe",
					),
					aElement.Classe,
				),
			);
			if (lIndexElement-- !== 1) {
				H.push('<hr class="separateur m-bottom-xl"></hr>');
			}
		});
		H.push("</div>");
		return H.join("");
	}
	composerOptions() {
		const H = [];
		this.optionsFormation = new ObjetListeElements_1.ObjetListeElements();
		let lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.options,
			optionnel: false,
			suffixe: "OBL1",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lChamp.Genre =
			ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.specialite;
		lChamp.listeElements = "obligatoires";
		H.push(this.ajouterComboOptions(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.options,
			optionnel: false,
			suffixe: "LV",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.Genre =
			ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1;
		lChamp.listeElements = "lve1";
		H.push(this.ajouterComboOptions(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.options,
			optionnel: false,
			suffixe: "LV2",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.Genre =
			ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2;
		lChamp.listeElements = "lve2";
		H.push(this.ajouterComboOptions(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.options,
			optionnel: true,
			suffixe: "FAC1",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.Genre =
			ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.option;
		lChamp.listeElements = "facultatives";
		H.push(this.ajouterComboOptions(lChamp));
		return H.join("");
	}
	composeBlocScolariteSouhaitee() {
		const lHtml = [];
		lHtml.push('<div class="zone-formulaire">');
		let lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.ine",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.ine,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lHtml.push(this.ajouterInput(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.etabActuel",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.etablissementActuel,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeRecherche =
			ObjetRequeteRechercheListeDonnees_1.TypeRechercheListe.trl_etablissement;
		lChamp.messageNonTrouve = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.etablissementNonTrouve",
		);
		lChamp.avecSaisieAlt = true;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.classe",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.classeActuelle,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeSup =
			Enumere_Inscriptions_1.ETypeDonneeInscription.indicatifTelFixe;
		lHtml.push(this.ajouterInput(lChamp));
		if (this.session && this.session.avecProjetAccompagnement) {
			lChamp = new ObjetChampInscription({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.ProjetAccompagnement",
				),
				groupe:
					Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription
					.projetsAccompagnement,
				optionnel: true,
				suffixe: "",
				modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
				size: 40,
			});
			lChamp.multiSelection = false;
			lChamp.selection = this.donnees.scolariteActuelle.projetsAccompagnement
				? this.listes.listeProjetsAccompagnement.getIndiceParLibelle(
						this.donnees.scolariteActuelle.projetsAccompagnement.getLibelle(),
					)
				: -1;
			lHtml.push(this.ajouterRecherche(lChamp));
			lChamp = new ObjetChampInscription({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.CommentaireProjets",
				),
				groupe:
					Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription.commentairePA,
				optionnel: true,
			});
			lChamp.rows = "10";
			lChamp.cols = "33";
			lChamp.placeHolder = ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.CommentaireProjets",
			);
			lChamp.hideLabel = true;
			lHtml.push(this.ajouterTextarea(lChamp));
		}
		lHtml.push(
			(0, tag_1.tag)(
				"h3",
				{ class: "ie-titre-couleur m-y-xl" },
				ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.scolariteSouhaitee",
				),
			),
		);
		lChamp = new ObjetChampInscription({
			libelle: this.applicationSco.estPrimaire
				? ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.classeSouhaitee",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.formation",
					),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.formation,
			optionnel: false,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lHtml.push(this.ajouterRecherche(lChamp));
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{ id: this.idConteneurOptions, class: ["ConteneurComboOptions"] },
				this.composerOptions(),
			),
		);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.redoublant",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.redoublant,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 5,
		});
		lChamp.elements = new ObjetListeElements_1.ObjetListeElements();
		const lOui = new ObjetElement_1.ObjetElement("oui");
		lOui.value = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.oui",
		);
		lOui.id = lChamp.id + "redoublantOui";
		lOui.checked = this.donnees.scolariteActuelle
			? this.donnees.scolariteActuelle.redoublant
			: false;
		lOui.valeurCoche = true;
		lChamp.elements.addElement(lOui);
		const lNon = new ObjetElement_1.ObjetElement("non");
		lNon.value = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.non",
		);
		lNon.id = lChamp.id + "redoublantNon";
		lNon.checked = this.donnees.scolariteActuelle
			? !this.donnees.scolariteActuelle.redoublant
			: true;
		lNon.valeurCoche = false;
		lChamp.elements.addElement(lNon);
		lHtml.push(this.ajouterInputRadio(lChamp));
		if (!this.applicationSco.estPrimaire) {
			lChamp = new ObjetChampInscription({
				libelle: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.regime",
				),
				groupe:
					Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription.regime,
				optionnel: true,
				suffixe: "",
				modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
				size: 40,
			});
			lChamp.multiSelection = false;
			lChamp.selection = this.donnees.scolariteActuelle.regime
				? this.listes.listeRegimes.getIndiceParLibelle(
						this.donnees.scolariteActuelle.regime.getLibelle(),
					)
				: -1;
			lHtml.push(this.ajouterRecherche(lChamp));
		}
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.boursier",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.boursier,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 5,
		});
		lChamp.elements = new ObjetListeElements_1.ObjetListeElements();
		const lOuiBoursier = new ObjetElement_1.ObjetElement("oui");
		lOuiBoursier.value = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.oui",
		);
		lOuiBoursier.id = lChamp.id + "boursierOui";
		lOuiBoursier.checked = this.donnees.scolariteActuelle
			? this.donnees.scolariteActuelle.boursier
			: false;
		lOuiBoursier.valeurCoche = true;
		lChamp.elements.addElement(lOuiBoursier);
		const lNonBoursier = new ObjetElement_1.ObjetElement("non");
		lNonBoursier.value = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.non",
		);
		lNonBoursier.id = lChamp.id + "boursierNon";
		lNonBoursier.checked = this.donnees.scolariteActuelle
			? !this.donnees.scolariteActuelle.boursier
			: true;
		lNonBoursier.valeurCoche = false;
		lChamp.elements.addElement(lNonBoursier);
		lHtml.push(this.ajouterInputRadio(lChamp));
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeBlocChampLibre() {
		const lHtml = [];
		lHtml.push('<div class="zone-formulaire">');
		const lChamp = new ObjetChampInscription({
			libelle: this.session.libelleCommentaire,
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.scolariteActuelle,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.commentaire,
			optionnel: true,
		});
		lChamp.rows = "10";
		lChamp.cols = "33";
		lChamp.hideLabel = true;
		lHtml.push(this.ajouterTextarea(lChamp));
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeBlocIdentiteEnfant() {
		const lHtml = [];
		lHtml.push('<div class="zone-formulaire">');
		let lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.civilite",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.civilite,
			optionnel: true,
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.multiSelection = false;
		lChamp.selection =
			this.donnees && this.donnees.identite && this.donnees.identite.civilite
				? this.listes.listeCivilites.getIndiceParElement(
						this.donnees.identite.civilite,
					)
				: -1;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.nom",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.nomEnfant,
			optionnel: false,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lHtml.push(this.ajouterInput(lChamp));
		this._validerChamp(
			lChamp.getNumero(),
			!!this.donnees &&
				!!this.donnees.identite &&
				!!this.donnees.identite.nomEnfantPostulant,
		);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.prenom",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.prenomEnfant,
			optionnel: false,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lHtml.push(this.ajouterInput(lChamp));
		this._validerChamp(
			lChamp.getNumero(),
			!!this.donnees &&
				!!this.donnees.identite &&
				!!this.donnees.identite.prenomEnfantPostulant,
		);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.sexe",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.sexe,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 5,
		});
		lChamp.elements = new ObjetListeElements_1.ObjetListeElements();
		const lGarcon = new ObjetElement_1.ObjetElement("garcon");
		lGarcon.value = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.garcon",
		);
		lGarcon.id = lChamp.id + "sexeG";
		lGarcon.checked = this.donnees.identite
			? !this.donnees.identite.sexeEnfant
			: false;
		lGarcon.valeurCoche = 0;
		lChamp.elements.addElement(lGarcon);
		const lFille = new ObjetElement_1.ObjetElement("fille");
		lFille.value = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.fille",
		);
		lFille.id = lChamp.id + "sexeF";
		lFille.checked = this.donnees.identite
			? !!this.donnees.identite.sexeEnfant
			: true;
		lFille.valeurCoche = 1;
		lChamp.elements.addElement(lFille);
		lHtml.push(this.ajouterInputRadio(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.dateNaissance",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.dateNaissance,
			optionnel: false,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 5,
		});
		lHtml.push(this.ajouterInputDateNaissance(lChamp));
		this._validerChamp(
			lChamp.getNumero(),
			!!this.donnees &&
				!!this.donnees.identite &&
				!!this.donnees.identite.dateNaissance,
		);
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.villeNaissance",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.villeNaissance,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeRecherche =
			ObjetRequeteRechercheListeDonnees_1.TypeRechercheListe.trl_ville;
		lChamp.messageNonTrouve = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.villeNonTrouvee",
		);
		lChamp.avecSaisieAlt = true;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.paysNaissance",
			),
			groupe: Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.paysNaissance,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeRecherche =
			ObjetRequeteRechercheListeDonnees_1.TypeRechercheListe.trl_pays;
		lChamp.messageNonTrouve = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.paysNonTrouve",
		);
		lChamp.avecSaisieAlt = true;
		lHtml.push(this.ajouterRecherche(lChamp));
		lHtml.push(
			this.ajouterChampAdresse(
				Enumere_Inscriptions_1.EGroupeDonneeInscription.identite,
			),
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	ajouterChampAdresse(
		aGroupeDonnee,
		aIndiceResponsable = 0,
		aDisabled = false,
		lObligatoire = false,
	) {
		const lHtml = [];
		lHtml.push(
			this.ajouterInputAdresse(
				aGroupeDonnee,
				aIndiceResponsable,
				aDisabled,
				lObligatoire,
			),
		);
		lHtml.push(
			this.ajouterInput(
				new ObjetChampInscription({
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.CPVille",
					),
					groupe: aGroupeDonnee,
					type: Enumere_Inscriptions_1.ETypeDonneeInscription.codePostal,
					optionnel: !lObligatoire,
					modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
					size: 40,
					autocomplete: "postal-code",
					disabled: aDisabled,
				}),
			),
		);
		let lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.ville",
			),
			groupe: aGroupeDonnee,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.ville,
			optionnel: !lObligatoire,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
			size: 40,
			autocomplete: "address-level2",
			disabled: aDisabled,
		});
		lChamp.typeRecherche =
			ObjetRequeteRechercheListeDonnees_1.TypeRechercheListe.trl_ville;
		lChamp.messageNonTrouve = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.villeNonTrouvee",
		);
		lChamp.avecSaisieAlt = true;
		lChamp.indiceResponsable = aIndiceResponsable;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: ObjetTraduction_1.GTraductions.getValeur(
				"inscriptionsEtablissement.pays",
			),
			groupe: aGroupeDonnee,
			type: Enumere_Inscriptions_1.ETypeDonneeInscription.pays,
			optionnel: true,
			suffixe: "",
			modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_All,
			size: 40,
			autocomplete: "address-level1",
			disabled: aDisabled,
		});
		lChamp.typeRecherche =
			ObjetRequeteRechercheListeDonnees_1.TypeRechercheListe.trl_pays;
		lChamp.messageNonTrouve = ObjetTraduction_1.GTraductions.getValeur(
			"inscriptionsEtablissement.paysNonTrouve",
		);
		lChamp.indiceResponsable = aIndiceResponsable;
		lChamp.avecSaisieAlt = true;
		lHtml.push(this.ajouterRecherche(lChamp));
		return lHtml.join("");
	}
	composeBlocDocumentsAFournir(aListeDocuments) {
		const lHtml = [];
		lHtml.push('<div class="zone-formulaire">');
		lHtml.push('<ul class="liste-document">');
		aListeDocuments.parcourir((aElt) => {
			const lIndice = aListeDocuments.getIndiceParLibelle(aElt.getLibelle());
			lHtml.push('<li class="m-y">');
			lHtml.push(
				'<div class="EspaceHaut EspaceBas" ie-model="selecFile(',
				lIndice,
				')" ie-selecfile>',
				'<i class="icon_piece_jointe icon_personnalise_pj" role="presentation"></i>',
				'<span class="PetitEspaceGauche">',
				aElt.getLibelle(),
				"</span>",
				"</div>",
			);
			const lIdent = this.idListeDocuments + lIndice;
			this.listeDocumentsFournis[lIndice] =
				new ObjetListeElements_1.ObjetListeElements();
			lHtml.push('<div id="', lIdent, '"></div>');
			lHtml.push("</li>");
		});
		lHtml.push("</ul>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	addFiles(aIndice, aDocument) {
		const lElement = aDocument.eltFichier;
		this.listeDocuments.addElement(lElement);
		lElement.natureDocument = this.session.listeDocumentsAFournir.get(aIndice);
		lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		this.listeDocumentsFournis[aIndice].addElement(lElement);
		this._redessinnerDocumentsFournis();
	}
	getControleur(aInstance) {
		return {
			getOngletResponsables() {
				return {
					class: ObjetTabOnglets_1.ObjetTabOnglets,
					pere: aInstance,
					init: function (aInstanceTab) {
						aInstanceTab.setOptions({ largeurOnglets: 180 });
					},
					start: function (aInstanceTab) {
						aInstance.identTabs = aInstanceTab;
						const lListeOngletResp =
							new ObjetListeElements_1.ObjetListeElements();
						if (aInstance.session) {
							for (let i = 0; i < aInstance.session.nbResponsables; i++) {
								const lElement = new ObjetElement_1.ObjetElement(
									ObjetTraduction_1.GTraductions.getValeur(
										"inscriptionsEtablissement.responsable",
										[i + 1],
									),
								);
								lElement.indiceResponsable = i;
								lElement.idDiv = aInstance.idDivResponsable;
								lListeOngletResp.add(lElement);
							}
						}
						aInstance.ongletSelectionne = lListeOngletResp.get(0);
						aInstance.responsableSelectionne = aInstance.getResponsable(0);
						aInstanceTab.setDonnees(lListeOngletResp);
						aInstanceTab.selectOnglet(0);
					},
					evenement: function (aOnglet) {
						if (aOnglet) {
							if (
								aInstance.ongletSelectionne &&
								aOnglet.indiceResponsable !==
									aInstance.ongletSelectionne.indiceResponsable
							) {
								if (
									!aInstance.saisieResponsableEnCours() ||
									aInstance.verifierChamps()
								) {
									aInstance.responsableSelectionne = aInstance.getResponsable(
										aOnglet.indiceResponsable,
									);
									aInstance.ongletSelectionne = aOnglet;
								} else {
									aInstance.identTabs.selectOnglet(
										aInstance.ongletSelectionne.indiceResponsable,
										false,
									);
								}
							}
							$(`#${aInstance.ongletSelectionne.idDiv}`).show();
							ObjetHtml_1.GHtml.setHtml(
								aInstance.ongletSelectionne.idDiv,
								aInstance.composeBlocResponsable(
									aInstance.ongletSelectionne.indiceResponsable,
								),
								{ controleur: aInstance.controleur },
							);
						}
					},
				};
			},
			btnImpressionInscription: {
				event() {
					if (aInstance.donnees) {
						const lInstanceFenetre =
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_GenerationPdfSco_1.ObjetFenetre_GenerationPdfSco,
								{
									pere: aInstance,
									evenement(aNumeroBouton, aParametresAffichage, aOptionsPDF) {
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
								TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco
									.RecapDemandeInscription,
							inscription: aInstance.inscriptionCourante,
						});
					}
				},
				getDisabled() {
					return false;
				},
			},
			chipsDocJoint: {
				eventBtn: function (aIndice, aIndiceListe) {
					let lListe = aInstance.listeDocumentsFournis[aIndiceListe];
					let lListeDocuments = aInstance.listeDocuments;
					if (lListe) {
						let lElement = lListe.get(aIndice);
						let lElementEnSuppression =
							lListeDocuments.getElementParElement(lElement);
						if (!lElementEnSuppression) {
							lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							lListeDocuments.addElement(lElement);
						} else {
							if (lElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
								lElementEnSuppression.setEtat(
									Enumere_Etat_1.EGenreEtat.Suppression,
								);
							} else {
								let lIndice = lListeDocuments.getIndiceParElement(lElement);
								lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								lListeDocuments.remove(lIndice);
							}
						}
						aInstance._redessinnerDocumentsFournis();
					}
				},
			},
			selecFile: {
				getOptionsSelecFile() {
					aInstance._redessinnerDocumentsFournis();
					return {
						maxSize: aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
						),
						maxFiles: 1,
						multiple: false,
					};
				},
				addFiles(aIndice, aParams) {
					aInstance.addFiles(aIndice, aParams);
				},
				getDisabled(aIndice) {
					return !(
						aInstance.listeDocumentsFournis &&
						aInstance.listeDocumentsFournis[aIndice] &&
						aInstance.listeDocumentsFournis[aIndice].getNbrElementsExistes() ===
							0
					);
				},
			},
			responsables: {
				civilite: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								initAutoSelectionAvecUnElement: false,
								deroulerListeSeulementSiPlusieursElements: false,
								multiSelection: lChamp.multiSelection,
								avecElementObligatoire: true,
								longueur: 248,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							aCombo.setDonneesObjetSaisie({
								liste: aInstance.listes.listeCivilites,
								selection: lChamp.selection,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							!!aParametres.element
						) {
							const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
							if (!!lChamp && aInstance.responsableSelectionne) {
								aInstance.responsableSelectionne[lChamp.type] =
									aParametres.element;
								lChamp.selection = aParametres.indice;
							}
						}
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				nom: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.nom
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.responsableSelectionne.nom = aValeur;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.responsableSelectionne.nom,
						);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				nomNaissance: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.nomNaissance
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.responsableSelectionne.nomNaissance = aValeur;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				prenoms: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.prenoms
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.responsableSelectionne.prenoms = aValeur;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.responsableSelectionne.prenoms,
						);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				parente: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								initAutoSelectionAvecUnElement: false,
								deroulerListeSeulementSiPlusieursElements: false,
								multiSelection: lChamp.multiSelection,
								avecElementObligatoire: true,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							aCombo.setDonneesObjetSaisie({
								liste: aInstance.listes.listeLienParente,
								selection: lChamp.selection,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							!!aParametres.element
						) {
							const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
							if (!!lChamp && aInstance.responsableSelectionne) {
								aInstance.responsableSelectionne[lChamp.type] =
									aParametres.element;
								lChamp.selection = aParametres.indice;
							}
						}
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				hebergeEnfant: {
					getValue() {
						return !!aInstance.donnees && aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.hebergeEnfant
							: false;
					},
					setValue(aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.hebergeEnfant = aValue;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				responsableFinancier: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.responsableFinancier
							: false;
					},
					setValue(aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.responsableFinancier = aValue;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				percoitAides: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.percoitAides
							: false;
					},
					setValue(aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.percoitAides = aValue;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				adresse: {
					getValue(aNumeroChamp, aIndice) {
						return !!aInstance.donnees &&
							!!aInstance.responsableSelectionne &&
							aInstance.responsableSelectionne.adresse
							? aInstance.responsableSelectionne.adresse[aIndice]
							: "";
					},
					setValue(aNumeroChamp, aIndice, aValeur) {
						if (aInstance.responsableSelectionne.adresse === undefined) {
							aInstance.responsableSelectionne.adresse = [];
						}
						aInstance.responsableSelectionne.adresse[aIndice] = aValeur;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				codePostal: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.codePostal
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.responsableSelectionne.codePostal = aValeur;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.responsableSelectionne.codePostal,
						);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				ville: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (aInstance.listeCombo.responsables[lChamp.indiceResponsable]) {
								aInstance.listeCombo.responsables[
									lChamp.indiceResponsable
								].ville = aCombo;
							} else {
								aInstance.listeCombo.responsables[lChamp.indiceResponsable] = {
									ville: aCombo,
								};
							}
							if (
								!!aInstance.donnees &&
								!!aInstance.responsableSelectionne &&
								!!aInstance.responsableSelectionne.ville
							) {
								aCombo.setContenu(
									aInstance.responsableSelectionne.ville.getLibelle(),
								);
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				pays: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (aInstance.listeCombo.responsables[lChamp.indiceResponsable]) {
								aInstance.listeCombo.responsables[
									lChamp.indiceResponsable
								].pays = aCombo;
							} else {
								aInstance.listeCombo.responsables[lChamp.indiceResponsable] = {
									pays: aCombo,
								};
							}
							if (
								!!aInstance.donnees &&
								!!aInstance.responsableSelectionne &&
								!!aInstance.responsableSelectionne.pays
							) {
								aCombo.setContenu(
									aInstance.responsableSelectionne.pays.getLibelle(),
								);
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				numeroTelFixe: {
					getValue: function () {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.numeroTelFixe
							: "";
					},
					setValue: function (aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.numeroTelFixe = aValue;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.responsableSelectionne.numeroTelFixe,
						);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				indicatifTelFixe: {
					getValue: function () {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.indicatifTelFixe
							: "";
					},
					setValue: function (aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.indicatifTelFixe = aValue;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				numeroTelMobile: {
					getValue: function () {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.numeroTelMobile
							: "";
					},
					setValue: function (aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.numeroTelMobile = aValue;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.responsableSelectionne.numeroTelMobile,
						);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				indicatifTelMobile: {
					getValue: function () {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.indicatifTelMobile
							: "";
					},
					setValue: function (aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.indicatifTelMobile = aValue;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				email: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.email
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.responsableSelectionne.email = aValeur;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				responsabilite: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								initAutoSelectionAvecUnElement: false,
								deroulerListeSeulementSiPlusieursElements: false,
								multiSelection: false,
								avecElementObligatoire: true,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							aCombo.setDonneesObjetSaisie({
								liste: aInstance.listes.listeResponsabilites,
								selection: lChamp.selection,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element
						) {
							const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
							if (
								!!lChamp &&
								aInstance.donnees &&
								aInstance.responsableSelectionne
							) {
								aInstance.responsableSelectionne.niveauResponsabilite =
									aParametres.element;
								lChamp.selection = aParametres.indice;
								aInstance._validerChamp(
									aNumeroChamp,
									!!aInstance.responsableSelectionne.niveauResponsabilite,
								);
							}
						}
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				situation: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								initAutoSelectionAvecUnElement: false,
								deroulerListeSeulementSiPlusieursElements: false,
								multiSelection: false,
								avecElementObligatoire: true,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							aCombo.setDonneesObjetSaisie({
								liste: aInstance.listes.listeSituations,
								selection: lChamp.selection,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element
						) {
							const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
							if (
								!!lChamp &&
								aInstance.donnees &&
								aInstance.responsableSelectionne
							) {
								aInstance.responsableSelectionne.situation =
									aParametres.element;
								lChamp.selection = aParametres.indice;
							}
						}
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				profession: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (
								!!aInstance.donnees &&
								!!aInstance.responsableSelectionne &&
								!!aInstance.responsableSelectionne.profession
							) {
								aCombo.setContenu(
									aInstance.responsableSelectionne.profession.getLibelle(),
								);
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				numeroTelBureau: {
					getValue: function () {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.numeroTelBureau
							: "";
					},
					setValue: function (aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.numeroTelBureau = aValue;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.responsableSelectionne.numeroTelBureau,
						);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				indicatifTelBureau: {
					getValue: function () {
						return !!aInstance.donnees && !!aInstance.responsableSelectionne
							? aInstance.responsableSelectionne.indicatifTelBureau
							: "";
					},
					setValue: function (aNumeroChamp, aValue) {
						aInstance.responsableSelectionne.indicatifTelBureau = aValue;
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
			},
			identite: {
				civilite: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								initAutoSelectionAvecUnElement: false,
								deroulerListeSeulementSiPlusieursElements: false,
								multiSelection: lChamp.multiSelection,
								avecElementObligatoire: true,
								longueur: 248,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							aCombo.setDonneesObjetSaisie({
								liste: aInstance.listes.listeCivilites,
								selection: lChamp.selection,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							!!aParametres.element
						) {
							const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
							if (!!lChamp) {
								aInstance.donnees.identite.civilite = aParametres.element;
								lChamp.selection = aParametres.indice;
							}
						}
					},
				},
				nomEnfantPostulant: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.donnees.identite
							? aInstance.donnees.identite.nomEnfantPostulant
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.donnees.identite.nomEnfantPostulant = aValeur;
					},
					exitChange(aNumeroChamp) {
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.donnees.identite.nomEnfantPostulant,
						);
					},
				},
				prenomEnfantPostulant: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.donnees.identite
							? aInstance.donnees.identite.prenomEnfantPostulant
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.donnees.identite.prenomEnfantPostulant = aValeur;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.donnees.identite.prenomEnfantPostulant,
						);
					},
					exitChange(aNumeroChamp) {
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.donnees.identite.prenomEnfantPostulant,
						);
					},
				},
				dateNaissance: function (aNumeroChamp) {
					return {
						class: ObjetCelluleDate_1.ObjetCelluleDate,
						pere: aInstance,
						start: function (aInstanceDate) {
							aInstanceDate.setOptions({
								premiereDate: null,
								derniereDate: null,
								formatDate: "%JJ/%MM/%AAAA",
							});
							const lDateNaissance =
								aInstance.donnees.identite &&
								aInstance.donnees.identite.dateNaissance
									? aInstance.donnees.identite.dateNaissance
									: null;
							aInstanceDate.setDonnees(lDateNaissance);
						},
						evenement: function (aDate) {
							aInstance.donnees.identite.dateNaissance = aDate;
							aInstance._validerChamp(aNumeroChamp, !!aDate);
						},
					};
				},
				sexeEnfant: {
					getValue(aNumeroChamp, aValeurRadio) {
						if (!!aInstance.donnees && !!aInstance.donnees.identite) {
							return aInstance.donnees.identite.sexeEnfant === aValeurRadio;
						}
						return false;
					},
					setValue(aNumeroChamp, aValeurRadio) {
						aInstance.donnees.identite.sexeEnfant = aValeurRadio;
						aInstance._validerChamp(
							aNumeroChamp,
							aInstance.donnees.identite.sexeEnfant !== undefined,
						);
					},
				},
				villeNaissance: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (
								!!aInstance.donnees &&
								!!aInstance.donnees.identite &&
								!!aInstance.donnees.identite.villeNaissance
							) {
								aCombo.setContenu(
									aInstance.donnees.identite.villeNaissance.getLibelle(),
								);
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
				},
				paysNaissance: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (
								!!aInstance.donnees &&
								!!aInstance.donnees.identite &&
								!!aInstance.donnees.identite.paysNaissance
							) {
								aCombo.setContenu(
									aInstance.donnees.identite.paysNaissance.getLibelle(),
								);
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
				},
				ville: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance.listeCombo.identite.ville = aCombo;
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (
								!!aInstance.donnees &&
								!!aInstance.donnees.identite &&
								!!aInstance.donnees.identite.ville
							) {
								aCombo.setContenu(
									aInstance.donnees.identite.ville.getLibelle(),
								);
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
				},
				pays: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance.listeCombo.identite.pays = aCombo;
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (
								!!aInstance.donnees &&
								!!aInstance.donnees.identite &&
								!!aInstance.donnees.identite.pays
							) {
								aCombo.setContenu(aInstance.donnees.identite.pays.getLibelle());
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
				},
				codePostal: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.donnees.identite
							? aInstance.donnees.identite.codePostal
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.donnees.identite.codePostal = aValeur;
						aInstance._validerChamp(
							aNumeroChamp,
							!!aInstance.donnees.identite.codePostal,
						);
					},
					getDisabled(aNumeroChamp) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						return !lChamp || lChamp.disabled;
					},
				},
				adresse: {
					getValue(aNumeroChamp, aIndice) {
						return !!aInstance.donnees &&
							!!aInstance.donnees.identite &&
							aInstance.donnees.identite.adresse
							? aInstance.donnees.identite.adresse[aIndice]
							: "";
					},
					setValue(aNumeroChamp, aIndice, aValeur) {
						aInstance.donnees.identite.adresse[aIndice] = aValeur;
					},
				},
			},
			scolariteActuelle: {
				etablissementActuel: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance._initialiserRecherche(aCombo, lChamp);
							if (
								!!aInstance.donnees &&
								!!aInstance.donnees.scolariteActuelle &&
								!!aInstance.donnees.scolariteActuelle.etablissementActuel
							) {
								aCombo.setContenu(
									aInstance.donnees.scolariteActuelle.etablissementActuel.getLibelle(),
								);
							}
						}
					},
					event(aNumeroChamp, aParametres, aCombo) {
						aInstance._evenementRecherche(aParametres, aCombo, aNumeroChamp);
					},
				},
				ine: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.donnees.scolariteActuelle
							? aInstance.donnees.scolariteActuelle.ine
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.donnees.scolariteActuelle.ine = aValeur;
					},
				},
				classeActuelle: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.donnees.scolariteActuelle
							? aInstance.donnees.scolariteActuelle.classeActuelle
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.donnees.scolariteActuelle.classeActuelle = aValeur;
					},
				},
				projetsAccompagnement: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								initAutoSelectionAvecUnElement: false,
								deroulerListeSeulementSiPlusieursElements: false,
								multiSelection: lChamp.multiSelection,
								avecElementObligatoire: true,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							aCombo.setDonneesObjetSaisie({
								liste: aInstance.listes.listeProjetsAccompagnement,
								selection: lChamp.selection,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							!!aParametres.element
						) {
							const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
							if (
								!!lChamp &&
								aInstance.donnees &&
								aInstance.donnees[lChamp.groupe]
							) {
								aInstance.donnees[lChamp.groupe][lChamp.type] =
									aParametres.element;
								lChamp.selection = aParametres.indice;
							}
						}
					},
					getDisabled() {
						return false;
					},
				},
				commentairePA: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.donnees.scolariteActuelle
							? aInstance.donnees.scolariteActuelle.commentairePA
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.donnees.scolariteActuelle.commentairePA = aValeur;
					},
				},
				formation: {
					init(aNumeroChamp, aInstanceCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstanceCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								estLargeurAuto: false,
								longueur: 248,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							let lIndiceOrientation = -1;
							const lNumero = aInstance.donnees.scolariteActuelle.formation
								? aInstance.donnees.scolariteActuelle.formation.getNumero()
								: undefined;
							if (!!aInstance.listeOrientations) {
								aInstance.listeOrientations.parcourir((aElt, aIndice) => {
									aElt.options.parcourir((aOption) => {
										aOption.estSelectionnable = true;
									});
									if (!!lNumero && aElt.egalParNumeroEtGenre(lNumero)) {
										lIndiceOrientation = aIndice;
									}
								});
								aInstance._majListeOrientations(aInstance.listeOrientations);
							}
							aInstanceCombo.setDonneesObjetSaisie({
								liste: aInstance.listeOrientations,
								selection: lIndiceOrientation,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection
						) {
							if (aInstance.donnees && aInstance.donnees.scolariteActuelle) {
								if (
									aInstance.donnees.scolariteActuelle &&
									(!aInstance.donnees.scolariteActuelle.formation ||
										aInstance.donnees.scolariteActuelle.formation.getNumero() !==
											aParametres.element.getNumero())
								) {
									aInstance.donnees.scolariteActuelle.optionsChoisies = {
										obligatoires: new ObjetListeElements_1.ObjetListeElements(),
										facultatives: new ObjetListeElements_1.ObjetListeElements(),
										lv1: new ObjetListeElements_1.ObjetListeElements(),
										lv2: new ObjetListeElements_1.ObjetListeElements(),
									};
									aInstance.donnees.scolariteActuelle.formation =
										aParametres.element;
								}
							}
							if (
								aParametres.combo.Selection ===
								aInstance.listeOrientations.getIndiceParElement(
									aParametres.element,
								)
							) {
								if (aInstance.donnees && aInstance.donnees.scolariteActuelle) {
									aInstance.donnees.scolariteActuelle.formation =
										aParametres.element;
								}
							}
							aInstance._validerChamp(
								aNumeroChamp,
								!!aInstance.donnees.scolariteActuelle.formation,
							);
						}
					},
				},
				options: {
					event(aNumeroChamp) {
						aInstance._afficherFenetreOptions(aNumeroChamp);
					},
					getLibelle(aNumeroChamp) {
						const lHtml = [];
						const lChamp =
							aInstance.optionsFormation.getElementParNumero(aNumeroChamp);
						if (
							aInstance.donnees.scolariteActuelle &&
							aInstance.donnees.scolariteActuelle.optionsChoisies
						) {
							const lListe = aInstance._getOptionsSelonGenre(lChamp.getGenre());
							if (lListe && lListe.count()) {
								if (
									lChamp.getGenre() ===
									ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
										.option
								) {
									lListe.parcourir((aOption) => {
										lHtml.push(
											(0, tag_1.tag)(
												"ie-chips",
												{
													class: "m-left",
													"ie-model": tag_1.tag.funcAttr(
														"scolariteActuelle.chipsOptions",
														[lChamp.getGenre(), aOption.getNumero()],
													),
												},
												aOption.getLibelle(),
											),
										);
									});
								} else {
									lListe.parcourir((aOption) => {
										lHtml.push(
											IE.jsx.str(
												"ie-chips",
												{ class: "m-left" },
												aOption.getLibelle(),
											),
										);
									});
								}
							}
						}
						return lHtml.join("");
					},
					getHtml(aNumeroChamp) {
						let lLibelle = "";
						if (
							aInstance.donnees &&
							aInstance.donnees.scolariteActuelle &&
							aInstance.donnees.scolariteActuelle.formation
						) {
							const lChamp =
								aInstance.optionsFormation.getElementParNumero(aNumeroChamp);
							if (lChamp) {
								switch (lChamp.getGenre()) {
									case ObjetRequetePageOrientations_1.NSOrientation
										.EGenreRessource.lv1:
										lLibelle = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionLV1")}* <span class="color-red-moyen">${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.attendues", [1])}</span>`;
										break;
									case ObjetRequetePageOrientations_1.NSOrientation
										.EGenreRessource.lv2:
										lLibelle = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionLV2")}* <span class="color-red-moyen">${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.attendues", [1])}</span>`;
										break;
									case ObjetRequetePageOrientations_1.NSOrientation
										.EGenreRessource.specialite:
										lLibelle = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionObligatoire")}* <span class="color-red-moyen">${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.attendues", [aInstance.donnees.scolariteActuelle.formation.nbObligatoires])}</span>`;
										break;
									case ObjetRequetePageOrientations_1.NSOrientation
										.EGenreRessource.option:
										lLibelle = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionFacultative")} <span class="color-red-moyen">${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.maximum", [aInstance.donnees.scolariteActuelle.formation.nbFacultatives])}</span>`;
										break;
									default:
										break;
								}
							}
						}
						return lLibelle;
					},
					visible: function (aNumeroChamp) {
						return (
							aInstance.optionsFormation.count() &&
							aInstance._getOptionVisible(aNumeroChamp)
						);
					},
				},
				chipsOptions: {
					eventBtn: function (aGenreOption, aNumeroOption) {
						if (
							aInstance.donnees.scolariteActuelle &&
							aInstance.donnees.scolariteActuelle.optionsChoisies
						) {
							const lListe = aInstance._getOptionsSelonGenre(aGenreOption);
							if (lListe) {
								lListe.removeFilter((aElement) => {
									return aElement.getNumero() === aNumeroOption;
								});
							}
						}
						return false;
					},
				},
				redoublant: {
					getValue(aNumeroChamp, aValeurRadio) {
						if (!!aInstance.donnees && !!aInstance.donnees.scolariteActuelle) {
							return (
								aInstance.donnees.scolariteActuelle.redoublant === aValeurRadio
							);
						}
						return false;
					},
					setValue(aNumeroChamp, aValeurRadio) {
						aInstance.donnees.scolariteActuelle.redoublant = aValeurRadio;
						aInstance._validerChamp(
							aNumeroChamp,
							aInstance.donnees.scolariteActuelle.redoublant !== undefined,
						);
					},
				},
				regime: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aCombo.setOptionsObjetSaisie({
								mode: Enumere_Saisie_1.EGenreSaisie.Combo,
								initAutoSelectionAvecUnElement: false,
								deroulerListeSeulementSiPlusieursElements: false,
								multiSelection: false,
								avecElementObligatoire: true,
								libelleHaut:
									lChamp.getLibelle() + (lChamp.optionnel ? "" : "*"),
								required: !lChamp.optionnel,
							});
							aCombo.setDonneesObjetSaisie({
								liste: aInstance.listes.listeRegimes,
								selection: lChamp.selection,
							});
						}
					},
					event(aNumeroChamp, aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element
						) {
							const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
							if (
								!!lChamp &&
								aInstance.donnees &&
								aInstance.donnees.scolariteActuelle
							) {
								aInstance.donnees.scolariteActuelle.regime =
									aParametres.element;
								lChamp.selection = aParametres.indice;
							}
						}
					},
					getDisabled() {
						return false;
					},
				},
				boursier: {
					getValue(aNumeroChamp, aValeurRadio) {
						if (!!aInstance.donnees && !!aInstance.donnees.scolariteActuelle) {
							return (
								aInstance.donnees.scolariteActuelle.boursier === aValeurRadio
							);
						}
						return false;
					},
					setValue(aNumeroChamp, aValeurRadio) {
						aInstance.donnees.scolariteActuelle.boursier = aValeurRadio;
						aInstance._validerChamp(
							aNumeroChamp,
							aInstance.donnees.scolariteActuelle.boursier !== undefined,
						);
					},
				},
				commentaire: {
					getValue() {
						return !!aInstance.donnees && !!aInstance.donnees.scolariteActuelle
							? aInstance.donnees.scolariteActuelle.commentaire
							: "";
					},
					setValue(aNumeroChamp, aValeur) {
						aInstance.donnees.scolariteActuelle.commentaire = aValeur;
					},
				},
			},
			btnPrecedent: {
				event() {
					aInstance.callback.appel(
						ObjetInscriptionsEtablissement.GenreEvenement.precedent,
					);
				},
				getDisabled: function () {
					return aInstance.etape.getNumero() === 0;
				},
			},
			btnCopierAdresse: {
				event(aGroupeDonnee, aIndiceResponsable) {
					switch (aGroupeDonnee) {
						case Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables: {
							const lResponsable = aInstance.getResponsable(0);
							if (aIndiceResponsable === 0) {
								lResponsable.adresse = [...aInstance.donnees.identite.adresse];
								lResponsable.codePostal = aInstance.donnees.identite.codePostal;
								lResponsable.ville = MethodesObjet_1.MethodesObjet.dupliquer(
									aInstance.donnees.identite.ville,
									true,
								);
								lResponsable.pays = MethodesObjet_1.MethodesObjet.dupliquer(
									aInstance.donnees.identite.pays,
									true,
								);
								if (
									aInstance.listeCombo &&
									aInstance.listeCombo.responsables &&
									aInstance.listeCombo.responsables[aIndiceResponsable]
								) {
									if (lResponsable.ville) {
										aInstance.listeCombo.responsables[
											aIndiceResponsable
										].ville.setContenu(
											aInstance.donnees.identite.ville.getLibelle(),
										);
									}
									if (lResponsable.pays) {
										aInstance.listeCombo.responsables[
											aIndiceResponsable
										].pays.setContenu(
											aInstance.donnees.identite.pays.getLibelle(),
										);
									}
								}
							} else {
								const lResponsableSupp =
									aInstance.getResponsable(aIndiceResponsable);
								if (lResponsable && lResponsableSupp) {
									lResponsableSupp.adresse = [...lResponsable.adresse];
									lResponsableSupp.codePostal = lResponsable.codePostal;
									lResponsableSupp.ville =
										MethodesObjet_1.MethodesObjet.dupliquer(
											lResponsable.ville,
											true,
										);
									lResponsableSupp.pays =
										MethodesObjet_1.MethodesObjet.dupliquer(
											lResponsable.pays,
											true,
										);
								}
								if (
									aInstance.listeCombo &&
									aInstance.listeCombo.responsables &&
									aInstance.listeCombo.responsables[aIndiceResponsable]
								) {
									if (lResponsableSupp.ville) {
										aInstance.listeCombo.responsables[
											aIndiceResponsable
										].ville.setContenu(lResponsableSupp.ville.getLibelle());
									}
									if (lResponsableSupp.pays) {
										aInstance.listeCombo.responsables[
											aIndiceResponsable
										].pays.setContenu(lResponsableSupp.pays.getLibelle());
									}
								}
							}
							break;
						}
						case Enumere_Inscriptions_1.EGroupeDonneeInscription.identite: {
							if (aInstance.donnees.responsables) {
								const lResponsable = aInstance.getResponsable(0);
								if (lResponsable) {
									aInstance.donnees.identite.adresse = [
										...lResponsable.adresse,
									];
									aInstance.donnees.identite.codePostal =
										lResponsable.codePostal;
									aInstance.donnees.identite.ville =
										MethodesObjet_1.MethodesObjet.dupliquer(
											lResponsable.ville,
											true,
										);
									aInstance.donnees.identite.pays =
										MethodesObjet_1.MethodesObjet.dupliquer(
											lResponsable.pays,
											true,
										);
									if (aInstance.listeCombo && aInstance.listeCombo.identite) {
										aInstance.listeCombo.identite.ville.setContenu(
											aInstance.donnees.identite.ville.getLibelle(),
										);
										aInstance.listeCombo.identite.pays.setContenu(
											aInstance.donnees.identite.pays.getLibelle(),
										);
									}
								}
							}
							break;
						}
						default:
							break;
					}
				},
				getDisplay(aGroupeDonnee, aIndice) {
					switch (aGroupeDonnee) {
						case Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables:
							return (
								GEtatUtilisateur.GenreEspace ===
									Enumere_Espace_1.EGenreEspace.Inscription || aIndice > 0
							);
						case Enumere_Inscriptions_1.EGroupeDonneeInscription.identite:
							return (
								GEtatUtilisateur.GenreEspace ===
								Enumere_Espace_1.EGenreEspace.Parent
							);
						default:
							return false;
					}
				},
			},
			btnSuivant: {
				event() {
					if (aInstance.verifierChamps()) {
						aInstance.callback.appel(
							ObjetInscriptionsEtablissement.GenreEvenement.suivant,
						);
					}
				},
				getDisabled: function () {
					return (
						aInstance.etape.getNumero() === aInstance.listeEtapes.count() - 1
					);
				},
			},
			btnAnnuler: {
				event() {
					aInstance.surAnnuler();
				},
			},
			btnValider: {
				event() {
					aInstance.surValider();
				},
				getDisabled() {
					let lDisabledBouton =
						!aInstance.donnees ||
						!aInstance.donnees.scolariteActuelle ||
						!aInstance.verifierChamps(false);
					return lDisabledBouton;
				},
			},
			btnSupprimer: {
				event() {
					aInstance.surSupprimer();
				},
			},
			btnModifier: {
				event() {
					aInstance.callback.appel(
						ObjetInscriptionsEtablissement.GenreEvenement.modifier,
					);
				},
				getDisabled() {
					const lBoutonActif =
						aInstance.donnees &&
						aInstance.donnees.resumeInscription &&
						aInstance.donnees.resumeInscription.estModifiable;
					return !lBoutonActif;
				},
			},
		};
	}
	getResponsable(aIndice) {
		let lResult;
		if (
			!!this.donnees &&
			!!this.donnees.responsables &&
			ObjetListeElements_1.ObjetListeElements.prototype.isPrototypeOf(
				this.donnees.responsables,
			)
		) {
			if (this.donnees.responsables.count() > 0) {
				lResult = this.donnees.responsables.get(aIndice);
				if (lResult === undefined) {
					this.donnees.responsables.addElement(
						new ObjetElement_1.ObjetElement(),
						aIndice,
					);
					lResult = this.donnees.responsables.get(aIndice);
				}
			}
		}
		return lResult;
	}
	vider() {
		this.listeDocumentsFournis = [];
		this.listeDocuments = new ObjetListeElements_1.ObjetListeElements();
		this.donnees = undefined;
		this.sauvegardeRecherches = undefined;
		this.session = undefined;
		this.listeOrientations = new ObjetListeElements_1.ObjetListeElements();
		this.DonneesRecues = false;
		this.estResume = undefined;
		this.estEnCreation = undefined;
		this.afficher();
	}
	setDonnees(aParams) {
		this.listeDocumentsFournis = [];
		this.listeDocuments = new ObjetListeElements_1.ObjetListeElements();
		this.donnees = aParams.donnees;
		this.sauvegardeRecherches = MethodesObjet_1.MethodesObjet.dupliquer(
			this.donnees,
		);
		this.inscriptionCourante = aParams.inscriptionCourante;
		this.session = aParams.session;
		this.listeOrientations = new ObjetListeElements_1.ObjetListeElements();
		if (this.session && this.session.orientations) {
			this.listeOrientations = this.session.orientations;
			this.listeOrientations.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
			this.listeOrientations.trier();
		}
		this.DonneesRecues = true;
		this.estResume = aParams.estResume;
		this.estEnCreation = !aParams.estResume;
		this.listeEtapes = aParams.listeEtapes;
		if (this.listeEtapes) {
			this.etape = this.listeEtapes.get(0);
		}
		this.afficher();
	}
	ajouterInput(aObjetChamp) {
		const lHtml = [];
		const lParams = [aObjetChamp.getNumero()];
		const lAttr = {
			id: aObjetChamp.id,
			type: "text",
			"ie-model": tag_1.tag.funcAttr(
				`${aObjetChamp.groupe}.${aObjetChamp.type}`,
				lParams,
			),
			autocomplete: aObjetChamp.autocomplete,
		};
		if (aObjetChamp.placeHolder) {
			lAttr["placeHolder"] = aObjetChamp.placeHolder;
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		lAttr["aria-label"] = aObjetChamp.getLibelle();
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				IE.jsx.str(
					"label",
					{ for: aObjetChamp.id, class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				IE.jsx.str("input", Object.assign({}, lAttr)),
				aObjetChamp.optionnel
					? ""
					: IE.jsx.str(
							"span",
							{ id: aObjetChamp.id + "_error", class: "errormessage" },
							UtilitaireInscriptions_1.UtilitaireInscriptions.getMessageErreur(
								aObjetChamp.modeValidation,
							),
						),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputLectureSeule(aLabel, aValue) {
		const lJsxInputReadOnly = (aValue) => {
			return {
				getValue: () => {
					return aValue || "";
				},
				getDisabled: () => {
					return true;
				},
			};
		};
		const lHtml = [];
		const lId = GUID_1.GUID.getId();
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain label-up p-bottom-l" },
				IE.jsx.str(
					"label",
					{ for: lId, class: "fix-bloc ie-titre-petit" },
					aLabel,
				),
				IE.jsx.str("input", {
					type: "text",
					id: lId,
					"ie-model": lJsxInputReadOnly.bind(this, aValue),
				}),
			),
		);
		return lHtml.join("");
	}
	ajouterCheckBox(aObjetChamp) {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain label-up p-bottom-l" },
				IE.jsx.str(
					"ie-checkbox",
					{
						id: aObjetChamp.id,
						class: "oie_checkbox",
						"ie-model": tag_1.tag.funcAttr(
							`${aObjetChamp.groupe}.${aObjetChamp.type}`,
							[aObjetChamp.getNumero()],
						),
					},
					aObjetChamp.getLibelle(),
				),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterTextarea(aObjetChamp) {
		const lHtml = [];
		const lAttr = {
			id: aObjetChamp.id,
			class: "ifc_textarea",
			"max-length": "10000",
			"ie-compteurmax": "10000",
			"ie-model": tag_1.tag.funcAttr(
				`${aObjetChamp.groupe}.${aObjetChamp.type}`,
				[aObjetChamp.getNumero()],
			),
		};
		if (aObjetChamp.placeHolder) {
			lAttr["placeHolder"] = aObjetChamp.placeHolder;
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
		}
		if (aObjetChamp.rows) {
			lAttr["rows"] = aObjetChamp.rows;
		}
		if (aObjetChamp.cols) {
			lAttr["cols"] = aObjetChamp.cols;
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		lAttr["aria-label"] = aObjetChamp.getLibelle();
		const lAttLabel = {
			for: aObjetChamp.id,
			class: ["fix-bloc ie-titre-petit"],
		};
		if (aObjetChamp.hideLabel) {
			lAttLabel.class.push("sr-only");
		}
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				IE.jsx.str(
					"label",
					Object.assign({}, lAttLabel),
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				IE.jsx.str("ie-textareamax", Object.assign({}, lAttr)),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputDateNaissance(aObjetChamp) {
		const lHtml = [];
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				(0, tag_1.tag)(
					"label",
					{ class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				(0, tag_1.tag)("div", { id: aObjetChamp.id, class: [] }),
				(0, tag_1.tag)("div", {
					"ie-identite": tag_1.tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}`,
						[aObjetChamp.getNumero()],
					),
				}),
				(0, tag_1.tag)(
					"span",
					{ id: aObjetChamp.id + "_error", class: "errormessage" },
					UtilitaireInscriptions_1.UtilitaireInscriptions.getMessageErreur(
						aObjetChamp.modeValidation,
					),
				),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputRadio(aObjetChamp) {
		const lHtml = [];
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				(0, tag_1.tag)(
					"label",
					{ class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				(0, tag_1.tag)(
					"div",
					{ id: aObjetChamp.id, class: ["flex-contain flex-gap"] },
					(aTab) => {
						aObjetChamp.elements.parcourir((aElement) => {
							const lAttr = {
								id: aElement.id,
								"ie-model": tag_1.tag.funcAttr(
									`${aObjetChamp.groupe}.${aObjetChamp.type}`,
									[aObjetChamp.getNumero(), aElement.valeurCoche],
								),
								class: ["as-chips"],
								name: aObjetChamp.type,
								value: aElement.valeurCoche,
								"ie-icon": "icon_check_fin",
							};
							if (!aObjetChamp.optionnel) {
								lAttr["aria-required"] = "true";
							}
							aTab.push(
								IE.jsx.str(
									"ie-radio",
									Object.assign({}, lAttr),
									aElement.value,
								),
							);
						});
					},
				),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterRecherche(aObjetChamp) {
		const lHtml = [];
		const lAttr = {
			"ie-model": tag_1.tag.funcAttr(
				`${aObjetChamp.groupe}.${aObjetChamp.type}`,
				[aObjetChamp.getNumero()],
			),
			name: aObjetChamp.autocomplete,
		};
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		lAttr["aria-label"] = aObjetChamp.getLibelle();
		lHtml.push(
			IE.jsx.str(
				"div",
				{ class: ["flex-contain p-bottom-l"], id: aObjetChamp.id },
				IE.jsx.str("ie-combo", Object.assign({}, lAttr)),
				IE.jsx.str(
					"span",
					{ id: aObjetChamp.id + "_error", class: "errormessage" },
					UtilitaireInscriptions_1.UtilitaireInscriptions.getMessageErreur(
						aObjetChamp.modeValidation,
					),
				),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterComboOptions(aObjetChamp) {
		const lHtml = [];
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{
					id: aObjetChamp.id,
					class: ["field-contain label-up p-bottom-l"],
					"ie-display": tag_1.tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}.visible`,
						[aObjetChamp.getNumero()],
					),
				},
				(0, tag_1.tag)("label", {
					class: "fix-bloc ie-titre-petit",
					"ie-html": tag_1.tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}.getHtml`,
						[aObjetChamp.getNumero()],
					),
				}),
				(0, tag_1.tag)("ie-btnselecteur", {
					class: ["chips-inside multilignes"],
					"aria-label": aObjetChamp.type + " " + aObjetChamp.listeElements,
					"ie-model": tag_1.tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}`,
						[aObjetChamp.getNumero()],
					),
					role: "button",
				}),
				(0, tag_1.tag)(
					"span",
					{ id: aObjetChamp.id + "_error", class: "errormessage" },
					UtilitaireInscriptions_1.UtilitaireInscriptions.getMessageErreur(
						aObjetChamp.modeValidation,
					),
				),
			),
		);
		this.optionsFormation.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputTelephone(aObjetChamp) {
		let lHtml = [];
		const lAttr = {
			id: aObjetChamp.id + "_tel",
			"ie-telephone": "true",
			"ie-model": tag_1.tag.funcAttr(
				`${aObjetChamp.groupe}.${aObjetChamp.type}`,
				[aObjetChamp.getNumero()],
			),
			autocomplete: "tel-local",
			placeHolder: aObjetChamp.placeHolder || "",
			title: aObjetChamp.getLibelle(),
		};
		if (aObjetChamp.placeHolder) {
			lAttr.placeHolder = aObjetChamp.placeHolder;
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{ class: ["field-contain label-up p-bottom-l"], id: aObjetChamp.id },
				(0, tag_1.tag)(
					"label",
					{ for: aObjetChamp.id, class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				(0, tag_1.tag)(
					"div",
					{ class: [] },
					(0, tag_1.tag)("input", {
						id: aObjetChamp.id + "Indicatif",
						class: "m-x",
						"ie-indicatiftel": "true",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"inscriptionsEtablissement.telephoneIndicatif",
						),
						size: "3",
						autocomplete: "tel-country-code",
						"ie-model": tag_1.tag.funcAttr(
							`${aObjetChamp.groupe}.${aObjetChamp.typeSup}`,
							[aObjetChamp.getNumero()],
						),
					}),
					(0, tag_1.tag)("input", lAttr),
				),
			),
		);
		if (!aObjetChamp.optionnel) {
			lHtml.push(
				IE.jsx.str(
					"span",
					{ id: aObjetChamp.id + "_error", class: "errormessage" },
					UtilitaireInscriptions_1.UtilitaireInscriptions.getMessageErreur(
						aObjetChamp.modeValidation,
					),
				),
			);
		}
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputAdresse(
		aGroupeDonnee,
		aIndiceResponsable = 0,
		aDisabled = false,
		aObligatoire = false,
	) {
		const lHtml = [];
		const lLibelleBtn =
			[Enumere_Inscriptions_1.EGroupeDonneeInscription.identite].includes(
				aGroupeDonnee,
			) || aIndiceResponsable > 0
				? "inscriptionsEtablissement.copierAdresseResponsable"
				: "inscriptionsEtablissement.copierAdresseEnfant";
		const lChampsAdresse = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 1; i <= 4; i++) {
			let lChamp = new ObjetChampInscription({
				libelle: "",
				groupe: aGroupeDonnee,
				type: Enumere_Inscriptions_1.ETypeDonneeInscription.adresse,
				suffixe: i.toString(),
				optionnel: !aObligatoire,
				modeValidation: Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
				size: 40,
				autocomplete: "address-line" + i,
				disabled: aDisabled,
			});
			lChampsAdresse.add(lChamp);
			this.champs.add(lChamp);
		}
		lHtml.push('<fieldset class="m-y-l flex-contain cols">');
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{ class: "flex-contain flex-center justify-between m-bottom-l" },
				(0, tag_1.tag)(
					"legend",
					ObjetTraduction_1.GTraductions.getValeur(
						"inscriptionsEtablissement.adresse",
					) + (aObligatoire ? "*" : ""),
				),
				(0, tag_1.tag)(
					"ie-bouton",
					{
						"ie-model": tag_1.tag.funcAttr("btnCopierAdresse", [
							aGroupeDonnee,
							aIndiceResponsable,
						]),
						class: [Type_ThemeBouton_1.TypeThemeBouton.neutre, "small-bt"],
						"ie-display": "btnCopierAdresse.getDisplay",
					},
					ObjetTraduction_1.GTraductions.getValeur(lLibelleBtn),
				),
			),
		);
		lHtml.push('<div class="flex-contain cols">');
		lChampsAdresse.parcourir((aChamp) => {
			const lAttr = {
				id: aChamp.id,
				class: ["m-bottom"],
				type: "text",
				"aria-required": "true",
				"aria-invalid": "false",
				"aria-errormessage": aChamp.id + "_error",
				"aria-label": ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.adresse" + aChamp.suffixe,
				),
				placeHolder: ObjetTraduction_1.GTraductions.getValeur(
					"inscriptionsEtablissement.adresse" + aChamp.suffixe,
				),
				"ie-model": tag_1.tag.funcAttr(
					`${aGroupeDonnee}.${Enumere_Inscriptions_1.ETypeDonneeInscription.adresse}`,
					[aChamp.getNumero(), aChamp.suffixe],
				),
				autocomplete: aChamp.autocomplete,
			};
			lHtml.push((0, tag_1.tag)("input", lAttr));
		});
		lHtml.push(
			IE.jsx.str(
				"span",
				{ id: lChampsAdresse.get(0).id + "_error", class: "errormessage" },
				UtilitaireInscriptions_1.UtilitaireInscriptions.getMessageErreur(
					Enumere_Inscriptions_1.EModeValidation.MV_Obligatoire,
				),
			),
		);
		lHtml.push("</div>");
		lHtml.push("</fieldset>");
		return lHtml.join("");
	}
	validerNombreOptions(aChamps, aListeRessources) {
		const lFormation = this.donnees.scolariteActuelle.formation;
		if (lFormation && aListeRessources) {
			switch (aChamps.getGenre()) {
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1:
					return lFormation.avecLV1 && aListeRessources.count() === 1;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2:
					return lFormation.avecLV2 && aListeRessources.count() === 1;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
					.specialite:
					return (
						lFormation.nbObligatoires &&
						aListeRessources.count() === lFormation.nbObligatoires
					);
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
					.option:
					return (
						lFormation.nbFacultatives &&
						aListeRessources.count() <= lFormation.nbFacultatives
					);
				default:
					return false;
			}
		}
		return false;
	}
	_validerChamp(aNumeroChamp, aEstValide) {
		const lChamps = this.champs.getElementParNumero(aNumeroChamp);
		if (!!lChamps) {
			lChamps.valide = aEstValide;
		}
	}
	saisieResponsableEnCours() {
		if (this.responsableSelectionne) {
			const lAdresse = this.responsableSelectionne.adresse
				? this.responsableSelectionne.adresse.join("")
				: "";
			return (
				!!this.responsableSelectionne.nom ||
				!!this.responsableSelectionne.prenoms ||
				lAdresse !== "" ||
				!!this.responsableSelectionne.codePostal ||
				(!!this.responsableSelectionne.ville &&
					this.responsableSelectionne.ville.getLibelle() !== "")
			);
		}
		return false;
	}
	_getOptionVisible(aNumeroChamp) {
		if (
			this.donnees &&
			this.donnees.scolariteActuelle &&
			this.donnees.scolariteActuelle.formation
		) {
			const lChamp = this.optionsFormation.getElementParNumero(aNumeroChamp);
			if (!!lChamp) {
				switch (lChamp.getGenre()) {
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1:
						return (
							this.donnees.scolariteActuelle.formation.avecLV1 &&
							this.listes &&
							this.listes.listeLV1 &&
							this.listes.listeLV1.count() > 0
						);
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2:
						return (
							this.donnees.scolariteActuelle.formation.avecLV2 &&
							this.listes &&
							this.listes.listeLV2 &&
							this.listes.listeLV2.count() > 0
						);
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
						.specialite:
						return (
							this.donnees.scolariteActuelle.formation.nbObligatoires > 0 &&
							this.donnees.scolariteActuelle.formation.obligatoires &&
							this.donnees.scolariteActuelle.formation.obligatoires.count() > 1
						);
					case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
						.option:
						return (
							this.donnees.scolariteActuelle.formation.nbFacultatives > 0 &&
							this.donnees.scolariteActuelle.formation.facultatives &&
							this.donnees.scolariteActuelle.formation.facultatives.count() > 1
						);
					default:
						return false;
				}
			}
		}
		return false;
	}
	_majListeOrientations(aListeOrientation) {
		aListeOrientation.parcourir((aOrientation) => {
			if (aOrientation.options) {
				aOrientation.options.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
				aOrientation.options.trier();
				aOrientation.obligatoires =
					new ObjetListeElements_1.ObjetListeElements();
				aOrientation.facultatives =
					new ObjetListeElements_1.ObjetListeElements();
				aOrientation.options.parcourir((aElement) => {
					if (aElement.estSelectionnable) {
						if (aElement.estSpecialite) {
							if (aElement.estObligatoire) {
								aOrientation.spes.addElement(aElement);
							}
						} else {
							if (aElement.estObligatoire) {
								aOrientation.obligatoires.addElement(aElement);
							}
							if (aElement.estFacultative) {
								aOrientation.facultatives.addElement(aElement);
							}
						}
					}
				});
			}
		});
	}
	_initialiserRecherche(aCombo, aObjetChamp) {
		aCombo.setOptionsObjetSaisie({
			mode: Enumere_Saisie_1.EGenreSaisie.SaisieRecherche,
			avecOuvertureDeroulantPopup: false,
			longueur: 250,
			surEditionRecherche: (aValeurRecherche, aCallback) => {
				this._surEditionRechercheListe(
					aObjetChamp,
					aValeurRecherche,
					aCallback,
				);
			},
			nbCarMinRecherche: 3,
			rechercheTout: ["", "*"],
			libelleHaut:
				aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
			required: !aObjetChamp.optionnel,
			avecEventSurFermetureListe: true,
			getEstElementNonSelectionnable: function (aElement) {
				return !aElement.existeNumero();
			},
		});
	}
	_evenementRecherche(aParametres, aCombo, aNumeroChamp) {
		const lChamp = this.champs.getElementParNumero(aNumeroChamp);
		if (!!lChamp) {
			const lFamille = lChamp.groupe;
			const lType = lChamp.type;
			let lDonnee = this.donnees[lFamille];
			if (
				!!lDonnee &&
				lFamille ===
					Enumere_Inscriptions_1.EGroupeDonneeInscription.responsables
			) {
				lDonnee = this.getResponsable(lChamp.indiceResponsable);
			}
			if (
				aParametres.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.deploiement
			) {
				aCombo.avecSelectionUtilisateur = false;
			}
			if (
				aParametres.genreEvenement ===
					Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
				aParametres.element &&
				aCombo.estUneInteractionUtilisateur()
			) {
				if (!!lDonnee) {
					lDonnee[lType] = aParametres.element;
					aCombo.avecSelectionUtilisateur = true;
				}
			}
			if (
				aParametres.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.fermeture
			) {
				if (
					aCombo.getListeElements().count() === 1 &&
					aCombo.getListeElements().get(0).existeNumero() &&
					!lChamp.avecSaisieAlt
				) {
					if (!!lDonnee) {
						lDonnee[lType] = aCombo.getListeElements().get(0);
						aCombo.setContenu(lDonnee[lType].getLibelle());
					}
				} else {
					if (
						!!lChamp &&
						aParametres.element === null &&
						!aCombo.avecSelectionUtilisateur &&
						!!lChamp.avecSaisieAlt
					) {
						const lSauvegarde = this._getDonneesSauvegardeRecherche(
							lFamille,
							lChamp.indiceResponsable,
						);
						const lInfo = !!lSauvegarde ? lSauvegarde[lType] : "";
						this.saisieAlternative(lChamp, lInfo);
					}
				}
			}
		}
	}
	_redessinnerDocumentsFournis() {
		let lListe = this.listeDocumentsFournis;
		for (let i = 0; i < lListe.length; i++) {
			let lIdent = this.idListeDocuments + i;
			ObjetHtml_1.GHtml.setHtml(
				lIdent,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.listeDocumentsFournis[i],
					{
						separateur: " ",
						IEModelChips: "chipsDocJoint",
						genreRessource:
							TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
								.DocJointInscription,
						argsIEModelChips: [i.toString()],
						maxWidth: 300,
					},
				),
				{ controleur: this.controleur },
			);
		}
	}
	_validerAdresse() {
		if (
			[Enumere_Inscriptions_1.EEtape.responsables].includes(
				this.etape.getGenre(),
			)
		) {
			const lListeChampAdresse = this.champs.getListeElements((aChamp) => {
				return [
					Enumere_Inscriptions_1.ETypeDonneeInscription.adresse,
					Enumere_Inscriptions_1.ETypeDonneeInscription.ville,
					Enumere_Inscriptions_1.ETypeDonneeInscription.codePostal,
					Enumere_Inscriptions_1.ETypeDonneeInscription.pays,
				].includes(aChamp.type);
			});
			const lDonnees =
				this.etape.getGenre() === Enumere_Inscriptions_1.EEtape.identite
					? this.donnees.identite
					: this.responsableSelectionne;
			if (lListeChampAdresse.count() && lDonnees && lDonnees.adresse) {
				const lAdresse = lDonnees.adresse.join("");
				lListeChampAdresse.parcourir((aChamp) => {
					let lValide;
					switch (aChamp.type) {
						case Enumere_Inscriptions_1.ETypeDonneeInscription.adresse:
							lValide = lAdresse !== "";
							break;
						case Enumere_Inscriptions_1.ETypeDonneeInscription.codePostal:
							lValide = lDonnees.codePostal && lDonnees.codePostal !== "";
							break;
						case Enumere_Inscriptions_1.ETypeDonneeInscription.ville:
							lValide = lDonnees.ville && lDonnees.ville.getLibelle() !== "";
							break;
						case Enumere_Inscriptions_1.ETypeDonneeInscription.pays:
							lValide = true;
							break;
						default:
							break;
					}
					aChamp.valide = lValide;
				});
			}
		}
	}
	_validerOptionsFormation() {
		if (
			[Enumere_Inscriptions_1.EEtape.scolarite].includes(this.etape.getGenre())
		) {
			if (
				this.optionsFormation.count() &&
				this.donnees.scolariteActuelle &&
				this.donnees.scolariteActuelle.optionsChoisies
			) {
				this.optionsFormation.parcourir((aChamp) => {
					if (aChamp.optionnel) {
						return;
					}
					let lValide = false;
					if (this._getOptionVisible(aChamp.getNumero())) {
						const lOptionChoisies = this._getOptionsSelonGenre(
							aChamp.getGenre(),
						);
						lValide = lOptionChoisies && !!lOptionChoisies.count();
					} else {
						lValide = true;
					}
					aChamp.valide = lValide;
				});
			}
		}
	}
	_getOptionsSelonGenre(aGenre) {
		let lOptions = null;
		if (this.donnees.scolariteActuelle.optionsChoisies) {
			switch (aGenre) {
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1:
					lOptions = this.donnees.scolariteActuelle.optionsChoisies.lv1;
					break;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2:
					lOptions = this.donnees.scolariteActuelle.optionsChoisies.lv2;
					break;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
					.specialite:
					lOptions =
						this.donnees.scolariteActuelle.optionsChoisies.obligatoires;
					break;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
					.option:
					lOptions =
						this.donnees.scolariteActuelle.optionsChoisies.facultatives;
					break;
			}
		}
		return lOptions;
	}
	_afficherFenetreOptions(aNumeroChamp) {
		const lChamp = this.optionsFormation.getElementParNumero(aNumeroChamp);
		if (this._getOptionVisible(aNumeroChamp)) {
			let lListeRessources = new ObjetListeElements_1.ObjetListeElements();
			let lNbChoix = 0;
			let lTitre = "";
			switch (lChamp.getGenre()) {
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv1:
					lListeRessources = this.listes.listeLV1;
					lNbChoix = 1;
					lTitre = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionLV1")}* <span>${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.attendues", [lNbChoix])}</span>`;
					break;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource.lv2:
					lListeRessources = this.listes.listeLV2;
					lNbChoix = 1;
					lTitre = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionLV2")}* <span>${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.attendues", [lNbChoix])}</span>`;
					break;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
					.specialite:
					lListeRessources =
						this.donnees.scolariteActuelle.formation.obligatoires;
					lNbChoix = this.donnees.scolariteActuelle.formation.nbObligatoires;
					lTitre = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionObligatoire")}* <span>${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.attendues", [lNbChoix])}</span>`;
					break;
				case ObjetRequetePageOrientations_1.NSOrientation.EGenreRessource
					.option:
					lListeRessources =
						this.donnees.scolariteActuelle.formation.facultatives;
					lNbChoix = this.donnees.scolariteActuelle.formation.nbFacultatives;
					lTitre = `${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.optionFacultative")} <span>${ObjetTraduction_1.GTraductions.getValeur("inscriptionsEtablissement.maximum", [lNbChoix])}</span>`;
					break;
			}
			let lListe;
			if (
				this.donnees &&
				this.donnees.scolariteActuelle &&
				this.donnees.scolariteActuelle.optionsChoisies
			) {
				lListe = this._getOptionsSelonGenre(lChamp.getGenre());
			} else {
				return;
			}
			const lListeSelection = lListe.getTableauNumeros();
			lListeRessources.parcourir((aRessource) => {
				aRessource.selectionne = lListeSelection.includes(
					aRessource.getNumero(),
				);
			});
			const lFenetreListeRessources =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_Liste_1.ObjetFenetre_Liste,
					{
						pere: this,
						evenement(aGenreBouton) {
							if (aGenreBouton !== 1) {
								lFenetreListeRessources.fermer();
								return;
							}
							if (lListeRessources) {
								const lListeSelection = lListeRessources.getListeElements(
									(aRessource) => {
										return aRessource.selectionne;
									},
								);
								if (this.donnees.scolariteActuelle.optionsChoisies) {
									switch (lChamp.getGenre()) {
										case ObjetRequetePageOrientations_1.NSOrientation
											.EGenreRessource.lv1:
											this.donnees.scolariteActuelle.optionsChoisies.lv1 =
												lListeSelection;
											break;
										case ObjetRequetePageOrientations_1.NSOrientation
											.EGenreRessource.lv2:
											this.donnees.scolariteActuelle.optionsChoisies.lv2 =
												lListeSelection;
											break;
										case ObjetRequetePageOrientations_1.NSOrientation
											.EGenreRessource.specialite:
											if (this.validerNombreOptions(lChamp, lListeSelection)) {
												this.donnees.scolariteActuelle.optionsChoisies.obligatoires =
													lListeSelection;
											} else {
												GApplication.getMessage().afficher({
													type: Enumere_BoiteMessage_1.EGenreBoiteMessage
														.Information,
													message: ObjetTraduction_1.GTraductions.getValeur(
														"inscriptionsEtablissement.msgOptionsObligatoires",
														[
															this.donnees.scolariteActuelle.formation
																.nbObligatoires,
														],
													),
												});
												return;
											}
											break;
										case ObjetRequetePageOrientations_1.NSOrientation
											.EGenreRessource.option:
											this.donnees.scolariteActuelle.optionsChoisies.facultatives =
												lListeSelection;
											break;
									}
								}
								lFenetreListeRessources.fermer();
							}
						},
						initialiser(aInstance) {
							const lParamsListe = {
								optionsListe: {
									hauteurAdapteContenu: true,
									hauteurMaxAdapteContenu: 300,
									skin: ObjetListe_1.ObjetListe.skin.flatDesign,
								},
							};
							aInstance.setOptionsFenetre({
								titre: lTitre,
								largeur: 400,
								hauteur: null,
								listeBoutons: [
									ObjetTraduction_1.GTraductions.getValeur("Annuler"),
									ObjetTraduction_1.GTraductions.getValeur("Valider"),
								],
							});
							aInstance.paramsListe = lParamsListe;
							aInstance.setFermerSurValidation(false);
						},
					},
				);
			lFenetreListeRessources.setDonnees(
				new DonneesListe_RessourceInscription(lListeRessources, lNbChoix),
			);
		}
	}
}
exports.ObjetInscriptionsEtablissement = ObjetInscriptionsEtablissement;
(function (ObjetInscriptionsEtablissement) {
	let GenreEvenement;
	(function (GenreEvenement) {
		GenreEvenement["annuler"] = "ev-oie-annuler";
		GenreEvenement["valider"] = "ev-oie-valider";
		GenreEvenement["precedent"] = "ev-oie-precedent";
		GenreEvenement["suivant"] = "ev-oie-suivant";
		GenreEvenement["modifier"] = "ev-oie-modifier";
		GenreEvenement["supprimer"] = "ev-oie-supprimer";
	})(
		(GenreEvenement =
			ObjetInscriptionsEtablissement.GenreEvenement ||
			(ObjetInscriptionsEtablissement.GenreEvenement = {})),
	);
})(
	ObjetInscriptionsEtablissement ||
		(exports.ObjetInscriptionsEtablissement = ObjetInscriptionsEtablissement =
			{}),
);
class DonneesListe_RessourceInscription extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeRessources, aNombreChoix) {
		super(aListeRessources);
		this.nombreChoixPossible = aNombreChoix;
		this.setOptions({
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
			avecCB: true,
			avecEvnt_CB: true,
			avecCocheCBSurLigne: true,
			avecSelection: false,
			avecDeploiement: false,
			avecTri: false,
			avecEvnt_Selection: true,
			avecEllipsis: false,
		});
	}
	getDisabledCB(aParams) {
		const lNombreSelectionne = this.Donnees.getListeElements((aElement) => {
			return aElement.selectionne;
		}).count();
		return (
			aParams.article.selectionne === false &&
			lNombreSelectionne >= this.nombreChoixPossible
		);
	}
	getValueCB(aParams) {
		return aParams.article.selectionne;
	}
	setValueCB(aParams, aValue) {
		aParams.article.selectionne = aValue;
	}
}
class ObjetChampInscription extends ObjetElement_1.ObjetElement {
	constructor(aParams) {
		super(aParams.libelle, GUID_1.GUID.getId());
		this.type = aParams.type;
		this.optionnel = aParams.optionnel === undefined ? true : aParams.optionnel;
		this.groupe = aParams.groupe || "";
		this.suffixe = aParams.suffixe || "";
		this.modeValidation =
			aParams.modeValidation === undefined
				? Enumere_Inscriptions_1.EModeValidation.MV_All
				: aParams.modeValidation;
		this.size = aParams.size || 100;
		this.disabled = !!aParams.disabled;
		this.valide = !!aParams.optionnel;
		this.autocomplete = aParams.autocomplete || "";
	}
	get id() {
		return `mi_oci_${this.groupe}_${this.type}_${this.suffixe}`;
	}
}
