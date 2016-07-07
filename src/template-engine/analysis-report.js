export default class AnalysisReport {
    constructor() {
        this.results = new Map();
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
}
