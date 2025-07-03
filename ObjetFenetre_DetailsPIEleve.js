exports.ObjetFenetre_DetailsPIEleve = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetRequeteDetailsPIEleve_1 = require("ObjetRequeteDetailsPIEleve");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const GUID_1 = require("GUID");
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetListeElements_1 = require("ObjetListeElements");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_DetailsPIEleve extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idDetailsProjet = GUID_1.GUID.getId();
		this.uniquementMatiereProf = false;
		this.projet = null;
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.setOptionsFenetre({
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			largeur: 500,
			hauteur: 150,
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserListe,
		);
		this.identCombo = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementCombo,
			this.initialiserCombo,
		);
	}
	evenementCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.projet = this.listeProjetsEleve.getElementParNumero(
				aParams.element.getNumero(),
			);
			ObjetHtml_1.GHtml.setHtml(
				this.idDetailsProjet,
				this.composeDetailsProjet(this.projet),
				{ controleur: this.controleur },
			);
			const lDetails = this.listeDetailsProjets.getElementParNumero(
				this.projet.getNumero(),
			);
			if (!!lDetails) {
				const lListeFiltree = new ObjetListeElements_1.ObjetListeElements();
				lDetails.details.parcourir((aDonnee) => {
					if (aDonnee.correspondMatiereProfesseur === true) {
						lListeFiltree.addElement(aDonnee);
					}
				});
				this.listeAffichee = lDetails.details;
				this.listeFiltree = lListeFiltree;
				this._actualiserListe(
					this.formatDonnees(
						this.uniquementMatiereProf === true
							? this.listeFiltree
							: this.listeAffichee,
					),
				);
			}
		}
	}
	composeDetailsProjet(aProjet) {
		const H = [];
		H.push('<div class="field-contain label-up border-bottom p-bottom-l">');
		H.push("<div>");
		H.push(
			ObjetTraduction_1.GTraductions.getValeur("FicheEleve.misEnPlace", [
				aProjet.libelleCourt || aProjet.getLibelle(),
			]),
		);
		if (!!aProjet.motifs) {
			H.push(" (", aProjet.motifs, ")");
		}
		if (!!aProjet.dateDebut) {
			H.push("&nbsp;");
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheEleve.aPartir",
					typeof aProjet.dateDebut === "string"
						? aProjet.dateDebut
						: ObjetDate_1.GDate.formatDate(aProjet.dateDebut, "%JJ/%MM/%AAAA"),
				),
			);
		}
		if (!!aProjet.dateFin) {
			H.push("&nbsp;");
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheEleve.jusquau",
					typeof aProjet.dateFin === "string"
						? aProjet.dateFin
						: ObjetDate_1.GDate.formatDate(aProjet.dateFin, "%JJ/%MM/%AAAA"),
				),
			);
		}
		H.push("</div>");
		if (aProjet.commentaire) {
			H.push('<div class="m-top-l">', aProjet.commentaire, "</div>");
		}
		if (aProjet.documents && aProjet.documents.count()) {
			H.push('<div class="m-top-l Texte10 SansMain">');
			aProjet.documents.parcourir((aDocument) => {
				const lURL = ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: aDocument,
					libelleEcran: aDocument.getLibelle(),
					genreRessource: Enumere_Ressource_1.EGenreRessource.DocJointEleve,
					maxWidth: 480,
				});
				H.push('<div class="m-all InlineBlock">', lURL, "</div>");
			});
			H.push("</div>");
		}
		H.push(`</div>`);
		if (aProjet.estCompatibleAmenagements) {
			H.push('<div class="field-contain label-up border-bottom p-bottom-l">');
			H.push(
				'<div class="ie-titre-petit Gras">',
				aProjet.estAvecActions
					? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.actions")
					: ObjetTraduction_1.GTraductions.getValeur("FicheEleve.amenagements"),
				"</div>",
			);
			const lStrCbMetaMatieres = aProjet.estAvecActions
				? ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.UniquementActionMesDisciplines",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.UniquementAmenagementMesDisciplines",
					);
			H.push(
				IE.jsx.str(
					"div",
					{ "ie-if": this.jsxIfAffichageCbMetaMatiere.bind(this) },
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "m-top-l",
							"ie-model": this.jsxModeleCheckboxMetaMatiere.bind(this),
						},
						lStrCbMetaMatieres,
					),
				),
			);
			H.push(
				'<div class="m-top-l full-height full-width" id="',
				this.getInstance(this.identListe).getNom(),
				'"></div>',
			);
			H.push("</div>");
			if (
				[Enumere_Ressource_1.EGenreRessource.Enseignant].includes(
					this.applicationSco.getEtatUtilisateur().getUtilisateur().getGenre(),
				)
			) {
				H.push(
					IE.jsx.str(
						"div",
						{ style: "display:inline-flex", class: "m-top-l" },
						IE.jsx.str("span", {
							class: "m-top m-right-l",
							"ie-html": this.jsxGetHtmlPublication.bind(
								this,
								!!aProjet.publieFamille,
							),
						}),
						IE.jsx.str("div", {
							"ie-class": this.jsxGetClassPublication.bind(
								this,
								!!aProjet.publieFamille,
							),
						}),
					),
				);
			}
		}
		if (aProjet.consultableEquipePeda) {
			H.push(
				'<div class="m-top-l">',
				ObjetTraduction_1.GTraductions.getValeur("FicheEleve.consultable"),
				"</div>",
			);
		}
		return H.join("");
	}
	jsxGetHtmlPublication(aEstPublie) {
		return aEstPublie
			? ObjetTraduction_1.GTraductions.getValeur(
					"FicheEleve.verrouPublieFamille",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"FicheEleve.nonVerrouPublieFamille",
				);
	}
	jsxGetClassPublication(aEstPublie) {
		return aEstPublie ? "Image_Publie" : "Image_NonPublie";
	}
	jsxIfAffichageCbMetaMatiere() {
		return (
			!this.applicationSco.estPrimaire &&
			!!this.listeAffichee &&
			this.listeAffichee.count() > 0
		);
	}
	jsxModeleCheckboxMetaMatiere() {
		return {
			getValue: () => {
				return this.uniquementMatiereProf;
			},
			setValue: (aValue) => {
				if (aValue !== null && aValue !== undefined) {
					this.uniquementMatiereProf = aValue;
					this._actualiserListe(
						this.formatDonnees(
							aValue === true ? this.listeFiltree : this.listeAffichee,
						),
					);
				}
			},
		};
	}
	initialiserCombo(aObjet) {
		aObjet.setOptionsObjetSaisie({
			longueur: 160,
			libelleHaut: ObjetTraduction_1.GTraductions.getValeur(
				"FicheEleve.choixProjetAcc",
			),
		});
	}
	setDonnees(aParams) {
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FicheEleve.projetAccEleve",
				[aParams.eleve.getLibelle()],
			),
		});
		if (!aParams.projet) {
			new ObjetRequeteDetailsPIEleve_1.ObjetRequeteDetailsPIEleve(
				this,
				this._reponseRequeteAmenagementsEleve,
			).lancerRequete({ eleve: aParams.eleve, matiere: aParams.matiere });
		} else {
			this.projet = aParams.projet;
			this.afficher();
			this.getInstance(this.identCombo).setVisible(false);
			ObjetHtml_1.GHtml.setHtml(
				this.idDetailsProjet,
				this.composeDetailsProjet(this.projet),
				{ controleur: this.controleur },
			);
			if ("details" in this.projet && this.projet.details) {
				this._actualiserListe(this.formatDonnees(this.projet.details));
			}
		}
	}
	_reponseRequeteAmenagementsEleve(aParams) {
		this.afficher();
		this.listeProjetsEleve = aParams.listeProjetsEleve;
		this.listeDetailsProjets = aParams.listeDetailsProjets;
		this.projet = this.listeProjetsEleve.get(0);
		if (aParams.listeProjetsEleve.count() > 1) {
			this.getInstance(this.identCombo).initialiser();
			this.getInstance(this.identCombo).setDonnees(this.listeProjetsEleve);
			this.getInstance(this.identCombo).setSelection(0);
			this.getInstance(this.identCombo).setVisible(true);
			this.getInstance(this.identCombo).setActif(true);
		} else if (aParams.listeProjetsEleve.count() === 1) {
			this.getInstance(this.identCombo).setVisible(false);
			ObjetHtml_1.GHtml.setHtml(
				this.idDetailsProjet,
				this.composeDetailsProjet(this.projet),
				{ controleur: this.controleur },
			);
		}
		if (aParams.listeDetailsProjets) {
			const lDetails = aParams.listeDetailsProjets.getElementParNumero(
				this.projet.getNumero(),
			);
			this.listeAffichee = !!lDetails
				? lDetails.details
				: new ObjetListeElements_1.ObjetListeElements();
			const lListeFiltree = new ObjetListeElements_1.ObjetListeElements();
			if (lDetails && lDetails.details) {
				lDetails.details.parcourir((aDonnee) => {
					if (aDonnee.correspondMatiereProfesseur === true) {
						lListeFiltree.addElement(aDonnee);
					}
				});
			}
			this.listeFiltree = lListeFiltree;
			this._actualiserListe(this.formatDonnees(this.listeAffichee));
		}
	}
	formatDonnees(aListe) {
		aListe.setTri([
			ObjetTri_1.ObjetTri.init("numCategorie"),
			ObjetTri_1.ObjetTri.init("numeroAmenagement"),
		]);
		aListe.trier();
		let lPere;
		aListe.parcourir((aElement) => {
			if (aElement.estPere) {
				lPere = aElement;
				aElement.estUnDeploiement = true;
				aElement.estDeploye = true;
			} else {
				if (aElement.numCategorie === lPere.numCategorie) {
					aElement.pere = lPere;
				}
			}
		});
		return aListe;
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			forcerOmbreScrollTop: true,
			forcerOmbreScrollBottom: true,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 300,
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div id="' + this.getNomInstance(this.identCombo) + '"> </div>');
		T.push('<div class="m-top-l" id="', this.idDetailsProjet, '"></div>');
		return T.join("");
	}
	_actualiserListe(aDonnees) {
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Accompagnement(aDonnees),
		);
		this.getInstance(this.identListe).setOptionsListe({
			messageContenuVide: this.projet.estAvecActions
				? ObjetTraduction_1.GTraductions.getValeur("FicheEleve.aucuneAction")
				: ObjetTraduction_1.GTraductions.getValeur(
						"FicheEleve.aucunAmenagement",
					),
		});
	}
}
exports.ObjetFenetre_DetailsPIEleve = ObjetFenetre_DetailsPIEleve;
class DonneesListe_Accompagnement extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListe) {
		super(aListe);
		this.setOptions({
			avecSelection: false,
			avecBoutonActionLigne: false,
			avecEllipsis: false,
			flatDesignMinimal: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.estPere ? aParams.article.getLibelle() : "";
	}
	getInfosSuppZonePrincipale(aParams) {
		return aParams.article.estPere ? "" : aParams.article.getLibelle();
	}
}
