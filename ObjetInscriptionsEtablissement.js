const { Identite } = require("ObjetIdentite.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
const { UtilitaireInscriptions } = require("UtilitaireInscriptions.js");
const {
	EModeValidation,
	ETypeDonneeInscription,
	EGroupeDonneeInscription,
	EEtape,
} = require("Enumere_Inscriptions.js");
const { EGenreSaisie } = require("Enumere_Saisie.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GUID } = require("GUID.js");
const { GDate } = require("ObjetDate.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_GenerationPdfSco,
} = require("ObjetFenetre_GenerationPdfSco.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { GenerationPDF } = require("UtilitaireGenerationPDF.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const {
	ObjetRequeteRechercheListeDonnees,
	TypeRechercheListe,
} = require("ObjetRequeteRechercheListeDonnees.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { GChaine } = require("ObjetChaine.js");
const { tag } = require("tag.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEvnt } = require("UtilitaireOrientation.js");
const {
	TypeOrigineCreationEtatDemandeInscriptionUtil,
} = require("TypeOrigineCreationEtatDemandeInscription.js");
const {
	TypeDecisionDemandeInscription,
	TypeDecisionDemandeInscriptionUtil,
} = require("TypeDecisionDemandeInscription.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetListe } = require("ObjetListe.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
class ObjetInscriptionsEtablissement extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.champs = new ObjetListeElements();
		this.listeCombo = { identite: [], responsables: [] };
		this.idConteneurOptions = GUID.getId();
		this.idListeDocuments = GUID.getId();
		this.idDivResponsable = GUID.getId();
		this.listeTabResponsables = null;
		this.responsableSelectionne = null;
	}
	setListesSaisie(aListes) {
		this.listes = aListes;
	}
	_getDonneesSauvegardeRecherche(aGroupe, aIndice) {
		if ([EGroupeDonneeInscription.responsables].includes(aGroupe)) {
			if (!this.sauvegardeRecherches[aGroupe]) {
				this.sauvegardeRecherches[aGroupe] = new ObjetListeElements();
			}
			if (
				!ObjetListeElements.prototype.isPrototypeOf(
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
				this.sauvegardeRecherches[aGroupe].addElement(new ObjetElement());
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
		new ObjetRequeteRechercheListeDonnees(this)
			.setOptions({ sansBlocageInterface: true })
			.lancerRequete(lParamsRequete)
			.then((aJSON) => {
				let lListe = aJSON.listeDonnees;
				const lElement = new ObjetElement(
					"&lt;&nbsp;" + aObjetChamp.messageNonTrouve + "&nbsp;&gt;",
				);
				lElement.nonSelectionnable = true;
				lListe.setTri([ObjetTri.init("Libelle")]);
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
		if ([EGroupeDonneeInscription.responsables].includes(lFamille)) {
			lDonnee = this.getResponsable(aObjetChamp.indiceResponsable);
		}
		if (!!lDonnee && !!lDonnee[lType]) {
			let lElement = lDonnee[lType];
			lElement.setLibelle(aValue);
			lElement.Numero = 0;
		} else {
			let lElement = new ObjetElement(aValue);
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
		this.champs = new ObjetListeElements();
		if (this.estResume) {
			return this.construireResume();
		} else {
			return this.composeEtape();
		}
	}
	composeEtape() {
		const lHtml = [];
		lHtml.push(
			'<div class="contenu-inscription flex-contain cols justify-between m-top-l">',
		);
		if (this.etape.getGenre() !== EEtape.consigne) {
			lHtml.push(
				tag(
					"h3",
					{ class: "m-bottom-xl" },
					GTraductions.getValeur("inscriptionsEtablissement.titreEtape", [
						this.etape.Position,
						this.listeEtapes.count() - 1,
						this.etape.getLibelle(),
					]),
				),
			);
		}
		switch (this.etape.getGenre()) {
			case EEtape.consigne:
				lHtml.push(this.composeConsigne());
				break;
			case EEtape.identite:
				lHtml.push(this.composeBlocIdentiteEnfant());
				lHtml.push(this.ajouterChampObligatoire());
				break;
			case EEtape.scolarite:
				lHtml.push(this.composeBlocScolariteSouhaitee());
				lHtml.push(this.ajouterChampObligatoire());
				break;
			case EEtape.responsables: {
				lHtml.push(
					tag("div", { "ie-identite": "getOngletResponsables" }),
					tag("div", { id: this.idDivResponsable, class: "m-top-xl" }),
				);
				lHtml.push(this.ajouterChampObligatoire());
				break;
			}
			case EEtape.fratrie:
				lHtml.push(this.composeBlocFratrie());
				break;
			case EEtape.champsLibre:
				lHtml.push(this.composeBlocChampLibre());
				break;
			case EEtape.documents:
				if (
					!!this.session &&
					this.session.listeDocumentsAFournir &&
					this.session.listeDocumentsAFournir.count() > 0
				) {
					lHtml.push(
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
								let lDocumentJoint = new ObjetElement(
									aDoc.getLibelle(),
									aDoc.getNumero(),
									TypeFichierExterneHttpSco.DocJointInscription,
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
		if (this.etape.getGenre() === EEtape.consigne) {
			lHtml.push(
				tag(
					"div",
					{ class: "m-top-l flex-contain justify-center" },
					tag(
						"ie-bouton",
						{ "ie-model": "btnSuivant", class: [TypeThemeBouton.primaire] },
						GTraductions.getValeur(
							"inscriptionsEtablissement.afficherFormulaire",
						),
					),
				),
			);
		} else {
			lHtml.push(
				tag(
					"div",
					{ class: "m-top-l flex-contain justify-end" },
					tag(
						"ie-bouton",
						{
							"ie-model": "btnPrecedent",
							class: [TypeThemeBouton.neutre, "m-x-l"],
						},
						GTraductions.getValeur("Precedent"),
					),
					tag(
						"ie-bouton",
						{ "ie-model": "btnSuivant", class: [TypeThemeBouton.primaire] },
						GTraductions.getValeur("Suivant"),
					),
				),
			);
		}
		if (this.etape.estDerniereEtape) {
			lHtml.push(
				tag(
					"div",
					{ class: "m-top-xl flex-contain justify-end" },
					tag(
						"ie-bouton",
						{
							"ie-model": "btnAnnuler",
							class: [TypeThemeBouton.secondaire, "m-x-l"],
						},
						GTraductions.getValeur("Annuler"),
					),
					tag(
						"ie-bouton",
						{ "ie-model": "btnValider", class: [TypeThemeBouton.primaire] },
						GTraductions.getValeur("inscriptionsEtablissement.envoyerDemande"),
					),
				),
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	ajouterChampObligatoire() {
		return tag(
			"span",
			{ class: "oie-champsobligatoire m-top" },
			GTraductions.getValeur("inscriptionsEtablissement.champsObligatoires"),
		);
	}
	setEtape(aEtape) {
		this.etape = aEtape;
		this.estResume = false;
		this.afficher();
		if (this.etape.getGenre() === EEtape.documents) {
			_redessinnerDocumentsFournis.call(this);
		}
	}
	surValider() {
		if (this.verifierChamps()) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Confirmation,
				message: GTraductions.getValeur(
					"inscriptionsEtablissement.msgValidation",
				),
				callback: (aGenreAction) => {
					if (aGenreAction === EGenreAction.Valider) {
						const lData = {
							genre: ObjetInscriptionsEtablissement.genreEvenement.valider,
							donnees: this.donnees,
							listeDocuments: this.listeDocuments,
						};
						this.callback.appel(lData);
					}
				},
			});
		}
	}
	surSupprimer() {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur(
				"inscriptionsEtablissement.msgConfirmationSuppression",
			),
			callback: (aGenreAction) => {
				if (aGenreAction === EGenreAction.Valider) {
					const lData = {
						genre: ObjetInscriptionsEtablissement.genreEvenement.supprimer,
						donnees: this.donnees,
						listeDocuments: this.listeDocuments,
					};
					this.callback.appel(lData);
				}
			},
		});
	}
	surAnnuler() {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur(
				"inscriptionsEtablissement.msgConfirmationAnnulation",
			),
			callback: (aGenreAction) => {
				if (aGenreAction === EGenreAction.Valider) {
					const lData = {
						genre: ObjetInscriptionsEtablissement.genreEvenement.annuler,
					};
					this.callback.appel(lData);
				}
			},
		});
	}
	verifierChamps(aAvecMessage = true) {
		let lToutOK = true;
		if (this.etape.getGenre() === EEtape.responsables) {
			_validerAdresse.call(this);
		}
		if (this.champs && this.champs.count()) {
			this.champs.parcourir((aChamp) => {
				const lObj = $(`#${aChamp.id}`);
				if (lObj) {
					lObj.attr("aria-invalid", !aChamp.valide);
				}
				if (!aChamp.valide && !aChamp.optionnel) {
					lToutOK = false;
				}
			});
		}
		if (this.etape.getGenre() === EEtape.scolarite) {
			_validerOptionsFormation.call(this);
			if (lToutOK && this.optionsFormation && this.optionsFormation.count()) {
				this.optionsFormation.parcourir((aChamp) => {
					const lObj = $(`#${aChamp.id}`);
					if (lObj) {
						lObj.attr("aria-invalid", !aChamp.valide);
					}
					if (!aChamp.valide && !aChamp.optionnel) {
						lToutOK = false;
					}
				});
			}
		}
		if (!lToutOK && aAvecMessage) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur(
					"inscriptionsEtablissement.msgFormulaireInvalide",
				),
			});
		}
		return lToutOK;
	}
	construireResume() {
		const lHtml = [];
		const lEtatDemande = this.donnees.resumeInscription.etatDemande;
		const lDecision = this.donnees.resumeInscription.decision;
		lHtml.push(
			tag("h3", { class: "p-left m-top-xl" }, this.session.getLibelle()),
		);
		lHtml.push(
			tag(
				"p",
				{ class: "p-left m-bottom-xl" },
				this.donnees.resumeInscription.nomElevePostulant,
			),
		);
		lHtml.push('<div class="resume-inscription">');
		lHtml.push(
			tag(
				"div",
				{ class: "flex-contain m-all" },
				tag(
					"p",
					{ class: "" },
					GTraductions.getValeur("inscriptionsEtablissement.formationDemandee"),
				),
				tag(
					"p",
					{ class: "Gras" },
					this.donnees.scolariteActuelle.formation.getLibelle(),
				),
			),
		);
		lHtml.push(
			tag(
				"div",
				{ class: "flex-contain m-all" },
				tag(
					"p",
					{ class: "" },
					GTraductions.getValeur("inscriptionsEtablissement.numeroDossier"),
				),
				tag(
					"p",
					{ class: "Gras" },
					this.donnees.resumeInscription.numeroDossier,
				),
			),
		);
		lHtml.push(
			tag(
				"div",
				{ class: "flex-contain m-all" },
				tag(
					"p",
					{ class: "" },
					GTraductions.getValeur("inscriptionsEtablissement.dateEnvoiDossier"),
				),
				tag(
					"p",
					{ class: "Gras" },
					GDate.formatDate(
						this.donnees.resumeInscription.dateDemande,
						"%JJ/%MM/%AAAA",
					),
				),
			),
		);
		lHtml.push(
			tag(
				"div",
				{ class: "flex-contain m-all" },
				tag(
					"p",
					{ class: "" },
					GTraductions.getValeur("inscriptionsEtablissement.etatDemande"),
				),
				tag(
					"p",
					{ class: "Gras" },
					TypeOrigineCreationEtatDemandeInscriptionUtil.getLibelle(
						lEtatDemande,
					),
				),
			),
		);
		if (lDecision !== TypeDecisionDemandeInscription.ddi_EnCours) {
			lHtml.push(
				tag(
					"div",
					{ class: "flex-contain m-all" },
					tag(
						"p",
						{ class: "" },
						GTraductions.getValeur("inscriptionsEtablissement.decision"),
					),
					tag(
						"p",
						{ class: "Gras" },
						TypeDecisionDemandeInscriptionUtil.getLibelle(lDecision),
						tag("i", {
							class: [
								TypeDecisionDemandeInscriptionUtil.getClass(lDecision),
								"m-left-l",
							],
						}),
					),
				),
			);
		}
		lHtml.push(
			tag(
				"ie-bouton",
				{
					class: [TypeThemeBouton.neutre, "m-top-xl m-bottom-big"],
					"ie-model": "btnImpressionInscription",
				},
				GTraductions.getValeur("inscriptionsEtablissement.telechargerDemande"),
			),
		);
		if (this.donnees.resumeInscription.annotationEtat) {
			lHtml.push(
				tag(
					"div",
					{ class: "flex-contain flex-center m-bottom-l" },
					tag("i", {
						class: [
							TypeOrigineCreationEtatDemandeInscriptionUtil.getIcone(
								lEtatDemande,
							),
							"m-right-l icon",
						],
					}),
					tag(
						"h2",
						{ class: "ie-titre" },
						GTraductions.getValeur("inscriptionsEtablissement.annotation"),
					),
				),
				tag(
					"div",
					{ class: "m-top p-all-xl annotation-etat" },
					this.donnees.resumeInscription.annotationEtat,
				),
			);
		}
		lHtml.push(
			tag(
				"div",
				{ class: "m-top-l flex-contain justify-end" },
				tag(
					"ie-bouton",
					{
						"ie-model": "btnSupprimer",
						class: [TypeThemeBouton.secondaire, "m-x-l"],
					},
					GTraductions.getValeur("Supprimer"),
				),
				tag(
					"ie-bouton",
					{ "ie-model": "btnModifier", class: [TypeThemeBouton.primaire] },
					GTraductions.getValeur("inscriptionsEtablissement.modifierDemande"),
				),
			),
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeConsigne() {
		return tag(
			"div",
			{ class: ["oie_consigne", "flex-contain", "flex-cols"] },
			(aTabs) => {
				let lAvecEspace = false;
				if (!!this.session.libelleConsigne) {
					aTabs.push(
						tag("span", this.session.libelleConsigne.replaceRCToHTML()),
					);
					lAvecEspace = true;
				}
				if (!!this.session.documentsConsigne) {
					aTabs.push(
						tag(
							"div",
							{ class: [""] },
							GChaine.composerUrlLienExterne({
								documentJoint: this.session.documentsConsigne.get(0),
							}),
						),
					);
					lAvecEspace = true;
				}
				aTabs.push(
					tag(
						"div",
						{ class: [lAvecEspace ? "m-top-big" : "", "Gras"] },
						tag(
							"p",
							GTraductions.getValeur(
								"inscriptionsEtablissement.msgAvertissementConsigne",
							),
						),
					),
				);
			},
		);
	}
	composeBlocResponsable(aIndice) {
		this.champs = new ObjetListeElements();
		const lEstSupplementaire = aIndice > 0;
		const lDonnees = this.getResponsable(aIndice);
		const lDisabled =
			!lEstSupplementaire &&
			GEtatUtilisateur.GenreEspace !== EGenreEspace.Inscription;
		const lHtml = [];
		lHtml.push(`<div class="zone-formulaire">`);
		lHtml.push("<div>");
		let lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.civilite"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.civilite,
			optionnel: true,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_All,
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
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.nom"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.nom,
			optionnel: lDisabled,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
			autocomplete: "family-name",
			disabled: lDisabled,
		});
		lHtml.push(this.ajouterInput(lChamp));
		_validerChamp.call(this, lChamp.getNumero(), !!lDonnees && !!lDonnees.nom);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.nomNaissance"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.nomNaissance,
			optionnel: true,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_All,
			size: 40,
			disabled: lDisabled,
		});
		lHtml.push(this.ajouterInput(lChamp));
		_validerChamp.call(this, lChamp.getNumero(), !!lDonnees && !!lDonnees.nom);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.prenom"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.prenom,
			optionnel: lDisabled,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
			autocomplete: "given-name",
			disabled: lDisabled,
		});
		lHtml.push(this.ajouterInput(lChamp));
		_validerChamp.call(
			this,
			lChamp.getNumero(),
			!!lDonnees && !!lDonnees.prenoms,
		);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur(
				"inscriptionsEtablissement.responsabilites",
			),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.responsabilite,
			optionnel: false,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_Obligatoire,
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
		lHtml.push(this.ajouterRecherche(lChamp));
		_validerChamp.call(
			this,
			lChamp.getNumero(),
			!!lDonnees && !!lDonnees.niveauResponsabilite,
		);
		if (this.listes.listeLienParente && this.listes.listeLienParente.count()) {
			lChamp = new ObjetChampInscription({
				libelle: GTraductions.getValeur("inscriptionsEtablissement.lien"),
				groupe: EGroupeDonneeInscription.responsables,
				type: ETypeDonneeInscription.parente,
				optionnel: true,
				suffixe: aIndice,
				modeValidation: EModeValidation.MV_All,
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
			lHtml.push(this.ajouterRecherche(lChamp));
		}
		if (this.session && this.session.avecResponsabilites) {
			lHtml.push('<div class="oie-container-check p-top-l">');
			lChamp = new ObjetChampInscription({
				libelle: GTraductions.getValeur(
					"inscriptionsEtablissement.hebergeEnfant",
				),
				groupe: EGroupeDonneeInscription.responsables,
				type: ETypeDonneeInscription.hebergeEnfant,
				optionnel: true,
				suffixe: aIndice,
				modeValidation: EModeValidation.MV_All,
				size: 40,
				disabled: false,
			});
			lHtml.push(this.ajouterCheckBox(lChamp));
			lChamp = new ObjetChampInscription({
				libelle: GTraductions.getValeur(
					"inscriptionsEtablissement.responsableFinancier",
				),
				groupe: EGroupeDonneeInscription.responsables,
				type: ETypeDonneeInscription.responsableFinancier,
				optionnel: true,
				suffixe: aIndice,
				modeValidation: EModeValidation.MV_All,
				size: 40,
				disabled: false,
			});
			lHtml.push(this.ajouterCheckBox(lChamp));
			lChamp = new ObjetChampInscription({
				libelle: GTraductions.getValeur(
					"inscriptionsEtablissement.percoitAides",
				),
				groupe: EGroupeDonneeInscription.responsables,
				type: ETypeDonneeInscription.percoitAides,
				optionnel: true,
				suffixe: aIndice,
				modeValidation: EModeValidation.MV_All,
				size: 40,
				disabled: false,
			});
			lHtml.push(this.ajouterCheckBox(lChamp));
			lHtml.push("</div>");
		}
		const lObligatoire =
			GEtatUtilisateur.GenreEspace === EGenreEspace.Inscription;
		lHtml.push(
			this.ajouterChampAdresse(
				EGroupeDonneeInscription.responsables,
				aIndice,
				lDisabled,
				lObligatoire,
			),
		);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur(
				"inscriptionsEtablissement.telephoneMobile",
			),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.numeroTelMobile,
			optionnel: lDisabled || !!lEstSupplementaire,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
			disabled: lDisabled,
		});
		lChamp.typeSup = ETypeDonneeInscription.indicatifTelMobile;
		lHtml.push(this.ajouterInputTelephone(lChamp));
		_validerChamp.call(
			this,
			lChamp.getNumero(),
			!!lDonnees && !!lDonnees.numeroTelMobile,
		);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.telephone"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.numeroTelFixe,
			optionnel: true,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_Telephone,
			size: 40,
			disabled: lDisabled,
		});
		lChamp.typeSup = ETypeDonneeInscription.indicatifTelFixe;
		lHtml.push(this.ajouterInputTelephone(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.email"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.email,
			optionnel: true,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
			disabled: !lEstSupplementaire,
		});
		lChamp.typeSup = ETypeDonneeInscription.indicatifTelFixe;
		lHtml.push(this.ajouterInput(lChamp));
		lHtml.push("</div>");
		lHtml.push(
			this.composeBlocInformationsAdministratives(aIndice, lDonnees, lDisabled),
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeBlocInformationsAdministratives(aIndice, aDonnees, aDisabled) {
		const lHtml = [];
		lHtml.push('<div class= "oie-info-admin">');
		lHtml.push(
			tag(
				"h3",
				{ class: "ie-titre-couleur m-y-xl" },
				GTraductions.getValeur(
					"inscriptionsEtablissement.infosAdministrativesCourt",
				),
			),
		);
		let lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.situation"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.situation,
			optionnel: true,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_All,
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
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.profession"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.profession,
			optionnel: true,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_All,
			size: 40,
			disabled: aDisabled,
		});
		lChamp.indiceResponsable = aIndice;
		lChamp.typeRecherche = TypeRechercheListe.trl_profession;
		lChamp.messageNonTrouve = GTraductions.getValeur(
			"inscriptionsEtablissement.professionNonTrouvee",
		);
		lChamp.avecSaisieAlt = false;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.telephone"),
			groupe: EGroupeDonneeInscription.responsables,
			type: ETypeDonneeInscription.numeroTelBureau,
			optionnel: true,
			suffixe: aIndice,
			modeValidation: EModeValidation.MV_Telephone,
			size: 40,
			disabled: aDisabled,
		});
		lChamp.indiceResponsable = aIndice;
		lChamp.typeSup = ETypeDonneeInscription.indicatifTelBureau;
		lHtml.push(this.ajouterInputTelephone(lChamp));
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composeBlocFratrie() {
		const lHtml = [];
		lHtml.push('<div class="zone-formulaire">');
		let lIndexElement = this.donnees.fratrie.count();
		this.donnees.fratrie.parcourir((aElement) => {
			lHtml.push(
				this.ajouterInputLectureSeule(
					GTraductions.getValeur("inscriptionsEtablissement.nom"),
					aElement.Nom,
				),
			);
			lHtml.push(
				this.ajouterInputLectureSeule(
					GTraductions.getValeur("inscriptionsEtablissement.prenom"),
					aElement.Prenom,
				),
			);
			lHtml.push(
				this.ajouterInputLectureSeule(
					GTraductions.getValeur("inscriptionsEtablissement.classe"),
					aElement.Classe,
				),
			);
			if (lIndexElement-- !== 1) {
				lHtml.push('<hr class="separateur m-bottom-xl"></hr>');
			}
		});
		lHtml.push("</div>");
		return lHtml.join("");
	}
	composerOptions() {
		const lHtml = [];
		this.optionsFormation = new ObjetListeElements();
		let lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.options,
			optionnel: false,
			suffixe: "OBL1",
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lChamp.Genre = EGenreEvnt.specialite;
		lChamp.listeElements = "obligatoires";
		lHtml.push(this.ajouterComboOptions(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.options,
			optionnel: false,
			suffixe: "LV",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lChamp.Genre = EGenreEvnt.lv1;
		lChamp.ordreOptionDeGroupe = 1;
		lChamp.listeElements = "lve1";
		lHtml.push(this.ajouterComboOptions(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.options,
			optionnel: false,
			suffixe: "LV2",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lChamp.Genre = EGenreEvnt.lv2;
		lChamp.ordreOptionDeGroupe = 2;
		lChamp.listeElements = "lve2";
		lHtml.push(this.ajouterComboOptions(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: "",
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.options,
			optionnel: true,
			suffixe: "FAC1",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lChamp.Genre = EGenreEvnt.option;
		lChamp.listeElements = "facultatives";
		lHtml.push(this.ajouterComboOptions(lChamp));
		return lHtml.join("");
	}
	composeBlocScolariteSouhaitee() {
		const lHtml = [];
		lHtml.push('<div class="zone-formulaire">');
		let lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.ine"),
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.ine,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lHtml.push(this.ajouterInput(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.etabActuel"),
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.etablissementActuel,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeRecherche = TypeRechercheListe.trl_etablissement;
		lChamp.messageNonTrouve = GTraductions.getValeur(
			"inscriptionsEtablissement.etablissementNonTrouve",
		);
		lChamp.avecSaisieAlt = true;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.classe"),
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.classeActuelle,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeSup = ETypeDonneeInscription.indicatifTelFixe;
		lHtml.push(this.ajouterInput(lChamp));
		if (this.session && this.session.avecProjetAccompagnement) {
			lChamp = new ObjetChampInscription({
				libelle: GTraductions.getValeur(
					"inscriptionsEtablissement.ProjetAccompagnement",
				),
				groupe: EGroupeDonneeInscription.scolariteActuelle,
				type: ETypeDonneeInscription.projetsAccompagnement,
				optionnel: true,
				suffixe: "",
				modeValidation: EModeValidation.MV_All,
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
				libelle: GTraductions.getValeur(
					"inscriptionsEtablissement.CommentaireProjets",
				),
				groupe: EGroupeDonneeInscription.scolariteActuelle,
				type: ETypeDonneeInscription.commentairePA,
				optionnel: true,
			});
			lChamp.rows = "10";
			lChamp.cols = "33";
			lChamp.placeHolder = GTraductions.getValeur(
				"inscriptionsEtablissement.CommentaireProjets",
			);
			lChamp.hideLabel = true;
			lHtml.push(this.ajouterTextarea(lChamp));
		}
		lHtml.push(
			tag(
				"h3",
				{ class: "ie-titre-couleur m-y-xl" },
				GTraductions.getValeur("inscriptionsEtablissement.scolariteSouhaitee"),
			),
		);
		lChamp = new ObjetChampInscription({
			libelle: GApplication.estPrimaire
				? GTraductions.getValeur("inscriptionsEtablissement.classeSouhaitee")
				: GTraductions.getValeur("inscriptionsEtablissement.formation"),
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.formation,
			optionnel: false,
			suffixe: "",
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lHtml.push(this.ajouterRecherche(lChamp));
		lHtml.push(
			tag(
				"div",
				{ id: this.idConteneurOptions, class: ["ConteneurComboOptions"] },
				this.composerOptions(),
			),
		);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.redoublant"),
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.redoublant,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 5,
		});
		lChamp.elements = new ObjetListeElements();
		const lOui = new ObjetElement("oui");
		lOui.value = GTraductions.getValeur("inscriptionsEtablissement.oui");
		lOui.id = lChamp.id + "redoublantOui";
		lOui.checked = this.donnees.scolariteActuelle
			? this.donnees.scolariteActuelle.redoublant
			: false;
		lOui.valeurCoche = true;
		lChamp.elements.addElement(lOui);
		const lNon = new ObjetElement("non");
		lNon.value = GTraductions.getValeur("inscriptionsEtablissement.non");
		lNon.id = lChamp.id + "redoublantNon";
		lNon.checked = this.donnees.scolariteActuelle
			? !this.donnees.scolariteActuelle.redoublant
			: true;
		lNon.valeurCoche = false;
		lChamp.elements.addElement(lNon);
		lHtml.push(this.ajouterInputRadio(lChamp));
		if (!GApplication.estPrimaire) {
			lChamp = new ObjetChampInscription({
				libelle: GTraductions.getValeur("inscriptionsEtablissement.regime"),
				groupe: EGroupeDonneeInscription.scolariteActuelle,
				type: ETypeDonneeInscription.regime,
				optionnel: true,
				suffixe: "",
				modeValidation: EModeValidation.MV_All,
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
			libelle: GTraductions.getValeur("inscriptionsEtablissement.boursier"),
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.boursier,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 5,
		});
		lChamp.elements = new ObjetListeElements();
		const lOuiBoursier = new ObjetElement("oui");
		lOuiBoursier.value = GTraductions.getValeur(
			"inscriptionsEtablissement.oui",
		);
		lOuiBoursier.id = lChamp.id + "boursierOui";
		lOuiBoursier.checked = this.donnees.scolariteActuelle
			? this.donnees.scolariteActuelle.boursier
			: false;
		lOuiBoursier.valeurCoche = true;
		lChamp.elements.addElement(lOuiBoursier);
		const lNonBoursier = new ObjetElement("non");
		lNonBoursier.value = GTraductions.getValeur(
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
			groupe: EGroupeDonneeInscription.scolariteActuelle,
			type: ETypeDonneeInscription.commentaire,
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
			libelle: GTraductions.getValeur("inscriptionsEtablissement.civilite"),
			groupe: EGroupeDonneeInscription.identite,
			type: ETypeDonneeInscription.civilite,
			optionnel: true,
			modeValidation: EModeValidation.MV_All,
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
			libelle: GTraductions.getValeur("inscriptionsEtablissement.nom"),
			groupe: EGroupeDonneeInscription.identite,
			type: ETypeDonneeInscription.nomEnfant,
			optionnel: false,
			suffixe: "",
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lHtml.push(this.ajouterInput(lChamp));
		_validerChamp.call(
			this,
			lChamp.getNumero(),
			!!this.donnees &&
				!!this.donnees.identite &&
				!!this.donnees.identite.nomEnfantPostulant,
		);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.prenom"),
			groupe: EGroupeDonneeInscription.identite,
			type: ETypeDonneeInscription.prenomEnfant,
			optionnel: false,
			suffixe: "",
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
		});
		lHtml.push(this.ajouterInput(lChamp));
		_validerChamp.call(
			this,
			lChamp.getNumero(),
			!!this.donnees &&
				!!this.donnees.identite &&
				!!this.donnees.identite.prenomEnfantPostulant,
		);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.sexe"),
			groupe: EGroupeDonneeInscription.identite,
			type: ETypeDonneeInscription.sexe,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 5,
		});
		lChamp.elements = new ObjetListeElements();
		const lGarcon = new ObjetElement("garcon");
		lGarcon.value = GTraductions.getValeur("inscriptionsEtablissement.garcon");
		lGarcon.id = lChamp.id + "sexeG";
		lGarcon.checked = this.donnees.identite
			? !this.donnees.identite.sexeEnfant
			: 0;
		lGarcon.valeurCoche = 0;
		lChamp.elements.addElement(lGarcon);
		const lFille = new ObjetElement("fille");
		lFille.value = GTraductions.getValeur("inscriptionsEtablissement.fille");
		lFille.id = lChamp.id + "sexeF";
		lFille.checked = this.donnees.identite
			? this.donnees.identite.sexeEnfant
			: 1;
		lFille.valeurCoche = 1;
		lChamp.elements.addElement(lFille);
		lHtml.push(this.ajouterInputRadio(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur(
				"inscriptionsEtablissement.dateNaissance",
			),
			groupe: EGroupeDonneeInscription.identite,
			type: ETypeDonneeInscription.dateNaissance,
			optionnel: false,
			suffixe: "",
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 5,
		});
		lHtml.push(this.ajouterInputDateNaissance(lChamp));
		_validerChamp.call(
			this,
			lChamp.getNumero(),
			!!this.donnees &&
				!!this.donnees.identite &&
				!!this.donnees.identite.dateNaissance,
		);
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur(
				"inscriptionsEtablissement.villeNaissance",
			),
			groupe: EGroupeDonneeInscription.identite,
			type: ETypeDonneeInscription.villeNaissance,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeRecherche = TypeRechercheListe.trl_ville;
		lChamp.messageNonTrouve = GTraductions.getValeur(
			"inscriptionsEtablissement.villeNonTrouvee",
		);
		lChamp.avecSaisieAlt = true;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur(
				"inscriptionsEtablissement.paysNaissance",
			),
			groupe: EGroupeDonneeInscription.identite,
			type: ETypeDonneeInscription.paysNaissance,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 40,
		});
		lChamp.typeRecherche = TypeRechercheListe.trl_pays;
		lChamp.messageNonTrouve = GTraductions.getValeur(
			"inscriptionsEtablissement.paysNonTrouve",
		);
		lChamp.avecSaisieAlt = true;
		lHtml.push(this.ajouterRecherche(lChamp));
		lHtml.push(this.ajouterChampAdresse(EGroupeDonneeInscription.identite));
		lHtml.push("</div>");
		return lHtml.join("");
	}
	ajouterChampAdresse(
		aGroupeDonnee,
		aIndiceResponsable,
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
					libelle: GTraductions.getValeur("inscriptionsEtablissement.CPVille"),
					groupe: aGroupeDonnee,
					type: ETypeDonneeInscription.codePostal,
					optionnel: !lObligatoire,
					modeValidation: EModeValidation.MV_Obligatoire,
					size: 40,
					autocomplete: "postal-code",
					disabled: aDisabled,
				}),
			),
		);
		let lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.ville"),
			groupe: aGroupeDonnee,
			type: ETypeDonneeInscription.ville,
			optionnel: !lObligatoire,
			suffixe: "",
			modeValidation: EModeValidation.MV_Obligatoire,
			size: 40,
			autocomplete: "address-level2",
			disabled: aDisabled,
		});
		lChamp.typeRecherche = TypeRechercheListe.trl_ville;
		lChamp.messageNonTrouve = GTraductions.getValeur(
			"inscriptionsEtablissement.villeNonTrouvee",
		);
		lChamp.avecSaisieAlt = true;
		lChamp.indiceResponsable = aIndiceResponsable;
		lHtml.push(this.ajouterRecherche(lChamp));
		lChamp = new ObjetChampInscription({
			libelle: GTraductions.getValeur("inscriptionsEtablissement.pays"),
			groupe: aGroupeDonnee,
			type: ETypeDonneeInscription.pays,
			optionnel: true,
			suffixe: "",
			modeValidation: EModeValidation.MV_All,
			size: 40,
			autocomplete: "address-level1",
			disabled: aDisabled,
		});
		lChamp.typeRecherche = TypeRechercheListe.trl_pays;
		lChamp.messageNonTrouve = GTraductions.getValeur(
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
				'<i class="icon_piece_jointe icon_personnalise_pj"></i>',
				'<span class="PetitEspaceGauche">',
				aElt.getLibelle(),
				"</span>",
				"</div>",
			);
			const lIdent = this.idListeDocuments + lIndice;
			this.listeDocumentsFournis[lIndice] = new ObjetListeElements();
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
		lElement.setEtat(EGenreEtat.Creation);
		this.listeDocumentsFournis[aIndice].addElement(lElement);
		_redessinnerDocumentsFournis.call(this);
	}
	getControleur(aInstance) {
		return {
			getOngletResponsables() {
				return {
					class: ObjetTabOnglets,
					pere: aInstance,
					init: function (aInstanceTab) {
						aInstanceTab.setOptions({ largeurOnglets: 180 });
					},
					start: function (aInstanceTab) {
						aInstance.identTabs = aInstanceTab;
						const lListeOngletResp = new ObjetListeElements();
						if (aInstance.session) {
							for (let i = 0; i < aInstance.session.nbResponsables; i++) {
								const lElement = new ObjetElement(
									GTraductions.getValeur(
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
									!saisieResponsableEnCours.call(aInstance) ||
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
							GHtml.setHtml(
								aInstance.ongletSelectionne.idDiv,
								aInstance.composeBlocResponsable(
									aInstance.ongletSelectionne.indiceResponsable,
								),
								{ controleur: aInstance.controleur },
							);
							return false;
						}
					},
					destroy: function () {
						aInstance.listeTabResponsables = null;
					},
				};
			},
			btnImpressionInscription: {
				event() {
					if (aInstance.donnees) {
						const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_GenerationPdfSco,
							{
								pere: this.instance,
								evenement: function (
									aNumeroBouton,
									aParametresAffichage,
									aOptionsPDF,
								) {
									if (aNumeroBouton === 1) {
										GenerationPDF.genererPDF({
											paramPDF: aParametresAffichage,
											optionsPDF: aOptionsPDF,
										});
									}
								},
							},
						);
						lInstanceFenetre.afficher({
							genreGenerationPDF:
								TypeHttpGenerationPDFSco.RecapDemandeInscription,
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
							lElement.setEtat(EGenreEtat.Suppression);
							lListeDocuments.addElement(lElement);
						} else {
							if (lElement.getEtat() !== EGenreEtat.Creation) {
								lElementEnSuppression.setEtat(EGenreEtat.Suppression);
							} else {
								let lIndice = lListeDocuments.getIndiceParElement(lElement);
								lElement.setEtat(EGenreEtat.Suppression);
								lListeDocuments.remove(lIndice);
							}
						}
						_redessinnerDocumentsFournis.call(aInstance);
					}
				},
			},
			selecFile: {
				getOptionsSelecFile() {
					_redessinnerDocumentsFournis.call(aInstance);
					return {
						maxSize: GApplication.droits.get(
							TypeDroits.tailleMaxDocJointEtablissement,
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
								mode: EGenreSaisie.Combo,
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
								EGenreEvenementObjetSaisie.selection &&
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
						_validerChamp.call(
							aInstance,
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
						_validerChamp.call(
							aInstance,
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
								mode: EGenreSaisie.Combo,
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
								EGenreEvenementObjetSaisie.selection &&
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
						_validerChamp.call(
							aInstance,
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
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
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
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
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
						_validerChamp.call(
							aInstance,
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
						_validerChamp.call(
							aInstance,
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
								mode: EGenreSaisie.Combo,
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
								EGenreEvenementObjetSaisie.selection &&
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
								_validerChamp.call(
									aInstance,
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
								mode: EGenreSaisie.Combo,
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
								EGenreEvenementObjetSaisie.selection &&
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
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
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
						_validerChamp.call(
							aInstance,
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
								mode: EGenreSaisie.Combo,
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
								EGenreEvenementObjetSaisie.selection &&
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
						_validerChamp.call(
							aInstance,
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
						_validerChamp.call(
							aInstance,
							aNumeroChamp,
							!!aInstance.donnees.identite.prenomEnfantPostulant,
						);
					},
					exitChange(aNumeroChamp) {
						_validerChamp.call(
							aInstance,
							aNumeroChamp,
							!!aInstance.donnees.identite.prenomEnfantPostulant,
						);
					},
				},
				dateNaissance: function (aNumeroChamp) {
					return {
						class: ObjetCelluleDate,
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
							_validerChamp.call(aInstance, aNumeroChamp, !!aDate);
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
						_validerChamp.call(
							aInstance,
							aNumeroChamp,
							aInstance.donnees.identite.sexeEnfant !== undefined,
						);
					},
				},
				villeNaissance: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
					},
				},
				paysNaissance: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
					},
				},
				ville: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance.listeCombo.identite.ville = aCombo;
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
					},
				},
				pays: {
					init(aNumeroChamp, aCombo) {
						const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
						if (!!lChamp) {
							aInstance.listeCombo.identite.pays = aCombo;
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
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
						_validerChamp.call(
							aInstance,
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
							_initialiserRecherche(aInstance, aCombo, lChamp);
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
						_evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp);
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
								mode: EGenreSaisie.Combo,
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
								EGenreEvenementObjetSaisie.selection &&
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
								mode: EGenreSaisie.Combo,
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
								_majListeOrientations(aInstance.listeOrientations);
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
							EGenreEvenementObjetSaisie.selection
						) {
							if (aInstance.donnees && aInstance.donnees.scolariteActuelle) {
								if (
									aInstance.donnees.scolariteActuelle &&
									(!aInstance.donnees.scolariteActuelle.formation ||
										aInstance.donnees.scolariteActuelle.formation.getNumero() !==
											aParametres.element.getNumero())
								) {
									aInstance.donnees.scolariteActuelle.optionsChoisies = {
										obligatoires: new ObjetListeElements(),
										facultatives: new ObjetListeElements(),
										lv1: new ObjetListeElements(),
										lv2: new ObjetListeElements(),
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
							_validerChamp.call(
								aInstance,
								aNumeroChamp,
								!!aInstance.donnees.scolariteActuelle.formation,
							);
						}
					},
				},
				options: {
					event(aNumeroChamp, aParametres) {
						_afficherFenetreOptions.call(aInstance, aNumeroChamp, aParametres);
					},
					getLibelle(aNumeroChamp) {
						const lHtml = [];
						const lChamp =
							aInstance.optionsFormation.getElementParNumero(aNumeroChamp);
						if (
							aInstance.donnees.scolariteActuelle &&
							aInstance.donnees.scolariteActuelle.optionsChoisies
						) {
							const lListe = _getOptionsSelonGenre.call(
								aInstance,
								lChamp.getGenre(),
							);
							if (lListe && lListe.count()) {
								if (lChamp.getGenre() === EGenreEvnt.option) {
									lListe.parcourir((aOption) => {
										lHtml.push(
											tag(
												"ie-chips",
												{
													class: "m-left",
													"ie-model": tag.funcAttr(
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
											tag(
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
									case EGenreEvnt.lv1:
										lLibelle = `${GTraductions.getValeur("inscriptionsEtablissement.optionLV1")}* <span class="TexteRouge">${GTraductions.getValeur("inscriptionsEtablissement.attendues", [1])}</span>`;
										break;
									case EGenreEvnt.lv2:
										lLibelle = `${GTraductions.getValeur("inscriptionsEtablissement.optionLV2")}* <span class="TexteRouge">${GTraductions.getValeur("inscriptionsEtablissement.attendues", [1])}</span>`;
										break;
									case EGenreEvnt.specialite:
										lLibelle = `${GTraductions.getValeur("inscriptionsEtablissement.optionObligatoire")}* <span class="TexteRouge">${GTraductions.getValeur("inscriptionsEtablissement.attendues", [aInstance.donnees.scolariteActuelle.formation.nbObligatoires])}</span>`;
										break;
									case EGenreEvnt.option:
										lLibelle = `${GTraductions.getValeur("inscriptionsEtablissement.optionFacultative")} <span class="TexteRouge">${GTraductions.getValeur("inscriptionsEtablissement.maximum", [aInstance.donnees.scolariteActuelle.formation.nbFacultatives])}</span>`;
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
							_getOptionVisible.call(aInstance, aNumeroChamp)
						);
					},
				},
				chipsOptions: {
					eventBtn: function (aGenreOption, aNumeroOption) {
						if (
							aInstance.donnees.scolariteActuelle &&
							aInstance.donnees.scolariteActuelle.optionsChoisies
						) {
							const lListe = _getOptionsSelonGenre.call(
								aInstance,
								aGenreOption,
							);
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
						_validerChamp.call(
							aInstance,
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
								mode: EGenreSaisie.Combo,
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
								EGenreEvenementObjetSaisie.selection &&
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
						_validerChamp.call(
							aInstance,
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
			inputReadOnly: {
				getValue: function (aValue) {
					return aValue || "";
				},
				getDisabled() {
					return true;
				},
			},
			btnPrecedent: {
				event() {
					aInstance.callback.appel({
						genre: ObjetInscriptionsEtablissement.genreEvenement.precedent,
					});
				},
				getDisabled: function () {
					return aInstance.etape.getNumero() === 0;
				},
			},
			btnCopierAdresse: {
				event(aGroupeDonnee, aIndiceResponsable) {
					switch (aGroupeDonnee) {
						case EGroupeDonneeInscription.responsables: {
							const lResponsable = aInstance.getResponsable(0);
							if (aIndiceResponsable === 0) {
								lResponsable.adresse = [...aInstance.donnees.identite.adresse];
								lResponsable.codePostal = aInstance.donnees.identite.codePostal;
								lResponsable.ville = MethodesObjet.dupliquer(
									aInstance.donnees.identite.ville,
									true,
								);
								lResponsable.pays = MethodesObjet.dupliquer(
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
									lResponsableSupp.ville = MethodesObjet.dupliquer(
										lResponsable.ville,
										true,
									);
									lResponsableSupp.pays = MethodesObjet.dupliquer(
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
						case EGroupeDonneeInscription.identite: {
							if (aInstance.donnees.responsables) {
								const lResponsable = aInstance.getResponsable(0);
								if (lResponsable) {
									aInstance.donnees.identite.adresse = [
										...lResponsable.adresse,
									];
									aInstance.donnees.identite.codePostal =
										lResponsable.codePostal;
									aInstance.donnees.identite.ville = MethodesObjet.dupliquer(
										lResponsable.ville,
										true,
									);
									aInstance.donnees.identite.pays = MethodesObjet.dupliquer(
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
						case EGroupeDonneeInscription.responsables:
							return (
								GEtatUtilisateur.GenreEspace === EGenreEspace.Inscription ||
								aIndice > 0
							);
						case EGroupeDonneeInscription.identite:
							return GEtatUtilisateur.GenreEspace === EGenreEspace.Parent;
						default:
							return false;
					}
				},
			},
			btnSuivant: {
				event() {
					if (aInstance.verifierChamps()) {
						aInstance.callback.appel({
							genre: ObjetInscriptionsEtablissement.genreEvenement.suivant,
						});
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
					aInstance.callback.appel({
						genre: ObjetInscriptionsEtablissement.genreEvenement.modifier,
					});
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
			ObjetListeElements.prototype.isPrototypeOf(this.donnees.responsables)
		) {
			if (this.donnees.responsables.count() > 0) {
				lResult = this.donnees.responsables.get(aIndice);
				if (lResult === undefined) {
					this.donnees.responsables.addElement(new ObjetElement(), aIndice);
					lResult = this.donnees.responsables.get(aIndice);
				}
			}
		}
		return lResult;
	}
	vider() {
		this.listeDocumentsFournis = [];
		this.listeDocuments = new ObjetListeElements();
		this.donnees = undefined;
		this.sauvegardeRecherches = undefined;
		this.session = undefined;
		this.listeOrientations = new ObjetListeElements();
		this.DonneesRecues = false;
		this.estResume = undefined;
		this.estEnCreation = undefined;
		this.afficher();
	}
	setDonnees(aParams) {
		this.listeDocumentsFournis = [];
		this.listeDocuments = new ObjetListeElements();
		this.donnees = aParams.donnees;
		this.sauvegardeRecherches = MethodesObjet.dupliquer(this.donnees);
		this.inscriptionCourante = aParams.inscriptionCourante;
		this.session = aParams.session;
		this.listeOrientations = new ObjetListeElements();
		if (this.session && this.session.orientations) {
			this.listeOrientations = this.session.orientations;
			this.listeOrientations.setTri([ObjetTri.init("Libelle")]);
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
			class: ["round-style"],
			type: "text",
			"ie-model": tag.funcAttr(
				`${aObjetChamp.groupe}.${aObjetChamp.type}`,
				lParams,
			),
			autocomplete: aObjetChamp.autocomplete,
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
			tag(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				tag(
					"label",
					{ for: aObjetChamp.id, class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				tag("input", lAttr),
				aObjetChamp.optionnel
					? ""
					: tag(
							"span",
							{ id: aObjetChamp.id + "_error", class: "errormessage" },
							UtilitaireInscriptions.getMessageErreur(
								aObjetChamp.modeValidation,
							),
						),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputLectureSeule(aLabel, aValue) {
		const lHtml = [];
		const lId = GUID.getId();
		lHtml.push(
			tag(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				tag("label", { for: lId, class: ["fix-bloc ie-titre-petit"] }, aLabel),
				tag("input", {
					id: lId,
					class: ["round-style"],
					type: "text",
					"ie-model": tag.funcAttr(`inputReadOnly`, [aValue]),
				}),
			),
		);
		return lHtml.join("");
	}
	ajouterCheckBox(aObjetChamp) {
		const lHtml = [];
		lHtml.push(
			tag(
				"div",
				{ class: "field-contain label-up p-bottom-l" },
				tag(
					"ie-checkbox",
					{
						id: aObjetChamp.id,
						class: ["oie_checkbox", "round-style"],
						"ie-model": tag.funcAttr(
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
			class: "round-style ifc_textarea",
			"max-length": "10000",
			"ie-compteurmax": "10000",
			"ie-model": tag.funcAttr(`${aObjetChamp.groupe}.${aObjetChamp.type}`, [
				aObjetChamp.getNumero(),
			]),
		};
		if (aObjetChamp.placeHolder) {
			lAttr.placeHolder = aObjetChamp.placeHolder;
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
		}
		if (aObjetChamp.rows) {
			lAttr.rows = aObjetChamp.rows;
		}
		if (aObjetChamp.cols) {
			lAttr.cols = aObjetChamp.cols;
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		const lAttLabel = {
			for: aObjetChamp.id,
			class: ["fix-bloc ie-titre-petit"],
		};
		if (aObjetChamp.hideLabel) {
			lAttLabel.class.push("sr-only");
		}
		lHtml.push(
			tag(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				tag(
					"label",
					lAttLabel,
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				tag("ie-textareamax", lAttr),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputDateNaissance(aObjetChamp) {
		const lHtml = [];
		const lAttr = { class: ["round-style"], type: "text" };
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		lHtml.push(
			tag(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				tag(
					"label",
					{ class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				tag("div", { id: aObjetChamp.id, class: [] }),
				tag("div", {
					"ie-identite": tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}`,
						[aObjetChamp.getNumero()],
					),
				}),
				tag(
					"span",
					{ id: aObjetChamp.id + "_error", class: "errormessage" },
					UtilitaireInscriptions.getMessageErreur(aObjetChamp.modeValidation),
				),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputRadio(aObjetChamp) {
		const lHtml = [];
		lHtml.push(
			tag(
				"div",
				{ class: ["field-contain label-up p-bottom-l"] },
				tag(
					"label",
					{ class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				tag(
					"div",
					{ id: aObjetChamp.id, class: ["flex-contain flex-gap"] },
					(aTab) => {
						aObjetChamp.elements.parcourir((aElement) => {
							const lAttr = {
								id: aElement.id,
								"ie-model": tag.funcAttr(
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
							aTab.push(tag("ie-radio", lAttr, aElement.value));
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
			"ie-model": tag.funcAttr(`${aObjetChamp.groupe}.${aObjetChamp.type}`, [
				aObjetChamp.getNumero(),
			]),
			class: "round-style",
			name: aObjetChamp.autocomplete,
		};
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		lHtml.push(
			tag(
				"div",
				{ class: ["flex-contain p-bottom-l"], id: aObjetChamp.id },
				tag("ie-combo", lAttr),
			),
			tag(
				"span",
				{ id: aObjetChamp.id + "_error", class: "errormessage" },
				UtilitaireInscriptions.getMessageErreur(aObjetChamp.modeValidation),
			),
		);
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterComboOptions(aObjetChamp) {
		const lHtml = [];
		lHtml.push(
			tag(
				"div",
				{
					id: aObjetChamp.id,
					class: ["field-contain label-up p-bottom-l"],
					"ie-display": tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}.visible`,
						[aObjetChamp.getNumero()],
					),
				},
				tag("label", {
					class: "fix-bloc ie-titre-petit",
					"ie-html": tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}.getHtml`,
						[aObjetChamp.getNumero()],
					),
				}),
				tag("ie-btnselecteur", {
					class: ["chips-inside round-style multilignes"],
					"ie-model": tag.funcAttr(
						`${aObjetChamp.groupe}.${aObjetChamp.type}`,
						[aObjetChamp.getNumero()],
					),
				}),
				tag(
					"span",
					{ id: aObjetChamp.id + "_error", class: "errormessage" },
					UtilitaireInscriptions.getMessageErreur(aObjetChamp.modeValidation),
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
			class: ["round-style"],
			"ie-telephone": "true",
			"ie-model": tag.funcAttr(`${aObjetChamp.groupe}.${aObjetChamp.type}`, [
				aObjetChamp.getNumero(),
			]),
			autocomplete: "tel-local",
			placeHolder: aObjetChamp.placeHolder || "",
		};
		if (aObjetChamp.placeHolder) {
			lAttr.placeHolder = aObjetChamp.placeHolder;
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
		}
		if (!aObjetChamp.optionnel) {
			lAttr["aria-required"] = "true";
			lAttr["aria-invalid"] = "false";
			lAttr["aria-errormessage"] = aObjetChamp.id + "_error";
		}
		lHtml.push(
			tag(
				"div",
				{ class: ["field-contain label-up p-bottom-l"], id: aObjetChamp.id },
				tag(
					"label",
					{ for: aObjetChamp.id, class: ["fix-bloc ie-titre-petit"] },
					aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
				),
				tag(
					"div",
					{ class: [] },
					tag("input", {
						id: aObjetChamp.id + "Indicatif",
						class: "round-style m-x",
						"ie-indicatiftel": "true",
						size: "3",
						autocomplete: "tel-country-code",
						"ie-model": tag.funcAttr(
							`${aObjetChamp.groupe}.${aObjetChamp.typeSup}`,
							[aObjetChamp.getNumero()],
						),
					}),
					tag("input", lAttr),
				),
			),
		);
		if (!aObjetChamp.optionnel) {
			lHtml.push(
				tag(
					"span",
					{ id: aObjetChamp.id + "_error", class: "errormessage" },
					UtilitaireInscriptions.getMessageErreur(aObjetChamp.modeValidation),
				),
			);
		}
		this.champs.addElement(aObjetChamp);
		return lHtml.join("");
	}
	ajouterInputAdresse(
		aGroupeDonnee,
		aIndiceResponsable,
		aDisabled,
		aObligatoire,
	) {
		const lHtml = [];
		const lLibelleBtn =
			[EGroupeDonneeInscription.identite].includes(aGroupeDonnee) ||
			aIndiceResponsable > 0
				? "inscriptionsEtablissement.copierAdresseResponsable"
				: "inscriptionsEtablissement.copierAdresseEnfant";
		const lChampsAdresse = new ObjetListeElements();
		for (let i = 1; i <= 4; i++) {
			let lChamp = new ObjetChampInscription({
				libelle: "",
				groupe: aGroupeDonnee,
				type: ETypeDonneeInscription.adresse,
				suffixe: i,
				optionnel: !aObligatoire,
				modeValidation: EModeValidation.MV_Obligatoire,
				size: 40,
				autocomplete: "address-line" + i,
				disabled: aDisabled,
			});
			lChampsAdresse.add(lChamp);
		}
		this.champs.add(lChampsAdresse);
		lHtml.push(
			'<fieldset class="m-y-l flex-contain cols">',
			tag(
				"div",
				{ class: "flex-contain flex-center justify-between m-bottom-l" },
				tag(
					"legend",
					GTraductions.getValeur("inscriptionsEtablissement.adresse") +
						(aObligatoire ? "*" : ""),
				),
				tag(
					"ie-bouton",
					{
						"ie-model": tag.funcAttr("btnCopierAdresse", [
							aGroupeDonnee,
							aIndiceResponsable,
						]),
						class: [TypeThemeBouton.neutre, "small-bt"],
						"ie-display": "btnCopierAdresse.getDisplay",
					},
					GTraductions.getValeur(lLibelleBtn),
				),
			),
		);
		lHtml.push('<div class="flex-contain cols">');
		lChampsAdresse.parcourir((aChamp) => {
			const lAttr = {
				id: aChamp.id,
				class: ["round-style m-bottom"],
				type: "text",
				"aria-required": "true",
				"aria-invalid": "false",
				"aria-errormessage": aChamp.id + "_error",
				placeHolder: GTraductions.getValeur(
					"inscriptionsEtablissement.adresse" + aChamp.suffixe,
				),
				"ie-model": tag.funcAttr(
					`${aGroupeDonnee}.${ETypeDonneeInscription.adresse}`,
					[aChamp.getNumero(), aChamp.suffixe],
				),
				autocomplete: aChamp.autocomplete,
			};
			lHtml.push(tag("input", lAttr));
		});
		lHtml.push(
			tag(
				"span",
				{ id: lChampsAdresse.get(0).id + "_error", class: "errormessage" },
				UtilitaireInscriptions.getMessageErreur(EModeValidation.MV_Obligatoire),
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
				case EGenreEvnt.lv1:
					return lFormation.avecLV1 && aListeRessources.count() === 1;
				case EGenreEvnt.lv2:
					return lFormation.avecLV2 && aListeRessources.count() === 1;
				case EGenreEvnt.specialite:
					return (
						lFormation.nbObligatoires &&
						aListeRessources.count() === lFormation.nbObligatoires
					);
				case EGenreEvnt.option:
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
}
ObjetInscriptionsEtablissement.genreEvenement = {
	annuler: "ev-oie-annuler",
	valider: "ev-oie-valider",
	precedent: "ev-oie-precedent",
	suivant: "ev-oie-suivant",
	modifier: "ev-oie-modifier",
	supprimer: "ev-oie-supprimer",
};
function _validerChamp(aNumeroChamp, aEstValide) {
	const lChamps = this.champs.getElementParNumero(aNumeroChamp);
	if (!!lChamps) {
		lChamps.valide = aEstValide;
	}
}
function saisieResponsableEnCours() {
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
function _getOptionVisible(aNumeroChamp) {
	if (
		this.donnees &&
		this.donnees.scolariteActuelle &&
		this.donnees.scolariteActuelle.formation
	) {
		const lChamp = this.optionsFormation.getElementParNumero(aNumeroChamp);
		if (!!lChamp) {
			switch (lChamp.getGenre()) {
				case EGenreEvnt.lv1:
					return (
						this.donnees.scolariteActuelle.formation.avecLV1 &&
						this.listes &&
						this.listes.listeLV1 &&
						this.listes.listeLV1.count()
					);
				case EGenreEvnt.lv2:
					return (
						this.donnees.scolariteActuelle.formation.avecLV2 &&
						this.listes &&
						this.listes.listeLV2 &&
						this.listes.listeLV2.count()
					);
				case EGenreEvnt.specialite:
					return (
						this.donnees.scolariteActuelle.formation.nbObligatoires > 0 &&
						this.donnees.scolariteActuelle.formation.obligatoires &&
						this.donnees.scolariteActuelle.formation.obligatoires.count() > 1
					);
				case EGenreEvnt.option:
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
function _majListeOrientations(aListeOrientation) {
	aListeOrientation.parcourir((aOrientation) => {
		if (aOrientation.options) {
			aOrientation.options.setTri([ObjetTri.init("Libelle")]);
			aOrientation.options.trier();
			aOrientation.obligatoires = new ObjetListeElements();
			aOrientation.facultatives = new ObjetListeElements();
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
function _initialiserRecherche(aInstance, aCombo, aObjetChamp) {
	aCombo.setOptionsObjetSaisie({
		mode: EGenreSaisie.SaisieRecherche,
		avecOuvertureDeroulantModale: false,
		longueur: 250,
		surEditionRecherche: function (aValeurRecherche, aCallback) {
			aInstance._surEditionRechercheListe(
				aObjetChamp,
				aValeurRecherche,
				aCallback,
				aCombo,
			);
		},
		nbCarMinRecherche: 3,
		rechercheTout: ["", "*"],
		libelleHaut: aObjetChamp.getLibelle() + (aObjetChamp.optionnel ? "" : "*"),
		required: !aObjetChamp.optionnel,
		avecEventSurFermetureListe: true,
		getEstElementNonSelectionnable: function (aElement) {
			return !aElement.existeNumero();
		},
	});
}
function _evenementRecherche(aInstance, aParametres, aCombo, aNumeroChamp) {
	const lChamp = aInstance.champs.getElementParNumero(aNumeroChamp);
	if (!!lChamp) {
		const lFamille = lChamp.groupe;
		const lType = lChamp.type;
		let lDonnee = aInstance.donnees[lFamille];
		if (
			!!lDonnee &&
			[EGroupeDonneeInscription.responsables].includes(lFamille)
		) {
			lDonnee = aInstance.getResponsable(lChamp.indiceResponsable);
		}
		if (aParametres.genreEvenement === EGenreEvenementObjetSaisie.deploiement) {
			aCombo.avecSelectionUtilisateur = false;
		}
		if (
			aParametres.genreEvenement === EGenreEvenementObjetSaisie.selection &&
			aParametres.element &&
			aCombo.estUneInteractionUtilisateur()
		) {
			if (!!lDonnee) {
				lDonnee[lType] = aParametres.element;
				aCombo.avecSelectionUtilisateur = true;
			}
		}
		if (aParametres.genreEvenement === EGenreEvenementObjetSaisie.fermeture) {
			if (
				aCombo.ListeElements.count() === 1 &&
				aCombo.ListeElements.get(0).existeNumero() &&
				!lChamp.avecSaisieAlt
			) {
				if (!!lDonnee) {
					lDonnee[lType] = aCombo.ListeElements.get(0);
					aCombo.setContenu(lDonnee[lType].getLibelle());
				}
			} else {
				if (
					!!lChamp &&
					aParametres.element === null &&
					!aCombo.avecSelectionUtilisateur &&
					!!lChamp.avecSaisieAlt
				) {
					const lSauvegarde = aInstance._getDonneesSauvegardeRecherche(
						lFamille,
						lChamp.indiceResponsable,
					);
					const lInfo = !!lSauvegarde ? lSauvegarde[lType] : "";
					aInstance.saisieAlternative(lChamp, lInfo);
				}
			}
		}
	}
}
function _redessinnerDocumentsFournis() {
	let lListe = this.listeDocumentsFournis;
	for (let i = 0; i < lListe.length; i++) {
		let lIdent = this.idListeDocuments + i;
		GHtml.setHtml(
			lIdent,
			UtilitaireUrl.construireListeUrls(this.listeDocumentsFournis[i], {
				separateur: " ",
				IEModelChips: "chipsDocJoint",
				genreRessource: TypeFichierExterneHttpSco.DocJointInscription,
				argsIEModelChips: [i],
				maxWidth: 300,
			}),
			{ controleur: this.controleur },
		);
	}
}
function _validerAdresse() {
	if ([EEtape.responsables].includes(this.etape.getGenre())) {
		const lListeChampAdresse = this.champs.getListeElements((aChamp) => {
			return [
				ETypeDonneeInscription.adresse,
				ETypeDonneeInscription.ville,
				ETypeDonneeInscription.codePostal,
				ETypeDonneeInscription.pays,
			].includes(aChamp.type);
		});
		const lDonnees =
			this.etape.getGenre() === EEtape.identite
				? this.donnees.identite
				: this.responsableSelectionne;
		if (lListeChampAdresse.count() && lDonnees && lDonnees.adresse) {
			const lAdresse = lDonnees.adresse.join("");
			lListeChampAdresse.parcourir((aChamp) => {
				let lValide;
				switch (aChamp.type) {
					case ETypeDonneeInscription.adresse:
						lValide = lAdresse !== "";
						break;
					case ETypeDonneeInscription.codePostal:
						lValide = lDonnees.codePostal && lDonnees.codePostal !== "";
						break;
					case ETypeDonneeInscription.ville:
						lValide = lDonnees.ville && lDonnees.ville.getLibelle() !== "";
						break;
					case ETypeDonneeInscription.pays:
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
function _validerOptionsFormation() {
	if ([EEtape.scolarite].includes(this.etape.getGenre())) {
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
				if (_getOptionVisible.call(this, aChamp.getNumero())) {
					const lOptionChoisies = _getOptionsSelonGenre.call(
						this,
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
function _getOptionsSelonGenre(aGenre) {
	let lOptions = null;
	if (this.donnees.scolariteActuelle.optionsChoisies) {
		switch (aGenre) {
			case EGenreEvnt.lv1:
				lOptions = this.donnees.scolariteActuelle.optionsChoisies.lv1;
				break;
			case EGenreEvnt.lv2:
				lOptions = this.donnees.scolariteActuelle.optionsChoisies.lv2;
				break;
			case EGenreEvnt.specialite:
				lOptions = this.donnees.scolariteActuelle.optionsChoisies.obligatoires;
				break;
			case EGenreEvnt.option:
				lOptions = this.donnees.scolariteActuelle.optionsChoisies.facultatives;
				break;
			default:
				break;
		}
	}
	return lOptions;
}
function _afficherFenetreOptions(aNumeroChamp) {
	const lChamp = this.optionsFormation.getElementParNumero(aNumeroChamp);
	if (_getOptionVisible.call(this, aNumeroChamp)) {
		let lListeRessources = new ObjetListeElements();
		let lNbChoix = 0;
		let lTitre = "";
		switch (lChamp.getGenre()) {
			case EGenreEvnt.lv1:
				lListeRessources = this.listes.listeLV1;
				lNbChoix = 1;
				lTitre = `${GTraductions.getValeur("inscriptionsEtablissement.optionLV1")}* <span>${GTraductions.getValeur("inscriptionsEtablissement.attendues", [lNbChoix])}</span>`;
				break;
			case EGenreEvnt.lv2:
				lListeRessources = this.listes.listeLV2;
				lNbChoix = 1;
				lTitre = `${GTraductions.getValeur("inscriptionsEtablissement.optionLV2")}* <span>${GTraductions.getValeur("inscriptionsEtablissement.attendues", [lNbChoix])}</span>`;
				break;
			case EGenreEvnt.specialite:
				lListeRessources =
					this.donnees.scolariteActuelle.formation.obligatoires;
				lNbChoix = this.donnees.scolariteActuelle.formation.nbObligatoires;
				lTitre = `${GTraductions.getValeur("inscriptionsEtablissement.optionObligatoire")}* <span>${GTraductions.getValeur("inscriptionsEtablissement.attendues", [lNbChoix])}</span>`;
				break;
			case EGenreEvnt.option:
				lListeRessources =
					this.donnees.scolariteActuelle.formation.facultatives;
				lNbChoix = this.donnees.scolariteActuelle.formation.nbFacultatives;
				lTitre = `${GTraductions.getValeur("inscriptionsEtablissement.optionFacultative")} <span>${GTraductions.getValeur("inscriptionsEtablissement.maximum", [lNbChoix])}</span>`;
				break;
			default:
				break;
		}
		let lListe;
		if (
			this.donnees &&
			this.donnees.scolariteActuelle &&
			this.donnees.scolariteActuelle.optionsChoisies
		) {
			lListe = _getOptionsSelonGenre.call(this, lChamp.getGenre());
		} else {
			return;
		}
		const lListeSelection = lListe.getTableauNumeros();
		lListeRessources.parcourir((aRessource) => {
			aRessource.selectionne = lListeSelection.includes(aRessource.getNumero());
		});
		ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
			pere: this,
			evenement(aGenreBouton, aToto, aTata) {
				if (aGenreBouton !== 1) {
					this.instanceListeRessource.fermer();
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
							case EGenreEvnt.lv1:
								this.donnees.scolariteActuelle.optionsChoisies.lv1 =
									lListeSelection;
								break;
							case EGenreEvnt.lv2:
								this.donnees.scolariteActuelle.optionsChoisies.lv2 =
									lListeSelection;
								break;
							case EGenreEvnt.specialite:
								if (this.validerNombreOptions(lChamp, lListeSelection)) {
									this.donnees.scolariteActuelle.optionsChoisies.obligatoires =
										lListeSelection;
								} else {
									GApplication.getMessage().afficher({
										type: EGenreBoiteMessage.Information,
										message: GTraductions.getValeur(
											"inscriptionsEtablissement.msgOptionsObligatoires",
											[this.donnees.scolariteActuelle.formation.nbObligatoires],
										),
									});
									return;
								}
								break;
							case EGenreEvnt.option:
								this.donnees.scolariteActuelle.optionsChoisies.facultatives =
									lListeSelection;
								break;
						}
					}
					this.instanceListeRessource.fermer();
				}
			},
			initialiser(aInstance) {
				this.instanceListeRessource = aInstance;
				const lParamsListe = {
					optionsListe: {
						hauteurAdapteContenu: true,
						hauteurMaxAdapteContenu: 300,
						skin: ObjetListe.skin.flatDesign,
					},
				};
				aInstance.setOptionsFenetre({
					titre: lTitre,
					largeur: 400,
					hauteur: null,
					listeBoutons: [
						GTraductions.getValeur("Annuler"),
						GTraductions.getValeur("Valider"),
					],
				});
				aInstance.paramsListe = lParamsListe;
				aInstance.setFermerSurValidation(false);
			},
		}).setDonnees(
			new DonneesListe_RessourceInscription(lListeRessources, lNbChoix),
		);
	}
}
class DonneesListe_RessourceInscription extends ObjetDonneesListeFlatDesign {
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
class ObjetChampInscription extends ObjetElement {
	constructor(aParams) {
		super(aParams.libelle, GUID.getId());
		this.ident = aParams.ident;
		this.model = aParams.model || "";
		this.type = aParams.type;
		this.optionnel = aParams.optionnel === undefined ? true : aParams.optionnel;
		this.groupe = aParams.groupe || "";
		this.suffixe = aParams.suffixe || "";
		this.modeValidation =
			aParams.modeValidation === undefined
				? EModeValidation.MV_All
				: aParams.modeValidation;
		this.size = aParams.size || 100;
		this.disabled = !!aParams.disabled;
		this.valide = !!aParams.optionnel;
		this.indiceOption = aParams.indiceOption || -1;
		this.autocomplete = aParams.autocomplete || "";
	}
	get id() {
		return `mi_oci_${this.groupe}_${this.type}_${this.suffixe}`;
	}
}
module.exports = { ObjetInscriptionsEtablissement };
