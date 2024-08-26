export namespace IWps {
    //能力集
    export namespace WPSCapabilities {
        interface stringExtension {
            __text: string
            __prefix: string
            toString: () => string
        }
        export interface WpsCapabilitiesResponse {
            Capabilities: {
                xmlns_xs: stringExtension;
                xmlns_ows: stringExtension;
                xmlns_wps: stringExtension;
                xmlns_xlink: stringExtension;
                xmlns_xsi: stringExtension;
                xml_lang: stringExtension;
                service: stringExtension;
                version: stringExtension;
                xsi_schemaLocation: stringExtension;
                ServiceIdentification: {
                    Title: stringExtension;
                    Abstract: stringExtension;
                    ServiceType: stringExtension;
                    ServiceTypeVersion: stringExtension;
                };
                ServiceProvider: {
                    ProviderName: stringExtension;
                    ProviderSite: stringExtension;
                    ServiceContact: any;
                };
                OperationsMetadata: {
                    Operation: Operation[];
                };
                ProcessOfferings: ProcessOfferings;
                Languages: {
                    Default: Language;
                    Supported: Language[];
                };
            }
        }
        interface Operation {
            name: stringExtension;
            // 这里可以添加Operation的具体属性，如果有的话
        }
        interface ProcessOfferings {
            // 这里可以添加ProcessOfferings的具体属性，如果有的话
        }
        interface Language {
            Language: stringExtension;
        }
    }
    export namespace DescribeProcess {
        interface stringExtension {
            __text: string
            __prefix: string
            toString: () => string
        }
        export interface DescribeProcessResponse {
            ProcessDescriptions: {
                _xmlns_xs: stringExtension;
                _xmlns_ows: stringExtension;
                _xmlns_wps: stringExtension;
                _xmlns_xlink: stringExtension;
                _xmlns_xsi: stringExtension;
                _xml_lang: stringExtension;
                _service: stringExtension;
                _version: stringExtension;
                _xsi_schemaLocation: stringExtension;
                ProcessDescription: {
                    '_wps:processVersion': stringExtension;
                    _statusSupported: stringExtension;
                    _storeSupported: stringExtension;
                    Identifier: stringExtension;
                    Title: stringExtension;
                    Abstract: stringExtension;
                    DataInputs: {
                        Input: {
                            maxOccurs: stringExtension;
                            minOccurs: stringExtension;
                            Identifier: stringExtension;
                            Title: stringExtension;
                            Abstract: stringExtension;
                            ComplexData?: ComplexData;
                            LiteralData?: LiteralData;
                        }[];
                    };
                    ProcessOutputs: ProcessOutputs;
                };
            }
        }
        interface ComplexData {
            maximumMegabytes?: stringExtension;
            Default: Default;
            Supported: Supported[];
        }

        interface Default {
            Format: Format;
        }

        interface Supported {
            Format: Format[];
        }

        interface Format {
            MimeType: stringExtension;
        }

        interface LiteralData {
            DataType: stringExtension;
            AnyValue?: any;
            AllowedValues?: AllowedValues;
        }

        interface AllowedValues {
            Value: stringExtension[];
        }

        interface ProcessOutputs {
            Output: Output[];
        }

        interface Output {
            Identifier: stringExtension;
            Title: stringExtension;
            ComplexOutput: ComplexOutput;
        }

        interface ComplexOutput {
            Default: Default;
            Supported: Supported;
        }

    }
}