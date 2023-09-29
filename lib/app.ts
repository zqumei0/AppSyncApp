import { App } from 'aws-cdk-lib';
import { DatabaseStack } from './database';
import { ApiStack } from './api';
import {
  API_STACK_NAME,
  APPLICATION_NAME,
  DATABASE_STACK_NAME,
} from './constants';

const app = new App();

const databaseStack = new DatabaseStack(app, DATABASE_STACK_NAME, {
  disambiguator: APPLICATION_NAME,
  stackName: DATABASE_STACK_NAME,
});
const apiStack = new ApiStack(app, API_STACK_NAME, {
  disambiguator: APPLICATION_NAME,
  reservationTable: databaseStack.reservationTable,
  stackName: API_STACK_NAME,
});

apiStack.addDependency(databaseStack);