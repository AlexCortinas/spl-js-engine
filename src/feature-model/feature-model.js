import { Feature } from './feature';

export class FeatureModel extends Feature {
    constructor(name) {
        super(name, { mandatory: true, abstract: true });
        this.featureList = [ this.name ];
    }

    //////////////////////
    // Adding Features  //
    //////////////////////

    get(featureName) {
        if (!this.exists(featureName)) {
            throw `feature ${featureName} not found`;
        }

        return super.get(featureName);
    }

    exists(featureName) {
        return this.featureList.indexOf(featureName) != -1;
    }

    toString() {
        // provided than feature model is always mandatory and abstract,
        // only +_ is required to be deleted from feature.toString()
        return super.toString().substring(2);
    }

    validateFeatureModel() {
        this.validateFeature();
    }
}
