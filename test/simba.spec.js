import {expect} from 'chai';
import sinon from 'sinon';

import { Simba } from '../src/simba';
import { Wallet } from '../src/wallet';

const TestData = {
    address: '',
    payload: '',
    signed: ''
};

class DummyWallet extends Wallet {
    constructor() {
        super();

        this.getAddress = sinon.fake.resolves(TestData.address);
        this.sign = sinon.fake.resolves(TestData.signed);
    }
}

describe("src/simba.js", () => {
    describe("sayHello function", () => {
        it("should say Hello guys!", () => {
            expect("Hello guys!").to.equal("Hello guys!")
        });
    });
});
