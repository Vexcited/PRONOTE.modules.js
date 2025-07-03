exports.ObjetFenetre_SaisiePunitions = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetCelluleMultiSelectionMotif_1 = require("ObjetCelluleMultiSelectionMotif");
const ObjetMoteurPunitions_1 = require("ObjetMoteurPunitions");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetSelecteurPJCP_1 = require("ObjetSelecteurPJCP");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const TypeGenrePunition_1 = require("TypeGenrePunition");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_SaisiePunitions extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.idContenuPage = this.Nom + "_contenuPage";
		this.idContenuMessage = this.Nom + "_contenuMessage";
		this.idLibelleDate = this.Nom + "_libelleDate";
		this.idTitreProgrammation = this.Nom + "_programmation";
		this.idLabelMotif = this.Nom + "_labelMotif";
		this.idTextareaDetail = this.Nom + "_textareaDetail";
		this.idTextareaTAF = this.Nom + "_textareaTAF";
		this.moteurPunitions = new ObjetMoteurPunitions_1.ObjetMoteurPunitions(
			this,
		);
	}
	construireInstances() {
		this.identComboType = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementComboType,
			this._initialiserComboType,
		);
		this.identComboAccomp = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementComboAccomp,
			this._initialiserComboAccomp,
		);
		this.identComboDuree = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementComboDuree,
			this._initialiserComboDuree,
		);
		this.identComboDate = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this._evenementComboDate,
			this._initialiserComboDate,
		);
		this.identFenetreCalendrier = this.addFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			this._evenementFenetreCalendrier,
			this._initialiserFenetreCalendrier,
		);
		this.identCMS_Motifs = this.add(
			ObjetCelluleMultiSelectionMotif_1.ObjetCelluleMultiSelectionMotif,
			this._evenementChoixMotifs,
			(aInstance) => {
				aInstance.setOptions({ ariaLabelledBy: this.idLabelMotif });
			},
		);
		this.identSelecteurPJ = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evntSelecteurPJ.bind(this),
			this._initSelecteurPJ,
		);
		this.identSelecteurPJTAF = this.add(
			ObjetSelecteurPJ_1.ObjetSelecteurPJ,
			this._evntSelecteurPJTAF.bind(this),
			this._initSelecteurPJ,
		);
		this.IdPremierElement = this.getInstance(
			this.identComboType,
		).getPremierElement();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbTafPublierDebutSeance: {
				getValue() {
					const lPunition = aInstance.moteurPunitions.punition;
					return lPunition && lPunition.publierTafApresDebutRetenue;
				},
				setValue(aValue) {
					const lPunition = aInstance.moteurPunitions.punition;
					if (lPunition) {
						lPunition.publierTafApresDebutRetenue = aValue;
						lPunition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
				getDisplay() {
					const lPunition = aInstance.moteurPunitions.punition;
					return (
						lPunition &&
						lPunition.naturePunition &&
						lPunition.naturePunition.getGenre() ===
							TypeGenrePunition_1.TypeGenrePunition.GP_Retenues
					);
				},
			},
		});
	}
	setDonnees(aParam) {
		this.moteurPunitions.init(aParam);
		this.listePJ = aParam.listePJ;
		this.date = aParam.date;
		this.afficher();
		if (aParam.eleve) {
			this.setOptionsFenetre({
				titre: this.moteurPunitions.getTitre(),
				listeBoutons: this.moteurPunitions.listeBoutons,
			});
			this._actualiserDureeDate();
			ObjetHtml_1.GHtml.setDisplay(this.idContenuPage, true);
			ObjetHtml_1.GHtml.setDisplay(this.idContenuMessage, false);
			this.getInstance(this.identComboType).setDonnees(
				this.moteurPunitions.listeNature,
				this.moteurPunitions.genreRessource ===
					Enumere_Ressource_1.EGenreRessource.Punition &&
					this.moteurPunitions.punition.naturePunition
					? this.moteurPunitions.listeNature.getIndiceParNumeroEtGenre(
							this.moteurPunitions.punition.naturePunition.getNumero(),
						)
					: 0,
			);
			this.getInstance(this.identComboAccomp).setDonnees(
				this.moteurPunitions.listeEleves,
				this.moteurPunitions.indiceAccompagnateur,
			);
			this.getInstance(this.identComboType).setActif(
				this.moteurPunitions.avecModifType(),
			);
			this.getInstance(this.identCMS_Motifs).setDonnees(
				this.moteurPunitions.punition.listeMotifs,
			);
			const lListePJ = this.moteurPunitions.punition.documents
				? this.moteurPunitions.punition.documents
				: new ObjetListeElements_1.ObjetListeElements();
			this.documents = new ObjetListeElements_1.ObjetListeElements();
			this.getInstance(this.identSelecteurPJ).setActif(true);
			this.getInstance(this.identSelecteurPJ).setOptions({
				genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			});
			this.getInstance(this.identSelecteurPJ).setDonnees({
				listePJ: lListePJ,
				listeTotale: this.documents,
				idContextFocus: this.Nom,
			});
			const lListePJTAF = this.moteurPunitions.punition.documentsTAF
				? this.moteurPunitions.punition.documentsTAF
				: new ObjetListeElements_1.ObjetListeElements();
			this.getInstance(this.identSelecteurPJTAF).setActif(true);
			this.getInstance(this.identSelecteurPJTAF).setOptions({
				genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			});
			this.getInstance(this.identSelecteurPJTAF).setDonnees({
				listePJ: lListePJTAF,
				listeTotale: this.documents,
				idContextFocus: this.Nom,
			});
			this.getInstance(this.identComboDuree).setActif(
				this.moteurPunitions.avecModifDuree(),
			);
			$("#" + this.idTitreProgrammation.escapeJQ()).css("display", "none");
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.idContenuPage, false);
			ObjetHtml_1.GHtml.setDisplay(this.idContenuMessage, true);
		}
	}
	afficher() {
		return super.afficher();
	}
	_evenementComboType(aParams) {
		const lPunition = this.moteurPunitions.punition;
		if (!lPunition) {
			return;
		}
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			aParams.element
		) {
			lPunition.naturePunition = new ObjetElement_1.ObjetElement(
				aParams.element.Libelle,
				aParams.element.getNumero(),
				aParams.element.getGenre(),
			);
			lPunition.naturePunition.nbJoursDecalagePublicationParDefaut =
				aParams.element.nbJoursDecalagePublicationParDefaut;
			lPunition.naturePunition.dureeParDefaut = aParams.element.dureeParDefaut;
			const lEstEnDevoir = this.moteurPunitions.estPunitionEnDevoir();
			this._actualiserDureeDate();
			if (lEstEnDevoir) {
				delete lPunition.duree;
			} else {
				delete lPunition.date;
			}
		}
	}
	_evenementComboAccomp(aParams) {
		if (
			this.moteurPunitions.genreRessource ===
			Enumere_Ressource_1.EGenreRessource.Punition
		) {
			return;
		}
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (!this.moteurPunitions.punition.Accompagnateur) {
				this.moteurPunitions.punition.Accompagnateur =
					new ObjetElement_1.ObjetElement();
			}
			this.moteurPunitions.punition.Accompagnateur.Numero =
				aParams.element.getNumero();
		}
	}
	_evenementComboDuree(aParams) {
		if (!this.moteurPunitions.punition) {
			return;
		}
		const lInstanceCombo = this.getInstance(this.identComboDuree);
		if (
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
			lInstanceCombo.estUneInteractionUtilisateur() &&
			!this.moteurPunitions.estPunitionEnDevoir() &&
			!!aParams.element
		) {
			this.moteurPunitions.punition.duree = aParams.element.duree;
		}
	}
	_evenementComboDate(aParams) {
		if (!this.moteurPunitions.punition) {
			return;
		}
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
				.deploiement:
				if (this.moteurPunitions.estPunitionEnDevoir()) {
					const lDate =
						this.moteurPunitions.punition.date ||
						this.moteurPunitions.punition.dateProgrammation ||
						this.date;
					this.getInstance(this.identFenetreCalendrier).setDonnees(lDate);
					return false;
				}
				break;
		}
	}
	_evenementFenetreCalendrier(aGenreBouton, aDate) {
		if (aGenreBouton === 1) {
			let lDateCourant = aDate;
			if (!ObjetDate_1.GDate.estUnJourOuvre(lDateCourant)) {
				const lStrDate = !!lDateCourant
					? ObjetDate_1.GDate.formatDate(lDateCourant, "%JJ/%MM/%AAAA")
					: "";
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"fenetreSaisiePunition.DatePasUnJoursOuvre",
							[lStrDate],
						),
					});
				do {
					lDateCourant = ObjetDate_1.GDate.getJourSuivant(lDateCourant, -1);
				} while (!ObjetDate_1.GDate.estUnJourOuvre(lDateCourant));
			}
			this.moteurPunitions.punition.date = lDateCourant;
			this.getInstance(this.identComboDate).setDonnees(
				this.moteurPunitions.getListeDuree(),
				0,
			);
		}
	}
	_evenementChoixMotifs(aNumeroBouton, aListeDonnees) {
		if (aNumeroBouton === 1) {
			this.miseAJourPunition(aListeDonnees);
		} else {
			this.getInstance(this.identCMS_Motifs).setDonnees(
				this.moteurPunitions.punition.listeMotifs,
			);
		}
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="',
			this.idContenuPage,
			'">',
			this._construirePage(),
			"</div>",
			'<div id="',
			this.idContenuMessage,
			'" style="margin:5px;"></div>',
		);
		return T.join("");
	}
	_construirePage() {
		const T = [];
		const lLargeur = this.optionsFenetre.largeur - 22;
		T.push('<div style="max-width:', lLargeur, 'px;">');
		T.push(
			'<div class="p-bottom-l">',
			'<ul><li class="NoWrap">',
			'<span class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.circonstances",
			),
			"</span>",
			"</li></ul>",
			'<hr class="m-all-none" />',
			"</div>",
		);
		T.push(
			'<div class="field-contain label-up full-width">',
			'<label class="m-bottom" id="',
			this.idLabelMotif,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.motif"),
			" : ",
			"</label>",
			'<div id="' +
				this.getInstance(this.identCMS_Motifs).getNom() +
				'"></div>',
			"</div>",
		);
		const lMaxLengthCirconstance = this.moteurPunitions.maxlengthCirconstance
			? `maxlength="${this.moteurPunitions.maxlengthCirconstance}" ie-compteurmax="${this.moteurPunitions.maxlengthCirconstance}" `
			: "";
		T.push(
			'<div class="field-contain label-up full-width">',
			'<label for="',
			this.idTextareaDetail,
			'" class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.details"),
			" : ",
			"</label>",
			'<ie-textareamax id="',
			this.idTextareaDetail,
			'" ie-model="circonstance" ' +
				lMaxLengthCirconstance +
				'  style="' +
				ObjetStyle_1.GStyle.composeWidth(lLargeur) +
				ObjetStyle_1.GStyle.composeHeight(
					ObjetChaine_1.GChaine.getHauteurPolice(10) * 3 + 4,
				) +
				'" ></ie-textareamax>',
			"</div>",
		);
		T.push(
			'<div class="pj-cols p-bottom" id="' +
				this.getInstance(this.identSelecteurPJ).getNom() +
				'" style="max-width:',
			lLargeur,
			'px;"></div>',
		);
		T.push(
			'<div class="p-y-l">',
			'<ul><li class="NoWrap">',
			'<span class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.suiteDonnee",
			),
			"</span>",
			"</li></ul>",
			'<hr class="m-all-none" />',
			"</div>",
		);
		T.push(
			'<div class="flex-contain flex-center justify-between p-y-l">',
			'<div class="flex-contain flex-center">',
			'<span ie-html="libelleCombo" class="m-right"></span>',
			'<div ie-style="visibiliteComboType"><div id="' +
				this.getInstance(this.identComboType).getNom() +
				'"></div></div>',
			'<div ie-style="visibiliteComboAccomp"><div id="' +
				this.getInstance(this.identComboAccomp).getNom() +
				'"></div></div>',
			"</div>",
			'<div class="flex-contain flex-center" ie-style="visibiliteChoixDuree">',
			'<span class="m-right ie-titre-petit">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.duree"),
			"</span>",
			'<div id="' +
				this.getInstance(this.identComboDuree).getNom() +
				'"></div>',
			"</div>",
			'<div class="flex-contain flex-center" ie-style="visibiliteChoixDate">',
			'<span class="m-right ie-titre-petit">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.aRendre"),
			"</span>",
			'<div id="' + this.getInstance(this.identComboDate).getNom() + '"></div>',
			"</div>",
			"</div>",
		);
		const lMaxLengthTaf = this.moteurPunitions.maxlengthTaf
			? `maxlength="${this.moteurPunitions.maxlengthTaf}" ie-compteurmax="${this.moteurPunitions.maxlengthTaf}" `
			: "";
		T.push(
			'<div  class="field-contain label-up full-width">',
			'<label for="',
			this.idTextareaTAF,
			'" class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.taf"),
			" : ",
			"</label>",
			'<ie-textareamax id="',
			this.idTextareaTAF,
			'" ie-model="commentaire" ' +
				lMaxLengthTaf +
				'  style="' +
				ObjetStyle_1.GStyle.composeWidth(lLargeur) +
				ObjetStyle_1.GStyle.composeHeight(
					ObjetChaine_1.GChaine.getHauteurPolice(10) * 4 + 4,
				) +
				'"></ie-textareamax>',
			"</div>",
		);
		T.push(
			'<div class="p-bottom-xl pj-cols" id="' +
				this.getInstance(this.identSelecteurPJTAF).getNom() +
				'" style="max-width:',
			lLargeur,
			'px;"></div>',
		);
		T.push(
			'<div><ie-checkbox class="m-top" ie-model="cbTafPublierDebutSeance" ie-display="cbTafPublierDebutSeance.getDisplay">',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.publierUniquementDebutRetenue",
			),
			"</ie-checkbox>",
		);
		T.push(
			'<div id="',
			this.idTitreProgrammation,
			'" class="p-bottom-l">',
			'<ul><li class="NoWrap">',
			'<span class="Gras">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.aProgrammer",
			),
			"</span>",
			"</li></ul>",
			'<hr class="m-all-none" />',
			"</div>",
		);
		T.push(
			'<div class="p-top-l"',
			this.moteurPunitions.avecDroitPublie() ? "" : ' style="display:none;"',
			">",
		);
		T.push(
			'<div class="flex-contain flex-gap-l">',
			'<ie-checkbox ie-model="checkPublierPunition">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.publierPunition",
			),
			"</ie-checkbox>",
			'<i role="img" ie-class="getClasseCssImagePublicationPunition" ie-title="getHintImagePublicationPunition"></i>',
			"</div>",
		);
		T.push(
			'<div class="p-top-l m-left-xl flex-contain flex-center">',
			ObjetTraduction_1.GTraductions.getValeur("Le_Maj"),
			'<div class="InlineBlock m-left" style="width: 10rem;">',
			`<ie-btnselecteur ie-model="modelSelecteurDatePublication" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Le_Maj")}"></ie-btnselecteur>`,
			"</div>",
			"</div>",
		);
		T.push("</div></div>");
		return T.join("");
	}
	surValidation(ANumeroBouton) {
		if (this.moteurPunitions.surValidation(ANumeroBouton)) {
			const lPunition = this.moteurPunitions.punition;
			if (
				!!lPunition &&
				!lPunition.duree &&
				!this.moteurPunitions.estPunitionEnDevoir()
			) {
				const lElementDureeSelectionnee = this.getInstance(
					this.identComboDuree,
				).getSelection();
				if (!!lElementDureeSelectionnee && !!lElementDureeSelectionnee.duree) {
					lPunition.duree = lElementDureeSelectionnee.duree;
				}
			}
			this.callback.appel(ANumeroBouton, this.moteurPunitions.genreRessource);
		}
		this.fermer();
	}
	_actualiserDureeDate() {
		if (this.moteurPunitions.estPunitionEnDevoir()) {
			this.moteurPunitions.punition.date =
				this.moteurPunitions.punition.date ||
				this.moteurPunitions.punition.dateProgrammation ||
				this.date;
			this.getInstance(this.identComboDate).setDonnees(
				this.moteurPunitions.getListeDuree(),
				0,
			);
		} else if (
			this.moteurPunitions.genreRessource ===
			Enumere_Ressource_1.EGenreRessource.Punition
		) {
			const lListeDuree = this.moteurPunitions.getListeDuree();
			const lPunition = this.moteurPunitions.punition;
			let lDureeRecherchee;
			if (lPunition.duree > 0) {
				lDureeRecherchee = lPunition.duree;
			} else if (
				!!lPunition.naturePunition &&
				!!lPunition.naturePunition.dureeParDefaut
			) {
				lDureeRecherchee = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
					lPunition.naturePunition.dureeParDefaut,
				);
			}
			let lIndiceSelection = 0;
			if (!!lDureeRecherchee) {
				for (let i = 0; i < lListeDuree.count(); i++) {
					if (lListeDuree.get(i).duree === lDureeRecherchee) {
						lIndiceSelection = i;
						break;
					}
				}
			}
			this.getInstance(this.identComboDuree).setDonnees(
				this.moteurPunitions.getListeDuree(),
				lIndiceSelection,
			);
		}
	}
	_initialiserComboType(aInstance) {
		aInstance.setAvecTabulation(false);
		aInstance.setOptionsObjetSaisie({
			longueur: 230,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.Accessible_comboType",
			),
		});
	}
	_initialiserComboAccomp(aInstance) {
		aInstance.setAvecTabulation(false);
		aInstance.setOptionsObjetSaisie({
			longueur: 230,
			celluleAvecTexteHtml: true,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.Accessible_comboAccomp",
			),
		});
	}
	_initialiserComboDuree(aInstance) {
		aInstance.setAvecTabulation(false);
		aInstance.setOptionsObjetSaisie({
			longueur: 75,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.Accessible_comboDuree",
			),
		});
	}
	_initialiserComboDate(aInstance) {
		aInstance.setAvecTabulation(false);
		aInstance.setOptionsObjetSaisie({
			longueur: 75,
			forcerBoutonDeploiement: true,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.Accessible_comboDate",
			),
		});
	}
	_initialiserFenetreCalendrier(aInstance) {
		aInstance.setParametres(
			ObjetDate_1.GDate.PremierLundi,
			this.date,
			ObjetDate_1.GDate.derniereDate,
			GParametres.JoursOuvres,
		);
	}
	_initSelecteurPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
			interdireDoublonsLibelle: false,
			libelleSelecteur: ObjetTraduction_1.GTraductions.getValeur(
				"AjouterDesPiecesJointes",
			),
			avecBoutonSupp: true,
			avecCmdAjoutNouvelle: false,
			avecMenuSuppressionPJ: false,
			avecAjoutExistante: true,
			ouvrirFenetreChoixTypesAjout: false,
			maxFiles: 0,
			maxSize: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		});
	}
	_evntSelecteurPJ(aParam) {
		switch (aParam.evnt) {
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.selectionPJ:
				if (this.moteurPunitions.punition) {
					this.listePJ.addElement(aParam.fichier);
					this.moteurPunitions.punition.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.setEtatSaisie(true);
				}
				break;
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
				if (this.moteurPunitions.punition) {
					this.moteurPunitions.punition.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.setEtatSaisie(true);
				}
				break;
			default:
				break;
		}
	}
	_evntSelecteurPJTAF(aParam) {
		switch (aParam.evnt) {
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.selectionPJ:
				if (this.moteurPunitions.punition) {
					this.listePJ.addElement(aParam.fichier);
					this.moteurPunitions.punition.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.setEtatSaisie(true);
				}
				break;
			case ObjetSelecteurPJCP_1.ObjetSelecteurPJCP.genreEvnt.suppressionPJ:
				if (this.moteurPunitions.punition) {
					this.moteurPunitions.punition.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					this.setEtatSaisie(true);
				}
				break;
			default:
				break;
		}
	}
	miseAJourPunition(aListeDonnees) {
		const lPunition = this.moteurPunitions.punition;
		if (lPunition) {
			lPunition.listeMotifs = aListeDonnees;
			if (this.moteurPunitions.enCreation && !lPunition.datePublication) {
				for (let I = 0; I < lPunition.listeMotifs.count(); I++) {
					const lMotif = lPunition.listeMotifs.get(I);
					if (lMotif.publication) {
						this.moteurPunitions.setDatePublication(
							ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
								lPunition.naturePunition,
							),
						);
						break;
					}
				}
			}
		}
	}
}
exports.ObjetFenetre_SaisiePunitions = ObjetFenetre_SaisiePunitions;
