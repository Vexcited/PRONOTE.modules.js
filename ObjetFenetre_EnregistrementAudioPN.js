exports.ObjetFenetre_EnregistrementAudioPN = void 0;
const ObjetFenetre_EnregistrementAudio_1 = require("ObjetFenetre_EnregistrementAudio");
class ObjetFenetre_EnregistrementAudioPN extends ObjetFenetre_EnregistrementAudio_1.ObjetFenetre_EnregistrementAudio {
	getDureeMaxEnregistrementAudio() {
		let lTailleMax = 30;
		const lParametresPN = GParametres;
		if (
			lParametresPN &&
			lParametresPN.general &&
			lParametresPN.general.tailleMaxEnregistrementAudioRenduTAF
		) {
			lTailleMax =
				lParametresPN.general.tailleMaxEnregistrementAudioRenduTAF * 60;
		}
		return lTailleMax;
	}
}
exports.ObjetFenetre_EnregistrementAudioPN = ObjetFenetre_EnregistrementAudioPN;
