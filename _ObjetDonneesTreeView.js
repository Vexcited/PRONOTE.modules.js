exports.ObjetTreeNode =
	exports._ObjetDonneesTreeView =
	exports.TradTreeview =
		void 0;
const MethodesTableau_1 = require("MethodesTableau");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTraduction_2 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
const TradTreeview = ObjetTraduction_2.TraductionsModule.getModule("Treeview", {
	interdit: "",
	supprimer: "",
	InclureDans: "",
	InclureDansRacine: "",
	Deplacer: "",
});
exports.TradTreeview = TradTreeview;
class _ObjetDonneesTreeView {
	constructor(aDonnees) {
		this.donnees = aDonnees;
		this.options = {};
		this.setOptionsTreeView({
			avecCreation: false,
			avecEdition: false,
			avecSuppression: false,
			avecEtatSaisie: true,
		});
	}
	setOptionsTreeView(aOptions) {
		Object.assign(this.options, aOptions);
		return this;
	}
	vider() {
		this._compteurIdent = 0;
		this.listeNodes = [];
	}
	construireNodes() {
		this.vider();
	}
	avecEtatSaisie() {
		return this.options.avecEtatSaisie;
	}
	getLibelle(aNode) {
		return this.getLibelleNode(aNode);
	}
	getLibelleNode(aNode) {
		return aNode.contenu && aNode.contenu.getLibelle
			? aNode.contenu.getLibelle()
			: "";
	}
	estlibelleHtmlNode(aNode) {
		return false;
	}
	getStyleLibelle(aNode, aSelectionne) {
		const lHauteurLigneMin = this.getHauteurLigneMin(aNode) - 2;
		return (
			ObjetStyle_1.GStyle.composeHeight(lHauteurLigneMin) +
			"line-height:" +
			lHauteurLigneMin +
			"px;" +
			ObjetStyle_1.GStyle.composeCouleur(
				aSelectionne
					? (0, AccessApp_1.getApp)().getCouleur().selection.getFond()
					: (0, AccessApp_1.getApp)().getCouleur().blanc,
				aSelectionne
					? (0, AccessApp_1.getApp)().getCouleur().selection.getTexte()
					: (0, AccessApp_1.getApp)().getCouleur().noir,
			)
		);
	}
	getClassLibelle(aNode) {
		return "Insecable";
	}
	getIndent(aNode) {
		return 20;
	}
	getVisible(aNode) {
		return true;
	}
	getAvecDeploiement(aNode) {
		return aNode.existeFils();
	}
	getHauteurLigneMin(aNode) {
		return 16;
	}
	getClassIcon(aNode) {
		return null;
	}
	avecMultiSelection() {
		return false;
	}
	getSelection(aNode) {
		return aNode;
	}
	getSelectionFocus(aNode) {
		return aNode && aNode.visible() ? aNode : null;
	}
	selectionFocusSuivant(aNode, aSensCroissant) {
		let lNode = aNode;
		if (!lNode) {
			lNode = aSensCroissant
				? this.getPemierNode()
				: this.listeNodes[this.listeNodes.length - 1];
		} else {
			lNode = aSensCroissant ? lNode.suivant() : lNode.precedent();
		}
		let lCompteur = 0;
		while (
			lCompteur <= this.listeNodes.length &&
			!this.getSelectionFocus(lNode)
		) {
			if (lNode) {
				lNode = aSensCroissant ? lNode.suivant() : lNode.precedent();
			} else {
				lNode = aSensCroissant
					? this.getPemierNode()
					: this.listeNodes[this.listeNodes.length - 1];
			}
			lCompteur++;
		}
		return this.getSelectionFocus(lNode);
	}
	avecSuppression(aNode) {
		return this.options.avecSuppression && !!aNode;
	}
	avecEvenementDeGenre(aGenreEvenement, aNode) {
		return false;
	}
	avecBoutonsEvenementDuGenre(aGenreEvenement) {
		return false;
	}
	getHintBoutonsEvenementDuGenre(aGenreEvenement, aDeplacementHaut) {
		return "";
	}
	avecCreation(aNodePere, aElement) {
		return this.options.avecCreation;
	}
	surCreation(aNodePere, aElement) {
		return false;
	}
	avecEdition(aNode) {
		return this.options.avecEdition && !!aNode;
	}
	avecEditionApresCreation(aNode) {
		return false;
	}
	surEdition(aNode, aValue) {
		return aValue;
	}
	surEditionFin(aNode, aValue) {
		return true;
	}
	surSuppression(aNode) {
		return null;
	}
	surSuppressionConfirmation(aNode) {
		return true;
	}
	getMessageSuppressionConfirmation(aNode) {
		return ObjetTraduction_1.GTraductions.getValeur(
			"liste.suppressionSelection",
		);
	}
	avecDragNDrop() {
		return false;
	}
	dragAutorise(aNode) {
		return false;
	}
	dropAutorise(aNodeSource, aNodeCible, aInsertionAvant) {
		if (aInsertionAvant === null || aInsertionAvant === undefined) {
			return this.dropNodeAutorise(aNodeSource, aNodeCible);
		} else if (aInsertionAvant) {
			const lNodeAvant = aNodeCible ? aNodeCible.frerePrecedent() : null;
			return this.dropInterNodeAutorise(aNodeSource, lNodeAvant, aNodeCible);
		} else {
			const lNodeApres = aNodeCible ? aNodeCible.frereSuivant() : null;
			return this.dropInterNodeAutorise(aNodeSource, aNodeCible, lNodeApres);
		}
	}
	dropNodeAutorise(aNodeSource, aNodeCible) {
		return false;
	}
	dropInterNodeAutorise(aNodeSource, aNodeCibleAvant, aNodeCibleApres) {
		return false;
	}
	surDeplacement(aNodeSource, aNodeCible, aInsertionAvant) {
		return null;
	}
	getContenuDraggableInterdit(aNoedSource) {
		return (
			'<table><tr><td class="Image_Arbre_Drag_Interdit"></td><td class="PetitEspaceGauche">' +
			TradTreeview.interdit +
			"</td></tr></table>"
		);
	}
	getContenuDraggableSuppression(aNoedSource) {
		return TradTreeview.supprimer;
	}
	getContenuDraggableInclusion(aNodeSource, aNodeDestination) {
		const H = [];
		H.push('<table><tr><td class="Image_Arbre_Drag_Inclusion"></td>');
		H.push('<td class="PetitEspaceGauche">');
		if (aNodeDestination) {
			H.push(TradTreeview.InclureDans);
		} else {
			H.push(TradTreeview.InclureDansRacine);
		}
		H.push("</td></tr></table>");
		return H.join("");
	}
	getContenuDraggableDeplacement(aNoedSource) {
		return (
			'<table><tr><td class="Image_Arbre_Drag_Deplacement"></td><td class="PetitEspaceGauche">' +
			TradTreeview.Deplacer +
			"</td></tr></table>"
		);
	}
	avecMenuContextuel(aNode) {
		return false;
	}
	avecMenuContextuelSurBouton(aNode, aGenreEvenementDeBouton) {
		return false;
	}
	initialisationMenuContextuel(aInstance, aNode) {}
	initialisationMenuContextuelSurBouton(
		aInstance,
		aNode,
		aGenreEvenementTreeView,
	) {}
	evenementMenuContextuel(aNode, aLigne) {
		return null;
	}
	avecHintDeLibelle(aNode) {
		return false;
	}
	getHintDeLibelle(aNode) {
		return null;
	}
	creerNode(aNodePere, aContenu, aDeploye) {
		this._compteurIdent++;
		return new ObjetTreeNode(
			this,
			this._compteurIdent,
			aNodePere,
			aContenu,
			aDeploye,
		);
	}
	ajouterNode(aNode) {
		this.listeNodes.push(aNode);
	}
	supprimerNode(aNode) {
		if (!aNode) {
			return;
		}
		const lIndex = this.listeNodes.indexOf(aNode);
		if (lIndex >= 0) {
			const lFils = aNode.listeFils();
			for (let i = 0; i < lFils.length; i++) {
				this.supprimerNode(lFils[i]);
			}
			MethodesTableau_1.MethodesTableau.supprimerElement(
				this.listeNodes,
				lIndex,
			);
		}
	}
	listeRacines() {
		const lListe = [];
		for (let i = 0, lnb = this.listeNodes.length; i < lnb; i++) {
			if (!this.listeNodes[i].pere) {
				lListe.push(this.listeNodes[i]);
			}
		}
		return lListe;
	}
	getPemierNode() {
		return this.listeNodes[0];
	}
	_getIndexNodeParIdent(aIdent) {
		for (let i = 0, lnb = this.listeNodes.length; i < lnb; i++) {
			if (this.listeNodes[i]._ident === aIdent) {
				return i;
			}
		}
		return -1;
	}
	_getIndexNodeParNode(aNode) {
		if (aNode) {
			return this._getIndexNodeParIdent(aNode._ident);
		}
		return -1;
	}
	_getNodeParIdent(aIdent) {
		const lIndex = this._getIndexNodeParIdent(aIdent);
		return lIndex >= 0 ? this.listeNodes[lIndex] : null;
	}
	getNodeParContenu(aContenu) {
		for (let i = 0, lnb = this.listeNodes.length; i < lnb; i++) {
			if (this.contenusIdentiques(aContenu, this.listeNodes[i].contenu)) {
				return this.listeNodes[i];
			}
		}
		return null;
	}
	contenusIdentiques(aContenu1, aContenu2) {
		return (
			aContenu1.getNumero() === aContenu2.getNumero() &&
			aContenu1.getGenre() === aContenu2.getGenre()
		);
	}
	dernierDescendantVisible(aNode) {
		if (!aNode) {
			return null;
		}
		let lNodeResult = aNode;
		const lIndex = this._getIndexNodeParIdent(aNode._ident);
		for (let i = lIndex + 1; i < this.listeNodes.length; i++) {
			const lNode = this.listeNodes[i];
			const lEstVisible = lNode && lNode.visible();
			if (lNode && lNode.estFrere(aNode)) {
				return lNodeResult;
			} else if (!aNode.estAncetreDuNoeud(lNode)) {
				return lNodeResult;
			} else if (lEstVisible) {
				lNodeResult = lNode;
			}
		}
		return lNodeResult;
	}
	getDifferenceIndexDernierDescendantVisible(aNode) {
		const lIndex = this._getIndexNodeParIdent(aNode._ident);
		return (
			this._getIndexNodeParNode(this.dernierDescendantVisible(aNode)) - lIndex
		);
	}
	static getObjetInfosMenuContextuel(
		aEvenementTreeView,
		aAvecActualisation,
		aAvecEtatSaisie,
		aNodePere,
		aContenu,
	) {
		return {
			evenementTreeView: aEvenementTreeView,
			avecActualisation: aAvecActualisation,
			avecEtatSaisie: aAvecEtatSaisie,
			nodePere: aNodePere,
			contenu: aContenu,
		};
	}
}
exports._ObjetDonneesTreeView = _ObjetDonneesTreeView;
class ObjetTreeNode {
	constructor(aDonneesTreeView, aIdent, aPere, aContenu, aDeploye) {
		this.donneesTreeView = aDonneesTreeView;
		this._ident = aIdent;
		this.pere = aPere;
		this.contenu = aContenu;
		this.deploye = aDeploye === null ? true : !!aDeploye;
	}
	suivant() {
		const lIndexCourant = this.donneesTreeView._getIndexNodeParIdent(
			this._ident,
		);
		return this.donneesTreeView.listeNodes[lIndexCourant + 1];
	}
	precedent() {
		const lIndexCourant = this.donneesTreeView._getIndexNodeParIdent(
			this._ident,
		);
		return this.donneesTreeView.listeNodes[lIndexCourant - 1];
	}
	frereSuivant() {
		const lFreres = this.pere ? this.pere.listeFils() : this.listeRacines();
		let lNode = null;
		for (let i = 0, lnb = lFreres.length; i < lnb; i++) {
			lNode = lFreres[i];
			if (this.identique(lNode)) {
				return lFreres[i + 1];
			}
		}
		return null;
	}
	frerePrecedent() {
		const lFreres = this.pere ? this.pere.listeFils() : this.listeRacines();
		let lNode = null;
		for (let i = 0, lnb = lFreres.length; i < lnb; i++) {
			lNode = lFreres[i];
			if (this.identique(lNode)) {
				return lFreres[i - 1];
			}
		}
		return null;
	}
	listeRacines() {
		return this.donneesTreeView.listeRacines();
	}
	listeFils() {
		const lListe = [];
		for (
			let i = 0, lnb = this.donneesTreeView.listeNodes.length;
			i < lnb;
			i++
		) {
			if (
				this.donneesTreeView.listeNodes[i].pere &&
				this.donneesTreeView.listeNodes[i].pere._ident === this._ident
			) {
				lListe.push(this.donneesTreeView.listeNodes[i]);
			}
		}
		return lListe;
	}
	existeFils() {
		for (
			let i = 0, lnb = this.donneesTreeView.listeNodes.length;
			i < lnb;
			i++
		) {
			if (
				this.donneesTreeView.listeNodes[i].pere &&
				this.donneesTreeView.listeNodes[i].pere._ident === this._ident
			) {
				return true;
			}
		}
		return false;
	}
	getNiveau() {
		let lNiveau = 0;
		let lNode = this;
		while (lNode.pere) {
			lNiveau++;
			lNode = lNode.pere;
		}
		return lNiveau;
	}
	visible() {
		let lVisible = true;
		let lNode = this;
		while (lVisible && lNode.pere) {
			lNode = lNode.pere;
			lVisible = lNode.deploye;
		}
		return lVisible;
	}
	identique(aNode) {
		return aNode && aNode._ident === this._ident;
	}
	estFrere(aNode) {
		if (!aNode) {
			return false;
		}
		if (!this.pere && !aNode.pere) {
			return true;
		}
		return this.pere && this.pere.identique(aNode.pere);
	}
	estAncetreDuNoeud(aNode) {
		if (!aNode) {
			return false;
		}
		let lNode = aNode.pere;
		while (lNode) {
			if (this.identique(lNode)) {
				return true;
			}
			lNode = lNode.pere;
		}
		return false;
	}
}
exports.ObjetTreeNode = ObjetTreeNode;
