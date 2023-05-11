export enum ResponseMessage {
    SUCCESS = `Success`,
    SKU_DOES_NOT_EXIST = `Sku does not exists`,
}

// some code enums for sending response code in api response
export enum ResponseCode {
    SUCCESS = 200,
    BAD_REQUEST = 400
}

export enum LoggerMessages {
    API_CALLED = `Api Has Been Called.`,
}

export enum NodeEnv {
    TEST = `test`,
    DEVELOPMENT = `development`
}
