exports.UtilitaireFicheStage = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieAppreciationFinDeStage_1 = require("ObjetRequeteSaisieAppreciationFinDeStage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_UploadFichiers_1 = require("ObjetFenetre_UploadFichiers");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_AnnexePedagogiquePN_1 = require("ObjetFenetre_AnnexePedagogiquePN");
const ObjetFenetre_SuiviStage_1 = require("ObjetFenetre_SuiviStage");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuCtxMixte_1 = require("ObjetMenuCtxMixte");
const Enumere_MenuCtxModeMixte_1 = require("Enumere_MenuCtxModeMixte");
const ObjetFenetre_AppreciationsStage_1 = require("ObjetFenetre_AppreciationsStage");
const ObjetTri_1 = require("ObjetTri");
const ObjetRequeteURLSignataire_1 = require("ObjetRequeteURLSignataire");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const TypeOrigineCreationLibelleDocJointEleve_1 = require("TypeOrigineCreationLibelleDocJointEleve");
const TypesAnnexePedagogique_1 = require("TypesAnnexePedagogique");
const TypeHebergementStage_1 = require("TypeHebergementStage");
const AccessApp_1 = require("AccessApp");
exports.UtilitaireFicheStage = {
	composeBlocDetails(aDonnees, aParams) {
		const H = [];
		H.push(_composeBlocDetailsEntrepriseAccueil(aDonnees));
		if (!!aDonnees.maitreDeStage && aDonnees.maitreDeStage.count()) {
			H.push(_composeBlocDetailsMDS(aDonnees));
		}
		H.push(_composeBlocDetailsReferents(aDonnees));
		H.push(_composeBlocDetailsHoraires(aDonnees));
		H.push(_composeBlocDetailsPresenceEtablissement(aDonnees));
		if (
			(aDonnees.listePJ && aDonnees.listePJ.count()) ||
			(aDonnees.listeDocumentsSignes && aDonnees.listeDocumentsSignes.count())
		) {
			H.push(_composeBlocDocumentsJoints(aDonnees, aParams));
		}
		if (aParams.parametres.avecEditionDocumentsJoints) {
			_ajoutControleurEditionDetails(aDonnees, aParams);
		}
		return H.join("");
	},
	composeBlocAnnexe(aDonnees, aParams) {
		const H = [];
		H.push(_composeBlocAnnexes(aDonnees, aParams));
		return H.join("");
	},
	composeSurSuivi(aDonnee, aParams) {
		const H = [];
		const lSuivi = aDonnee;
		const lAvecEdition =
			aParams.parametres.avecEditionSuivisDeStage && !!lSuivi.editable;
		H.push('<div class="Bloc-suivi">');
		if (IE.estMobile) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "flex-contain conteneur-header" },
					IE.jsx.str("ie-btnicon", {
						class: "icon_retour_mobile",
						"ie-model": "retourPrec",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.listeSuivis.RetourListeSuivi",
						),
					}),
					IE.jsx.str(
						"div",
						{ class: "ie-titre titre-suivi" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.listeSuivis.SuiviDuX",
							ObjetDate_1.GDate.formatDate(lSuivi.date, "%JJ/%MM/%AAAA"),
						),
					),
				),
			);
		}
		if (lAvecEdition) {
			H.push(
				IE.jsx.str("div", {
					class: "flex-contain conteneur-icones",
					"ie-identite": "menuCtxSuivi",
				}),
			);
		}
		H.push(
			'<div class="conteneur-suivi',
			!lAvecEdition ? " margin-espace-haut" : "",
			'">',
			IE.jsx.str(
				"div",
				{ class: "flex-contain conteneur-info-suivi" },
				IE.jsx.str(
					"time",
					{
						class: [
							"m-right-l date-contain",
							!!lSuivi.evenement.couleur ? "ie-line-color left" : "",
						],
						style: !!lSuivi.evenement.couleur
							? `--color-line :${lSuivi.evenement.couleur};`
							: false,
						datetime: ObjetDate_1.GDate.formatDate(lSuivi.date, "%MM-%JJ"),
					},
					ObjetDate_1.GDate.formatDate(lSuivi.date, "%JJ %MMM"),
				),
				IE.jsx.str(
					"div",
					{ class: "conteneur-milieu" },
					IE.jsx.str(
						"div",
						{ class: "ie-titre Gras" },
						lSuivi.evenement.getLibelle(),
					),
					lSuivi.responsable
						? IE.jsx.str(
								"div",
								{ class: "ie-titre-petit" },
								lSuivi.responsable.getLibelle(),
							)
						: "",
					aParams.parametres.avecEditionSuivisDeStage && lSuivi.publier
						? IE.jsx.str(
								"div",
								null,
								IE.jsx.str("i", {
									class: "icon_info_sondage_publier",
									role: "presentation",
								}),
								IE.jsx.str(
									"span",
									{ class: "ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.listeSuivis.etatPublie",
									),
								),
							)
						: "",
				),
			),
		);
		if (lSuivi.avecHeure || !!lSuivi.lieu) {
			const lHeures = [ObjetDate_1.GDate.formatDate(lSuivi.date, "%hh%sh%mm")];
			if (lSuivi.avecHeureFin) {
				lHeures.push(ObjetDate_1.GDate.formatDate(lSuivi.dateFin, "%hh%sh%mm"));
			}
			H.push(
				IE.jsx.str(
					"div",
					{ class: "conteneur-heure-lieu" },
					lSuivi.avecHeure
						? IE.jsx.str(
								"div",
								null,
								IE.jsx.str(
									"span",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.listeSuivis.Heure",
									) + " : ",
								),
								IE.jsx.str(
									"span",
									{ class: "ie-titre-petit" },
									lHeures.join(" - "),
								),
							)
						: "",
					!!lSuivi.lieu && lSuivi.lieu.getLibelle()
						? IE.jsx.str(
								"div",
								null,
								IE.jsx.str(
									"span",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.listeSuivis.Lieu",
									) + " : ",
								),
								IE.jsx.str(
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
				IE.jsx.str(
					"div",
					{ class: "conteneur-commentaire" },
					ObjetChaine_1.GChaine.replaceRCToHTML(lSuivi.commentaire),
				),
			);
		}
		if (lAvecEdition) {
			H.push('<div class="conteneur-pj">');
			H.push(
				IE.jsx.str("ie-btnselecteur", {
					class: "pj",
					"ie-model": "ajoutPJSuivi",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"FicheStage.AjouterPiecesJointes",
					),
					role: "button",
				}),
			);
			if (!!lSuivi.listePJ && lSuivi.listePJ.count()) {
				const lIEModelChips = _getIEModelChipsPJSuivi(lSuivi, aParams);
				H.push('<div class="flex-contain f-wrap m-top">');
				for (let i = 0, lNbr = lSuivi.listePJ.count(); i < lNbr; i++) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "chips-pj" },
							ObjetChaine_1.GChaine.composerUrlLienExterne({
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
					IE.jsx.str(
						"div",
						{ class: "chips-pj" },
						ObjetChaine_1.GChaine.composerUrlLienExterne({
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
	},
	composeBlocAppreciations(aDonnees, aParams) {
		const H = [];
		if (!!aDonnees.appreciations) {
			aDonnees.appreciations.setTri([ObjetTri_1.ObjetTri.init("Genre")]);
			aDonnees.appreciations.trier();
			if (!!aDonnees.referents && aDonnees.referents.count()) {
				H.push(_composeBlocAppreciationsReferents(aDonnees));
			}
			if (!!aDonnees.maitreDeStage && aDonnees.maitreDeStage.count()) {
				H.push(_composeBlocAppreciationsMDS(aDonnees));
			}
			_ajouterControleurEditionAppreciations(aDonnees, aParams);
		}
		return H.join("");
	},
	composeFenetreCreerSuivi(aThis) {
		const lSuivi = _creerNouveauSuivi();
		const lFenetreSuiviStage = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SuiviStage_1.ObjetFenetre_SuiviStage,
			{
				pere: aThis,
				evenement: function (aNumeroBouton, aSuiviModifie, aListePJ) {
					if (aNumeroBouton === Enumere_Action_1.EGenreAction.Valider) {
						if (
							aSuiviModifie.getEtat() === Enumere_Etat_1.EGenreEtat.Creation &&
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
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreSuiviStage.CreerSuivi",
						),
					});
					aInstance.setParametresFenetreSuivi({
						libellePublication: ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.listeSuivis.publierSuivi",
						),
						maxSizeDocumentJoint: (0, AccessApp_1.getApp)().droits.get(
							ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
						),
					});
				},
			},
		);
		const lListePJEleves = new ObjetListeElements_1.ObjetListeElements();
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
	},
};
function _composeBlocDetailsEntrepriseAccueil(aDonnees) {
	const H = [];
	const lEntreprise = aDonnees.entreprise;
	if (lEntreprise) {
		H.push(
			`<section class="entreprise-accueil">\n              <h2 class="ie-titre-couleur">${ObjetTraduction_1.GTraductions.getValeur("FicheStage.entrepriseAccueil")}</h2>\n                <div class="flex-wrapper">`,
		);
		H.push(`<div class="sous-section">`);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "conteneur-nom" },
				IE.jsx.str("i", {
					class: !!lEntreprise.estSiegeSocial
						? "icon_building"
						: "icon_entreprise",
					role: "presentation",
				}),
				IE.jsx.str(
					"h3",
					{ class: "ie-titre" },
					lEntreprise.getLibelle() +
						(!!lEntreprise.estSiegeSocial
							? ` (${ObjetTraduction_1.GTraductions.getValeur("FicheStage.siegeSocial")})`
							: ""),
				),
				!!lEntreprise.nomCommercial
					? IE.jsx.str("span", null, lEntreprise.nomCommercial)
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
				IE.jsx.str(
					"div",
					{ class: "conteneur-adresse" },
					IE.jsx.str(
						"ul",
						null,
						!!lEntreprise.adresse1
							? IE.jsx.str("li", null, lEntreprise.adresse1)
							: "",
						!!lEntreprise.adresse2
							? IE.jsx.str("li", null, lEntreprise.adresse2)
							: "",
						!!lEntreprise.adresse3
							? IE.jsx.str("li", null, lEntreprise.adresse3)
							: "",
						!!lEntreprise.adresse4
							? IE.jsx.str("li", null, lEntreprise.adresse4)
							: "",
						!!strCPVillePays.length
							? IE.jsx.str("li", null, strCPVillePays.join(" "))
							: "",
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
					IE.jsx.str(
						"div",
						{
							class: "lien-communication tel-mobile",
							title: ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.TelPortable",
							),
						},
						IE.jsx.str(
							"a",
							{
								href:
									"tel:" +
									ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
										lEntreprise.indMobile,
										lEntreprise.mobile,
									),
							},
							ObjetChaine_1.GChaine.formatTelephone(lEntreprise.mobile),
							IE.jsx.str(
								"span",
								{ class: "sr-only" },
								ObjetTraduction_1.GTraductions.getValeur(
									"FicheStage.TelPortable",
								),
							),
						),
					),
				);
			}
			if (!!lEntreprise.telFixe) {
				H.push(
					IE.jsx.str(
						"div",
						{
							class: "lien-communication tel",
							title:
								ObjetTraduction_1.GTraductions.getValeur("FicheStage.TelFixe"),
						},
						IE.jsx.str(
							"a",
							{
								href:
									"tel:" +
									ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
										lEntreprise.indFix,
										lEntreprise.telFixe,
									),
							},
							ObjetChaine_1.GChaine.formatTelephone(lEntreprise.telFixe),
							IE.jsx.str(
								"span",
								{ class: "sr-only" },
								ObjetTraduction_1.GTraductions.getValeur("FicheStage.TelFixe"),
							),
						),
					),
				);
			}
			if (!!lEntreprise.fax) {
				H.push(
					IE.jsx.str(
						"div",
						{
							class: "lien-communication",
							title: ObjetTraduction_1.GTraductions.getValeur("FicheStage.Fax"),
						},
						IE.jsx.str(
							"a",
							{
								href:
									"fax:" +
									ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
										lEntreprise.indFax,
										lEntreprise.fax,
									),
							},
							ObjetChaine_1.GChaine.formatTelephone(lEntreprise.fax),
							IE.jsx.str(
								"span",
								{ class: "sr-only" },
								ObjetTraduction_1.GTraductions.getValeur("FicheStage.Fax"),
							),
						),
					),
				);
			}
			if (!!lEntreprise.site) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "lien-communication" },
						IE.jsx.str(
							"a",
							{
								href: ObjetChaine_1.GChaine.encoderUrl(
									ObjetChaine_1.GChaine.verifierURLHttp(lEntreprise.site),
								),
							},
							lEntreprise.site,
						),
					),
				);
			}
			if (!!lEntreprise.email) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "lien-communication" },
						IE.jsx.str(
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
					IE.jsx.str(
						"div",
						{ class: "sous-section conteneur-responsable" },
						IE.jsx.str(
							"h3",
							{ class: "ie-titre-petit" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.responsableEntreprise",
							),
							": ",
						),
						IE.jsx.str("span", null, lEntreprise.responsable.getLibelle()),
					),
				);
			}
			if (lEntreprise.commentairePublie) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "sous-section" },
						lEntreprise.commentairePublie,
					),
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
			? ObjetTraduction_1.GTraductions.getValeur("FicheStage.maitresDeStage")
			: ObjetTraduction_1.GTraductions.getValeur("FicheStage.maitreDeStage");
	H.push(
		`<section class="entreprise-maitres">\n            <h2 class="ie-titre-couleur">${lLibelleTitre}</h2>\n              <div class="flex-wrapper">`,
	);
	lListe.parcourir((aMDS) => {
		H.push(
			'<div class="conteneur-maitre-stage">',
			IE.jsx.str(
				"div",
				{ class: "sous-section conteneur-nom" },
				IE.jsx.str("span", { class: "nom-maitre" }, aMDS.getLibelle()),
				!!aMDS.fonction
					? IE.jsx.str("div", { class: "fonction" }, aMDS.fonction)
					: "",
			),
		);
		H.push(`<div class="sous-section conteneur-info">`);
		if (!!aMDS.telPortable) {
			H.push(
				IE.jsx.str(
					"div",
					{
						class: "lien-communication tel-mobile",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.MDS.Portable",
						),
					},
					IE.jsx.str(
						"a",
						{
							href:
								"tel:" +
								ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
									aMDS.indPortable,
									aMDS.telPortable,
								),
						},
						ObjetChaine_1.GChaine.formatTelephone(aMDS.telPortable),
						IE.jsx.str(
							"span",
							{ class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.MDS.Portable",
							),
						),
					),
				),
			);
		}
		if (!!aMDS.telFixe) {
			H.push(
				IE.jsx.str(
					"div",
					{
						class: "lien-communication tel",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.MDS.TelFixe",
						),
					},
					IE.jsx.str(
						"a",
						{
							href:
								"tel:" +
								ObjetChaine_1.GChaine.formatTelephoneAvecIndicatif(
									aMDS.indFixe,
									aMDS.telFixe,
								),
						},
						ObjetChaine_1.GChaine.formatTelephone(aMDS.telFixe),
						IE.jsx.str(
							"span",
							{ class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.MDS.TelFixe",
							),
						),
					),
				),
			);
		}
		if (!!aMDS.fax) {
			H.push(
				IE.jsx.str(
					"div",
					{
						class: "lien-communication",
						title:
							ObjetTraduction_1.GTraductions.getValeur("FicheStage.MDS.Fax"),
					},
					IE.jsx.str(
						"a",
						{ href: "fax:" + ObjetChaine_1.GChaine.formatTelephone(aMDS.fax) },
						ObjetChaine_1.GChaine.formatTelephone(aMDS.fax),
						IE.jsx.str(
							"span",
							{ class: "sr-only" },
							ObjetTraduction_1.GTraductions.getValeur("FicheStage.MDS.Fax"),
						),
					),
				),
			);
		}
		if (!!aMDS.email) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "lien-communication" },
					IE.jsx.str(
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
function _composeBlocDetailsReferents(aDonnees) {
	const H = [];
	if (aDonnees.referents && aDonnees.referents.count()) {
		H.push(
			IE.jsx.str(
				"section",
				{ class: "Bloc-details-enseignants" },
				IE.jsx.str(
					"h2",
					{ class: "ie-titre-couleur" },
					aDonnees.referents.count() > 1
						? ObjetTraduction_1.GTraductions.getValeur("FicheStage.referents")
						: ObjetTraduction_1.GTraductions.getValeur("FicheStage.referent"),
				),
				IE.jsx.str(
					"div",
					{ class: "conteneur-enseignants" },
					aDonnees.referents.getTableauLibelles().join(", "),
				),
			),
		);
	}
	return H.join("");
}
function _composeBlocDetailsPresenceEtablissement(aDonnees) {
	const H = [];
	if (
		aDonnees.attenduEnCours ||
		aDonnees.prevuMidi ||
		aDonnees.prevuSoir ||
		aDonnees.hebergement !==
			TypeHebergementStage_1.TypeHebergementStage.tHST_NonRenseigne
	) {
		H.push('<section class="Bloc-details-presenceetablissement">');
		H.push(
			IE.jsx.str(
				"h2",
				{ class: "ie-titre-couleur" },
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheStage.PresenceDansLEtablissement",
				),
			),
		);
		if (aDonnees.attenduEnCours) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "ligne-info-presenceetablissement" },
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheStage.EleveAttenduEnCours",
					),
				),
			);
		}
		if (aDonnees.prevuMidi || aDonnees.prevuSoir) {
			if (aDonnees.prevuMidi && aDonnees.prevuSoir) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "ligne-info-presenceetablissement" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.ElevePrevuAuxRepas",
						),
					),
				);
			} else if (aDonnees.prevuMidi) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "ligne-info-presenceetablissement" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.ElevePrevuMidi",
						),
					),
				);
			} else if (aDonnees.prevuSoir) {
				H.push(
					IE.jsx.str(
						"div",
						{ class: "ligne-info-presenceetablissement" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.ElevePrevuSoir",
						),
					),
				);
			}
		}
		if (
			aDonnees.hebergement !==
			TypeHebergementStage_1.TypeHebergementStage.tHST_NonRenseigne
		) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "ligne-info-presenceetablissement" },
					TypeHebergementStage_1.TypeHebergementStageUtil.getLibelle(
						aDonnees.hebergement,
					),
				),
			);
		}
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
				IE.jsx.str(
					"h2",
					{ class: "ie-titre-couleur" },
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheStage.PresenceDansEntreprise",
					) +
						(aDonnees.nbJours
							? " (" +
								ObjetTraduction_1.GTraductions.getValeur(
									"FicheStage.dureeDetails",
								) +
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
				IE.jsx.str(
					"div",
					{
						class: [
							"Bloc-entreprise-dates",
							!IE.estMobile ? "conteneur-Espace" : "",
						],
					},
					IE.jsx.str(
						"h3",
						{ class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur("FicheStage.stageDates"),
					),
					IE.jsx.str(
						"div",
						null,
						ObjetDate_1.GDate.formatDate(
							aDonnees.dateDebut,
							ObjetTraduction_1.GTraductions.getValeur("Du") + " %JJ/%MM/%AAAA",
						) +
							ObjetDate_1.GDate.formatDate(
								aDonnees.dateFin,
								" " +
									ObjetTraduction_1.GTraductions.getValeur("Au") +
									" %JJ/%MM/%AAAA",
							),
					),
				),
			);
		}
		if (lAvecHoraire) {
			H.push("<div>");
			H.push(
				IE.jsx.str(
					"div",
					{ class: "Bloc-entreprise-horaire" },
					IE.jsx.str(
						"table",
						null,
						IE.jsx.str(
							"caption",
							{ class: "Gras ie-titre-petit text-left m-bottom" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.stageHoraires",
							),
						),
						IE.jsx.str(
							"thead",
							{ class: "sr-only" },
							IE.jsx.str(
								"tr",
								null,
								IE.jsx.str(
									"th",
									{ scope: "col" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.waiColJours",
									),
								),
								IE.jsx.str(
									"th",
									{ scope: "col" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.waiColHoraire",
									),
								),
								IE.jsx.str(
									"th",
									{ scope: "col" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.waiColDuree",
									),
								),
							),
						),
						(H) => {
							lListeJours.parcourir((aJour) => {
								if (aJour && aJour.horaires && aJour.horaires.count() > 0) {
									H.push(
										IE.jsx.str(
											"tr",
											{ class: "conteneur-journee" },
											IE.jsx.str(
												"th",
												{ scope: "row", class: "Gras nom-journee" },
												aJour.getLibelle(),
											),
											IE.jsx.str("td", null, (aTabHoraires) => {
												for (
													let i = 0, lNbr = aJour.horaires.count();
													i < lNbr;
													i++
												) {
													if (i > 0) {
														aTabHoraires.push(IE.jsx.str("span", null, " / "));
													}
													aTabHoraires.push(
														IE.jsx.str(
															"span",
															null,
															aJour.horaires.get(i).getLibelle(),
														),
													);
												}
											}),
											IE.jsx.str(
												"td",
												{ class: "Gras heure-journee" },
												aJour.heuresJournee,
											),
										),
									);
								}
							});
						},
					),
					IE.jsx.str(
						"div",
						{ class: "flex-contain conteneur-total-hebdo" },
						IE.jsx.str(
							"div",
							{ class: "Gras ie-titre-petit titre-total avecMarginTop" },
							ObjetTraduction_1.GTraductions.getValeur("FicheStage.totalHebdo"),
						),
						IE.jsx.str(
							"div",
							{ class: "chips-total-stage" },
							IE.jsx.str(
								"ie-chips",
								{ class: "tag-style" },
								aDonnees.heuresHebdo,
							),
						),
					),
				),
			);
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
function _composeBlocDocumentsJoints(aDonnees, aParams) {
	const H = [];
	H.push('<section class="Bloc-details-documentsJoints">');
	H.push(
		IE.jsx.str(
			"div",
			{ class: "Gras ie-titre-petit" },
			ObjetTraduction_1.GTraductions.getValeur("FicheStage.documentsJoints"),
		),
	);
	H.push('<div class="m-bottom-l">');
	const lGenresPJ = {};
	let lAvecConventionDeStage = false;
	aDonnees.listePJ.setTri([
		ObjetTri_1.ObjetTri.init(function (aPJ) {
			switch (aPJ.genreDocJoint.getGenre()) {
				case undefined:
					return 3;
				case 0:
					return 2;
				default:
					return 1;
			}
		}),
		ObjetTri_1.ObjetTri.init(function (aPJ) {
			return aPJ.genreDocJoint.getGenre();
		}),
	]);
	aDonnees.listePJ.trier();
	aDonnees.listePJ.parcourir((aPJ) => {
		const lID = _getIDDocJointDeType(aPJ);
		if (
			!lAvecConventionDeStage &&
			aPJ.genreDocJoint.getGenre() ===
				TypeOrigineCreationLibelleDocJointEleve_1
					.TypeOrigineCreationLibelleDocJointEleve.OCLDJ_ConventionDeStage
		) {
			lAvecConventionDeStage = true;
		}
		if (lGenresPJ[lID] !== lID) {
			lGenresPJ[lID] = aPJ.genreDocJoint.getLibelle();
		}
	});
	if (
		aDonnees.listeDocumentsSignes &&
		aDonnees.listeDocumentsSignes.count() > 0
	) {
		H.push('<div class="bloc-pj">');
		aDonnees.listeDocumentsSignes.trier();
		H.push(
			`${ObjetTraduction_1.GTraductions.getValeur("FicheStage.documentsDeStageSigneElectroniquement")} : `,
		);
		aDonnees.listeDocumentsSignes.parcourir((aDoc) => {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "m-left" },
					_ajoutDocumentDeStageSigne(aDoc.document, aParams),
				),
			);
		});
		H.push("</div>");
	}
	for (const lGenre in lGenresPJ) {
		H.push('<div class="bloc-pj">');
		H.push(
			lGenresPJ[lGenre] !== ""
				? `${lGenresPJ[lGenre]} : `
				: `${ObjetTraduction_1.GTraductions.getValeur("FicheStage.autreDocJoint")} : `,
		);
		H.push('<div class="m-left">');
		aDonnees.listePJ.parcourir((aPJ) => {
			const lID = _getIDDocJointDeType(aPJ);
			if (lGenre === lID) {
				H.push(
					ObjetChaine_1.GChaine.composerUrlLienExterne({
						documentJoint: aPJ,
						maxWidth: 250,
					}),
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
function _ajoutDocumentDeStageSigne(aDocument, aParams) {
	if (aDocument.documentArchive) {
		if (!aDocument.documentArchive.fichierExiste) {
			const lControleur = aParams.controleur;
			if (lControleur) {
				if (!lControleur.ouvrirDocument) {
					lControleur.ouvrirDocument = {
						event: function () {
							UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirPatience();
							if (ObjetRequeteURLSignataire_1.ObjetRequeteURLSignataire) {
								const lObj = {
									typeAction:
										ObjetRequeteURLSignataire_1.TypeActionSignataire
											.voirDocument,
									document: aDocument,
								};
								new ObjetRequeteURLSignataire_1.ObjetRequeteURLSignataire(this)
									.lancerRequete(lObj)
									.then((aJSON) => {
										if (aJSON.message) {
											UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
											GApplication.getMessage().afficher({
												type: Enumere_BoiteMessage_1.EGenreBoiteMessage
													.Information,
												titre: "",
												message: aJSON.message,
											});
										} else if (aJSON.url) {
											UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(
												aJSON.url,
											);
										} else {
											UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
										}
									});
							}
						},
					};
				}
			}
			return IE.jsx.str(
				"ie-chips",
				{
					class: "m-all avec-event iconic icon_uniF1C1",
					"ie-model": "ouvrirDocument",
				},
				aDocument.documentArchive.getLibelle(),
			);
		} else {
			const lDocument = new ObjetElement_1.ObjetElement(
				aDocument.documentArchive.getLibelle(),
				aDocument.getNumero(),
				aDocument.documentArchive.getGenre(),
			);
			return ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDocument,
				maxWidth: 250,
			});
		}
	} else {
		return "";
	}
}
function jsxModeleBoutonModifierAnnexe(
	aTypeAnnexePedagogique,
	aDonnees,
	aParams,
) {
	return {
		event: () => {
			if (aParams.parametres.avecEdition) {
				const lInstance = aParams.controleur.instance;
				const lFenetreAnnexePedagogique =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_AnnexePedagogiquePN_1.ObjetFenetre_AnnexePedagogiquePN,
						{
							pere: lInstance,
							evenement: function (aGenreBouton, aDonneesFenetre) {
								if (aGenreBouton === 1) {
									aDonneesFenetre.setEtat(
										Enumere_Etat_1.EGenreEtat.Modification,
									);
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
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_SujetDetaille:
						lParams.listeSujets = aParams.parametres.listeSujetsStage;
						break;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_ActivitesDejaRealisees:
						lParams.genreSecondaire =
							TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_CompetencesMobilisees;
						break;
					case TypesAnnexePedagogique_1.TypeAnnexePedagogique
						.TAP_ActivitesPrevues:
						lParams.genreSecondaire =
							TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_MoyensMobilises;
						break;
				}
				lFenetreAnnexePedagogique.setDonnees(aDonnees, lParams);
			}
		},
	};
}
function _composeBlocAnnexes(aDonnees, aParams) {
	const H = [];
	H.push('<section class="Bloc-details-annexes">');
	if (
		aParams.parametres.avecEdition ||
		aDonnees.sujet.getLibelle() ||
		aDonnees.sujetDetaille
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl border-bottom" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur("FicheStage.annexe.stage"),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique
										.TAP_SujetDetaille,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				IE.jsx.str(
					"div",
					{ class: [!IE.estMobile ? "flex-contain " : "", "m-right-xxl"] },
					aDonnees.sujet.getLibelle()
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl m-right-l sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.sujet",
									),
								),
								IE.jsx.str("div", null, aDonnees.sujet.getLibelle()),
							)
						: "",
					aDonnees.sujetDetaille
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.sujetDetaille",
									),
								),
								IE.jsx.str(
									"div",
									null,
									ObjetChaine_1.GChaine.replaceRCToHTML(aDonnees.sujetDetaille),
								),
							)
						: "",
				),
			),
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.activitesDejaRealisees ||
		aDonnees.competencesMobilisees
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl border-bottom" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.annexe.competencesEtActivites",
						),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique
										.TAP_ActivitesDejaRealisees,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				IE.jsx.str(
					"div",
					{ class: [!IE.estMobile ? "flex-contain " : "", "m-right-xxl"] },
					aDonnees.activitesDejaRealisees
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl m-right-l sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.activitesDejaRealisees",
									),
								),
								IE.jsx.str(
									"div",
									null,
									ObjetChaine_1.GChaine.replaceRCToHTML(
										aDonnees.activitesDejaRealisees,
									),
								),
							)
						: "",
					aDonnees.competencesMobilisees
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.competencesMobilisees",
									),
								),
								IE.jsx.str(
									"div",
									null,
									ObjetChaine_1.GChaine.replaceRCToHTML(
										aDonnees.competencesMobilisees,
									),
								),
							)
						: "",
				),
			),
		);
	}
	if (aParams.parametres.avecEdition || aDonnees.objectifs) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl border-bottom" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.annexe.objectifsAssignes",
						),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique.TAP_Objectifs,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				aDonnees.objectifs
					? IE.jsx.str(
							"div",
							{ class: "m-bottom-xl m-right-xxl" },
							ObjetChaine_1.GChaine.replaceRCToHTML(aDonnees.objectifs),
						)
					: "",
			),
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.activitesPrevues ||
		aDonnees.moyensMobilises
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl border-bottom" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.annexe.activitesPrevuesAuCoursStage",
						),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique
										.TAP_ActivitesPrevues,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				IE.jsx.str(
					"div",
					{ class: [!IE.estMobile ? "flex-contain " : "", "m-right-xxl"] },
					aDonnees.activitesPrevues
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl m-right-l sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.activitesPrevues",
									),
								),
								IE.jsx.str(
									"div",
									null,
									ObjetChaine_1.GChaine.replaceRCToHTML(
										aDonnees.activitesPrevues,
									),
								),
							)
						: "",
					aDonnees.moyensMobilises
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.moyensMobilises",
									),
								),
								IE.jsx.str(
									"div",
									null,
									ObjetChaine_1.GChaine.replaceRCToHTML(
										aDonnees.moyensMobilises,
									),
								),
							)
						: "",
				),
			),
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.competencesVisees ||
		(aDonnees.listeCompetencesVisees && aDonnees.listeCompetencesVisees.length)
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl border-bottom" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.annexe.competencesVisees",
						),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique
										.TAP_CompetencesVisees,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				aDonnees.competencesVisees
					? IE.jsx.str(
							"div",
							{ class: "m-bottom-xl m-right-xxl" },
							ObjetChaine_1.GChaine.replaceRCToHTML(aDonnees.competencesVisees),
						)
					: "",
				aDonnees.listeCompetencesVisees &&
					aDonnees.listeCompetencesVisees.length
					? getHtmlListeCompetencesVisees(aDonnees.listeCompetencesVisees)
					: "",
			),
		);
	}
	if (
		aDonnees.avecTravauxAuxMineurs &&
		(aParams.parametres.avecEdition || aDonnees.travauxAuxMineurs)
	) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl border-bottom" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.annexe.travauxAuxMineurs",
						),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique
										.TAP_TravauxAuxMineurs,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				aDonnees.travauxAuxMineurs
					? IE.jsx.str(
							"div",
							{ class: "m-bottom-xl m-right-xxl" },
							ObjetChaine_1.GChaine.replaceRCToHTML(aDonnees.travauxAuxMineurs),
						)
					: "",
			),
		);
	}
	if (aParams.parametres.avecEdition || aDonnees.modalitesConcertation) {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl border-bottom" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.annexe.modalitesDEncadrement",
						),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique
										.TAP_ModalitesDeConcertation,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				aDonnees.modalitesConcertation
					? IE.jsx.str(
							"div",
							{ class: "m-bottom-xl m-right-xxl" },
							ObjetChaine_1.GChaine.replaceRCToHTML(
								aDonnees.modalitesConcertation,
							),
						)
					: "",
			),
		);
	}
	if (
		aParams.parametres.avecEdition ||
		aDonnees.typeModalitesEvaluation.getGenre() !==
			TypesAnnexePedagogique_1.TypeModaliteDEvaluationMilieuProfessionnel
				.TMEMP_Aucune ||
		aDonnees.modalitesEvaluation
	) {
		H.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"div",
					{ class: "flex-contain justify-between flex-center flex-gap-l" },
					IE.jsx.str(
						"h2",
						{ class: "ie-titre-couleur-lowercase" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.annexe.modalitesDeLaPeriodePro",
						),
					),
					aParams.parametres.avecEdition
						? IE.jsx.str("ie-btnicon", {
								class: "fix-bloc icon_pencil i-medium avecFond m-bottom",
								"ie-model": jsxModeleBoutonModifierAnnexe.bind(
									null,
									TypesAnnexePedagogique_1.TypeAnnexePedagogique
										.TAP_ModalitesDEvaluation,
									aDonnees,
									aParams,
								),
								title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
							})
						: "",
				),
				IE.jsx.str(
					"div",
					{ class: [!IE.estMobile ? "flex-contain " : "", "m-right-xxl"] },
					aDonnees.typeModalitesEvaluation.getGenre() !==
						TypesAnnexePedagogique_1.TypeModaliteDEvaluationMilieuProfessionnel
							.TMEMP_Aucune
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl m-right-l sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.typeDEvaluation",
									),
								),
								IE.jsx.str(
									"div",
									null,
									aDonnees.typeModalitesEvaluation.getLibelle(),
								),
							)
						: "",
					aDonnees.modalitesEvaluation
						? IE.jsx.str(
								"div",
								{ class: "m-bottom-xl sous-section" },
								IE.jsx.str(
									"div",
									{ class: "Gras ie-titre-petit" },
									ObjetTraduction_1.GTraductions.getValeur(
										"FicheStage.annexe.modalitesDEvaluation",
									),
								),
								IE.jsx.str(
									"div",
									null,
									ObjetChaine_1.GChaine.replaceRCToHTML(
										aDonnees.modalitesEvaluation,
									),
								),
							)
						: "",
				),
			),
		);
	}
	H.push("</section>");
	return H.join("");
}
function _composeBlocAppreciationsReferents(aDonnees) {
	const H = [];
	const lListe = aDonnees.appreciations.getListeElements((aAppreciation) =>
		[
			Enumere_Ressource_1.EGenreRessource.Enseignant,
			Enumere_Ressource_1.EGenreRessource.Personnel,
		].includes(aAppreciation.getGenre()),
	);
	H.push(
		IE.jsx.str(
			"section",
			{ class: "Bloc-appreciations" },
			IE.jsx.str(
				"h2",
				{ class: "ie-titre-couleur" },
				ObjetTraduction_1.GTraductions.getValeur("FicheStage.appreciations"),
			),
			_construireAppreciations(
				lListe,
				lListe.count() > 1
					? ObjetTraduction_1.GTraductions.getValeur("FicheStage.referents")
					: ObjetTraduction_1.GTraductions.getValeur("FicheStage.referent"),
			),
		),
	);
	return H.join("");
}
function _composeBlocAppreciationsMDS(aDonnees) {
	const H = [];
	const lListe = aDonnees.appreciations.getListeElements((aAppreciation) => {
		return (
			aAppreciation.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.MaitreDeStage
		);
	});
	H.push(
		IE.jsx.str(
			"section",
			{ class: "Bloc-appreciations" },
			_construireAppreciations(
				lListe,
				lListe.count() > 1
					? ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.maitresDeStage",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.maitreDeStage",
						),
			),
		),
	);
	return H.join("");
}
function _construireAppreciations(aDonnees, aLibelle) {
	if (!!aDonnees && aDonnees.count()) {
		let lAvecEdition = false;
		aDonnees.parcourir((aAppreciation) => {
			if (aAppreciation.avecEditionAppreciation) {
				lAvecEdition = true;
			}
		});
		return IE.jsx.str(
			"div",
			{ class: "conteneur-appreciation" },
			IE.jsx.str(
				"div",
				{ class: "flex-contain Gras ie-titre-petit" },
				aLibelle,
				lAvecEdition
					? IE.jsx.str("ie-btnicon", {
							class: "icon_pencil i-medium avecFond",
							"ie-model": "modifierAppreciation",
							title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
						})
					: "",
			),
			aDonnees.getTableau((aAppreciation) => {
				return IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ class: "nom-auteur" },
						aAppreciation.getLibelle(),
					),
					IE.jsx.str("div", { class: "m-bottom" }, aAppreciation.appreciation),
				);
			}),
		);
	}
	return "";
}
function _ajoutControleurEditionDetails(aDonnees, aParams) {
	const lControleur = aParams.controleur;
	if (lControleur) {
		if (!lControleur.ajoutPJ) {
			lControleur.ajoutPJ = {
				event: function () {
					const lInstance = lControleur.instance;
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
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"selecteurPJ.msgConfirmPJ",
					lPieceJointe.getLibelle(),
				),
				callback: function (aBouton) {
					if (aBouton === 0) {
						const lInstance = aParams.controleur.instance;
						if (!!lPieceJointe) {
							lPieceJointe.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							aSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							const lListePJ = new ObjetListeElements_1.ObjetListeElements();
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
				class: ObjetMenuCtxMixte_1.ObjetMenuCtxMixte,
				pere: aParams.controleur.instance,
				init(aMenuCtxMixte) {
					aMenuCtxMixte.setOptions({
						callbackAddCommandes(aMenu) {
							aMenu.add(
								ObjetTraduction_1.GTraductions.getValeur(
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
									typeAffEnModeMixte:
										Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
								},
							);
							aMenu.add(
								aSuivi.publier
									? ObjetTraduction_1.GTraductions.getValeur(
											"FicheStage.listeSuivis.MenuCtxPasPublierSuivi",
										)
									: ObjetTraduction_1.GTraductions.getValeur(
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
									typeAffEnModeMixte:
										Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
								},
							);
							aMenu.add(
								ObjetTraduction_1.GTraductions.getValeur(
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
									typeAffEnModeMixte:
										Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
								},
							);
						},
					});
				},
			};
		};
		lControleur.ajoutPJSuivi = {
			event: function () {
				const lInstance = lControleur.instance;
				afficherFenetreAjoutFichiers.call(lInstance, (aListeFichiers) => {
					if (!!aSuivi) {
						if (!aSuivi.listePJ) {
							aSuivi.listePJ = new ObjetListeElements_1.ObjetListeElements();
						}
						aSuivi.listePJ.add(aListeFichiers);
						aSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						_requeteSaisieFicheStage.call(aParams.controleur.instance, {
							callbackParam: { suivi: aSuivi },
							listePJ: aListeFichiers,
							stage: lStage,
						});
					}
				});
			},
			getLibelle() {
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheStage.AjouterPiecesJointes",
				);
			},
			getIcone() {
				return "icon_piece_jointe";
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
					const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_AppreciationsStage_1.ObjetFenetre_AppreciationsStage,
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
											lAppreciation.setEtat(
												Enumere_Etat_1.EGenreEtat.Modification,
											);
											lAvecModif = true;
										}
									});
									if (lAvecModif) {
										aDonnees.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
									ObjetTraduction_1.GTraductions.getValeur("Annuler"),
									ObjetTraduction_1.GTraductions.getValeur("Valider"),
								];
								aInstance.setOptionsFenetre({
									titre: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
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
	let lObjetFenetreAjoutMultiple =
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_UploadFichiers_1.ObjetFenetre_UploadFichiers,
			{
				pere: lThis,
				evenement: function (aGenreBouton, aListeFichiers) {
					if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
						if (!!aCallbackSurValidation) {
							aCallbackSurValidation.call(lThis, aListeFichiers);
						}
					}
					lObjetFenetreAjoutMultiple.fermer();
				},
			},
		);
	lObjetFenetreAjoutMultiple.setDonnees(
		Enumere_Ressource_1.EGenreRessource.DocumentJoint,
		{
			tailleMaxUploadFichier: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		},
	);
	lObjetFenetreAjoutMultiple.afficher();
}
function getHtmlListeCompetencesVisees(aListeCompetencesVisees) {
	const H = [];
	H.push('<div class="m-bottom-xl m-right-xxl">');
	aListeCompetencesVisees.forEach((aCompetence) => {
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-bottom-xl" },
				IE.jsx.str("h3", null, aCompetence.compVisees),
				IE.jsx.str("p", null, aCompetence.blocComp),
				aCompetence.resultat
					? IE.jsx.str(
							"p",
							{ class: "Italique" },
							ObjetChaine_1.GChaine.replaceRCToHTML(aCompetence.resultat),
						)
					: "",
			),
		);
	});
	H.push("</div>");
	return H.join("");
}
function _creerNouveauSuivi() {
	const lNouveauSuivi = new ObjetElement_1.ObjetElement();
	lNouveauSuivi.date = ObjetDate_1.GDate.getDateHeureCourante();
	lNouveauSuivi.avecSaisiePossible = true;
	lNouveauSuivi.responsable = GEtatUtilisateur.getUtilisateur();
	lNouveauSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
	return lNouveauSuivi;
}
function _supprimerSuivi(aParams) {
	const lSuivi = aParams.suivi,
		lInstance = aParams.instance,
		lStage = aParams.stage;
	GApplication.getMessage()
		.afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"FicheStage.listeSuivis.MsgConfirmSuppSuivi",
			),
		})
		.then((aGenreAction) => {
			if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
				lSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
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
	lSuivi.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
	const lFenetreSuiviStage = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_SuiviStage_1.ObjetFenetre_SuiviStage,
		{
			pere: lInstance,
			evenement: function (aNumeroBouton, aSuiviModifie) {
				if (aNumeroBouton === Enumere_Action_1.EGenreAction.Valider) {
					if (lSuivi) {
						const lIndiceSuiviConcerne =
							lStage.suiviStage.getIndiceParNumeroEtGenre(
								aSuiviModifie.getNumero(),
							);
						lStage.suiviStage.addElement(aSuiviModifie, lIndiceSuiviConcerne);
					}
					if (!!aSuiviModifie) {
						Object.assign(lSuivi, aSuiviModifie);
						const lListePJ = new ObjetListeElements_1.ObjetListeElements();
						if (!!lSuivi.listePJ) {
							lSuivi.listePJ.parcourir((aPJ) => {
								if (aPJ.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
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
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreSuiviStage.ModifierSuivi",
					),
				});
				aInstance.setParametresFenetreSuivi({
					libellePublication: ObjetTraduction_1.GTraductions.getValeur(
						"FicheStage.listeSuivis.publierSuivi",
					),
					maxSizeDocumentJoint: (0, AccessApp_1.getApp)().droits.get(
						ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
					),
				});
			},
		},
	);
	const lListePJ = new ObjetListeElements_1.ObjetListeElements();
	if (!!lSuivi.listePJ) {
		lListePJ.add(lSuivi.listePJ);
	}
	lFenetreSuiviStage.setDonnees({
		suivi: lSuivi,
		listeResponsables: lStage.listeResponsables,
		respAdminCBFiltrage: lStage.respAdminCBFiltrage,
		evenements: aParams.evenements,
		lieux: aParams.lieux,
		dateFinSaisieSuivi: lInstance.dateFinSaisieSuivi,
		listePJEleve: lListePJ,
	});
}
function _requeteSaisieFicheStage(aParams) {
	new ObjetRequeteSaisieAppreciationFinDeStage_1.ObjetRequeteSaisieAppreciationFinDeStage(
		this,
	)
		.addUpload({ listeFichiers: aParams.listePJ })
		.lancerRequete({
			numEleve: aParams.stage.numeroEleve,
			stage: aParams.stage,
			listePJ: aParams.listePJ,
		})
		.then(() => {
			if (!!aParams.then) {
				aParams.then();
			}
			this.actionSurValidation(aParams.callbackParam);
		});
}
