import xmldoc from 'xmldoc';
import XMLWriter from 'xml-writer';

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

    ///////////////////////////
    // String Representation //
    ///////////////////////////

    toString() {
        // provided than feature model is always mandatory and abstract,
        // only +_ is required to be deleted from feature.toString()
        return super.toString().substring(2);
    }

    /////////////////
    // Validation  //
    /////////////////

    validateFeatureModel() {
        this.validateFeature();
    }

    /////////////////////////////
    // Parsing and Loading XML //
    /////////////////////////////

    static fromXml(xml) {
        const doc = new xmldoc.XmlDocument(xml);
        const struct = doc.childNamed('struct');
        // const constraints = doc.childNamed('constraints');

        if (struct == null) {
            throw 'Error parsing xml';
        }

        let fm = new FeatureModel(struct.firstChild.attr.name);
        if (Array.isArray(struct.firstChild.children)) {
            // We create the features
            struct.firstChild.children.forEach(function(f) {
                Feature.fromXml(f, fm, struct.firstChild.name);
            });
        }

        // if (constraints != null) {
        //     fm.constraintSet.fromXml(constraints);
        // }

        return fm;
    }

    toXml() {
        const xmlWriter = new XMLWriter();
        let feature;
        let struct;
        let constraints;

        xmlWriter.startDocument('1.0', 'UTF-8');

        feature = xmlWriter.startElement('featureModel');
        struct = feature.startElement('struct');
        super.toXml(struct);
        struct.endElement();

        constraints = feature.startElement('constraints');
        // this.constraintSet.toXml(constraints);
        constraints.endElement();

        feature.endElement();

        return xmlWriter.toString();
    }

    //////////////////////////////
    // Parsing and Loading JSON //
    //////////////////////////////

    static fromJson(json) {
        const fm = new FeatureModel(json.featureModel.struct.name);

        if (Array.isArray(json.featureModel.struct.features)) {
            json.featureModel.struct.features.forEach(function(v) {
                Feature.fromJson(v, fm, json.featureModel.struct.type);
            });
        }

        // if (Array.isArray(json.featureModel.constraints)) {
        //     fm.constraintSet.fromJson(json.featureModel.constraints);
        // }

        return fm;
    }

    toJson() {
        const json = {
            featureModel: {
                struct: super.toJson(),
                constraints: []
            }
        };

        // json.featureModel.constraints = this.constraintSet.toJson();

        return json;
    }
}
