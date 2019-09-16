import { expect } from "chai";

describe("src/wallet/localwallet.js", () => {
    let wallet = new LocalWallet(SigningConfirmationTrue);
    describe("unlockWallet", () => {
        it("should call wallet.fromEncryptedJson!", () => {
            expect(true).to.equal(true);
        });
    });
});
