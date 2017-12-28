import sanitizeXMLJSON from './sanitize-xml-json';
import { xml2js } from 'xml-js';

// return xml as a sanitized object
export default function (xml) {
	return sanitizeXMLJSON(
		xml2js(xml, {
			compact: true,
			trim: true,
			nativeType: true,
			ignoreDeclaration: true,
			ignoreInstruction: true,
			ignoreComment: true
		})
	);
}
