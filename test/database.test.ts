import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { DatabaseStack } from '../lib/database';
import { AwsResourceType } from './utils/test-utils';


describe('test creation of dynamodb table', () => {
  test('should create dynamodb table', () => {
    const app = new App();
    const databaseStack = new DatabaseStack(app, 'Test-Stack', {
      disambiguator: 'Test-App',
      stackName: 'Test-Stack',
    });
    const result = Template.fromStack(databaseStack);

    result.resourceCountIs(AwsResourceType.DYNAMODB, 1);
    result.hasResourceProperties(AwsResourceType.DYNAMODB, {
      TableName: 'Test-App-Table',
    });

    result.resourceCountIs(AwsResourceType.LAMBDA_FUNCTION, 2);
  });
});