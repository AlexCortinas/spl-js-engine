import EvaluationHelper from './evaluation-helper';

export default class constraintSet {
    constructor() {
        this.counter = 0;
        this.constraints = [];
    }

    addConstraint(constraint) {
        constraint.id = this.counter++;
        this.constraints[constraint.id] = constraint;
        return constraint;
    }

    checkConstraints(namesOfSelectedFeatures) {
        const helper = new EvaluationHelper(namesOfSelectedFeatures);

        const constraintsNotMet =
            this.constraints.filter(c => !c.evaluate(helper)).join(', ');

        if (constraintsNotMet) {
            throw `Constraints ${constraintsNotMet} not met`;
        }

        return helper.added;
    }

    toString() {
        return `[ ${this.constraints.join(', ')} ]`;
    }
}
