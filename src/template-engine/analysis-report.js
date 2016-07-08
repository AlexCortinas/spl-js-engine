export default class AnalysisReport {
    constructor(featureModel) {
        this.results = new Map();
        this.featureModel = featureModel;
    }

    addAnalysis(filePath, result) {
        this.results.set(filePath, result);
    }

    short() {
        const ret = { feature: {}, data: {} };

        this.results.forEach((value) => {
            for (const featureName in value.feature) {
                if (!ret.feature.hasOwnProperty(featureName)) {
                    ret.feature[featureName] = 0;
                }
                ret.feature[featureName]+=value.feature[featureName];
            }

            for (const dataName in value.data) {
                if (!ret.data.hasOwnProperty(dataName)) {
                    ret.data[dataName] = 0;
                }
                ret.data[dataName]+=value.data[dataName];
            }
        });

        return ret;
    }

    long() {
        const ret = {};

        this.results.forEach((value, key) => {
            ret[key] = value;
        });

        return ret;
    }

    filesByFeature(aFeature) {
        const ret = [];

        this.results.forEach((value, key) => {
            for (const featureName in value.feature) {
                if (featureName == aFeature) {
                    ret.push(key);
                }
            }
        });

        return ret;
    }

    filesByData(aProprety) {
        const ret = [];

        this.results.forEach((value, key) => {
            for (const propertyname in value.data) {
                if (propertyname == aProprety) {
                    ret.push(key);
                }
            }
        });

        return ret;
    }

    checkAnnotatedFeaturesConsistency() {
        const found = Object.keys(this.short().feature);
        const expected = this.featureModel.featureList
            .map(featureName => this.featureModel.get(featureName))
            .filter(feature => !feature.abstract)
            .map(feature => feature.name);

        const res = {
            abound: found.filter(f => expected.indexOf(f) == -1),
            missing: expected.filter(f => found.indexOf(f) == -1)
        };

        // features found in code but not in feature model are errors
        res.errors = res.abound.length;

        // feature in feature model not found are warnings
        res.warnings = res.missing.length;

        return res;
    }

    checkAnnotatedDataConsistency(productData) {
        const found = Object.keys(this.short().data);
        const expected = Object.keys(productData.data);

        const res = {
            abound: found.filter(f => expected.indexOf(f) == -1),
            missing: expected.filter(f => found.indexOf(f) == -1)
        };

        // data parameters found in code but not in product spec are errors
        res.errors = res.abound.length;

        //data parameters in product spec but not in code are warnings
        res.warnings = res.missing.length;

        return res;
    }
}
