export class Naive {
    private lastValue: number = 0;

    constructor() {

    }

    private filter(input) {
        if (input > -0.25) {
            input = 1;
        } else {
            input = 0;
        }

        var result;
        if (this.lastValue == 0 && input == 1) {
            result = true;
        } else {
            result = false;
        }
        this.lastValue = input;
        return result;
    }
}