exports.PiedBulletin_Orientations = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const TypeRubriqueOrientation_1 = require("TypeRubriqueOrientation");
const TypeAvisConseil_1 = require("TypeAvisConseil");
const ObjetListe_1 = require("ObjetListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const TypeModuleFonctionnelPiedBulletin_1 = require("TypeModuleFonctionnelPiedBulletin");
const GlossaireOrientation_1 = require("GlossaireOrientation");
class PiedBulletin_Orientations extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			avecContenuVide: false,
		};
	}
	construireInstances() {
		this.identListeOrientationClasse = this.add(
			ObjetListe_1.ObjetListe,
			null,
			(aListe) => {
				aListe.setOptionsListe({
					ariaLabel:
						TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletinUtil.getLibelle(
							TypeModuleFonctionnelPiedBulletin_1
								.TypeModuleFonctionnelPiedBulletin.MFPB_Orientations,
						),
				});
			},
		);
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		return this.params.contexte ===
			TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve
			? _estAfficheEnContexteEleve(this.params.objetOrientation)
			: _estAfficheEnContexteClasse(this.params.objetOrientation);
	}
	_construireBlocOrientationEleve(aObjetOrientation) {
		const T = [];
		if (!!aObjetOrientation) {
			aObjetOrientation.listeRubriques.parcourir((aRubrique) => {
				T.push("<div>");
				if (
					aRubrique.getGenre() ===
						TypeRubriqueOrientation_1.TypeRubriqueOrientation
							.RO_IntentionFamille ||
					aRubrique.getGenre() ===
						TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_VoeuDefinitif
				) {
					let lTitreBloc;
					if (
						aRubrique.getGenre() ===
						TypeRubriqueOrientation_1.TypeRubriqueOrientation
							.RO_IntentionFamille
					) {
						lTitreBloc =
							GlossaireOrientation_1.TradGlossaireOrientation.Ressources
								.IntentionsEtAvisProvisoire;
					} else {
						lTitreBloc =
							GlossaireOrientation_1.TradGlossaireOrientation.Ressources
								.ChoixEtPropositions;
					}
					T.push(
						'<div class="PetitEspaceHaut PetitEspaceBas Gras" style="',
						ObjetStyle_1.GStyle.composeCouleurTexte(
							GCouleur.themeCouleur.foncee,
						),
						'">',
						lTitreBloc,
						"</div>",
					);
					T.push(construitRubriqueAvecListeVoeux(aRubrique));
				} else {
					T.push(construitRubriqueAutre(aRubrique));
				}
				T.push("</div>");
			});
		}
		return T.join("");
	}
	_construireOrientationsClasse(aObjetOrientation) {
		const T = [];
		if (
			!!aObjetOrientation &&
			!!aObjetOrientation.listeOrientations &&
			aObjetOrientation.listeOrientations.count()
		) {
			T.push(
				'<div id="',
				this.getInstance(this.identListeOrientationClasse).getNom(),
				'"></div>',
			);
		}
		return T.join("");
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire: {
				const lEstContexteEleve =
					this.params.contexte ===
					TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve;
				if (!lEstContexteEleve) {
					_actualiserListeOrientationsClasse(
						this.getInstance(this.identListeOrientationClasse),
						this.params.objetOrientation,
					);
				}
				const lStr = lEstContexteEleve
					? this._construireBlocOrientationEleve(this.params.objetOrientation)
					: this._construireOrientationsClasse(this.params.objetOrientation);
				ObjetHtml_1.GHtml.setHtml(this.Nom, lStr);
				if (!lEstContexteEleve) {
					this.getInstance(this.identListeOrientationClasse).setDonnees(
						new DonneesListe_OrientationsClasse(
							this.params.objetOrientation.listeOrientations,
						),
					);
				}
				break;
			}
		}
	}
}
exports.PiedBulletin_Orientations = PiedBulletin_Orientations;
function _estAfficheEnContexteEleve(aObjetOrientation) {
	let lContientAuMoinsUnVoeu = false;
	if (!!aObjetOrientation && !!aObjetOrientation.listeRubriques) {
		aObjetOrientation.listeRubriques.parcourir((aRubrique) => {
			if (
				!!aRubrique &&
				!!aRubrique.listeVoeux &&
				aRubrique.listeVoeux.count() > 0
			) {
				lContientAuMoinsUnVoeu = true;
				return false;
			}
		});
	}
	return lContientAuMoinsUnVoeu;
}
function construitStrLibelleVoeuOrientation(aVoeuOrientation) {
	const lStrOrientation = [];
	if (!!aVoeuOrientation) {
		if (!!aVoeuOrientation.orientation) {
			lStrOrientation.push(aVoeuOrientation.orientation.getLibelle());
		} else if (!!aVoeuOrientation.commentaire) {
			lStrOrientation.push(aVoeuOrientation.commentaire);
		}
		if (!!aVoeuOrientation.listeSpecialites) {
			aVoeuOrientation.listeSpecialites.parcourir((aSpe) => {
				if (!!aSpe && !!aSpe.code) {
					lStrOrientation.push(aSpe.code);
				}
			});
		}
	}
	return lStrOrientation.join(" - ");
}
function construitRubriqueAvecListeVoeux(aRubrique) {
	const lHtmlRubrique = [];
	if (!!aRubrique) {
		if (!!aRubrique.listeVoeux && aRubrique.listeVoeux.count() > 0) {
			aRubrique.listeVoeux.parcourir((aVoeu) => {
				lHtmlRubrique.push(
					'<div class="m-all"><b>',
					construitStrLibelleVoeuOrientation(aVoeu),
					"</b>",
				);
				if (!!aVoeu.avecStagePasserelleFamille) {
					lHtmlRubrique.push(
						" (",
						GlossaireOrientation_1.TradGlossaireOrientation.Ressources
							.DemandeStagePasserelle,
						")",
					);
				}
				lHtmlRubrique.push("</div>");
				if (!!aVoeu.reponseCC || !!aVoeu.motivation) {
					lHtmlRubrique.push("<div>");
					if (!!aVoeu.reponseCC) {
						let lAvisLibelle = TypeAvisConseil_1.TypeAvisConseilUtil.getLibelle(
							aVoeu.reponseCC,
						);
						if (
							aRubrique.getGenre() ===
							TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_VoeuDefinitif
						) {
							lAvisLibelle =
								TypeAvisConseil_1.TypeAvisConseilUtil.getLibelleOuiNon(
									aVoeu.reponseCC,
								);
						}
						lHtmlRubrique.push(
							'<span class="Bloc_TypeAvisConseil TypeAvis_',
							aVoeu.reponseCC,
							'" style="margin-right: 5px;">',
							lAvisLibelle || "",
							"</span>",
						);
					}
					if (aVoeu.motivation) {
						lHtmlRubrique.push(aVoeu.motivation);
					}
					if (aVoeu.avecStagePasserelleConseil) {
						lHtmlRubrique.push(
							" (",
							GlossaireOrientation_1.TradGlossaireOrientation.Ressources
								.StagePasserellePropose,
							")",
						);
					}
					lHtmlRubrique.push("</div>");
				}
			});
		}
	}
	return lHtmlRubrique.join("");
}
function construitRubriqueAutre(aRubrique) {
	const lHtmlRubrique = [];
	const lPremierVoeu =
		!!aRubrique.listeVoeux && aRubrique.listeVoeux.count() > 0
			? aRubrique.listeVoeux.getPremierElement()
			: null;
	if (!!lPremierVoeu) {
		lHtmlRubrique.push(
			"<b>",
			aRubrique.getLibelle(),
			"</b> : ",
			construitStrLibelleVoeuOrientation(lPremierVoeu),
		);
		if (!!lPremierVoeu.avecStagePasserelleConseil) {
			lHtmlRubrique.push(
				" - ",
				GlossaireOrientation_1.TradGlossaireOrientation.Ressources
					.StagePasserellePropose,
			);
		}
	}
	return lHtmlRubrique.join("");
}
function _estAfficheEnContexteClasse(aObjetOrientation) {
	return (
		!!aObjetOrientation &&
		!!aObjetOrientation.listeOrientations &&
		aObjetOrientation.listeOrientations.count() > 0
	);
}
function _actualiserListeOrientationsClasse(aInstanceListe, aObjetOrientation) {
	const lRubriqueConcernee = aObjetOrientation.rubrique;
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_OrientationsClasse.colonnes.orientation,
		taille: 200,
		titre: !!lRubriqueConcernee ? lRubriqueConcernee.getLibelle() || "" : "",
	});
	const lEstModeOuiNon =
		!!lRubriqueConcernee &&
		lRubriqueConcernee.getGenre() ===
			TypeRubriqueOrientation_1.TypeRubriqueOrientation.RO_VoeuDefinitif;
	const lTypesAvisNonConcernes = [TypeAvisConseil_1.TypeAvisConseil.taco_Aucun];
	if (lEstModeOuiNon) {
		lTypesAvisNonConcernes.push(
			TypeAvisConseil_1.TypeAvisConseil.taco_Favorable,
		);
		lTypesAvisNonConcernes.push(TypeAvisConseil_1.TypeAvisConseil.taco_Reserve);
	}
	const lArrayTypeAvis = TypeAvisConseil_1.TypeAvisConseilUtil.toListe();
	for (let i = 0; i < lArrayTypeAvis.length; i++) {
		if (lTypesAvisNonConcernes.indexOf(lArrayTypeAvis[i]) === -1) {
			let lLibelleColonne = "";
			let lHintColonne;
			if (lEstModeOuiNon) {
				lLibelleColonne =
					TypeAvisConseil_1.TypeAvisConseilUtil.getLibelleOuiNon(
						lArrayTypeAvis[i],
					);
			} else {
				lLibelleColonne = TypeAvisConseil_1.TypeAvisConseilUtil.getAbbreviation(
					lArrayTypeAvis[i],
				);
				lHintColonne = TypeAvisConseil_1.TypeAvisConseilUtil.getLibelle(
					lArrayTypeAvis[i],
				);
			}
			lColonnes.push({
				id:
					DonneesListe_OrientationsClasse.colonnes.prefixe_typeAvis +
					lArrayTypeAvis[i],
				taille: 80,
				titre: lLibelleColonne,
				hint: lHintColonne,
				typeAvisConseil: lArrayTypeAvis[i],
			});
		}
	}
	aInstanceListe.setOptionsListe({
		colonnes: lColonnes,
		hauteurAdapteContenu: true,
		hauteurMaxAdapteContenu: 160,
	});
}
class DonneesListe_OrientationsClasse extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecEdition: false, avecSuppression: false });
	}
	avecMenuContextuel() {
		return false;
	}
	getClass(aParams) {
		const lClasses = [];
		if (estUneColonneTypeAvis(aParams.idColonne)) {
			lClasses.push("AlignementMilieu");
		}
		return lClasses.join(" ");
	}
	getValeur(aParams) {
		let lValeur = "";
		if (estUneColonneTypeAvis(aParams.idColonne)) {
			let lNombresEleves = 0;
			if (!!aParams.article.nombreEleves) {
				const lGenreTypeAvis = aParams.declarationColonne.typeAvisConseil;
				if (aParams.article.nombreEleves.length > lGenreTypeAvis) {
					lNombresEleves = aParams.article.nombreEleves[lGenreTypeAvis];
				}
			}
			return lNombresEleves;
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_OrientationsClasse.colonnes.orientation:
					lValeur = aParams.article.getLibelle();
					break;
			}
		}
		return lValeur;
	}
}
(function (DonneesListe_OrientationsClasse) {
	let colonnes;
	(function (colonnes) {
		colonnes["orientation"] = "OC_orientation";
		colonnes["prefixe_typeAvis"] = "OC_typeAvis_";
	})(
		(colonnes =
			DonneesListe_OrientationsClasse.colonnes ||
			(DonneesListe_OrientationsClasse.colonnes = {})),
	);
})(DonneesListe_OrientationsClasse || (DonneesListe_OrientationsClasse = {}));
function estUneColonneTypeAvis(aIdColonne) {
	return (
		!!aIdColonne &&
		aIdColonne.indexOf(
			DonneesListe_OrientationsClasse.colonnes.prefixe_typeAvis,
		) === 0
	);
}
