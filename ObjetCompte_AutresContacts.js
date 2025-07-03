exports.ObjetCompte_AutresContacts = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const GestionnaireBloc_1 = require("GestionnaireBloc");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const ObjetChampFormulaire_1 = require("ObjetChampFormulaire");
const ObjetChampFormulaire_2 = require("ObjetChampFormulaire");
const ObjetChampFormulaire_3 = require("ObjetChampFormulaire");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetTri_1 = require("ObjetTri");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DetailsAutreContact_1 = require("ObjetFenetre_DetailsAutreContact");
var EGenreEvntSaisieAutreContact;
(function (EGenreEvntSaisieAutreContact) {
	EGenreEvntSaisieAutreContact[
		(EGenreEvntSaisieAutreContact["suppression"] = 1)
	] = "suppression";
	EGenreEvntSaisieAutreContact[
		(EGenreEvntSaisieAutreContact["validation"] = 2)
	] = "validation";
})(EGenreEvntSaisieAutreContact || (EGenreEvntSaisieAutreContact = {}));
var EGenreErreurFormAutresContacts;
(function (EGenreErreurFormAutresContacts) {
	EGenreErreurFormAutresContacts[
		(EGenreErreurFormAutresContacts["auMoinsUnTel"] = 1)
	] = "auMoinsUnTel";
	EGenreErreurFormAutresContacts[
		(EGenreErreurFormAutresContacts["nomObligatoire"] = 2)
	] = "nomObligatoire";
})(EGenreErreurFormAutresContacts || (EGenreErreurFormAutresContacts = {}));
class ObjetCompte_AutresContacts extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
		this.param = {
			listeAutresContacts: new ObjetListeElements_1.ObjetListeElements(),
			listeLiensParente: new ObjetListeElements_1.ObjetListeElements(),
			listeContactsAutresEnfants: new ObjetListeElements_1.ObjetListeElements(),
		};
		this.idConteneurFiches = this.Nom + "_conteneurFichesContact";
		this.idBoutonRecup = this.Nom + "_btnRecup";
		this.gestionnaireBlocsAutresContacts = new GestionnaireBlocAutresContacts({
			pere: this,
			evenement: this._surEvntGestionnaireAutresContacts,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCreerContact: {
				event() {
					aInstance._evntBtnCreerContact();
				},
			},
			avecBoutonRecupererContact() {
				const lListeContactsRecuperables =
					aInstance._getListeContactsRecuperables();
				return (
					lListeContactsRecuperables && lListeContactsRecuperables.count() > 0
				);
			},
			btnRecupererContact: {
				event() {
					const lElt = this.node;
					aInstance._evntBtnRecupContact({ id: lElt.id });
				},
			},
			btnSupprimer: {
				event(aIndice) {
					const lListe = aInstance.param.listeAutresContacts;
					const lElt = lListe.get(aIndice);
					const lMsgConfirmSuppression =
						ObjetTraduction_1.GTraductions.getValeur(
							"InfosEnfantPrim.autresContacts.msgConfirmSuppression",
						);
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lMsgConfirmSuppression,
						callback: function (aGenreAction) {
							aInstance._evntSuppressionContactElt(lElt, aGenreAction);
						},
					});
				},
			},
			btnDetails: {
				event(aIndice) {
					const lListe = aInstance.param.listeAutresContacts;
					const lElt = lListe.get(aIndice);
					const lCopie = lElt;
					if (aInstance.fenetreDatailAutreContact) {
						aInstance.fenetreDatailAutreContact.fermer();
					}
					aInstance.fenetreDatailAutreContact =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_DetailsAutreContact_1.ObjetFenetre_DetailsAutreContact,
							{
								pere: this,
								initialiser: function (aInstanceFenetre) {
									aInstanceFenetre.setOptionsFenetre({
										titre: lElt.getLibelle(),
										largeur: 500,
									});
								},
							},
						);
					aInstance.fenetreDatailAutreContact.setDonnees(
						aInstance._composeBlocContact(lCopie),
					);
					aInstance.gestionnaireBlocsAutresContacts.refreshInstance(
						lElt.indiceInstanceMetier,
					);
					aInstance.fenetreDatailAutreContact.afficher();
				},
			},
		});
	}
	avecContactVideUniquement() {
		let lResult = false;
		const lNbrElement = this.param.listeAutresContacts.count();
		if (lNbrElement > 0) {
			const lElt = this.param.listeAutresContacts.get(lNbrElement - 1);
			lResult = this.estEltAutreContactVide(lElt);
		}
		return lResult;
	}
	setDonnees(aParam) {
		$.extend(true, this.param, aParam);
		const lEltAucun = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("Aucun"),
			0,
			null,
			0,
		);
		this.param.listeLiensParente.insererElement(lEltAucun, 0);
		this.gestionnaireBlocsAutresContacts.setOptions({
			listeLiensParente: this.param.listeLiensParente,
		});
		this.donneesRecues = true;
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage(), {
			controleur: this.controleur,
		});
		this.gestionnaireBlocsAutresContacts.refresh();
	}
	construireAffichage() {
		return this._compose();
	}
	getTitre() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"InfosEnfantPrim.autresContacts.titreRubrique",
		);
	}
	_surEvntGestionnaireAutresContacts(aElt, aGenreEvnt) {
		switch (aGenreEvnt) {
			case EGenreEvntSaisieAutreContact.suppression:
				this._supprimerContact(aElt, { avecFicheVideParDefaut: true });
				break;
			case EGenreEvntSaisieAutreContact.validation:
				this._validerContact(aElt);
				this.fenetreDatailAutreContact.fermer();
				break;
		}
	}
	_getListeContactsRecuperables() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		const lNbr = this.param.listeContactsAutresEnfants.count();
		for (let i = 0; i < lNbr; i++) {
			const lElt = this.param.listeContactsAutresEnfants.get(i);
			const lIndice = this.param.listeAutresContacts.getIndiceElementParFiltre(
				(D) => {
					return lElt.getNumero() === D.getNumero();
				},
			);
			if (lIndice === -1) {
				lListe.addElement(lElt);
			}
		}
		lListe.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lListe.trier();
		return lListe;
	}
	_compose() {
		if (this.donneesRecues) {
			return this._composeAutresContacts();
		} else {
			return "";
		}
	}
	_composeAutresContacts() {
		const H = [];
		const lListe = this.param.listeAutresContacts;
		H.push(
			'<div id="',
			this.idConteneurFiches,
			'" class="FlexContainer_AutresContacts">',
		);
		let lElt;
		if (!this.avecContactVideUniquement()) {
			for (let i = 0, lNbr = lListe.count(); i < lNbr; i++) {
				lElt = lListe.get(i);
				H.push(`<div tabindex="0" class="contact-line">`);
				const lStrLienParente = lElt.lienParente
					? lElt.lienParente.getLibelle()
					: "";
				H.push('<div class="fluid-bloc contact-contain icon_uniF2BD">');
				H.push('<div class="fluid-bloc flex-contain cols">');
				H.push('<div class="name">', lElt.getLibelle());
				if (lStrLienParente) {
					H.push(" <span>(", lStrLienParente, ")</span>");
				}
				H.push("</div>");
				H.push('<div class="tel">', lElt.telMobile, "</div>");
				H.push("</div>");
				H.push("</div>");
				H.push('<div class="flex-contain flex-center fix-bloc flex-gap">');
				H.push(
					'  <ie-bouton ie-model="btnDetails(',
					i,
					')" title="',
					ObjetTraduction_1.GTraductions.getValeur("PageCompte.Details"),
					'">',
					ObjetTraduction_1.GTraductions.getValeur("PageCompte.Details"),
					"</ie-bouton>",
				);
				H.push(
					'  <ie-btnicon ie-model="btnSupprimer(',
					i,
					')" class="avecFond icon_trash" title="',
					ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					'"></ie-btnicon>',
				);
				H.push("  </div>");
				H.push("</div>");
			}
		}
		H.push(
			'<div class="flex-contain flex-center flex-wrap flex-gap justify-end m-top-l">',
		);
		H.push(
			'<ie-bouton ie-model="btnCreerContact" ie-icon="icon_user" class="themeBoutonNeutre">',
			ObjetTraduction_1.GTraductions.getValeur(
				"InfosEnfantPrim.autresContacts.ajouterContact",
			),
			"</ie-bouton>",
		);
		H.push(
			'<ie-bouton ie-if="avecBoutonRecupererContact" id="',
			this.idBoutonRecup,
			'" ie-model="btnRecupererContact" ie-icon="icon_copier_liste" class="themeBoutonNeutre m-left-l">',
			ObjetTraduction_1.GTraductions.getValeur(
				"InfosEnfantPrim.autresContacts.recupererContact",
			),
			"</ie-bouton>",
		);
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_composeBlocContact(aElt) {
		const H = [];
		const lBloc = this.gestionnaireBlocsAutresContacts.composeBloc(aElt);
		H.push('<div class="FlexItem_AutresContacts">');
		H.push(lBloc.html);
		H.push("</div>");
		return { html: H.join(""), controleur: lBloc.controleur };
	}
	_ajouterFichePourElt(aElt) {
		this.param.listeAutresContacts.addElement(aElt);
		const lNewBloc = this._composeBlocContact(aElt);
		if (this.fenetreDatailAutreContact) {
			this.fenetreDatailAutreContact.fermer();
		}
		this.fenetreDatailAutreContact =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_DetailsAutreContact_1.ObjetFenetre_DetailsAutreContact,
				{
					pere: this,
					initialiser: function (aInstanceFenetre) {
						aInstanceFenetre.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"InfosEnfantPrim.autresContacts.ajouterContact",
							),
							largeur: 500,
						});
					},
				},
			);
		this.fenetreDatailAutreContact.setDonnees(lNewBloc);
		this.gestionnaireBlocsAutresContacts.refreshInstance(
			aElt.indiceInstanceMetier,
		);
		this.fenetreDatailAutreContact.afficher();
	}
	_evntBtnCreerContact() {
		const lElt = this.getEltAutreContactVide();
		this._ajouterFichePourElt(lElt);
	}
	_evntBtnRecupContact(aParam) {
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			initCommandes: (aMenu) => {
				const lListeContactsRecuperables = this._getListeContactsRecuperables();
				if (lListeContactsRecuperables) {
					lListeContactsRecuperables.parcourir((D) => {
						aMenu.add(D.getLibelle(), true, () => {
							if (this.avecContactVideUniquement()) {
								const lEltFicheVide = this.param.listeAutresContacts.get(0);
								lEltFicheVide.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								this._supprimerContact(lEltFicheVide, {
									avecFicheVideParDefaut: false,
								});
							}
							this._ajouterFichePourElt(D);
						});
					});
				}
			},
			id: {
				x: ObjetPosition_1.GPosition.getLeft(aParam.id),
				y: IE.estMobile
					? ObjetPosition_1.GPosition.getTop(aParam.id)
					: ObjetPosition_1.GPosition.getTop(aParam.id) +
						ObjetPosition_1.GPosition.getHeight(aParam.id) +
						2,
			},
		});
	}
	getEltAutreContactVide() {
		const lContactVide = new ObjetElement_1.ObjetElement();
		lContactVide.nom = "";
		lContactVide.prenom = "";
		lContactVide.indMobile = "";
		lContactVide.indDomicile = "";
		lContactVide.indTravail = "";
		lContactVide.telMobile = "";
		lContactVide.telDomicile = "";
		lContactVide.telTravail = "";
		lContactVide.appelSiUrgent = true;
		lContactVide.autoriseARecuperer = true;
		lContactVide.lienParente =
			this.param.listeLiensParente.getElementParNumero(0);
		lContactVide.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lContactVide;
	}
	estEltAutreContactVide(aElt) {
		return (
			aElt.getEtat() === Enumere_Etat_1.EGenreEtat.Creation &&
			aElt.nom === "" &&
			aElt.prenom === "" &&
			aElt.indMobile === "" &&
			aElt.indDomicile === "" &&
			aElt.indTravail === "" &&
			aElt.telMobile === "" &&
			aElt.telDomicile === "" &&
			aElt.telTravail === "" &&
			aElt.appelSiUrgent === true &&
			aElt.autoriseARecuperer === true &&
			aElt.lienParente &&
			aElt.lienParente.getNumero() === 0
		);
	}
	_supprimerContact(aElt, aParam) {
		const lIndiceInstance = aElt.indiceInstanceMetier;
		const lNomZone =
			this.gestionnaireBlocsAutresContacts.reInitInstance(lIndiceInstance);
		$("#" + lNomZone.escapeJQ())
			.parent()
			.removeClass("FlexItem_AutresContacts");
		const lIndice = this.param.listeAutresContacts.getIndiceParElement(aElt);
		if (lIndice >= 0 && MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
			this.param.listeAutresContacts.remove(lIndice);
		}
		if (
			aParam.avecFicheVideParDefaut === true &&
			this.param.listeAutresContacts.count() === 0
		) {
			this._evntBtnCreerContact();
		}
		if (aElt.pourValidation()) {
			const lListeSaisie = new ObjetListeElements_1.ObjetListeElements();
			lListeSaisie.addElement(aElt);
			this.callback.appel({ listeSaisie: lListeSaisie });
		}
	}
	_validerContact(aElt) {
		const lListeSaisie = new ObjetListeElements_1.ObjetListeElements();
		lListeSaisie.addElement(aElt);
		this.callback.appel({ listeSaisie: lListeSaisie });
	}
	_evntSuppressionContactElt(aElt, aGenreAction) {
		if (aGenreAction !== Enumere_Action_1.EGenreAction.Valider) {
			return;
		}
		if (aElt.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
			aElt.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			const lListeSaisie = new ObjetListeElements_1.ObjetListeElements();
			lListeSaisie.addElement(aElt);
			this.callback.appel({
				listeSaisie: lListeSaisie,
				genreEvnt: EGenreEvntSaisieAutreContact.suppression,
			});
		}
	}
}
exports.ObjetCompte_AutresContacts = ObjetCompte_AutresContacts;
class GestionnaireBlocAutresContacts extends GestionnaireBloc_1.GestionnaireBlocDeBase {
	composeBloc(aDataBloc) {
		this.instanceMetier = this.getInstanceObjetMetier(
			aDataBloc,
			ObjetSaisieAutreContact,
		);
		return {
			html: this.composeZoneInstance(this.instanceMetier),
			controleur: this.instanceMetier.controleur,
		};
	}
}
class ObjetSaisieAutreContact extends GestionnaireBlocPN_1.ObjetBlocPN {
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbAppelerSiUrgent: {
				getValue: function () {
					return !!aInstance.donnee && !!aInstance.donnee.appelSiUrgent;
				},
				setValue: function (aValeur) {
					if (!!aInstance.donnee) {
						aInstance.donnee.appelSiUrgent = aValeur;
						aInstance.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			cbAutoriserARecuperer: {
				getValue: function () {
					return !!aInstance.donnee && !!aInstance.donnee.autoriseARecuperer;
				},
				setValue: function (aValeur) {
					if (!!aInstance.donnee) {
						aInstance.donnee.autoriseARecuperer = aValeur;
						aInstance.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			btnValiderFen: {
				event: function () {
					const lValidation = aInstance.validerDonneesCorrectes();
					if (lValidation.succes) {
						aInstance._evntValiderContact();
					} else {
						aInstance._surErreurValidation(lValidation);
					}
				},
				getDisabled: function () {
					const lValidation = aInstance.validerDonneesCorrectes();
					return !lValidation.succes;
				},
			},
			btnSupprimer: {
				event: function () {
					const lMsgConfirmSuppression =
						ObjetTraduction_1.GTraductions.getValeur(
							"InfosEnfantPrim.autresContacts.msgConfirmSuppression",
						);
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: lMsgConfirmSuppression,
						callback: function (aGenreAction) {
							aInstance._evntSuppressionContact(aGenreAction);
						},
					});
				},
			},
		});
	}
	setParametres(aElement, aOptions) {
		super.setParametres(aElement, aOptions);
		this.options = aOptions;
	}
	construireInstances() {
		this.identNom = this.add(
			ObjetChampFormulaire_1.ObjetChampFormulaire,
			this._evntNom.bind(this),
			this._initChmpTexte.bind(this, {
				label: {
					str: ObjetTraduction_1.GTraductions.getValeur(
						"InfosEnfantPrim.autresContacts.nom",
					),
				},
			}),
		);
		this.identPrenom = this.add(
			ObjetChampFormulaire_1.ObjetChampFormulaire,
			this._evntPrenom.bind(this),
			this._initChmpTexte.bind(this, {
				label: {
					str: ObjetTraduction_1.GTraductions.getValeur(
						"InfosEnfantPrim.autresContacts.prenom",
					),
				},
			}),
		);
		this.identLienParente = this.add(
			ObjetChampFormulaire_1.ObjetChampFormulaire,
			this._evntLienParente.bind(this),
			this._initChmpCombo.bind(this, {
				label: {
					str: ObjetTraduction_1.GTraductions.getValeur(
						"InfosEnfantPrim.autresContacts.parente",
					),
				},
			}),
		);
		this.identTelDom = this.add(
			ObjetChampFormulaire_1.ObjetChampFormulaire,
			this._evntTel.bind(this, ObjetChampFormulaire_3.EGenreTypeTel.domicile),
			this._initChmpTel.bind(this, {
				typeTel: ObjetChampFormulaire_3.EGenreTypeTel.domicile,
			}),
		);
		this.identTelMob = this.add(
			ObjetChampFormulaire_1.ObjetChampFormulaire,
			this._evntTel.bind(this, ObjetChampFormulaire_3.EGenreTypeTel.mobile),
			this._initChmpTel.bind(this, {
				typeTel: ObjetChampFormulaire_3.EGenreTypeTel.mobile,
			}),
		);
		this.identTelPro = this.add(
			ObjetChampFormulaire_1.ObjetChampFormulaire,
			this._evntTel.bind(
				this,
				ObjetChampFormulaire_3.EGenreTypeTel.professionnel,
			),
			this._initChmpTel.bind(this, {
				typeTel: ObjetChampFormulaire_3.EGenreTypeTel.professionnel,
			}),
		);
	}
	construireStructureAffichage() {
		const H = [];
		if (this.donneesRecues) {
			H.push('<div class="SaisieContact_Fiche">');
			H.push(
				'<div class="switch-contain" onclick="event.stopPropagation();">',
				'<ie-switch ie-model="cbAppelerSiUrgent">',
				ObjetTraduction_1.GTraductions.getValeur(
					"InfosEnfantPrim.autresContacts.cbAAppeler",
				),
				"</ie-switch>",
				"</div>",
			);
			H.push(
				'<div class="switch-contain" onclick="event.stopPropagation();">',
				'<ie-switch ie-model="cbAutoriserARecuperer">',
				ObjetTraduction_1.GTraductions.getValeur(
					"InfosEnfantPrim.autresContacts.cbAutoriseARecuperer",
				),
				"</ie-switch>",
				"</div>",
			);
			H.push(
				'<div class="champ-contact" id="',
				this.getNomInstance(this.identNom),
				'"></div>',
			);
			H.push(
				'<div class="champ-contact" id="',
				this.getNomInstance(this.identPrenom),
				'"></div>',
			);
			H.push(
				'<div class="champ-contact" id="',
				this.getNomInstance(this.identLienParente),
				'"></div>',
			);
			H.push(
				'<div class="message-tel">',
				ObjetTraduction_1.GTraductions.getValeur(
					"InfosEnfantPrim.autresContacts.infoTelObligatoire",
				),
				"</div>",
			);
			H.push(
				'<div class="champ-contact" id="',
				this.getNomInstance(this.identTelMob),
				'"></div>',
			);
			H.push(
				'<div class="champ-contact" id="',
				this.getNomInstance(this.identTelDom),
				'"></div>',
			);
			H.push(
				'<div class="champ-contact" id="',
				this.getNomInstance(this.identTelPro),
				'"></div>',
			);
			H.push('<div class="GrandEspaceHaut FlexItem_BtnContact">');
			H.push(
				'<ie-bouton ie-model="btnValiderFen" class="' +
					Type_ThemeBouton_1.TypeThemeBouton.primaire +
					'">',
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
				"</ie-bouton>",
			);
			H.push("</div>");
			H.push("</div>");
		}
		return H.join("");
	}
	recupererDonnees() {
		if (this.donneesRecues === true) {
			this.getInstance(this.identNom).setDonnees({ valeur: this.donnee.nom });
			this.getInstance(this.identPrenom).setDonnees({
				valeur: this.donnee.prenom,
			});
			this.getInstance(this.identLienParente).setDonnees({
				liste: this.options.listeLiensParente,
				selection: this.donnee.lienParente,
			});
			this.getInstance(this.identTelDom).setDonnees({
				valeur: { ind: this.donnee.indDomicile, tel: this.donnee.telDomicile },
			});
			this.getInstance(this.identTelMob).setDonnees({
				valeur: { ind: this.donnee.indMobile, tel: this.donnee.telMobile },
			});
			this.getInstance(this.identTelPro).setDonnees({
				valeur: { ind: this.donnee.indTravail, tel: this.donnee.telTravail },
			});
		}
	}
	_evntSurSaisieChampTel() {
		const lChmpTel = this.getInstance(this.identTelMob);
		const lResult = this.validerAuMoinsUnTel();
		if (lResult.succes) {
			lChmpTel.setMsgErreur({ msg: "" });
		} else {
			this._surErreurValidation(lResult);
		}
	}
	_evntSurSaisieChampNom() {
		const lChmp = this.getInstance(this.identNom);
		if (lChmp.avecMsgErreur()) {
			const lResult = this.validerNom();
			if (lResult.succes) {
				lChmp.setMsgErreur({ msg: "" });
			}
		}
	}
	_initChmpTexte(aParam, aInstance) {
		const lParam = $.extend(
			true,
			{
				typeChamp: ObjetChampFormulaire_2.EGenreTypeChampForm.texte,
				maxLength: 100,
				estOptionnel: false,
				label: { avecOption: true },
			},
			aParam,
		);
		aInstance.setParametres(lParam);
	}
	_initChmpCombo(aParam, aInstance) {
		const lParam = $.extend(
			true,
			{
				typeChamp: ObjetChampFormulaire_2.EGenreTypeChampForm.combo,
				estOptionnel: false,
				maxLength: 100,
				label: { avecOption: true },
			},
			aParam,
		);
		aInstance.setParametres(lParam);
	}
	_initChmpTel(aParam, aInstance) {
		const lParam = $.extend(
			true,
			{
				typeChamp: ObjetChampFormulaire_2.EGenreTypeChampForm.tel,
				placeholder: { avecOption: true, str: "TODO Optionnel" },
			},
			aParam,
		);
		aInstance.setParametres(lParam);
	}
	_evntNom(aParam) {
		this.donnee.nom = aParam.valeur;
		this.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this._evntSurSaisieChampNom();
	}
	_evntPrenom(aParam) {
		this.donnee.prenom = aParam.valeur;
		this.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_evntLienParente(aParam) {
		this.donnee.lienParente = aParam.valeur;
	}
	_evntTel(aGenreTel, aParam) {
		switch (aGenreTel) {
			case ObjetChampFormulaire_3.EGenreTypeTel.domicile:
				this.donnee.indDomicile = aParam.valeur.ind;
				this.donnee.telDomicile = aParam.valeur.tel;
				break;
			case ObjetChampFormulaire_3.EGenreTypeTel.mobile:
				this.donnee.indMobile = aParam.valeur.ind;
				this.donnee.telMobile = aParam.valeur.tel;
				break;
			case ObjetChampFormulaire_3.EGenreTypeTel.professionnel:
				this.donnee.indTravail = aParam.valeur.ind;
				this.donnee.telTravail = aParam.valeur.tel;
				break;
		}
		this.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this._evntSurSaisieChampTel();
	}
	_evntValiderContact() {
		this.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.callback.appel({
			donnee: this.donnee,
			genreEvnt: EGenreEvntSaisieAutreContact.validation,
		});
	}
	_evntSuppressionContact(aGenreAction) {
		if (aGenreAction !== Enumere_Action_1.EGenreAction.Valider) {
			return;
		}
		if (this.donnee.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
			this.donnee.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.callback.appel({
				donnee: this.donnee,
				genreEvnt: EGenreEvntSaisieAutreContact.suppression,
			});
		}
	}
	validerDonneesCorrectes() {
		let lResult = { succes: false, genreErreur: null };
		lResult = this.validerNom();
		if (lResult.succes === true) {
			lResult = this.validerAuMoinsUnTel();
		}
		return lResult;
	}
	validerAuMoinsUnTel() {
		let lTypeErreur = null;
		const lSucces =
			this.donnee.telDomicile !== "" ||
			this.donnee.telMobile !== "" ||
			this.donnee.telTravail !== "";
		if (!lSucces) {
			lTypeErreur = EGenreErreurFormAutresContacts.auMoinsUnTel;
		}
		return { succes: lSucces, genreErreur: lTypeErreur };
	}
	validerNom() {
		let lTypeErreur = null;
		const lSucces = this.donnee.nom !== "";
		if (!lSucces) {
			lTypeErreur = EGenreErreurFormAutresContacts.nomObligatoire;
		}
		return { succes: lSucces, genreErreur: lTypeErreur };
	}
	_surErreurValidation(aParam) {
		switch (aParam.genreErreur) {
			case EGenreErreurFormAutresContacts.auMoinsUnTel:
				this.getInstance(this.identTelMob).setMsgErreur({
					msg: ObjetTraduction_1.GTraductions.getValeur(
						"InfosEnfantPrim.autresContacts.msgAuMoinsUnTel",
					),
				});
				break;
			case EGenreErreurFormAutresContacts.nomObligatoire:
				this.getInstance(this.identNom).setMsgErreur({
					msg: ObjetTraduction_1.GTraductions.getValeur(
						"InfosEnfantPrim.autresContacts.msgNomObligatoire",
					),
				});
				break;
			default:
				break;
		}
	}
}
