export interface buser {
    uname?: string;
    credits?: number;
    regtxid?: string;
    pubkeyid?: string;
    state?: string;
    subtx?: [string];
    data?: string;
}
declare namespace DashPayDAP {
    class DashPayDAP {
        constructor();
        dapId: string;
        buser: buser;
        dapContract: string;

        registerBUser(uname: string, funding: number): buser;

    }
}

