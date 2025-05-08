exports.UtilitaireRecupMDP = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
exports.UtilitaireRecupMDP = {
	getTraductions: function (aEstCreation, aAvecResetParParent) {
		return {
			texteHeader: aEstCreation
				? ObjetTraduction_1.GTraductions.getValeur(
						"fenetreRecupIdMDP.headerCreation",
					)
				: ObjetTraduction_1.GTraductions.getValeur("fenetreRecupIdMDP.header"),
			texteStage1: aEstCreation
				? ObjetTraduction_1.GTraductions.getValeur(
						"fenetreRecupIdMDP.stage1Creation",
					)
				: ObjetTraduction_1.GTraductions.getValeur("fenetreRecupIdMDP.stage1"),
			texteStage1_bis: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage1_bis",
			),
			texteStage2: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2",
			),
			texteStage3: aEstCreation
				? ObjetTraduction_1.GTraductions.getValeur(
						"fenetreRecupIdMDP.stage3Creation",
					)
				: ObjetTraduction_1.GTraductions.getValeur("fenetreRecupIdMDP.stage3"),
			texteStage: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage",
			),
			texteStage2_ok: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ok",
			),
			texteStage2_ko_titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_titre",
			),
			texteStage2_ko_multi: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_multi",
			),
			texteStage2_ko_multi2: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_multi2",
			),
			texteStage2_ko_zero: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_zero",
			),
			texteStage2_ko_zero2: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_zero2",
			),
			texteStage2_ko_parent: aAvecResetParParent
				? ObjetTraduction_1.GTraductions.getValeur(
						"fenetreRecupIdMDP.stage2_ko_parent",
					)
				: "",
			texteStage2_ko_creation: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_creation",
			),
			texteStage2_ko_creation2: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_creation2",
			),
			texteStage2_ko_creation3: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage2_ko_creation3",
			),
			texteStage3_ok: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage3_ok",
			),
			texteStage3_ok_creation: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage3_ok_creation",
			),
			texteStage3_ok_creationbis: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage3_ok_creationbis",
			),
			texteStage3_ko: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.stage3_ko",
			),
			texteMailOk: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.mailOk",
			),
			texteMdp: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.motdepasse",
			),
			texteConfirmation: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.confirmation",
			),
			texteTerminer: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.terminer",
			),
			texteNom: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.nom",
			),
			textePrenom: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.prenom",
			),
			texteEMail: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.email",
			),
			texteEMailValide: ObjetTraduction_1.GTraductions.getValeur(
				"fenetreRecupIdMDP.emailValide",
			),
		};
	},
	estCodeValide: function (aCode) {
		let lIsOkCode = false;
		if (
			aCode &&
			RegExp(
				"[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}",
			).test(aCode)
		) {
			const lTabAlpha =
				"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			let lTotal = 0;
			for (const lChar of aCode) {
				if (lChar !== "-" && !MethodesObjet_1.MethodesObjet.isFunction(lChar)) {
					lTotal += lTabAlpha.indexOf(lChar) + 1;
				}
			}
			if (lTotal % 62 === 0) {
				lIsOkCode = true;
			}
		}
		return lIsOkCode;
	},
};
