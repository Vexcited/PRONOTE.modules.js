exports.ObjetDetailCommission = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTri_1 = require("ObjetTri");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetRequeteSaisieCommission = require("ObjetRequeteSaisieCommission");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const TypeGenreIndividuAuteur_1 = require("TypeGenreIndividuAuteur");
class ObjetDetailCommission extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.commission = null;
		this.estContexteParent =
			GEtatUtilisateur.getUtilisateur().getGenre() ===
			Enumere_Ressource_1.EGenreRessource.Responsable;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getTitleMembre(aGenre) {
				return aInstance.estContexteParent
					? ""
					: aInstance.commission.listeMembres
							.getTableauLibelles(aGenre)
							.join(", ");
			},
			getIdentListe() {
				return {
					class: ObjetListe_1.ObjetListe,
					pere: aInstance,
					init(aInstanceListe) {
						aInstanceListe.setOptionsListe({
							colonnes: [{ taille: "100%" }],
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
							messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
								"Commissions.aucuneResponseEducative",
							),
							forcerOmbreScrollTop: true,
							hauteurAdapteContenu: true,
						});
						aInstance.identListe = aInstanceListe;
					},
					start(aInstanceListe) {
						if (aInstance.commission) {
							const lListe = new ObjetListeElements_1.ObjetListeElements();
							aInstance.commission.listeReponsesEducatives.parcourir(
								(aReponse) => {
									aReponse.estUnDeploiement = true;
									aReponse.estDeploye = true;
									lListe.add(aReponse);
									aReponse.listeSuivisReponseEducative.setTri([
										ObjetTri_1.ObjetTri.init("date"),
										ObjetTri_1.ObjetTri.init("Libelle"),
									]);
									aReponse.listeSuivisReponseEducative.trier();
									aReponse.listeSuivisReponseEducative.parcourir((aSuivi) => {
										aSuivi.pere = aReponse;
										lListe.add(aSuivi);
									});
								},
							);
							aInstanceListe.setDonnees(
								new DonneesListe_ReponsesEducatives(lListe, {
									estContexteParent: aInstance.estContexteParent,
									callbackCreerSuivi: (aParams) => {
										aInstance.afficherFenetreSuivi({
											reponseEduc: aParams.reponseEduc,
										});
									},
									callbackModifierSuivi: (aParams) => {
										aInstance.afficherFenetreSuivi({ suivi: aParams.article });
									},
									callbackSuprimerSuivi: (aParams) => {
										aParams.article.setEtat(
											Enumere_Etat_1.EGenreEtat.Suppression,
										);
										new ObjetRequeteSaisieCommission(
											aInstance,
											aInstance.actionApresRequete,
										).lancerRequete({ suivi: aParams.article });
									},
								}),
							);
						}
					},
					evenement(aParams) {
						switch (aParams.genreEvenement) {
							case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
							case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
								aInstance.afficherFenetreSuivi({ suivi: aParams.article });
								break;
						}
					},
					destroy() {
						if (aInstance.identListe) {
							aInstance.identListe.free();
							aInstance.identListe = null;
						}
					},
				};
			},
		});
	}
	construireAffichage() {
		if (!this.commission) {
			return `<div class="Gras AlignementMilieu GrandEspaceHaut">${ObjetTraduction_1.GTraductions.getValeur("Commissions.selectionnezCommission")}</div>`;
		}
		const H = [];
		H.push(`<h4 class="ie-titre">${this.commission.nature.getLibelle()}</h4>`);
		H.push(
			`<p class="m-top ie-titre-petit theme_color_foncee">${ObjetTraduction_1.GTraductions.getValeur("Commissions.commissionDate", [ObjetDate_1.GDate.formatDate(this.commission.dateDebut, `%JJJ %JJ %MMM`), ObjetDate_1.GDate.formatDate(this.commission.dateDebut, `%hh%sh%mm`), ObjetDate_1.GDate.formatDate(this.commission.dateFin, `%hh%sh%mm`)])}${this.commission.lieu ? " " + ObjetTraduction_1.GTraductions.getValeur("Commissions.aLAdresse", [this.commission.lieu.getLibelle()]) : ""}</p>`,
		);
		H.push(
			`<p class="m-top-l ie-titre-petit">${ObjetTraduction_1.GTraductions.getValeur("Commissions.presideePar")} ${this.commission.president.getLibelle()}</p>`,
		);
		H.push(
			`<article class="flex-contain m-top-l">`,
			`<div class="ie-titre-petit" style="white-space:nowrap;">${ObjetTraduction_1.GTraductions.getValeur("Commissions.motifs")} :</div>`,
			`<div class="m-left">`,
			`<p class="ie-titre-petit theme_color_foncee">${this.commission.listeMotifs.getTableauLibelles().join(", ")}</p>`,
			this.commission.circonstance
				? `<p class="m-top-l">${ObjetChaine_1.GChaine.replaceRCToHTML(this.commission.circonstance)}</p>`
				: "",
			this.commission.listePJ.count()
				? `<p class="m-top-l">${UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(this.commission.listePJ)}</p>`
				: "",
			`</div>`,
			`</article>`,
		);
		H.push(
			`<p class="m-top-l"><span class="ie-titre-petit">${ObjetTraduction_1.GTraductions.getValeur("Commissions.membres")} : </span>`,
			`<span class="ie-titre-petit theme_color_foncee">`,
			`<span ie-title="getTitleMembre(${Enumere_Ressource_1.EGenreRessource.Enseignant})">${this.commission.nbrMembreProf} ${ObjetTraduction_1.GTraductions.getValeur("Professeurs")}</span>`,
			` - <span ie-title="getTitleMembre(${Enumere_Ressource_1.EGenreRessource.Personnel})">${this.commission.nbrMembrePersonnel} ${ObjetTraduction_1.GTraductions.getValeur("Personnels")}</span>`,
			` - <span ie-title="getTitleMembre(${Enumere_Ressource_1.EGenreRessource.Responsable})">${this.commission.nbrMembreParent} ${ObjetTraduction_1.GTraductions.getValeur("Responsables")}</span>`,
			` - <span ie-title="getTitleMembre(${Enumere_Ressource_1.EGenreRessource.Eleve})">${this.commission.nbrMembreEleve} ${ObjetTraduction_1.GTraductions.getValeur("Eleves")}</span>`,
			`</span></p>`,
		);
		H.push(
			`<h4 class="m-top-xxl ie-titre">${ObjetTraduction_1.GTraductions.getValeur("Commissions.reponsesEducatives")}</h4>`,
		);
		H.push(`<div ie-identite="getIdentListe" class="full-size m-top-l"></div>`);
		return H.join("");
	}
	setDonnees(aCommission) {
		this.commission = aCommission;
		this.afficher(this.construireAffichage());
	}
	afficherFenetreSuivi(aParams) {
		const lFenetreSuiviReponseEduc =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SuiviReponseEduc,
				{
					pere: this,
					evenement: (aSuivi) => {
						if (aSuivi.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
							if (aParams.reponseEduc) {
								aSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
								aSuivi.pere = aParams.reponseEduc;
							} else {
								aSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							}
						}
						new ObjetRequeteSaisieCommission(this, this.actionApresRequete)
							.addUpload({ listeFichiers: aSuivi.listePJ })
							.lancerRequete({ suivi: aSuivi });
					},
				},
			);
		lFenetreSuiviReponseEduc.setDonnees(aParams.suivi);
	}
	actionApresRequete() {
		this.callback.appel();
	}
}
exports.ObjetDetailCommission = ObjetDetailCommission;
class DonneesListe_ReponsesEducatives extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.estContexteParent = aParams.estContexteParent;
		this.callbackCreerSuivi = aParams.callbackCreerSuivi;
		this.callbackModifierSuivi = aParams.callbackModifierSuivi;
		this.callbackSuprimerSuivi = aParams.callbackSuprimerSuivi;
		this.setOptions({ avecTri: false, avecEllipsis: false });
	}
	getControleur(aDonneesListe, aInstanceListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aInstanceListe), {
			AjoutSuivi: {
				event(aNumeroArticle) {
					aDonneesListe.callbackCreerSuivi({
						reponseEduc:
							aDonneesListe.Donnees.getElementParNumero(aNumeroArticle),
					});
				},
			},
		});
	}
	avecSelection(aParams) {
		return this.estSuiviEditable(aParams);
	}
	avecEvenementSelectionClick(aParams) {
		return this.estSuiviEditable(aParams);
	}
	avecBoutonActionLigne(aParams) {
		return this.estSuiviEditable(aParams);
	}
	initialisationObjetContextuel(aParams) {
		if (!aParams.menuContextuel) {
			return;
		}
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Commissions.modifierLeSuivi"),
			true,
			() => {
				this.callbackModifierSuivi(aParams);
			},
			{ icon: "icon_pencil" },
		);
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Commissions.supprimerLeSuivi"),
			true,
			() => {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"Commissions.confirmezSuppressionSuivi",
					),
					callback: (aAction) => {
						if (aAction === Enumere_Action_1.EGenreAction.Valider) {
							this.callbackSuprimerSuivi(aParams);
						}
					},
				});
			},
			{ icon: "icon_trash" },
		);
		aParams.menuContextuel.setDonnees();
	}
	getZoneGauche(aParams) {
		if (!aParams.article.estUnDeploiement) {
			return IE.jsx.str(
				"time",
				{
					class: "date-contain",
					datetime: ObjetDate_1.GDate.formatDate(
						aParams.article.date,
						"%MM-%JJ",
					),
				},
				ObjetDate_1.GDate.formatDate(aParams.article.date, "%JJ %MMM"),
			);
		}
		return "";
	}
	getTitreZonePrincipale(aParams) {
		return ObjetChaine_1.GChaine.replaceRCToHTML(aParams.article.getLibelle());
	}
	getInfosSuppZonePrincipale(aParams) {
		if (!aParams.article.estUnDeploiement) {
			return aParams.article.auteur.getLibelle();
		} else if (!this.estContexteParent) {
			const lStrIndividus = aParams.article.listeSuiviPar
				.getTableauLibelles()
				.join(", ");
			return aParams.article.listeSuiviPar.count() < 4
				? lStrIndividus
				: `<span title="${lStrIndividus}">${ObjetTraduction_1.GTraductions.getValeur("Commissions.suiviPar", [aParams.article.listeSuiviPar.count()])}</span>`;
		}
		return "";
	}
	getZoneMessage(aParams) {
		const H = [];
		if (
			aParams.article.estUnDeploiement &&
			aParams.article.avecPublicationParent &&
			!this.estContexteParent
		) {
			H.push(
				`<div class="m-top">${ObjetTraduction_1.GTraductions.getValeur("Commissions.publieePourParents")}</div>`,
			);
		}
		if (aParams.article.listePJ && aParams.article.listePJ.count()) {
			H.push(
				`<div class="m-top-l">${UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(aParams.article.listePJ)}</div>`,
			);
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		if (!aParams.article.estUnDeploiement) {
			if (aParams.article.avecPublicationParent && !this.estContexteParent) {
				return `<i class="icon_info_sondage_publier mix-icon_ok i-as-deco" title="${ObjetTraduction_1.GTraductions.getValeur("Commissions.publiePourParents")}"></i>`;
			}
		} else if (
			!this.estContexteParent &&
			aParams.article.listeSuiviPar.getElementParNumero(
				GEtatUtilisateur.getUtilisateur().getNumero(),
			)
		) {
			return `<ie-btnicon class="bt-activable bt-big icon_plus_fin" ie-model="AjoutSuivi('${aParams.article.getNumero()}')" title="${ObjetTraduction_1.GTraductions.getValeur("Commissions.ajouterSuivi")}"></ie-btnicon>`;
		}
		return "";
	}
	estSuiviEditable(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			!this.estContexteParent &&
			aParams.article.pere &&
			aParams.article.pere.listeSuiviPar.getElementParNumero(
				GEtatUtilisateur.getUtilisateur().getNumero(),
			)
		);
	}
}
class ObjetFenetre_SuiviReponseEduc extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.setOptionsFenetre({
			largeur: 500,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					valider: true,
				},
			],
		});
		this.estEnCreation = false;
		this.idLabelAuteur = this.Nom + "_labelAuteur";
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentiteDate() {
				return {
					class: ObjetCelluleDate_1.ObjetCelluleDate,
					pere: aInstance,
					init(aInstanceDate) {
						aInstanceDate.setOptionsObjetCelluleDate({
							ariaDescription: ObjetTraduction_1.GTraductions.getValeur("Date"),
						});
					},
					start(aInstanceDate) {
						aInstanceDate.setDonnees(aInstance.donnees.date);
					},
					evenement(aDate) {
						aInstance.donnees.date = aDate;
					},
				};
			},
			btnAuteur: {
				getLibelle() {
					return aInstance.donnees.auteur
						? aInstance.donnees.auteur.getLibelle()
						: "";
				},
				getDisabled() {
					return true;
				},
			},
			txtSuivi: {
				getValue() {
					return aInstance.donnees.getLibelle();
				},
				setValue(aValue) {
					aInstance.donnees.setLibelle(aValue);
				},
			},
			getListePJ() {
				return {
					class: ObjetSelecteurPJ_1.ObjetSelecteurPJ,
					pere: aInstance,
					init(aInstanceSelecteur) {
						aInstanceSelecteur.setOptions({
							title: ObjetTraduction_1.GTraductions.getValeur(
								"AjouterDesPiecesJointes",
							),
							libelleSelecteur: ObjetTraduction_1.GTraductions.getValeur(
								"AjouterDesPiecesJointes",
							),
							avecMenuContextuel: false,
							avecEtatSaisie: false,
							maxFiles: 0,
							maxSize: aInstance.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
							),
							avecBoutonSupp: true,
						});
					},
					start(aInstanceSelecteur) {
						aInstanceSelecteur.setDonnees({
							listePJ: aInstance.donnees.listePJ,
							listeTotale: new ObjetListeElements_1.ObjetListeElements(),
						});
					},
					evenement(aListePJ) {
						aInstance.donnees.listePJ.add(aListePJ);
					},
				};
			},
			cbPublication: {
				getValue() {
					return !!aInstance.donnees.avecPublicationParent;
				},
				setValue(aValue) {
					aInstance.donnees.avecPublicationParent = aValue;
				},
			},
			btnSupprimer: {
				event() {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"Commissions.confirmezSuppressionSuivi",
						),
						callback: (aAction) => {
							if (aAction === Enumere_Action_1.EGenreAction.Valider) {
								aInstance.donnees.setEtat(
									Enumere_Etat_1.EGenreEtat.Suppression,
								);
								aInstance.surValidation(1);
							}
						},
					});
				},
			},
			getBtnSuppr() {
				return !aInstance.estEnCreation;
			},
		});
	}
	initDonnees() {
		this.donnees.date = ObjetDate_1.GDate.getDateCourante(true);
		this.donnees.auteur = GEtatUtilisateur.getUtilisateur();
		this.donnees.auteur.Genre =
			this.donnees.auteur.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.Enseignant
				? TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Professeur
				: TypeGenreIndividuAuteur_1.TypeGenreIndividuAuteur.GIA_Personnel;
		this.donnees.listePJ = new ObjetListeElements_1.ObjetListeElements();
		this.donnees.avecPublicationParent = false;
		this.donnees.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
	}
	composeContenu() {
		if (!this.donnees) {
			return "";
		}
		const H = [];
		H.push(
			`<div class="field-contain label-up"><label>${ObjetTraduction_1.GTraductions.getValeur("Date")}</label><div ie-identite="getIdentiteDate"></div></div>`,
		);
		H.push(
			`<div class="field-contain label-up p-top"><label id="${this.idLabelAuteur}">${ObjetTraduction_1.GTraductions.getValeur("Commissions.auteur")}</label><ie-btnselecteur ie-model="btnAuteur" aria-describedby="${this.idLabelAuteur}"></ie-btnselecteur></div>`,
		);
		H.push(
			`<div class="field-contain p-top" style="height:16rem;"><ie-textareamax ie-model="txtSuivi" class="full-size" ie-compteurmax="10000" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Commissions.redigerSuivi")}"></ie-textareamax></div>`,
		);
		H.push(
			`<div class="field-contain p-top"><div class="pj-global-conteneur" ie-identite="getListePJ"></div></div>`,
		);
		H.push(
			`<div class="field-contain p-top-l"><ie-checkbox ie-model="cbPublication">${ObjetTraduction_1.GTraductions.getValeur("Commissions.publierLeSuivi")}<i class="icon_info_sondage_publier mix-icon_ok i-as-deco m-left"></i></ie-checkbox></div>`,
		);
		return H.join("");
	}
	composeBas() {
		const lHTML = [];
		lHTML.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "compose-bas", "ie-if": "getBtnSuppr" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": "btnSupprimer",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"Commissions.supprimerLeSuivi",
						),
						class: "icon_trash avecFond i-medium",
					}),
				),
			),
		);
		return lHTML.join("");
	}
	setDonnees(aDonnees) {
		this.donnees = new ObjetElement_1.ObjetElement("");
		if (aDonnees) {
			this.estEnCreation = false;
			$.extend(this.donnees, aDonnees);
			this.setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"Commissions.modifierSuivi",
				),
			});
		} else {
			this.estEnCreation = true;
			this.initDonnees();
			this.setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"Commissions.redigerSuivi",
				),
			});
		}
		this.afficher(this.composeContenu());
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			if (
				this.donnees.getLibelle() !== "" ||
				this.donnees.Etat === Enumere_Etat_1.EGenreEtat.Suppression
			) {
				this.callback.appel(this.donnees);
			} else {
				GApplication.getMessage().afficher({
					message: ObjetTraduction_1.GTraductions.getValeur(
						"Commissions.suiviVide",
					),
				});
				return;
			}
		}
		this.fermer();
	}
}
