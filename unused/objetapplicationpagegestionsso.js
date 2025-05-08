exports.ObjetApplicationPageGestionSSO = void 0;
require("NamespaceIE.js");
require("DeclarationJQuery.js");
require("DeclarationImagePN.js");
require("DeclarationCurseurPN.js");
require("ObjetNavigateur.js");
const ObjetApplicationProduit_1 = require("ObjetApplicationProduit");
const GUID_1 = require("GUID");
const CommunicationProduit_1 = require("CommunicationProduit");
const ObjetHtml_1 = require("ObjetHtml");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetCelluleMultiSelection_1 = require("ObjetCelluleMultiSelection");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeErreurCAS_1 = require("TypeErreurCAS");
const TypeProfilUtilisateurCas_1 = require("TypeProfilUtilisateurCas");
const UtilitaireRedirection_1 = require("UtilitaireRedirection");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetWAI_1 = require("ObjetWAI");
const Invocateur_1 = require("Invocateur");
const Enumere_Action_1 = require("Enumere_Action");
const UtilitaireMenuContextuelNatif_1 = require("UtilitaireMenuContextuelNatif");
const ObjetCouleur_1 = require("ObjetCouleur");
const ObjetParametresCP_1 = require("ObjetParametresCP");
CollectionRequetes_1.Requetes.inscrire(
	"FonctionParametres",
	ObjetRequeteJSON_1.ObjetRequeteConsultation,
);
CollectionRequetes_1.Requetes.inscrire(
	"SaisieErreurSSO",
	ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
global.Start = function (aParametres) {
	const lNumeroSession = aParametres.h;
	const lErreurGenerique = aParametres.z;
	Invocateur_1.Invocateur.evenement(
		Invocateur_1.ObjetInvocateur.events.initChiffrement,
		aParametres,
	);
	const lApp = (GApplication = new ObjetApplicationPageGestionSSO(
		lErreurGenerique,
	));
	global.GCouleur = new ObjetCouleur_1.ObjetCouleur(true);
	if (!global.GParametres) {
		global.GParametres = new ObjetParametresGestionSSO();
	}
	lApp.setCommunication(
		new CommunicationProduit_1.CommunicationProduit(
			Enumere_Espace_1.EGenreEspace.Gestion_SSO,
			lNumeroSession,
		),
	);
	lApp.evenementSurChargement();
};
class ObjetApplicationPageGestionSSO extends ObjetApplicationProduit_1.ObjetApplicationProduit {
	constructor(aErreurGenerique) {
		super();
		this.Nom = "GApplication";
		this.PositionFocus = 1;
		this.idWrapper = this.Nom + "_wrapper";
		this.idConnect = this.Nom + "_connect";
		this.idcommentaire = GUID_1.GUID.getId();
		this.idnom = GUID_1.GUID.getId();
		this.idprenom = GUID_1.GUID.getId();
		this.iddatenaissance = GUID_1.GUID.getId();
		this.idcodepostal = GUID_1.GUID.getId();
		this.idclasse = GUID_1.GUID.getId();
		this.idnomEleve = GUID_1.GUID.getId();
		this.idprenomEleve = GUID_1.GUID.getId();
		this.iddatenaissanceEleve = GUID_1.GUID.getId();
		this.idemail = GUID_1.GUID.getId();
		this.idIndicatif = GUID_1.GUID.getId();
		this.idtelephone = GUID_1.GUID.getId();
		this.selectDisciplines =
			new ObjetCelluleMultiSelection_1.ObjetCelluleMultiSelection(
				this.Nom + ".selectDisciplines",
				null,
				this,
				this._evnSelectDisciplines,
			);
		this.etatSaisie = false;
		this.erreurGenerique = aErreurGenerique;
	}
	evenementSurChargement() {
		this.modifierURL();
		(0, CollectionRequetes_1.Requetes)(
			"FonctionParametres",
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete({});
	}
	modifierURL() {
		if (typeof history.pushState !== "undefined") {
			let obj = {};
			let parts, key;
			let url = window.location.href.split("?")[0];
			const page = window.document.title;
			const lParams = window.location.search.substring(1).split("&");
			for (let i = 0, len = lParams.length; i < len; i++) {
				parts = lParams[i].split("=");
				if (!parts[0]) {
					continue;
				}
				obj[parts[0]] = parts[1] || true;
			}
			parts = [];
			for (key in obj) {
				if (key !== "ticket") {
					parts.push(key + (obj[key] === true ? "" : "=" + obj[key]));
				}
			}
			url += parts.length > 0 ? "?" + parts.join("&") : "";
			obj = { Page: page, Url: url };
			history.pushState(obj, obj.Page, obj.Url);
		}
	}
	actionSurRecupererDonnees(aJSON) {
		this.etatSaisie = false;
		this.donnees = aJSON.espace;
		if (this.donnees.telephone) {
			const lArrTel = this.donnees.telephone.split(" ", 2);
			this.donnees.indicatif = lArrTel[0];
			this.donnees.numeroTel = lArrTel[1];
		} else {
			this.donnees.indicatif = "";
			this.donnees.numeroTel = "";
		}
		if (!this.donnees.informationsSupplementaires) {
			this.donnees.informationsSupplementaires = {};
		}
		if (
			this.donnees.profil ===
				TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucParents &&
			TypeErreurCAS_1.TypeErreurCASUtil.estErreurEduConnect(
				this.donnees.codeErreur,
			)
		) {
			if (!this.donnees.informationsSupplementaires.eleves) {
				this.donnees.informationsSupplementaires.eleves = [];
			}
			if (this.donnees.informationsSupplementaires.eleves.length === 0) {
				const lEleve = {};
				if (!!this.donnees.informationsSupplementaires) {
					lEleve.nom = this.donnees.informationsSupplementaires.nom || "";
					lEleve.prenom = this.donnees.informationsSupplementaires.prenom || "";
					lEleve.classe = this.donnees.informationsSupplementaires.classe || "";
					lEleve.dateNaissance =
						this.donnees.informationsSupplementaires.dateNaissance || undefined;
				}
				this.donnees.informationsSupplementaires.eleves.push(lEleve);
			}
		}
		this.disciplines =
			aJSON.disciplines || new ObjetListeElements_1.ObjetListeElements();
		ObjetHtml_1.GHtml.setHtml(
			this.getIdConteneur(),
			this.construireAffichage(),
			{ controleur: this._getControleur() },
		);
		if (
			this.donnees.profil ===
			TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucInspecteurs
		) {
			this.selectDisciplines.setOptions({
				largeurBouton: 603,
				titreFenetre:
					ObjetTraduction_1.GTraductions.getValeur("sso.Disciplines"),
				titresColonnes: [
					{ estCoche: true },
					ObjetTraduction_1.GTraductions.getValeur("Libelle"),
				],
				taillesColonnes: ["20", "100%"],
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
				largeurFenetre: 450,
				hauteurFenetre: 250,
				labelWAI: ObjetTraduction_1.GTraductions.getValeur("sso.Disciplines"),
			});
			this.selectDisciplines.initialiser();
			this.selectDisciplines.setDonnees(
				this.disciplines,
				this.donnees.disciplines,
			);
		}
		UtilitaireMenuContextuelNatif_1.UtilitaireMenuContextuelNatif.desactiverSurElement(
			$(document),
		);
		$(window).on("beforeunload", (aEvent) => {
			IE.log.addLog("beforeunload : " + !this.etatSaisie);
			if (!this.etatSaisie) {
				aEvent.returnValue = ObjetTraduction_1.GTraductions.getValeur(
					"sso.messages.saisieNonValidee",
				);
				return ObjetTraduction_1.GTraductions.getValeur(
					"sso.messages.saisieNonValidee",
				);
			}
		});
	}
	ajouterUnEleve() {
		let lResult;
		if (this.donnees.informationsSupplementaires.eleves) {
			const lEleve = {};
			lEleve.nom = "";
			lEleve.prenom = "";
			lEleve.classe = "";
			lEleve.dateNaissance = undefined;
			this.donnees.informationsSupplementaires.eleves.push(lEleve);
			lResult = true;
		}
		return lResult;
	}
	supprimerEleve(aIndice, aArrDateNaissance) {
		let lResult = false;
		if (this.donnees.informationsSupplementaires.eleves) {
			const lNombreDebut =
				this.donnees.informationsSupplementaires.eleves.length;
			if (lNombreDebut > aIndice) {
				this.donnees.informationsSupplementaires.eleves.splice(aIndice, 1);
				aArrDateNaissance.splice(aIndice, 1);
				const lNombreActuel =
					this.donnees.informationsSupplementaires.eleves.length;
				lResult = lNombreDebut - 1 === lNombreActuel;
				if (lResult && lNombreActuel === 0) {
					const lEleve = {};
					lEleve.nom = "";
					lEleve.prenom = "";
					lEleve.classe = "";
					lEleve.dateNaissance = undefined;
					this.donnees.informationsSupplementaires.eleves.push(lEleve);
					aArrDateNaissance.push(null);
				}
			}
		}
		return lResult;
	}
	getEleveDIndice(aIndice) {
		let lEleve;
		if (
			this.donnees &&
			this.donnees.informationsSupplementaires &&
			this.donnees.informationsSupplementaires.eleves &&
			aIndice < this.donnees.informationsSupplementaires.eleves.length
		) {
			lEleve = this.donnees.informationsSupplementaires.eleves[aIndice];
		}
		return lEleve;
	}
	_evnSelectDisciplines(aGenreBouton, aListeDonnees) {
		if (aGenreBouton === 1) {
			this.donnees.disciplines = aListeDonnees;
		}
	}
	construireAffichage() {
		const lHtml = [];
		const lTitre =
			this.erreurGenerique ||
			this.donnees.codeErreur === 5 ||
			this.donnees.codeErreur === 6
				? ObjetTraduction_1.GTraductions.getValeur("sso.ConnexionImpossible")
				: ObjetTraduction_1.GTraductions.getValeur("sso.Titre");
		lHtml.push(
			'<div id="',
			this.idWrapper,
			'" style="position:absolute;width:100%;height:100%;overflow:hidden;">',
		);
		lHtml.push(
			'<div style="position:relative;width: 100%; height:35px; font-size:20px; box-shadow:0 2px 10px -6px #000000;z-index:101;" class="Texte18 FondBlanc">',
		);
		lHtml.push(
			'<div style="width:0;height:100%;" class="InlineBlock AlignementMilieuVertical"></div>',
		);
		lHtml.push(
			'<div style="width: 99.5%;" class="InlineBlock AlignementMilieu AlignementMilieuVertical">',
			lTitre,
			"</div>",
		);
		lHtml.push("</div>");
		lHtml.push('<div id="', this.idConnect, '">');
		if (
			this.donnees.codeErreur ===
				TypeErreurCAS_1.TypeErreurCAS.eCAS_Plusieurs_IdCAS ||
			this.donnees.codeErreur ===
				TypeErreurCAS_1.TypeErreurCAS.eCAS_PersonnelVSEtDirection
		) {
			lHtml.push(this._composeLiens());
		} else if (
			this.donnees.codeErreur ===
			TypeErreurCAS_1.TypeErreurCAS.eCAS_AucunTrouve_URLEspace
		) {
			lHtml.push(this._composeLienRacine());
		} else if (
			this.donnees.codeErreur ===
			TypeErreurCAS_1.TypeErreurCAS.eCAS_AucunTrouve_AccesRefuse
		) {
			lHtml.push(this._composeAutreMessage());
		} else if (
			this.donnees.codeErreur ===
				TypeErreurCAS_1.TypeErreurCAS.eCAS_samlValidate_Statut ||
			this.donnees.codeErreur ===
				TypeErreurCAS_1.TypeErreurCAS.eCAS_samlValidate_Message
		) {
			lHtml.push(this._composeErreurMessage());
		} else if (this.erreurGenerique) {
			if (
				TypeErreurCAS_1.TypeErreurCASUtil.estErreurEduConnect(
					this.donnees.codeErreur,
				)
			) {
				lHtml.push(this._composeGenerique(true));
			} else {
				lHtml.push(this._composeGenerique());
			}
		} else if (
			TypeErreurCAS_1.TypeErreurCASUtil.estErreurEduConnect(
				this.donnees.codeErreur,
			)
		) {
			lHtml.push(this._composeEduConnect());
		} else {
			lHtml.push(this._composeInfo());
		}
		lHtml.push("</div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	valider() {
		(0, CollectionRequetes_1.Requetes)(
			"SaisieErreurSSO",
			this,
			this.actionSurValidation,
		)
			.setOptions({ avecControleModeExclusif: false })
			.lancerRequete({ infos: this.donnees.toJSONAll() });
	}
	actionSurValidation() {
		if (!GApplication.getModeExclusif()) {
			this.etatSaisie = true;
			ObjetHtml_1.GHtml.setHtml(this.idConnect, this._messageReussi());
		} else {
			this.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"sso.messages.erreurTitre",
				),
				message: ObjetTraduction_1.GTraductions.getValeur(
					"sso.messages.erreurInfo",
				),
			});
		}
	}
	actionEchec() {
		this.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"sso.messages.erreurTitre",
			),
			message: ObjetTraduction_1.GTraductions.getValeur(
				"sso.messages.erreurInfo",
			),
		});
	}
	_getControleur() {
		const lthis = this;
		let lDateStr = null;
		const lDateStrE = [];
		if (
			this.donnees.informationsSupplementaires &&
			this.donnees.informationsSupplementaires.eleves
		) {
			for (
				let index = 0;
				index < this.donnees.informationsSupplementaires.eleves.length;
				index++
			) {
				lDateStrE.push(null);
			}
		}
		return {
			getLibelleCommentaire: function () {
				let lResult =
					ObjetTraduction_1.GTraductions.getValeur("sso.Commentaire");
				if (lthis.donnees && lthis.donnees.profil) {
					switch (lthis.donnees.profil) {
						case TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas
							.pucProfesseurs:
							lResult +=
								" (" +
								ObjetTraduction_1.GTraductions.getValeur(
									"sso.messages.professeur",
								) +
								")";
							break;
						case TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucParents:
							lResult +=
								" (" +
								ObjetTraduction_1.GTraductions.getValeur(
									"sso.messages.parent",
								) +
								")";
							break;
						case TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucEleves:
							lResult +=
								" (" +
								ObjetTraduction_1.GTraductions.getValeur("sso.messages.eleve") +
								")";
							break;
						case TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas
							.pucInspecteurs:
							lResult +=
								" (" +
								ObjetTraduction_1.GTraductions.getValeur(
									"sso.messages.inspecteur",
								) +
								")";
							break;
						case TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas
							.pucMaitresDeStage:
							lResult +=
								" (" +
								ObjetTraduction_1.GTraductions.getValeur(
									"sso.messages.maitreDeStage",
								) +
								")";
							break;
						case TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas
							.pucPersonnelsAdministratifs:
						case TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas
							.pucPersonnelsTechniques:
							lResult +=
								" (" +
								ObjetTraduction_1.GTraductions.getValeur(
									"sso.messages.personnel",
								) +
								")";
							break;
						default:
							break;
					}
				}
				return lResult;
			},
			commentaire: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.commentaire
						? lthis.donnees.commentaire
						: "";
				},
				setValue: function (aValue) {
					lthis.donnees.commentaire = aValue;
				},
			},
			nom: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.nom ? lthis.donnees.nom : "";
				},
				setValue: function (aValue) {
					lthis.donnees.nom = aValue;
				},
			},
			nomCAS: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.nomCAS
						? lthis.donnees.nomCAS
						: "";
				},
				setValue: function () {},
				getDisabled: function () {
					return true;
				},
			},
			prenom: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.prenom
						? lthis.donnees.prenom
						: "";
				},
				setValue: function (aValue) {
					lthis.donnees.prenom = aValue;
				},
			},
			prenomCAS: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.prenomCAS
						? lthis.donnees.prenomCAS
						: "";
				},
				setValue: function () {},
				getDisabled: function () {
					return true;
				},
			},
			dateNaissance: {
				getValue: function () {
					lDateStr =
						lDateStr !== null
							? lDateStr
							: lthis.donnees && lthis.donnees.dateNaissance
								? ObjetDate_1.GDate.formatDate(
										lthis.donnees.dateNaissance,
										"%JJ/%MM/%AAAA",
									)
								: "";
					return lDateStr;
				},
				setValue: function (aValue) {
					lDateStr = aValue;
				},
				exitChange: function () {
					const dateParts = lDateStr.split("/");
					const lDate = new Date(
						+dateParts[2],
						dateParts[1] - 1,
						+dateParts[0],
					);
					if (lDate && ObjetDate_1.GDate.estDateValide(lDate)) {
						lthis.donnees.dateNaissance = lDate;
					}
				},
			},
			dateNaissanceCAS: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.dateNaissanceCAS
						? ObjetDate_1.GDate.formatDate(
								lthis.donnees.dateNaissanceCAS,
								"%JJ/%MM/%AAAA",
							)
						: "";
				},
				setValue: function () {},
				getDisabled: function () {
					return true;
				},
			},
			codePostal: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.codePostal
						? lthis.donnees.codePostal
						: "";
				},
				setValue: function (aValue) {
					lthis.donnees.codePostal = aValue;
				},
			},
			classe: {
				getValue: function (aIndice) {
					if (aIndice === -1) {
						return lthis.donnees &&
							lthis.donnees.informationsSupplementaires &&
							lthis.donnees.informationsSupplementaires.classe
							? lthis.donnees.informationsSupplementaires.classe
							: "";
					} else {
						const lEleve = lthis.getEleveDIndice(aIndice);
						return lEleve && lEleve.classe ? lEleve.classe : "";
					}
				},
				setValue: function (aIndice, aValue) {
					if (!lthis.donnees.informationsSupplementaires) {
						lthis.donnees.informationsSupplementaires = {};
					}
					if (aIndice === -1) {
						lthis.donnees.informationsSupplementaires.classe = aValue;
					} else {
						const lEleve = lthis.getEleveDIndice(aIndice);
						if (!!lEleve) {
							lEleve.classe = aValue;
						}
					}
				},
			},
			ajoutEleves: function () {
				const lHtml = [];
				if (
					lthis.donnees.informationsSupplementaires &&
					lthis.donnees.informationsSupplementaires.eleves
				) {
					for (
						let i = 0;
						i < lthis.donnees.informationsSupplementaires.eleves.length;
						i++
					) {
						lHtml.push(lthis._composeInfosEleve(i));
					}
				}
				return lHtml.join("");
			},
			nomEleve: {
				getValue: function (aIndice) {
					const lEleve = lthis.getEleveDIndice(aIndice);
					return lEleve && lEleve.nom ? lEleve.nom : "";
				},
				setValue: function (aIndice, aValue) {
					if (!lthis.donnees.informationsSupplementaires) {
						lthis.donnees.informationsSupplementaires = {};
					}
					const lEleve = lthis.getEleveDIndice(aIndice);
					if (!!lEleve) {
						lEleve.nom = aValue;
					}
				},
			},
			prenomEleve: {
				getValue: function (aIndice) {
					const lEleve = lthis.getEleveDIndice(aIndice);
					return lEleve && lEleve.prenom ? lEleve.prenom : "";
				},
				setValue: function (aIndice, aValue) {
					if (!lthis.donnees.informationsSupplementaires) {
						lthis.donnees.informationsSupplementaires = {};
					}
					const lEleve = lthis.getEleveDIndice(aIndice);
					if (!!lEleve) {
						lEleve.prenom = aValue;
					}
				},
			},
			dateNaissanceEleve: {
				getValue: function (aIndice) {
					const lEleve = lthis.getEleveDIndice(aIndice);
					if (
						lDateStrE.length <
						lthis.donnees.informationsSupplementaires.eleves.length
					) {
						lDateStrE.push("");
					}
					lDateStrE[aIndice] =
						lDateStrE[aIndice] !== null
							? lDateStrE[aIndice]
							: lEleve && lEleve.dateNaissance
								? ObjetDate_1.GDate.formatDate(
										lEleve.dateNaissance,
										"%JJ/%MM/%AAAA",
									)
								: "";
					return lDateStrE[aIndice];
				},
				setValue: function (aIndice, aValue) {
					lDateStrE[aIndice] = aValue;
				},
				exitChange: function (aIndice) {
					const dateParts = lDateStrE[aIndice].split("/");
					const lDate = new Date(
						+dateParts[2],
						+dateParts[1] - 1,
						+dateParts[0],
					);
					if (lDate && ObjetDate_1.GDate.estDateValide(lDate)) {
						const lEleve = lthis.getEleveDIndice(aIndice);
						if (!!lEleve) {
							lEleve.dateNaissance = lDate;
						}
					}
				},
			},
			codePostalCAS: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.codePostalCAS
						? lthis.donnees.codePostalCAS
						: "";
				},
				setValue: function () {},
				getDisabled: function () {
					return true;
				},
			},
			email: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.email
						? lthis.donnees.email
						: "";
				},
				setValue: function (aValue) {
					lthis.donnees.email = aValue;
				},
			},
			indicatif: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.indicatif
						? lthis.donnees.indicatif
						: "";
				},
				setValue: function (aValue) {
					IE.log.addLog(aValue);
					lthis.donnees.indicatif = aValue;
					lthis.donnees.telephone =
						lthis.donnees.indicatif + " " + lthis.donnees.numeroTel;
				},
			},
			telephone: {
				getValue: function () {
					return lthis.donnees && lthis.donnees.numeroTel
						? lthis.donnees.numeroTel
						: "";
				},
				setValue: function (aValue) {
					IE.log.addLog(aValue);
					lthis.donnees.numeroTel = aValue;
					lthis.donnees.telephone =
						lthis.donnees.indicatif + " " + lthis.donnees.numeroTel;
				},
			},
			ajouterEleve: {
				event: function () {
					if (lthis.ajouterUnEleve()) {
						lDateStrE.push(null);
					}
				},
				getDisabled: function () {
					let lEleve;
					if (
						lthis.donnees &&
						lthis.donnees.informationsSupplementaires &&
						lthis.donnees.informationsSupplementaires.eleves
					) {
						if (lthis.donnees.informationsSupplementaires.eleves.length === 0) {
							return false;
						} else {
							lEleve = lthis.getEleveDIndice(
								lthis.donnees.informationsSupplementaires.eleves.length - 1,
							);
						}
					}
					return !lEleve || lEleve.nom === "" || lEleve.prenom === "";
				},
			},
			btnSupprimer: {
				event: function (aIndice) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"sso.ConfirmationSuppression",
						),
						callback: function (aGenreAction) {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								lthis.supprimerEleve(aIndice, lDateStrE);
							}
						},
					});
				},
			},
			valider: {
				event: function () {
					lthis.valider();
				},
				getDisabled: function () {
					if (
						lthis.donnees.codeErreur ===
							TypeErreurCAS_1.TypeErreurCAS.eEduConnect_NonTrouve ||
						lthis.donnees.codeErreur ===
							TypeErreurCAS_1.TypeErreurCAS.eEduConnect_Responsabilite
					) {
						return (
							!lthis.donnees ||
							(lthis.donnees.nom === "" && lthis.donnees.nomCAS === "") ||
							(lthis.donnees.prenom === "" && lthis.donnees.prenomCAS === "")
						);
					} else {
						return !lthis.donnees;
					}
				},
			},
			displayDiscipline: function () {
				return (
					lthis.donnees &&
					lthis.donnees.profil ===
						TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucInspecteurs
				);
			},
		};
	}
	_composeLiens() {
		this.etatSaisie = true;
		const lHtml = [];
		lHtml.push(
			'<div class="taille-s" style="padding: 20px;">',
			'<div class="taille-m GrandEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.InfoLien1"),
			"</div>",
			'<div class="taille-m EspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.InfoLien2"),
			"</div>",
		);
		lHtml.push('<div style="padding: 10px;">');
		for (let i = 0; i < this.donnees.liens.count(); i++) {
			const lBouton = this.donnees.liens.get(i);
			lHtml.push(
				'<a href="',
				lBouton.url,
				new UtilitaireRedirection_1.UtilitaireRedirection().getParametresUrl(),
				'" ',
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Button),
				' target="_self" tabindex="0" accessKey="',
				i + 1,
				'" ',
				'class="AvecMain taille-l" style="display:block;height:30px;line-height:30px;padding:7px 0;',
				' cursor:pointer;" onkeyup="if (GNavigateur.isToucheEspace ()) this.click()">',
				lBouton.getLibelle(),
				"</a>",
			);
		}
		lHtml.push("</div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_composeLienRacine() {
		this.etatSaisie = true;
		const lHtml = [];
		lHtml.push(
			'<div class="taille-s" style="padding: 20px;">',
			'<div class="taille-m GrandEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.InfoLien1"),
			"</div>",
			'<div class="taille-m EspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.InfoLien3"),
			"</div>",
		);
		lHtml.push('<div style="padding: 10px;">');
		lHtml.push(
			'<a href="./" ',
			ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Button),
			' target="_self" tabindex="0" accessKey="',
			1,
			'" ',
			'class="AvecMain taille-l" style="display:block;height:30px;line-height:30px;padding:7px 0;',
			' cursor:pointer;" onkeyup="if (GNavigateur.isToucheEspace ()) this.click()">',
			this._getURLRacine(),
			"</a>",
		);
		lHtml.push("</div>");
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_getURLRacine() {
		const lUrl = window.location.href.split("/");
		lUrl.pop();
		return lUrl.join("/") + "/";
	}
	_composeErreurMessage() {
		this.etatSaisie = true;
		const lHtml = [];
		lHtml.push('<div class="taille-s" style="padding: 20px;">');
		lHtml.push(
			'<div class="taille-m GrandEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.InfoMessage"),
			"</div>",
		);
		lHtml.push(
			'<div class="taille-m GrandEspaceBas">',
			this.donnees.messageErreur,
			"</div>",
		);
		lHtml.push(
			'<div class="taille-m EspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.FermezNavigateur"),
			"</div>",
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_composeGenerique(aEstEduConnect) {
		this.etatSaisie = true;
		const lHtml = [];
		const lMessage = aEstEduConnect
			? ObjetTraduction_1.GTraductions.getValeur(
					"sso.erreurGeneriqueEduConnect",
				)
			: ObjetTraduction_1.GTraductions.getValeur("sso.erreurGenerique");
		lHtml.push('<div class="taille-s" style="padding: 20px;">');
		lHtml.push('<div class="taille-m GrandEspaceBas">', lMessage, "</div>");
		lHtml.push(
			'<div class="taille-m EspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.adminInforme"),
			"</div>",
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_composeAutreMessage() {
		this.etatSaisie = true;
		const lHtml = [];
		lHtml.push('<div class="taille-s" style="padding: 20px;">');
		if (this.donnees.messageErreur) {
			lHtml.push(
				'<div class="taille-m GrandEspaceBas">',
				this.donnees.messageErreur,
				"</div>",
			);
		}
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_composeInfosEleve(aIndice) {
		const lHtml = [];
		lHtml.push('<div style="margin: .6rem; width : 36rem; display: flex;">');
		lHtml.push('<div style="width : 33rem; flex: none;">');
		lHtml.push(
			'<div class="Espace">',
			'<div class="InlineBlock" style="width:13rem;"><label for="',
			this.idnomEleve,
			aIndice,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Nom"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idnomEleve,
			aIndice,
			'" ',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "nomEleve", aIndice),
			' class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		lHtml.push(
			'<div class="EspaceBas EspaceGauche">',
			'<div class="InlineBlock" style="width:13rem;"><label for="',
			this.idprenomEleve,
			aIndice,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Prenom"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idprenomEleve,
			aIndice,
			'" ',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "prenomEleve", aIndice),
			' class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		lHtml.push(
			'<div class="EspaceBas EspaceGauche">',
			'<div class="InlineBlock" style="width:13rem;"><label for="',
			this.iddatenaissanceEleve,
			aIndice,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.DateNaissance"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.iddatenaissanceEleve,
			aIndice,
			'" ',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "dateNaissanceEleve", aIndice),
			' class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		lHtml.push(
			'<div class="EspaceBas EspaceGauche">',
			'<div class="InlineBlock" style="width:13rem;"><label for="',
			this.idclasse,
			aIndice,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Classe"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idclasse,
			aIndice,
			'" ',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "classe", aIndice),
			' class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		lHtml.push("</div>");
		lHtml.push(
			'<div class="Espace"><ie-btnicon ',
			ObjetHtml_1.GHtml.composeAttr("ie-model", "btnSupprimer", aIndice),
			' ie-hint="',
			ObjetTraduction_1.GTraductions.getValeur("sso.hintSupprimer"),
			'" class="icon_trash Texte18"></ie-btnicon></div>',
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_composeEduConnect() {
		const lHtml = [];
		lHtml.push('<div class="taille-s" style="padding: 20px;">');
		lHtml.push(
			'<div class="Gras taille-l GrandEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Info1"),
			"</div>",
		);
		lHtml.push(
			'<div class="Gras taille-m GrandEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.TitreCommentaire"),
			"</div>",
		);
		lHtml.push(
			'<div class="EspaceBas GrandEspaceGauche">',
			'<div class="InlineBlock" style="width:13rem;"><label for="',
			this.idnom,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Nom"),
			" *</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idnom,
			'" ie-model="nom" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		lHtml.push(
			'<div class="EspaceBas GrandEspaceGauche">',
			'<div class="InlineBlock" style="width:13rem;"><label for="',
			this.idprenom,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Prenom"),
			" *</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idprenom,
			'" ie-model="prenom" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		if (
			this.donnees.profil ===
			TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucEleves
		) {
			lHtml.push(
				'<div class="EspaceBas GrandEspaceGauche">',
				'<div class="InlineBlock" style="width:13rem;"><label for="',
				this.iddatenaissance,
				'">',
				ObjetTraduction_1.GTraductions.getValeur("sso.DateNaissance"),
				"</label></div>",
				'<div class="InlineBlock EspaceGauche"><input id="',
				this.iddatenaissance,
				'" ie-model="dateNaissance" class="style-input" style="width:18rem; margin: 0px; ',
				'" type="text" tabindex="0" /></div>',
				"</div>",
			);
		}
		lHtml.push(
			'<div class="EspaceBas GrandEspaceGauche">',
			'<div class="InlineBlock" style="width:13rem;"><label for="',
			this.idcodepostal,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.CodePostal"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idcodepostal,
			'" ie-model="codePostal" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		if (
			this.donnees.profil ===
			TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucEleves
		) {
			lHtml.push(
				'<div class="EspaceBas GrandEspaceGauche">',
				'<div class="InlineBlock" style="width:13rem;"><label for="',
				this.idclasse,
				'">',
				ObjetTraduction_1.GTraductions.getValeur("sso.Classe"),
				"</label></div>",
				'<div class="InlineBlock EspaceGauche"><input id="',
				this.idclasse,
				'" ',
				ObjetHtml_1.GHtml.composeAttr("ie-model", "classe", -1),
				' class="style-input" style="width:18rem; margin: 0px; ',
				'" type="text" tabindex="0" /></div>',
				"</div>",
			);
		} else if (
			this.donnees.profil ===
			TypeProfilUtilisateurCas_1.TypeProfilUtilisateurCas.pucParents
		) {
			lHtml.push(
				'<div class="Gras taille-m EspaceHaut EspaceBas">',
				ObjetTraduction_1.GTraductions.getValeur("sso.TitreInfosEleve"),
				"</div>",
			);
			lHtml.push('<div ie-html="ajoutEleves"></div>');
			lHtml.push(
				'<div class="EspaceHaut"><ie-bouton ie-model="ajouterEleve">',
				ObjetTraduction_1.GTraductions.getValeur("sso.AjouterEleve"),
				"</ie-bouton></div>",
			);
		}
		lHtml.push(
			'<div class="GrandEspaceHaut GrandEspaceGauche EspaceBas Gras">',
			ObjetTraduction_1.GTraductions.getValeur("sso.InfoContact"),
			"</div>",
			'<div class="EspaceBas GrandEspaceGauche flex-contain">',
			'<div class="InlineBlock fix-bloc" style="width:10rem;"><label for="',
			this.idemail,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Email"),
			"</label></div>",
			'<div class="InlineBlock"><input id="',
			this.idemail,
			'" ie-model="email" ie-trim class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
			'<div class="GrandEspaceBas GrandEspaceGauche flex-contain">',
			'<div class="InlineBlock fix-bloc" style="width:10rem;"><label for="',
			this.idtelephone,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Telephone"),
			"</label></div>",
			'<div class="InlineBlock"><input id="',
			this.idIndicatif,
			'" ie-model="indicatif" ie-indicatiftel class="style-input" style="width:4.5rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idtelephone,
			'" ie-model="telephone" ie-telephone class="style-input" style="width:13rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
		);
		lHtml.push(
			'<div class="NoWrap flex-contain" style="padding: 10px 5px; border: 1px solid #DFE5CF;">',
			'<div class="InlineBlock AlignementMilieuVertical Image_Attention fix-bloc" style="width:1.6rem;"></div>',
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			ObjetTraduction_1.GTraductions.getValeur("sso.messages.alertValider"),
			" (*",
			ObjetTraduction_1.GTraductions.getValeur(
				"sso.messages.champsObligatoire",
			),
			")</div>",
			'<div class="InlineBlock AlignementMilieuVertical AlignementDroit EspaceGauche fix-bloc"><ie-bouton ie-model="valider">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Valider"),
			"</ie-bouton></div>",
			"</div>",
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	_composeInfo() {
		const lHtml = [];
		lHtml.push(
			'<div class="taille-s" style="padding: 20px;">',
			'<div class="Gras taille-l GrandEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Info1"),
			"</div>",
			'<div class="Gras taille-m GrandEspaceBas">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Info2"),
			"</div>",
			'<div class="EspaceBas GrandEspaceGauche flex-contain flex-center">',
			'<div class="InlineBlock fix-bloc" style="width:13rem;"><label for="',
			this.idnom,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Nom"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idnom,
			'" ie-model="nom" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
			'<div class="EspaceBas GrandEspaceGauche flex-contain flex-center">',
			'<div class="InlineBlock fix-bloc" style="width:13rem;"><label for="',
			this.idprenom,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Prenom"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idprenom,
			'" ie-model="prenom" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
			'<div class="EspaceBas GrandEspaceGauche flex-contain flex-center">',
			'<div class="InlineBlock fix-bloc" style="width:13rem;"><label for="',
			this.iddatenaissance,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.DateNaissance"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.iddatenaissance,
			'" ie-model="dateNaissance" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
			'<div class="EspaceBas GrandEspaceGauche flex-contain flex-center">',
			'<div class="InlineBlock fix-bloc" style="width:13rem;"><label for="',
			this.idcodepostal,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.CodePostal"),
			"</label></div>",
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idcodepostal,
			'" ie-model="codePostal" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
			'<div class="Gras taille-m GrandEspaceHaut EspaceBas10">',
			ObjetTraduction_1.GTraductions.getValeur("sso.TitreCommentaire"),
			"</div>",
			'<div class="Gras GrandEspaceGauche EspaceBas"><label for="',
			this.idcommentaire,
			'" ie-html="getLibelleCommentaire">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Commentaire"),
			"</label></div>",
			'<div class="GrandEspaceGauche EspaceBas" ie-display="displayDiscipline"><div id="',
			this.selectDisciplines.getNom(),
			'"></div></div>',
			'<div class="GrandEspaceGauche"><textarea id="',
			this.idcommentaire,
			'" rows="4" ie-model="commentaire" class="round-style" style="width:605px; min-height: 5.8rem; margin: 0px; ',
			'" type="text" tabindex="0"></textarea></div>',
			'<div class="GrandEspaceHaut GrandEspaceGauche EspaceBas Gras">',
			ObjetTraduction_1.GTraductions.getValeur("sso.InfoContact"),
			"</div>",
			'<div class="EspaceBas GrandEspaceGauche flex-contain">',
			'<div class="InlineBlock fix-bloc" style="width:10rem;"><label for="',
			this.idemail,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Email"),
			"</label></div>",
			'<div class="InlineBlock"><input id="',
			this.idemail,
			'" ie-model="email" class="style-input" style="width:18rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
			'<div class="GrandEspaceBas GrandEspaceGauche flex-contain">',
			'<div class="InlineBlock fix-bloc" style="width:10rem;"><label for="',
			this.idtelephone,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Telephone"),
			"</label></div>",
			'<div class="InlineBlock"><input id="',
			this.idIndicatif,
			'" ie-model="indicatif" ie-indicatiftel class="style-input" style="width:4.5rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			'<div class="InlineBlock EspaceGauche"><input id="',
			this.idtelephone,
			'" ie-model="telephone" ie-telephone class="style-input" style="width:13rem; margin: 0px; ',
			'" type="text" tabindex="0" /></div>',
			"</div>",
			'<div class="flex-contain" style="padding: 10px 5px; border: 1px solid #DFE5CF;">',
			'<div class="InlineBlock AlignementMilieuVertical Image_Attention fix-bloc" style="width:1.6rem;"></div>',
			'<div class="InlineBlock AlignementMilieuVertical EspaceGauche">',
			ObjetTraduction_1.GTraductions.getValeur("sso.messages.alertValider"),
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical AlignementDroit EspaceGauche fix-bloc"><ie-bouton style="width:9.2rem;" ie-model="valider">',
			ObjetTraduction_1.GTraductions.getValeur("sso.Valider"),
			"</ie-bouton></div>",
			"</div>",
			"</div>",
		);
		return lHtml.join("");
	}
	_messageReussi() {
		return (
			'<div class="taille-s" style="padding: 20px;"><div class="Gras taille-l GrandEspaceBas">' +
			ObjetTraduction_1.GTraductions.getValeur("sso.messages.validerInfo") +
			"</div></div>"
		);
	}
}
exports.ObjetApplicationPageGestionSSO = ObjetApplicationPageGestionSSO;
class ObjetParametresGestionSSO extends ObjetParametresCP_1.ObjetParametresCP {
	getCookieValidationAppli() {
		return "";
	}
}
