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
declare namespace DashPayDAP {
    class DashPayDAP {
        constructor();
        buser: buser;
        dapContract: string;

        getBUser(): buser;
        getBUserPrivateKey(): privateKey;
        getBUserRegistrationId(): string;
        registerBUser(uname: string, funding: number): buser;
        registerProfile(avatar: string, bio: string, displayName: string, props: string): string;

    }
}

