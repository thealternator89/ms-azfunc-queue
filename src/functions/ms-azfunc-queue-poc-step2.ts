import { app, InvocationContext } from "@azure/functions";
import { FunctionSteps, SbQueueNames } from "../global/consts";
import { QueueUtils } from "../utils/queue-utils";
import { isStep2Message, Step2Message, Step3Message } from "../models/messages";

export async function msAzfuncQueuePoc_step2(message: unknown, context: InvocationContext): Promise<void> {
    if (!isStep2Message(message)) {
        throw new Error('Invalid message format: Expected Step2Message');
    }
    context.log('Received message:', message);

    // Simulate some work
    const step3Data = await doWork(message, context);

    // Send the message to the next step
    await sendStep3Message(message, step3Data, context);
}

async function doWork(message: Step2Message, context: InvocationContext): Promise<string> {
    context.log(`Processing data: ${message.step2.someData}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 'Step 3 data';
}

async function sendStep3Message(message: Step2Message, step3Data: string, context: InvocationContext) {
    const step3Message: Step3Message = {
        ...message,
        completedStages: message.completedStages | FunctionSteps.Step2,
        step3: {
            someData: step3Data
        }
    }
    await QueueUtils.sendToQueue(SbQueueNames.Step3, step3Message, context);
}

app.serviceBusQueue('ms-azfunc-poc-step2', {
    connection: 'sbsandboxmb_SERVICEBUS',
    queueName: SbQueueNames.Step2,
    handler: msAzfuncQueuePoc_step2
});
