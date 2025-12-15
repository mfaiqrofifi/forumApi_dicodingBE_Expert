class EntityValidator {
  static verifyRequiredProperties(payload, requiredKeys, entityName) {
    requiredKeys.forEach((key) => {
      if (payload[key] === undefined) {
        throw new Error(`${entityName}.NOT_CONTAIN_NEEDED_PROPERTY`);
      }
    });
  }

  static verifyDataTypes(payload, typeSpec, entityName) {
    const validators = Object.entries(typeSpec);
    const isValid = validators.every(([key, validator]) =>
      validator(payload[key])
    );

    if (!isValid) {
      throw new Error(`${entityName}.NOT_MEET_DATA_TYPE_SPECIFICATION`);
    }
  }
}

module.exports = EntityValidator;
