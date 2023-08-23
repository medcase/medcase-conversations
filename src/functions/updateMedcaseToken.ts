import { Client } from '@twilio/conversations';

const updateMedcaseToken = (client: Client) => async (token: string) => {
  await client.updateToken(token);
};

export default updateMedcaseToken;
