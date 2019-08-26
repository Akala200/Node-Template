const errorDictionary = {
    po001: "Betting Slip cannot be paid out without the PIN",
    po002: "Invalid PIN. The incident has been reported",
    po003: "Betting slip cannot be paid out"
};

export class ErrorHandler {
    static async errorStatusCodeGenerator() {}

    static async Payout(errors) {
        if (!errors) {
            return { po001: errorDictionary.po001 };
        }

        if (errors !== []) {
            let returnValue;
            errors.forEach(obj => {
                if (
                    obj.error === "Invalid PIN. The incident has been reported"
                ) {
                    returnValue = { po002: errorDictionary.po002 };
                }

                if (obj.error === "Betting slip cannot be paid out") {
                    returnValue = { po003: errorDictionary.po003 };
                }
            });

            return returnValue;
        }
    }

    static async PlaceBet(errordata) {}

    async defineActivity(type, data) {
        if (type === "placebets") return "";
        if (type === "payouts") return await ErrorHandler.Payout(data);

        // OTHERS
        if (type === "schedule") return "";
        if (type === "results") return "";
        if (type === "checkticket") return "";
        if (type === "cancel") return "";
    }
}
