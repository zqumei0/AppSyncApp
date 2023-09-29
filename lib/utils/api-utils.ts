import {
  BaseResolverProps,
  MappingTemplate,
  PrimaryKey,
  Values,
} from 'aws-cdk-lib/aws-appsync';

export const APPSYNC_GRAPHQL_SCHEMA_FILE: string = 'resources/schema.graphql';

const APPSYNC_DEFAULT_RESPONSE_MAPPING: string = '$util.toJson($ctx.result)';

export const DYNAMODB_GRAPHQL_FIELDS: BaseResolverProps[] = [
  {
    typeName: 'Query',
    fieldName: 'getFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbGetItem('reservationId', 'reservationId'),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
  },
  {
    typeName: 'Mutation',
    fieldName: 'createFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
      PrimaryKey.partition('reservationId').auto(),
      Values.projecting('newFlightReservation'),
    ),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
  },
  {
    typeName: 'Mutation',
    fieldName: 'modifyFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbPutItem(
      PrimaryKey.partition('reservationId').is('reservationId'),
      Values.projecting('newFlightInformation'),
    ),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
  },
  {
    typeName: 'Mutation',
    fieldName: 'deleteFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbDeleteItem('reservationId', 'reservationId'),
    responseMappingTemplate: MappingTemplate.fromString(APPSYNC_DEFAULT_RESPONSE_MAPPING),
  },
];
