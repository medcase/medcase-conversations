import { Client } from '@twilio/conversations';
import { MedcaseUser } from '../types';

const userDetails = (client: Client): MedcaseUser => ({
  identity: client.user.identity,
});

export default userDetails;
