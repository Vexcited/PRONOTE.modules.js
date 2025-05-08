const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { ObjetOrientation } = require("ObjetOrientation.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { InterfacePage } = require("InterfacePage.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GHtml } = require("ObjetHtml.js");
const { TUtilitaireOrientation } = require("UtilitaireOrientation.js");
const { EGenreEvnt } = require("UtilitaireOrientation.js");
const { EGenreVoeux } = require("UtilitaireOrientation.js");
const { EModeAffichage } = require("UtilitaireOrientation.js");
const { TypeRubriqueOrientation } = require("TypeRubriqueOrientation.js");
const { Type3Etats } = require("Type3Etats.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
class _InterfaceOrientation extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div style="height:100%" class="Espace">');
		H.push('<div class="Espace" id="', this.idMessage, '"></div>');
		H.push(
			'<div class="EspaceHaut InterfacePageOrientation" style="height: 100%" id="',
			this.idDivGenerale,
			'"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAffichageInformation: {
				event() {
					aInstance.evenementSurBouton();
				},
			},
			getLibelleBoutonAffInformation() {
				return aInstance.LibelleBouton || "";
			},
			avecBoutonAffInformation() {
				return !!aInstance.Message && aInstance.Message.length > 0;
			},
		});
	}
	creerBoutonAffichageInformation() {
		return '<ie-bouton ie-model="btnAffichageInformation" ie-html="getLibelleBoutonAffInformation" ie-display="avecBoutonAffInformation"></ie-bouton>';
	}
	getDonnesARDeRubriqueDeGenre(aGenre) {
		let lRubrique = null;
		if (!!this.Donnees.listeRubriques) {
			lRubrique = this.Donnees.listeRubriques.getElementParGenre(aGenre);
		}
		return !!lRubrique ? lRubrique.donneesAR : null;
	}
	initialiserFenetre(aInstance) {
		aInstance.setOptionsFenetre({
			largeur: 400,
			hauteur: 80,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		const LMessage =
			typeof aGenreMessage === "number"
				? GTraductions.getValeur("Message")[aGenreMessage]
				: aGenreMessage;
		GHtml.setHtml(this.idDivGenerale, this.composeMessage(LMessage));
	}
	actionSurRecupererDonnees(aParametres) {
		if (aParametres.Message) {
			this.evenementAfficherMessage(aParametres.Message);
		} else {
			this.LibelleBouton = aParametres.TexteNiveau.LibelleBouton;
			this.Message = aParametres.TexteNiveau.TexteInformatif;
			this.Donnees = aParametres;
			let lAuMoinsUneRubrique = !!aParametres.rubriqueLV;
			this.rubriqueLV = aParametres.rubriqueLV;
			if (!lAuMoinsUneRubrique && this.Donnees.listeRubriques) {
				this.Donnees.listeRubriques.parcourir((aRubrique) => {
					if (aRubrique.listeVoeux) {
						aRubrique.listeVoeux.parcourir((aVoeux) => {
							if (lAuMoinsUneRubrique) {
								return;
							}
							if (aVoeux.existeNumero()) {
								lAuMoinsUneRubrique = true;
								return;
							}
						});
						if (
							aRubrique.avecSaisie ||
							aRubrique.estPublie ||
							aRubrique.dateMsgPublication
						) {
							lAuMoinsUneRubrique = true;
							return;
						}
					}
				});
			}
			if (lAuMoinsUneRubrique) {
				this.IdentOrientationsIntentions = [];
				this.IdentOrientationsDefinitif = [];
				this.listeOrientationsSupprimees = new ObjetListeElements();
				this.initOrientations(aParametres);
				this.setEtatSaisie(false);
			} else {
				this.evenementAfficherMessage(
					GTraductions.getValeur("Orientation.MsgAucuneOrientation"),
				);
			}
		}
		this.surResizeInterface();
	}
	initOrientations(aDonnees) {
		const aInstance = this;
		const listeRubriques = new ObjetListeElements();
		aDonnees.listeRubriques.parcourir((aRubrique) => {
			if (
				aRubrique.listeVoeux &&
				aRubrique.listeVoeux.count() === 0 &&
				!aRubrique.dateMsgPublication
			) {
				return;
			}
			const lRubrique = aRubrique;
			lRubrique.listeObjetInterface = [];
			if (
				[
					TypeRubriqueOrientation.RO_IntentionFamille,
					TypeRubriqueOrientation.RO_VoeuDefinitif,
				].includes(aRubrique.getGenre())
			) {
				let lEditable = true;
				aRubrique.listeVoeux.parcourir((aVoeux) => {
					if (!aRubrique.avecSaisie && aVoeux.getNumero() === undefined) {
						return;
					}
					if (aVoeux.orientation && aVoeux.orientation.existe()) {
						const lOrientationModele =
							aDonnees.listeOrientations.getElementParNumero(
								aVoeux.orientation.getNumero(),
							);
						if (lOrientationModele) {
							$.extend(aVoeux.orientation, lOrientationModele);
						}
					}
					const orientation = Identite.creerInstance(ObjetOrientation, {
						pere: aInstance,
						evenement: aInstance._surEvntInput,
					});
					let lModeSaisie = aRubrique.avecSaisie
						? EModeAffichage.saisie
						: EModeAffichage.consultation;
					const lEstProfesseur =
						GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
						GEtatUtilisateur.GenreEspace === EGenreEspace.MobileProfesseur;
					if (lEstProfesseur) {
						lModeSaisie = !!aVoeux.avecAvisSaisie
							? EModeAffichage.consultation
							: lModeSaisie;
					} else {
						if (!!aRubrique.estConseilPublie || !!aVoeux.avecAvisSaisie) {
							lModeSaisie = EModeAffichage.consultation;
						}
					}
					orientation.setDonnees({
						voeux: aVoeux,
						rubrique: aRubrique,
						maquette: aRubrique.maquette,
						modeSaisie: lModeSaisie,
						avecOption: true,
						editable: lEditable,
						genre: aRubrique.getGenre(),
					});
					lEditable = orientation.estEditable();
					lRubrique.listeObjetInterface.push(orientation);
					if (
						aRubrique.getGenre() === TypeRubriqueOrientation.RO_IntentionFamille
					) {
						aInstance.IdentOrientationsIntentions.push(orientation);
					} else {
						aInstance.IdentOrientationsDefinitif.push(orientation);
					}
				});
			} else if (
				aRubrique.getGenre() !== TypeRubriqueOrientation.RO_DecisionRetenue
			) {
				const orientation = Identite.creerInstance(ObjetOrientation, {
					pere: aInstance,
				});
				const lVoeux =
					aRubrique.listeVoeux && aRubrique.listeVoeux.count()
						? aRubrique.listeVoeux.get(0)
						: undefined;
				orientation.setDonnees({
					voeux: lVoeux,
					modeSaisie: EModeAffichage.simplifie,
					editable: false,
				});
				lRubrique.listeObjetInterface.push(orientation);
			}
			if (
				[
					TypeRubriqueOrientation.RO_AutreRecommandationConseil,
					TypeRubriqueOrientation.RO_AutrePropositionConseil,
				].includes(aRubrique.getGenre()) &&
				!!aRubrique.dateMsgPublication
			) {
				const lRubriqueSaisie = aDonnees.listeRubriques.getElementParGenre(
					aRubrique.getGenre() ===
						TypeRubriqueOrientation.RO_AutreRecommandationConseil
						? TypeRubriqueOrientation.RO_IntentionFamille
						: TypeRubriqueOrientation.RO_VoeuDefinitif,
				);
				if (
					lRubriqueSaisie === undefined ||
					(!!lRubriqueSaisie &&
						lRubriqueSaisie.dateMsgPublication === undefined)
				) {
					listeRubriques.insererElement(lRubrique, listeRubriques.count() - 1);
				}
			} else {
				listeRubriques.addElement(lRubrique);
			}
		});
		let lHtml = [];
		if (aDonnees.rubriqueLV) {
			lHtml.push(
				TUtilitaireOrientation.getHtmlLangueEtOption(aDonnees.rubriqueLV),
			);
		}
		if (listeRubriques) {
			lHtml.push(this.getHtmlOrientation(listeRubriques));
			GHtml.setHtml(this.idDivGenerale, lHtml.join(""), { instance: this });
			listeRubriques.parcourir((aRubrique) => {
				aRubrique.listeObjetInterface.forEach((aOrientation) => {
					aOrientation.initialiser();
				});
			});
			if (this.getInstance(this.identComboOrientationAR)) {
				const lCombo = this.getInstance(this.identComboOrientationAR);
				const lDonneesAR = this.getDonnesARDeRubriqueDeGenre(
					TypeRubriqueOrientation.RO_AutrePropositionConseil,
				);
				if (lDonneesAR && lDonneesAR.listeOrientations) {
					let lIndiceDecision = 0;
					if (lDonneesAR.estAccuse === Type3Etats.TE_Oui) {
						lIndiceDecision =
							!!lDonneesAR.decisionRetenue &&
							lDonneesAR.decisionRetenue.existeNumero()
								? lDonneesAR.listeOrientations.getIndiceParLibelle(
										lDonneesAR.decisionRetenue.getLibelle(),
									)
								: 0;
					}
					lCombo.initialiser();
					lCombo.setDonnees(lDonneesAR.listeOrientations, lIndiceDecision);
					const lActif =
						lDonneesAR.estEditable &&
						lDonneesAR.estAccuse !== Type3Etats.TE_Non;
					lCombo.setActif(lActif);
				}
			}
		} else {
			GHtml.setHtml(this.idDivGenerale, lHtml.join(""), { instance: this });
		}
	}
	getHtmlOrientation(aListeRubriques) {
		const lHtml = [];
		let lAncienTitre;
		let lTitre;
		lHtml.push('<div class="flex-contain cols">');
		aListeRubriques.parcourir((aRubrique) => {
			const lAfficherRubrique =
				aRubrique.estConseilPublie ||
				aRubrique.estPublie ||
				!!aRubrique.dateMsgPublication ||
				!!aRubrique.avecAccuseReception;
			let lCleTraduction = "";
			if (!lAfficherRubrique) {
				return;
			}
			switch (aRubrique.getGenre()) {
				case TypeRubriqueOrientation.RO_IntentionFamille:
					lTitre = GTraductions.getValeur(
						"Orientation.Ressources.IntentionsOrientations",
					);
					lCleTraduction = "Orientation.Ressources.MessageSaisieIndisponible";
					break;
				case TypeRubriqueOrientation.RO_AutreRecommandationConseil:
					lTitre = GTraductions.getValeur(
						"Orientation.Ressources.IntentionsOrientations",
					);
					lCleTraduction = "Orientation.Ressources.MsgAvisProvisoireCC";
					break;
				case TypeRubriqueOrientation.RO_VoeuDefinitif:
					lTitre = GTraductions.getValeur(
						"Orientation.Ressources.ChoixDefinitifs",
					);
					lCleTraduction = "Orientation.Ressources.MessageSaisieIndisponible";
					break;
				case TypeRubriqueOrientation.RO_AutrePropositionConseil:
					lTitre = GTraductions.getValeur(
						"Orientation.Ressources.ChoixDefinitifs",
					);
					lCleTraduction = "Orientation.Ressources.MsgPropositionCC";
					break;
				case TypeRubriqueOrientation.RO_DecisionRetenue:
					lTitre = GTraductions.getValeur(
						"Orientation.Ressources.DecisionRetenue",
					);
					lCleTraduction = "Orientation.Ressources.MsgDecisionRetenue";
					break;
				default:
					lTitre = "";
					break;
			}
			if (lTitre !== lAncienTitre) {
				lAncienTitre = lTitre;
				if (
					[
						TypeRubriqueOrientation.RO_AutreRecommandationConseil,
						TypeRubriqueOrientation.RO_AutrePropositionConseil,
					].includes(aRubrique.getGenre())
				) {
					const lRubriqueSaisie = aListeRubriques.getElementParGenre(
						aRubrique.getGenre() ===
							TypeRubriqueOrientation.RO_AutreRecommandationConseil
							? TypeRubriqueOrientation.RO_IntentionFamille
							: TypeRubriqueOrientation.RO_VoeuDefinitif,
					);
					if (
						lRubriqueSaisie &&
						lRubriqueSaisie.avecSaisie &&
						lRubriqueSaisie.dateFinRubrique
					) {
						lTitre +=
							" " +
							GTraductions.getValeur("Orientation.ASaisirJusqau", [
								GDate.formatDate(
									lRubriqueSaisie.dateFinRubrique,
									"%JJ/%MM/%AAAA",
								),
							]);
					}
				} else if (aRubrique.avecSaisie) {
					lTitre +=
						" " +
						GTraductions.getValeur("Orientation.ASaisirJusqau", [
							GDate.formatDate(aRubrique.dateFinRubrique, "%JJ/%MM/%AAAA"),
						]);
				}
				lHtml.push("<div>", '<h2 class="ie-titre">', lTitre, "</h2>", "<div>");
			}
			if (aRubrique.titre && lAfficherRubrique) {
				if (
					aRubrique.estConseilPublie &&
					aRubrique.listeObjetInterface.length > 0
				) {
					if (
						[
							TypeRubriqueOrientation.RO_IntentionFamille,
							TypeRubriqueOrientation.RO_VoeuDefinitif,
						].includes(aRubrique.getGenre())
					) {
						const lCleCC =
							aRubrique.getGenre() ===
							TypeRubriqueOrientation.RO_IntentionFamille
								? "Orientation.Ressources.AvisProvisoireCC"
								: "Orientation.Ressources.PropositionCC";
						const lCleFamille =
							aRubrique.getGenre() ===
							TypeRubriqueOrientation.RO_IntentionFamille
								? "Orientation.Ressources.IntentionsFamille"
								: "Orientation.Ressources.ChoixDefinitifsFamille";
						lHtml.push('<div class="IPO_Bloc65 flex-contain IPO_Petit_Titre">');
						lHtml.push("<h3>", GTraductions.getValeur(lCleCC), "</h3>");
						lHtml.push("<h3>", GTraductions.getValeur(lCleFamille), "</h3>");
						lHtml.push("</div>");
					}
				}
			} else {
				if (!!aRubrique.listeVoeux) {
					lHtml.push('<div class="flex-contain">');
					lHtml.push(
						'<h3 class="Espace Gras">',
						aRubrique.getGenre() ===
							TypeRubriqueOrientation.RO_AutreRecommandationConseil
							? GTraductions.getValeur(
									"Orientation.Ressources.RecommandationSurVoieNonDemandee",
								)
							: GTraductions.getValeur(
									"Orientation.Ressources.PropositionSurVoieNonDemandee",
								),
						"</h3>",
					);
					lHtml.push("</div>");
				}
			}
			if (aRubrique.dateMsgPublication) {
				lHtml.push('<div class="EspaceHaut EspaceBas">');
				lHtml.push('  <div class="Espace IPO_Bloc50">');
				lHtml.push(
					'    <div class="Espace Gras" >',
					GTraductions.getValeur(lCleTraduction, [
						GDate.formatDate(aRubrique.dateMsgPublication, "%JJ/%MM/%AAAA"),
					]),
					"</div>",
				);
				lHtml.push("  </div>", "</div>");
			} else if (lAfficherRubrique) {
				lHtml.push('<div class="m-all-xl">');
				if (
					(aRubrique.estConseilPublie || aRubrique.estPublie) &&
					!!aRubrique.listeVoeux &&
					aRubrique.listeVoeux.count() > 0
				) {
					if (
						aRubrique.getGenre() === TypeRubriqueOrientation.RO_DecisionRetenue
					) {
						lHtml.push(
							TUtilitaireOrientation.construireDecisionRetenue(this, aRubrique),
						);
					} else {
						if (aRubrique.listeObjetInterface.length > 0) {
							aRubrique.listeObjetInterface.forEach((aOrientation) => {
								lHtml.push('<div id="' + aOrientation.getNom() + '"></div>');
							});
						} else {
							lHtml.push(
								'    <div class="Espace Gras" >',
								GTraductions.getValeur("Orientation.AucuneOrientation"),
								"</div>",
							);
						}
					}
				}
				if (
					!!aRubrique.avecAccuseReception &&
					!!aRubrique.donneesAR &&
					!!aRubrique.auMoinsUnAvisFavorable
				) {
					lHtml.push(
						TUtilitaireOrientation.construireAR({
							instance: this,
							rubrique: aRubrique,
							idCombo: this.getNomInstance(this.identComboOrientationAR),
						}),
					);
				}
				lHtml.push("</div>");
			}
			if (aRubrique.avecSaisie) {
				const lLibelle =
					GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur ||
					GEtatUtilisateur.GenreEspace === EGenreEspace.MobileProfesseur
						? GTraductions.getValeur("Valider")
						: aRubrique.getGenre() ===
								TypeRubriqueOrientation.RO_IntentionFamille
							? GTraductions.getValeur(
									"Orientation.Bouton.IntentionsOrientation",
								)
							: GTraductions.getValeur("Orientation.Bouton.ChoixDefinitifs");
				lHtml.push(
					'<div class="GrandEspaceGauche GrandEspaceBas IPO_Bloc100"><ie-bouton ie-model="btnValider" class="themeBoutonPrimaire" ie-display="btnValider.getDisplay(',
					aRubrique.getGenre(),
					')">',
					lLibelle,
					"</ie-bouton></div>",
				);
			}
			lHtml.push("</div>");
		});
		lHtml.push("</div></div>");
		return lHtml.join("");
	}
	_surEvntInput(aElement, aParam) {
		let lListeRessources, lCleTraduction;
		let lFiltrerRessource = true;
		switch (aParam.genreEvent) {
			case EGenreEvnt.orientation:
				lListeRessources =
					TUtilitaireOrientation.formatterDonneesPourRegroupements(
						this,
						this.Donnees.listeOrientations,
					);
				lFiltrerRessource = false;
				lCleTraduction = "Orientation.TitreListe";
				break;
			case EGenreEvnt.specialite:
				lListeRessources = aParam.orientation.listeSpecialites;
				lCleTraduction = "Orientation.Specialites.TitreListe";
				break;
			case EGenreEvnt.option:
				lListeRessources = aParam.orientation.listeOptions;
				lCleTraduction = "Orientation.Options.TitreListe";
				break;
			case EGenreEvnt.supprimer: {
				this.setEtatSaisie(true);
				let lRangModifie = aElement.donnees.rang;
				let lListeOrientations =
					aElement.Genre === EGenreVoeux.intention
						? this.IdentOrientationsIntentions
						: this.IdentOrientationsDefinitif;
				for (; lRangModifie < lListeOrientations.length; lRangModifie++) {
					lListeOrientations[lRangModifie].donnees.rang--;
				}
				aElement.donnees.rang = lRangModifie;
				if (
					!this.listeOrientationsSupprimees.getElementParNumero(
						aElement.donnees.getNumero(),
					)
				) {
					const lElemSupprime = MethodesObjet.dupliquer(aElement.donnees);
					this.listeOrientationsSupprimees.addElement(lElemSupprime);
					aElement.donnees.setNumero(0);
				}
				const lIdJQ = "#" + aElement.Nom.escapeJQ();
				const objetHtml = $(lIdJQ);
				const objetParent = objetHtml.parent();
				objetParent.remove(lIdJQ).append(objetHtml);
				lListeOrientations.sort((a, b) => {
					return a.donnees.rang - b.donnees.rang;
				});
				this.actualiserListeObjet(lListeOrientations);
				break;
			}
			case EGenreEvnt.actualiser: {
				let lListeOrientations =
					aElement.Genre === EGenreVoeux.intention
						? this.IdentOrientationsIntentions
						: this.IdentOrientationsDefinitif;
				if (aParam.index <= lListeOrientations.length) {
					const lElement = lListeOrientations[aParam.index];
					if (lElement) {
						lElement.setEditable(aElement.estEditable());
					}
				}
				this.setEtatSaisie(true);
				break;
			}
			case EGenreEvnt.lv1:
				lFiltrerRessource = false;
				lCleTraduction = "Orientation.LanguesOptions.TitreListeLV1";
				lListeRessources = aElement.listeLV1;
				break;
			case EGenreEvnt.lv2:
				lFiltrerRessource = false;
				lCleTraduction = "Orientation.LanguesOptions.TitreListeLV2";
				lListeRessources = aElement.listeLV2;
				break;
			case EGenreEvnt.lvautre:
				lCleTraduction = "Orientation.Options.TitreListe";
				lListeRessources = aElement.listeLVAutres;
				break;
			default:
		}
		if (lListeRessources) {
			if (lFiltrerRessource) {
				lListeRessources = TUtilitaireOrientation.filtrerRessources(
					this,
					aElement,
					lListeRessources,
					aParam.genreEvent,
				);
			}
			this.getInstance(this.identFenetreRessource).setOptionsFenetre({
				titre: GTraductions.getValeur(lCleTraduction),
			});
			this.getInstance(this.identFenetreRessource).setDonnees({
				genre: aParam.genreEvent,
				listeRessource: lListeRessources,
				element: aElement,
				index: aParam.index,
				estMultiNiveau: this.Donnees.estMultiNiveau,
				estNiveauPremiere: this.Donnees.estNiveauPremiere,
			});
		}
	}
	evntFenetreRessource(aParam) {
		const lLV1 =
			aParam.genre === EGenreEvnt.lv1 ? aParam.element : this.rubriqueLV.LV1;
		const lLV2 =
			aParam.genre === EGenreEvnt.lv2 ? aParam.element : this.rubriqueLV.LV2;
		this.verificationDonnees({ lv1: lLV1, lv2: lLV2 });
	}
	verificationDonnees(aDonnees) {
		if (
			aDonnees &&
			aDonnees.lv1 &&
			aDonnees.lv1.existeNumero() &&
			aDonnees.lv2 &&
			aDonnees.lv2.existeNumero()
		) {
			Requetes.inscrire("VerificationOrientations", ObjetRequeteConsultation);
			Requetes(
				"VerificationOrientations",
				this,
				_apresRequeteVerification.bind(this, aDonnees),
			).lancerRequete({ LV1: aDonnees.lv1, LV2: aDonnees.lv2 });
		} else {
			this.rubriqueLV.LV1 = aDonnees.lv1;
			this.rubriqueLV.LV2 = aDonnees.lv2;
			this.setEtatSaisie(true);
		}
	}
	actualiserListeObjet(aListe) {
		if (!!aListe) {
			let lEditable = true;
			aListe.forEach((aObjet) => {
				aObjet.setEditable(lEditable);
				lEditable = aObjet.estEditable();
			});
		}
	}
	_surEvenementOrientation() {
		this.surResizeInterface();
	}
	valider() {}
	getListeOrientationSaisie() {
		const lListeOrientations = new ObjetListeElements();
		this.IdentOrientationsIntentions.forEach((aElement) => {
			lListeOrientations.addElement(aElement.donnees);
		});
		this.IdentOrientationsDefinitif.forEach((aElement) => {
			lListeOrientations.addElement(aElement.donnees);
		});
		this.listeOrientationsSupprimees.parcourir((aElement) => {
			aElement.setEtat(EGenreEtat.Suppression);
			lListeOrientations.addElement(aElement);
		});
		return lListeOrientations;
	}
	actionSurValidation() {
		super.actionSurValidation();
		TUtilitaireOrientation.afficherMessageValidation();
	}
	evenementSurBouton() {
		this.getInstance(this.identFenetre).setOptionsFenetre({
			titre: this.LibelleBouton,
		});
		this.getInstance(this.identFenetre).setDonnees(
			GChaine.replaceRCToHTML(this.Message),
		);
	}
}
function _apresRequeteVerification(aDonneesSaisies, aDonneesRecues) {
	if (aDonneesRecues.message) {
		GApplication.getMessage().afficher({
			titre: GTraductions.getValeur(
				"Orientation.LanguesOptions.titreMsgErreur",
			),
			type: EGenreBoiteMessage.Information,
			message: aDonneesRecues.message,
		});
	} else {
		this.rubriqueLV.LV1 = aDonneesSaisies.lv1;
		this.rubriqueLV.LV2 = aDonneesSaisies.lv2;
		this.setEtatSaisie(true);
	}
}
module.exports = { _InterfaceOrientation };
