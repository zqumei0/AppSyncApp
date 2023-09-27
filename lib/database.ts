import {
  App,
  Stack,
  StackProps,
} from 'aws-cdk-lib';

export interface DatabaseStackProps extends StackProps {
  readonly disambiguator: string;
}

export class DatabaseStack extends Stack {
  readonly props: DatabaseStackProps;

  constructor(scope: App, id: string, props: DatabaseStackProps) {
    super(scope, id, props);
    this.props = props;
  }
}