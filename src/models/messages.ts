export interface BaseMessage {
    idempotencyId: string;
    completedStages: number | undefined; // A bitwise flag to represent which steps have been completed
}

export interface Step1Message extends BaseMessage {
    step1: {
        someData: string;
    }
}
export interface Step2Message extends BaseMessage {
    step2: {
        someData: string;
    }
}

export interface Step3Message extends BaseMessage {
    step3: {
        someData: string;
    }
}

export function isStep1Message(message: unknown): message is Step1Message {
    return (
        isBaseMessage(message) &&
        'step1' in message &&
        typeof (message as Step1Message).step1 === 'object' &&
        typeof (message as Step1Message).step1.someData === 'string'
    );
}

export function isStep2Message(message: unknown): message is Step2Message {
    return (
        isBaseMessage(message) &&
        'step2' in message &&
        typeof (message as Step2Message).step2 === 'object' &&
        typeof (message as Step2Message).step2.someData === 'string'
    );
}

export function isStep3Message(message: unknown): message is Step3Message {
    return (
        isBaseMessage(message) &&
        'step3' in message &&
        typeof (message as Step3Message).step3 === 'object' &&
        typeof (message as Step3Message).step3.someData === 'string'
    );
}

function isBaseMessage(message: unknown): message is BaseMessage {
    if (!message || typeof message !== 'object') return false;
    
    const msg = message as Record<string, unknown>;
    
    return (
        typeof msg.idempotencyId === 'string' &&
        typeof msg.completedStages === 'number'
    );
}
