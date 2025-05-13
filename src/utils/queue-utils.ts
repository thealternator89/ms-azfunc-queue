import { ServiceBusClient } from "@azure/service-bus";
import { InvocationContext } from "@azure/functions";

export class QueueUtils {
    public static async sendToQueue(queueName: string, message: unknown, context: InvocationContext): Promise<void> {
        const client = new ServiceBusClient(process.env.sbsandboxmb_SERVICEBUS || '');
        const sender = client.createSender(queueName);
        
        try {
            await sender.sendMessages({
                body: message
            });
            context.log(`Successfully forwarded message to ${queueName} queue`);
        } catch (error) {
            context.error(`Error forwarding message to ${queueName} queue:`, error);
            throw error;
        } finally {
            await sender.close();
            await client.close();
        }
    }
}
