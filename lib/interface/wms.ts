export namespace IWms {
    export namespace WMSCapabilities {
        interface ContactInformation {
            ContactPersonPrimary?: {
                ContactPerson?: string;
                ContactOrganization?: string;
            };
            ContactPosition?: string;
            ContactAddress?: {
                AddressType?: string;
                Address?: string;
                City?: string;
                StateOrProvince?: string;
                PostCode?: string;
                Country?: string;
            };
            ContactVoiceTelephone?: string;
            ContactFacsimileTelephone?: string;
            ContactElectronicMailAddress?: string;
        }

        interface Service {
            Name: string;
            Title?: string;
            Abstract?: string;
            KeywordList?: {
                Keyword: string[];
            };
            OnlineResource: string;
            ContactInformation: ContactInformation;
            Fees?: string;
            AccessConstraints?: string[];
        }

        interface Format {
            $value: string;
        }

        interface DCPType {
            HTTP: {
                Get: {
                    OnlineResource: string
                };
                Post?: {
                    OnlineResource: string
                };
            };
        }

        interface Operation {
            Format: Format[];
            DCPType: DCPType[];
        }
        interface Layer {
            Name: string;
            Title: string;
            Abstract: string;
            KeywordList: string[];
            BoundingBox: {
                crs: string | null;
                extent: [number, number, number, number];
                res: [number | null, number | null];
            }[];
            Style: {
                Name: string;
                Title: string;
                Abstract: string;
                LegendURL: {
                    Format: string;
                    OnlineResource: string;
                    size: [number, number];
                }[];
            }[];
            queryable: boolean;
            opaque: boolean;
            noSubsets: boolean;
        }

        export interface GetCapabilitiesResponse {
            Service: Service;
            Capability: {
                Request: {
                    GetCapabilities: Operation;
                    GetMap: Operation;
                    GetFeatureInfo: Operation;
                    DescribeLayer: Operation;
                    GetLegendGraphic: Operation;
                    GetStyles: Operation;
                };
                Exception: string[];
                Layer: {
                    Abstract: string
                    Layer: Layer[]
                    Title: string
                };
            };
            version: string
        }
    }
}
