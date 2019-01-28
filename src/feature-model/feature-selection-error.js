export default class FeatureSelectionError {
  constructor(message, featureSelection, previousException) {
    this.message = message;
    this.featureSelection = featureSelection;
    this.featureName = previousException.featureName;
    this.featureType = previousException.featureType;
    this.errorType = previousException.errorType;
  }

  toString() {
    return this.message;
  }
}
