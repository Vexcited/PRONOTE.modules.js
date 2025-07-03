exports.ObjetFenetre_SelectionDocsMediatheque = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const InterfaceMediatheque_1 = require("InterfaceMediatheque");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequeteMediathequeBlog_1 = require("ObjetRequeteMediathequeBlog");
class ObjetFenetre_SelectionDocsMediatheque extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identInterfaceMediatheque = this.add(
			InterfaceMediatheque_1.InterfaceMediatheque,
			null,
			this.initialiserPageMediatheque,
		);
	}
	setDonnees(aParametres) {
		this.blogConcerne = aParametres.blogConcerne;
		this.afficher();
		this._actualiser();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lListeDocumentsSelectionnes = this.getInstance(
				this.identInterfaceMediatheque,
			).getDocumentsSelectionnes();
			if (
				lListeDocumentsSelectionnes &&
				lListeDocumentsSelectionnes.count() > 0
			) {
				this.callback.appel(aNumeroBouton, lListeDocumentsSelectionnes);
			}
		}
		this.fermer();
	}
	composeContenu() {
		const T = [];
		T.push(
			"<div",
			!IE.estMobile ? " ie-scrollv" : "",
			' style="max-height:600px; height:100%;">',
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str("div", {
						style: "height:100%;",
						id: this.getNomInstance(this.identInterfaceMediatheque),
					}),
				),
			),
		);
		T.push("</div>");
		return T.join("");
	}
	initialiserPageMediatheque(aInstance) {
		aInstance.setOptions({
			msgMediathequeVide: ObjetTraduction_1.GTraductions.getValeur(
				"blog.msgMediathequeVide",
			),
			avecDragDrop: false,
			avecVignettesPetitFormat: true,
		});
	}
	_actualiser() {
		new ObjetRequeteMediathequeBlog_1.ObjetRequeteMediathequeBlog(this)
			.lancerRequete({ blogConcerne: this.blogConcerne })
			.then((aDonnees) => {
				this.actionSurRecupererDonnees(aDonnees);
			});
	}
	actionSurRecupererDonnees(aDonnees) {
		const lListeDocuments = new ObjetListeElements_1.ObjetListeElements();
		const lListeMediatheques = aDonnees.listeMediatheques;
		if (lListeMediatheques && lListeMediatheques.count() > 0) {
			const lMediathequeConcernee = lListeMediatheques.get(0);
			if (lMediathequeConcernee && lMediathequeConcernee.listeDocuments) {
				lListeDocuments.add(lMediathequeConcernee.listeDocuments);
			}
		}
		this.getInstance(this.identInterfaceMediatheque).setDonnees({
			listeDocuments: lListeDocuments,
		});
	}
}
exports.ObjetFenetre_SelectionDocsMediatheque =
	ObjetFenetre_SelectionDocsMediatheque;
