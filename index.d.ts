export interface buser {
    uname?: string;
    credits?: number;
    regtxid?: string;
    pubkeyid?: string;
    state?: string;
    subtx?: [string];
    data?: string;
}

export interface privateKey {
    toString(): string;
    toAddress(): string;
}
declare namespace DashPayDPA {
    class DashPayDPA {
        constructor();
        buser: buser;
        dpaContract: string;

        getBUser(): buser;
        getBUserPrivateKey(): privateKey;
        getBUserRegistrationId(): string;
        registerBUser(uname: string, funding: number): buser;
        registerProfile(avatar: string, about: string, props: string): string;

    }
}

