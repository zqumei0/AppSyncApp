import {
  BaseResolverProps,
  MappingTemplate,
  PrimaryKey,
  Values,
} from 'aws-cdk-lib/aws-appsync';

export const APPSYNC_GRAPHQL_SCHEMA_FILE: string = 'resources/schema.graphql';

export const APPSYNC_DEFAULT_RESPONSE_MAPPING: string = '$util.toJson($ctx.result)';

export const APPSYNC_REQUEST_TEMPLATE_PATH: string = 'resources/resolver-mappings/request-templates';

export const APPSYNC_RESPONSE_TEMPLATE_PATH: string = 'resources/resolver-mappings/response-templates';

export enum AppsyncFieldTypes {
  QUERY = 'Query',
  MUTATION = 'Mutation',
  SUBSCRIPTION = 'Subscription',
}

export const DYNAMODB_GRAPHQL_FIELDS: BaseResolverProps[] = [
  {
    typeName: AppsyncFieldTypes.QUERY,
    fieldName: 'getFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbGetItem('reservationId', 'reservationId'),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
  },
  {
    typeName: AppsyncFieldTypes.MUTATION,
    fieldName: 'createFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
      PrimaryKey.partition('reservationId').auto(),
      Values.projecting('newFlightReservation'),
    ),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
  },
  {
    typeName: AppsyncFieldTypes.MUTATION,
    fieldName: 'modifyFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
      PrimaryKey.partition('reservationId').is('reservationId'),
      Values.projecting('newFlightInformation'),
    ),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
  },
  {
    typeName: AppsyncFieldTypes.MUTATION,
    fieldName: 'deleteFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem('reservationId', 'reservationId'),
    responseMappingTemplate: MappingTemplate.fromString(APPSYNC_DEFAULT_RESPONSE_MAPPING),
  },
];

// export const SQS_GRAPHQL_FIELDS: BaseResolverProps[] = [
//   {
//     typeName: 'Mutation',
//     fieldName: 'generateFlightManifest',
//     requestMappingTemplate: MappingTemplate.fromString(getHttpSqsResolverMapping()),
//     responseMappingTemplate: MappingTemplate.fromFile(resolve(__dirname, APPSYNC_RESPONSE_TEMPLATE_PATH, 'http-sqs-resolver.vtl')),
//   },
// ];

export function getHttpSqsResolverMapping(sqsAccountId: string, awsSqsQueueName: string): string {
  return `{
    "version": "2018-05-29",
    "method": "POST",
    "params": {
      "body": "Action=SendMessage&MessageBody=$util.urlEncode($ctx.args.message)&Version=2012-11-05",
      "headers": {
        "Content-Type" : "application/x-www-form-urlencoded"
      },
    },
    "resourcePath": "/${sqsAccountId}/${awsSqsQueueName}/"
  }`;
}