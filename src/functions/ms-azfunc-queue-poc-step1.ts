import { app, InvocationContext } from "@azure/functions";
import { FunctionSteps, SbQueueNames } from "../global/consts";
import { QueueUtils } from "../utils/queue-utils";
import { isStep1Message, Step1Message, Step2Message } from "../models/messages";

export async function msAzfuncQueuePoc_step1(message: unknown, context: InvocationContext): Promise<void> {
    if (!isStep1Message(message)) {
        throw new Error('Invalid message format: Expected Step1Message');
    }
    context.log('Received message:', message);

    // Simulate some work
    const step2Data = await doWork(message, context);

    // Send the message to the next step
    await sendStep2Message(message, step2Data, context);
}

async function doWork(message: Step1Message, context: InvocationContext): Promise<string> {
    context.log(`Processing data: ${message.step1.someData}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Step 2 data';
}

async function sendStep2Message(message: Step1Message, step2Data: string, context: InvocationContext) {
    const step2Message: Step2Message = {
        ...message,
        completedStages: message.completedStages | FunctionSteps.Step1,
        step2: {
            someData: step2Data
        }
    }
    await QueueUtils.sendToQueue(SbQueueNames.Step2, step2Message, context);
}

app.serviceBusQueue('ms-azfunc-poc-step1', {
    connection: 'sbsandboxmb_SERVICEBUS',
    queueName: SbQueueNames.Step1,
    handler: msAzfuncQueuePoc_step1
});
