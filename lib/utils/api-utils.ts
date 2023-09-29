import {
  BaseResolverProps,
  MappingTemplate,
} from 'aws-cdk-lib/aws-appsync';

export const APPSYNC_GRAPHQL_SCHEMA_FILE: string = 'resources/schema.graphql';

export const DYNAMODB_GRAPHQL_FIELDS: BaseResolverProps[] = [
  {
    typeName: 'Query',
    fieldName: 'getFlightReservation',
    requestMappingTemplate: MappingTemplate.dynamoDbGetItem('reservationId', 'reservationId'),
    responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
  },
];