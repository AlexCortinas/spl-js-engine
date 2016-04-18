import TYPE from './feature-type';

export class Feature {
    constructor(name, { mandatory = false, abstract = false }, parent = null) {
        this.name = name;
        this.mandatory = mandatory;
        this.abstract = abstract;
        this.parent = parent;

        this.features = [];
        this.type = TYPE.FEATURE;

        const featureModel = this.getFeatureModel();
        if (featureModel !== this) {
            if (featureModel.exists(name)){
                throw `feature ${name} already exists`;
            }
            featureModel.featureList.push(name);
        }

        if (mandatory && this.parent &&
            (this.parent.type === TYPE.XOR || this.parent.type === TYPE.OR)) {
            // If the parent is an OR or XOR, this feature cannot be mandatory.
            // At first, this was not taken into account, but FeatureIDE XML
            // structure for feature models sets the optional and alternative
            // features as mandatory.
            // So, to prevent bigger issues, we check instead of just setting
            // the mandatory property.
            this.mandatory = false;
        }
    }

    getFeatureModel() {
        if (!this.parent) {
            return this;
        }
        return this.parent.getFeatureModel();
    }

    /////////////////////
    // Adding Features //
    /////////////////////1
    and(features) {
        this.type = TYPE.AND;
        return this::_add(features);
    }

    or(features) {
        this.type = TYPE.OR;
        return this::_add(features);
    }

    xor(features) {
        this.type = TYPE.XOR;
        return this::_add(features);
    }

    // Alternative is just another name for XOR
    alt(features) {
        this.xor(features);
    }

    get(featureName) {
        if (_compareString(this.name, featureName)) {
            return this;
        }

        return this.features
            .map(f => f.get(featureName))
            .filter(f => f)
            .pop();
    }

    ///////////////////////////
    // String Representation //
    ///////////////////////////
    toString() {
        let str = (this.abstract ? '_' : '') +
            (this.mandatory ? '+' : '') +
            this.name;

        if (this.features.length > 0) {
            str +=
                ': { ' +
                this.features.map(f => f.toString()).join(` ${this.type} `) +
                ' }';
        }

        return str;
    }

    validateFeature() {
        const hasChildren = this.features.length !== 0;

        if (!hasChildren) {
            // Abstract feature cannot be leaf
            if (this.abstract) {
                throw 'abstract feature cannot be leaf';
            }
        } else {
            // Validate all its children features
            this.features.forEach(f => {
                f.validateFeature();
            });
        }

        if (this.type === TYPE.OR || this.type === TYPE.XOR) {
            if (!hasChildren) {
                throw 'OR and XOR features must have children';
            } else {
                this.features.forEach(function(f) {
                    if (f.mandatory) {
                        throw 'features with OR and XOR parent cannot be ' +
                            'mandatory';
                    }
                });
            }
        }
    }
}

function _add(features) {
    if (Array.isArray(features)) {
        // features is an array with many features
        features.forEach(f => this::_add(f));
        return;
    }

    let newNode = null;
    if (typeof features == 'string') {
        // features is the name of a new feature
        newNode = new Feature(features, {}, this);
    } else {
        // features is the JSON of a new feature
        newNode = new Feature(features.name, features, this);
    }

    this.features.push(newNode);
    return newNode;
}

function _compareString(s1, s2) {
    if (typeof s1 != 'string' || typeof s2 != 'string' ||
        s1 == null || s2 == null) {

        throw '_compareString: parameter is undefined, null or non string';
    }
    return s1.toLowerCase() === s2.toLowerCase();
}
