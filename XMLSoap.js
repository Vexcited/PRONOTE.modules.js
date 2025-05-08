exports.ObjetXML_Soap = ObjetXML_Soap;
require("XmlHttp");
function ObjetXML_Soap(AUri, ANom, S) {
	let lXml;
	try {
		lXml = document.implementation.createDocument(AUri, ANom ? ANom : "", null);
	} catch (e) {
		alert(e);
		throw new Error(
			"Votre navigateur ne supporte pas l'objet 'document.implementation.createDocument'",
		);
	}
	if (S) {
		lXml.loadXML(S);
	}
	return lXml;
}
