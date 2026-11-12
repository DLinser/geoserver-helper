export namespace IWps {
    /**
     * x2js 解析结果。XML 属性名以 `_` 开头，命名空间冒号保留，值是字符串。
     * 带前缀的元素文本是 `{ __text, __prefix }`。多个同名子节点才是数组，只有一个时是对象。
     */
    export namespace WPSCapabilities {
        interface stringExtension {
            __text: string
            __prefix: string
            toString: () => string
        }
        export interface WpsCapabilitiesResponse {
            Capabilities: {
                "_xmlns:xs": string;
                "_xmlns:ows": string;
                "_xmlns:wps": string;
                "_xmlns:xlink": string;
                "_xmlns:xsi": string;
                "_xml:lang": string;
                _service: string;
                _version: string;
                "_xsi:schemaLocation": string;
                ServiceIdentification: {
                    Title: {
                        __prefix: string;
                        __text?: string;
                    };
                    Abstract: {
                        __prefix: string;
                        __text?: string;
                    };
                    ServiceType: stringExtension;
                    ServiceTypeVersion: stringExtension;
                };
                ServiceProvider: {
                    ProviderName: stringExtension;
                    ProviderSite: {
                        __prefix: string;
                        "_xlink:href": string;
                    };
                    ServiceContact: unknown;
                };
                OperationsMetadata: {
                    Operation: Operation[];
                };
                ProcessOfferings: {
                    Process: ProcessBrief[];
                };
                Languages: {
                    Default: Language;
                    Supported: Language;
                };
            }
        }
        interface Operation {
            _name: string;
        }
        interface ProcessBrief {
            Identifier: stringExtension;
            Title: stringExtension;
            Abstract: stringExtension;
            "_wps:processVersion": string;
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
                "_xmlns:xs": string;
                "_xmlns:ows": string;
                "_xmlns:wps": string;
                "_xmlns:xlink": string;
                "_xmlns:xsi": string;
                "_xml:lang": string;
                _service: string;
                _version: string;
                "_xsi:schemaLocation": string;
                ProcessDescription: {
                    "_wps:processVersion": string;
                    _statusSupported: string;
                    _storeSupported: string;
                    Identifier: stringExtension;
                    Title: stringExtension;
                    Abstract: stringExtension;
                    DataInputs: {
                        Input: Input[];
                    };
                    ProcessOutputs: {
                        Output: Output;
                    };
                };
            }
        }
        interface Input {
            _maxOccurs: string;
            _minOccurs: string;
            Identifier: stringExtension;
            Title: stringExtension;
            Abstract: stringExtension;
            ComplexData?: ComplexData;
            LiteralData?: LiteralData;
        }
        interface ComplexData {
            _maximumMegabytes?: string;
            Default: {
                Format: Format;
            };
            Supported: {
                Format: Format[];
            };
        }

        interface Format {
            MimeType: string;
        }

        interface LiteralData {
            DataType?: stringExtension;
            AnyValue?: unknown;
            AllowedValues?: {
                Value: stringExtension[];
            };
        }

        interface Output {
            Identifier: stringExtension;
            Title: stringExtension;
            ComplexOutput: {
                Default: {
                    Format: Format;
                };
                Supported: {
                    Format: Format[];
                };
            };
        }
    }
}
