const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { TUtilitaireRencontre } = require("UtilitaireRencontres.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const DonneesListe_RencontresDesiderata = require("DonneesListe_RencontresDesiderata.js");
const ObjetRequeteSaisieRencontreDesiderata = require("ObjetRequeteSaisieRencontreDesiderata.js");
const { GTraductions } = require("ObjetTraduction.js");
const ObjetSaisieIndisponibilite = require("ObjetSaisieIndisponibilite.js");
const { ObjetBoutonFlottant } = require("ObjetBoutonFlottant.js");
const { GUID } = require("GUID.js");
const { GDate } = require("ObjetDate.js");
const { GHtml } = require("ObjetHtml.js");
class PageRencontresDesiderata extends ObjetIdentite_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.msgInfoDate = GUID.getId();
		this.nbreNonRenseigne = GUID.getId();
		this.donnees = {
			sessionRencontre: null,
			indisponibilites: null,
			desiderata: null,
			classeSelectionnee: null,
		};
		this.nombreVoeuxNonRenseigne = null;
		this.instanceListe = Identite.creerInstance(ObjetListe, {
			pere: this,
			evenement: _evenementListeRencontres.bind(this),
		});
		this.identIndisponibilite = Identite.creerInstance(
			ObjetSaisieIndisponibilite,
			{ pere: this, evenement: _evenementSaisieIndispo.bind(this) },
		);
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
									icone: "icon_legende",
									callback: _afficherLegende.bind(aInstance),
								},
							],
						};
						aBtn.setOptionsBouton(lParam);
					},
				};
			},
			btnLegende: {
				getDisplay: function () {
					return (
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
					? GTraductions.getValeur("Rencontres.desiderata.NonRenseignes", [
							aInstance.nombreVoeuxNonRenseigne,
						])
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
			`<h4 class="m-left-l ie-titre" ie-display="disponibilite.getDisplay">${GTraductions.getValeur("Rencontres.MesDisponibilites")}</h4>`,
		);
		H.push('<div id="', this.identIndisponibilite.getNom(), '"></div>');
		H.push(
			`<h4 class="m-left-l ie-titre" ie-display="desiderata.getDisplay">${GTraductions.getValeur("Rencontres.PriorisationRencontres")}</h4>`,
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
			$("#" + GInterface.idZonePrincipale).ieHtmlAppend(
				'<div class="is-sticky" ie-display="btnLegende.getDisplay" ie-identite="getIdentiteBouton" ></div>',
				{ controleur: this.controleur, avecCommentaireConstructeur: false },
			);
		}
		return H.join("");
	}
	actualiserListe() {
		let lListeRencontres;
		if (this.desiderata) {
			if (GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Parent) {
				this.desiderata.listeRencontres.setTri([
					ObjetTri.init((D) => {
						return D.strMatiereFonction || "";
					}),
				]);
				this.desiderata.listeRencontres.trier();
				lListeRencontres =
					TUtilitaireRencontre.formaterListeRencontresAvecProfesseurs(
						this.desiderata.listeRencontres,
					);
			} else {
				this.desiderata.listeRencontres.setTri([
					ObjetTri.init((D) => {
						return D.classe.getLibelle();
					}),
					ObjetTri.init((D) => {
						return D.eleve.getLibelle();
					}),
					ObjetTri.init((D) => {
						return D.eleve.getNumero();
					}),
					ObjetTri.init((D) => {
						return D.strMatiereFonction || "";
					}),
					ObjetTri.init((D) => {
						return D.strResponsables || "";
					}),
				]);
				this.desiderata.listeRencontres.trier();
				lListeRencontres =
					TUtilitaireRencontre.formaterListeRencontresAvecParents(
						this.desiderata.listeRencontres,
					);
			}
			const lDateCourante = GDate.getDateCourante();
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
						GTraductions.getValeur("Rencontres.desiderata.saisieEntre", [
							GDate.formatDate(
								this.desiderata.dateDebutSaisie,
								"%JJ/%MM/%AAAA",
							),
							GDate.formatDate(this.desiderata.dateFinSaisie, "%JJ/%MM/%AAAA"),
						]),
					);
				} else if (
					lDateCourante >= this.desiderata.dateDebutSaisie &&
					lDateCourante <= this.desiderata.dateFinSaisie
				) {
					lLibelle.push(
						GTraductions.getValeur("Rencontres.desiderata.saisieJusquA", [
							GDate.formatDate(this.desiderata.dateFinSaisie, "%JJ/%MM/%AAAA"),
						]),
					);
				} else if (lDateCourante > this.desiderata.dateFinSaisie) {
					lLibelle.push(
						GTraductions.getValeur("Rencontres.desiderata.saisieCloturee"),
					);
				}
			}
			if (lLibelle) {
				let lMessage = `<span class="Gras">${lLibelle.join(" ")}</span>`;
				if (lAvecImageAucuneDonnees) {
					lMessage = this.composeAucuneDonnee(lLibelle.join(" "));
				}
				GHtml.setHtml(this.msgInfoDate, lMessage, { instance: this });
			}
			const lAvecEleve =
				GEtatUtilisateur.GenreEspace !== EGenreEspace.Mobile_Parent;
			this.listeRencontres = lListeRencontres;
			this.nombreVoeuxNonRenseigne = this.listeRencontres
				.getListeElements((aRencontre) => {
					return !aRencontre.estUnDeploiement && !aRencontre.validationvoeu;
				})
				.count();
			this.instanceListe
				.setOptionsListe({ skin: ObjetListe.skin.flatDesign })
				.setDonnees(
					new DonneesListe_RencontresDesiderata(lListeRencontres, {
						avecEleve: lAvecEleve,
						avecSaisie: this.desiderata.avecSaisie,
						autorisations: this.desiderata.autorisations,
						callbackDuree: _modifierDuree.bind(this),
					}).setOptions({ avecSelection: false }),
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
		new ObjetRequeteSaisieRencontreDesiderata(
			this,
			this.actionSurValidation,
		).lancerRequete({ session: this.session, listeRencontres: aRencontres });
	}
	free(...aParams) {
		super.free(...aParams);
		if (this.identBtnFlottant) {
			$("#" + this.identBtnFlottant.getNom().escapeJQ()).remove();
		}
	}
}
function _evenementListeRencontres(aParams) {
	switch (aParams.genreEvenement) {
		case EGenreEvenementListe.ApresEdition: {
			const lListeRencontres = new ObjetListeElements();
			lListeRencontres.add(aParams.article);
			this.valider(lListeRencontres);
			this.actualiserListe();
			break;
		}
	}
}
function _modifierDuree(aRencontre) {
	const lListeRencontres = new ObjetListeElements();
	lListeRencontres.add(aRencontre);
	this.valider(lListeRencontres);
	this.actualiserListe();
}
function _afficherLegende() {
	const lListeVoeux =
		this.desiderata &&
		this.desiderata.autorisations &&
		this.desiderata.autorisations.listeVoeux
			? this.desiderata.autorisations.listeVoeux
			: null;
	TUtilitaireRencontre.ouvrirFenetreLegende(lListeVoeux);
}
function _evenementSaisieIndispo() {
	this.Evenement();
}
module.exports = PageRencontresDesiderata;
