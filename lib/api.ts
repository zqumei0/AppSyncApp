import {
  App,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  GraphqlApi,
  MappingTemplate,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import {
  Code,
  EventSourceMapping,
  Function as LFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import {
  Bucket,
  BucketEncryption,
} from 'aws-cdk-lib/aws-s3';
import {
  Queue,
  QueueEncryption,
} from 'aws-cdk-lib/aws-sqs';
import { resolve } from 'path';
import {
  LAMBDA_BASE_PATH,
  LAMBDA_RESOLVER_PATH,
} from './constants';
import {
  AppsyncFieldTypes,
  APPSYNC_GRAPHQL_SCHEMA_FILE,
  APPSYNC_RESPONSE_TEMPLATE_PATH,
  DYNAMODB_GRAPHQL_FIELDS,
  getHttpSqsResolverMapping,
} from './utils/api-utils';

export interface ApiStackProps extends StackProps {
  readonly disambiguator: string;
  readonly reservationTable: Table;
}

export class ApiStack extends Stack {
  readonly graphqlApi: GraphqlApi;

  private reportBucket: Bucket;

  private reportQueue: Queue;

  readonly props: ApiStackProps;

  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props);
    this.props = props;

    this.createReportInfrastructure();

    this.graphqlApi = this.createAppSyncApi();
    this.configureDynamoDbResolver();
    this.configureSqsResolver();
    this.configureReportBackend();
  }

  private createReportInfrastructure(): void {
    const reportQueueName = `${this.props.disambiguator}-ReportQueue`;
    const deadLetterQueueName = `${this.props.disambiguator}-DeadLetterQueue`;
    const reportBucketName = `${this.props.disambiguator.toLowerCase()}-reportbucket`;
    const maxNumberofRetries = 3;
    const timeBeforeRetry = Duration.minutes(5);

    const deadLetterQueue = new Queue(this, deadLetterQueueName, {
      encryption: QueueEncryption.SQS_MANAGED,
      queueName: deadLetterQueueName,
    });

    this.reportQueue = new Queue(this, reportQueueName, {
      encryption: QueueEncryption.SQS_MANAGED,
      queueName: reportQueueName,
      visibilityTimeout: timeBeforeRetry,
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: maxNumberofRetries,
      },
    });

    this.reportBucket = new Bucket(this, reportBucketName, {
      bucketName: reportBucketName,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }

  private createAppSyncApi(): GraphqlApi {
    const graphQlName = `${this.props.disambiguator}-AppSyncApi`;

    return new GraphqlApi(this, graphQlName, {
      name: graphQlName,
      schema: SchemaFile.fromAsset(resolve(__dirname, APPSYNC_GRAPHQL_SCHEMA_FILE)),
    });
  }

  private configureDynamoDbResolver(): void {
    const dynamoDbDataSource = this.graphqlApi.addDynamoDbDataSource(
      `${this.props.disambiguator}-DynamoDbDataSource`,
      this.props.reservationTable,
    );

    DYNAMODB_GRAPHQL_FIELDS.forEach((field) => {
      dynamoDbDataSource.createResolver(`${this.props.disambiguator}-${field.fieldName}-Resolver`, field);
    });
  }

  private configureSqsResolver(): void {
    const sqsEndpoint = 'https://sqs.us-east-1.amazonaws.com';

    const sqsDataSource = this.graphqlApi.addHttpDataSource(
      `${this.props.disambiguator}-SqsDataSource`,
      sqsEndpoint,
      {
        authorizationConfig: {
          signingRegion: this.region,
          signingServiceName: 'sqs',
        },
      },
    );
    sqsDataSource.node.addDependency(this.reportQueue);
    this.reportQueue.grantSendMessages(sqsDataSource.grantPrincipal);

    // TODO: This is a workaround for the fact that appsync does not support SQS resolver
    // TODO: This should be refactored if possible for multiple fields once file placeholder replacement is figured out.
    sqsDataSource.createResolver(`${this.props.disambiguator}-generateFlightManifest-Resolver`, {
      typeName: AppsyncFieldTypes.MUTATION,
      fieldName: 'generateFlightManifest',
      requestMappingTemplate: MappingTemplate.fromString(getHttpSqsResolverMapping(this.account, this.reportQueue.queueName)),
      responseMappingTemplate: MappingTemplate.fromFile(resolve(__dirname, APPSYNC_RESPONSE_TEMPLATE_PATH, 'http-sqs-resolver.vtl')),
    });
  }

  private configureReportBackend(): void {
    const packageName = 'appsyncresolvers.zip';
    const functionName = `${this.props.disambiguator}-ReportLambdaFunction`;
    const resolverFunctionEntryPoint = 'com.example.appsyncapp.handlers.GenerateFlightManifestHandler::handleRequest';
    const maxProcessingTime = Duration.minutes(5);

    const reportLambdaFunction = new LFunction(this, functionName, {
      code: Code.fromAsset(resolve(__dirname, LAMBDA_BASE_PATH, LAMBDA_RESOLVER_PATH, packageName)),
      environment: {
        REPORT_BUCKET: this.reportBucket.bucketName,
        REPORT_QUEUE: this.reportQueue.queueName,
      },
      functionName,
      handler: resolverFunctionEntryPoint,
      runtime: Runtime.JAVA_17,
      timeout: maxProcessingTime,
    });
    this.reportBucket.grantReadWrite(reportLambdaFunction);
    this.reportQueue.grantConsumeMessages(reportLambdaFunction);

    new EventSourceMapping(this, `${this.props.disambiguator}-ReportEventSourceMapping`, {
      target: reportLambdaFunction,
      eventSourceArn: this.reportQueue.queueArn,
    });
  }
}
