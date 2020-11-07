import * as shell from 'shelljs'
import * as path from 'path';
import axios, { AxiosInstance } from 'axios';

export class EpicApi {
    //Based on https://github.com/derrod/legendary/blob/master/legendary/api/egs.py
    userAgent = "UELauncher/10.18.6-14188424+++Portal+Release-Live Windows/10.0.18363.1.256.64bit"

    user_basic = '34a02cf8f4414e29b15921876da36f9a'
    pw_basic = 'daafbccc737745039dffe53d94fc76cf'

    oauth_host = 'account-public-service-prod03.ol.epicgames.com'
    launcher_host = 'launcher-public-service-prod06.ol.epicgames.com'
    entitlements_host = 'entitlement-public-service-prod08.ol.epicgames.com'
    catalog_host = 'catalog-public-service-prod06.ol.epicgames.com'
    ecommerce_host = 'ecommerceintegration-public-service-ecomprod02.ol.epicgames.com'
    datastorage_host = 'datastorage-public-service-liveegs.live.use1a.on.epicgames.com'

    instance: AxiosInstance;
    unAuth_instance: AxiosInstance;

    accessToken: string;

    constructor(private lc: string = "en", private cc: string = "US") {
        this.instance = axios.create({
            timeout: 1000,
            headers: { 'User-Agent': this.userAgent }
        });

        this.unAuth_instance = axios.create({
            timeout: 1000,
            headers: { 'User-Agent': this.userAgent }
        });
    }

    authSid(sid?: string) {
        if (!shell.which("python")) {
            throw new Error("Make sure python is installed, and added in path");
        }
        let scriptPath = path.join(__dirname, "py", "sid.py");
        let res = shell.exec(`python ${scriptPath} ${sid}`, { silent: true })
        let out = JSON.parse(res.stdout.substr(0, res.stdout.length - 2));

        out["response"] = JSON.parse(out["response"])
        return out;
    }

    async startSession(refresh_token?: string, exchange_token?: string) {
        let params = {};
        if (refresh_token) {
            params = {
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "token_type": "eg1"
            }
        } else if (exchange_token) {
            params = {
                "grant_type": "exchange_code",
                "exchange_code": exchange_token,
                "token_type": "eg1"
            }
        } else {
            throw new Error("At least one token type is required");
        }

        try {
            let res = await this.instance.post(`https://${this.oauth_host}/account/api/oauth/token`, JSON.stringify(params), {
                auth: {
                    username: this.user_basic, password: this.pw_basic
                }
            })

            let json = await res.data;

            console.log(json)

        } catch (error) {
            console.error(error)
        }
    }

}