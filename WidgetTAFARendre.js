exports.WidgetTAFARendre = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetTAFARendre extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = GEtatUtilisateur;
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lAuMoinsUnTafExiste =
			!!this.donnees.listeTAF && this.donnees.listeTAF.count() > 0;
		this.selecteurDate = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{ pere: this, evenement: this._surSelectionDateTafARendre.bind(this) },
		);
		this.donnees.listeClasseSelectionnees =
			this.etatUtilisateurSco.getListeClasses({
				avecClasse: true,
				uniquementClasseEnseignee: true,
			});
		const lGenresRessourcesActifs =
			new TypeEnsembleNombre_1.TypeEnsembleNombre();
		if (lAuMoinsUnTafExiste) {
			let lExisteTravailRendu = false;
			let lExisteQCM = false;
			this.donnees.listeTAF.parcourir((aTaf) => {
				if (
					aTaf.getGenre() === Enumere_Ressource_1.EGenreRessource.TravailAFaire
				) {
					lExisteTravailRendu = true;
				} else if (
					aTaf.getGenre() === Enumere_Ressource_1.EGenreRessource.ExecutionQCM
				) {
					lExisteQCM = true;
				}
				if (lExisteTravailRendu && lExisteQCM) {
					return false;
				}
			});
			if (lExisteTravailRendu) {
				lGenresRessourcesActifs.add(
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
						.travailRendu,
				);
			}
			if (lExisteQCM) {
				lGenresRessourcesActifs.add(
					Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM,
				);
			}
		} else {
			lGenresRessourcesActifs.add([
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.travailRendu,
				Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM,
			]);
		}
		this.donnees.avecGenresRessourcePedagogiqueSelectionnes =
			lGenresRessourcesActifs;
		const lWidget = {
			html: this.composeWidget(),
			afficherMessage: !lAuMoinsUnTafExiste,
			listeElementsGraphiques: [{ id: this.selecteurDate.getNom() }],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
		this.initialiserSelecteurDate();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			surTAFARendre(aIndice) {
				$(this.node).eventValidation(() => {
					aInstance._surTAFARendre(aIndice);
				});
			},
		});
	}
	composeWidget() {
		const H = [];
		H.push('<ul class="liste-clickable">');
		if (this.donnees.listeTAF) {
			for (let i = 0; i < this.donnees.listeTAF.count(); i++) {
				const lTAF = this.donnees.listeTAF.get(i);
				H.push(
					"<li>",
					'<div role="button" aria-haspopup="dialog" tabindex="0" class="like-wrapper-link" ie-node="surTAFARendre(',
					i,
					')">',
					'<div class="wrap">',
					"<h3>",
					lTAF.classe,
					"</h3>",
					'<article class="info">',
					lTAF.descriptif,
					"</article>",
					"</div>",
					'<div class="as-info fixed">',
					lTAF.strNombreRendus,
					"</div>",
					"</div>",
				);
				H.push("</li>");
			}
		}
		H.push("</ul>");
		return H.join("");
	}
	_surTAFARendre(i) {
		const lTravailARendre = this.donnees.listeTAF.get(i);
		if (!!lTravailARendre) {
			let lTAF = null;
			let lExecQCM = null;
			if (
				lTravailARendre.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.TravailAFaire
			) {
				lTAF = lTravailARendre;
			} else if (
				lTravailARendre.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.ExecutionQCM
			) {
				lExecQCM = lTravailARendre;
			}
			const lAvecRechargementDonneesSurFermeture =
				lTravailARendre.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.TravailAFaire;
			ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
				{
					pere: this,
					evenement: function () {
						if (lAvecRechargementDonneesSurFermeture) {
							this.callback.appel(
								this.donnees.genre,
								Enumere_EvenementWidget_1.EGenreEvenementWidget
									.ActualiserWidget,
							);
						}
					},
				},
				lTAF,
				lExecQCM,
			);
		}
	}
	initialiserSelecteurDate() {
		this.selecteurDate.setOptionsObjetCelluleDate({
			formatDate: "[%JJJ %JJ %MMM]",
			avecBoutonsPrecedentSuivant: true,
			classeCSSTexte: "Maigre",
			largeurComposant: 90,
		});
		this.selecteurDate.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
		);
		this.selecteurDate.initialiser();
		this.selecteurDate.setDonnees(this.donneesRequete.TAFARendre.date);
	}
	_surSelectionDateTafARendre(aDate) {
		this.donneesRequete.TAFARendre.date = aDate;
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
}
exports.WidgetTAFARendre = WidgetTAFARendre;
