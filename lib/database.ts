import {
  App,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import {
  AttributeType,
  Table,
  TableEncryption,
} from 'aws-cdk-lib/aws-dynamodb';
import {
  Code,
  Function as LFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import {
  LAMBDA_BASE_PATH,
  LAMBDA_TRIGGER_PATH,
} from './constants';
import { resolve } from 'path';
import { Trigger } from 'aws-cdk-lib/triggers';

export interface DatabaseStackProps extends StackProps {
  readonly disambiguator: string;
}

export class DatabaseStack extends Stack {
  readonly props: DatabaseStackProps;

  readonly databaseTable: Table;

  constructor(scope: App, id: string, props: DatabaseStackProps) {
    super(scope, id, props);
    this.props = props;

    this.databaseTable = this.createTable();
    this.populateDatabase();
  }

  private createTable(): Table {
    const tableName = `${this.props.disambiguator}-Table`;

    return new Table(this, tableName, {
      encryption: TableEncryption.DEFAULT,
      partitionKey: { name: 'reservationId', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName,
    });
  }

  private populateDatabase(): void {
    const triggerNamePrefix = `${this.props.disambiguator}-Trigger`;
    const packageName = 'appsyncapp.zip';

    const populateDatabaseFunction = new LFunction(this, `${triggerNamePrefix}Function`, {
      code: Code.fromAsset(resolve(__dirname, LAMBDA_BASE_PATH, LAMBDA_TRIGGER_PATH, packageName)),
      environment: {
        DATA_TABLE: this.databaseTable.tableName,
        DATA_FILE: 'MOCK_DATA.json',
      },
      handler: 'com.example.appsyncapp.App::handler',
      runtime: Runtime.JAVA_17,
      timeout: Duration.minutes(5),
    });
    this.databaseTable.grantWriteData(populateDatabaseFunction);

    new Trigger(this, triggerNamePrefix, {
      executeAfter: [this],
      executeOnHandlerChange: false,
      handler: populateDatabaseFunction,
    });
  }
}