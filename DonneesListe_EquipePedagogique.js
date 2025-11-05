exports.DonneesListe_EquipePedagogique = void 0;
const AccessApp_1 = require("AccessApp");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_Discussion_1 = require("ObjetFenetre_Discussion");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const C_NBProfMax = 3;
class DonneesListe_EquipePedagogique extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, estAffichageNom) {
		super(aDonnees);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.estAffichageNom = estAffichageNom;
		this.setOptions({ avecSelection: false, avecEllipsis: false });
	}
	avecBoutonActionLigne() {
		return (
			!IE.estMobile &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
			) &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			)
		);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		const lAvecAfficherDiscussion =
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
			) &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			);
		if (lAvecAfficherDiscussion) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreCommunication.bouton.discussionsCommunes",
				),
				true,
				ObjetFenetre_Discussion_1.ObjetFenetre_Discussion.afficherDiscussionsCommunes.bind(
					this,
					new ObjetListeElements_1.ObjetListeElements().add(
						aParametres.article,
					),
				),
			);
		}
		aParametres.menuContextuel.setDonnees();
	}
	getTitreZonePrincipale(aParams) {
		let H = [];
		if (this.estAffichageNom) {
			H.push(
				`<div ie-ellipsis class="ie-titre" >${aParams.article.getLibelle()}</div>`,
			);
		} else if (
			aParams.article.getLibelle() !==
			ObjetTraduction_1.GTraductions.getValeur("EquipePedagogique.sansMatiere")
		) {
			if (aParams.article.volumeHoraire) {
				H.push(
					`<div class="ie-titre ellipsis-multilignes">${aParams.article.getLibelle()} (${aParams.article.volumeHoraire})</div>`,
				);
			} else {
				H.push(
					`<div class="ie-titre ellipsis-multilignes" >${aParams.article.getLibelle()}</div>`,
				);
			}
		}
		return H.join("");
	}
	getInfosSuppZonePrincipale(aParams) {
		let H = [];
		if (this.estAffichageNom) {
			if (aParams.article.estProfesseurPrincipal) {
				H.push(
					`<div class="ie-sous-titre capitalize" ><i class="icon_star" role="presentation"></i> `,
					ObjetTraduction_1.GTraductions.getValeur(
						"EquipePedagogique.professeurPrincipal",
					),
					`</div>`,
				);
			}
			if (aParams.article.estTuteur) {
				H.push(
					`<div class="ie-sous-titre capitalize" ><i class="icon_star" role="presentation"></i> `,
					ObjetTraduction_1.GTraductions.getValeur("EquipePedagogique.tuteur"),
					`</div>`,
				);
			}
			if (aParams.article.matieres) {
				aParams.article.matieres.parcourir((aMatiere) => {
					if (aMatiere.volumeHoraire) {
						H.push(
							`<p class="ie-sous-titre capitalize">${aMatiere.getLibelle()} (${aMatiere.volumeHoraire})</p>`,
						);
					} else {
						H.push(
							`<p class="ie-sous-titre capitalize">${aMatiere.getLibelle()}</p>`,
						);
					}
				});
			}
			if (aParams.article.email) {
				H.push(
					`<div><a href="mailto:${aParams.article.email}">${aParams.article.email}</a></div>`,
				);
			}
			if (aParams.article.fonction) {
				H.push(
					`<div class="ie-sous-titre capitalize">${aParams.article.fonction}</div>`,
				);
			}
		} else {
			if (aParams.article.listeProfesseursParMatiere) {
				aParams.article.listeProfesseursParMatiere.parcourir((aProf) => {
					if (aProf.matieres) {
						aProf.matieres.parcourir((aProf2) => {
							if (aProf2.estUneSousMatiere) {
								H.push(
									`<div class="ie-sous-titre capitalize">${aProf2.getLibelle()}</div>`,
								);
							}
						});
					}
					H.push(
						`<div class="ie-sous-titre capitalize">${aProf.getLibelle()}</div>`,
					);
					if (aProf.estProfesseurPrincipal) {
						H.push(
							`<div class="ie-sous-titre capitalize"><i class="icon_star" role="presentation"></i> `,
							ObjetTraduction_1.GTraductions.getValeur(
								"EquipePedagogique.professeurPrincipal",
							),
							`</div>`,
						);
					}
					if (aProf.estTuteur) {
						H.push(
							`<div class="ie-sous-titre capitalize"><i class="icon_star" role="presentation"></i> `,
							ObjetTraduction_1.GTraductions.getValeur(
								"EquipePedagogique.tuteur",
							),
							`</div>`,
						);
					}
					if (aProf.email) {
						H.push(
							`<div><a href="mailto:${aProf.email}">${aProf.email}</a></div>`,
						);
					}
				});
			}
			if (aParams.article.listePersonnels) {
				aParams.article.listePersonnels.parcourir((aPerso) => {
					if (aPerso.getLibelle()) {
						H.push(
							`<div class="ie-sous-titre capitalize">${aPerso.getLibelle()}</div>`,
						);
					}
					if (aPerso.email) {
						H.push(
							`<div><a href="mailto:${aPerso.email}">${aPerso.email}</a></div>`,
						);
					}
				});
			}
		}
		return H.join("");
	}
	getTotal(aEstHeader) {
		const _construireListeProf = (aListeProf, aEstPP) => {
			if (aListeProf) {
				const lLibelle = ObjetTraduction_1.GTraductions.getValeur(
					aEstPP
						? "EquipePedagogique.professeurPrincipal"
						: "EquipePedagogique.tuteur",
				);
				if (
					(aListeProf === null || aListeProf === void 0
						? void 0
						: aListeProf.count()) > C_NBProfMax
				) {
					return IE.jsx.str(
						"div",
						{ class: "m-bottom-l" },
						IE.jsx.str(
							"p",
							{ class: "ie-titre" },
							aListeProf.getTableauLibelles().join(", "),
						),
						IE.jsx.str(
							"p",
							{ class: "ie-sous-titre capitalize PetitEspaceBas" },
							lLibelle,
						),
					);
				} else {
					return IE.jsx.str(
						"dl",
						null,
						aListeProf.getTableau((aPP) =>
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str("dt", { class: "ie-titre" }, aPP.getLibelle()),
								IE.jsx.str(
									"dd",
									{ class: "ie-sous-titre capitalize PetitEspaceBas" },
									lLibelle,
								),
							),
						),
					);
				}
			}
		};
		if (aEstHeader) {
			const H = [];
			if (this.estAffichageNom) {
				const lListeProfPP = this.Donnees.getListeElements(
					(aElem) => aElem.estProfesseurPrincipal,
				);
				const lListeTuteurs = this.Donnees.getListeElements(
					(aElem) => aElem.estTuteur,
				);
				H.push(_construireListeProf(lListeProfPP, true));
				H.push(_construireListeProf(lListeTuteurs, false));
			} else {
				const lUniqueNomProfPrincipal =
					new ObjetListeElements_1.ObjetListeElements();
				let lUniqueNomTuteur = new ObjetListeElements_1.ObjetListeElements();
				this.Donnees.parcourir((aProf) => {
					var _a;
					(_a = aProf.listeProfesseursParMatiere) === null || _a === void 0
						? void 0
						: _a.parcourir((aProf) => {
								if (aProf.estProfesseurPrincipal) {
									if (lUniqueNomProfPrincipal.getElementParElement(aProf)) {
										return;
									}
									lUniqueNomProfPrincipal.add(aProf);
								}
								if (aProf.estTuteur) {
									if (lUniqueNomTuteur.getElementParElement(aProf)) {
										return;
									}
									lUniqueNomTuteur.add(aProf);
								}
							});
				});
				H.push(_construireListeProf(lUniqueNomProfPrincipal.trier(), true));
				H.push(_construireListeProf(lUniqueNomTuteur.trier(), false));
			}
			return { getHtml: () => H.join("") };
		}
	}
}
exports.DonneesListe_EquipePedagogique = DonneesListe_EquipePedagogique;
