import {
  App,
  Stack,
} from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ApiStack } from '../lib/api';
import { AwsResourceType } from './utils/test-utils';
import {
  Table,
  AttributeType,
} from 'aws-cdk-lib/aws-dynamodb';


describe('test creation of api layer', () => {
  test('should create appsync endpoint with resolvers', () => {
    const app = new App();
    const dummyStack = new Stack(app, 'Dummy-Stack');
    const dummyDatabase = new Table(dummyStack, 'Test-Table', {
      tableName: 'Test-Table',
      partitionKey: { name: 'id', type: AttributeType.STRING },
    });

    const apiStack = new ApiStack(app, 'Test-Stack', {
      disambiguator: 'Test-App',
      reservationTable: dummyDatabase,
      stackName: 'Test-Stack',
    });
    const result = Template.fromStack(apiStack);

    result.resourceCountIs(AwsResourceType.APPSYNC_API, 1);
    result.hasResourceProperties(AwsResourceType.APPSYNC_API, {
      Name: 'Test-App-AppSyncApi',
    });

    result.resourceCountIs(AwsResourceType.APPSYNC_DATASOURCE, 2);
    result.hasResourceProperties(AwsResourceType.APPSYNC_DATASOURCE, {
      Name: 'TestAppDynamoDbDataSource',
      Type: 'AMAZON_DYNAMODB',
    });
    result.hasResourceProperties(AwsResourceType.APPSYNC_DATASOURCE, {
      Name: 'TestAppSqsDataSource',
      Type: 'HTTP',
    });

    result.resourceCountIs(AwsResourceType.APPSYNC_RESOLVER, 5);

    result.resourceCountIs(AwsResourceType.LAMBDA_FUNCTION, 1);
    result.hasResourceProperties(AwsResourceType.LAMBDA_FUNCTION, {
      FunctionName: 'Test-App-ReportLambdaFunction',
      Runtime: 'java17',
      Timeout: 300,
      Handler: 'com.example.appsyncapp.handlers.GenerateFlightManifestHandler::handleRequest',
    });

    result.resourceCountIs(AwsResourceType.S3_BUCKET, 1);
    result.hasResourceProperties(AwsResourceType.S3_BUCKET, {
      BucketName: 'test-app-reportbucket',
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          {
            ServerSideEncryptionByDefault: {
              SSEAlgorithm: 'AES256',
            },
          },
        ],
      },
    });

    result.resourceCountIs(AwsResourceType.SQS_QUEUE, 2);
    result.hasResourceProperties(AwsResourceType.SQS_QUEUE, {
      QueueName: 'Test-App-ReportQueue',
      VisibilityTimeout: 300,
      SqsManagedSseEnabled: true,
    });
    result.hasResourceProperties(AwsResourceType.SQS_QUEUE, {
      QueueName: 'Test-App-DeadLetterQueue',
      SqsManagedSseEnabled: true,
    });
  });
});