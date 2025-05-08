const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const ObjetRequeteSaisieAppreciationFinDeStage = require("ObjetRequeteSaisieAppreciationFinDeStage.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_UploadFichiers,
} = require("ObjetFenetre_UploadFichiers.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetFenetre_AnnexePedagogiquePN,
} = require("ObjetFenetre_AnnexePedagogiquePN.js");
const { ObjetFenetre_SuiviStage } = require("ObjetFenetre_SuiviStage.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuCtxMixte } = require("ObjetMenuCtxMixte.js");
const { ETypeAffEnModeMixte } = require("Enumere_MenuCtxModeMixte.js");
const ObjetFenetre_AppreciationsStage = require("ObjetFenetre_AppreciationsStage.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	ObjetRequeteURLSignataire,
	TypeActionSignataire,
} = require("ObjetRequeteURLSignataire.js");
const { TUtilitairePartenaire } = require("UtilitairePartenaire.js");
const {
	TypeOrigineCreationLibelleDocJointEleve,
} = require("TypeOrigineCreationLibelleDocJointEleve.js");
const {
	TypeAnnexePedagogique,
	TypeModaliteDEvaluationMilieuProfessionnel,
} = require("TypesAnnexePedagogique.js");
const UtilitaireFicheStage = {};
UtilitaireFicheStage.composeBlocDetails = function (aDonnees, aParams) {
	const H = [];
	H.push(_composeBlocDetailsEntrepriseAccueil(aDonnees));
	if (!!aDonnees.maitreDeStage && aDonnees.maitreDeStage.count()) {
		H.push(_composeBlocDetailsMDS(aDonnees));
	}
	H.push(_composeBlocDetailsEnseignants(aDonnees));
	H.push(_composeBlocDetailsHoraires(aDonnees));
	if (
		(aDonnees.listePJ && aDonnees.listePJ.count()) ||
		(aDonnees.convention && aDonnees.convention.document)
	) {
		H.push(_composeBlocDocumentsJoints(aDonnees, aParams));
	}
	if (aParams.parametres.avecEditionDocumentsJoints) {
		_ajoutControleurEditionDetails(aDonnees, aParams);
	}
	return H.join("");
};
function _composeBlocDetailsEntrepriseAccueil(aDonnees) {
	const H = [];
	const lEntreprise = aDonnees.entreprise;
	if (lEntreprise) {
		H.push(
			`<section class="entreprise-accueil">\n              <h2 class="ie-titre-couleur">${GTraductions.getValeur("FicheStage.entrepriseAccueil")}</h2>\n                <div class="flex-wrapper">`,
		);
		H.push(`<div class="sous-section">`);
		H.push(
			tag(
				"div",
				{ class: "conteneur-nom" },
				tag("i", {
					class: !!lEntreprise.estSiegeSocial
						? "icon_building"
						: "icon_entreprise",
					"aria-hidden": "true",
				}),
				tag(
					"div",
					{ class: "ie-titre" },
					lEntreprise.getLibelle() +
						(!!lEntreprise.estSiegeSocial
							? ` (${GTraductions.getValeur("FicheStage.siegeSocial")})`
							: ""),
				),
				!!lEntreprise.nomCommercial
					? tag("span", lEntreprise.nomCommercial)
					: "",
			),
		);
		if (
			!!lEntreprise.adresse1 ||
			!!lEntreprise.adresse2 ||
			!!lEntreprise.adresse3 ||
			!!lEntreprise.adresse4 ||
			!!lEntreprise.codePostal ||
			!!lEntreprise.ville ||
			!!lEntreprise.pays
		) {
			const strCPVillePays = [];
			if (
				!!lEntreprise.codePostal ||
				!!lEntreprise.ville ||
				!!lEntreprise.pays
			) {
				if (!!lEntreprise.codePostal) {
					strCPVillePays.push(lEntreprise.codePostal);
				}
				if (!!lEntreprise.ville) {
					strCPVillePays.push(lEntreprise.ville);
				}
				if (!!lEntreprise.pays) {
					strCPVillePays.push(lEntreprise.pays);
				}
			}
			H.push(
				tag(
					"div",
					{ class: "conteneur-adresse" },
					tag(
						"ul",
						!!lEntreprise.adresse1 ? tag("li", lEntreprise.adresse1) : "",
						!!lEntreprise.adresse2 ? tag("li", lEntreprise.adresse2) : "",
						!!lEntreprise.adresse3 ? tag("li", lEntreprise.adresse3) : "",
						!!lEntreprise.adresse4 ? tag("li", lEntreprise.adresse4) : "",
						!!strCPVillePays.length ? tag("li", strCPVillePays.join(" ")) : "",
					),
				),
			);
		}
		H.push(`</div>`);
		if (
			!!lEntreprise.site ||
			!!lEntreprise.telFixe ||
			!!lEntreprise.mobile ||
			!!lEntreprise.fax ||
			!!lEntreprise.email
		) {
			H.push(`<div class="sous-section conteneur-info">`);
			if (!!lEntreprise.mobile) {
				H.push(
					tag(
						"div",
						{
							class: "lien-communication tel-mobile",
							title: GTraductions.getValeur("FicheStage.TelPortable"),
						},
						tag(
							"a",
							{
								href:
									"tel:" +
									GChaine.formatTelephoneAvecIndicatif(
										lEntreprise.indMobile,
										lEntreprise.mobile,
									),
							},
							GChaine.formatTelephone(lEntreprise.mobile),
							tag(
								"span",
								{ class: "sr-only" },
								GTraductions.getValeur("FicheStage.TelPortable"),
							),
						),
					),
				);
			}
			if (!!lEntreprise.telFixe) {
				H.push(
					tag(
						"div",
						{
							class: "lien-communication tel",
							title: GTraductions.getValeur("FicheStage.TelFixe"),
						},
						tag(
							"a",
							{
								href:
									"tel:" +
									GChaine.formatTelephoneAvecIndicatif(
										lEntreprise.indFix,
										lEntreprise.telFixe,
									),
							},
							GChaine.formatTelephone(lEntreprise.telFixe),
							tag(
								"span",
								{ class: "sr-only" },
								GTraductions.getValeur("FicheStage.TelFixe"),
							),
						),
					),
				);
			}
			if (!!lEntreprise.fax) {
				H.push(
					tag(
						"div",
						{
							class: "lien-communication",
							title: GTraductions.getValeur("FicheStage.Fax"),
						},
						tag(
							"a",
							{
								href:
									"fax:" +
									GChaine.formatTelephoneAvecIndicatif(
										lEntreprise.indFax,
										lEntreprise.fax,
									),
							},
							GChaine.formatTelephone(lEntreprise.fax),
							tag(
								"span",
								{ class: "sr-only" },
								GTraductions.getValeur("FicheStage.Fax"),
							),
						),
					),
				);
			}
			if (!!lEntreprise.site) {
				H.push(
					tag(
						"div",
						{ class: "lien-communication" },
						tag(
							"a",
							{
								href: GChaine.encoderUrl(
									GChaine.verifierURLHttp(lEntreprise.site),
								),
							},
							lEntreprise.site,
						),
					),
				);
			}
			if (!!lEntreprise.email) {
				H.push(
					tag(
						"div",
						{ class: "lien-communication" },
						tag(
							"a",
							{ href: "mailto:" + lEntreprise.email, target: "_blank" },
							lEntreprise.email,
						),
					),
				);
			}
			H.push(`</div>`);
		}
		if (lEntreprise.responsable || lEntreprise.commentairePublie) {
			H.push("<div>");
			if (lEntreprise.responsable) {
				H.push(
					`<div class="sous-section conteneur-responsable">\n                <h3 class="ie-titre-petit">${GTraductions.getValeur("FicheStage.responsableEntreprise")} : </h3>\n                <span>${lEntreprise.responsable.getLibelle()}</span>\n              </div>`,
				);
			}
			if (lEntreprise.commentairePublie) {
				H.push(
					tag("div", { class: "sous-section" }, lEntreprise.commentairePublie),
				);
			}
			H.push("</div>");
		}
		H.push("</div>");
		H.push(`</section>`);
	}
	return H.join("");
}
function _composeBlocDetailsMDS(aDonnees) {
	const H = [];
	const lListe = aDonnees.maitreDeStage;
	const lLibelleTitre =
		lListe.count() > 1
			? GTraductions.getValeur("FicheStage.maitresDeStage")
			: GTraductions.getValeur("FicheStage.maitreDeStage");
	H.push(
		`<section class="entreprise-maitres">\n            <h2 class="ie-titre-couleur">${lLibelleTitre}</h2>\n              <div class="flex-wrapper">`,
	);
	lListe.parcourir((aMDS) => {
		H.push(`<div class="conteneur-maitre-stage">\n                <div class="sous-section conteneur-nom">\n                  <span class="nom-maitre">${aMDS.getLibelle()}</span>\n                  ${!!aMDS.fonction ? `<div class="fonction">${aMDS.fonction}</div>` : ""}
                </div>`);
		H.push(`<div class="sous-section conteneur-info">`);
		if (!!aMDS.telPortable) {
			H.push(
				tag(
					"div",
					{
						class: "lien-communication tel-mobile",
						title: GTraductions.getValeur("FicheStage.MDS.Portable"),
					},
					tag(
						"a",
						{
							href:
								"tel:" +
								GChaine.formatTelephoneAvecIndicatif(
									aMDS.indPortable,
									aMDS.telPortable,
								),
						},
						GChaine.formatTelephone(aMDS.telPortable),
						tag(
							"span",
							{ class: "sr-only" },
							GTraductions.getValeur("FicheStage.MDS.Portable"),
						),
					),
				),
			);
		}
		if (!!aMDS.telFixe) {
			H.push(
				tag(
					"div",
					{
						class: "lien-communication tel",
						title: GTraductions.getValeur("FicheStage.MDS.TelFixe"),
					},
					tag(
						"a",
						{
							href:
								"tel:" +
								GChaine.formatTelephoneAvecIndicatif(
									aMDS.indFixe,
									aMDS.telFixe,
								),
						},
						GChaine.formatTelephone(aMDS.telFixe),
						tag(
							"span",
							{ class: "sr-only" },
							GTraductions.getValeur("FicheStage.MDS.TelFixe"),
						),
					),
				),
			);
		}
		if (!!aMDS.fax) {
			H.push(
				tag(
					"div",
					{
						class: "lien-communication",
						title: GTraductions.getValeur("FicheStage.MDS.Fax"),
					},
					tag(
						"a",
						{ href: "fax:" + GChaine.formatTelephone(aMDS.fax) },
						GChaine.formatTelephone(aMDS.fax),
						tag(
							"span",
							{ class: "sr-only" },
							GTraductions.getValeur("FicheStage.MDS.Fax"),
						),
					),
				),
			);
		}
		if (!!aMDS.email) {
			H.push(
				tag(
					"div",
					{ class: "lien-communication" },
					tag(
						"a",
						{ href: "mailto:" + aMDS.email, target: "_blank" },
						aMDS.email,
					),
				),
			);
		}
		H.push(`</div>\n          </div>`);
	});
	H.push("</div>");
	H.push("</section>");
	return H.join("");
}
function _composeBlocDetailsEnseignants(aDonnees) {
	const H = [];
	if (aDonnees.professeur && aDonnees.professeur.count()) {
		H.push('<section class="Bloc-details-enseignants">');
		H.push(
			tag(
				"h2",
				{ class: "ie-titre-couleur" },
				aDonnees.professeur.count() > 1
					? GTraductions.getValeur("FicheStage.profsReferents")
					: GTraductions.getValeur("FicheStage.profReferent"),
			),
		);
		H.push(
			'<div class="conteneur-enseignants">',
			aDonnees.professeur.getTableauLibelles().join(", "),
			"</div>",
		);
		H.push("</section>");
	}
	return H.join("");
}
function _composeBlocDetailsHoraires(aDonnees) {
	const H = [];
	const lListeJours = aDonnees.horairesJours;
	H.push(`<section>`);
	if (!!lListeJours && lListeJours.count()) {
		let lAvecHoraire = false;
		lListeJours.parcourir((aJour) => {
			if (aJour && aJour.horaires && aJour.horaires.count()) {
				lAvecHoraire = true;
			}
		});
		if (
			lAvecHoraire ||
			(!!aDonnees.dateDebut && !!aDonnees.dateFin) ||
			aDonnees.nbJours
		) {
			H.push(
				tag(
					"h2",
					{ class: "ie-titre-couleur" },
					GTraductions.getValeur("FicheStage.PresenceDansEntreprise") +
						(aDonnees.nbJours
							? " (" +
								GTraductions.getValeur("FicheStage.dureeDetails") +
								" : " +
								aDonnees.nbJours +
								")"
							: ""),
				),
			);
		}
		H.push('<div class="flex-wrapper">');
		if (!!aDonnees.dateDebut && !!aDonnees.dateFin) {
			H.push(
				'<div class="Bloc-entreprise-dates',
				!IE.estMobile ? " conteneur-Espace" : "",
				'">',
			);
			H.push(
				tag(
					"h3",
					{ class: "ie-titre-petit" },
					GTraductions.getValeur("FicheStage.stageDates"),
				),
			);
			H.push(
				tag(
					"div",
					{ class: "" },
					GDate.formatDate(
						aDonnees.dateDebut,
						GTraductions.getValeur("Du") + " %JJ/%MM/%AAAA",
					) +
						GDate.formatDate(
							aDonnees.dateFin,
							" " + GTraductions.getValeur("Au") + " %JJ/%MM/%AAAA",
						) +
						(!!aDonnees.nbSemaines ? " (" + aDonnees.nbSemaines + ")" : ""),
				),
			);
			H.push("</div>");
		}
		if (lAvecHoraire) {
			H.push("<div>");
			H.push('<div class="Bloc-entreprise-horaire">');
			H.push(
				tag(
					"h3",
					{ class: "ie-titre-petit" },
					GTraductions.getValeur("FicheStage.stageHoraires"),
				),
			);
			lListeJours.parcourir((aJour) => {
				if (aJour && aJour.horaires && aJour.horaires.count() > 0) {
					H.push(
						'<div class="flex-contain conteneur-journee">',
						'<div class="Gras nom-journee" style="width:6rem;">',
						aJour.getLibelle(),
						"</div>",
					);
					H.push("<div>");
					for (let i = 0, lNbr = aJour.horaires.count(); i < lNbr; i++) {
						if (i > 0) {
							H.push(tag("span", { class: "" }, " / "));
						}
						H.push(
							tag("span", { class: "" }, aJour.horaires.get(i).getLibelle()),
						);
					}
					H.push("</div>");
					H.push(
						tag("div", { class: "Gras heure-journee" }, aJour.heuresJournee),
					);
					H.push("</div>");
				}
			});
			H.push(
				tag(
					"div",
					{ class: "flex-contain conteneur-total-hebdo" },
					tag(
						"div",
						{ class: "Gras ie-titre-petit titre-total avecMarginTop" },
						GTraductions.getValeur("FicheStage.totalHebdo"),
					),
					tag(
						"div",
						{ class: "chips-total-stage" },
						tag("ie-chips", { class: "tag-style" }, aDonnees.heuresHebdo),
					),
				),
			);
			H.push("</div>");
			H.push("</div>");
		}
		H.push("</div>");
	}
	H.push("</section>");
	return H.join("");
}
function _getIDDocJointDeType(aPJ) {
	let lID = !!aPJ.genreDocJoint.getGenre() ? "1" : "2";
	switch (aPJ.genreDocJoint.getGenre()) {
		case undefined:
			lID = "3";
			break;
		case 0:
			lID = "2";
			break;
		default:
			lID = "1";
			break;
	}
	lID +=
		"_" +
		(aPJ.genreDocJoint.getGenre() !== undefined
			? aPJ.genreDocJoint.getGenre()
			: "X");
	lID += "_" + aPJ.genreDocJoint.getNumero();
	return lID;
}
function _genreEstDeType(aGenre, aType) {
	let lMatch = "";
	switch (aType) {
		case undefined:
			lMatch = "3";
			break;
		case 0:
			lMatch = "2";
			break;
		default:
			lMatch = "1";
			break;
	}
	lMatch += `_${aType}_`;
	return aGenre.startsWith(lMatch);
}
function _composeBlocDocumentsJoints(aDonnees, aParams) {
	const H = [];
	H.push('<section class="Bloc-details-documentsJoints">');
	H.push(
		tag(
			"div",
			{ class: "Gras ie-titre-petit" },
			GTraductions.getValeur("FicheStage.documentsJoints"),
		),
	);
	H.push('<div class="m-bottom-l">');
	const lGenresPJ = {};
	let lAvecConventionDeStage = false;
	aDonnees.listePJ.setTri([
		ObjetTri.init(function (aPJ) {
			switch (aPJ.genreDocJoint.getGenre()) {
				case undefined:
					return 3;
				case 0:
					return 2;
				default:
					return 1;
			}
		}),
		ObjetTri.init(function (aPJ) {
			return aPJ.genreDocJoint.getGenre();
		}),
	]);
	aDonnees.listePJ.trier();
	aDonnees.listePJ.parcourir((aPJ) => {
		const lID = _getIDDocJointDeType(aPJ);
		if (
			!lAvecConventionDeStage &&
			aPJ.genreDocJoint.getGenre() ===
				TypeOrigineCreationLibelleDocJointEleve.OCLDJ_ConventionDeStage
		) {
			lAvecConventionDeStage = true;
		}
		if (lGenresPJ[lID] !== lID) {
			lGenresPJ[lID] = aPJ.genreDocJoint.getLibelle();
		}
	});
	if (
		!lAvecConventionDeStage &&
		aDonnees.convention &&
		aDonnees.convention.document
	) {
		H.push('<div class="bloc-pj">');
		H.push(`${aDonnees.convention.document.getLibelle()} : `);
		H.push('<div class="m-left">');
		H.push(
			_ajoutConventionDeStageSignee(aDonnees.convention.document, aParams),
		);
		H.push("</div>");
		H.push("</div>");
	}
	for (const lGenre in lGenresPJ) {
		H.push('<div class="bloc-pj">');
		H.push(
			lGenresPJ[lGenre] !== ""
				? `${lGenresPJ[lGenre]} : `
				: `${GTraductions.getValeur("FicheStage.autreDocJoint")} : `,
		);
		H.push('<div class="m-left">');
		if (
			lAvecConventionDeStage &&
			aDonnees.convention &&
			aDonnees.convention.document &&
			_genreEstDeType(
				lGenre,
				TypeOrigineCreationLibelleDocJointEleve.OCLDJ_ConventionDeStage,
			)
		) {
			H.push(
				_ajoutConventionDeStageSignee(aDonnees.convention.document, aParams),
			);
		}
		aDonnees.listePJ.parcourir((aPJ) => {
			const lID = _getIDDocJointDeType(aPJ);
			if (lGenre === lID) {
				H.push(
					GChaine.composerUrlLienExterne({ documentJoint: aPJ, maxWidth: 250 }),
				);
			}
		});
		H.push("</div>");
		H.push("</div>");
	}
	H.push("</div>");
	H.push("</section>");
	return H.join("");
}
function _ajoutConventionDeStageSignee(aDocument, aParams) {
	if (!aDocument.documentArchive) {
		const lControleur = aParams.controleur;
		if (lControleur) {
			if (!lControleur.ouvrirDocument) {
				lControleur.ouvrirDocument = {
					event: function () {
						TUtilitairePartenaire.ouvrirPatience();
						if (ObjetRequeteURLSignataire) {
							const lObj = {
								typeAction: TypeActionSignataire.voirDocument,
								document: aDocument,
							};
							new ObjetRequeteURLSignataire(this)
								.lancerRequete(lObj)
								.then((aJSON) => {
									if (aJSON.message) {
										TUtilitairePartenaire.fermerPatience();
										GApplication.getMessage().afficher({
											type: EGenreBoiteMessage.Information,
											titre: "",
											message: aJSON.message,
										});
									} else if (aJSON.url) {
										TUtilitairePartenaire.ouvrirUrl(aJSON.url);
									} else {
										TUtilitairePartenaire.fermerPatience();
									}
								});
						}
					},
				};
			}
		}
		return `<ie-chips class="m-all avec-event iconic icon_uniF1C1" ie-model="ouvrirDocument">${GTraductions.getValeur("FicheStage.conventionDeStageSignee")}</ie-chips>`;
	} else {
		const lDocument = new ObjetElement(
			aDocument.documentArchive.getLibelle(),
			aDocument.getNumero(),
			aDocument.documentArchive.getGenre(),
		);
		return GChaine.composerUrlLienExterne({
			documentJoint: lDocument,
			maxWidth: 250,
		});
	}
}
UtilitaireFicheStage.composeBlocAnnexe = function (aDonnees, aParams) {
	const H = [];
	H.push(_composeBlocAnnexes(aDonnees, aParams));
	if (aParams.parametres.avecEdition) {
		_ajoutControleurEditionAnnexe(aDonnees, aParams);
	}
	return H.join("");
};
function _composeBlocAnnexes(aDonnees, aParams) {
	const H = [];
	H.push('<section class="Bloc-details-annexes">');
	if (
		aParams.parametres.avecEdition ||
		aDonnees.sujet.getLibelle() ||
		aDonnees.sujetDetaille
	) {
		H.push(
			'<div class="m-bottom-xl border-bottom">',
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.stage"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_SujetDetaille +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			'<div class="',
			!IE.estMobile ? "flex-contain " : "",
			'm-right-xxl">',
			aDonnees.sujet.getLibelle()
				? '<div class="m-bottom-xl m-right-l sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.sujet") +
						"</div><div>" +
						aDonnees.sujet.getLibelle() +
						"</div></div>"
				: "",
			aDonnees.sujetDetaille
				? '<div class="m-bottom-xl sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.sujetDetaille") +
						"</div><div>" +
						GChaine.replaceRCToHTML(aDonnees.sujetDetaille) +
						"</div></div>"
				: "",
			"</div>",
			"</div>",
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.activitesDejaRealisees ||
		aDonnees.competencesMobilisees
	) {
		H.push(
			'<div class="m-bottom-xl border-bottom">',
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.competencesEtActivites"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_ActivitesDejaRealisees +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			'<div class="',
			!IE.estMobile ? "flex-contain " : "",
			'm-right-xxl">',
			aDonnees.activitesDejaRealisees
				? '<div class="m-bottom-xl m-right-l sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.activitesDejaRealisees") +
						"</div><div>" +
						GChaine.replaceRCToHTML(aDonnees.activitesDejaRealisees) +
						"</div></div>"
				: "",
			aDonnees.competencesMobilisees
				? '<div class="m-bottom-xl sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.competencesMobilisees") +
						"</div><div>" +
						GChaine.replaceRCToHTML(aDonnees.competencesMobilisees) +
						"</div></div>"
				: "",
			"</div>",
			"</div>",
		);
	}
	if (aParams.parametres.avecEdition || aDonnees.objectifs) {
		H.push(
			'<div class="m-bottom-xl border-bottom">',
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.objectifsAssignes"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_Objectifs +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			aDonnees.objectifs
				? '<div class="m-bottom-xl m-right-xxl">' +
						GChaine.replaceRCToHTML(aDonnees.objectifs) +
						"</div>"
				: "",
			"</div>",
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.activitesPrevues ||
		aDonnees.moyensMobilises
	) {
		H.push(
			'<div class="m-bottom-xl border-bottom">',
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.activitesPrevuesAuCoursStage"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_ActivitesPrevues +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			'<div class="',
			!IE.estMobile ? "flex-contain " : "",
			'm-right-xxl">',
			aDonnees.activitesPrevues
				? '<div class="m-bottom-xl m-right-l sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.activitesPrevues") +
						"</div><div>" +
						GChaine.replaceRCToHTML(aDonnees.activitesPrevues) +
						"</div></div>"
				: "",
			aDonnees.moyensMobilises
				? '<div class="m-bottom-xl sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.moyensMobilises") +
						"</div><div>" +
						GChaine.replaceRCToHTML(aDonnees.moyensMobilises) +
						"</div></div>"
				: "",
			"</div>",
			"</div>",
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.competencesVisees ||
		(aDonnees.listeCompetencesVisees && aDonnees.listeCompetencesVisees.length)
	) {
		H.push(
			'<div class="m-bottom-xl border-bottom">',
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.competencesVisees"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_CompetencesVisees +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			aDonnees.competencesVisees
				? '<div class="m-bottom-xl m-right-xxl">' +
						GChaine.replaceRCToHTML(aDonnees.competencesVisees) +
						"</div>"
				: "",
			aDonnees.listeCompetencesVisees && aDonnees.listeCompetencesVisees.length
				? getHtmlListeCompetencesVisees(aDonnees.listeCompetencesVisees)
				: "",
			"</div>",
		);
	}
	if (
		aDonnees.avecTravauxAuxMineurs &&
		(aParams.parametres.avecEdition || aDonnees.travauxAuxMineurs)
	) {
		H.push(
			'<div class="m-bottom-xl border-bottom">',
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.travauxAuxMineurs"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_TravauxAuxMineurs +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			aDonnees.travauxAuxMineurs
				? '<div class="m-bottom-xl m-right-xxl">' +
						GChaine.replaceRCToHTML(aDonnees.travauxAuxMineurs) +
						"</div>"
				: "",
			"</div>",
		);
	}
	if (aParams.parametres.avecEdition || aDonnees.modalitesConcertation) {
		H.push(
			'<div class="m-bottom-xl border-bottom">',
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.modalitesDEncadrement"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_ModalitesDeConcertation +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			aDonnees.modalitesConcertation
				? '<div class="m-bottom-xl m-right-xxl">' +
						GChaine.replaceRCToHTML(aDonnees.modalitesConcertation) +
						"</div>"
				: "",
			"</div>",
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.typeModalitesEvaluation.getGenre() !==
			TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Aucune ||
		aDonnees.modalitesEvaluation
	) {
		H.push(
			"<div>",
			'<div class="flex-contain justify-between flex-center">',
			'<h2 class="ie-titre-couleur">',
			GTraductions.getValeur("FicheStage.annexe.modalitesDeLaPeriodePro"),
			"</h2>",
			aParams.parametres.avecEdition
				? '<ie-btnicon class="fix-bloc icon_pencil i-medium avecFond m-bottom" ie-model="modifierAnnexe(\'' +
						TypeAnnexePedagogique.TAP_ModalitesDEvaluation +
						'\')" title="' +
						GTraductions.getValeur("Modifier") +
						'"></ie-btnicon>'
				: "",
			"</div>",
			'<div class="',
			!IE.estMobile ? "flex-contain " : "",
			'm-right-xxl">',
			aDonnees.typeModalitesEvaluation.getGenre() !==
				TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Aucune
				? '<div class="m-bottom-xl m-right-l sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.typeDEvaluation") +
						"</div><div>" +
						aDonnees.typeModalitesEvaluation.getLibelle() +
						"</div></div>"
				: "",
			aDonnees.modalitesEvaluation
				? '<div class="m-bottom-xl sous-section"><div class="Gras ie-titre-petit">' +
						GTraductions.getValeur("FicheStage.annexe.modalitesDEvaluation") +
						"</div><div>" +
						GChaine.replaceRCToHTML(aDonnees.modalitesEvaluation) +
						"</div></div>"
				: "",
			"</div>",
			"</div>",
		);
	}
	H.push("</section>");
	return H.join("");
}
function getHtmlListeCompetencesVisees(aListeCompetencesVisees) {
	const H = [];
	H.push('<div class="m-bottom-xl m-right-xxl">');
	aListeCompetencesVisees.forEach((aCompetence) => {
		H.push(
			'<div class="m-bottom-xl">',
			"<h3>",
			aCompetence.compVisees,
			"</h3>",
			"<p>",
			aCompetence.blocComp,
			"<p>",
			aCompetence.resultat
				? '<p class="Italique">' +
						GChaine.replaceRCToHTML(aCompetence.resultat) +
						"<p>"
				: "",
			"</div>",
		);
	});
	H.push("</div>");
	return H.join("");
}
UtilitaireFicheStage.composeSurSuivi = function (aDonnee, aParams) {
	const H = [];
	const lSuivi = aDonnee;
	const lAvecEdition =
		aParams.parametres.avecEditionSuivisDeStage && !!lSuivi.editable;
	H.push('<div class="Bloc-suivi">');
	if (IE.estMobile) {
		H.push(
			tag(
				"div",
				{ class: "flex-contain conteneur-header" },
				tag("ie-btnicon", {
					class: "icon_retour_mobile",
					"ie-model": "retourPrec",
					title: GTraductions.getValeur(
						"FicheStage.listeSuivis.RetourListeSuivi",
					),
				}),
				tag(
					"div",
					{ class: "ie-titre titre-suivi" },
					GTraductions.getValeur(
						"FicheStage.listeSuivis.SuiviDuX",
						GDate.formatDate(lSuivi.date, "%JJ/%MM/%AAAA"),
					),
				),
			),
		);
	}
	if (lAvecEdition) {
		H.push(
			tag("div", {
				class: "flex-contain conteneur-icones",
				"ie-identite": "menuCtxSuivi",
			}),
		);
	}
	H.push(
		'<div class="conteneur-suivi',
		!lAvecEdition ? " margin-espace-haut" : "",
		'">',
		tag(
			"div",
			{ class: "flex-contain conteneur-info-suivi" },
			tag(
				"time",
				{
					class: [
						"m-right-l date-contain",
						!!lSuivi.evenement.couleur ? "ie-line-color bottom" : "",
					],
					style: !!lSuivi.evenement.couleur
						? `--color-line :${lSuivi.evenement.couleur};`
						: "",
					datetime: GDate.formatDate(lSuivi.date, "%MM-%JJ"),
				},
				GDate.formatDate(lSuivi.date, "%JJ %MMM"),
			),
			tag(
				"div",
				{ class: "conteneur-milieu" },
				tag("div", { class: "ie-titre Gras" }, lSuivi.evenement.getLibelle()),
				lSuivi.responsable
					? tag(
							"div",
							{ class: "ie-titre-petit" },
							lSuivi.responsable.getLibelle(),
						)
					: "",
				aParams.parametres.avecEditionSuivisDeStage && lSuivi.publier
					? tag(
							"div",
							tag("i", { class: "icon_info_sondage_publier" }),
							tag(
								"span",
								{ class: "ie-titre-petit" },
								GTraductions.getValeur(
									"FicheStage.listeSuivis.etatPublication",
								),
							),
						)
					: "",
			),
		),
	);
	if (lSuivi.avecHeure || !!lSuivi.lieu) {
		H.push(
			tag(
				"div",
				{ class: "conteneur-heure-lieu" },
				lSuivi.avecHeure
					? tag(
							"div",
							{ class: "" },
							tag(
								"span",
								{ class: "" },
								GTraductions.getValeur("FicheStage.listeSuivis.Heure") + " : ",
							),
							tag(
								"span",
								{ class: "ie-titre-petit" },
								GDate.formatDate(lSuivi.date, "%hh%sh%mm"),
							),
						)
					: "",
				!!lSuivi.lieu && lSuivi.lieu.getLibelle()
					? tag(
							"div",
							{ class: "" },
							tag(
								"span",
								{ class: "" },
								GTraductions.getValeur("FicheStage.listeSuivis.Lieu") + " : ",
							),
							tag(
								"span",
								{ class: "ie-titre-petit" },
								lSuivi.lieu.getLibelle(),
							),
						)
					: "",
			),
		);
	}
	if (lSuivi.commentaire) {
		H.push(
			tag(
				"div",
				{ class: "conteneur-commentaire" },
				GChaine.replaceRCToHTML(lSuivi.commentaire),
			),
		);
	}
	if (lAvecEdition) {
		H.push('<div class="flex-contain conteneur-pj">');
		H.push(
			tag("ie-btnicon", {
				class: "icon_piece_jointe bt-activable",
				"ie-selecfile": true,
				"ie-model": "ajoutPJSuivi",
				title: GTraductions.getValeur("FicheStage.AjouterPiecesJointes"),
			}),
		);
		if (!!lSuivi.listePJ && lSuivi.listePJ.count()) {
			const lIEModelChips = _getIEModelChipsPJSuivi(lSuivi, aParams);
			H.push('<div class="flex-contain f-wrap">');
			for (let i = 0, lNbr = lSuivi.listePJ.count(); i < lNbr; i++) {
				H.push(
					tag(
						"div",
						{ class: "chips-pj" },
						GChaine.composerUrlLienExterne({
							documentJoint: lSuivi.listePJ.get(i),
							maxWidth: 250,
							ieModelChips: lIEModelChips,
							argsIEModel: [lSuivi.listePJ.get(i).getNumero()],
						}),
					),
				);
			}
			H.push("</div>");
			H.push("</div>");
		}
	} else if (lSuivi.listePJ && lSuivi.listePJ.count()) {
		H.push('<div class="flex-contain f-wrap conteneur-pj">');
		for (let i = 0, lNbr = lSuivi.listePJ.count(); i < lNbr; i++) {
			H.push(
				tag(
					"div",
					{ class: "chips-pj" },
					GChaine.composerUrlLienExterne({
						documentJoint: lSuivi.listePJ.get(i),
						maxWidth: 250,
					}),
				),
			);
		}
		H.push("</div>");
	}
	H.push("</div>");
	H.push("</div>");
	if (aParams.controleur) {
		_ajoutControleurSurSuivi(lSuivi, aParams);
	}
	return H.join("");
};
UtilitaireFicheStage.composeBlocAppreciations = function (aDonnees, aParams) {
	const H = [];
	if (!!aDonnees.appreciations) {
		aDonnees.appreciations.setTri([ObjetTri.init("Genre")]);
		aDonnees.appreciations.trier();
		if (!!aDonnees.professeur && aDonnees.professeur.count()) {
			H.push(_composeBlocAppreciationsProfs(aDonnees));
		}
		if (!!aDonnees.maitreDeStage && aDonnees.maitreDeStage.count()) {
			H.push(_composeBlocAppreciationsMDS(aDonnees));
		}
		_ajouterControleurEditionAppreciations(aDonnees, aParams);
	}
	return H.join("");
};
function _composeBlocAppreciationsProfs(aDonnees) {
	const H = [];
	const lListe = aDonnees.appreciations.getListeElements((aAppreciation) => {
		return aAppreciation.getGenre() === EGenreRessource.Enseignant;
	});
	H.push('<section class="Bloc-appreciations">');
	H.push(
		tag(
			"h2",
			{ class: "ie-titre-couleur" },
			GTraductions.getValeur("FicheStage.appreciations"),
		),
	);
	H.push(
		_construireAppreciations(
			lListe,
			lListe.count() > 1
				? GTraductions.getValeur("FicheStage.profsReferents")
				: GTraductions.getValeur("FicheStage.profReferent"),
		),
	);
	H.push("</section>");
	return H.join("");
}
function _composeBlocAppreciationsMDS(aDonnees) {
	const H = [];
	const lListe = aDonnees.appreciations.getListeElements((aAppreciation) => {
		return aAppreciation.getGenre() === EGenreRessource.MaitreDeStage;
	});
	H.push('<section class="Bloc-appreciations">');
	H.push(
		_construireAppreciations(
			lListe,
			lListe.count() > 1
				? GTraductions.getValeur("FicheStage.maitresDeStage")
				: GTraductions.getValeur("FicheStage.maitreDeStage"),
		),
	);
	H.push("</section>");
	return H.join("");
}
function _construireAppreciations(aDonnees, aLibelle) {
	const H = [];
	if (!!aDonnees && aDonnees.count()) {
		let lAvecEdition = false;
		aDonnees.parcourir((aAppreciation) => {
			if (aAppreciation.avecEditionAppreciation) {
				lAvecEdition = true;
			}
		});
		H.push('<div class="conteneur-appreciation">');
		H.push(
			tag(
				"div",
				{ class: "flex-contain Gras ie-titre-petit" },
				aLibelle,
				lAvecEdition
					? tag("ie-btnicon", {
							class: "icon_pencil i-medium avecFond",
							"ie-model": "modifierAppreciation",
							title: GTraductions.getValeur("Modifier"),
						})
					: "",
			),
		);
		aDonnees.parcourir((aAppreciation) => {
			H.push(tag("div", { class: "nom-auteur" }, aAppreciation.getLibelle()));
			H.push(tag("div", { class: "m-bottom" }, aAppreciation.appreciation));
		});
		H.push("</div>");
	}
	return H.join("");
}
function _ajoutControleurEditionDetails(aDonnees, aParams) {
	const lControleur = aParams.controleur;
	if (lControleur) {
		if (!lControleur.ajoutPJ) {
			lControleur.ajoutPJ = {
				event: function () {
					const lInstance = this.instance;
					afficherFenetreAjoutFichiers.call(lInstance, (aListeFichiers) => {
						aDonnees.listePJ = aListeFichiers;
						_requeteSaisieFicheStage.call(lInstance, {
							listePJ: aListeFichiers,
							stage: aDonnees,
						});
					});
				},
			};
		}
	}
}
function _ajoutControleurEditionAnnexe(aDonnees, aParams) {
	const lControleur = aParams.controleur;
	if (lControleur) {
		if (!lControleur.modifierAnnexe) {
			lControleur.modifierAnnexe = {
				event: function (aTypeAnnexePedagogique) {
					const lInstance = this.instance;
					const lFenetreAnnexePedagogique = ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_AnnexePedagogiquePN,
						{
							pere: lInstance,
							evenement: function (aGenreBouton, aDonneesFenetre) {
								if (aGenreBouton === 1) {
									aDonneesFenetre.setEtat(EGenreEtat.Modification);
									lInstance.setEtatSaisie(true);
									_requeteSaisieFicheStage.call(lInstance, {
										listePJ: aDonnees.listePJ,
										stage: aDonneesFenetre,
									});
								}
								lFenetreAnnexePedagogique.fermer();
							},
						},
					);
					const lParams = { genre: aTypeAnnexePedagogique };
					switch (aTypeAnnexePedagogique) {
						case TypeAnnexePedagogique.TAP_SujetDetaille:
							lParams.listeSujets = aParams.parametres.listeSujetsStage;
							break;
						case TypeAnnexePedagogique.TAP_ActivitesDejaRealisees:
							lParams.genreSecondaire =
								TypeAnnexePedagogique.TAP_CompetencesMobilisees;
							break;
						case TypeAnnexePedagogique.TAP_ActivitesPrevues:
							lParams.genreSecondaire =
								TypeAnnexePedagogique.TAP_MoyensMobilises;
							break;
					}
					lFenetreAnnexePedagogique.setDonnees(aDonnees, lParams);
				},
			};
		}
	}
}
function _getIEModelChipsPJSuivi(aSuivi, aParams) {
	const lControleur = aParams.controleur;
	if (!lControleur) {
		return "";
	}
	lControleur.chipsPJSuivi = {
		eventBtn: function (aNumero) {
			const lPieceJointe = aSuivi.listePJ.getElementParNumero(aNumero);
			const lStage = aParams.stage;
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Confirmation,
				message: GTraductions.getValeur(
					"selecteurPJ.msgConfirmPJ",
					lPieceJointe.getLibelle(),
				),
				callback: function (aBouton) {
					if (aBouton === 0) {
						const lInstance = this.instance;
						if (!!lPieceJointe) {
							lPieceJointe.setEtat(EGenreEtat.Suppression);
							aSuivi.setEtat(EGenreEtat.Modification);
							const lListePJ = new ObjetListeElements();
							if (!!aSuivi.listePJ) {
								lListePJ.add(aSuivi.listePJ);
							}
							_requeteSaisieFicheStage.call(lInstance, {
								callbackParam: { suivi: aSuivi },
								listePJ: lListePJ,
								stage: lStage,
								then: function () {
									aSuivi.listePJ.remove(
										aSuivi.listePJ.getIndiceParNumeroEtGenre(
											lPieceJointe.getNumero(),
										),
									);
								},
							});
						}
					}
				}.bind(this),
			});
		},
	};
	return "chipsPJSuivi";
}
function _ajoutControleurSurSuivi(aSuivi, aParams) {
	const lControleur = aParams.controleur;
	const lStage = aParams.stage;
	if (lControleur) {
		lControleur.menuCtxSuivi = () => {
			return {
				class: ObjetMenuCtxMixte,
				pere: aParams.controleur.instance,
				init(aMenuCtxMixte) {
					aMenuCtxMixte.setOptions({
						callbackAddCommandes(aMenu) {
							aMenu.add(
								GTraductions.getValeur(
									"FicheStage.listeSuivis.MenuCtxSupprimerSuivi",
								),
								true,
								() => {
									_supprimerSuivi.call(this, {
										suivi: aSuivi,
										stage: lStage,
										instance: aParams.controleur.instance,
									});
								},
								{
									icon: "icon_trash",
									typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
								},
							);
							aMenu.add(
								aSuivi.publier
									? GTraductions.getValeur(
											"FicheStage.listeSuivis.MenuCtxPasPublierSuivi",
										)
									: GTraductions.getValeur(
											"FicheStage.listeSuivis.MenuCtxPublierSuivi",
										),
								true,
								() => {
									_publierSuivi.call(this, {
										suivi: aSuivi,
										stage: lStage,
										instance: aParams.controleur.instance,
									});
								},
								{
									icon: !aSuivi.publier
										? "icon_info_sondage_publier"
										: "icon_info_sondage_non_publier",
									typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
								},
							);
							aMenu.add(
								GTraductions.getValeur(
									"FicheStage.listeSuivis.MenuCtxModifierSuivi",
								),
								true,
								() => {
									_modifierSuivi.call(this, {
										suivi: aSuivi,
										stage: lStage,
										instance: aParams.controleur.instance,
										evenements: aParams.evenements,
										lieux: aParams.lieux,
									});
								},
								{
									icon: "icon_pencil",
									typeAffEnModeMixte: ETypeAffEnModeMixte.icon,
								},
							);
						},
					});
				},
			};
		};
		lControleur.ajoutPJSuivi = {
			getOptionsSelecFile: function () {
				return {
					multiple: true,
					maxFiles: 0,
					maxSize: GApplication.droits.get(
						TypeDroits.tailleMaxDocJointEtablissement,
					),
				};
			},
			addFiles: function (aParams) {
				if (!!aSuivi) {
					if (!aSuivi.listePJ) {
						aSuivi.listePJ = new ObjetListeElements();
					}
					aSuivi.listePJ.add(aParams.listeFichiers);
					aSuivi.setEtat(EGenreEtat.Modification);
					_requeteSaisieFicheStage.call(aParams.controleur.instance, {
						callbackParam: { suivi: aSuivi },
						listePJ: aParams.listeFichiers,
						stage: lStage,
					});
				}
			},
		};
	}
}
function _ajouterControleurEditionAppreciations(aDonnees, aParams) {
	const lControleur = aParams.controleur;
	if (lControleur) {
		if (!lControleur.modifierAppreciation) {
			lControleur.modifierAppreciation = {
				event: function () {
					const lInstance = this.instance;
					const lFenetre = ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_AppreciationsStage,
						{
							pere: lInstance,
							evenement: function (aGenreBouton, aDonneesFenetre) {
								if (aGenreBouton === 1) {
									let lAvecModif = false;
									aDonneesFenetre.parcourir((aAppreciation) => {
										const lAppreciation =
											aDonnees.appreciations.getElementParNumero(
												aAppreciation.getNumero(),
											);
										if (
											lAppreciation &&
											lAppreciation.appreciation !== aAppreciation.appreciation
										) {
											lAppreciation.appreciation = aAppreciation.appreciation;
											lAppreciation.setEtat(EGenreEtat.Modification);
											lAvecModif = true;
										}
									});
									if (lAvecModif) {
										aDonnees.setEtat(EGenreEtat.Modification);
										lInstance.setEtatSaisie(true);
										_requeteSaisieFicheStage.call(lInstance, {
											listePJ: aDonnees.listePJ,
											stage: aDonnees,
										});
									}
								}
								lFenetre.fermer();
							},
							initialiser: function (aInstance) {
								const lBoutons = [
									GTraductions.getValeur("Annuler"),
									GTraductions.getValeur("Valider"),
								];
								aInstance.setOptionsFenetre({
									titre: GTraductions.getValeur("Modifier"),
									largeur: 500,
									listeBoutons: lBoutons,
								});
							},
						},
					);
					lFenetre.setDonnees(aDonnees.appreciations);
				},
			};
		}
	}
}
function afficherFenetreAjoutFichiers(aCallbackSurValidation) {
	let lThis = this;
	let lObjetFenetreAjoutMultiple = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_UploadFichiers,
		{
			pere: lThis,
			evenement: function (aGenreBouton, aListeFichiers) {
				if (aGenreBouton === EGenreAction.Valider) {
					if (!!aCallbackSurValidation) {
						aCallbackSurValidation.call(lThis, aListeFichiers);
					}
				}
				lObjetFenetreAjoutMultiple.fermer();
			},
		},
	);
	lObjetFenetreAjoutMultiple.setDonnees(EGenreRessource.DocumentJoint, {
		tailleMaxUploadFichier: GApplication.droits.get(
			TypeDroits.tailleMaxDocJointEtablissement,
		),
	});
	lObjetFenetreAjoutMultiple.afficher();
}
UtilitaireFicheStage.composeFenetreCreerSuivi = function (aThis) {
	const lSuivi = _creerNouveauSuivi();
	const lFenetreSuiviStage = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_SuiviStage,
		{
			pere: aThis,
			evenement: function (aNumeroBouton, aSuiviModifie, aListePJ) {
				if (aNumeroBouton === EGenreAction.Valider) {
					if (
						aSuiviModifie.getEtat() === EGenreEtat.Creation &&
						aSuiviModifie
					) {
						aThis.donnees.suiviStage.addElement(aSuiviModifie);
					}
					if (!!aSuiviModifie) {
						_requeteSaisieFicheStage.call(aThis, {
							callbackParam: { suivi: aSuiviModifie },
							listePJ: aListePJ,
							stage: aThis.donnees,
						});
					}
				}
				lFenetreSuiviStage.fermer();
			},
			initialiser: function (aInstance) {
				aInstance.setOptionsFenetre({
					titre: GTraductions.getValeur("FenetreSuiviStage.CreerSuivi"),
				});
				aInstance.setParametresFenetreSuivi({
					libellePublication: GTraductions.getValeur(
						"FicheStage.listeSuivis.hintPublication",
					),
					maxSizeDocumentJoint: GApplication.droits.get(
						TypeDroits.tailleMaxDocJointEtablissement,
					),
				});
			},
		},
	);
	const lListePJEleves = new ObjetListeElements();
	if (!!lSuivi.listePJ) {
		lListePJEleves.add(lSuivi.listePJ);
	}
	lFenetreSuiviStage.setDonnees({
		suivi: lSuivi,
		listeResponsables: aThis.donnees.listeResponsables,
		respAdminCBFiltrage: aThis.donnees.respAdminCBFiltrage,
		evenements: aThis.evenements,
		lieux: aThis.lieux,
		dateFinSaisieSuivi: aThis.dateFinSaisieSuivi,
		listePJEleve: lListePJEleves,
	});
};
function _creerNouveauSuivi() {
	const lNouveauSuivi = new ObjetElement();
	lNouveauSuivi.date = GDate.getDateCourante();
	lNouveauSuivi.avecSaisiePossible = true;
	lNouveauSuivi.responsable = GEtatUtilisateur.getUtilisateur();
	lNouveauSuivi.setEtat(EGenreEtat.Creation);
	return lNouveauSuivi;
}
function _supprimerSuivi(aParams) {
	const lSuivi = aParams.suivi,
		lInstance = aParams.instance,
		lStage = aParams.stage;
	GApplication.getMessage()
		.afficher({
			type: EGenreBoiteMessage.Confirmation,
			message: GTraductions.getValeur(
				"FicheStage.listeSuivis.MsgConfirmSuppSuivi",
			),
		})
		.then((aGenreAction) => {
			if (aGenreAction === EGenreAction.Valider) {
				lSuivi.setEtat(EGenreEtat.Suppression);
				_requeteSaisieFicheStage.call(lInstance, {
					listePJ: lStage.listePJ,
					stage: lStage,
				});
			}
		});
}
function _publierSuivi(aParams) {
	const lSuivi = aParams.suivi,
		lInstance = aParams.instance,
		lStage = aParams.stage;
	lSuivi.publier = !lSuivi.publier;
	lSuivi.setEtat(EGenreEtat.Modification);
	_requeteSaisieFicheStage.call(lInstance, {
		callbackParam: { suivi: lSuivi },
		listePJ: lStage.listePJ,
		stage: lStage,
	});
}
function _modifierSuivi(aParams) {
	const lSuivi = aParams.suivi,
		lInstance = aParams.instance,
		lStage = aParams.stage;
	const lFenetreSuiviStage = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_SuiviStage,
		{
			pere: lInstance,
			evenement: function (aNumeroBouton, aSuiviModifie) {
				if (aNumeroBouton === EGenreAction.Valider) {
					if (lSuivi) {
						const lIndiceSuiviConcerne =
							lStage.suiviStage.getIndiceParNumeroEtGenre(
								aSuiviModifie.getNumero(),
							);
						lStage.suiviStage.addElement(aSuiviModifie, lIndiceSuiviConcerne);
					}
					if (!!aSuiviModifie) {
						Object.assign(lSuivi, aSuiviModifie);
						const lListePJ = new ObjetListeElements();
						if (!!lSuivi.listePJ) {
							lSuivi.listePJ.parcourir((aPJ) => {
								if (aPJ.getEtat() !== EGenreEtat.Suppression) {
									lListePJ.add(aPJ);
								}
							});
						}
						lSuivi.listePJ = lListePJ;
						_requeteSaisieFicheStage.call(lInstance, {
							callbackParam: { suivi: lSuivi },
							listePJ: aSuiviModifie.listePJ,
							stage: lStage,
						});
					}
				}
				lFenetreSuiviStage.fermer();
			},
			initialiser: function (aInstance) {
				aInstance.setOptionsFenetre({
					titre: GTraductions.getValeur("FenetreSuiviStage.ModifierSuivi"),
				});
				aInstance.setParametresFenetreSuivi({
					libellePublication: GTraductions.getValeur(
						"FicheStage.listeSuivis.hintPublication",
					),
					maxSizeDocumentJoint: GApplication.droits.get(
						TypeDroits.tailleMaxDocJointEtablissement,
					),
				});
			},
		},
	);
	const lListePJ = new ObjetListeElements();
	if (!!lSuivi.listePJ) {
		lListePJ.add(lSuivi.listePJ);
	}
	lFenetreSuiviStage.setDonnees({
		suivi: lSuivi,
		listeResponsables: lStage.listeResponsables,
		respAdminCBFiltrage: lStage.respAdminCBFiltrage,
		evenements: aParams.evenements,
		lieux: aParams.lieux,
		dateFinSaisie: aParams.dateFinSaisieSuivi,
		listePJEleve: lListePJ,
	});
}
function _requeteSaisieFicheStage(aParams) {
	new ObjetRequeteSaisieAppreciationFinDeStage(this)
		.addUpload({ listeFichiers: aParams.listePJ })
		.lancerRequete({
			numEleve: aParams.stage.numeroEleve,
			stage: aParams.stage,
			appreciations: aParams.stage.appreciations,
			listePJ: aParams.listePJ,
		})
		.then(() => {
			if (!!aParams.then) {
				aParams.then();
			}
			this.actionSurValidation(aParams.callbackParam);
		});
}
module.exports = { UtilitaireFicheStage };
