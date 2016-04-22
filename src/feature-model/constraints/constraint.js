export default class Constraint {
    constructor() {}

    static create(featureName) {
        this.id = null;
        return new FeatureConstraint(featureName);
    }

    negated() {
        return new NegatedConstraint(this);
    }

    and(anotherConstraint) {
        return new AndConstraint(this, anotherConstraint);
    }

    or(anotherConstraint) {
        return new OrConstraint(this, anotherConstraint);
    }

    implies(anotherConstraint) {
        return new ImplicationConstraint(this, anotherConstraint);
    }

    iff(anotherConstraint) {
        return new IffConstraint(this, anotherConstraint);
    }
}

class FeatureConstraint extends Constraint {
    constructor(featureName) {
        super();
        this.feature = featureName;
    }

    evaluate(helper) {
        return helper.isAdded(this.feature);
    }

    toString() {
        return this.feature;
    }
}

class NegatedConstraint extends Constraint {
    constructor(constraint) {
        super();
        this.constraint = constraint;
    }

    evaluate(helper) {
        return !this.constraint.evaluate(helper);
    }

    toString() {
        return '!' + this.constraint;
    }
}

class AndConstraint extends Constraint {
    constructor(first, second) {
        super();
        this.first = first;
        this.second = second;
    }

    evaluate(helper) {
        return this.first.evaluate(helper) && this.second.evaluate(helper);
    }

    toString() {
        return `(${this.first} AND ${this.second})`;
    }
}

class OrConstraint extends Constraint {
    constructor(first, second) {
        super();
        this.first = first;
        this.second = second;
    }

    evaluate(helper) {
        return this.first.evaluate(helper) || this.second.evaluate(helper);
    }

    toString() {
        return `(${this.first} OR ${this.second})`;
    }
}

class ImplicationConstraint extends Constraint {
    constructor(first, second) {
        super();
        this.first = first;
        this.second = second;
    }

    evaluate(helper) {
        const equivalentConstraint =
            new OrConstraint(new NegatedConstraint(this.first), this.second);

        return equivalentConstraint.evaluate(helper);
    }

    toString() {
        return `(${this.first} => ${this.second})`;
    }
}

class IffConstraint extends Constraint {
    constructor(first, second) {
        super();
        this.first = first;
        this.second = second;
    }

    evaluate(helper) {
        const equivalentConstraint =
            new NegatedConstraint(new XorConstraint(this.first, this.second));

        return equivalentConstraint.evaluate(helper);
    }

    toString() {
        return `(${this.first} <=> ${this.second})`;
    }
}

class XorConstraint extends Constraint {
    constructor(first, second) {
        super();
        this.first = first;
        this.second = second;
    }

    evaluate(helper) {
        return this.first.evaluate(helper) ?
            !this.second.evaluate(helper) : this.second.evaluate(helper);
    }

    toString() {
        return `(${this.first} v ${this.second})`;
    }
}
