import {
  App,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  GraphqlApi,
  SchemaFile,
} from 'aws-cdk-lib/aws-appsync';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { resolve } from 'path';
import {
  APPSYNC_GRAPHQL_SCHEMA_FILE,
  DYNAMODB_GRAPHQL_FIELDS,
} from './utils/api-utils';

export interface ApiStackProps extends StackProps {
  readonly disambiguator: string;
  readonly reservationTable: Table;
}

export class ApiStack extends Stack {
  readonly graphqlApi: GraphqlApi;

  readonly props: ApiStackProps;

  constructor(scope: App, id: string, props: ApiStackProps) {
    super(scope, id, props);
    this.props = props;

    this.graphqlApi = this.createAppSyncApi();
    this.configureDynamoDbResolvers();
  }

  private createAppSyncApi(): GraphqlApi {
    const graphQlName = `${this.props.disambiguator}-AppSyncApi`;
    return new GraphqlApi(this, `${this.props.disambiguator}-AppSyncApi`, {
      name: graphQlName,
      schema: SchemaFile.fromAsset(resolve(__dirname, APPSYNC_GRAPHQL_SCHEMA_FILE)),
    });
  }

  private configureDynamoDbResolvers(): void {
    const dynamoDbDataSource = this.graphqlApi.addDynamoDbDataSource(
      `${this.props.disambiguator}-DynamoDbDataSource`,
      this.props.reservationTable,
    );

    DYNAMODB_GRAPHQL_FIELDS.forEach((field) => {
      dynamoDbDataSource.createResolver(
        `${this.props.disambiguator}-${field.fieldName}-Resolver`,
        field,
      );
    });
  }

  private configureAppSyncResolvers(): void {
    // GRAPHQL_FIELDS.forEach(({ typeName, fieldName }) => {});
  }
}