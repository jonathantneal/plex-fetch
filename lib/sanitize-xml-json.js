// return a sanitized xml object
export default function sanitizeXMLJSON(object) {
	// move _attributes fields to the object
	if (object._attributes) {
		Object.assign(object, object._attributes);

		delete object._attributes;
	}

	// clean all fields on the object
	if (Object(object) === object) {
		for (let subobject in object) {
			sanitizeXMLJSON(object[subobject]);
		}
	}

	return object;
}
