import { app, InvocationContext } from "@azure/functions";
import { SbQueueNames } from "../global/consts";

export async function msAzfuncQueuePoc_step3(message: unknown, context: InvocationContext): Promise<void> {
    context.log('Service bus queue function processed message:', message);
    // This is the final step, so we just log the message and don't send a new message
}

app.serviceBusQueue('ms-azfunc-poc-step3', {
    connection: 'sbsandboxmb_SERVICEBUS',
    queueName: SbQueueNames.Step3,
    handler: msAzfuncQueuePoc_step3
});
