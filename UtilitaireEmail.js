exports.TUtilitaireEmail = void 0;
const cRregExEmail =
	"^([^\\s@\\.]+\\.)*[^\\s@\\.]+@([^\\s@\\.]+\\.)+[^\\s@\\.]+$";
const TUtilitaireEmail = {
	estValide(aEmail) {
		return RegExp(cRregExEmail, "i").test(aEmail.trim());
	},
};
exports.TUtilitaireEmail = TUtilitaireEmail;
