exports.PageRencontresDesiderata = void 0;
const ObjetIdentite_Mobile_1 = require("ObjetIdentite_Mobile");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetTri_1 = require("ObjetTri");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireRencontres_1 = require("UtilitaireRencontres");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_RencontresDesiderata_1 = require("DonneesListe_RencontresDesiderata");
const ObjetRequeteSaisieRencontreDesiderata_1 = require("ObjetRequeteSaisieRencontreDesiderata");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetSaisieIndisponibilite_1 = require("ObjetSaisieIndisponibilite");
const ObjetBoutonFlottant_1 = require("ObjetBoutonFlottant");
const GUID_1 = require("GUID");
const ObjetDate_1 = require("ObjetDate");
const ObjetHtml_1 = require("ObjetHtml");
const AccessApp_1 = require("AccessApp");
class PageRencontresDesiderata extends ObjetIdentite_Mobile_1.ObjetIdentite_Mobile {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
		this.msgInfoDate = GUID_1.GUID.getId();
		this.nbreNonRenseigne = GUID_1.GUID.getId();
		this.donnees = {
			sessionRencontre: null,
			indisponibilites: null,
			desiderata: null,
			classeSelectionnee: null,
		};
		this.nombreVoeuxNonRenseigne = null;
		this.instanceListe = new ObjetListe_1.ObjetListe({ pere: this });
		this.identIndisponibilite =
			new ObjetSaisieIndisponibilite_1.ObjetSaisieIndisponibilite({
				pere: this,
				evenement: this._evenementSaisieIndispo.bind(this),
			});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getIdentiteBouton: function () {
				return {
					class: ObjetBoutonFlottant_1.ObjetBoutonFlottant,
					pere: this,
					init: function (aBtn) {
						aInstance.identBtnFlottant = aBtn;
						const lParam = {
							listeBoutons: [
								{
									primaire: true,
									icone: "icon_legende",
									callback: aInstance._afficherLegende.bind(aInstance),
									ariaLabel:
										ObjetTraduction_1.GTraductions.getValeur("Legende"),
								},
							],
						};
						aBtn.setOptionsBouton(lParam);
					},
				};
			},
			btnLegende: {
				getDisplay: function () {
					return !!(
						aInstance.desiderata &&
						aInstance.desiderata.autorisations &&
						aInstance.desiderata.autorisations.listeVoeux
					);
				},
			},
			information: {
				getDisplay: function () {
					return !!aInstance.information;
				},
				getHtml: function () {
					return aInstance.information ? `${aInstance.information}` : "";
				},
			},
			getNombreNonRenseigne: function () {
				return aInstance.nombreVoeuxNonRenseigne
					? ObjetTraduction_1.GTraductions.getValeur(
							"Rencontres.desiderata.NonRenseignes",
							[aInstance.nombreVoeuxNonRenseigne],
						)
					: "";
			},
			disponibilite: {
				getDisplay: function () {
					return (
						!!aInstance.indisponibilites &&
						aInstance.indisponibilites.avecSaisie
					);
				},
			},
			desiderata: {
				getDisplay: function () {
					return !!aInstance.desiderata;
				},
			},
		});
	}
	setDonnees(aDonnees) {
		this.session = aDonnees.sessionRencontre;
		this.desiderata = aDonnees.desiderata;
		this.indisponibilites = aDonnees.indisponibilites;
		this.information = aDonnees.information;
		this.autorisations = aDonnees.autorisations;
		this.actualiserListe();
	}
	construireAffichage() {
		const H = [];
		H.push(
			`<div id="${this.msgInfoDate}" class="flex-contain justify-between m-left-l m-top-xl m-bottom-l" ></div>`,
		);
		H.push(
			'<p class="m-left-l m-top-l" ie-html="information.getHtml" ie-display="information.getDisplay"></p>',
		);
		H.push(
			`<h4 class="m-left-l ie-titre" ie-display="disponibilite.getDisplay">${ObjetTraduction_1.GTraductions.getValeur("Rencontres.MesDisponibilites")}</h4>`,
		);
		H.push('<div id="', this.identIndisponibilite.getNom(), '"></div>');
		H.push(
			`<h4 class="m-left-l ie-titre" ie-display="desiderata.getDisplay">${ObjetTraduction_1.GTraductions.getValeur("Rencontres.PriorisationRencontres")}</h4>`,
		);
		H.push(
			`<div id="${this.nbreNonRenseigne}" class="flex-contain justify-between m-left-l m-top-s" ><div ie-html="getNombreNonRenseigne"></div></div>`,
		);
		H.push(
			'<div class="PetitEspace" id="',
			this.instanceListe.getNom(),
			'"></div>',
		);
		if (!this.identBtnFlottant) {
			$(
				"#" + (0, AccessApp_1.getApp)().getInterfaceMobile().idZonePrincipale,
			).ieHtmlAppend(
				'<div class="is-sticky" ie-display="btnLegende.getDisplay" ie-identite="getIdentiteBouton" ></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
		}
		return H.join("");
	}
	actualiserListe() {
		let lListeRencontres;
		if (this.desiderata) {
			if (
				GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Mobile_Parent
			) {
				this.desiderata.listeRencontres.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						return D.strMatiereFonction || "";
					}),
				]);
				this.desiderata.listeRencontres.trier();
				lListeRencontres =
					UtilitaireRencontres_1.TUtilitaireRencontre.formaterListeRencontresAvecProfesseurs(
						this.desiderata.listeRencontres,
					);
			} else {
				this.desiderata.listeRencontres.setTri([
					ObjetTri_1.ObjetTri.init((D) => {
						return D.classe.getLibelle();
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						return D.eleve.getLibelle();
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						return D.eleve.getNumero();
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						return D.strMatiereFonction || "";
					}),
					ObjetTri_1.ObjetTri.init((D) => {
						return D.strResponsables || "";
					}),
				]);
				this.desiderata.listeRencontres.trier();
				lListeRencontres =
					UtilitaireRencontres_1.TUtilitaireRencontre.formaterListeRencontresAvecParents(
						this.desiderata.listeRencontres,
					);
			}
			const lDateCourante = ObjetDate_1.GDate.getDateCourante();
			const lLibelle = [];
			let lAvecImageAucuneDonnees = false;
			if (
				this.autorisations &&
				(this.autorisations.saisieDesiderata ||
					this.autorisations.saisieDisponibilite)
			) {
				if (lDateCourante < this.desiderata.dateDebutSaisie) {
					lAvecImageAucuneDonnees = true;
					lLibelle.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"Rencontres.desiderata.saisieEntre",
							[
								ObjetDate_1.GDate.formatDate(
									this.desiderata.dateDebutSaisie,
									"%JJ/%MM/%AAAA",
								),
								ObjetDate_1.GDate.formatDate(
									this.desiderata.dateFinSaisie,
									"%JJ/%MM/%AAAA",
								),
							],
						),
					);
				} else if (
					lDateCourante >= this.desiderata.dateDebutSaisie &&
					lDateCourante <= this.desiderata.dateFinSaisie
				) {
					lLibelle.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"Rencontres.desiderata.saisieJusquA",
							[
								ObjetDate_1.GDate.formatDate(
									this.desiderata.dateFinSaisie,
									"%JJ/%MM/%AAAA",
								),
							],
						),
					);
				} else if (lDateCourante > this.desiderata.dateFinSaisie) {
					lLibelle.push(
						ObjetTraduction_1.GTraductions.getValeur(
							"Rencontres.desiderata.saisieCloturee",
						),
					);
				}
			}
			if (lLibelle) {
				let lMessage = `<span class="Gras">${lLibelle.join(" ")}</span>`;
				if (lAvecImageAucuneDonnees) {
					lMessage = this.composeAucuneDonnee(lLibelle.join(" "));
				}
				ObjetHtml_1.GHtml.setHtml(this.msgInfoDate, lMessage, {
					instance: this,
				});
			}
			const lAvecEleve =
				GEtatUtilisateur.GenreEspace !==
				Enumere_Espace_1.EGenreEspace.Mobile_Parent;
			this.listeRencontres = lListeRencontres;
			this.nombreVoeuxNonRenseigne = this.listeRencontres
				.getListeElements((aRencontre) => {
					return !aRencontre.estUnDeploiement && !aRencontre.validationvoeu;
				})
				.count();
			this.instanceListe
				.setOptionsListe({ skin: ObjetListe_1.ObjetListe.skin.flatDesign })
				.setDonnees(
					new DonneesListe_RencontresDesiderata_1.DonneesListe_RencontresDesiderata(
						lListeRencontres,
						{
							avecEleve: lAvecEleve,
							avecSaisie: this.desiderata.avecSaisie,
							autorisations: this.desiderata.autorisations,
							callbackDuree: this._modifierDuree.bind(this),
							callbackEditionDesiderata: (aRencontre) => {
								const lListeRencontres =
									new ObjetListeElements_1.ObjetListeElements([aRencontre]);
								this.valider(lListeRencontres);
								this.actualiserListe();
							},
						},
					).setOptions({ avecSelection: false }),
					null,
					{ conserverPositionScroll: true },
				);
		}
		if (this.indisponibilites) {
			this.identIndisponibilite.setVisible(this.indisponibilites.avecSaisie);
			if (this.indisponibilites && this.indisponibilites.avecSaisie) {
				this.identIndisponibilite.setDonnees({
					indisponibilites: this.indisponibilites,
					session: this.session,
				});
			}
		}
	}
	valider(aRencontres) {
		new ObjetRequeteSaisieRencontreDesiderata_1.ObjetRequeteSaisieRencontreDesiderata(
			this,
		).lancerRequete({ session: this.session, listeRencontres: aRencontres });
	}
	free() {
		super.free();
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
	_modifierDuree(aRencontre) {
		const lListeRencontres = new ObjetListeElements_1.ObjetListeElements([
			aRencontre,
		]);
		this.valider(lListeRencontres);
		this.actualiserListe();
	}
	_afficherLegende() {
		const lListeVoeux =
			this.desiderata &&
			this.desiderata.autorisations &&
			this.desiderata.autorisations.listeVoeux
				? this.desiderata.autorisations.listeVoeux
				: null;
		UtilitaireRencontres_1.TUtilitaireRencontre.ouvrirFenetreLegende(
			lListeVoeux,
		);
	}
	_evenementSaisieIndispo() {
		this.Evenement();
	}
}
exports.PageRencontresDesiderata = PageRencontresDesiderata;
