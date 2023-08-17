import { Client } from '@twilio/conversations';

const updateMedcaseToken = (client: Client) => (token: string) => client.updateToken(token);

export default updateMedcaseToken;
